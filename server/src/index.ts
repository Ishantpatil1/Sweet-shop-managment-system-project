import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import sweetsRouter from './routes/sweets';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetsRouter);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop';

export const start = async () => {
  await mongoose.connect(MONGODB_URI);
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({ email: adminEmail, passwordHash, role: 'admin' });
      console.log('Seeded default admin:', adminEmail);
    }
  }
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      resolve();
    });
  });
};

if (process.env.JEST_WORKER_ID === undefined) {
  start();
}

export default app;