const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { Users } = require('../models')
const bcrypt = require('bcrypt')

// done 콜백 함수는 passport 라이브러리에서 제공하는 콜백 함수다. (라이브러리 내에서 done함수를 정의한 듯 하다.)
// serializeUser는 로그인 성공 후, req.session 객체에 어떤 정보를 저장할지 정할 수 있다.
// Ex. user 객체 전체를 저장 or user.id만 저장
// 후에 req.isAuthenticated()메서드를 통해 로그인을 했는지 유무를 확인할 수 있다.

// deserializeUser는 serializeUser에 전달 받은 정보로 user 객체를 온전히 만든다.
// 이렇게 하면 후에 다른 라우트 핸들러에서 req.user를 통해 유저 정보에 접근할 수 있다.

module.exports = () => {
  // serializeUser (Strategy 성공 시 호출 됨)
  // : 로그인 성공 시, 실행되는 done(null, user)에서 user객체를 전달받아 세션(req.session.passport.user)에 저장한다. 
  // 세션이 있어야 페이지 이동 시에도 로그인 정보가 유지될 수 있다.
  passport.serializeUser((user, done) => {
    done(null, user) // user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  // deserializeUser
  // : 실제 서버로 들어오는 요청마다 세션 정보(serializeUser에서 저장됨)를 실제 DB 데이터와 비교한다.
  // (여기서는 그냥 아무런 처리과정 없이 넘겨준다.)
  // 해당하는 유저 정보가 있으면 done의 두번째 인자를 req.user에 저장하고
  // 요청을 처리할 때 유저의 정보를 req.user를 통해서 넘겨준다. 
  passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    done(null, user) // 여기의 user가 req.user가 됨 
  });
  // => 두 메소드는 꼭 있어야 passport가 작동한다.

  // ---------------------------------------

  // passport.use() 메서드를 통해 등록한 전략을 passport.authenticate()메서드에서 호출한다.
  passport.use(new LocalStrategy(
    // 첫번째 인자
    {
    // usernameField와 passwordField는 어떤 폼 필드로부터 ID와 PW를 전달받을지 설정하는 옵션
    // 클라이언트에서 넘어오는 속성명과 같아야 한다.
    usernameField: 'email',
    passwordField: 'password',
    session: true, // 세션을 사용할지 말지 결정하는 것
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
          // false일 시, 
          done(null, false, { errMessage: '비밀번호가 일치하지 않습니다.'})
        }
      } else {
        done(null, false, { errMessage: '가입되지 않은 회원입니다.'})
      }
    } catch (err) {
      console.log(err)
      done(err)
    }
  }
  ))
}