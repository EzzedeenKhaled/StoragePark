import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Pages/Login";
import Register from "./Pages/CustomerRegister";
import RegisterPartner from "./Pages/PartnerRegister1";
import RegisterPartner2 from "./Pages/PartnerRegister2";
import HomePage from "./Pages/HomePage";
import PartnerHome from "./Pages/PartnerHome";
import { Toaster } from 'react-hot-toast';
import EmailVer from "./Pages/EmailVer"
import Ecommerce from "./Pages/Ecommerce";
import ProductForm from "./Pages/ProductForm";
import Profile from './Pages/Profile';
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import OrderHistory from "./Pages/OrderHistory";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Category from './Pages/Category';
import ProductPage from "./Pages/ProductPage";
import PartnerDashboard from "./Pages/PartnerDashboard";
import PaymentForm from './Pages/PaymentForm';
import { useCartStore } from "./stores/useCartStore";
// import RequestList from "./Pages/Admin/Requests/RequestList";
// import Partners from "./Pages/Admin/Partner/partners";
import EmptyCart from "./Pages/EmptyCart";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { checkAuth, checkingAuth, user } = useUserStore();
  const { getCartItems } = useCartStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;
  // Dashboard partner (verify email)
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Toaster />


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-partner-1" element={<RegisterPartner />} />
        <Route path="/register-partner-2" element={<RegisterPartner2 />} />
        <Route path="/product-page/:productId" element={<ProductPage />} />
        <Route path='empty-cart' element={<EmptyCart />} />
        <Route path="/register-customer" element={<Register />} />
        <Route path="/partner" element={<PartnerHome />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/verify-email" element={<EmailVer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/empty-cart" element={<EmptyCart />} />
        <Route path="/product-form" element={<ProductForm />} />
        <Route path="/payment-form" element={<PaymentForm />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:categoryName" element={<Category />} />

        <Route path="/admin/*" element={<AdminDashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* <Route path="/admin/requests" element={<RequestList />} />
        <Route path="/admin/partners" element={<Partners />} /> */}
      </Routes>

    </>
  );
}


export default App;