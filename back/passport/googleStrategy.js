const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { Users } = require('../models')

module.exports = () => {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async ( accessToken, refreshToken, profile, done ) => {
      console.log('google profile : ', profile);
      try {
        const exUser = await Users.findOne({ where: { snsId: profile.id, provider: 'google' }});

        if (exUser) {
          done(null, exUser)
        } else {
          const newUser = await Users.create({
            email: profile?.emails[0].value,
            nickname: profile.displayName,
            snsId: profile.id,
            provider: 'google'
          })

          done(null, newUser);
        }
      } catch (err) {
        console.error(err)
        done(err)
      }
    }
    ));
};