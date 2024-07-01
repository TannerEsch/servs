const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
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
});

app.post('/users', (req, res) => {
  const { user_id, user_name, user_gmail } = req.body;
  console.log('Received user data:', req.body); 

  if (!user_id || !user_name || !user_gmail) {
    return res.status(400).json({ error: 'User ID, Name, and Gmail are required' });
  }

  pool.query(
    'INSERT INTO users (user_id, user_name, user_gmail) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET user_name = $2, user_gmail = $3',
    [user_id, user_name, user_gmail],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Error storing user data' });
      }
      console.log('User data stored successfully:', result.rowCount); 

      res.status(200).json({ message: 'User data stored successfully' });
    }
  );
});


  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });