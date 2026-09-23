import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { db } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & {
    full_name?: string;
    onboarding_completed?: number;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    
    // Verify user is still active in database
    const userRow = db.prepare('SELECT id, full_name, role, is_active, onboarding_completed FROM users WHERE id = ?').get(payload.userId) as any;
    if (!userRow || !userRow.is_active) {
      res.status(401).json({ success: false, message: 'Account is deactivated or does not exist.' });
      return;
    }

    req.user = {
      ...payload,
      full_name: userRow.full_name,
      onboarding_completed: userRow.onboarding_completed
    };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
}
