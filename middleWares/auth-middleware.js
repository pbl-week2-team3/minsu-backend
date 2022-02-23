const jwt = require('jsonwebtoken');
const { users } = require('../models');
const secretKey = require('../config/secretkey').secretKey;


module.exports = (req, res, next) => {
  const { cookie } = req.cookies;
  // console.log(authorization);

  if (!cookie) {
    res.status(401).json({
      success: false,
      messages: '로그인 후 사용하세요',
    });
    return;
  }


  try {
    const decode = jwt.verify(cookie.token, secretKey);
    // console.log(decode.userId);
    users.findByPk(decode.userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({
      messages: '로그인 후 사용하세요',
    });
    return;
  }
};