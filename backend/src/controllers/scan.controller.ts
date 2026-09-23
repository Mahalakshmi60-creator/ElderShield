import { Response } from 'express';
import crypto from 'crypto';
import { db } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { analyzeScamRisk } from '../services/risk.service';
import { analyzeLink } from '../services/link.service';
import { logAudit } from '../utils/logger';

function hashInput(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

function truncatePreview(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export async function scanMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Please provide message text to analyze.' });
      return;
    }

    const analysis = analyzeScamRisk(message, 'MESSAGE');
    const inputHash = hashInput(message);
    const now = new Date().toISOString();
    const preview = truncatePreview(message.trim(), 80);

    // Save scan to database
    const insertScan = db.prepare(`
      INSERT INTO scans (user_id, scan_type, input_hash, risk_score, risk_level, category, summary, raw_preview, created_at)
      VALUES (?, 'MESSAGE', ?, ?, ?, ?, ?, ?, ?)
    `);

    const scanResult = insertScan.run(
      userId,
      inputHash,
      analysis.riskScore,
      analysis.riskLevel,
      analysis.category,
      analysis.summary,
      preview,
      now
    );

    const scanId = Number(scanResult.lastInsertRowid);

    // Save signals
    const insertSignal = db.prepare(`
      INSERT INTO scan_signals (scan_id, signal_type, label, severity, evidence, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const sig of analysis.signals) {
      insertSignal.run(scanId, sig.type, sig.label, sig.severity, sig.evidence, now);
    }

    // If HIGH risk, automatically prepare an alert record for trusted contacts
    let alertCreated = false;
    if (analysis.riskLevel === 'HIGH' && userId) {
      const contacts = db.prepare('SELECT id, name, phone FROM trusted_contacts WHERE user_id = ? AND is_active = 1').all(userId) as any[];
      if (contacts && contacts.length > 0) {
        const insertAlert = db.prepare(`
          INSERT INTO alerts (user_id, scan_id, trusted_contact_id, alert_type, status, message, created_at)
          VALUES (?, ?, ?, 'HIGH_RISK_SCAM_DETECTED', 'PENDING', ?, ?)
        `);
        for (const c of contacts) {
          insertAlert.run(
            userId,
            scanId,
            c.id,
            `High-risk scam detected (${analysis.categoryLabel}) for your contact. Score: ${analysis.riskScore}/100.`,
            now
          );
        }
        alertCreated = true;
      }
    }

    logAudit(userId || null, 'MESSAGE_SCANNED', 'scan', String(scanId), {
      riskLevel: analysis.riskLevel,
      riskScore: analysis.riskScore,
      category: analysis.category
    });

    res.json({
      success: true,
      scanId,
      analysis,
      alertCreated,
      createdAt: now
    });
  } catch (err: any) {
    console.error('[ScanMessage Error]', err);
    res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
  }
}

export async function scanLink(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Please provide a URL to check.' });
      return;
    }

    const analysis = analyzeLink(url);
    const inputHash = hashInput(url);
    const now = new Date().toISOString();
    const preview = truncatePreview(url.trim(), 80);

    const insertScan = db.prepare(`
      INSERT INTO scans (user_id, scan_type, input_hash, risk_score, risk_level, category, summary, raw_preview, created_at)
      VALUES (?, 'LINK', ?, ?, ?, ?, ?, ?, ?)
    `);

    const scanResult = insertScan.run(
      userId,
      inputHash,
      analysis.riskScore,
      analysis.riskLevel,
      analysis.category,
      analysis.summary,
      preview,
      now
    );

    const scanId = Number(scanResult.lastInsertRowid);

    const insertSignal = db.prepare(`
      INSERT INTO scan_signals (scan_id, signal_type, label, severity, evidence, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const sig of analysis.signals) {
      insertSignal.run(scanId, sig.type, sig.label, sig.severity, sig.evidence, now);
    }

    logAudit(userId || null, 'LINK_SCANNED', 'scan', String(scanId), {
      riskLevel: analysis.riskLevel,
      riskScore: analysis.riskScore,
      domain: analysis.domain
    });

    res.json({
      success: true,
      scanId,
      analysis,
      createdAt: now
    });
  } catch (err: any) {
    console.error('[ScanLink Error]', err);
    res.status(500).json({ success: false, message: 'Link analysis failed.' });
  }
}

export async function scanCall(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Please provide a call transcript or spoken text to analyze.' });
      return;
    }

    const analysis = analyzeScamRisk(transcript, 'CALL');
    const inputHash = hashInput(transcript);
    const now = new Date().toISOString();
    const preview = truncatePreview(transcript.trim(), 80);

    const insertScan = db.prepare(`
      INSERT INTO scans (user_id, scan_type, input_hash, risk_score, risk_level, category, summary, raw_preview, created_at)
      VALUES (?, 'CALL', ?, ?, ?, ?, ?, ?, ?)
    `);

    const scanResult = insertScan.run(
      userId,
      inputHash,
      analysis.riskScore,
      analysis.riskLevel,
      analysis.category,
      analysis.summary,
      preview,
      now
    );

    const scanId = Number(scanResult.lastInsertRowid);

    const insertSignal = db.prepare(`
      INSERT INTO scan_signals (scan_id, signal_type, label, severity, evidence, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const sig of analysis.signals) {
      insertSignal.run(scanId, sig.type, sig.label, sig.severity, sig.evidence, now);
    }

    logAudit(userId || null, 'CALL_SCANNED', 'scan', String(scanId), {
      riskLevel: analysis.riskLevel,
      riskScore: analysis.riskScore,
      category: analysis.category
    });

    res.json({
      success: true,
      scanId,
      analysis,
      createdAt: now
    });
  } catch (err: any) {
    console.error('[ScanCall Error]', err);
    res.status(500).json({ success: false, message: 'Call analysis failed.' });
  }
}

export function getUserScans(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const typeFilter = req.query.type ? String(req.query.type).toUpperCase() : null;
    const riskFilter = req.query.risk ? String(req.query.risk).toUpperCase() : null;

    let query = 'SELECT * FROM scans WHERE user_id = ?';
    const params: any[] = [userId];

    if (typeFilter && ['MESSAGE', 'LINK', 'CALL'].includes(typeFilter)) {
      query += ' AND scan_type = ?';
      params.push(typeFilter);
    }

    if (riskFilter && ['LOW', 'SUSPICIOUS', 'HIGH'].includes(riskFilter)) {
      query += ' AND risk_level = ?';
      params.push(riskFilter);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const scans = db.prepare(query).all(...params) as any[];

    // Fetch signal count for each scan
    const enrichedScans = scans.map(s => {
      const signals = db.prepare('SELECT signal_type, label, severity, evidence FROM scan_signals WHERE scan_id = ?').all(s.id) as any[];
      return {
        id: s.id,
        scanType: s.scan_type,
        riskScore: s.risk_score,
        riskLevel: s.risk_level,
        category: s.category,
        summary: s.summary,
        preview: s.raw_preview,
        createdAt: s.created_at,
        signals
      };
    });

    const totalCountRow = db.prepare('SELECT COUNT(*) as count FROM scans WHERE user_id = ?').get(userId) as any;

    res.json({
      success: true,
      scans: enrichedScans,
      total: totalCountRow?.count || 0,
      limit,
      offset
    });
  } catch (err: any) {
    console.error('[GetUserScans Error]', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve scan history.' });
  }
}

export function getScanById(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const scanId = Number(req.params.id);

    const scan = db.prepare('SELECT * FROM scans WHERE id = ?').get(scanId) as any;
    if (!scan) {
      res.status(404).json({ success: false, message: 'Scan record not found.' });
      return;
    }

    // Only allow owner or admin
    if (scan.user_id !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const signals = db.prepare('SELECT id, signal_type, label, severity, evidence, created_at FROM scan_signals WHERE scan_id = ?').all(scanId);

    res.json({
      success: true,
      scan: {
        id: scan.id,
        userId: scan.user_id,
        scanType: scan.scan_type,
        riskScore: scan.risk_score,
        riskLevel: scan.risk_level,
        category: scan.category,
        summary: scan.summary,
        preview: scan.raw_preview,
        createdAt: scan.created_at,
        signals
      }
    });
  } catch (err: any) {
    console.error('[GetScanById Error]', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve scan details.' });
  }
}

export function triggerContactAlert(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const { scanId, contactId, note } = req.body;
    const now = new Date().toISOString();

    const contacts = contactId 
      ? db.prepare('SELECT id, name, phone, email FROM trusted_contacts WHERE id = ? AND user_id = ?').all(contactId, userId) as any[]
      : db.prepare('SELECT id, name, phone, email FROM trusted_contacts WHERE user_id = ? AND is_active = 1').all(userId) as any[];

    if (!contacts || contacts.length === 0) {
      res.status(400).json({ success: false, message: 'No active trusted contacts found to alert. Please add a contact first.' });
      return;
    }

    const insertAlert = db.prepare(`
      INSERT INTO alerts (user_id, scan_id, trusted_contact_id, alert_type, status, message, created_at)
      VALUES (?, ?, ?, 'MANUAL_EMERGENCY_ALERT', 'SENT', ?, ?)
    `);

    const recipientNames = contacts.map(c => c.name).join(', ');
    for (const c of contacts) {
      insertAlert.run(
        userId,
        scanId || null,
        c.id,
        note || `Safety alert requested by user for scan #${scanId || 'Manual'}. Please check on them.`,
        now
      );
    }

    logAudit(userId || null, 'EMERGENCY_ALERT_SENT', 'alert', String(scanId || 'manual'), {
      recipients: recipientNames
    });

    res.json({
      success: true,
      message: `Emergency alert successfully dispatched to ${recipientNames}. Help is on the way!`
    });
  } catch (err: any) {
    console.error('[TriggerContactAlert Error]', err);
    res.status(500).json({ success: false, message: 'Failed to dispatch alert.' });
  }
}
