import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
    email: string;
}

interface AuthResponse {
    success: boolean;
    message?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    signup: (email: string, password: string) => Promise<AuthResponse>;
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

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const signup = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Signup API Response:", data); // 🔥 Important

            return data;
        } catch (error) {
            console.error("Signup API Error:", error); // 🔥 Network errors
            return { success: false, message: "Network error" };
        }
    };


    const login = async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) return { success: false, message: data.message };

            setUser({ email });
            localStorage.setItem("user", JSON.stringify({ email }));

            return { success: true };
        } catch {
            return { success: false, message: "Server error" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
