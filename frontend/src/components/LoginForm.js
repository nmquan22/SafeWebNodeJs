import "../styles/LoginForm.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { apiRoutes } from "../constants/routes";
import axiosInstance from '../axiosConfig';

const LoginForm = () => {
    const navigate = useNavigate();
    const { setUsername, Authorize, isAuthenticated } = useAuth();
    const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        setUsername(username); 
        console.log(username)
        console.log(password)

        try {
            await Authorize(username, password);

                    
            if (isAuthenticated) {
                setErrorMessage("");
                navigate("/app");
            } else {
                setErrorMessage("Wrong username or password");
            }
        }
        catch (error) {
            console.error("Authorization error:", error);
        }
    };

    return (
        <div className="LoginForm">
            <h1> Sign In </h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username <br />
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        className="p-6"
                    />{" "}
                    <br />
                </label>{" "}
                <label htmlFor="password">
                    Password <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        className="p-6"
                    />{" "}
                    <br />
                </label>
                <button formMethod="POST" type="submit" className="bg-zinc-500">
                    {" "}
                    Login {" "}
                </button>
                {errorMessage !== "" && (
                    <p className={`error-message ${errorMessage ? "active" : ""}`}>{errorMessage}</p>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
