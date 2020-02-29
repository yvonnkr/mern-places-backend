const express = require("express");
const { json, urlencoded } = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(json());

//Solve CORS error  --Cross-Origin-Resource-Sharing --blocks sharing data/resources from different domains
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

//Error handling for Routes NOT found
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//Error Handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An Unknown error occurred!" });
});

app.listen(5000, () => {
  console.log("Server up on port 5000");
});
