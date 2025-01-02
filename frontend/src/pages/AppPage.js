import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.js";
import "../styles/AppPage.css";
import { appRoutes, routes } from "../constants/routes.js";
import Sidebar from "../components/Sidebar.js";
import Dashboard from "../components/Dashboard.js";
import Children from "../components/Children.js";

const AppPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const { isAuthenticated, isLoading} = useAuth();

  // Redirect to /login if unauthenticated or to /app/dashboard if authenticated
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(routes.LOGIN, { replace: true }); // Redirect to login
      } else if (location.pathname === routes.APP) {
        navigate(appRoutes.DASHBOARD, { replace: true }); // Redirect to dashboard
      }
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  // Update activeSection based on URL
  useEffect(() => {
    const pathSections = location.pathname.split("/");
    setActiveSection(pathSections[2] || ""); // Get the second part of the URL
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="AppPage">
      <div className="ContentContainer">
        <div className="LeftSidebar">
          <Sidebar activeSection={activeSection} />
        </div>
        <div className="RightContent">
          <Routes>
            <Route path={appRoutes.DASHBOARD} element={<Dashboard />} />
            <Route path={appRoutes.CHILDREN} element={<Children />} />
            <Route path="*" element={<Navigate to={appRoutes.DASHBOARD} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
