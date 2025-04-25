import { Course } from "../../modules/courseModel.js";
import { Lecture } from "../../modules/lectureModels.js";
import { User } from "../../modules/userModel.js";
import { CoursePurchase } from "../../modules/purchaseCourseModel.js";
import Stripe from "stripe";

// Check if Stripe API key is available
const stripeApiKey = process.env.STRIPE_SECRET_KEY;
if (!stripeApiKey) {
  console.error("WARNING: Stripe API key is missing. Payment features will not work.");
  console.error("Please set STRIPE_SECRET_KEY in your .env file.");
}

// Initialize Stripe with API key or a placeholder for development
const stripe = stripeApiKey
  ? new Stripe(stripeApiKey)
  : {
      checkout: {
        sessions: {
          create: () => {
            throw new Error("Stripe API key is missing. Please set STRIPE_SECRET_KEY in your .env file.");
          }
        }
      },
      webhooks: {
        constructEvent: () => {
          throw new Error("Stripe API key is missing. Please set STRIPE_SECRET_KEY in your .env file.");
        }
      }
    };

export const createCheckoutSession = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.id;

    // Get course ID from request body
    const { courseId } = req.body;

    console.log("Creating checkout session for course:", courseId, "and user:", userId);

    // Validate inputs
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in."
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Fetch course details from database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if user has already purchased this course
    const existingPurchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed"
    });

    if (existingPurchase) {
      console.log("User has already purchased this course");

      // Return a direct URL to the course progress page
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/course-progress/${courseId}`;

      return res.status(200).json({
        success: true,
        message: "You have already purchased this course",
        url: redirectUrl,
        alreadyPurchased: true
      });
    }

    // Ensure course price is a valid number
    if (isNaN(course.coursePrice) || course.coursePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price"
      });
    }

    // TEMPORARY SOLUTION: Skip Stripe integration and directly mark the course as purchased
    console.log("NOTICE: Using temporary solution without Stripe integration");

    try {
      // Create and save a completed purchase record
      const newPurchase = new CoursePurchase({
        courseId,
        userId,
        amount: course.coursePrice,
        status: "completed", // Mark as completed immediately
        paymentId: "temp_" + Date.now(), // Generate a temporary payment ID
      });

      await newPurchase.save();
      console.log("Purchase record created:", newPurchase._id);

      // Update the user with the enrolled course
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourse: courseId } },
        { new: true }
      );
      console.log("User updated with enrolled course");

      // Update the course with the enrolled student
      await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { enrolledStudents: userId } },
        { new: true }
      );
      console.log("Course updated with enrolled student");

      console.log("Course purchase completed successfully without Stripe");

      // Return a direct URL to the course progress page
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/course-progress/${courseId}`;

      return res.status(200).json({
        success: true,
        message: "Course purchased successfully",
        url: redirectUrl, // Direct URL to course progress page
      });
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to complete purchase: " + dbError.message
      });
    }
  } catch (error) {
    console.error("Checkout session creation error:", error);

    // Log detailed error information for debugging
    try {
      console.error("Error details:", JSON.stringify(error, null, 2));
    } catch (e) {
      console.error("Error details (non-serializable):", error);
    }

    // Check if it's a Stripe API error
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: `Stripe Error: ${error.message}`,
        code: error.code
      });
    }

    // Check if it's a missing Stripe key error
    if (error.message && error.message.includes('Stripe API key is missing')) {
      return res.status(500).json({
        success: false,
        message: "Stripe API key is missing. Please contact the administrator."
      });
    }

    // Handle MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({
        success: false,
        message: "Database error: " + error.message
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Server Error: " + (error.message || "Unknown error")
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const payloadString = JSON.stringify(req.body, null, 2);
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    const header = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle checkout session completed event
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      // Retrieve the purchase from the database based on the payment ID
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({
        path: "courseId",
      });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Update the amount and status of the purchase
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100; // Convert cents to INR
      }

      purchase.status = "completed";

      // Update lectures to be free for preview
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update the user with the enrolled course
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourse: purchase.courseId._id } },
        { new: true }
      );

      // Update the course with the enrolled student
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      return res.status(200).send("Webhook handled successfully");
    } catch (error) {
      console.error("Error handling the event:", error.message);
      return res.status(500).send(`Error handling event: ${error.message}`);
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
    return res.status(200).send("Event received, but not handled");
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      course,
      purchased: purchased ? true : false,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "getCourseDetailWithPurchaseStatus failed" });
  }
};


export const getAllPurchasedCourse = async (req,res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({status: "completed"}).populate('courseId');

    return res.status(200).json({
      purchasedCourse,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Server error"})
  }
}