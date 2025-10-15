import React, { createContext, useState, useEffect, ReactNode } from "react";

type User = {
    id: number | string;
    email: string;
    role?: string;
} | null;

type AuthContextType = {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
    verifyEmail: (token: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
    verifyEmail: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.accessToken);
                setUser(data.user);
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Login error! Check console for details.");
        }
    };


    const signup = async (email: string, password: string) => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Open verification link in new tab
                window.open(data.verificationLink, "_blank");
            } else {
                alert(data.message || "Signup failed! Check console for details.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Signup error! Check console for details.");
        }
    };


    // Verify email function
    const verifyEmail = async (token: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/auth/verify?token=${token}`, {
                method: "GET",
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
            } else {
                alert(data.message || "Verification failed!");
            }
        } catch (err) {
            console.error("Verify email error:", err);
            alert("Verify email error! Check console for details.");
        }
    }



    // Logout function
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };



    return (
        <AuthContext.Provider value={{ user, login, signup, logout, verifyEmail }}>
            {children}
        </AuthContext.Provider>
    );
};
