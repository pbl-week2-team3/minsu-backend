const jwt = require('jsonwebtoken');
const { users } = require('../models');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');
  
  if (tokenType !== 'Bearer') {
    res.status(401).json({
      messages: '로그인 후 사용하세요.',
    });
    return;
  }

  try {
    const { id } = jwt.verify(tokenValue, 'secret-key');
    
    users.findByPk(id).then((user) => {
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