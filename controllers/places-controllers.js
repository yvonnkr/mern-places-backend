const { DUMMY_PLACES } = require("../data/dummy-places");

const getPlaces = (req, res, next) => {
  res.status(200).json(DUMMY_PLACES);
};

module.exports = { getPlaces };
