import { api } from './api';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  preferredLanguage: string;
  avatarUrl?: string | null;
  onboardingCompleted: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    preferredLanguage?: string;
    trustedContact?: {
      name: string;
      phone: string;
      relationship: string;
      email?: string;
    };
  }) => api.post<AuthResponse>('/auth/register', data),

  getMe: () =>
    api.get<{ success: boolean; user: User; stats: any }>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.put<{ success: boolean; message: string; user: User }>('/users/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<{ success: boolean; message: string }>('/users/me/password', data),

  forgotPassword: (email: string) =>
    api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email })
};
