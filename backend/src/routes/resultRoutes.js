import express from 'express';
import {
  getResults,
  createResult,
  updateResult,
} from '../controllers/resultController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getResults);
router.post('/', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), createResult);
router.put('/:id', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), updateResult);

export default router;
