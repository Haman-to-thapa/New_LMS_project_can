import { Course } from "../../modules/courseModel.js";
import { CourseProgress } from "../../modules/courseProgress.js";


export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Step 1: Try to fetch course progress and populate course details
    let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

    // If progress exists, use populated courseId as courseDetails
    let courseDetails = courseProgress?.courseId;

    // If not found, manually fetch course details
    if (!courseProgress) {
      courseDetails = await Course.findById(courseId);
      if (!courseDetails) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // Step 3: Return user's progress
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return res.status(500).json({
      error: "Something went wrong while fetching course progress",
    });
  }
};


export const updateLectureProgress = async (req,res) => {
  try {
  const {courseId, lectureId} = req.params;
  const userId = req.id;

  // fetch or create course progress
  let courseProgress = await CourseProgress.findOne({ courseId, userId });


  if(!courseProgress) {
   // if no progress exist , create a new record
   courseProgress = new CourseProgress({
    userId,
    courseId,
    completed:false,
    lectureProgress:[],
   })
  }
  // find the lecture progress in the course progress
  const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lecture) => lecture.lectureId.toString() === lectureId
  );

  if(lectureIndex !== -1){
    // if lecture already exist , update its status
    courseProgress.lectureProgress[lectureIndex].viewed = true;
  } else {
    // add new lecture progress
    courseProgress.lectureProgress.push({
      lectureId, viewed:true,
    })
  }
// if all lecure is complete

const viewedLectures = courseProgress.lectureProgress.filter((lecture) => lecture.viewed);


const course = await Course.findById(courseId);
if (course && viewedLectures.length === course.lectures.length) {
  courseProgress.completed = true;
}

await courseProgress.save();

return res.status(200).json({
  message: "Lecture progress update successFully"
})

  } catch (error) {
    console.error("Error updating lecture progress:", error);
    return res.status(500).json({
      error: "Something went wrong while updating lecture progress",
    });
  }
}



export const markAsCompleted = async (req, res) => {
  try {

    const {courseId} = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({courseId, userId});
    if(!courseProgress) {
      return res.status(404).json({message:"Course Progress not found"})
    }

    courseProgress.lectureProgress = courseProgress.lectureProgress.map((lecture) => ({
      ...lecture,
      viewed: true,
    }));

    courseProgress.completed = true;
    await courseProgress.save()
    return res.status(200).json({message:"Course marked as completed"})

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went wrong while marking course as completed" });
  }
}


export const markAsInCompleted = async (req, res) => {
  try {

    const {courseId} = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({courseId,userId})

    if(!courseProgress) {
      return res.status(404).json({
        message: "Course progress not found"
      })
    }

    courseProgress.completed = false;
    await courseProgress.save()
    return res.status(200).json({ message: "Course marked as incomplete" });


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Something went wrong while marking course as incomplete",
    });
  }
}