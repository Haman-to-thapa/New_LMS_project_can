import { Course } from "../../modules/courseModel.js";
import { Lecture } from "../../modules/lectureModels.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res
        .status(404)
        .json({ message: "Course title and category are required" });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create course" });
  }
};
// get publishedCourse
export const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl"
    });

    if (!courses) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ courses });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch published courses"
    });
  }
};




export const getCreatorAllCourse = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res
        .status(401)
        .json({ courses: [], message: "No courses available" });
    }

    return res.status(201).json({ courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Failed" });
  }
};

export const editCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    const courseId = req.params.courseId;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "course id not found" });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      // upload a thumbnail on cloudinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ course, message: "Course updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(401).json({ message: "course not found" });
    }

    return res.status(201).json({ course, message: "successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get course by id" });
  }
};

// lecture controller added
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(401).json({ message: "lecture title is requires" });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.lectures.push(lecture._id);
    await course.save();

    return res
      .status(201)
      .json({ lecture, message: "Lecture created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ lectures: course.lectures });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Get Server Error" }); // typo "messgae" also fixed
  }
};


export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }
    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;

    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;


    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // ensure the courese still has the lecture id if it was nto already
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get lectures" });
  }
};

export const removeLecture = async (req, res) => {
  try {
     const {lectureId} = req.params;

     const lecture = await Lecture.findByIdAndDelete(lectureId);
     if(!lecture) {
      return res.status(404).json({
        message:"Lecture not found!"
      })
     }

     // delete the lecture from cloudinary as well
     if(lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId)
     }

     // Remove the lecture refrenece from the associated course
     await Course.updateOne({lectures:lectureId}, {$pull: {lectures: lectureId}})
// pulls method do single elemnet find and delete

return res.status(201).json({
      lecture,
      message:"Delete successfully"})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Failed to remove lecture"})
  }
}

export const getLectureById = async(req, res) => {
  try {
    const {lectureId} = req.params;

    const lecture = await Lecture.findById(lectureId);
    if(!lecture) {
      return res.status(404).json({
        message:"Lecture not get"
      })
    }
    return res.status(201).json({lecture})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"server Error"})
  }
}

// publish and unPublish course logic
export const togglePublishCourese = async (req, res) => {
  try {
    const {courseId} = req.params;
    const {publish} = req.query;

    const course = await Course.findById(courseId);
    if(!course) {
      return res.status(404).json({
        message:"Course not found!"
      })
    }
    //Publish status based on the query paramater
    course.isPublished = publish === "true";
    await course.save()

    const statusMessage = course.isPublished ? "Published" : "unPublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Failed to update status" });
  }
}

// Remove a course and its associated lectures
export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!"
      });
    }

    // Check if the user is the creator of the course
    if (course.creator.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this course"
      });
    }

    // Delete the course thumbnail from cloudinary if it exists
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // Delete all lectures associated with the course
    if (course.lectures && course.lectures.length > 0) {
      // Get all lectures
      const lectures = await Lecture.find({ _id: { $in: course.lectures } });

      // Delete each lecture and its video
      for (const lecture of lectures) {
        if (lecture.publicId) {
          await deleteVideoFromCloudinary(lecture.publicId);
        }
        await Lecture.findByIdAndDelete(lecture._id);
      }
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      message: "Course and all associated lectures deleted successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete course" });
  }
}