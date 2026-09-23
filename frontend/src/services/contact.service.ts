import { api } from './api';

export interface TrustedContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const contactService = {
  getContacts: () =>
    api.get<{ success: boolean; contacts: TrustedContact[] }>('/contacts'),

  createContact: (data: { name: string; phone: string; relationship: string; email?: string }) =>
    api.post<{ success: boolean; message: string; contact: TrustedContact }>('/contacts', data),

  updateContact: (id: number, data: { name: string; phone: string; relationship: string; email?: string }) =>
    api.put<{ success: boolean; message: string; contact: TrustedContact }>(`/contacts/${id}`, data),

  deleteContact: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/contacts/${id}`)
};
