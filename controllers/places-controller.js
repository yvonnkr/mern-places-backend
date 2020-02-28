const { v4: uuidV4 } = require("uuid");
let { DUMMY_PLACES } = require("../data/dummy-places");
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
const getPlacesByUserId = (req, res, next) => {
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

//update place
const updatePlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  const index = DUMMY_PLACES.findIndex(p => p.id === placeId);

  if (!place) {
    const error = new HttpError("Place with given id not found", 404);
    return next(error);
  }

  const { title, description, imageUrl } = req.body;

  place.title = title;
  place.description = description;
  place.imageUrl = imageUrl;

  DUMMY_PLACES[index] = place;

  res.status(200).json({ place });
};

//delete place
const deletePlaceById = (req, res, next) => {
  const newPlaces = DUMMY_PLACES.filter(p => p.id !== req.params.placeId);

  if (newPlaces.length === 0) {
    const error = new HttpError("Place with given id not found", 404);
    return next(error);
  }

  DUMMY_PLACES = newPlaces;

  res.status(200).json({ message: "Place Deleted", places: DUMMY_PLACES });
};

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlaceById,
  deletePlaceById
};
