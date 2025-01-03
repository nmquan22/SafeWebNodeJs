import { useEffect, useState, createContext, useContext } from 'react';
import FormData from "form-data";
import axios from 'axios';
import { apiRoutes } from '../constants/routes';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Authentication states
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [target, setTarget] = useState('');
    const [error, setError] = useState(null);
    const [errorCode, setErrorCode] = useState('');
    const [isValid, setIsValid] = useState('');

    const Authorize = async (username, password) => {
        setIsLoading(true);
        setError(null);
        let response;
        try {
            if (!username || !password) {
                setIsAuthenticated(false);
                return false; // Explicitly return failure
            }

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            console.log("Authorize called with:", username, password);

            try {
                response = await axios.post('http://localhost:5000/validate-user', {
                    username,
                    password,
                  });
                setError(null);
              } catch (err) {
                if (err.response && err.response.status === 404) {
                  setError('User not found');
                  setErrorCode('User not found');
                  console.log("API failed with", errorCode);
                } else {
                  setError('Internal server error');
                  setErrorCode('Internal server error');
                  console.log("API failed with", errorCode);
                }
              }
            console.log("Checking called with:", isValid," ",password);
            if (response.data.success) {
                setIsAuthenticated(true);
                setErrorCode("");
                return true; // Authentication success
            } else {
                setError("Wrong username or password");
                setIsAuthenticated(false);
                setErrorCode(error);
                return false; // Authentication failure
            }
        } catch (error) {
            setError("Authorization error:", error);
            setErrorCode(error);
            setIsAuthenticated(false);
            return false; // Explicitly return failure on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, username, setUsername, Authorize, errorCode, setIsAuthenticated, target, setTarget}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
