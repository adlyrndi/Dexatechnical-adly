import { API_URL } from '../utils/constants';

const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = { ...options, headers };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error sistem');
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export const authService = {
  login: (credentials) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => apiClient('/auth/profile'),
};

export const adminService = {
  getOverview: () => apiClient('/dashboard/admin'),
  getEmployees: () => apiClient('/employee'),
  createEmployee: (data) => apiClient('/employee', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id, data) => apiClient(`/employee/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id) => apiClient(`/employee/${id}`, { method: 'DELETE' }),
  getLogs: () => apiClient('/attendance'),
};

export default apiClient;
