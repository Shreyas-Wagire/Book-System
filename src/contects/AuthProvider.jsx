import React, { createContext, useEffect, useState } from 'react';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import app from '../firebase/firebase.config';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Generate JWT token
    const generateToken = async (currentUser) => {
        if (!currentUser) return;
        
        try {
            // First try to get Firebase ID token
            const idToken = await currentUser.getIdToken(true);
            localStorage.setItem('auth-token', idToken);
            return idToken;
        } catch (error) {
            console.error('Error generating Firebase token:', error);
            
            // Fallback to server-generated JWT
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: currentUser.email,
                        uid: currentUser.uid
                    }),
                });
                
                const data = await response.json();
                
                if (data.success && data.token) {
                    localStorage.setItem('auth-token', data.token);
                    return data.token;
                } else {
                    throw new Error(data.message || 'Failed to get token from server');
                }
            } catch (serverError) {
                console.error('Error getting token from server:', serverError);
                setError('Failed to authenticate with server. Please try again.');
                throw serverError;
            }
        }
    };

    // Create user with email and password
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            setError(null);
            
            // Generate and store token
            await generateToken(result.user);
            
            return result;
        } catch (error) {
            console.error('Signup error:', error);
            if (error.code === 'auth/email-already-in-use') {
                setError('Email is already registered. Please login instead.');
            } else {
                setError('Failed to create account. Please try again.');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with email and password
    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            setError(null);
            
            // Generate and store token
            await generateToken(result.user);
            
            // Check if user is admin
            if (email === import.meta.env.VITE_ADMIN_EMAIL && 
                password === import.meta.env.VITE_ADMIN_PASSWORD) {
                localStorage.setItem('userRole', 'admin');
            }
            
            return result;
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('Failed to login. Please try again.');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            setError(null);
            
            // Generate and store token
            await generateToken(result.user);
            
            // Check if Google user is admin
            if (result.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
                localStorage.setItem('userRole', 'admin');
            }
            
            return result;
        } catch (error) {
            console.error('Google login error:', error);
            setError('Failed to login with Google. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign out
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('userRole');
            localStorage.removeItem('auth-token');
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
            setError('Failed to logout. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Check auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Refresh token when auth state changes
                await generateToken(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        error,
        createUser,
        login,
        loginWithGoogle,
        logOut,
        setError,
        isAdmin: () => localStorage.getItem('userRole') === 'admin',
        getToken: () => localStorage.getItem('auth-token'),
        refreshToken: (currentUser) => generateToken(currentUser || user)
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;