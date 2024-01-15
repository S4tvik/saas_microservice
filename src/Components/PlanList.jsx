import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom

function PlanCard({ plan, isAuthenticated }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (logged) {
      // If authenticated, perform the action (e.g., add to cart)
      console.log(`Plan added to cart: ${plan.name}`);
    } else {
      // If not authenticated, redirect to the login page
      navigate('/login');
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title">{plan.name}</h3>
        <p className="card-text">Price: ${plan.price}</p>
        <p className="card-text">Trial Days: {plan.trialDays}</p>
        <p className="card-text">User Limit: {plan.userLimit}</p>
        {/* Button click triggers handleButtonClick function */}
        <button className="btn btn-primary" onClick={handleButtonClick} >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
function PlanList() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/saas-plans')
      .then((response) => setPlans(response.data))
      .catch((error) => console.error('Error fetching plans:', error));
  }, []);

  return (
    <div class= "container mb-5 ">
    <h2 className="mb-4 py-5">Browse Plans For Saas App</h2>
    <div class = "container">
    <div className="card-deck">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
    </div>
  </div>
  );
}

export default PlanList;
