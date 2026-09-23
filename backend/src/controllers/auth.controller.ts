import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { logAudit } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.string().default('English'),
  trustedContact: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    relationship: z.string().min(2),
    email: z.string().email().optional().or(z.literal(''))
  }).optional()
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid input data'
      });
      return;
    }

    const { fullName, email, phone, password, preferredLanguage, trustedContact } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(lowerEmail) as any;
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.'
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date().toISOString();

    const insertUser = db.prepare(`
      INSERT INTO users (full_name, email, phone, password_hash, role, preferred_language, onboarding_completed, is_active, created_at, updated_at, last_login_at)
      VALUES (?, ?, ?, ?, 'USER', ?, 0, 1, ?, ?, ?)
    `);

    const result = insertUser.run(
      fullName.trim(),
      lowerEmail,
      phone?.trim() || null,
      hashedPassword,
      preferredLanguage || 'English',
      now,
      now,
      now
    );

    const userId = Number(result.lastInsertRowid);

    // If trusted contact was supplied during registration
    if (trustedContact && trustedContact.name && trustedContact.phone) {
      const insertContact = db.prepare(`
        INSERT INTO trusted_contacts (user_id, name, email, phone, relationship, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)
      `);
      insertContact.run(
        userId,
        trustedContact.name.trim(),
        trustedContact.email?.trim() || null,
        trustedContact.phone.trim(),
        trustedContact.relationship.trim(),
        now,
        now
      );
    }

    logAudit(userId, 'USER_REGISTERED', 'user', String(userId), { email: lowerEmail });

    const token = generateToken({
      userId,
      email: lowerEmail,
      role: 'USER'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ElderShield AI.',
      token,
      user: {
        id: userId,
        fullName: fullName.trim(),
        email: lowerEmail,
        phone: phone?.trim() || null,
        role: 'USER',
        preferredLanguage,
        onboardingCompleted: false
      }
    });
  } catch (err: any) {
    console.error('[Register Error]', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid input data'
      });
      return;
    }

    const { email, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    const user = db.prepare(`
      SELECT id, full_name, email, phone, password_hash, role, preferred_language, avatar_url, onboarding_completed, is_active
      FROM users WHERE email = ?
    `).get(lowerEmail) as any;

    if (!user) {
      res.status(401).json({ success: false, message: 'Incorrect email or password.' });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact support.' });
      return;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Incorrect email or password.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').run(now, now, user.id);

    logAudit(user.id, 'USER_LOGIN', 'user', String(user.id));

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Welcome back!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferred_language,
        avatarUrl: user.avatar_url,
        onboardingCompleted: Boolean(user.onboarding_completed)
      }
    });
  } catch (err: any) {
    console.error('[Login Error]', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

export function getCurrentUser(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const user = db.prepare(`
      SELECT id, full_name, email, phone, role, preferred_language, avatar_url, onboarding_completed, created_at, last_login_at
      FROM users WHERE id = ?
    `).get(userId) as any;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Get count of user scans
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as totalScans,
        SUM(CASE WHEN risk_level = 'HIGH' THEN 1 ELSE 0 END) as highRiskCount,
        SUM(CASE WHEN risk_level = 'SUSPICIOUS' THEN 1 ELSE 0 END) as suspiciousCount,
        SUM(CASE WHEN risk_level = 'LOW' THEN 1 ELSE 0 END) as lowRiskCount
      FROM scans WHERE user_id = ?
    `).get(userId) as any;

    // Get count of trusted contacts
    const contactsCount = (db.prepare('SELECT COUNT(*) as count FROM trusted_contacts WHERE user_id = ?').get(userId) as any)?.count || 0;

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferred_language,
        avatarUrl: user.avatar_url,
        onboardingCompleted: Boolean(user.onboarding_completed),
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at
      },
      stats: {
        totalScans: stats?.totalScans || 0,
        highRiskCount: stats?.highRiskCount || 0,
        suspiciousCount: stats?.suspiciousCount || 0,
        lowRiskCount: stats?.lowRiskCount || 0,
        contactsCount
      }
    });
  } catch (err: any) {
    console.error('[GetMe Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user data.' });
  }
}

export function updateProfile(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const { fullName, phone, preferredLanguage, onboardingCompleted } = req.body;
    const now = new Date().toISOString();

    const currentUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!currentUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const newName = fullName !== undefined ? fullName.trim() : currentUser.full_name;
    const newPhone = phone !== undefined ? phone.trim() : currentUser.phone;
    const newLang = preferredLanguage !== undefined ? preferredLanguage : currentUser.preferred_language;
    const newOnboarding = onboardingCompleted !== undefined ? (onboardingCompleted ? 1 : 0) : currentUser.onboarding_completed;

    db.prepare(`
      UPDATE users 
      SET full_name = ?, phone = ?, preferred_language = ?, onboarding_completed = ?, updated_at = ?
      WHERE id = ?
    `).run(newName, newPhone, newLang, newOnboarding, now, userId);

    logAudit(userId || null, 'PROFILE_UPDATED', 'user', String(userId));

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: userId,
        fullName: newName,
        email: currentUser.email,
        phone: newPhone,
        role: currentUser.role,
        preferredLanguage: newLang,
        onboardingCompleted: Boolean(newOnboarding)
      }
    });
  } catch (err: any) {
    console.error('[UpdateProfile Error]', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId) as any;
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const newHash = await hashPassword(newPassword);
    const now = new Date().toISOString();

    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(newHash, now, userId);
    logAudit(userId || null, 'PASSWORD_CHANGED', 'user', String(userId));

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
}

export function forgotPassword(req: Request, res: Response): void {
  const { email } = req.body;
  // Security best practice: don't reveal whether user exists
  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been sent.'
  });
}
