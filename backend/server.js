// Add this AT THE VERY TOP
require('dotenv').config({ path: `${__dirname}/.env` });  // Explicit path

console.log('Checking environment variables...');
console.log('MONGO_URI:', process.env.MONGO_URI);  // Should show your URI
console.log('PORT:', process.env.PORT);

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});