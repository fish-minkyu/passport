const passport = require('passport')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Users } = require('../models')

// 회원가입
router.post('/signup', async (req, res) => {
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


// 로그인
router.post('/login', (req, res, next) => { //* Q. passport.authenticate()는 LocalStrategy를 'local'만으로 어떻게 찾았지?
  passport.authenticate('local', (authError, user, info) => { // 'local' 전략을 사용하여 인증을 시도한다.
    // 인증 과정 중 에러가 발생한 경우
    if (authError) { 
      console.error(authError);
      return next(authError);
    }
    // 사용자를 찾지 못한 경우
    if (!user) { 
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
        sessionData: req.session.passport.user.userId
      }, {
        where: { userId: user.userId }
      })
      
      return res.redirect('/')
    });
  }) 
  
  (req, res, next);
});


module.exports = router