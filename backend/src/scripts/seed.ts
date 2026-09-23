import { db, initDatabase } from '../config/database';
import { hashPassword } from '../utils/password';
import { analyzeScamRisk } from '../services/risk.service';
import { analyzeLink } from '../services/link.service';
import crypto from 'crypto';

function hashInput(input: string): string {
  return crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex');
}

async function seed() {
  console.log('[Seed] Initializing database...');
  initDatabase();

  const now = new Date().toISOString();

  // Check if admin exists
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@eldershield.ai');
  if (!existingAdmin) {
    const adminPass = await hashPassword('Admin@12345');
    db.prepare(`
      INSERT INTO users (full_name, email, phone, password_hash, role, preferred_language, onboarding_completed, is_active, created_at, updated_at, last_login_at)
      VALUES (?, ?, ?, ?, 'ADMIN', 'English', 1, 1, ?, ?, ?)
    `).run('System Administrator', 'admin@eldershield.ai', '+91 98000 00001', adminPass, now, now, now);
    console.log('[Seed] Admin user created: admin@eldershield.ai / Admin@12345');
  }

  // Check if demo user exists
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('mahalakshmi@example.com') as any;
  let elderUserId: number;

  if (!existingUser) {
    const userPass = await hashPassword('ElderShield@2026');
    const userResult = db.prepare(`
      INSERT INTO users (full_name, email, phone, password_hash, role, preferred_language, onboarding_completed, is_active, created_at, updated_at, last_login_at)
      VALUES (?, ?, ?, ?, 'USER', 'English', 1, 1, ?, ?, ?)
    `).run('Mahalakshmi Sundaram', 'mahalakshmi@example.com', '+91 98410 87654', userPass, now, now, now);
    elderUserId = Number(userResult.lastInsertRowid);
    console.log('[Seed] Demo Elder user created: mahalakshmi@example.com / ElderShield@2026');

    // Add trusted contacts
    const insertContact = db.prepare(`
      INSERT INTO trusted_contacts (user_id, name, email, phone, relationship, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const c1 = insertContact.run(elderUserId, 'Karthik Sundaram', 'karthik.s@example.com', '+91 98401 23456', 'Son', now, now);
    const c2 = insertContact.run(elderUserId, 'Dr. Ananya Rao', 'dr.ananya@example.com', '+91 98840 98765', 'Family Physician / Caregiver', now, now);
    console.log('[Seed] Trusted contacts added for Mahalakshmi');

    // Add sample demo scans
    const sampleItems = [
      {
        type: 'MESSAGE' as const,
        text: 'Dear SBI Customer, your bank account will be BLOCKED today. Urgent: update your PAN card and KYC immediately by clicking http://sbi-kyc-update-portal.xyz/verify or share your OTP with our officer.'
      },
      {
        type: 'LINK' as const,
        text: 'http://fedex-tracking-parcel-support.top/delivery-fee'
      },
      {
        type: 'CALL' as const,
        text: 'Hello, this is Inspector Sharma from New Delhi Police Narcotics Department. A parcel in your name was seized containing illegal passports and drugs. An arrest warrant has been issued under digital arrest. Transfer ₹50,000 immediately to verify your clearance.'
      },
      {
        type: 'MESSAGE' as const,
        text: 'Dear Consumer, your electricity bill payment of ₹1,450 for meter #88721 has been successfully received. Thank you. TNEB Official.'
      }
    ];

    const insertScan = db.prepare(`
      INSERT INTO scans (user_id, scan_type, input_hash, risk_score, risk_level, category, summary, raw_preview, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSignal = db.prepare(`
      INSERT INTO scan_signals (scan_id, signal_type, label, severity, evidence, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of sampleItems) {
      let analysis;
      if (item.type === 'LINK') {
        analysis = analyzeLink(item.text);
      } else {
        analysis = analyzeScamRisk(item.text, item.type);
      }

      const inputHash = hashInput(item.text);
      const preview = item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text;

      const res = insertScan.run(
        elderUserId,
        item.type,
        inputHash,
        analysis.riskScore,
        analysis.riskLevel,
        analysis.category,
        analysis.summary,
        preview,
        now
      );

      const scanId = Number(res.lastInsertRowid);
      for (const sig of analysis.signals) {
        insertSignal.run(scanId, sig.type, sig.label, sig.severity, sig.evidence, now);
      }

      if (analysis.riskLevel === 'HIGH') {
        db.prepare(`
          INSERT INTO alerts (user_id, scan_id, trusted_contact_id, alert_type, status, message, created_at)
          VALUES (?, ?, ?, 'HIGH_RISK_SCAM_DETECTED', 'SENT', ?, ?)
        `).run(
          elderUserId,
          scanId,
          Number(c1.lastInsertRowid),
          `High-risk scam detected (${analysis.categoryLabel}) for Mahalakshmi Sundaram. Score: ${analysis.riskScore}/100.`,
          now
        );
      }
    }

    console.log('[Seed] Sample scans and alerts populated.');
  }

  console.log('[Seed] Database seeding completed successfully! ✨');
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
