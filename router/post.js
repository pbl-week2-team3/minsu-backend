const express = require('express');
const { Op } = require('sequelize');
const { posts, likes, users } = require('../models');
const auth = require('../middleWares/auth-middleware');
const loginCheck = require('../middleWares/loginCheck');
const res = require('express/lib/response');

const routes = express.Router();

// 목록 가져오기
routes.get('/post', loginCheck, async (req, res) => {
  const findPost = await posts.findAll();
  const findLike = await likes.findAll();
  const findUser = await users.findAll();
  let post;

  // console.log(res.locals.boolean)
  // 로그인 함
  if (res.locals.boolean) {
    post = findPost.map((temp) => {
      // 게시글 쓴 사람
      const user = (() => {
        for (const find of findUser) {
          if (find.id === temp.user_id) {
            return find;
          }
        }
      })();
      // console.log(user.nickname, res.locals.user.nickname);
      return {
        id: temp.id,
        nickname: user.nickname,
        contents: temp.contents,
        profile_img: user.profile_img_url,
        img_url: temp.img,
        like_count: (() => {
          let count = 0;

          if (!findLike) return 0;
          for (const like of findLike) {
            if (like.post_id === temp.id) {
              count++;
            }
          }
          return count;
        })(),
        like_check: (() => {
          if (!findLike) {
            return false;
          }
          for (const like of findLike) {
            if (res.locals.user.id === like.user_id) {
              return true;
            }
          }
          return false;
        })(),
        me: (() => res.locals.user.id === user.id)(),
        reg_date: temp.createdAt
      };
    });

    res.status(200).json({
      post,
    });
    return;
  }


  // 로그인 안함
  post = findPost.map((temp, index) => {
    // 게시글 쓴 사람
    const user = (() => {
      for (const find of findUser) {
        if (find.id === temp.user_id) {
          return find;
        }
      }
    })();

    return {
      id: temp.id,
      nickname: user.nickname,
      contents: temp.contents,
      profile_img: user.profile_img_url,
      img_url: temp.img,
      like_count: (() => {
        let count = 0;

        if (!findLike) return 0;
        for (const like of findLike) {
          if (like.post_id === temp.id) {
            count++;
          }
        }
        return count;
      })(),
      like_check: false,
      me: false,
      reg_date: temp.createdAt
    };
  });

  res.status(200).json({
    post,
  });
});

// 게시글 추가
routes.post('/post', auth, async (req, res) => {
  const { user_id, contents, img_url } = req.body;

  console.log(res.locals.user);
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

  // 로그인 함
  if (res.locals.boolean) {
    // console.log("로그인")
    res.status(200).json({
      id: findPost.id,
      nickname: findUser.nickname,
      contents: findPost.contents,
      profile_img: findUser.profile_img_url,
      img_url: findPost.img,
      like_count: findLike.length,
      like_check: (() => {
        for (const find of findLike) {
          if (find.user_id === res.locals.user.id) return true;
        }
        return false;
      })(),
      me: (() => findUser.id === res.locals.user.id)(),
      reg_date: findPost.createdAt,
    });
    return;
  }
  // 로그인 안함
  res.status(200).json({
    id: findPost.id,
    nickname: findUser.nickname,
    contents: findPost.contents,
    profile_img: findUser.profile_img_url,
    img_url: findPost.img,
    like_count: findLike.length,
    like_check: (() => {
      for (const find of findLike) {
        if (find.user_id === findUser.id) return true;
      }
      return false;
    })(),
    me: false,
    reg_date: findPost.createdAt,
  });
});

// 게시글 삭제
routes.delete('/post/:postId', auth, async (req, res) => {
  await posts.destroy({ where: { id: postId } });
  res.status(200).json({
    success: true,
    messages: '삭제되었습니다.',
  });
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
  console.log(likeCheck)
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