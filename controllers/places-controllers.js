const { DUMMY_PLACES } = require("../data/dummy-places");

const getPlaces = (req, res, next) => {
  res.status(200).json(DUMMY_PLACES);
};

const getUserPlaces = (req, res, next) => {
  const userId = req.params.uid;
  const userPlaces = DUMMY_PLACES.filter(p => p.creator === userId);

  if (userPlaces.length === 0) {
    const error = new Error("Could not find any place for provided user");
    error.code = 404;
    return next(error);
  }

  res.status(200).json({ userPlaces: userPlaces });
};

const getSinglePlace = (req, res) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {
    const error = new Error("Place with given id not found");
    error.code = 404;

    throw error;
  }
  res.status(200).json({ place });
};

module.exports = { getPlaces, getUserPlaces, getSinglePlace };
