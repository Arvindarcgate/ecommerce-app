import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";
// import styles from "./signup.module.css";
import styles from "./UnifiedAuth.module.css";


const Signup: React.FC = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await signup(email, password);

      console.log("Signup Response:", res);

      if (res.success) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        console.error("Signup Error:", res); // 🔥 SHOW ERROR IN CONSOLE
        alert(res.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Exception:", error); // 🔥 EXCEPTION ERROR
      alert("Something went wrong!");
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>

        <form onSubmit={handleSignup} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className={styles.passwordIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;