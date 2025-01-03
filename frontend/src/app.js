import { React } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { routes } from "./constants/routes";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import AppPage from "./pages/AppPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import Logout from "./pages/LogoutPage";

import DynamicTitle from "./utils/DynamicTitle";

import "@fontsource/be-vietnam-pro";

import "./styles/common.css";

const App = () => {
    const location = useLocation();

    return (
        <>
        
        <Helmet>
            <title>{DynamicTitle(location.pathname)}</title>
        </Helmet>
        
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace={true} />} />

            <Route path={routes.LOGIN} element={<LoginPage />} />
            <Route path={routes.APP} element={<AppPage />} />
            <Route path={routes.ERROR} element={<ErrorPage />} />
            <Route path={routes.LOGOUT} element={<Logout />} />
        </Routes>
        </>
    );
};

export default App;
