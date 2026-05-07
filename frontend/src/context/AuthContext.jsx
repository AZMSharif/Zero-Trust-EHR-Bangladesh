import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import api from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ehr-user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem("ehr-token") || null);

  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem("ehr-token", tokenValue);
    localStorage.setItem("ehr-user", JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ehr-token");
    localStorage.removeItem("ehr-user");
    localStorage.removeItem("ehr-grant");
    setToken(null);
    setUser(null);
  }, []);

  const isDoctor = useMemo(() => user?.role === "doctor", [user]);
  const isPatient = useMemo(() => user?.role === "patient", [user]);
  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isDoctor, isPatient, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
