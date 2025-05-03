
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

// Authorization middleware
export const authorize = (roles?: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your_jwt_secret'
      ) as {
        userId: string;
        email: string;
        role: UserRole;
      };
      
      // Check if user has required role
      if (roles && roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      
      // Attach user to request object
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
