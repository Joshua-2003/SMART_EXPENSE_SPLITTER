import { createContext, useEffect, useState } from "react";
import { authService } from "@/services/auth/auth.service";
import type { ReactNode } from "react";
import type { AuthUser } from "types/auth";

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        const res = await authService.login({ email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    const getMe = async () => {
        
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

       try {
        const res = await authService.getMe();
        setUser(res.data.user);
       } catch (error) {
        logout(); // Clear auth state on error (e.g. invalid/expired token)
       } finally {
        setLoading(false);
       }
    }

    useEffect(() => {
        getMe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

