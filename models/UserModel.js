const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTERSECRET);
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    encry_dob: {
      type: String,
    },
    encry_pan: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("dob")
  .set(function (dob) {
    const encry_dob = cryptr.encrypt(dob);
    this.set({ encry_dob });
  })
  .get(function () {
    return cryptr.decrypt(this.encry_dob);
  });

userSchema
  .virtual("pan")
  .set(function (pan) {
    const encry_pan = cryptr.encrypt(pan);
    this.set({ encry_pan });
  })
  .get(function () {
    return cryptr.decrypt(this.encry_pan);
  });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
