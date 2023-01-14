const mongoose = require('mongoose');
const app = require('./app');
mongoose.set('strictQuery', false);
const dotenv = require('dotenv');

dotenv.config();

const { DB_HOST, PORT = 3000 } = process.env;

async function main() { 
  try {
    await mongoose.connect(DB_HOST);
    app.listen(PORT, () => {
    console.log("Database connection successful")
    });      
  }
    catch(error) {
      console.error('Main failed', error.messaage);
      process.exit(1);
    };
};

main();





