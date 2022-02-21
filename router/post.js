const express = require('express');
const { Op } = require('sequelize');
const { posts, likes } = require('../models');
const auth = require('../middleWares/auth-middleware');

const routes = express.Router();

// 목록 가져오기
routes.get('/post', async (req, res) => {
  const post = await posts.findAll().then(console.log);
  console.log(post);
  res.status(200).json({
    post,
  });
});

// 게시글 추가
routes.post('/post', auth, async (req, res) => {
  const { user_id, contents, img_url } = req.body;

  console.log(res.locals.user);
  if (!contents || img_url) {
    res.status(401).json({
      success: false,
      message: '게시글 또는 이미지가 없습니다.',
    });
    return;
  }

  await posts.create({
    user_id,
    contents,
    img: img_url,
  });

  const post = await posts.findAll({where: {user_id}});
  // console.log(post);

  res.status(201).json({
    success: true,
  });
});

// 게시글 조회
routes.get('/post/:postId', async (req, res) => {
  
  res.status(200).json({});
});

// 게시글 삭제
routes.delete('/post/:postId', auth, async (req, res) => {
  res.status(200).json({});
});

// 게시글 수정
routes.put('/post/:postId', auth, async (req, res) => {
  res.status(200).json({});
});

module.exports = routes;