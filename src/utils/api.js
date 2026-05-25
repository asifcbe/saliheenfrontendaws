import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('saliheenUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('saliheenUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};
