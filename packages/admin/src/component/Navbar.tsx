import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Admin Portal</h1>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>
          Admin Login
        </Link>
        <Link to="/admin-signup" className={styles.link}>
          Admin Signup
        </Link>
        <Link to="/add-product" className={styles.link}>
          Add Product
        </Link>
        <Link to="/adminproductlaunch" className={styles.link}>
          Product Launch
        </Link>
        <Link to="/product-edit" className={styles.link}>
          Product edit
        </Link>
        <Link to="/admin/orders" className={styles.link}>
          Order History
        </Link>
        <Link to="/coupon" className={styles.link}>
          coupon
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
