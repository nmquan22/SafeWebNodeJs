import { useEffect, useState, createContext, useContext } from 'react';
import FormData from "form-data";
import { apiRoutes } from '../constants/routes';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    // Authentication states
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [username, setUsername] = useState('');

    const Authorize = async (username, password) => {
        setIsLoading(true);
    
        try {
            if (!username || !password) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
    
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
    
            console.log("Authorize called with:", username, password);
    
            if (username === "Admin" && password === "test") {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Authorization error:", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const authorizeSession = async () => {
            await Authorize()
        }

        authorizeSession();
    }, [username])

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, username, setUsername, Authorize }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);