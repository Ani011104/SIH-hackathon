const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
    //check if token is present and valid
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // verify token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // extracted information is stored in the req body , in our case phone id and role is saved
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
