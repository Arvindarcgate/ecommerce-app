import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";
import styles from "./login.module.css";

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await login(email, password);

        if (res.success) {
            navigate("/");
        } else {
            alert(res.message || "Login failed. Please try again.");
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Welcome Back 👋</h2>
                <p className={styles.subtitle}>Login to your account</p>

                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                </form>

                <p className={styles.footerText}>
                    New user?{" "}
                    <Link to="/signup" className={styles.link}>
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
