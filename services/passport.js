const jwtSecret = require("../config/jwtConfig");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const User = mongoose.model("user");

const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });

  // local-signup strategy

  passport.use(
    "register",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        session: false,
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      async (req, email, password, done) => {
        try {
          const existingUser = await User.findOne({ email: email });
          console.log("P -> I search for the provided user");
          if (existingUser) {
            //done(null, false, { message: "That email is already used" });
            console.log("P -> user exists");
            return done(null, false);
          } else {
            console.log("P -> I create a new user");
            const user = await new User({
              email: email,
              password: generateHash(password)
            }).save();
            done(null, user);
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );

  // local-login strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      async (req, email, password, done) => {
        try {
          const existingUser = await User.findOne({ email: email });
          console.log("P -> I search for the provided user");
          if (!existingUser) {
            console.log("P -> NO user found");
            return done(null, false);
          }
          // if the user is found but the password is wrong
          if (!validPassword(password, existingUser.password)) {
            return done(null, existingUser, false);
          }
          // all is well, return successful user
          // return done(null, existingUser, { message: "Loggedin Successfully" });
          done(null, existingUser);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret.secret
  };

  passport.use(
    "jwt",
    new JWTstrategy(opts, async (jwtPayload, done) => {
      try {
        const existingUser = await User.findOne({ email: jwtPayload.id });
        console.log("Email is -> ", jwtPayload.id);
        if (!existingUser) {
          return done(null, false);
        } else {
          return done(null, existingUser);
        }
      } catch (err) {
        done(err);
      }
    })
  );
};

// generating a hash
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
function validPassword(password, crypt_password) {
  return bcrypt.compareSync(password, crypt_password);
}
