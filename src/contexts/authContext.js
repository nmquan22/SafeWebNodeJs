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

    const Authorize = async () => {
        setIsLoading(true)
        try {
            setIsAuthenticated(false);
        } catch (error) {
            setIsAuthenticated(true)
        } finally {
            setIsLoading(false);
        }
    }

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