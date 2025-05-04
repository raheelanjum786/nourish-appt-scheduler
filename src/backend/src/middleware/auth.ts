
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: 'ADMIN' | 'PROVIDER' | 'CLIENT';
      };
    }
  }
}

export const authorize = (allowedRoles?: ('ADMIN' | 'PROVIDER' | 'CLIENT')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret'
      ) as {
        userId: string;
        email: string;
        role: 'ADMIN' | 'PROVIDER' | 'CLIENT';
      };
      
      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        return res.status(401).json({ message: 'User does not exist' });
      }
      
      // Check role if required
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Set user info in request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
