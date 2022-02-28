let likeCheck = (id, postId, likes) => {
  if (!likes) {
    return false;
  }

  let temp = [];

  for (const like of likes) {
    if (postId === like.post_id) {
      temp.push(like.user_id);
      // console.log('aa');
    }
  }
  // console.log(temp == id);
  for (const t of temp) {
    // console.log(t)
    if (id === t) {
      // console.log('추천!');///
      return true;
    }
  }

  return false;
}


let likeCount = (postId, likes) => {
  let count = 0;
  // console.log(likes)
  if (!likes) {
    return 0;
  }
  
  for (const like of likes) {
    if (postId === like.post_id) {
      count++;
    }
  }

  return count;
}


let userInfo = (users, post) => {
  for (const user of users) {
    if (user.id === post.user_id) {
      // console.log(user)
      return user;
    }
  }
}


let write = (me, post) => {
  if (me.id === post.user_id) {
    return true;
  }
  return false;
}

// 게시글 불러오기
exports.getPost = (user, post, like) => {
  // console.log(user, post, like, me);

  const newPost = post.map((temp) => {
    const me = userInfo(user, temp);
    const like_count = likeCount(temp.id, like);
    // console.log(me);

    return {
      id: temp.id,
      nickname: me.nickname,
      contents: temp.contents,
      profile_img: me.profile_img_url,
      img_url: temp.img,
      like_count,
      like_check: false,
      me: false,
      reg_date: temp.createdAt,
    }
  });

  return newPost;
}


exports.loginGetPost = (user, post, like, me) => {
  const newPost = post.map((temp) => {
    const my = userInfo(user, temp);
    const like_count = likeCount(temp.id, like);
    const like_check = likeCheck(me.id, temp.id, like);
    const writeme = write(me, temp);

    console.log('게시판 id', temp.user_id,'/ 로그인 id', my.id);

    return {
      id: temp.id,
      nickname: my.nickname,
      contents: temp.contents,
      profile_img: my.profile_img_url,
      img_url: temp.img,
      like_count,
      like_check,
      me: writeme,
      reg_date: temp.createdAt,
    }
  });

  return newPost;
}

// 게시글 조회
exports.detail = (user, post, like) => {
    const like_count = likeCount(post.id, like);
    // console.log(me);

    return {
      id: post.id,
      nickname: user.nickname,
      contents: post.contents,
      profile_img: user.profile_img_url,
      img_url: post.img,
      like_count,
      like_check: false,
      me: false,
      reg_date: post.createdAt,
    }
}

exports.detailLogin = (user, post, like, me) => {
    const like_count = likeCount(post.id, like);
    const like_check = likeCheck(me.id, post.id, like);
    const writeme = write(me, post);

    return {
      id: post.id,
      nickname: user.nickname,
      contents: post.contents,
      profile_img: user.profile_img_url,
      img_url: post.img,
      like_count,
      like_check,
      me: writeme,
      reg_date: post.createdAt,
    }
}