import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.js";

const Logout = () => {
    const navigate = useNavigate();
    const { setUsername, setIsAuthenticated } = useAuth(); 

    useEffect(() => {
        setUsername(""); 
        setIsAuthenticated(false); 
        navigate("/login");
    }, [navigate, setIsAuthenticated, setUsername]);

    return <p>Logging out...</p>;
};

export default Logout;
