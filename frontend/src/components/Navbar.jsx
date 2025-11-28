import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-white via-slate-50 to-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-extrabold text-slate-800">My Blog</Link>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/grindtech" className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 font-semibold">GrindTech</Link>
          
          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-sm px-3 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50">Sign In</Link>
              <Link to="/signup" className="text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Sign Up</Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/create" className="text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Create</Link>
              <button onClick={handleSignOut} className="text-sm px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
