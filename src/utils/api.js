// Single source of truth for the backend URL.
// Set VITE_API_URL in your Vercel / deployment environment variables.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default API_BASE
