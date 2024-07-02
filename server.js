const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Apply middleware before defining routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://chat-app-tawny-seven.vercel.app',
  methods: 'GET, POST, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {
  res.send('Hello Work!!!!');
});

const pool = new Pool({
  user: 'avnadmin',
  host: 'pg-3e7f2846-postgresqldb.g.aivencloud.com',
  database: 'chatapp',
  password: 'AVNS_C4x7Sfu9yg1PN9RxchX',
  port: 15264,
  ssl: {
    rejectUnauthorized: false // Use this only for testing. In production, use proper SSL verification.
  }
});


app.post('/', (req, res) => {
  console.log("Request body:", req.body);
  const { user_name, user_email } = req.body;

  if (!(user_name && user_email)) {
    return res.status(400).json({ error: 'Name and Gmail are required' });
  }
  
  const query = 'INSERT INTO users (user_name, user_gmail) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET user_name = EXCLUDED.user_name, user_gmail = EXCLUDED.user_gmail'
  const values = [user_name, user_email];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query:', err.message, err.stack);
      return res.status(500).json({ error: 'Error storing user data', details: err.message });
    }

    console.log('User data stored successfully.', result.rowCount);
    res.status(200).json({ message: 'User data stored successfully' });
  });
});

async function ensureUserGmailColumn() {
  const client = await pool.connect();
  try {
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='user_gmail';
    `;
    const { rows } = await client.query(checkColumnQuery);

    if (rows.length === 0) {
      console.log("user_gmail column doesn't exist. Attempting to add it...");
      await client.query('ALTER TABLE users ADD COLUMN user_gmail VARCHAR(255) NOT NULL');
      console.log("user_gmail column added successfully.");
    } else {
      console.log("user_gmail column already exists.");
    }
  } catch (err) {
    console.error("Error ensuring user_gmail column:", err);
  } finally {
    client.release();
  }
}

// Update the function call
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await ensureUserGmailColumn();
});
