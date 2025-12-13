import request from 'supertest';
import mongoose from 'mongoose';
import app, { start } from '../index';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop_test';

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('registers a user and logs in', async () => {
    const email = `user${Date.now()}@example.com`;
    const password = 'Password123!';

    const reg = await request(app).post('/api/auth/register').send({ email, password });
    expect(reg.status).toBe(201);

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});