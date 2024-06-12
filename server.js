const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
const cors = require('cors'); 

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('GET / request handled');
  });
  
  const pool = new Pool({
      user: process.env.DB_USER || 'avnadmin',
      host: process.env.DB_HOST || 'pg-3e7f2846-postgresqldb.g.aivencloud.com',
      database: process.env.DB_NAME || 'chatapp',
      password: process.env.DB_PASSWORD || 'AVNS_C4x7Sfu9yg1PN9RxchX',
      port: process.env.DB_PORT || 15264,
  });
  
  app.post('/addUser', async (req, res) => {
      console.log('Received a POST request to /addUser');
      
      try {
          const userData = req.body;
          console.log('User data received:', userData);
  
          if (!userData.name || !userData.email) {
              console.log('Invalid user data');
              res.status(400).send('Invalid user data');
              return;
          }
  
          const query = {
              text: 'INSERT INTO users(user_name, user_gmail) VALUES($1, $2)',
              values: [userData.name, userData.email],
          };
  
          console.log('Query to be executed:', query);
  
          const client = await pool.connect();
          try {
              await client.query(query);
              console.log('User information inserted into the database');
              res.status(201).send('User information inserted into the database');
          } finally {
              client.release();
              console.log('Database client released');
          }
      } catch (error) {
          console.error('Error inserting user information into the database:', error);
          res.status(500).send('Error inserting user information into the database');
      }
  });
  
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });