const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const trainings = require("./src/routes/trainings");
const logger = require("./src/middleware/logger");
const Training = require("./src/models/trainings");
const app = express();

mongoose
  .connect("mongodb://localhost/GestiuneTraininguri")
  .then(() => {
    console.log("Connected to MongoDB ...");
  })
  .catch((e) => console.log("Error on connecting to MongoDB", e));
app.use(express.json()); //req=>req.body
app.use(morgan("tiny")); //pt a afisa in consola formatul pt get/post---request
// app.use(logger);

app.use("/trainings", trainings);

app.listen(5000, () => {
  console.log("Listen on port 5000 ...");
});
