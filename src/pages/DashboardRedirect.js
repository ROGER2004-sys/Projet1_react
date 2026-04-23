// src/pages/DashboardRedirect.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) return null;

    return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/user" />;
};

export default DashboardRedirect;
