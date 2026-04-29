import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/Login";
import ProtectedRoute from "../guards/ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}