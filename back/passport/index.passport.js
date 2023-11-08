const passport = require('passport');
const local = require('./localStrategy'); // 로컬서버로 로그인할 때
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할 때
const naver = require('./naverStrategy') // 네이버서버로 로그인할 때
const { Users } = require('../models')

module.exports = () => {
  // serializeUser는 로그인 성공 후, req.session 객체에 어떤 정보를 저장할지 정할 수 있다.
  // Ex. user 객체 전체를 저장 or user.id만 저장
  // 후에 req.isAuthenticated()메서드를 통해 로그인을 했는지 유무를 확인할 수 있다.

  // deserializeUser는 serializeUser에 전달 받은 정보로 user 객체를 온전히 만든다.
  // 이렇게 하면 후에 다른 라우트 핸들러에서 req.user를 통해 유저 정보에 접근할 수 있다.

  // serializeUser (Strategy 성공 시 호출 됨)
  // : 로그인 성공 시, req.login(user, ...)에서 실행되는 done(null, user)에서 user객체를 전달받아 세션(req.session.passport.user)에 저장한다. 
  // 세션이 있어야 페이지 이동 시에도 로그인 정보가 유지될 수 있다.
  passport.serializeUser((user, done) => { // req.login(user, ... )의 user가 여기로 와서 값을 이용할 수 있다.
    // req.session 객체에 어떤 데이터를 저장할지 선택 할 수 있다.
    // 사용자의 온갖 정보를 모두 들고 있으면 서버 자원낭비기 때문에 사용자 아이디만 저장하고 데이터를 deserializeUser애 전달한다.
    // 세션에는 { id: 1, 'connect.sid' : s%23842309482 } 가 저장된다.
    done(null, user.userId) // user.id가 deserializeUser의 첫 번째 매개변수로 이동
  });

  // deserializeUser
  // : 실제 서버로 들어오는 요청마다 세션 정보(serializeUser에서 저장됨)를 실제 DB 데이터와 비교한다.
  // req.session에 저장된 사용자 id를 바탕으로 DB조회로 사용자 정보를 얻어낸 후, done의 두번째 인자를 req.user에 저장한다.
  // 요청을 처리할 때 유저의 정보를 req.user를 통해서 넘겨준다. 
  // 즉, id를 SQL로 조회해서 전체 정보를 가져오는 복구 로직이다.
  passport.deserializeUser((id, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    Users.findOne({ where: { userId: id} })
      .then(user => done(null, user)) // 여기의 user가 req.user가 됨 
      .catch(err => done(err))
  });
  // => 두 메소드는 꼭 있어야 passport가 작동한다.

  // passport가 local전략을 설정하고 초기화하기 위해 호출
  // 해당 함수를 호출함으로써 passport는 서버에서 해당 전략을 사용할 수 있도록 설정이 된다.
  local()
  kakao()
  naver()
}; 