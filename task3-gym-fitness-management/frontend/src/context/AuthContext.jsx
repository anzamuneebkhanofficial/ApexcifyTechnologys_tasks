import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebase.js';
import api from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const signup = async (email, password, name, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    const token = await userCredential.user.getIdToken(true);
    localStorage.setItem('token', token);
    const response = await api.post('/auth/register', { name, role });
    setUserData(response.data);
    return userCredential;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);
    try {
      const response = await api.get('/auth/profile');
      setUserData(response.data);
    } catch (err) {
      console.error('Profile fetch after login failed:', err);
    }
    return userCredential;
  };
  const logout = async () => {
    localStorage.removeItem('token');
    setUserData(null);
    setCurrentUser(null);
    return signOut(auth);
  };

  const refreshUserData = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUserData(response.data);
    } catch (err) {
      console.error('refreshUserData failed:', err);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
          const response = await api.get('/auth/profile');
          setUserData(response.data);
        } catch (err) {
          console.error('Auth state profile fetch failed:', err);
          if (err?.response?.status === 401) {
            localStorage.removeItem('token');
            setUserData(null);
            await signOut(auth);
          }
        }
      } else {
        localStorage.removeItem('token');
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
