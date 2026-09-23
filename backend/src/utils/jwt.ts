import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eldershield_super_secure_jwt_secret_key_2026_elder_safety';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
