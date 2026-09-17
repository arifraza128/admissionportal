import api from './api';

export const registrationService = {
  registerCourse: async (courseId) => {
    const response = await api.post('/registrations', { courseId });
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my');
    return response.data;
  },

  dropRegistration: async (registrationId) => {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  },
};

export default registrationService;
