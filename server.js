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

app.post('/', async (req, res) => {
    console.log('working');

    try {
        const userData = req.body;
        if (!userData.name || !userData.email) {
            res.status(400).send('Invalid user data');
            return;
        }

        const query = {
            text: 'INSERT INTO users(user_name, user_gmail) VALUES($1, $2)',
            values: [userData.name, userData.email],
        };

        const client = await pool.connect();
        try {
            await client.query(query);
            res.status(201).send('User information inserted into the database');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error inserting user information into the database:', error);
        res.status(500).send('Error inserting user information into the database');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
