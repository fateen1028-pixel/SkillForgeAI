// Axios instance placeholder
// Install: npm install axios

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// import axios from 'axios';
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

export const api = {
  get: async (url) => ({ data: null }),
  post: async (url, data) => ({ data: null }),
  put: async (url, data) => ({ data: null }),
  delete: async (url) => ({ data: null }),
};

export default api;
