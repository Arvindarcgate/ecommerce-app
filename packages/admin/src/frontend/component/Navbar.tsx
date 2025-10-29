import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <h1 className={styles.title}>Admin Portal</h1>
            <div className={styles.links}>
                <Link to="/admin-login" className={styles.link}>Admin Login</Link>
                <Link to="/admin-signup" className={styles.link}>Admin Signup</Link>
            </div>
        </nav>
    );
};

export default Navbar;
