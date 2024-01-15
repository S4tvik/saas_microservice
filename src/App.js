import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import PlanList from './Components/PlanList';
import Cart from './Components/Cart';
import Checkout from './Components/Checkout';
import LoginForm from './Components/LoginForm';
import Register from './Components/Register';
import UserDashboard from './Components/UserDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import SuperAdminDashboard from './Components/Dashboard/SuperAdminDashboard';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  return (
    <Router>
      <div>
        {/* Navbar is added here */}
        <Navbar loggedInUser={loggedInUser} />

        {/* Routes for different components */}
        <Routes>
          <Route path="/" element={<PlanList />} />
          <Route path="/cart" element={<Cart loggedInUser={loggedInUser} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;