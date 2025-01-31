// const express = require('express');
// const mysql = require('mysql2/promise');
// const userRoutes = require('./routes/userRoutes');
// const trainRoutes = require('./routes/trainRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const { DB_CONFIG } = require('./config/database');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());

// // Database Connection

// let connection;
// async function connectDatabase() {
//   try {
//     connection = await mysql.createConnection(DB_CONFIG);
//     console.log('MySQL Database Connected Successfully');
//   } catch (error) {
//     console.error('Database Connection Error:', error);
//     process.exit(1);
//   }
// }

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/trains', trainRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Start Server
// app.listen(PORT,"0.0.0.0", async () => {
//   await connectDatabase();
//   console.log(`Server running on port ${PORT}`);
// });




const express = require('express');
const mysql = require('mysql2/promise');
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { DB_CONFIG } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Set up views folder for EJS files
app.set('views', './views');

// Serve static assets (CSS, images, etc.)
app.use(express.static('public'));

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

// Render the homepage (example route)
app.get('/', (req, res) => {
  res.render('index'); // Render 'index.ejs' page
});

// Define routes for /login and /register
app.get('/login', (req, res) => {
  res.render('login'); // Render 'login.ejs' page
});

app.get('/register', (req, res) => {
  res.render('register'); // Render 'register.ejs' page
});

// Add this route after your other app.get routes
app.get('/booking', async (req, res) => {
  try {
      const trainId = req.query.trainId;
      
      if (!trainId) {
          return res.redirect('/availability');
      }

      // Fetch train details from database
      const [rows] = await connection.execute(
          'SELECT * FROM trains WHERE id = ?',
          [trainId]
      );

      if (rows.length === 0) {
          return res.redirect('/availability');
      }

      // Render the booking page with train details
      res.render('booking', { 
          train: rows[0]
      });

  } catch (error) {
      console.error('Error fetching train details:', error);
      res.status(500).send('Error loading booking page');
  }
});

app.get('/api/trains/availability', async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination are required" });
    }

    // Fetch train data only for the requested route
    const [rows] = await connection.execute(
      'SELECT * FROM trains WHERE source = ? AND destination = ?' ,
      [source, destination]
    );

    res.json(rows); // Send JSON response instead of rendering EJS
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ error: 'Error fetching train data' });
  }
});

// Start Server
app.listen(PORT, "0.0.0.0", async () => {
  await connectDatabase();
  console.log(`Server running on port ${PORT}`);
});
