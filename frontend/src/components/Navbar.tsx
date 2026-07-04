import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              DocMind
            </Link>
            <div className="hidden md:block ml-10 space-x-4">
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/documents" className="hover:text-gray-300">
                Documents
              </Link>
              <Link to="/conversations" className="hover:text-gray-300">
                Conversations
              </Link>
              <Link to="/chat" className="hover:text-gray-300">
                Chat
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
              >
                Logout
              </button>
            ) : null}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-600">
            Dashboard
          </Link>
          <Link to="/documents" className="block px-4 py-2 hover:bg-gray-600">
            Documents
          </Link>
          <Link to="/conversations" className="block px-4 py-2 hover:bg-gray-600">
            Conversations
          </Link>
          <Link to="/chat" className="block px-4 py-2 hover:bg-gray-600">
            Chat
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
          ) : null}
        </div>
      )}
    </nav>
  );
};

export default Navbar;