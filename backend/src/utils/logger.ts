import { db } from '../config/database';

export function logAudit(
  actorUserId: number | null,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, any>
) {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      actorUserId,
      action,
      targetType || null,
      targetId || null,
      metadata ? JSON.stringify(metadata) : null,
      new Date().toISOString()
    );
  } catch (err) {
    console.error('[AuditLog Error]', err);
  }
}

export const logger = {
  info: (msg: string, meta?: any) => console.log(`[INFO] ${new Date().toISOString()}: ${msg}`, meta || ''),
  warn: (msg: string, meta?: any) => console.warn(`[WARN] ${new Date().toISOString()}: ${msg}`, meta || ''),
  error: (msg: string, meta?: any) => console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`, meta || ''),
};
