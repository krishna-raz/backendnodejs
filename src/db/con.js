require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect( process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((error) => {
    console.log('Connection failed!');
    console.log(error);
  });
