// API Base URL Configuration
// For local development: VITE_API_BASE_URL=http://localhost:5000/api
// For production: VITE_API_BASE_URL=https://beyondchats-yt9u.onrender.com/api

let envUrl = import.meta.env.VITE_API_BASE_URL;

// Auto-fix: Ensure URL ends with /api
if (envUrl && !envUrl.endsWith('/api')) {
    envUrl = envUrl.replace(/\/$/, '') + '/api';
}

// Use environment variable if set, otherwise detect environment
export const API_BASE_URL = envUrl || (
    import.meta.env.PROD
        ? 'https://beyondchats-yt9u.onrender.com/api'  // Production fallback
        : 'http://localhost:5000/api'                   // Development fallback
);

console.log('🔗 API Base URL:', API_BASE_URL);
