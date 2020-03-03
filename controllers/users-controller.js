const { v4: uuidV4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@test.com",
    password: "abc123",
    isLoggedIn: false
  },
  {
    id: "u2",
    name: "Mary James",
    email: "mary@test.com",
    password: "abc123",
    isLoggedIn: false
  }
];

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
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
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

  res.status(200).json({ message: "Logged in" });

  // const userIndex = DUMMY_USERS.findIndex(u => u.email === email);

  // DUMMY_USERS[userIndex].isLoggedIn = true;

  // res.status(200).json({ message: "Logged in" });
};

module.exports = { getUsers, signup, login };
