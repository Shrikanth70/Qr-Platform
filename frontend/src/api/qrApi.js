import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const qrApi = {
  generateQR: async (data) => {
    // Send standard full payload payload to backend
    const response = await api.post('/generate', data);
    return response.data;
  },

  verifyQR: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
};

export default qrApi;