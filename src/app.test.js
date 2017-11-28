import request from 'supertest';
import app from './app.js'

test('Root path returns 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

test('Signup path returns 200', async () => {
  const response = await request(app).get('/signup');
  expect(response.statusCode).toBe(200);
});
