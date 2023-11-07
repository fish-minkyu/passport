const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const dotenv = require('dotenv')
const { Users } = require('../models')
dotenv.config()

module.exports = () => {
  passport.use(new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: '/auth/kakao/callback'
    },
    async ( accessToken, refreshToken, profile, done ) => {
      console.log('kakao profile', profile);
      try {
        const exUser = await Users.findOne({ where: { snsId: profile.id, provider: 'kakao' } })

        if (exUser) {
          done(null, exUser)
        }
      } catch (err) {

      }
    }



    ))


};