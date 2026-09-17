import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'university_secret_key';

    let decoded;

    // Support both signed JWT tokens and demo tokens
    if (token.startsWith('MOCK_JWT_TOKEN_') || token.startsWith('JWT_TOKEN_')) {
      try {
        const base64Part = token
          .replace(/^MOCK_JWT_TOKEN_/, '')
          .replace(/^JWT_TOKEN_DEMO_/, '')
          .replace(/^JWT_TOKEN_/, '');
        decoded = JSON.parse(Buffer.from(base64Part, 'base64').toString('utf8'));
      } catch (e) {
        // Fallback role resolution for demo tokens
        const role = token.includes('OFFICER')
          ? 'ADMISSION_OFFICER'
          : token.includes('FACULTY')
          ? 'FACULTY'
          : token.includes('ADMIN')
          ? 'ADMIN'
          : 'STUDENT';

        const fallbackUser = await User.findOne({ role });
        if (fallbackUser) {
          req.user = fallbackUser;
          return next();
        }
      }
    }

    if (!decoded) {
      decoded = jwt.verify(token, secret);
    }

    // Look up fresh user from DB
    let user = null;
    if (decoded.id || decoded._id) {
      user = await User.findById(decoded.id || decoded._id).select('-password');
    }
    if (!user && decoded.email) {
      user = await User.findOne({ email: decoded.email.toLowerCase() }).select('-password');
    }

    if (!user) {
      // If user exists as student payload
      req.user = decoded;
    } else {
      req.user = user;
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
};

export default authenticateToken;
