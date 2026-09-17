import api from './api';

export const documentService = {
  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  uploadDocument: async (docData) => {
    const response = await api.post('/documents/upload', docData);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export default documentService;
