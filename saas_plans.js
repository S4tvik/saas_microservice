const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for SaaS plans
let saasPlans = [
  { id: '1', name: 'Basic', price: 0, trialDays: 14, userLimit: 1 },
  { id: '2', name: 'Standard', price: 4999, userLimit: 5 },
  { id: '3', name: 'Plus', price: 3999, userLimit: 10 },
];

// In-memory storage for Super Admin and SaaS users
let superAdmin = { username: 'admin', password: bcrypt.hashSync('adminpassword', 10) };
let saasUsers = [{ username: 'test', password: bcrypt.hashSync('test', 10), role : "user" }];
// Middleware to check if the user is authenticated
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  let token = req.headers.authorization;
  token = token.replace(/^Bearer\s+/, "");
  console.log('Received token:', token);
  
  try {
    const decoded = jwt.verify(token, '859f3ea8e09533e56656ea3525e186078159880eb5ff77dc70272f42a2dc8d18');
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token ' + String(err) });
  }
  };
  const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: User is not a Super Admin' });
    }
  };
  
  // Middleware to check if the user is a Super Admin
  const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: User is not a Admin' });
    }
  };


// Endpoint to authenticate and get a JWT token
app.post('/super-login', (req, res) => {
  const { username, password } = req.body;

  // Check if the credentials are valid (in-memory check, replace with a database check in a real app)
  if (username === superAdmin.username && bcrypt.compareSync(password, superAdmin.password)) {
    const token = jwt.sign({ username, role: 'superadmin' }, '859f3ea8e09533e56656ea3525e186078159880eb5ff77dc70272f42a2dc8d18', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// SaaS Plan Management
app.get('/saas-plans', (req, res) => {
  res.json(saasPlans);
});

app.post('/saas-plans', isAuthenticated, isAdmin, (req, res) => {
  const newPlan = req.body;
  newPlan.id = newPlan.id.toLowerCase(); // Make the plan ID case-insensitive
  saasPlans.push(newPlan);
  res.json(newPlan);
});

app.put('/saas-plans/:id', isAuthenticated, isSuperAdmin, (req, res) => {
  const planId = req.params.id.toLowerCase();
  const updatedPlan = req.body;

  saasPlans = saasPlans.map((plan) =>
    plan.id === planId ? { ...plan, ...updatedPlan } : plan
  );

  res.json(saasPlans.find((plan) => plan.id === planId));
});

app.delete('/saas-plans/:id', isAuthenticated, isSuperAdmin, (req, res) => {
  const planId = req.params.id.toLowerCase();
  saasPlans = saasPlans.filter((plan) => plan.id !== planId);
  res.json({ message: 'Plan deleted successfully' });
});

app.post('/register-user', isAuthenticated, isAdmin, isSuperAdmin, (req, res) => {
  const { username, password, role, plan } = req.body;

  // In a real-world scenario, you would hash and salt passwords before storing them.
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = { username, password: hashedPassword, role, plan };
  saasUsers.push(newUser);
  console.log(saasUsers);
  res.json(newUser);
});
// to get all the users
app.get('/get-users',isAuthenticated,isSuperAdmin,(req,res)=>{
  res.json(saasUsers);
});

// Endpoint for user login
app.post('/user-login', (req, res) => {
  const { username, password } = req.body;

  // Check if the credentials are valid (in-memory check, replace with a database check in a real app)
  const user = saasUsers.find((u) => u.username === username && bcrypt.compareSync(password, u.password));

  if (user) {
    const token = jwt.sign({ username, role: user.role }, '859f3ea8e09533e56656ea3525e186078159880eb5ff77dc70272f42a2dc8d18', { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
