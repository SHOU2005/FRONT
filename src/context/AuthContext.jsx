import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Auto-detect API URL based on current host for network access
const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Fallback to current origin but with port 8000 for backend
    return window.location.origin.replace(/:\d+$/, ':8000') || 'http://localhost:8000';
};

const API_URL = getApiUrl();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configure axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add interceptor for 401 errors
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${API_URL}/api/auth/me`);
                    setUser(response.data);
                } catch (error) {
                    console.error('Token verification failed', error);
                    logout();
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                username,
                password
            });

            const { access_token, user: userData } = response.data;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(userData);

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const hasRole = (roles) => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasRole, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
