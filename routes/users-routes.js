const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/users-controller");

const router = express.Router();

//get all users
router.get("/", userControllers.getUsers);

//signup user
router.post(
  "/signup",
  [
    check("name")
      .notEmpty()
      .withMessage("please enter a name"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("please enter a valid email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("password must be at least 5 chars long")
  ],
  userControllers.signup
);

//login user
router.post(
  "/login",

  userControllers.login
);

module.exports = router;
