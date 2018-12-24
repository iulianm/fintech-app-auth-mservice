const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  admin: Boolean
});

// this loads the schema into mongoose
mongoose.model("user", userSchema);
