import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, Trash2, Send, ShieldCheck, HeartHandshake } from 'lucide-react';
import { contactService, TrustedContact } from '../services/contact.service';
import { scanService } from '../services/scan.service';
import { useApp } from '../context/AppContext';

export const Contacts: React.FC = () => {
  const { addToast } = useApp();
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await contactService.getContacts();
      if (res.success && res.contacts) {
        setContacts(res.contacts);
      }
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      addToast({ type: 'warning', message: 'Please provide both name and phone number.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await contactService.createContact({
        name,
        phone,
        relationship,
        email: email || undefined
      });
      if (res.success) {
        addToast({ type: 'success', title: 'Contact Added', message: `${name} has been added to your safety circle.` });
        setShowAddModal(false);
        setName('');
        setPhone('');
        setEmail('');
        loadContacts();
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to add contact.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, contactName: string) => {
    if (!confirm(`Are you sure you want to remove ${contactName} from your trusted contacts?`)) {
      return;
    }

    try {
      const res = await contactService.deleteContact(id);
      if (res.success) {
        addToast({ type: 'info', message: 'Contact removed.' });
        loadContacts();
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to delete contact.' });
    }
  };

  const handleTestAlert = async (contact: TrustedContact) => {
    try {
      const res = await scanService.sendContactAlert({
        contactId: contact.id,
        note: `Test Alert: This is a routine test from ElderShield to ensure ${contact.name} can receive emergency safety notices.`
      });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Test Notification Dispatched',
          message: res.message
        });
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to send test alert.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Trusted Contacts</h1>
            <p className="text-sm text-slate-600">
              Family members or caregivers who can be alerted if you face a high-risk scam.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-2xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600 font-medium">Loading your trusted circle...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <HeartHandshake className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No Trusted Contacts Added Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Adding a trusted family member ensures you never have to deal with high-risk scams or threatening callers alone.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 bg-sky-700 text-white font-bold rounded-2xl shadow-md"
          >
            Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 uppercase tracking-wider">
                      {contact.relationship}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{contact.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove contact"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mt-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Ready for alerts</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleTestAlert(contact)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Alert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Add Trusted Contact</h3>
            <p className="text-sm text-slate-600 mb-6">
              Enter your trusted family member's details so we can alert them when needed.
            </p>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Sundaram"
                  className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800">Relationship *</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600 bg-white"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Physician">Physician / Doctor</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karthik@example.com"
                  className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-2xl shadow-md transition-all"
                >
                  {submitting ? 'Adding...' : 'Save Trusted Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
