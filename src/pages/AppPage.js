// Libs and frameworks
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.js";

// Stylesheets
import "../styles/AppPage.css";

// Routes and locales
import { appRoutes, routes } from "../constants/routes";

// Import components

const AppPage = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to /login if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(routes.LOGIN);
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    // Extracting the section from the current path
    const pathSections = location.pathname.split("/");
    setActiveSection(pathSections[2]); // Using index 1 to get the second element
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="AppPage">
      
    </div>
  );
};

export default AppPage;
