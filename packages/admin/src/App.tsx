import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import AdminLogin from './pages/Authetication/AdminLogin';
import AdminSignup from './pages/Authetication/adminsignup';
import ProductPage from './pages/productpages'; //  import your product page

import AdminProductedit from './pages/adminProductedit';
import OrderHistory from './pages/orderhistory';
import AdminProductlaunch from './pages/adminproductlaunch';
import { Toaster } from 'react-hot-toast';
import CouponPage from './pages/coupon/coupon';


const App: React.FC = () => {
  return (
    <Router>
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Navbar />
        <Toaster position="top-right" />

        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/add-product" element={<ProductPage />} />
            <Route path="/product-edit" element={<AdminProductedit />} />
            <Route path="/admin/orders" element={<OrderHistory />} />
            <Route path="/adminproductlaunch" element={< AdminProductlaunch />} />
            <Route path = "/coupon" element = {<CouponPage />} />
           
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
