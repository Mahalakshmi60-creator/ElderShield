import { Router } from 'express';
import { 
  getAdminDashboard, 
  getAdminUsers, 
  getAdminUserDetail, 
  toggleUserStatus, 
  getAdminScans, 
  getAdminAlerts, 
  getAdminAnalytics, 
  getAdminAuditLogs 
} from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Protect all admin routes with auth and admin role check
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserDetail);
router.put('/users/:id/status', toggleUserStatus);
router.get('/scans', getAdminScans);
router.get('/alerts', getAdminAlerts);
router.get('/analytics', getAdminAnalytics);
router.get('/audit-logs', getAdminAuditLogs);

export default router;
