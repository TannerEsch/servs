const express = require('express');
const app = express();
const { Client } = require('pg');
const bodyParser = require('body-parser');


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
