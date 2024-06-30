const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
const corsOptions = {
  origin: 'https://chat-app-tawny-seven.vercel.app/chat.html#state=pass-through%20value&access_token=ya29.a0AXooCgvbnHST819r4OsjIzRwAssKs5ZMuI9HJPH-XD7LF91VyVJN1xBEvtlso-q-vQcegiW6D1B0oo3q_ImpyjMyr6T1hUV7OvNfsDF_8bZP925nS2k1SN3DPD_v1LTMZbyzCuqD7_gZOZk3BtMURb2KZ_02EPRKvwZaaCgYKAegSARMSFQHGX2MiiD8ysd_GSJGs-y55Z6X7IA0171&token_type=Bearer&expires_in=3599&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid&authuser=1&prompt=none',
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

app.post('/', (req, res) => {
    const userData = req.body;
    if (!userData || !userData.name || !userData.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET name = $1', 
      [userData.name, userData.email], 
      (err, result) => {
        if (err) {
          console.error('Error storing user data:', err);
          return res.status(500).json({ error: 'Error storing user data' });
        }
        res.status(200).json({ message: 'User data stored successfully' });
      }
    );
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });