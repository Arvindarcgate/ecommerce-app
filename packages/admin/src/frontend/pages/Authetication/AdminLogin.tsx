// src/pages/Authentication/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (email && password) {
            console.log("Logged in with:", { email, password });
            alert("Login successful!");
        } else {
            alert("Please fill all fields");
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
                    <button type="submit" className={styles.button}>
                        Login
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
