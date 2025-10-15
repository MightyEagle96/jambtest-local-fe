// src/context/AppUserContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create context
const AppUserContext = createContext();

// Provider
export const AppUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => setUser(null);

  return (
    <AppUserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AppUserContext.Provider>
  );
};

// Hook to use context easily
export const useAppUser = () => {
  const context = useContext(AppUserContext);
  if (!context) {
    throw new Error("useAppUser must be used within an AppUserProvider");
  }
  return context;
};
