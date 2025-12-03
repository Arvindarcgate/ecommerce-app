// src/pages/Authentication/AdminSignup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Adminsignup.module.css';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/env';

const AdminSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name || !email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,   
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Signup failed");
      return;
    }

    toast.success("Admin Account Created Successfully!");

    localStorage.setItem("token", data.token);

    navigate("/");
  } catch (error) {
    toast.error("Something went wrong while signing up");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Admin Signup</h2>

        <form onSubmit={handleSignup} className={styles.form} role="form">
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

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.signupText}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
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
