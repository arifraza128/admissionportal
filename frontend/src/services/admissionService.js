import api from './api';

export const admissionService = {
  apply: async (formData) => {
    const response = await api.post('/admission/apply', formData);
    return response.data;
  },

  getMyApplication: async () => {
    const response = await api.get('/admission/my-application');
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get('/admission/applications');
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/admission/applications/${id}`);
    return response.data;
  },

  approveApplication: async (id, reviewData) => {
    const response = await api.put(`/admission/applications/${id}/approve`, reviewData);
    return response.data;
  },

  rejectApplication: async (id, reviewData) => {
    const response = await api.put(`/admission/applications/${id}/reject`, reviewData);
    return response.data;
  },
};

export default admissionService;
