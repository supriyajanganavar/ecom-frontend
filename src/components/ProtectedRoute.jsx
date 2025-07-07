import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/verify");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null)
    return <div className="p-8">Checking auth...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
