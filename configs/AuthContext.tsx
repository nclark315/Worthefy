import React, { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] Mounting and subscribing to Firebase auth");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("[onAuthStateChanged] currentUser:", currentUser?.uid || "null");
      setUser(currentUser);

      if (currentUser) {
        await AsyncStorage.setItem('uid', currentUser.uid);
        console.log("[AsyncStorage] Saved UID:", currentUser.uid);
      } else {
        await AsyncStorage.removeItem('uid');
        console.log("[AsyncStorage] Removed UID from storage");
      }

      setLoading(false);
    });
 
    AsyncStorage.getItem('uid').then((cached) => {
      console.log("[Startup] UID in AsyncStorage:", cached);
    });

    return () => {
      console.log("[AuthProvider] Unsubscribing from Firebase auth");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
