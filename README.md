# minsu-backend
node.js를 사용한 API 만들기
---
## 사용한것
- express : https://www.npmjs.com/package/express
- DB
  - mysql
  - sequelize
- joi : https://www.npmjs.com/package/joi
- cookie-parser
- request-ip
- jest
- supertest

## API서버 주소 (작동중)
- http://onlyonep.shop/

## 유의 사항
프로필 이미지가 없을땐 공백으로 넣어주세요.
공백으로 들어오면 undefined가 나면서 작동이 되지 않습니다...

## API
| 기능 | URL | Method | Status | Headers | body | payload |
| --- | --- | --- | --- | --- | --- | --- |
| 게시글 목록 가져오기 | /api/post | GET | 200 | token: 토큰 |  | { id: 게시글 아이디,
nickname: 글쓴이 닉네임,
contents: 글,
profile_img: 글쓴이 프사,
img_url: 게시글 이미지,
like_count: 좋아요 갯수,
like_check: 글을 보고 있는 유저의 좋아요 유무,
me: 작성 유무,
reg_date: 작성날짜, }
success: true,
messages: ‘조회 완료’ |
| 게시글 추가 | /api/post | POST | 201 | token: 토큰 | user_id: 유저 아이디
contents: 글
img_url: 이미지 | success: true |
|  |  |  | 401 |  |  | success: false,
messages: '로그인 후 사용하세요', |
| 게시글 조회 | /api/post/:postId | GET | 200 | token: 토큰 |  | id: 게시글 아이디,
nickname: 글쓴이 닉네임,
contents: 글,
profile_img: 글쓴이 프사,
img_url: 게시글 이미지,
like_count: 좋아요 갯수,
like_check: 글을 보고 있는 유저의 좋아요 유무,
me: 작성 유무,
reg_date: 작성날짜, |
| 게시글 삭제 | /api/post/:postId | POST | 200 | token: 토큰 |  | success: true,
messages: '삭제되었습니다.', |
|  |  |  | 401 |  |  | 없는 게시물을 삭제할려할 때
success: false,
messages: '잘못된 요청입니다.',

다른사람의 게시물을 삭제할려할 때
success: false,
messages: "다른사람의 게시물은 삭제할 수 없습니다.” |
| 게시글 수정 | /api/post/:postId | PUT | 200 | token: 토큰 | contents, img_url | id: 게시글 아이디,
nickname: 글쓴이 닉네임,
contents: 글,
profile_img: 글쓴이 프사,
img_url: 게시글 이미지,
like_count: 좋아요 갯수,
like_check: 글을 보고 있는 유저의 좋아요 유무,
me: 작성 유무,
reg_date: 작성날짜, |
|  |  |  | 401 |  |  | 없는 게시물을 수정할 때
success: false,
messages: '잘못된 요청입니다.',
다른사람의 게시물을 수정할 때
success: false,
messages: "다른사람의 게시물은 수정할 수 없습니다.” |
| 게시글 좋아요 | /api/post/:postId/like | POST | 200 | token: 토큰 |  | success: true,
messages: '좋아요!', |
|  |  |  | 401 |  |  | success: false,
messages: '로그인 후 사용하세요', |
| 게시글 좋아요 취소 | /api/post/:postId/like | DELETE | 200 | token: 토큰 |  | success: true,
messages: '취소', |
|  |  |  | 401 |  |  | success: false,
messages: '로그인 후 사용하세요', |
| 회원가입 | /api/register | POST | 201 | token: 토큰 |  | success: true,
messages: '회원가입 성공!', |
|  |  |  | 401 |  |  | 로그인 한 사용자가 접속
success: false,
message: '로그인 중 입니다.’
비밀번호에 닉네임과 같은  값이 포함
success: false,
message: '사용할 수 없는 비밀번호입니다.\n닉네임과 겹치지 않게 만들어주세요.’
비밀번호와 비밀번호 확인이 일치하지 않음
success: false,
messages: "비밀번호가 일치하지 않습니다.”
아이디 또는 닉네임이 중복
success: false,
messages: '아이디 또는 닉네임이 중복됩니다.',
빈칸이 있음
success: false,
messages: '빈칸이 있습니다.', |
| 로그인 | /api/login | POST | 200 | token: 토큰 |  | success: true,
messages: '로그인 성공!',
token, |
|  |  |  | 401 |  |  | 로그인 한 사용자가 접속
success: false,
message: '이미 로그인이 되어있습니다.’
아이디 또는 비밀번호가 일치하지 않음
success: false,
messages: '아이디 또는 비밀번호가 틀렸습니다.',
빈칸이 있음
success: false,
messages: '잘못된 값을 입력하셨습니다. \n빈칸이 있는지 확인해 주세요.’ |