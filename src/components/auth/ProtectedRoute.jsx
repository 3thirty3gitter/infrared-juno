import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, session } = useAuth();
    const location = useLocation();

    // If we have a user (either real or demo), grant access
    // You might want to be stricter and check `session` too if you only want real auth
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
