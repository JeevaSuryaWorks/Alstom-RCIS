import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rework API
export const reworkAPI = {
  getAll: (params = {}) => api.get('/rework', { params }),
  getById: (id) => api.get(`/rework/${id}`),
  create: (data) => api.post('/rework', data),
  update: (id, data) => api.put(`/rework/${id}`, data),
  delete: (id) => api.delete(`/rework/${id}`),
};

// Root Cause API
export const rootCauseAPI = {
  getAll: (params = {}) => api.get('/root-cause', { params }),
  getPatterns: () => api.get('/root-cause/patterns'),
  create: (data) => api.post('/root-cause', data),
};

// Corrective Action API
export const correctiveActionAPI = {
  getAll: (params = {}) => api.get('/corrective-action', { params }),
  create: (data) => api.post('/corrective-action', data),
  update: (id, data) => api.put(`/corrective-action/${id}`, data),
};

// Analytics API
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getDefectTrends: () => api.get('/analytics/defect-trends'),
  getHeatMap: () => api.get('/analytics/heat-map'),
  getRecurringDefects: () => api.get('/analytics/recurring-defects'),
  getTimeSeries: (days = 30) => api.get('/analytics/time-series', { params: { days } }),
  getTopStations: () => api.get('/analytics/top-stations'),
};

export default api;
