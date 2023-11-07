const passport = require('passport')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Users } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/auth.middleware')

// 회원가입
router.post('/signup', isNotLoggedIn, async (req, res) => {
  const { email, password, confirm } = req.body

  try {
    const exUser = await Users.findOne({ where: { email }})

    if (exUser) throw new Error({ errMessage: '이미 존재하는 이메일입니다.'})

    if ( password !== confirm) {
      throw new Error({ errMessage: '비밀번호가 일치하지 않습니다.' })
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await Users.create({ email, password: hashedPassword})

    res.status(201).json({ user })
  } catch (err) {
    console.log(err)
    res.status(500).json({ errMessage: '알 수 없는 오류' })
  }
})


// 로컬 로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
  }, (authError, user, info) => { // 'local' 전략을 사용하여 인증을 시도한다.
    // 인증 과정 중 에러가 발생한 경우
    if (authError) { 
      console.error(authError);
      return next(authError);
    }
    // 사용자를 찾지 못한 경우
    if (!user) {
      console.log(info) 
      return  res.status(401).json(info);
    }
    // req.login 메서드를 호출하여 사용자를 로그인 시킨다.
    return req.login(user, (loginError) => { 
      // 로그인 과정 중 에러가 발생한 경우
      if (loginError) { 
        console.error(loginError);
        return next(loginError);
      }
      // 유저 세션 정보 저장
      Users.update({
        sessionId: req.session.id,
        sessionData: req.session.passport.user
      }, {
        where: { userId: user.userId }
      })
      // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
      return res.redirect('/')
    });
  }) 
  
  (req, res, next); // 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
});

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao'))
router.get('kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/'
}), 
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    res.redirect('/')
  }
);


module.exports = router