// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as authApi from "../services/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { token: t, role: r } = await authApi.login(email, password);
      setToken(t);
      setRole(r);
      localStorage.setItem("token", t);
      localStorage.setItem("role", r);
      return r; // caller redirects based on this
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      return await authApi.register({ name, email, password });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  const isAdmin = role === "admin";
  const isPatient = role === "patient";

  const value = useMemo(
    () => ({
      token,
      role,
      loading,
      error,
      isAuthed: Boolean(token),
      isAdmin,
      isPatient,
      login,
      register,
      logout,
      // backward-compat so old components still work
      signout: logout,
    }),
    [token, role, loading, error, isAdmin, isPatient, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
