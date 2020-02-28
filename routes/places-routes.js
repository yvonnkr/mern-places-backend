const express = require("express");
const placesController = require("../controllers/places-controller");

const router = express.Router();

// single place
router.get("/:placeId", placesController.getPlaceById);

//all user places
router.get("/user/:uid", placesController.getPlacesByUserId);

//create new place
router.post("/", placesController.createPlace);

//update place
router.patch("/:placeId", placesController.updatePlaceById);

//delete place
router.delete("/:placeId", placesController.deletePlaceById);

module.exports = router;
