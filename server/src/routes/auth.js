import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    let { email, password, name, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    email = String(email).trim().toLowerCase();
    name = String(name || '').trim();
    if (password.length < 6) return res.status(400).json({ message: 'password must be at least 6 characters' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'user';
    const user = await User.create({ email, passwordHash, name: name || email, role: userRole });
    console.log('✓ User registered:', email);
    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error('✗ Register error:', err.message);
    return res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    email = String(email).trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, name: user.name || '' },
      secret,
      { expiresIn: '1h' }
    );
    console.log('✓ User logged in:', email);
    return res.json({ token });
  } catch (err) {
    console.error('✗ Login error:', err.message);
    return res.status(500).json({ message: 'Login failed: ' + err.message });
  }
});

export default router;
