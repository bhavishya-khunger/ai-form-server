import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;

export default function auth(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded);
  req.user = decoded;
  next();
}