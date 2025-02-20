const jwt = require("jsonwebtoken")
require('dotenv').config()
// const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // เปลี่ยนมาเช็คผ่าน cookie ที่ใส่ไปแทน
  
    if (token == null) return res.json.sendStatus(401); // if there isn't any token
  
    try {
      const user = jwt.verify(token, secret);
      req.user = user;
      console.log("user", user);
      next();
    } catch (error) {
      return res.json.sendStatus(403);
    }
};

module.exports = authenticateToken;