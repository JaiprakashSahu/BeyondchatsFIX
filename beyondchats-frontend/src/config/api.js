// API Base URL Configuration
// For local development: VITE_API_BASE_URL=http://localhost:5000/api
// For production: VITE_API_BASE_URL=https://beyondchats-yt9u.onrender.com/api

const getApiBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL;

    // If no env var, use fallback based on environment
    if (!url) {
        url = import.meta.env.PROD
            ? 'https://beyondchats-yt9u.onrender.com/api'
            : 'http://localhost:5000/api';
    }

    // Normalize: remove trailing slash if present
    url = url.replace(/\/+$/, '');

    // Ensure URL ends with /api (but don't duplicate)
    if (!url.endsWith('/api')) {
        url = url + '/api';
    }

    return url;
};

export const API_BASE_URL = getApiBaseUrl();

// Debug logging (visible in browser console)
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', import.meta.env.PROD ? 'production' : 'development');

