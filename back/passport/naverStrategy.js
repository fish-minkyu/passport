const passport = require('passport')
const { Strategy: NaverStrategy, Profile: NaverProfile } = require('passport-naver-v2')
const { Users } = require('../models')

module.exports = () => {
  passport.use(new NaverStrategy(
    {
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: '/auth/naver/callback'
    },
    async ( accessToken, refreshToken, profile, done ) => {
      console.log('naver profile : ', profile);
      try {
        const exUser = await Users.findOne({ where: { snsId: profile.id, provider: 'naver' }});

        if (exUser) {
          done(null, exUser)
        } else {
          const newUser = await Users.create({
            email: profile.email
          })
        }
      } catch (err) {

      }
    }
  ))


};