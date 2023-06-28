const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, minlength: 8 },
  urls: [
    {
      type: String,
      ref: "url",
    },
  ],
});

// Before saving to database, hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// To ensure user logging in has the correct credentials
// userSchema.methods.matchPasswords = async (password) => {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);

//   return compare;
// };

userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

userSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
