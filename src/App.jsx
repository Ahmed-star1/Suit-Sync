import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Shop from "./pages/Shop";
import ShopDetailPage from "./pages/ShopDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPassword from "./pages/ForgetPassword";
import VarifyCode from "./pages/VarifyCode";
import ResetPassword from "./pages/ResetPassword";
import MyAccountPge from "./pages/MyAccount";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/contact-us" element={<ContactUs />} />

      {/* Ecommerce Pages */}
      <Route path="/suits" element={<Shop />} />
      <Route path="/suits/product/:id" element={<ShopDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/Checkout" element={<CheckoutPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/verify-code" element={<VarifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/my-account" element={<MyAccountPge />} />

    </Routes>
  );
}

export default App;