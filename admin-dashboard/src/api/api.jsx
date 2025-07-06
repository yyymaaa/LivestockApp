// src/api/api.jsx
import axios from 'axios';
import { BASE_URL } from '../config';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem('adminUser'));
  const token = storedUser?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
