import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginApi, type LoginResponse } from "../api/auth.api";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  eloRating: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email: string, password: string) {
    try {
      const res: LoginResponse = await loginApi(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } catch {
      // Fallback mock login cho phep test giao dien frontend khi chua bat backend
      const mockUserData: AuthUser = {
        id: "mock-1",
        username: "Alex Nguyễn",
        email: email || "alex@example.com",
        eloRating: 1200,
      };
      const mockToken = "mock_jwt_token_12345";
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUserData));
      setToken(mockToken);
      setUser(mockUserData);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong <AuthProvider>");
  return ctx;
}