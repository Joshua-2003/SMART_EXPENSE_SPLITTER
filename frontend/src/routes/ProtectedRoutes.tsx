import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../constants/routes';
import { AppLoader } from '../components/common/AppLoader';

export const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated, isHydrating } = useAppSelector((state) => state.auth);

  if (isHydrating) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
