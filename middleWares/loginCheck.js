const jwt = require('jsonwebtoken');
const { users } = require('../models');
const secretKey = require('../config/secretkey').secretKey;
/*
기존 auth와는 다르게 로그인 유무만 판별 후 로그인이 되어 있으면
user와 boolean값을 반환.
로그인을 하지 않아도 사용할 수 있어야 하는 기능을 사용할 때 사용.
*/
module.exports = (req, res, next) => {
  // console.log('미들웨어 check');
  const { authorization } = req.cookies;
  // console.log(authorization);
  if (!authorization) {
    res.locals.boolean = false;
    return;
  }

  const { userId } = jwt.verify(authorization, secretKey);
  // console.log(userId);
  const user = users.findOne({where: {id: userId}});
  res.locals.user = user;
  res.locals.boolean = true;

  next();
}