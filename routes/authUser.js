const passport = require("passport");

module.exports = app => {
  app.get("/api/auth", (req, res, next) => {
    passport.authenticate("jwt", (err, user, info) => {
      if (info) {
        console.log("A -> I give you the INFO");
        return res.status(401).send(info.message);
      }
      if (err) {
        console.log("A -> I give you the ERR", err);
        return res.status(401).send(err);
      }
      if (user == false) {
        return res.status(401).send({ message: "Unauthorized request" });
      }

      req.login(user, { session: false }, err => {
        console.log("we are here_1");
        if (err) {
          return next(err);
        }
        console.log("we are here_2");
        return res.status(200).send({
          auth: true,
          message: "User is authenticated"
        });
      });
      console.log("we are here_3");
    })(req, res, next);
  });
};
