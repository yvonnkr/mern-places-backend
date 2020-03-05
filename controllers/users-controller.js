const { validationResult } = require("express-validator");
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

  const createdUser = new User({
    name,
    email,
    image: req.file.path, //then prepend "http://localhost:5000/" in frontend
    password,
    places: []
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Server Error", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Incorrect credetial,unable to login", 401));
  }

  res.status(200).json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }) //exposes the password....
  });

  // const userIndex = DUMMY_USERS.findIndex(u => u.email === email);

  // DUMMY_USERS[userIndex].isLoggedIn = true;

  // res.status(200).json({ message: "Logged in" });
};

module.exports = { getUsers, signup, login };
