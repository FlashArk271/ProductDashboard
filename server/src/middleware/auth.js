import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(userId) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId, error: null };
  } catch (error) {
    return { userId: null, error: 'Invalid or expired token' };
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const { userId, error } = verifyToken(token);
  
  if (error || !userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.userId = userId;
  next();
}
