import express from 'express';
import { register, login, getUsers } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', authenticateToken, authorizeRoles('ADMIN', 'ADMISSION_OFFICER'), getUsers);

export default router;
