import { API_URL } from '../utils/constants';

const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan sistem');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export const authService = {
  login: (credentials) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => apiClient('/auth/profile'),
};

export const attendanceService = {
  getStatus: () => apiClient('/dashboard/employee'),
  clockIn: (data) => apiClient('/attendance/clock-in', { method: 'POST', body: JSON.stringify(data) }),
  clockOut: () => apiClient('/attendance/clock-out', { method: 'POST' }),
  uploadPhoto: (formData) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, 
      body: formData,
    }).then(res => res.json());
  }
};

export default apiClient;
