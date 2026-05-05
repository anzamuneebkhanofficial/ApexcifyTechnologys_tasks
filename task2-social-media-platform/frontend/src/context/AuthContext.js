"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('pakmedia_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (username) => {
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                localStorage.setItem('pakmedia_user', JSON.stringify(data));
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pakmedia_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
