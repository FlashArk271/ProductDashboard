// MongoDB Atlas API Configuration
// Production URL for deployed backend
const PRODUCTION_API_URL = 'https://productdashboard-oc2r.onrender.com/api';
const DEV_API_URL = 'http://localhost:3001/api';

// Use production in deployed environments, localhost for development
export const API_BASE_URL = import.meta.env.PROD 
  ? PRODUCTION_API_URL 
  : (import.meta.env.VITE_API_URL || DEV_API_URL);
