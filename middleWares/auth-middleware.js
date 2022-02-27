const jwt = require('jsonwebtoken');
const { users } = require('../models');
const { secretKey, option } = require('../config/secretkey');


module.exports = (req, res, next) => {
  const { token } = req.headers;
  // console.log(token);
  // console.log(secretKey)/

  if (!token) {
    res.status(401).json({
      success: false,
      messages: '로그인 후 사용하세요',
    });
    return;
  }
// {"id":"test@test.com","password":"qwer1234"}
  // {"user_id":"test@test.com","contents":"테스트","img_url":"aa"}
  try {
    const decode = jwt.verify(token, secretKey, option);
    // console.log(decode);
    users.findByPk(decode.user_id).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    // console.log(error)
    res.status(401).json({
      success: false,
      messages: '로그인 후 사용하세요',
    });
    return;
  }
};