const express = require('express');
const joi = require('joi');
const { Op } = require('sequelize');

const auth = require('../middleWares/auth-middleware');
const { users } = require('../models');

const routes = express.Router();

// 회원가입
routes.post('/register', async (req, res) => {
  const {id, nickname, password, confirmPassword, profile_img_url} = req.body;

  users.findAll({});
  
  await users.create({id, nickname, password});

  res.status(201).send({});
});

// 로그인
routes.post('/login', async (req, res) => {

});

module.exports = routes;