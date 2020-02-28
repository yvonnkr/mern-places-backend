const { v4: uuidV4 } = require("uuid");
const { DUMMY_PLACES } = require("../data/dummy-places");
const HttpError = require("../models/http-error");

// single place
const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {
    throw new HttpError("Place with given id not found", 404);
  }
  res.status(200).json({ place });
};

//all user places
const getUserPlaces = (req, res, next) => {
  const userId = req.params.uid;
  const userPlaces = DUMMY_PLACES.filter(p => p.creator === userId);

  if (userPlaces.length === 0) {
    return next(
      new HttpError("Could not find any place for provided user", 404)
    );
  }

  res.status(200).json({ userPlaces: userPlaces });
};

//create new place
const createPlace = (req, res, next) => {
  const {
    title,
    description,
    imageUrl,
    address,
    coordinates,
    creator
  } = req.body;

  const createdPlace = {
    id: uuidV4(),
    title,
    description,
    imageUrl,
    address,
    location: coordinates,
    creator
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

module.exports = { getUserPlaces, getPlaceById, createPlace };
