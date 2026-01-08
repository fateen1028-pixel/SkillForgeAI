import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Add a response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Session Expiration / Unauthorized
    if (error.response?.status === 401) {
       console.warn("Session expired or unauthorized.");
       // Check if we are in a browser environment
       if (typeof window !== 'undefined') {
          // Only redirect if we're not already on an auth page
          const isAuthPage = window.location.pathname.includes('/auth/');
          
          if (!isAuthPage) {
             const wasLoggedIn = localStorage.getItem('was_logged_in') === 'true';
             // If they were logged in, they expired. Otherwise they just aren't logged in.
             if (wasLoggedIn) {
                localStorage.removeItem('was_logged_in'); // Clear it so we don't double-show
                window.location.href = '/auth/login?expired=true';
             } else {
                window.location.href = '/auth/login';
             }
          }
       }
    }

    if (error.response?.status === 500) {
      const detail = error.response.data?.detail || error.response.data;
      
      // Customize error message for curriculum mismatches
      const configErrorMessage = typeof detail === 'string' && detail.includes("templates") 
        ? `Configuration Error: ${detail}` 
        : "Critical Backend Error (Possible Configuration Issue)";

      console.error("Critical Backend Configuration Error:", {
        message: configErrorMessage,
        detail: detail,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Forcefully update error message for the UI to catch
      if (error.response.data && typeof error.response.data === 'object') {
        error.response.data.detail = configErrorMessage;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
