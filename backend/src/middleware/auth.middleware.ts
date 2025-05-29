import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';

interface DecodedToken {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized, insufficient permissions' });
    }

    next();
  };
};