const express = require("express");
const { json, urlencoded } = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(json());
// app.use(urlencoded({ extended: false }));

app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

app.listen(5000, () => {
  console.log("Server up on port 5000");
});
