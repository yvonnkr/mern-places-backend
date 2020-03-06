const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

//get all users
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  res
    .status(200)
    .json({ users: users.map(u => u.toObject({ getters: true })) });
};

//signup new user
const signup = async (req, res, next) => {
  //input validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed,please check your data", 422)
    );
    // return res.status(422).json({ errors: errors.array().map(err => err.msg) });
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  if (existingUser) {
    return next(new HttpError("User with given email already exists", 422));
  }

  //Hash password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path, //then prepend "http://localhost:5000/" in frontend
    password: hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Server Error", 500));
  }

  //generate JWT
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Signup failed,try again later", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
  // res.status(201).json({ user: createdUser.toObject({ getters: true }) }); //before token
};

//login user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Incorrect credetial,unable to login", 403));
  }

  //compare hashed pswd & re.body pswd
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError(
        "Could not log you in,please check your credentials & try again",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Incorrect credetial,unable to login", 403));
  }

  //generate JWT if isValidPassword
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Loggin in failed,try again later", 403));
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });

  // res.status(200).json({
  //   message: "Logged in",
  //   user: existingUser.toObject({ getters: true })
  // });
};

module.exports = { getUsers, signup, login };
