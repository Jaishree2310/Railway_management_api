const { ADMIN_API_KEY } = require('../config/database');

const authenticateAdmin = (req, res, next) => {
  const apiKey = req.header('X-Admin-API-Key');
  
  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({ error: 'Unauthorized admin access' });
  }
  
  next();
};

module.exports = { authenticateAdmin };