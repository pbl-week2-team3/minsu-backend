const request = require('supertest');
const app = require('../app');
const { posts, likes, users } = require('../models');
const { getPost, loginGetPost, detail, detailLogin } = require('../tools/posting');
const { p, p2, p3, p4, p5 } = require('../tools/val');


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

describe('', () => {
  let findPost
  let findLike
  let findUser

  beforeAll(async() => {
    findPost = await posts.findAll();
    findLike = await likes.findAll();
    findUser = await users.findAll();
  })


  test('로그인x 게시글 목록 가져오기 성공시', async () => {
    const post = getPost(findUser, findPost, findLike);
    expect(post).toEqual(p);
  });

  test('로그인o 게시글 목록 가져오기 성공시', async () => {
    const user = await users.findOne({ where: { nickname: "minsu" } });
    const post = loginGetPost(findUser, findPost, findLike, user);
    expect(post).toEqual(p2);
  });
})

describe('',()=>{
  let findPost
  let findLike
  let findUser

  beforeAll(async() => {
    findPost = await posts.findOne();
    findLike = await likes.findOne();
    findUser = await users.findOne();
  })

  test('로그인o 게시글 1개 가져오기 성공시', async () => {
    const user = await users.findOne({ where: { nickname: "minsu" } });
  
    const post = detailLogin(findUser, findPost, findLike, user);
    expect(post).toEqual(p4);
  });

  test('로그인x 게시글 1개 가져오기 성공시', async () => {
    const post = detail(findUser, findPost, findLike);
    console.log(detail(findUser, findPost, findLike));
    expect(post).toEqual(p3);
  });
})

test('GET /api/post', async () => {
  const res = await request(app).get('/api/post');
  expect(res.status).toEqual(200);
})

test('POST /api/post 로그인x 게시글 추가 실패 Status 401', async () => {
  const res = await request(app)
    .post('/api/post');
  expect(res.status).toEqual(401);
})

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

test('GET /api/post 로그인o 게시글 추가 성공 Status 200', async () => {
  const res = await request(app)
    .post('/api/post')
    .set('token', token)
    .send(p5);

  expect(res.status).toEqual(201);
});