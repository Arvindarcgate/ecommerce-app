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
    login: async () => ({ success: false, message: "Not implemented" }),
    signup: async () => ({ success: false, message: "Not implemented" }),
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Error parsing stored user:", err);
        }
    }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) {
            return { success: false, message: "Invalid credentials" };
        }

        // Fake login for now
        const userData = { email };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true };
    };

    const signup = async (email: string, password: string) => {
        if (!email || !password) {
            return { success: false, message: "Signup failed" };
        }

        // Fake signup for now
        const userData = { email };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true };
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
