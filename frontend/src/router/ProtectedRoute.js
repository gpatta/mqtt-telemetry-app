import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children }) => {
    const user = useAuth();

    if (!user.token) return <Navigate to="/login" />;
    return children;
};

export default ProtectedRoute;
