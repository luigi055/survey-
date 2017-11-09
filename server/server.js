"use strict";
require("./config/config");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("./db/mongoose");

const PORT = process.env.NODE_ENV || 3000;
const app = express();

require("./services/passport");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// enable cookies in express app
app.use(
  cookieSession({
    // how long does this cookie going to be in the browser
    // expressed in miliseconds
    // so 30 days will be
    // 30 days * 24 hours each day * 60 minutes in a hour * 60 seconds in a minute * 1000 ms in a second
    name: "session-app",
    maxAge: 30 * 24 * 60 * 60 * 1000,

    // keys to encrypt this cookie and this value should be random and difficult to remember
    keys: [process.env.cookieKey],
    secure: process.env.NODE_ENV === "production" ? true : false
    // keys: ['asr5g4asrarg3ag4ag651aga5s'],
  })
);

// enable passport to use cookies in authentication
app.use(passport.initialize());
app.use(passport.session());

authRoutes(app);

// then go and check if public index.html file has one
if (process.env.NODE_ENV === "production") {
  // Run the app by serving the static files
  // in the client/public directory
  app.use(express.static(__dirname + "/client/public"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/public/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server successfully running on port ${PORT}`);
});
