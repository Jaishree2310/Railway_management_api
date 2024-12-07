const express = require('express');
const mysql = require('mysql2/promise');
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { DB_CONFIG } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
let connection;
async function connectDatabase() {
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('MySQL Database Connected Successfully');
  } catch (error) {
    console.error('Database Connection Error:', error);
    process.exit(1);
  }
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);

// Start Server
app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server running on port ${PORT}`);
});