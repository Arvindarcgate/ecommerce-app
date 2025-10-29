import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './frontend/component/Navbar';
import AdminLogin from './frontend/pages/Authetication/adminlogin';
import AdminSignup from './frontend/pages/Authetication/adminsignup';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar always on top */}
        <Navbar />

        {/* Page content below */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
