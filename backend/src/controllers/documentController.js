import documentService from '../services/documentService.js';

export const uploadDocument = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const documentType = req.body.documentType;

    let doc;
    if (req.file) {
      doc = await documentService.uploadDocument(studentId, req.file, documentType);
    } else if (req.body.fileName) {
      // Support direct metadata upload
      doc = await documentService.uploadDocument(
        studentId,
        {
          originalname: req.body.fileName,
          filename: req.body.fileName,
          size: 1024 * 1024,
          mimetype: 'application/pdf',
        },
        documentType
      );
    } else {
      return res.status(400).json({ message: 'No file or document data uploaded.' });
    }

    return res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const role = (req.user?.role || '').toUpperCase();
    const filter = {};

    if (role === 'STUDENT') {
      filter.studentId = req.user._id || req.user.id;
    }

    const documents = await documentService.getDocuments(filter);
    return res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const role = (req.user?.role || '').toUpperCase();
    const result = await documentService.deleteDocument(req.params.id, studentId, role);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
