const express = require('express');
const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const { users } = require('../models');
const loginCheck = require('../middleWares/loginCheck');
const { secretKey, option } = require('../config/secretkey');

// { "user_id":"aaa", "contents":"되나?", "img_url":"링크" }

const routes = express.Router();

const registerSchema = joi.object({
  id: joi.string().required(),
  nickname: joi.string().alphanum().min(3).required(),
  password: joi.string().min(4).required(),
  confirmPassword: joi.string(),
  profile_img_url: joi.string(),
});
// 회원가입
routes.post('/register', loginCheck, async (req, res) => {
  if (res.locals.boolean) {
    res.status(401).json({
      success: false,
      message: '로그인 중 입니다.'
    });
    return;
  }

  try {
    let { id, nickname, password, confirmPassword, profile_img_url } = await registerSchema.validateAsync(req.body);

    // console.log(id, nickname, password, confirmPassword, profile_img_url);
    if (password.includes(nickname)) {
      res.status(401).json({
        success: false,
        message: '사용할 수 없는 비밀번호입니다.\n닉네임과 겹치지 않게 만들어주세요.'
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(401).json({
        success: false,
        messages: "비밀번호가 일치하지 않습니다."
      });
      return;
    }

    const findUser = await users.findOne({ where: { [Op.or]: [{ id }, { nickname }] } });
    // console.log(findUsers);
    if (findUser) {

      res.status(401).json({
        success: false,
        messages: '아이디 또는 닉네임이 중복됩니다.',
      });
      return;
    }

    if (profile_img_url === ' ' || profile_img_url === null || profile_img_url === undefined) {
      profile_img_url = 'https://media.discordapp.net/attachments/769096782088503298/945677346525040690/default.png';
    }

    await users.create({ id, nickname, password, profile_img_url });
    res.status(201).json({
      success: true,
      messages: '회원가입 성공!',
    });
  } catch (error) {
    // console.log(error);
    res.status(401).json({
      success: false,
      messages: '빈칸이 있습니다.',
    });
    return;
  }

});

const loginSchema = joi.object({
  id: joi.string().required(),
  password: joi.string().required(),
});

// 로그인
routes.post('/login', loginCheck, async (req, res) => {
  // console.log(res.locals.boolean);
  if (res.locals.boolean) {
    res.status(401).json({
      success: false,
      message: '이미 로그인이 되어있습니다.'
    });
    return;
  }

  try {
    const { id, password } = await loginSchema.validateAsync(req.body);

    const findUser = await users.findByPk(id);
    // console.log(findUser.id, secretKey);

    if (findUser && findUser.password === password) {
      const token = jwt.sign({ user_id: findUser.id, nickname: findUser.nickname, profile_img_url: findUser.profile_img_url }, secretKey, option);
      // console.log(jwt.verify(token, secretKey));
      res.status(201).json({
        success: true,
        messages: '로그인 성공!',
        token,
      });
    } else {
      res.status(401).json({
        success: false,
        messages: '아이디 또는 비밀번호가 틀렸습니다.',
      });
    }

  } catch (error) {
    // console.log(error);
    res.status(401).json({
      success: false,
      messages: '잘못된 값을 입력하셨습니다. \n빈칸이 있는지 확인해 주세요.'
    });
  }
});

routes.get('/me', (req, res) => {
  const { token } = req.headers;
  const decode = jwt.verify(token, secretKey);
  const user = users.findOne({ where: { id: decode.user_id } });
  // console.log(user);
  const reToken = jwt.sign({ user_id: user.id, nickname: user.nickname, profile_img_url: user.profile_img_url }, secretKey, option);

  res.status(200).json({
    success: true,
    messages: '내정보를 성공적으로 받았습니다.',
    token: reToken,
  });
});

const adminSchema = joi.object({
  id: joi.string().required(),
  nickname: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string(),
  profile_img_url: joi.string(),
});

module.exports = routes;