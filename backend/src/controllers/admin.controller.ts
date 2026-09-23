import { Response } from 'express';
import { db } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { logAudit } from '../utils/logger';

function maskPhone(phone: string | null): string {
  if (!phone) return 'N/A';
  const clean = phone.trim();
  if (clean.length <= 4) return '***';
  return clean.substring(0, 3) + '****' + clean.substring(clean.length - 2);
}

export function getAdminDashboard(req: AuthenticatedRequest, res: Response): void {
  try {
    const totalUsers = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'USER'").get() as any)?.count || 0;
    const activeUsers = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'USER' AND is_active = 1").get() as any)?.count || 0;
    const totalScans = (db.prepare('SELECT COUNT(*) as count FROM scans').get() as any)?.count || 0;
    const highRiskAlerts = (db.prepare("SELECT COUNT(*) as count FROM scans WHERE risk_level = 'HIGH'").get() as any)?.count || 0;

    // Risk distribution
    const riskDistribution = db.prepare(`
      SELECT risk_level as level, COUNT(*) as count
      FROM scans
      GROUP BY risk_level
    `).all() as any[];

    // Category distribution
    const categoryDistribution = db.prepare(`
      SELECT category, COUNT(*) as count
      FROM scans
      GROUP BY category
      ORDER BY count DESC
      LIMIT 6
    `).all() as any[];

    // Recent scans (privacy preserved: category, risk, date, scan_type only)
    const recentActivity = db.prepare(`
      SELECT s.id, s.scan_type, s.risk_level, s.risk_score, s.category, s.created_at, u.full_name as user_name
      FROM scans s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 10
    `).all() as any[];

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalScans,
        highRiskAlerts
      },
      charts: {
        riskDistribution,
        categoryDistribution
      },
      recentActivity
    });
  } catch (err: any) {
    console.error('[AdminDashboard Error]', err);
    res.status(500).json({ success: false, message: 'Failed to load admin dashboard data.' });
  }
}

export function getAdminUsers(req: AuthenticatedRequest, res: Response): void {
  try {
    const users = db.prepare(`
      SELECT 
        u.id, u.full_name, u.email, u.phone, u.role, u.preferred_language, 
        u.is_active, u.created_at, u.last_login_at,
        COUNT(s.id) as total_scans,
        SUM(CASE WHEN s.risk_level = 'HIGH' THEN 1 ELSE 0 END) as high_risk_scans
      FROM users u
      LEFT JOIN scans s ON u.id = s.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all() as any[];

    const sanitizedUsers = users.map(u => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phone: maskPhone(u.phone),
      role: u.role,
      preferredLanguage: u.preferred_language,
      isActive: Boolean(u.is_active),
      createdAt: u.created_at,
      lastLoginAt: u.last_login_at,
      totalScans: u.total_scans || 0,
      highRiskScans: u.high_risk_scans || 0
    }));

    res.json({ success: true, users: sanitizedUsers });
  } catch (err: any) {
    console.error('[AdminUsers Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users list.' });
  }
}

export function getAdminUserDetail(req: AuthenticatedRequest, res: Response): void {
  try {
    const targetUserId = Number(req.params.id);
    const user = db.prepare(`
      SELECT id, full_name, email, phone, role, preferred_language, is_active, created_at, updated_at, last_login_at
      FROM users WHERE id = ?
    `).get(targetUserId) as any;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const scanStats = db.prepare(`
      SELECT 
        COUNT(*) as totalScans,
        SUM(CASE WHEN risk_level = 'HIGH' THEN 1 ELSE 0 END) as highRisk,
        SUM(CASE WHEN risk_level = 'SUSPICIOUS' THEN 1 ELSE 0 END) as suspicious,
        SUM(CASE WHEN risk_level = 'LOW' THEN 1 ELSE 0 END) as lowRisk
      FROM scans WHERE user_id = ?
    `).get(targetUserId) as any;

    // Fetch privacy-preserved recent scan summary (no raw message text!)
    const recentScans = db.prepare(`
      SELECT id, scan_type, risk_level, risk_score, category, summary, created_at
      FROM scans WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 15
    `).all(targetUserId);

    const contacts = db.prepare(`
      SELECT id, name, relationship, is_active, created_at
      FROM trusted_contacts WHERE user_id = ?
    `).all(targetUserId);

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: maskPhone(user.phone),
        role: user.role,
        preferredLanguage: user.preferred_language,
        isActive: Boolean(user.is_active),
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at
      },
      stats: {
        totalScans: scanStats?.totalScans || 0,
        highRisk: scanStats?.highRisk || 0,
        suspicious: scanStats?.suspicious || 0,
        lowRisk: scanStats?.lowRisk || 0
      },
      recentScans,
      contacts
    });
  } catch (err: any) {
    console.error('[AdminUserDetail Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
  }
}

export function toggleUserStatus(req: AuthenticatedRequest, res: Response): void {
  try {
    const adminId = req.user?.userId;
    const targetUserId = Number(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400).json({ success: false, message: 'isActive must be a boolean.' });
      return;
    }

    const user = db.prepare('SELECT id, role, email FROM users WHERE id = ?').get(targetUserId) as any;
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.role === 'ADMIN' && !isActive) {
      res.status(400).json({ success: false, message: 'Cannot deactivate an administrator account.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?').run(isActive ? 1 : 0, now, targetUserId);

    logAudit(adminId || null, isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', 'user', String(targetUserId), {
      email: user.email
    });

    res.json({
      success: true,
      message: `User account has been ${isActive ? 'activated' : 'deactivated'}.`,
      isActive
    });
  } catch (err: any) {
    console.error('[ToggleUserStatus Error]', err);
    res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
}

export function getAdminScans(req: AuthenticatedRequest, res: Response): void {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const scans = db.prepare(`
      SELECT s.id, s.scan_type, s.risk_level, s.risk_score, s.category, s.summary, s.created_at, u.full_name as user_name, u.email as user_email
      FROM scans s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT ?
    `).all(limit);

    res.json({ success: true, scans });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load system scans.' });
  }
}

export function getAdminAlerts(req: AuthenticatedRequest, res: Response): void {
  try {
    const alerts = db.prepare(`
      SELECT 
        a.id, a.alert_type, a.status, a.message, a.created_at,
        u.full_name as user_name,
        tc.name as contact_name, tc.phone as contact_phone
      FROM alerts a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN trusted_contacts tc ON a.trusted_contact_id = tc.id
      ORDER BY a.created_at DESC
      LIMIT 50
    `).all();

    res.json({ success: true, alerts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load system alerts.' });
  }
}

export function getAdminAnalytics(req: AuthenticatedRequest, res: Response): void {
  try {
    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count, AVG(risk_score) as avgScore
      FROM scans
      GROUP BY category
      ORDER BY count DESC
    `).all();

    const typeStats = db.prepare(`
      SELECT scan_type, COUNT(*) as count
      FROM scans
      GROUP BY scan_type
    `).all();

    const riskStats = db.prepare(`
      SELECT risk_level, COUNT(*) as count
      FROM scans
      GROUP BY risk_level
    `).all();

    res.json({
      success: true,
      analytics: {
        categoryStats,
        typeStats,
        riskStats
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics.' });
  }
}

export function getAdminAuditLogs(req: AuthenticatedRequest, res: Response): void {
  try {
    const logs = db.prepare(`
      SELECT al.id, al.action, al.target_type, al.target_id, al.metadata, al.created_at, u.full_name as actor_name, u.email as actor_email
      FROM audit_logs al
      LEFT JOIN users u ON al.actor_user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `).all();

    res.json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
}
