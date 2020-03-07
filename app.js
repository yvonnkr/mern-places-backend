const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// require("./db/db-connect");
const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

//serve images statically
app.use("/uploads/images", express.static(path.join("uploads", "images")));

//Solve CORS error  --Cross-Origin-Resource-Sharing --blocks sharing data/resources from different domains
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization "
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

//Error handling for Routes NOT found
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//All other Error Handling middleware
app.use((error, req, res, next) => {
  //rollback/remove image upload if any error found
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An Unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@placescluster-m7757.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Connected to database");

    app.listen(proccess.env.PORT || 5000);
  })
  .catch(() => {
    console.log("Connection to Database failed");
  });
