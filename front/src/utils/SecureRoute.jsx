import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function SecureRoute({ requiredRole, redirectPath }) {
    const { user, loading } = useAuth();
    
    if(loading) {
        return;
    }
    // debugger;


    if(!loading && user && requiredRole && user.role != requiredRole) {
        return <Navigate to={redirectPath} />;
    }

    if (!loading && !user) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}
