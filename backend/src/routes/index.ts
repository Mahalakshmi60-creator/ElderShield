import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import scanRoutes from './scan.routes';
import contactRoutes from './contact.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ElderShield AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/scans', scanRoutes);
router.use('/contacts', contactRoutes);
router.use('/admin', adminRoutes);

export default router;
