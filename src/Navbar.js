import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ loggedInUser }) {
  const handleLogout = () => {
    // Perform logout logic (clear token, etc.)
    localStorage.removeItem('token');
    // You might want to update the state or perform other actions on logout
    
  };

  return (
    <div className='container'>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Your App
      </Link>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {loggedInUser ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
    </div>
  );
}

export default Navbar;