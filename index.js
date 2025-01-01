import "./index.css";
import React from "react";
import "@fontsource/be-vietnam-pro";
import ReactDOM from "react-dom/client";
import App from "./app";
import { AuthProvider } from "./contexts/authContext"
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>,
);

