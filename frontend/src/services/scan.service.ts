import { api } from './api';

export interface DetectedSignal {
  type: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  weight: number;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'SUSPICIOUS' | 'HIGH';
  category: string;
  categoryLabel: string;
  signals: DetectedSignal[];
  summary: string;
  recommendedActions: string[];
  domainIndicators?: any;
  domain?: string;
  protocol?: string;
  isHttps?: boolean;
}

export interface ScanResultResponse {
  success: boolean;
  scanId: number;
  analysis: RiskAnalysis;
  alertCreated?: boolean;
  createdAt: string;
}

export interface ScanRecord {
  id: number;
  scanType: 'MESSAGE' | 'LINK' | 'CALL';
  riskScore: number;
  riskLevel: 'LOW' | 'SUSPICIOUS' | 'HIGH';
  category: string;
  summary: string;
  preview: string;
  createdAt: string;
  signals: DetectedSignal[];
}

export const scanService = {
  scanMessage: (message: string) =>
    api.post<ScanResultResponse>('/scans/message', { message }),

  scanLink: (url: string) =>
    api.post<ScanResultResponse>('/scans/link', { url }),

  scanCall: (transcript: string) =>
    api.post<ScanResultResponse>('/scans/call', { transcript }),

  getScans: (params?: { limit?: number; offset?: number; type?: string; risk?: string }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.type) query.set('type', params.type);
    if (params?.risk) query.set('risk', params.risk);
    return api.get<{ success: boolean; scans: ScanRecord[]; total: number }>(`/scans?${query.toString()}`);
  },

  getScanById: (id: number) =>
    api.get<{ success: boolean; scan: ScanRecord }>(`/scans/${id}`),

  sendContactAlert: (data: { scanId?: number; contactId?: number; note?: string }) =>
    api.post<{ success: boolean; message: string }>('/scans/alert', data)
};
