

import express from 'express'
import isAuthenticated from '../server/middleware/isAuthenticated.js';
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorAllCourse,
  getLectureById,
  getPublishedCourse,
  removeCourse,
  removeLecture,
  togglePublishCourese
} from '../server/controllers/courseController.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route('/').post(isAuthenticated, createCourse)
router.route('/published-courses').get(isAuthenticated, getPublishedCourse);
router.route('/').get(isAuthenticated,getCreatorAllCourse)
router.route('/:courseId').put(isAuthenticated,upload.single("courseThumbnail"),editCourse)
router.route('/:courseId').get(isAuthenticated,getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture)
router.route('/:courseId/lecture').get(isAuthenticated, getCourseLecture)
router.route("/:courseId/lecture/:lectureId").put(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route('/lecture/:lectureId').get(isAuthenticated, getLectureById)
router.route('/:courseId').patch(isAuthenticated, togglePublishCourese);
router.route('/:courseId').delete(isAuthenticated, removeCourse);



export default router;