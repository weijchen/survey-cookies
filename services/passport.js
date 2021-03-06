const passport        = require("passport"),
      GoogleStrategy  = require("passport-google-oauth20").Strategy,
      mongoose        = require("mongoose"),
      keys            = require("../config/keys")

const User            = mongoose.model('users');

// user here is the user we put into the database
passport.serializeUser((user, done) => {
  done(null, user.id);  // user.id is the id generated by mongo (internal id)
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// setting up the google oauth
passport.use(
  new GoogleStrategy( // by default, setted as 'google' identifier
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, 
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      } 
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )

  // TODO: add facebook authentication
);