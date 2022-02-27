const express = require('express');
const { Op } = require('sequelize');
const { posts, likes, users } = require('../models');
const auth = require('../middleWares/auth-middleware');
const loginCheck = require('../middleWares/loginCheck');
const { getPost, loginGetPost, detailLogin, detail } = require('../tools/posting');

const routes = express.Router();

// 목록 가져오기
routes.get('/post', loginCheck, async (req, res) => {
  const findPost = await posts.findAll();
  const findLike = await likes.findAll();
  const findUser = await users.findAll();

  // console.log(res.locals.boolean, findUser);
  // 로그인 함
  if (res.locals.boolean) {
    res.status(200).json({
      post: loginGetPost(findUser, findPost, findLike, res.locals.user),
    });
    return;
  }

  // 로그인 안함
  res.status(200).json({
    post: getPost(findUser, findPost, findLike),
  });
});

// 게시글 추가
routes.post('/post', auth, async (req, res) => {
  const { user_id, contents, img_url } = req.body;

  // console.log(res.locals.user);
  if (!contents || !img_url) {
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

  const post = await posts.findAll({ where: { user_id } });
  // console.log(post);

  res.status(201).json({
    success: true,
  });
});

// 게시글 조회
routes.get('/post/:postId', loginCheck, async (req, res) => {
  const { postId } = req.params;

  const findPost = await posts.findByPk(postId);
  const findLike = await likes.findAll({ where: { post_id: postId } });
  const findUser = await users.findOne({ where: { id: findPost.user_id } });
  let post;

  // 로그인 함
  if (res.locals.boolean) {
    post = detailLogin(findUser, findPost, findLike, res.locals.user);
    res.status(200).json({
      post,
      success: true,
      messages: "조회 완료",
    });
    return;
  }

  post = detail(findUser, findPost, findLike);

  // 로그인 안함
  res.status(200).json({
    post,
    success: true,
    messages: "조회 완료",
  });
});

// 게시글 삭제
routes.delete('/post/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  try {
    await posts.destroy({ where: { id: postId } });
    res.status(200).json({
      success: true,
      messages: '삭제되었습니다.',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      messages: '잘못된 요청입니다.',
    });
  }

});

// 게시글 수정
routes.put('/post/:postId', auth, async (req, res) => {
  const { postId } = req.params;
  const { contents, img_url } = req.body;
  const post = await posts.findOne({ where: { id: postId } });

  if (post.user_id !== res.locals.user.id) {
    res.status(401).json({ success: false, messages: "안됩니다." });
    return;
  }

  await post.set({
    contents,
    img: img_url
  });
  await post.save();
  await post.reload();
  const count = await likes.findAndCountAll({ where: { post_id: postId } });

  res.status(200).json({
    id: post.id,
    nickname: res.locals.user.nickname,
    contents: post.contents,
    profile_img: res.locals.user.profile_img_url,
    img_url: post.img,
    like_count: count.count,
    like_check: (() => {
      const like = likes.findOne({ where: { user_id: res.locals.user.id } });
      if (like) return true;
      return false;
    })(),
    me: true,
    reg_date: post.createdAt,
  });
});

// 게시글 좋아요
routes.post('/post/:postId/like', auth, async (req, res) => {
  const { postId } = req.params;
  const likeCheck = await likes.findOne({ where: { user_id: res.locals.user.id, post_id: postId } });
  // console.log(likeCheck)
  if (likeCheck) {
    await likeCheck.destroy();
    res.status(200).json({
      success: true,
      messages: '취소',
    });
    return;
  }

  await likes.create({ user_id: res.locals.user.id, post_id: postId });

  res.status(200).json({
    success: true,
    messages: '좋아요!',
  });
});

// 좋아요 취소
routes.delete('/post/:postId/like', auth, async (req, res) => {
  const { postId } = req.params;
  await likes.destroy({ where: { user_id: res.locals.user.id, post_id: postId } })
  res.status(200).json({
    success: true,
    messages: '취소',
  });
});

module.exports = routes;