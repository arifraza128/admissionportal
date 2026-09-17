import express from 'express';
import {
  register,
  getMyRegistrations,
  dropRegistration,
} from '../controllers/registrationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('STUDENT'), register);
router.get('/my', authenticateToken, authorizeRoles('STUDENT'), getMyRegistrations);
router.delete('/:id', authenticateToken, dropRegistration);

export default router;
