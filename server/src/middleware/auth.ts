import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token || 
                  req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(); // Пропускаем, но не устанавливаем user
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret-key'
    ) as { userId: string; username: string };

    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    // Если токен невалиден, просто продолжаем
    next();
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Для development всегда пропускаем
  next();
};