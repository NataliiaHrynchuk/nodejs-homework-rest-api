require('dotenv').config();
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

mongoose.set('strictQuery', false);
const { DB_HOST } = process.env;

describe('login', () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    console.log('connected to db');
  });
  afterAll(async () => {
    await mongoose.disconnect(DB_HOST);
    console.log('disconnected to db');
  });

  it('should login user', async () => {
    const response = await supertest(app).post('/api/users/login').send({
      email: 'user1@gmail.com',
      password: '111111',
    });
    console.log('response', response.body.data);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.token);
    expect(response.body.data.user.email).toEqual('user1@gmail.com');
    expect(response.body.data.user.subscription).toEqual('starter');
  });
});
