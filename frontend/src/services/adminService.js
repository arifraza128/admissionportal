import api from './api';

export const adminService = {
  getUsers: async () => {
    // Falls back gracefully through central mock or live user routes
    const usersStr = localStorage.getItem('apex_mock_users');
    if (usersStr) {
      return JSON.parse(usersStr);
    }
    const response = await api.get('/auth/users').catch(() => ({ data: [] }));
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const usersStr = localStorage.getItem('apex_mock_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const idx = users.findIndex(u => u._id === userId);
      if (idx !== -1) {
        users[idx].status = status;
        localStorage.setItem('apex_mock_users', JSON.stringify(users));
        return users[idx];
      }
    }
    return { success: true };
  },

  createUser: async (userData) => {
    return api.post('/auth/register', userData).then(res => res.data);
  }
};

export default adminService;
