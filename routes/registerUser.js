const jwtSecret = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");
//const passport = require("passport");

module.exports = (app, passport) => {
  app.post("/api/register", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
      if (info) {
        console.log("A -> I give you the INFO");
        return res.send(info.message);
      }
      if (err) {
        console.log("A -> I give you the ERR", err);
        return res.status(401).send(err);
      }
      if (user == false) {
        return res.status(401).send({ message: "User already exist" });
      }
      req.login(user, { session: false }, err => {
        console.log("we are here_1");
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ id: user.email }, jwtSecret.secret);
        console.log("we are here_2");
        return res.status(200).send({
          auth: true,
          token: token,
          message: "User was registered and is now logged in"
        });
      });
      console.log("we are here_3");
    })(req, res, next);
  });
};
