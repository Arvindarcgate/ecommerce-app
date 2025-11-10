import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <h1 className={styles.title}>Admin Portal</h1>
            <div className={styles.links}>
                <Link to="/admin-login" className={styles.link}>
                    Admin Login
                </Link>
                <Link to="/admin-signup" className={styles.link}>
                    Admin Signup
                </Link>
                <Link to="/add-product" className={styles.link}>
                    Add Product
                </Link>
                <Link to="/getready" className={styles.link}>
                    Get Ready
                </Link>
                <Link to="/product-edit" className={styles.link}>
                    Product edit
                </Link>
                <Link to="/admin/orders" className={styles.link}>

                    Order History
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
