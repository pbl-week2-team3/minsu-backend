const jwt = require('jsonwebtoken');
const { users } = require('../models');
const secretKey = require('../config/secretkey').secretKey;
/*
기존 auth와는 다르게 로그인 유무만 판별 후 로그인이 되어 있으면
user와 boolean값을 반환.
로그인을 하지 않아도 사용할 수 있어야 하는 기능을 사용할 때 사용.
*/
module.exports = async (req, res, next) => {
  // console.log('미들웨어 check');
  const { cookie } = req.cookies;
  // console.log(cookie.token);
  if (!cookie) {
    res.locals.boolean = false;
    next();
    return;
  }

  try {
    const { userId } = jwt.verify(cookie.token, secretKey);
  // console.log(userId);
  const user = await users.findOne({where: {id: userId}});
  // console.log(user)
  res.locals.user = user;
  res.locals.boolean = true;
  } catch (error) {
    res.locals.boolean = false;
    res.clearCookie('cookie');
    next();
    return;
  }

  next();
}