const express = require('express');
const app = express();
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const indexRoute = require('./routes/index')
const passportConfig = require('./passport/index.passport')
const dotenv = require('dotenv')
dotenv.config()
passportConfig()


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    resave: false, // 
    saveUninitialized: false, // 처음부터 세션을 생성할지
    secret: process.env.COOKIE_SECRET, // 쿠키 서명 값
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
   
  // console.log(req.session.id) 
  // console.log(req.session.passport.user)
  res.send('Hello session')
})

app.use('/', indexRoute)

app.listen(1219, () => {
  console.log(' Passport Project is working on port 1219 ')
})