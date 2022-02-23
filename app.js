const express = require('express');
const requset = require('./middleWares/requset-Middleware');
const cookieParser = require('cookie-parser');
const app = express();

const port = 8080;

const userRouter = require('./router/user');
const postRouter = require('./router/post');
const commentRouter = require('./router/comment');

app.all('/*', function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
  next(); 
});
app.use(express.json());
app.use(cookieParser());
// app.use();
app.use(express.static('static'));
app.use('/api', [userRouter, postRouter, commentRouter]);

app.listen(port, () => {
  console.log(port + '서버가 켜졌습니다.');
})