const app = require('../app');
const request = require('supertest');

let token = "";

test('POST /api/login 로그인 성공 Status Code 200', async () => {
  const res = await request(app)
  .post('/api/login')
  .send({
    id: "test@test.com",
    password: "qwer1234"
  });
  token = res.body.token;
  
  expect(res.status).toEqual(201);
  expect(res.body.success).toEqual(true);
});

test('POST /api/login 로그인 후 재접속 Status Code 401', async () => {
  const res = await request(app)
  .post('/api/login')
  .set('token', token)
  .send({
    id: "test@test.com",
    password: "qwer1234"
  });

  expect(res.status).toEqual(401);
  expect(res.body.success).toEqual(false);
});