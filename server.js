require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

mongoose.set('strictQuery', false);

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log('Database connection successful');
    })
  )
  .catch((error) => {
    console.error('Main failed', error.messaage);
    process.exit(1);
  });
