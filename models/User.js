const mongoose = require("mongoose");
mongoose.connect(process.env.APP_MONGO_URL);
// const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  type: String,
});

UserSchema.methods.verifyPassword = function (password) {
  // callback(err, bcrypt.compareSync(password, this.password));
  return password === this.password;
};

const User = mongoose.model("User", UserSchema);

// const User = new mongoose.Schema({
//   username: String,
//   password: String,
//   type: String,
// });

// User.plugin(passportLocalMongoose);

// module.exports = mongoose.model("userData", User, "userData");
module.exports = User;
