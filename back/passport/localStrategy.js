const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const { Users } = require('../models')

module.exports = () => {
  // auth라우터에서 /login 요청이 오면 local 설정대로 이쪽이 실행하게 된다.

  // passport.use() 메서드를 통해 등록한 전략을 passport.authenticate()메서드에서 호출한다.
  passport.use(new LocalStrategy(
    // 첫번째 인자
    {
    // usernameField와 passwordField는 어떤 폼 필드로부터 ID와 PW를 전달받을지 설정하는 옵션
    // req.body 객체인자하고 키값이 일치해야 한다.
    usernameField: 'email',
    passwordField: 'password',
    session: true, // 세션을 사용할지 말지 결정하는 것, 세션에 저장 여부 결정
    passReqToCallback: false, // true로 설정 시, 뒤의 콜백 함수가 (req, id, password, done) => {};으로 변경
  },
  // 두번째 인자
  async (email, password, done) => {
    try {
      const exUser = await Users.findOne({ where: { email }})

      if (exUser) {
        const isMatch = await bcrypt.compare(password, exUser.password)

        if (isMatch) {
          // true일 시, 
          done(null, exUser) // -> passport.serializeUser()으로 이동
        }
        else {
          // false일 시, done()의 2번째 인수는 false로 주고 3번째 인수에 선언
          done(null, false, { errMessage: '비밀번호가 일치하지 않습니다.'})
        }
      } else {
        done(null, false, { errMessage: '가입되지 않은 회원입니다.'})
      }
    } catch (err) {
      console.log(err)
      done(err) // done()의 첫번째 함수는 err용. 특별한것 없는 평소에는 null로 처리
    }
  }));
};