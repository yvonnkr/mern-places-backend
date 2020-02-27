const express = require("express");
const {
  getPlaces,
  getUserPlaces,
  getSinglePlace
} = require("../controllers/places-controllers");

const router = express.Router();

//all places
router.get("/", getPlaces);

//all user places
router.get("/user/:uid", getUserPlaces);

//single place
router.get("/:placeId", getSinglePlace);

module.exports = router;
