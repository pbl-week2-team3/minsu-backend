const jwt = require('jsonwebtoken');
const { users } = require('../models');
const {secretKey} = require('../config/secretkey');


module.exports = (req, res, next) => {
  const { token } = req.headers;
  // console.log(authorization);

  if (!token) {
    res.status(401).json({
      success: false,
      messages: '로그인 후 사용하세요',
    });
    return;
  }


  try {
    const decode = jwt.verify(token, secretKey);
    // console.log(decode);
    users.findByPk(decode.user_id).then((user) => {
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