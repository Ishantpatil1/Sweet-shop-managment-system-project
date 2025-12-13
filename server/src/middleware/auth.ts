import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  role: 'user' | 'admin';
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user as AuthPayload | undefined;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};