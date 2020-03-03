const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const { getCoordsForAddress } = require("../utils/location");

// single place
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  if (!place) {
    return next(new HttpError("Place with given id not found", 404));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
  // place.toObject({getters:true}) --turns mongoose place object to normal object and adds prop id
};

//all user places
const getPlacesByUserId = async (req, res, next) => {
  //see ALTERNATIVE SYNTAX/WAY below using populate **********************************
  const userId = req.params.uid;
  let userPlaces;

  try {
    userPlaces = await Place.find({ creator: userId }).populate("creator");
  } catch (error) {
    return next(new HttpError("Server eror", 500));
  }

  if (!userPlaces || userPlaces.length === 0) {
    return next(
      new HttpError("Could not find any place for provided user", 404)
    );
  }

  res
    .status(200)
    .json({ userPlaces: userPlaces.map(p => p.toObject({ getters: true })) });

  //**ALTERNATIVE WAY USING POPULATE */
  // const userId = req.params.uid;
  // let userWithPlaces;

  // try {
  //   userWithPlaces = await User.findById(userId).populate("places");
  // } catch (error) {
  //   return next(new HttpError("Server eror", 500));
  // }

  // if (!userWithPlaces || userWithPlaces.places.length === 0) {
  //   return next(
  //     new HttpError("Could not find any place for provided user", 404)
  //   );
  // }

  // res.status(200).json({
  //   userPlaces: userWithPlaces.places.map(p => p.toObject({ getters: true }))
  // });
};

//create new place
const createPlace = async (req, res, next) => {
  //input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed,please check your data", 422)
    );
    // return res.status(422).json({ errors: errors.array().map(err => err.msg) });
  }

  const { title, description, imageUrl, address, creator } = req.body;

  let coordinates;

  try {
    //from google geocode
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    imageUrl,
    address,
    location: coordinates,
    creator
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Server Error", 500));
  }

  if (!user) {
    return next(new HttpError("User with given id not found", 404));
  }

  try {
    //session/transaction
    const currentSession = await mongoose.startSession();
    currentSession.startTransaction();
    await createdPlace.save({ session: currentSession });

    user.places.push(createdPlace);
    await user.save({ session: currentSession });
    await currentSession.commitTransaction();

    res.status(201).json({ place: createdPlace });

    // await createdPlace.save();//code before sessions/trans
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }
};

//update place
const updatePlaceById = async (req, res, next) => {
  //input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed,please check your data", 422)
    );
  }

  const placeId = req.params.placeId;
  const { title, description } = req.body;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  if (!place) {
    return next(new HttpError("Place with the given id not found", 404));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });

  //another way
  /**
   * // place = await Place.findByIdAndUpdate(placeId, req.body, {
    //   new: true,
    //   runValidators: true
    // });
   */
};

//delete place
const deletePlaceById = async (req, res, next) => {
  let place;

  try {
    place = await Place.findById(req.params.placeId).populate("creator");
  } catch (e) {
    return next(new HttpError("Server error", 500));
  }

  if (!place) {
    return next(new HttpError("Place with given id not found", 404));
  }

  try {
    //session/transaction
    const currentSession = await mongoose.startSession();
    currentSession.startTransaction();
    await place.remove({ session: currentSession });
    place.creator.places.pull(place);
    await place.creator.save({ session: currentSession });
    await currentSession.commitTransaction();
    // await place.remove();
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }

  res.status(200).json({ message: "Place Deleted", place });

  //another way
  // place = await Place.findByIdAndDelete(req.params.placeId);
};

module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlaceById,
  deletePlaceById
};
