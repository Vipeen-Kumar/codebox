// API Configuration
// Uses REACT_APP_API_URL environment variable for production
// Falls back to localhost:5000 for local development

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  piston: `${API_BASE_URL}/api/piston/execute`,
  ai: `${API_BASE_URL}/api/ai/chat`,
};

export default API_BASE_URL;