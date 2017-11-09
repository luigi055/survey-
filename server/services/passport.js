"use strict";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const User = require("./../models/User");

// serialize user an get token
// this is what the google strategy will save seconds before to save
passport.serializeUser((user, done) => {
  // no error and serialize user.id
  // this user.id comes from the mongodb document Object ID
  // since is very easier to find the document id than the google id since
  // it could be facebook, twitter or other provider id
  // === IMPORTANT ===
  // Oauth's only pupose is to allow someone to sign in. afeter that,
  // We use our own internal document Object ID
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true // if this request pass in any proxy is ok nice to avoid change https to http in heroku
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        googleId: profile.id
      });

      if (!existingUser) {
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          avatar: profile.photos[0].value,
          gender: profile.gender,
          provider: profile.provider
        });

        const user = await newUser.save();
        return done(null, user);
      }

      // user exists so no error (null) and pass in the user
      done(null, existingUser);
    }
  )
);
