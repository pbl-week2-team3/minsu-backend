# minsu-backend
node.js를 사용한 API 만들기
---
## 사용한것
- express : https://www.npmjs.com/package/express
- DB
  - mysql
  - sequelize
- joi : https://www.npmjs.com/package/joi

## API
### 1. 게시글
목록가져오기
- Request
  - Method: GET
  - URL: /api/post
- Response
  - HTTP Status Code: 200
  - payload:
  {
    post: [{
      id(post): number,
      nickname: string,
      contents: string,
      profile_img: string,
      img_url: string,
      like_count: number,
      like_check: boolean,
      reg_date: date,
    }]
  }
  
  
게시글 추가
- Request
  - Method: POST
  - URL: /api/post
  - Headers: 
  { 
    authorization: token ,
  }
  - Body: 
  {
    user_id: string,
    contents: string,
    img_url: img,
  }
- Response
  - HTTP Status Code: 201
  - payload: 
  {
    id(post): number,
    reg_date: date,
  }

게시글 조회
- Request
  - Method: GET
  - URL: /api/post/:postId
- Response
  - HTTP Status Code: 200
  - payload:
  {
    nickname: string,
    contents: string,
    comments:[{
      id: number,
      post_id: number,
      nickname: string,
    }]
    reg_date: date,
  }

게시글 삭제
- Request
  - Method: DELETE
  - URL: /api/post/:postId
  - Headers:
  {
    authorization: token,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    result: {
      success: boolean,
      messages: string,
    },
  }

게시글 수정
- Request
  - Method: PUT
  - URL: /api/post/:postId
  - Headers:
  {
    authorization: token,
  }
  - Body:
  {
    contents: string,
    img_url: img,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    id(post): number,
    nickname: string,
    contents: string,
    profile_img: string,
    img_url: string,
    like_count: number,
    like_check: boolean,
    reg_date: date,
  }

### 2. 댓글
댓글 추가
- Request
  - Method: POST
  - URL: /api/comment/:postId
  - Headers:
  {
    authorization: token,
  }
  - Body:
  {
    text: string,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    id(comment): number,
    nickname: string,
    text: string,
  }

댓글 수정
- Request
  - Method: PUT
  - URL: /api/comment/:postId/:commentId
  - Headers:
  {
    authorization: token,
  }
  - Body:
  {
    text: string,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    result: {
      success: boolean,
      messages: string,
    },
  }

댓글 삭제
- Request
  - Method: DELETE
  - URL: /api/comment/:postId/:commentId
  - Headers: {
    authorization: token,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    result: {
      success: boolean,
      messages: string,
    },
  }

### 3. 좋아요
게시글 좋아요
- Request
  - Method: POST
  - URL: /api/post/:postId/like
  - Headers: {
    authorization: token,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    result: {
      success: boolean,
      messages: string,
    },
  }

게시글 좋아요 취소
- Request
  - Method: DELETE
  - URL: /api/post/:postId/like
  - Headers: {
    authorization: token,
  }
- Response
  - HTTP Status Code: 200
  - payload:
  {
    result: {
      success: boolean,
      messages: string,
    },
  }

### 4. 회원관리
회원가입
- Request
  - Method: POST
  - URL: /api/register
  - Body: {
    id: string,
    nickname: string,
    password: string,
    confirmPassword: string,
    profile_img_url: <미정>,
  }
- Response
  - HTTP Status Code: 200
  - payload: 
  {
    result: {
      success: boolean,
      messages: string,
    },
  }

로그인
- Request
  - Method: POST
  - URL: /api/login
  - Body: {
    id: string,
    password: string,
  }
- Response
  - HTTP Status Code: 200
  - payload :
  {
    result: {
      success: boolean,
      messages: string,
      token: string,
    },
  }

알림 설정
- Request
  - Method: POST
  - URL: /api/alarm
  - Headers: {
    authorization: token,
  }
- Response
  - HTTP Status Code: 200
  - payload :
  {
    alarm: number,
  }