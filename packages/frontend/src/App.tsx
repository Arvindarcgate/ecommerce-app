import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/home";
import Product from "./pages/product";
import Contact from "./pages/contact";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Login from "./component/components/Authetication/login";
import Signup from "./component/components/Authetication/singup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VerifyEmailPage from "./component/components/Authetication/VerifyMailPage";

const queryClient = new QueryClient();
const App: React.FC = () => {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/signup", "/verify-email"]; // paths where footer is hidden
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={< VerifyEmailPage />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </QueryClientProvider>
  );
};


export default App;
