import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Učitavanje...</div>;
    }

    if (!user) {
        // Ako nije ulogovan, šaljemo ga na login
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'ROLE_ADMIN') {
        // Ako je ruta samo za admina, a korisnik nije admin, vraćamo ga na početnu
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
