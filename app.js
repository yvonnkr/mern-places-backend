const express = require("express");
const { json, urlencoded } = require("body-parser");

const app = express();

// app.use(json());
app.use(urlencoded({ extended: false }));

app.post("/user", (req, res, next) => {
  res.send(`<h1>${req.body.username}</h1>`);
});

app.get("/", (req, res, next) => {
  res.send(`
  <form action="/user"  method="post">
    <input type="text" name="username" />
    <button type="submit" >Create User</button>
</form>
  `);
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
