import { ShoppingBag, ShoppingCart } from "lucide-react"; // Add ShoppingCart import
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Dummy Store</span>
          </Link>

          <div className="space-x-4 flex items-center">
            {isAuthenticated === null ? null : isAuthenticated ? (
              <>
                <Link to="/cart" className="inline-block align-middle">
                  <ShoppingCart className="h-7 w-7 text-blue-600" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-blue-600 font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
