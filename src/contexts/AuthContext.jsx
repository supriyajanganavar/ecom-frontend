import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await api.get("/auth/verify");
      setIsAuthenticated(true);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
