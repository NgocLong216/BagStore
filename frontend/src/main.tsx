import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./contexts/CartContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="121019473130-6jgfg4deoen564qm90tueuo5df6bpd8g.apps.googleusercontent.com">
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
