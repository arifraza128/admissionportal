/**
 * Standardized API response formatters
 */

export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ message });
};

export const registrationRejectedResponse = (res, reason, statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'REJECTED',
    reason,
  });
};

export const registrationSuccessResponse = (res, message, registration, statusCode = 201) => {
  return res.status(statusCode).json({
    status: 'ENROLLED',
    message: message || 'Course registration successful.',
    registration,
  });
};

export const registrationWaitlistResponse = (res, message, registration, statusCode = 201) => {
  return res.status(statusCode).json({
    status: 'WAITLISTED',
    message: message || 'Course capacity reached. Student added to waitlist.',
    registration,
  });
};

export default {
  successResponse,
  errorResponse,
  registrationRejectedResponse,
  registrationSuccessResponse,
  registrationWaitlistResponse,
};
