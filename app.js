const express = require('express');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const cors = require('cors');
const app = express();

const port = 8080;

const userRouter = require('./router/user');
const postRouter = require('./router/post');
const commentRouter = require('./router/comment');

const requestMiddleware = (req, res, next) => {
  console.log('Request URL:', req.originalUrl, '-', "client IP: " + requestIp.getClientIp(req), '-', new Date());
  next();
};

// app.all('/*', function(req, res, next) { 
//   res.header("Access-Control-Allow-Origin", "*"); 
//   res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
//   next(); 
// });
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('static'));
app.use(requestMiddleware);
app.use('/api', [userRouter, postRouter, commentRouter]);

app.listen(port, () => {
  console.log(port + '서버가 켜졌습니다.');
})

module.exports = app;