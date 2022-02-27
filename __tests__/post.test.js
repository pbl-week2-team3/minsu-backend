const request = require('supertest');
const app = require('../app');
const { posts, likes, users } = require('../models');
const { getPost, loginGetPost, detail, detailLogin } = require('../tools/posting');
const { p, p2, p3, p4 } = require('../val');


// toBeNull
// toBeUndefined
// toBeDefined

// toBeTruthy
// toBeFalsy

// toBeGreaterThan 크다
// toBeGreaterThanOrEqual 크거나 같다
// toBeLessThan 작다
// toBeLessThanOrEqual 작거나 같다
// toEqual 같다

// toBeCloseTo 근사치다
// toBeMatch 문자열 안에서 문자 찾기
// toContain 배열에서 문자열 찾기
// toTrow 예외 발생  throw new Error("xx") 항상 에러를 발생

// toContain 배열에서 같은값 찾기


// console.log(p);


test('GET /api/post 로그인x 성공시', async () => {
  const findPost = await posts.findAll();
  const findLike = await likes.findAll();
  const findUser = await users.findAll();

  const post = getPost(findUser, findPost, findLike);
  expect(post).toEqual(p);
});

test('GET /api/post 로그인o 성공시', async () => {
  const findPost = await posts.findAll();
  const findLike = await likes.findAll();
  const findUser = await users.findAll();
  const user = await users.findOne({ where: { nickname: "minsu" } });

  const post = loginGetPost(findUser, findPost, findLike, user);
  expect(post).toEqual(p2);
});

test('GET /api/post/1 로그인x 성공시', async () => {
  const findPost = await posts.findOne();
  const findLike = await likes.findOne();
  const findUser = await users.findOne();

  const post = detail(findUser, findPost, findLike);
  expect(post).toEqual(p3);
});

test('GET /api/post/2 로그인o 성공시', async () => {
  const findPost = await posts.findOne();
  const findLike = await likes.findOne();
  const findUser = await users.findOne();
  const user = await users.findOne({ where: { nickname: "minsu" } });

  const post = detailLogin(findUser, findPost, findLike, user);
  expect(post).toEqual(p4);
});

test('GET /api/post', async () => {
  const res = await request(app).get('/api/post');
  expect(res.status).toEqual(200);
})