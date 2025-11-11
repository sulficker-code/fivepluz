const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
const pool = require('./config/db'); 

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected successfully!');
    conn.release(); 
  })
  .catch(err => console.error(' Error connecting to MySQL:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const roleRoutes = require('./routes/roleRoutes');
app.use('/api/roles', roleRoutes);

const currencyRoute = require("./routes/currencyRoute");
app.use("/api/currency", currencyRoute);

// Test route
app.get('/', (req, res) => res.send('Backend running successfully with MySQL!'));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
