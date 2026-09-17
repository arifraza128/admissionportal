import express from 'express';
import { getTimetable } from '../controllers/timetableController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getTimetable);

export default router;
