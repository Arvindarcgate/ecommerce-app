import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Adminsignup.module.css';

const adminsignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !newPassword || !role) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== newPassword) {
            alert('Passwords do not match!');
            return;
        }

        // You can connect this to your backend API later
        console.log('Signup details:', { email, password, role });
        alert(`Account created for ${role} successfully!`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Admin Signup</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className={styles.select}
                    >
                        <option value="">Select Role</option>
                        <option value="superadmin">Superadmin</option>
                        <option value="seller">Seller</option>
                        <option value="developer">Developer</option>
                    </select>

                    <button type="submit" className={styles.button}>Sign Up</button>

                    <p className={styles.loginText}>
                        Already have an account?{' '}
                        <span onClick={() => navigate('/admin-login')} className={styles.link}>
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default adminsignup;
