import purchaseService from '../services/purchaseService.js';

/**
 * Purchase Controller
 * Handles HTTP requests for purchase operations
 */

class PurchaseController {
  /**
   * Create a new purchase
   * POST /api/purchases
   * Body: { sweetId, quantity, deliveryNote? }
   */
  async createPurchase(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { sweetId, quantity, deliveryNote, contactName, contactEmail } = req.body;

      // Validation
      if (!sweetId || !quantity) {
        return res.status(400).json({ message: 'sweetId and quantity required' });
      }

      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'quantity must be a positive number' });
      }

      // Create purchase
      const purchase = await purchaseService.createPurchase(
        userId,
        sweetId,
        quantity,
        deliveryNote,
        contactName,
        contactEmail
      );

      return res.status(201).json({
        message: 'Purchase successful',
        purchase,
      });
    } catch (err) {
      const message = err.message || 'Failed to create purchase';
      return res.status(400).json({ message });
    }
  }

  /**
   * Get purchase history (admin only)
   * GET /api/purchases
   */
  async getPurchaseHistory(req, res) {
    try {
      const purchases = await purchaseService.getPurchaseHistory();
      return res.json(purchases);
    } catch (err) {
      const message = err.message || 'Failed to fetch purchase history';
      return res.status(500).json({ message });
    }
  }

  /**
   * Get user's own purchase history
   * GET /api/purchases/me
   */
  async getUserPurchases(req, res) {
    try {
      const userId = req.user?.userId;
      const purchases = await purchaseService.getUserPurchases(userId);
      return res.json(purchases);
    } catch (err) {
      const message = err.message || 'Failed to fetch purchases';
      return res.status(500).json({ message });
    }
  }

  /**
   * Get purchase statistics (admin only)
   * GET /api/purchases/stats
   */
  async getPurchaseStats(req, res) {
    try {
      const stats = await purchaseService.getPurchaseStats();
      return res.json(stats);
    } catch (err) {
      const message = err.message || 'Failed to fetch purchase statistics';
      return res.status(500).json({ message });
    }
  }
}

export default new PurchaseController();
