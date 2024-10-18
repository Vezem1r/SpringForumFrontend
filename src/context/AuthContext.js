import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        validateToken(token);
    }, []);

    const validateToken = (token) => {
        if (token) {
            const parts = token.split('.');
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(atob(parts[1]));
                    setUsername(payload.sub);

                    if (payload.role && payload.role.includes('ADMIN')) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }

                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Error decoding token:', error);
                    localStorage.removeItem('token');
                }
            } else {
                console.error('Invalid token format:', token);
                localStorage.removeItem('token');
            }
        }
    };

    const validateUsername = (token) => {
        localStorage.setItem('token', token);
        validateToken(token)
    };

    const login = (token) => {
        localStorage.setItem('token', token);
        validateToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, isAdmin, login, logout, validateUsername }}>
            {children}
        </AuthContext.Provider>
    );
};
