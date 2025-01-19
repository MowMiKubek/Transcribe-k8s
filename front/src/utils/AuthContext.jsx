import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const data = { currentUser: { username: 'USERNAME', email: 'EMAIL' } };
            setUser(data.currentUser);
            console.log('User authenticated', data.currentUser);
        } catch (error) {
            console.log(error)
            console.log('User not authenticated');
            logout(); // Token may be invalid; clear it
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Load token and user from localStorage on initial render
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Login function
    const login = async (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        await fetchUser(); // Fetch user data immediately after login
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
