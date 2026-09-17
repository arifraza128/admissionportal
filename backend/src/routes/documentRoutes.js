import express from 'express';
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from '../controllers/documentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadDocument);
router.get('/', authenticateToken, getDocuments);
router.delete('/:id', authenticateToken, deleteDocument);

export default router;
