import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import ProductInfoPage from "./pages/ProductInfoPage";
import ContactPage from "./pages/ContactPage";

import ProfilePage from "./pages/ProfilePage";
import AddressPage from "./pages/AddressPage";
import PasswordPage from "./pages/PasswordPage";
import NoticePage from "./pages/NoticePage";
import SettingPage from "./pages/SettingPage";

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderListPage from "./pages/OrderListPage";
import OrderDetailPage from "./pages/OrderDetailPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        setUser(null);
      }
    }
  }, []);


  return (
    <MainLayout user={user}>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login"  element={<LoginPage setUser={setUser} />} />
        <Route path="/products" element={<ProductPage user={user} />} />
        <Route path="/product/:id" element={<ProductInfoPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/setting" element={<SettingPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
