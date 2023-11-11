const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const dotenv = require("dotenv");
const { Users } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        // 카카오 로그인에서 발급받은 REST API 키
        clientID: process.env.KAKAO_ID,
        // 카카오 로그인 Redirect URL 경로
        callbackURL: "/auth/kakao/callback",
      },

      /*
        * clientID에 카카오 앱 아이디 추가
        * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
        * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
        * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
      */

      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile);

        try {
          const exUser = await Users.findOne({ where: { snsId: profile.id, provider: "kakao" }});

          // 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            throw new Error()
            done(null, exUser); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다.
            const newUser = await Users.create({
              email: profile._json?.kakao_account?.email,
              nickname: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });

            done(null, newUser); // 회원가입하고 로그인 인증 완료
          }
        } catch (err) {
          console.log(err);
          done(err);
        }
      }
    )
  );
};
