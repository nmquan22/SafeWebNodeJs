import "../styles/LoginPage.css";
import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

import Logo from "../images/Logo.png";
import LoginForm from "../components/LoginForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { routes } from "../constants/routes";

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to /app if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(routes.APP);
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="LoginPage">
      
      <div className="form">
        <div className = "logoContainer">
          <div className = "emptyContainer">
          </div>
          <div className = "imgContainer">
            <img src={Logo} alt="NoChild" />
          </div>
        </div>
        
        <div className = "formContainer">
          <LoginForm />
        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;
