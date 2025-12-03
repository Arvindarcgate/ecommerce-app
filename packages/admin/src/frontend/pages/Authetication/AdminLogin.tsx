import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../../config/env';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill all fields');
      return; 
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);

      toast.success('Admin Login Successful!');

      navigate('/admin/orders');
    } catch (error) {
      toast.error('Something went wrong while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className={styles.form} role="form">
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
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <p className={styles.signupText}>
          New here?{' '}
          <span
            onClick={() => navigate('/admin-signup')}
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
