import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserProvider from "./context/UserProvider";
import "./index.css";
import AppRouter from "./router/AppRouter";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </StrictMode>
);
