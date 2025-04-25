import express from 'express'
import isAuthenticated from '../server/middleware/isAuthenticated.js';
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from '../server/controllers/courseProgressController.js';

const router = express.Router();

router.route('/:courseId').get(isAuthenticated, getCourseProgress);
router.route('/:courseId/lectures/:lectureId').post(isAuthenticated, updateLectureProgress);
router.route('/:courseId/complete').post(isAuthenticated, markAsCompleted);
router.route('/:courseId/incomplete').post(isAuthenticated, markAsInCompleted);

export default router;
