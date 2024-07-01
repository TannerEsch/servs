const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;


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
app.use(bodyParser.json());
app.post('/', (req, res) => {
  const { user_name, user_email } = req.body;
  console.log('Received user data:', req.body); 

  if (!(  user_name && user_email)) {
    return res.status(400).json({ error: ' Name, and Gmail are required' });
  }
  

  pool.query(
    'INSERT INTO users (user_name, user_email) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET user_name = EXCLUDED.user_name, user_email = EXCLUDED.user_email name = $2, user_email = $3',
    [ user_name, user_email],
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