const express = require('express');
const auth = require('./middleWares/auth-middleware');
const requset = require('./middleWares/requset-Middleware');
const cors = require('./middleWares/cors');
const app = express();

const port = 8080;

const userRouter = require('./router/user');
const postRouter = require('./router/post');
const commentRouter = require('./router/comment');

// app.use(cors());
app.use(express.json());
// app.use();
app.use(express.static('static'));
app.use('/api', [userRouter, postRouter, commentRouter]);

app.listen(port, () => {
  console.log(port+'서버가 켜졌습니다.');
})