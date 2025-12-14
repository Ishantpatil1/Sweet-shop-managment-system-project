import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import purchaseController from '../controllers/purchaseController.js';

const router = Router();

// User can create a purchase (requires authentication)
router.post('/', requireAuth, (req, res) => purchaseController.createPurchase(req, res));

// User can view their own purchases
router.get('/me', requireAuth, (req, res) => purchaseController.getUserPurchases(req, res));

// Admin can view all purchases
router.get('/', requireAuth, requireAdmin, (req, res) => purchaseController.getPurchaseHistory(req, res));

// Admin can view purchase statistics
router.get('/stats', requireAuth, requireAdmin, (req, res) => purchaseController.getPurchaseStats(req, res));

export default router;
