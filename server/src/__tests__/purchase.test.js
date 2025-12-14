import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/User.js';
import Sweet from '../models/Sweet.js';

let adminToken = '';
let userToken = '';
let sweetId = '';

beforeAll(async () => {
  // Create admin
  const adminEmail = 'admin@test.com';
  const adminPassword = 'Admin123!';
  await User.deleteMany({ email: adminEmail });
  await request(app).post('/api/auth/register').send({ email: adminEmail, password: adminPassword, role: 'admin' });
  const adminLogin = await request(app).post('/api/auth/login').send({ email: adminEmail, password: adminPassword });
  adminToken = adminLogin.body.token;

  // Create user
  const userEmail = 'user@test.com';
  const userPassword = 'User123!';
  await User.deleteMany({ email: userEmail });
  await request(app).post('/api/auth/register').send({ email: userEmail, password: userPassword, role: 'user' });
  const userLogin = await request(app).post('/api/auth/login').send({ email: userEmail, password: userPassword });
  userToken = userLogin.body.token;

  // Create a sweet
  const sweetRes = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Test Sweet', category: 'Indian', price: 100, quantity: 10 });
  sweetId = sweetRes.body._id || sweetRes.body.id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Purchase workflow', () => {
  it('allows a user to purchase and decrements stock', async () => {
    const res = await request(app)
      .post('/api/purchases')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ sweetId, quantity: 3 });

    expect(res.status).toBe(201);
    expect(res.body.purchase.quantity).toBe(3);

    const sweet = await Sweet.findById(sweetId);
    expect(sweet?.quantity).toBe(7);
  });

  it('prevents purchasing more than stock', async () => {
    const res = await request(app)
      .post('/api/purchases')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ sweetId, quantity: 999 });
    expect(res.status).toBe(400);
  });

  it('admin can view purchase history', async () => {
    const res = await request(app)
      .get('/api/purchases')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('user cannot access admin purchase API', async () => {
    const res = await request(app)
      .get('/api/purchases')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
