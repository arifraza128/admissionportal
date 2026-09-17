import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Checking role authorization..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || '').toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

  if (!normalizedAllowedRoles.includes(userRole)) {
    // Redirect to the user's proper role dashboard
    switch (userRole) {
      case 'STUDENT':
        return <Navigate to="/student/dashboard" replace />;
      case 'FACULTY':
        return <Navigate to="/faculty/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'ADMISSION_OFFICER':
        return <Navigate to="/officer/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default RoleProtectedRoute;
