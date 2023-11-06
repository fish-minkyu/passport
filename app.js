const express = require('express');
const app = express();
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const indexRoute = require('./routes/index')
const passportConfig = require('./passport/passport')
passportConfig()


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    resave: false, // 
    saveUninitialized: false, // 처음부터 세션을 생성할지
    secret: 'secret-key', // 쿠키 서명 값
    cookie: {
       httpOnly: true,
       secure: false,
       maxAge: 60 * 180 * 1000 // 3시간 // 밀리초 단위
    },
 }),
)

// express-session에 의존하므로 뒤에 위치해야 한다.
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심는다.
// passport.session()이 실행되면, 
// 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.
app.use(passport.session()); // req.session 객체에 passport 인증 완료 정보를 추가 저장한다.

app.get('/', function (req, res, next) {
   
  console.log(req.session.id) 
  console.log(req.session.passport.user.userId)
  res.send('Hello session')
})

app.use('/', indexRoute)

app.listen(1219, () => {
  console.log(' Passport Project is working on port 1219 ')
})

// 로그인 로직 순서
// 1. auth.js, passport.authenticate()
// 2. passport.js, passport.use(new LocalStrategy()
// 3. 성공 시, passport.serializeUser() -> passport.deserializeUser()


// 질문
// 로그인 실패 시, done(null, false, {})는 어디로 가나?
// req.login() 메서드는 사용자를 로그인 상태로 설정하는 메서드이며, 로그인 과정 중에 에러가 발생하면 해당 에러를 next() 함수의 인자로 전달하여 에러 처리 미들웨어로 제어를 전달합니다.
// 에러 처리 미들웨어는 일반적으로 Express.js 애플리케이션에서 에러를 처리하는 중앙 처리기 역할을 수행합니다. 따라서 next(loginError)를 호출하여 에러를 전달하면, 해당 에러를 처리하는 에러 처리 미들웨어로 제어가 전달되어 에러를 적절히 처리할 수 있습니다.
// 에러 처리 미들웨어는 app.use()를 사용하여 전역적으로 등록할 수도 있고, 특정 라우터에서만 사용할 수도 있습니다. 따라서 next(loginError)를 호출한 후에는 에러 처리 미들웨어가 적절히 등록되어 있는지 확인해야 합니다. 등록되어 있지 않다면 에러는 Express.js의 기본 에러 처리 메커니즘에 의해 처리될 수 있습니다.



// DB에 세션 저장 시, 무엇을 정확히 저장하나?
// 세션 식별자(req.sessionId)와 세션 데이터를 저장한다.
// 세션 데이터는 아마 내가 따로 지정을 해줘야 하는 것 같다.
// 네, 세션 데이터는 사용자가 맘대로 정할 수 있는 데이터입니다. 세션 데이터는 클라이언트와 서버 간의 세션을 유지하고 필요한 정보를 저장하기 위해 사용됩니다. 따라서 세션 데이터의 구성은 서비스의 요구사항과 사용자의 필요에 따라 자유롭게 정할 수 있습니다.
// 세션 데이터로 저장할 수 있는 정보는 다양합니다. 예를 들어, 로그인 상태를 나타내는 정보, 사용자 ID, 사용자 설정, 장바구니 내역, 세션 만료 시간 등을 세션 데이터로 저장할 수 있습니다. 이러한 정보들은 클라이언트와 서버 간의 세션을 유지하며 서비스의 다양한 기능을 제공하는 데 사용될 수 있습니다.

// 사용자 인증 기능은 어떻게 구현하나?
// 세션으로 로그인 로직을 구현한 경우, Passport가 제공하는 req.isAuthenticated()으로 알 수 있다.
// Code
// app.post('/create-post', (req, res) => {
//   if (req.isAuthenticated()) {
//     // 사용자가 로그인한 경우
//     // 게시물을 생성하는 로직 수행
//   } else {
//     // 사용자가 로그인하지 않은 경우
//     // 로그인 페이지로 리다이렉트 또는 에러 처리 등을 수행
//   }
// });