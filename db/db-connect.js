const mongoose = require("mongoose");

//establish connection -- mongoose uses concept called "Connection Pooling"  --just require() this file in app.js
//NOTE: in this project i just connected to db via mongoose in the app.js file then app.listen() to open server
//this file therefore is here just for reference purposes.....
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
  })
  .catch(() => {
    console.log("Connection to Database failed");
  });
