const jwtSecret = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");
const passport = require("passport");

module.exports = app => {
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("login", (err, user, passMatch, info) => {
      if (info) {
        console.log("A -> I give you the INFO");
        return res.send(info.message);
      }
      if (err) {
        console.log("A -> I give you the ERR", err);
        return res.status(401).send(err);
      }
      if (user == false) {
        return res.status(401).send({ message: "No user was found" });
      }

      if (user && passMatch == false) {
        return res.status(401).send({ message: "Wrong password" });
      }

      req.login(user, { session: false }, err => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ id: user.email }, jwtSecret.secret);
        return res.status(200).send({
          auth: true,
          token: token,
          message: "User was found and is now logged in"
        });
      });
    })(req, res, next);
  });
};
