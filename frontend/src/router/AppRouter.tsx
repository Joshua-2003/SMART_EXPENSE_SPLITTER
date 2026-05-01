import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../guards/ProtectedRoute";
import GuestRoute from "../guards/GuestRoute";

// auth
import LoginPage from "../pages/auth/Login";

// dashboard
import DashboardPage from "../pages/dashboard/Dashboard";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route
                    path="/login" 
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    } 
                />

                <Route 
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}