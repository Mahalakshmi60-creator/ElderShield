import { Router } from 'express';
import { scanMessage, scanLink, scanCall, getUserScans, getScanById, triggerContactAlert } from '../controllers/scan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/message', scanMessage);
router.post('/link', scanLink);
router.post('/call', scanCall);
router.get('/', getUserScans);
router.get('/:id', getScanById);
router.post('/alert', triggerContactAlert);

export default router;
