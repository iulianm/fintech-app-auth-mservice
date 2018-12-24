const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

const app = express();

mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true }
);
require("./services/passport")(passport);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(passport.initialize());
// app.use(passport.session());

require("./routes/authUser")(app);
require("./routes/loginUser")(app, passport);
require("./routes/registerUser")(app, passport);
require("./routes/logoutUser")(app);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => console.log("Listening on port ${PORT}"));

// module.exports = app;
