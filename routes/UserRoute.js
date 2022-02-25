const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const {
  signin,
  signup,
  isAuthenticated,
  getdetails,
  updateUser,
} = require("../controllers/UserController");

router.post(
  "/signup",
  [
    check("fullName").isLength({ min: 3 }),
    check("email").isEmail(),
    check("phone").isLength(10),
    check("pan").isLength(10),
    check("dob").isLength(10),
    check("password").isLength({ min: 5 }),
  ],
  signup
);

router.post("/signin", signin);

router.get("/user/:userId/details", isAuthenticated, getdetails);

router.put(
  "/user/:userId/update",
  [
    check("fullName").isLength({ min: 3 }),
    check("email").isEmail(),
    check("phone").isLength(10),
    check("pan").isLength(10),
    check("dob").isLength(10),
    check("password").isLength({ min: 5 }),
  ],
  isAuthenticated,
  updateUser
);

module.exports = router;
