const express = require("express");
const { check } = require("express-validator");

const userControllers = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

//get all users
router.get("/", userControllers.getUsers);

//signup user
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name")
      .notEmpty()
      .withMessage("please enter a name"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("please enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 chars long")
  ],
  userControllers.signup
);

//login user
router.post(
  "/login",

  userControllers.login
);

module.exports = router;
