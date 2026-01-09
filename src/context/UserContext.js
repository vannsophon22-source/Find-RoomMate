"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // no need to check localStorage

  // No localStorage load here
  useEffect(() => {
    setLoading(false); // ready
  }, []);

  const login = (userData) => {
    setUser(userData); // only in memory
    // ❌ Do NOT save to localStorage
  };

  const logout = () => {
    setUser(null); // remove from memory
    // ❌ Do NOT touch localStorage
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
