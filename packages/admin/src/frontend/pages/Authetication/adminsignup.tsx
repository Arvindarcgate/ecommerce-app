// src/pages/Authentication/AdminSignup.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Adminsignup.module.css";

const AdminSignup: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:8000/admin/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: "admin", // 👈 Important
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed");
                return;
            }

            alert("Admin Account Created Successfully!");

            // OPTIONAL: Save token
            localStorage.setItem("token", data.token);

            // Redirect to Admin Login Page
            navigate("/admin-login");

        } catch (error) {
            alert("Something went wrong while signing up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Admin Signup</h2>

                <form onSubmit={handleSignup} className={styles.form}>

                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />

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
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className={styles.signupText}>
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/admin-login")}
                        className={styles.link}
                    >
                        Login Here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AdminSignup;
