// src/pages/Authentication/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:8000/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: "admin", // 👈 important (backend already supports this)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            // Save token if you want
            localStorage.setItem("token", data.token);

            alert("Admin Login Successful!");

            // Redirect to dashboard
            navigate("/admin-dashboard");

        } catch (error) {
            alert("Something went wrong while logging in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Admin Login</h2>

                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : "Login"}
                    </button>
                </form>

                <p className={styles.signupText}>
                    New here?{" "}
                    <span
                        onClick={() => navigate("/admin-signup")}
                        className={styles.link}
                    >
                        Create New Account
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
