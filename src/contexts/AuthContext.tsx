"use client";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {getCurrentUser, logout} from "@/services/auth";

interface TableList {
  id: string;
  titulo: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  subscriptions: {
    acceptedList: TableList[];
    pendingList: TableList[];
    deniedList: TableList[];
  };
  ownedTables: TableList[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => void,
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {
  },
  logoutUser: () => {
  },
});

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const u = await getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const logoutUser = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{user, loading, refreshUser, logoutUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}