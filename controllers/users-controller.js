const { v4: uuidV4 } = require("uuid");
const HttpError = require("../models/http-error");

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

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = DUMMY_USERS.find(u => u.email === email);

  if (userExists) {
    return next(
      new HttpError("Could not create user, email already exists", 422)
    );
  }

  const newUser = {
    id: uuidV4(),
    name,
    email,
    password
  };

  newUser.isLoggedIn = true;

  DUMMY_USERS.push(newUser);

  res.status(201).json({ message: "User Created", user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(u => u.email === email);

  if (!user || user.password !== password) {
    return next(new HttpError("Incorrect credetial,unable to login", 401));
  }

  const userIndex = DUMMY_USERS.findIndex(u => u.email === email);

  DUMMY_USERS[userIndex].isLoggedIn = true;

  res.status(200).json({ message: "Logged in" });
};

module.exports = { getUsers, signup, login };
