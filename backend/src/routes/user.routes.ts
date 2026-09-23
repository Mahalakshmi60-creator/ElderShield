import { Router } from 'express';
import { getCurrentUser, updateProfile, changePassword } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/me', getCurrentUser);
router.put('/me', updateProfile);
router.put('/me/password', changePassword);

export default router;
