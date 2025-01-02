import { useEffect, useState, createContext, useContext } from 'react';
import FormData from "form-data";
import { apiRoutes } from '../constants/routes';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Authentication states
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');

    const Authorize = async (username, password) => {
        setIsLoading(true);
        try {
            if (!username || !password) {
                setIsAuthenticated(false);
                return false; // Explicitly return failure
            }

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            console.log("Authorize called with:", username, password);

            // Mock authentication logic
            if (username === "Admin" && password === "test") {
                setIsAuthenticated(true);
                return true; // Authentication success
            } else {
                setIsAuthenticated(false);
                return false; // Authentication failure
            }
        } catch (error) {
            console.error("Authorization error:", error);
            setIsAuthenticated(false);
            return false; // Explicitly return failure on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, username, setUsername, Authorize }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
