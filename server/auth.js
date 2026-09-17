const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kongu_budget_mgmt_secret_key_2026_super_secure';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const authMiddleware = (requiredRole = null) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. Please log in first.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    }

    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ success: false, message: `Forbidden. Requires ${requiredRole} privileges.` });
    }

    req.user = decoded;
    next();
  };
};

module.exports = {
  JWT_SECRET,
  generateToken,
  verifyToken,
  authMiddleware
};
