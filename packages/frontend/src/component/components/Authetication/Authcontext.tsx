// src/components/Authetication/Authcontext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    signup: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => ({ success: false }),
    signup: async () => ({ success: false }),
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage if available
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (email: string, password: string) => {
        // 👇 replace this with real API later
        if (email && password) {
            const userData = { email };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            return { success: true };
        } else {
            return { success: false, message: "Invalid credentials" };
        }
    };

    const signup = async (email: string, password: string) => {
        // 👇 replace with your API
        if (email && password) {
            const userData = { email };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            return { success: true };
        } else {
            return { success: false, message: "Signup failed" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
