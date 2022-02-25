const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");

exports.signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, pan, dob } = req.body;
  const userfound = await User.findOne({ email });

  if (userfound) {
    res.status(400).json({ error: "User Already Exists!" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    pan,
    dob,
  });
  if (user) {
    res.status(201).json({
      fullName: user.fullName,
      email: user.email,
    });
  } else {
    res.status(404).json({ error: "Not able to Save User in Database" });
  }
});

exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordMatched = await user.matchPassword(password);
  if (user && passwordMatched) {
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: jwtToken,
    });
  } else {
    res.status(401).json({ error: "Invalid Email or Password" });
  }
});

exports.getdetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      dob: user.dob,
      phone: user.phone,
    });
  } else {
    res.status(404).json({ error: "some error occured" });
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, pan, dob } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
    fullName: fullName,
    email: email,
    password: password,
    phone: phone,
    pan: pan,
    dob: dob,
  });

  if (updatedUser) {
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      dob: updatedUser.dob,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404).json({ error: "failed to update user" });
  }
});

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    try {
      token = req.headers.authorization.split(" ")[1];
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(verified.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Not Authorized" });
    }
  if (!token) {
    res.status(401).json({ error: "Not Authorized" });
  }
});
