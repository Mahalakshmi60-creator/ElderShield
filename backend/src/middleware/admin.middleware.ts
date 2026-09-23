import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges are required to view this resource.'
    });
    return;
  }
  next();
}
