import api from './api';

export const resultService = {
  getResults: async (params = {}) => {
    const response = await api.get('/results', { params });
    return response.data;
  },

  createResult: async (resultData) => {
    const response = await api.post('/results', resultData);
    return response.data;
  },

  updateResult: async (id, resultData) => {
    const response = await api.put(`/results/${id}`, resultData);
    return response.data;
  },
};

export default resultService;
