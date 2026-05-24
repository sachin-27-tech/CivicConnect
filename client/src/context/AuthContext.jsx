import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/reportApi";

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("civicconnect_user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem("civicconnect_token"));

  const persistSession = (data) => {
    localStorage.setItem("civicconnect_token", data.token);
    localStorage.setItem("civicconnect_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    persistSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("civicconnect_token");
    localStorage.removeItem("civicconnect_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
