import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/menu" className="hover:underline">
          Menu
        </Link>
        {user && user.role === "user" && (
          <>
            <Link to="/reservations" className="hover:underline">
              Reservation History
            </Link>
            <Link to="/reserve" className="hover:underline">
              Reserve Table
            </Link>
          </>
        )}
        {user && user.role === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin Panel
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-xl" />
            <span>{user.username}</span>
          </div>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="p-2 bg-gray-500 rounded hover:bg-gray-700 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
