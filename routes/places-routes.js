const express = require("express");
const { getPlaces } = require("../controllers/places-controllers");

const router = express.Router();

router.get("/", getPlaces);

module.exports = router;
