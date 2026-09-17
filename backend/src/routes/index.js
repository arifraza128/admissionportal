import express from 'express';
import authRoutes from './authRoutes.js';
import admissionRoutes from './admissionRoutes.js';
import documentRoutes from './documentRoutes.js';
import courseRoutes from './courseRoutes.js';
import registrationRoutes from './registrationRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import resultRoutes from './resultRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admission', admissionRoutes);
router.use('/documents', documentRoutes);
router.use('/courses', courseRoutes);
router.use('/registrations', registrationRoutes);
router.use('/timetable', timetableRoutes);
router.use('/results', resultRoutes);

export default router;
