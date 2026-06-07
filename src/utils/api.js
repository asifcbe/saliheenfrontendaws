import axios from 'axios';
// Bundled local fallback image — served from our own build, so it can never
// 404 and re-trigger onError. Used by getImageUrl and handleImageError below.
import IMAGE_FALLBACK from './fallback.jpg';

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

export { IMAGE_FALLBACK };

export const getImageUrl = (path) => {
  if (!path) return IMAGE_FALLBACK;
  if (path.startsWith('http')) return path;
  const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// onError handler that swaps in the local fallback exactly once. Clearing
// onerror before changing src guarantees a missing image can't loop fetching.
export const handleImageError = (e) => {
  e.target.onerror = null;
  if (e.target.src !== IMAGE_FALLBACK) e.target.src = IMAGE_FALLBACK;
};
