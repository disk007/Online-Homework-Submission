const cloudinary = require('cloudinary').v2;

// ตั้งค่า API credentials
cloudinary.config({ 
  cloud_name: process.env.YOUR_CLOUD_NAME, 
  api_key: process.env.YOUR_API_KEY, 
  api_secret: process.env.YOUR_API_SECRET 
});

module.exports = cloudinary
