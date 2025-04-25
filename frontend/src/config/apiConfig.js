
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Check if we're in production and using the Render URL without the /api/v1 prefix
if (API_BASE_URL === 'https://new-lms-project-can.onrender.com') {
  // Add the /api/v1 prefix if it's missing
  API_BASE_URL = 'https://new-lms-project-can.onrender.com/api/v1';
}

// Individual API endpoints
export const API_ENDPOINTS = {
  USER_API: `${API_BASE_URL}/user`,
  COURSE_API: `${API_BASE_URL}/course`,
  PURCHASE_API: `${API_BASE_URL}/purchase`,
  MEDIA_API: `${API_BASE_URL}/media`,
};

export default API_ENDPOINTS;
