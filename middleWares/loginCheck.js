const jwt = require('jsonwebtoken');
const { users } = require('../models');
const { secretKey } = require('../config/secretkey');
/*
기존 auth와는 다르게 로그인 유무만 판별 후 로그인이 되어 있으면
user와 boolean값을 반환.
로그인을 하지 않아도 사용할 수 있어야 하는 기능을 사용할 때 사용.
*/
module.exports = async (req, res, next) => {
  // console.log('미들웨어 check');
  const { token } = req.headers;
  console.log('token:', (token !== undefined));
  if (!token) {
    res.locals.boolean = false;
    next();
    return;
  }

  try {
    const decode = jwt.verify(token, secretKey);
    // console.log(decode);
    const user = await users.findOne({ where: { id: decode.user_id } });
    // console.log(user)
    res.locals.user = user;
    // console.log(res.locals.user);
    res.locals.boolean = true;
  } catch (error) {
    res.locals.boolean = false;
    // console.log(res.locals.boolean)
    next();
    return;
  }

  next();
}