import React, { createContext, useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? jwtDecode(token) : null;
    });

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(jwtDecode(res.data.token));
    };

    const register = async (name, email, password) => {
        const res = await axios.post('/api/auth/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        setUser(jwtDecode(res.data.token));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
