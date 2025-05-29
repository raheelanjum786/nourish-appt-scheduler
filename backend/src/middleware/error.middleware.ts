import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } 
  else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } 
    else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};