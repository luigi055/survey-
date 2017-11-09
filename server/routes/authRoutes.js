"use strict";
const passport = require("passport");

const env = process.env.NODE_ENV || "development";
module.exports = app => {
  // GOOGLE OAUTH
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"] // give me the profile and email of the google user
    })
  );

  // /auth/google will redirect to callback where will bring it to us the auth token in the  accesToken
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      // I DIDNT FIND AND WAY TO PROXY THE CALLBACK TO REDIRECT TO LOCALHOST:8080/SURVEY
      // IN CLIENT SIDE SO I GOT TO GUIDE IT USING PROCESS.ENV.NODE_ENV TO DETECT IF
      // DEVELOPMENT USE THE CLIENT LOCALHOST ROUTE IF PRODUCTION USE THE RELATIVE ONE
      // SINCE IN PRODUCTION BOTH CLIENT AND BACKEND WILL POINTED TO THE SAME SERVER
      successRedirect:
        env === "development"
          ? `http://localhost:${process.env.DEV_PORT}/surveys`
          : "/survey",
      failureRedirect: "/"
    })
  );

  app.get("/auth/logout", (req, res) => {
    // passport deserialize the cookie
    // and also pass as middleware req-logout
    req.logout();
    res.redirect("/");
  });

  app.get("/auth/current_user", (req, res) => {
    // passport deserialize the cookie
    // and send it back to req.user
    res.send(req.user);
  });
};
