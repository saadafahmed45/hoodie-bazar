"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase";

const AuthContext = createContext({
  user: null,
  loading: true,
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
});

export function getAuthErrorMessage(error) {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";

  switch (code) {
    case "auth/invalid-email":
      return "The email address is improperly formatted.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before completion.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase console.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few moments before trying again.";
    default:
      return error.message || "An authentication error occurred.";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      return userCredential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  // Sign up with email, password, and optional full name
  const signupWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (displayName && displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        });
        // Force refresh user state with updated displayName
        setUser({ ...userCredential.user, displayName: displayName.trim() });
      }
      return userCredential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  // Sign in with Google Popup
  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      return userCredential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  // Update profile details
  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (!auth.currentUser) throw new Error("No user currently logged in.");
    try {
      const updates = {};
      if (displayName !== undefined) updates.displayName = displayName;
      if (photoURL !== undefined) updates.photoURL = photoURL;
      await updateProfile(auth.currentUser, updates);
      setUser({ ...auth.currentUser, ...updates });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const value = {
    user,
    loading,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
