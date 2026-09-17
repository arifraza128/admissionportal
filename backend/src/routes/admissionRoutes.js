import express from 'express';
import {
  apply,
  getMyApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
} from '../controllers/admissionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student routes
router.post('/apply', authenticateToken, authorizeRoles('STUDENT'), apply);
router.get('/my-application', authenticateToken, authorizeRoles('STUDENT'), getMyApplication);

// Admission Officer & Admin routes
router.get('/applications', authenticateToken, authorizeRoles('ADMISSION_OFFICER', 'ADMIN'), getApplications);
router.get('/applications/:id', authenticateToken, getApplicationById);
router.put('/applications/:id/approve', authenticateToken, authorizeRoles('ADMISSION_OFFICER', 'ADMIN'), approveApplication);
router.put('/applications/:id/reject', authenticateToken, authorizeRoles('ADMISSION_OFFICER', 'ADMIN'), rejectApplication);

export default router;
