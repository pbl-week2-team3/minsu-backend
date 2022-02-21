const jwt = require('jsonwebtoken');
const { users } = require('../models');
const secretKey = require('../config/secretkey').secretKey;
const option = require('../config/secretkey').option;

// 

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization);
  
  if (!authorization) {
    res.status(401).json({
      success: false,
      messages: '로그인 후 사용하세요',
    });
  }
  

  try {
    const decode = jwt.verify(authorization, secretKey);
    console.log(decode.userId);
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