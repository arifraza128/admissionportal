import Application from '../models/Application.js';

export const applyAdmission = async (studentId, data) => {
  let app = await Application.findOne({ studentId });
  if (app) {
    // Update existing application
    app.applicantName = data.applicantName || app.applicantName;
    app.email = data.email || app.email;
    app.phone = data.phone || app.phone;
    app.dateOfBirth = data.dateOfBirth || app.dateOfBirth;
    app.program = data.program || app.program;
    app.term = data.term || app.term;
    app.highSchool = data.highSchool || app.highSchool;
    app.graduationYear = data.graduationYear || app.graduationYear;
    app.gpaScore = data.gpaScore || app.gpaScore;
    app.satScore = data.satScore || app.satScore;
    app.statementOfPurpose = data.statementOfPurpose || app.statementOfPurpose;
    app.status = 'PENDING';
    app.submissionDate = new Date();
    return await app.save();
  }

  app = new Application({
    studentId,
    applicantName: data.applicantName,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    program: data.program,
    term: data.term || 'Fall 2026',
    status: 'PENDING',
    highSchool: data.highSchool,
    graduationYear: data.graduationYear,
    gpaScore: data.gpaScore,
    satScore: data.satScore,
    statementOfPurpose: data.statementOfPurpose,
    submissionDate: new Date(),
  });

  return await app.save();
};

export const getMyApplication = async (studentId) => {
  return await Application.findOne({ studentId });
};

export const getAllApplications = async (filter = {}) => {
  return await Application.find(filter).sort({ submissionDate: -1 });
};

export const getApplicationById = async (id) => {
  const app = await Application.findById(id);
  if (!app) {
    const error = new Error('Admission application not found.');
    error.statusCode = 404;
    throw error;
  }
  return app;
};

export const approveApplication = async (id, reviewer) => {
  const app = await Application.findById(id);
  if (!app) {
    const error = new Error('Admission application not found.');
    error.statusCode = 404;
    throw error;
  }

  app.status = 'APPROVED';
  app.reviewedBy = reviewer?.name || reviewer?.reviewedBy || 'Admission Officer';
  app.reviewDate = new Date();
  app.reviewerNotes = reviewer?.reviewerNotes || 'Application meets all university admissions criteria. Approved.';

  return await app.save();
};

export const rejectApplication = async (id, reviewer) => {
  const app = await Application.findById(id);
  if (!app) {
    const error = new Error('Admission application not found.');
    error.statusCode = 404;
    throw error;
  }

  app.status = 'REJECTED';
  app.reviewedBy = reviewer?.name || reviewer?.reviewedBy || 'Admission Officer';
  app.reviewDate = new Date();
  app.reviewerNotes = reviewer?.reviewerNotes || 'Application does not meet prerequisite requirements.';

  return await app.save();
};

export default {
  applyAdmission,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
};
