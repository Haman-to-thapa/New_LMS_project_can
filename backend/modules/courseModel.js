import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String },
  category: { type: String, required: true },
  courseLevel: { type: String, enum: ["Beginner", "Medium", "Advance"] },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  coursePrice: {type:Number},
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Changed from array to single object
  isPublished: { type: Boolean, default: false }
}, { timestamps:true});

export const Course = mongoose.model("Course", courseSchema);
