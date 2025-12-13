import { Router } from 'express';
import Sweet from '../models/Sweet';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const { name, category, price, quantity } = req.body || {};
  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ message: 'missing fields' });
  }
  try {
    const sweet = await Sweet.create({ name, category, price, quantity });
    return res.status(201).json(sweet);
  } catch (e: any) {
    if (e.code === 11000) return res.status(409).json({ message: 'name must be unique' });
    return res.status(400).json({ message: 'invalid data' });
  }
});

router.get('/', requireAuth, async (_req, res) => {
  const sweets = await Sweet.find().sort({ name: 1 });
  return res.json(sweets);
});

router.get('/search', requireAuth, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query as any;
  const query: any = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (category) query.category = { $regex: category, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  const sweets = await Sweet.find(query).sort({ name: 1 });
  return res.json(sweets);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  const sweet = await Sweet.findByIdAndUpdate(id, updates, { new: true });
  if (!sweet) return res.status(404).json({ message: 'not found' });
  return res.json(sweet);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const sweet = await Sweet.findByIdAndDelete(id);
  if (!sweet) return res.status(404).json({ message: 'not found' });
  return res.json({ message: 'deleted' });
});

router.post('/:id/purchase', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { quantity = 1 } = req.body || {};
  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'not found' });
  if (sweet.quantity < quantity) return res.status(400).json({ message: 'insufficient stock' });
  sweet.quantity -= quantity;
  await sweet.save();
  return res.json(sweet);
});

router.post('/:id/restock', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { quantity = 1 } = req.body || {};
  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'not found' });
  sweet.quantity += quantity;
  await sweet.save();
  return res.json(sweet);
});

export default router;