import { Router } from 'express';
import Sweet from '../models/Sweet.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, category, price, quantity, description, imageUrl } = req.body || {};
  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ message: 'missing fields' });
  }
  const priceNum = Number(price);
  const qtyNum = Number(quantity);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    return res.status(400).json({ message: 'price must be a non-negative number' });
  }
  if (!Number.isInteger(qtyNum) || qtyNum < 0) {
    return res.status(400).json({ message: 'quantity must be a non-negative integer' });
  }
  try {
    const sweet = await Sweet.create({ name, category, price: priceNum, quantity: qtyNum, description: description || '', imageUrl: imageUrl || '' });
    return res.status(201).json(sweet);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'name must be unique' });
    return res.status(400).json({ message: e.message || 'invalid data' });
  }
});

router.get('/', requireAuth, async (_req, res) => {
  const sweets = await Sweet.find().sort({ name: 1 });
  return res.json(sweets);
});

router.get('/search', requireAuth, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const query = {};
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

// Upload/update image for a sweet
router.post('/:id/image', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ message: 'image file is required' });
  }
  const url = `/uploads/${req.file.filename}`;
  const sweet = await Sweet.findByIdAndUpdate(id, { imageUrl: url }, { new: true });
  if (!sweet) return res.status(404).json({ message: 'not found' });
  return res.json({ imageUrl: url, sweet });
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
  const { quantity } = req.body || {};
  const inc = Number(quantity);
  if (!inc || inc <= 0) {
    return res.status(400).json({ message: 'quantity must be a positive number' });
  }
  const sweet = await Sweet.findByIdAndUpdate(
    id,
    { $inc: { quantity: inc } },
    { new: true }
  );
  if (!sweet) return res.status(404).json({ message: 'not found' });
  return res.json(sweet);
});

export default router;
