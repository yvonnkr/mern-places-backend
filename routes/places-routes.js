const express = require("express");
const { check } = require("express-validator");
const placesController = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// single place
router.get("/:placeId", placesController.getPlaceById);

//all user places
router.get("/user/:uid", placesController.getPlacesByUserId);

//create new place
router.post(
  "/",
  fileUpload.single("imageUrl"),
  [
    (check("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),
    check("description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Description is required mim length 5"),
    check("imageUrl")
      .trim()
      .isURL()
      .withMessage("Image url is invalid"),
    check("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required"))
  ],
  placesController.createPlace
);

//update place
router.patch(
  "/:placeId",
  [
    check("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),
    check("description")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Description is required mim length 5")
  ],
  placesController.updatePlaceById
);

//delete place
router.delete("/:placeId", placesController.deletePlaceById);

module.exports = router;
