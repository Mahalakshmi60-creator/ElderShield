import { api } from './api';

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  preferredLanguage: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
  totalScans: number;
  highRiskScans: number;
}

export interface AdminDashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalScans: number;
    highRiskAlerts: number;
  };
  charts: {
    riskDistribution: { level: string; count: number }[];
    categoryDistribution: { category: string; count: number }[];
  };
  recentActivity: {
    id: number;
    scan_type: string;
    risk_level: string;
    risk_score: number;
    category: string;
    created_at: string;
    user_name: string;
  }[];
}

export const adminService = {
  getDashboard: () =>
    api.get<{ success: boolean } & AdminDashboardData>('/admin/dashboard'),

  getUsers: () =>
    api.get<{ success: boolean; users: AdminUser[] }>('/admin/users'),

  getUserDetail: (id: number) =>
    api.get<{ success: boolean; user: AdminUser; stats: any; recentScans: any[]; contacts: any[] }>(`/admin/users/${id}`),

  toggleUserStatus: (id: number, isActive: boolean) =>
    api.put<{ success: boolean; message: string; isActive: boolean }>(`/admin/users/${id}/status`, { isActive }),

  getScans: (limit = 50) =>
    api.get<{ success: boolean; scans: any[] }>(`/admin/scans?limit=${limit}`),

  getAlerts: () =>
    api.get<{ success: boolean; alerts: any[] }>('/admin/alerts'),

  getAnalytics: () =>
    api.get<{ success: boolean; analytics: any }>('/admin/analytics'),

  getAuditLogs: () =>
    api.get<{ success: boolean; logs: any[] }>('/admin/audit-logs')
};
