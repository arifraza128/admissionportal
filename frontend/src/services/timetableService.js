import api from './api';

export const timetableService = {
  getTimetable: async () => {
    const response = await api.get('/timetable');
    return response.data;
  },
};

export default timetableService;
