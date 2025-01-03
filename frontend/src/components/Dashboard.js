import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { useAuth } from "../contexts/authContext";
import Logo from "../images/logo2.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { username, target, setTarget } = useAuth();

  const handleEditClick = () => {
    setTarget('');
    navigate("/app/edit");
  };

  return (
    <div className="Section" id="Dashboard">
      <button className="image-button" onClick={handleEditClick}>
        <img 
          src={Logo}
          alt="Edit" 
          className="button-image" 
        />
      </button>
    </div>
  );
};

export default Dashboard;
