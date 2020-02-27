const express = require("express");
const placesController = require("../controllers/places-controller");

const router = express.Router();

// single place
router.get("/:placeId", placesController.getPlaceById);

//all user places
router.get("/user/:uid", placesController.getUserPlaces);

module.exports = router;
