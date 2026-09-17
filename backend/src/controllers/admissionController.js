import admissionService from '../services/admissionService.js';

export const apply = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const application = await admissionService.applyAdmission(studentId, req.body);
    return res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

export const getMyApplication = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;
    const application = await admissionService.getMyApplication(studentId);
    return res.status(200).json(application || null);
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await admissionService.getAllApplications();
    return res.status(200).json(applications);
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await admissionService.getApplicationById(req.params.id);
    return res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

export const approveApplication = async (req, res, next) => {
  try {
    const application = await admissionService.approveApplication(req.params.id, {
      ...req.body,
      name: req.user.name,
    });
    return res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

export const rejectApplication = async (req, res, next) => {
  try {
    const application = await admissionService.rejectApplication(req.params.id, {
      ...req.body,
      name: req.user.name,
    });
    return res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

export default {
  apply,
  getMyApplication,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
};
