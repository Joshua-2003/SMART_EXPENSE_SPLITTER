import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoutes } from './ProtectedRoutes';
import { PublicRoutes } from './PublicRoutes';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ExpensesPage } from '../pages/expenses/ExpensesPage';
import { MembersPage } from '../pages/members/MembersPage';
import { SettlementPage } from '../pages/settlement/SettlementPage';
import { AccountabilityPage } from '../pages/accountability/AccountabilityPage';
import { GroupsPage } from '../pages/groups/GroupsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { NotFoundPage } from '../pages/errors/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes (Auth) */}
      <Route element={<PublicRoutes />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
        </Route>
      </Route>

      {/* Protected Routes (Main Application) */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
          <Route path={ROUTES.MEMBERS} element={<MembersPage />} />
          <Route path={ROUTES.SETTLEMENT} element={<SettlementPage />} />
          <Route path={ROUTES.ACCOUNTABILITY} element={<AccountabilityPage />} />
          <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
