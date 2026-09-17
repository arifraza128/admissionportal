import mongoose from 'mongoose';

/**
 * Document Schema definition for universityDB.documents collection
 * Manages uploaded identity proofs, academic transcripts, and verification states.
 */
export const DocumentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID reference is required'],
    },
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      trim: true,
      enum: {
        values: [
          'AADHAAR',
          'MARKSHEET',
          'TRANSFER_CERTIFICATE',
          'PHOTO',
          'OTHER',
          'Academic Transcript',
          'Government Identity Proof',
          'Recommendation Letter',
          'Personal Essay / SOP',
        ],
        message: '{VALUE} is not a recognized document category',
      },
      default: 'MARKSHEET',
    },
    fileName: {
      type: String,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL path is required'],
      trim: true,
    },
    fileSize: {
      type: mongoose.Schema.Types.Mixed, // Number (bytes) or string (e.g. "1.2 MB")
    },
    mimeType: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'VERIFIED', 'REJECTED'],
        message: '{VALUE} is not a valid document status',
      },
      default: 'PENDING',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    collection: 'documents',
    timestamps: true,
  }
);

// Performance Indexes
DocumentSchema.index({ studentId: 1 });
DocumentSchema.index({ status: 1 });

export const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
export default Document;
