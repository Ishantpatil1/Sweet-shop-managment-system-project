import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import Sweet from '../models/Sweet';
import Purchase from '../models/Purchase';

const router = Router();

router.get('/metrics', requireAuth, requireAdmin, async (_req, res) => {
  const [totalSweets, stockAgg, lowStockCount, totalPurchases] = await Promise.all([
    Sweet.countDocuments({}),
    Sweet.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
    Sweet.countDocuments({ quantity: { $lt: 10, $gt: 0 } }),
    Purchase.countDocuments({}),
  ]);
  const totalStock = stockAgg[0]?.total || 0;
  return res.json({ totalSweets, totalStock, lowStockCount, totalPurchases });
});

export default router;
