import { Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { logAudit } from '../utils/logger';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  relationship: z.string().min(2, 'Relationship is required (e.g. Son, Daughter, Caregiver)'),
  email: z.string().email().optional().or(z.literal(''))
});

export function getContacts(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const contacts = db.prepare(`
      SELECT id, name, email, phone, relationship, is_active, created_at, updated_at
      FROM trusted_contacts
      WHERE user_id = ? AND is_active = 1
      ORDER BY created_at ASC
    `).all(userId);

    res.json({ success: true, contacts });
  } catch (err: any) {
    console.error('[GetContacts Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
  }
}

export function createContact(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || 'Invalid contact data' });
      return;
    }

    const { name, phone, relationship, email } = parsed.data;
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO trusted_contacts (user_id, name, email, phone, relationship, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const result = insert.run(userId, name.trim(), email?.trim() || null, phone.trim(), relationship.trim(), now, now);
    const contactId = Number(result.lastInsertRowid);

    logAudit(userId || null, 'CONTACT_CREATED', 'contact', String(contactId), { name });

    res.status(201).json({
      success: true,
      message: 'Trusted contact added successfully',
      contact: {
        id: contactId,
        userId,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone.trim(),
        relationship: relationship.trim(),
        isActive: true,
        createdAt: now
      }
    });
  } catch (err: any) {
    console.error('[CreateContact Error]', err);
    res.status(500).json({ success: false, message: 'Failed to add trusted contact.' });
  }
}

export function updateContact(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const contactId = Number(req.params.id);
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0]?.message || 'Invalid contact data' });
      return;
    }

    const { name, phone, relationship, email } = parsed.data;
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT id FROM trusted_contacts WHERE id = ? AND user_id = ?').get(contactId, userId);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Contact not found or access denied.' });
      return;
    }

    db.prepare(`
      UPDATE trusted_contacts
      SET name = ?, email = ?, phone = ?, relationship = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(name.trim(), email?.trim() || null, phone.trim(), relationship.trim(), now, contactId, userId);

    logAudit(userId || null, 'CONTACT_UPDATED', 'contact', String(contactId));

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact: {
        id: contactId,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone.trim(),
        relationship: relationship.trim(),
        updatedAt: now
      }
    });
  } catch (err: any) {
    console.error('[UpdateContact Error]', err);
    res.status(500).json({ success: false, message: 'Failed to update contact.' });
  }
}

export function deleteContact(req: AuthenticatedRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    const contactId = Number(req.params.id);

    const existing = db.prepare('SELECT id, name FROM trusted_contacts WHERE id = ? AND user_id = ?').get(contactId, userId) as any;
    if (!existing) {
      res.status(404).json({ success: false, message: 'Contact not found.' });
      return;
    }

    db.prepare('DELETE FROM trusted_contacts WHERE id = ? AND user_id = ?').run(contactId, userId);
    logAudit(userId || null, 'CONTACT_DELETED', 'contact', String(contactId), { name: existing.name });

    res.json({ success: true, message: 'Trusted contact removed.' });
  } catch (err: any) {
    console.error('[DeleteContact Error]', err);
    res.status(500).json({ success: false, message: 'Failed to delete contact.' });
  }
}
