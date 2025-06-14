
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

const ADMIN_PASSWORD = "makerbrains-admin-radhaji"; // In a real app, this would be stored securely
const ADMIN_LOCAL_STORAGE_KEY = "maker-admin-auth";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if admin is already logged in on component mount
  useEffect(() => {
    const adminAuth = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
    if (adminAuth === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_LOCAL_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_LOCAL_STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
