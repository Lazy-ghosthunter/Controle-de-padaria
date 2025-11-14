import axios from 'axios';

// Backend server runs on port 8081 by default (see backend/server.js).
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
  timeout: 10000,
});

export default api;
