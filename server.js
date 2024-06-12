const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const pool = new Pool({
    user: 'avnadmin',
    host: 'pg-3e7f2846-postgresqldb.g.aivencloud.com',
    database: 'chatapp',
    password: 'AVNS_C4x7Sfu9yg1PN9RxchX',
    port: 15264,
});

app.post('/addUser', async (req, res) => {
    console.log('Received a POST request to /addUser');

    try {
        const userData = req.body;

        const query = {
            text: 'INSERT INTO users(user_name, user_gmail) VALUES($1, $2)',
            values: [userData.name, userData.email],
        };

        const client = await pool.connect();
        await client.query(query);
        client.release();

        res.status(201).send('User information inserted into the database');
    } catch (error) {
        console.error('Error inserting user information into the database:', error);
        res.status(500).send('Error inserting user information into the database');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
