const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = {
  get: async (path) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  post: async (path, data) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error posting to ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  put: async (path, data) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error putting to ${path}: ${response.statusText}`);
    }
    return response.json();
  },

  delete: async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting ${path}: ${response.statusText}`);
    }
    return response.json();
  },
};

export default apiClient;