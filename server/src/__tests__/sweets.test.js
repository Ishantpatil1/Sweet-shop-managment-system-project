import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop_test';

let token;
let adminToken;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
  const email = `sweets${Date.now()}@example.com`;
  const password = 'Password123!';
  await request(app).post('/api/auth/register').send({ email, password });
  const login = await request(app).post('/api/auth/login').send({ email, password });
  token = login.body.token;

  // Ensure admin user exists via env or create one directly for tests
  const adminEmail = `admin${Date.now()}@example.com`;
  const adminReg = await request(app).post('/api/auth/register').send({ email: adminEmail, password });
  expect([201, 409]).toContain(adminReg.status);
  // Promote to admin via DB
  const mongooseConn = mongoose.connection;
  await mongooseConn.collection('users').updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
  const adminLogin = await request(app).post('/api/auth/login').send({ email: adminEmail, password });
  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Sweets API', () => {
  it('creates and lists sweets', async () => {
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ladoo', category: 'Indian', price: 2.5, quantity: 10 });
    expect(create.status).toBe(201);

    const list = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThan(0);
  });

  it('purchases and restocks with role checks', async () => {
    const create = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Barfi', category: 'Indian', price: 3, quantity: 5 });
    const id = create.body._id;

    const purchase = await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });
    expect(purchase.status).toBe(200);
    expect(purchase.body.quantity).toBe(3);

    // Non-admin cannot restock
    const restockForbidden = await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });
    expect(restockForbidden.status).toBe(403);

    // Admin can restock
    const restockOk = await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 2 });
    expect(restockOk.status).toBe(200);
    expect(restockOk.body.quantity).toBe(5);
  });

  it('searches and updates sweets', async () => {
    await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jalebi', category: 'Indian', price: 1.5, quantity: 20 });

    const search = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ name: 'jale' });
    expect(search.status).toBe(200);
    expect(search.body.length).toBeGreaterThan(0);

    const jalebiId = search.body[0]._id;
    const update = await request(app)
      .put(`/api/sweets/${jalebiId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 2.0 });
    expect(update.status).toBe(200);
    expect(update.body.price).toBe(2.0);
  });
});
