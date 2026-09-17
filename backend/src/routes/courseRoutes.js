import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), createCourse);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'FACULTY'), updateCourse);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteCourse);

export default router;
