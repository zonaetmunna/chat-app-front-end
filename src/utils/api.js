// frontend/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Update with your backend URL
});

export default api;