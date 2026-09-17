import Document from '../models/Document.js';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (studentId, file, documentType) => {
  if (!file) {
    const error = new Error('No file uploaded.');
    error.statusCode = 400;
    throw error;
  }

  const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
  const fileUrl = `/uploads/${file.filename}`;

  const doc = new Document({
    studentId,
    fileName: file.originalname,
    originalName: file.originalname,
    documentType: documentType || 'Academic Transcript',
    fileUrl,
    fileSize,
    mimeType: file.mimetype,
    status: 'VERIFIED',
    uploadedAt: new Date(),
  });

  return await doc.save();
};

export const getDocuments = async (filter = {}) => {
  return await Document.find(filter).sort({ uploadedAt: -1 });
};

export const deleteDocument = async (id, studentId, role) => {
  const query = { _id: id };
  if (role === 'STUDENT') {
    query.studentId = studentId;
  }

  const doc = await Document.findOne(query);
  if (!doc) {
    const error = new Error('Document record not found or access unauthorized.');
    error.statusCode = 404;
    throw error;
  }

  // Attempt to remove physical file if it exists
  try {
    const filePath = path.join(process.cwd(), doc.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Could not delete file from disk: ${err.message}`);
  }

  await Document.findByIdAndDelete(id);
  return { message: 'Document deleted successfully', id };
};

export default {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
