const express = require('express');
const { jsonp } = require('express/lib/response');
const joi = require('joi');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const auth = require('../middleWares/auth-middleware');
const { users } = require('../models');
const secretKey = require('../config/secretkey').secretKey;
const option = require('../config/secretkey').option;

// { "user_id":"aaa", "contents":"되나?", "img_url":"링크" }

const routes = express.Router();

const key = 'secret-secret-key';

const registerSchema = joi.object({
  id: joi.string().alphanum().min(3).required(),
  nickname: joi.string().min(3).required(),
  password: joi.string().min(4).required(),
  confirmPassword: joi.string(),
  profile_img_url: joi.string(),
});
// 회원가입
routes.post('/register', async (req, res) => {

  let {id, nickname, password, confirmPassword, profile_img_url} = await registerSchema.validateAsync(req.body);

  console.log(id, nickname, password, confirmPassword, profile_img_url);

  if (password !== confirmPassword) {
    res.status(401).json({
      messages: "비밀번호가 일치하지 않습니다."
    });
    return;
  }

  const findUsers = await users.findOne({where: {id, nickname}});

  // console.log(user[0].id);
  if (findUsers) {
    res.status(401).json({
      messages: '아이디 또는 닉네임이 중복됩니다.',
    });
    return;
  }


  if (profile_img_url === ' ' || profile_img_url === null) {
    profile_img_url = 'img/default.png';
  }
  
  await users.create({id, nickname, password, profile_img_url});
  res.status(201).json({
    success: true,
    messages: '회원가입 성공!',
    });
});

const loginSchema= joi.object({
  id: joi.string().required(),
  password: joi.string().required(),
});
// 로그인
routes.post('/login', async (req, res) => {
  try {
    const { id, password } = await loginSchema.validateAsync(req.body);

    const findUser = await users.findByPk(id);
    // console.log(findUser.id, key);
  
    if (findUser && findUser.password === password) {
      const token = jwt.sign({userId: findUser.id}, secretKey, option);
      // console.log(jwt.verify(token, key));
      res.status(200).json({
        success: true,
        messages: '로그인 성공!',
        token,
      });
    }

  } catch (error) {
    console.log(error);
    res.status(401).json({});
  }
});

module.exports = routes;