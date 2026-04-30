import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ScrollProvider } from "./components/ScrollContext";
import { useEventFlowCleanup } from "./hooks/useEventFlowCleanup";
import ProtectedRoutes, { PublicRoute } from "./components/ProtectedRoutes";
import EventToggle from "./components/EventToggle";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnAndExchangePolicy from "./pages/ReturnAndExchangePolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Shop from "./pages/Shop";
import ShopDetailPage from "./pages/ShopDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/Wishlist";
import CheckoutPage from "./pages/CheckoutPage";
import ThankyouPage from "./pages/Thankyou";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VarifyOtp from "./pages/VerifyOtp";
import ForgetPassword from "./pages/ForgetPassword";
import VarifyCode from "./pages/VarifyCode";
import ResetPassword from "./pages/ResetPassword";
import MyAccountPage from "./pages/MyAccount";
import ChangePasswordPage from "./pages/ChangePasswordPage"; 
import EventsPage from "./pages/Events";
import MeasurementPage from "./pages/Measurement";  
// import EventLookPage from "./pages/EventLookPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import SupportPage from "./pages/SupportPage";
import CreateEventPage from "./pages/CreateEventPage";
import AddEventMemberPage from "./pages/AddEventMemberPage";
import EditEventMembersPage from "./pages/EditEventMembersPage";
import AddNewMembersPage from "./pages/AddNewMembersPage";
import EventsDetailPage from "./pages/EventsDetailPage";
import EditEventPage from "./pages/EditEventPage";

function App() {
  const [count, setCount] = useState(0);

  useEventFlowCleanup();

  return (
    <ScrollProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/return-exchange-policy" element={<ReturnAndExchangePolicy />} />

        {/* Ecommerce Pages */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/product/:id" element={<ShopDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/Checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankyouPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VarifyOtp /></PublicRoute>} />
        <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
        <Route path="/verify-code" element={<PublicRoute><VarifyCode /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        <Route path="/my-account" element={<ProtectedRoutes><MyAccountPage /></ProtectedRoutes>} />
        <Route path="/change-password" element={<ProtectedRoutes><ChangePasswordPage /></ProtectedRoutes>} />
        <Route path="/events" element={<ProtectedRoutes><EventsPage /></ProtectedRoutes>} />
        <Route path="/measurement" element={<ProtectedRoutes><MeasurementPage /></ProtectedRoutes>} />
        {/* <Route path="/event-look" element={<EventLookPage />} /> */}
        <Route path="/my-orders" element={<ProtectedRoutes><MyOrdersPage /></ProtectedRoutes>} />
        <Route path="/wishlist" element={<ProtectedRoutes><WishlistPage /></ProtectedRoutes>} />
        <Route path="/support" element={<ProtectedRoutes><SupportPage /></ProtectedRoutes>} />
        <Route path="/create-event" element={<ProtectedRoutes><CreateEventPage /></ProtectedRoutes>} />
        <Route path="/edit-event/:id" element={<ProtectedRoutes><EditEventPage /></ProtectedRoutes>} />
        <Route path="/add-event-member" element={<ProtectedRoutes><AddEventMemberPage /></ProtectedRoutes>} />
        <Route path="/edit-event-members/:id" element={<ProtectedRoutes><EditEventMembersPage /></ProtectedRoutes>} />
        <Route path="/add-new-members/:eventId" element={<ProtectedRoutes><AddNewMembersPage /></ProtectedRoutes>} />
        <Route path="/event/:eventId" element={<ProtectedRoutes><EventsDetailPage /></ProtectedRoutes>} />
      </Routes>

      <EventToggle />
    </ScrollProvider>
  );
}

export default App;
