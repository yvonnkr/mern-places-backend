const axios = require("axios");
const HttpError = require("../models/http-error");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`;

  const response = await axios.get(url);

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address",
      422
    );
    throw error;
  }

  const coords = data.results[0].geometry.location;
  return coords;
}

exports.getCoordsForAddress = getCoordsForAddress;
