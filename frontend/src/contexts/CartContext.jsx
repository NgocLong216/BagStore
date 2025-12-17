import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");

  // Load cart count khi refresh
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/cart/count", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setCartCount)
      .catch(() => setCartCount(0));
  }, [token]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
