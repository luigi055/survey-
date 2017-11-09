"use strict";
const env = process.env.NODE_ENV || "development";
console.log(`-._.-* Enviroment: ${env} *-._.-`);

if (env === "test" || env === "development") {
  const config = require("./config.json");
  const envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}
