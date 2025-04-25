// API configuration based on environment
// This can be configured for any deployment platform by setting the VITE_API_BASE_URL
// environment variable during build or in a .env file

// Default to localhost for development, but this should be overridden in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Individual API endpoints
export const API_ENDPOINTS = {
  USER_API: `${API_BASE_URL}/user`,
  COURSE_API: `${API_BASE_URL}/course`,
  PURCHASE_API: `${API_BASE_URL}/purchase`,
  MEDIA_API: `${API_BASE_URL}/media`,
};

export default API_ENDPOINTS;
