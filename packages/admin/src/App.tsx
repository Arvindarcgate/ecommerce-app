import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './frontend/component/Navbar';
import AdminLogin from './frontend/pages/Authetication/AdminLogin';
import AdminSignup from './frontend/pages/Authetication/adminsignup';
import ProductPage from './frontend/pages/productpages'; // ✅ import your product page

import AdminProductedit from './frontend/pages/adminProductedit';
import OrderHistory from './frontend/pages/orderhistory';
import GetReady from './frontend/pages/getReady'


const App: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar on top */}
        <Navbar />

        {/* Page content below */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/add-product" element={<ProductPage />} />
            <Route path="/product-edit" element={<AdminProductedit />} />
            <Route path="/admin/orders" element={<OrderHistory />} />
            <Route path="/getready" element={< GetReady />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
