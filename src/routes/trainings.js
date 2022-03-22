const express = require("express");
const router = express.Router();
const Training = require("../models/trainings");
const moment = require("moment");

//post---create a new training
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      trainingCapacity,
      availableSeats,
      startDate,
      endDate,
      isClosedForRegistration,
    } = req.body;
    const training = new Training({
      name,
      trainingCapacity,
      availableSeats,
      startDate,
      endDate,
      isClosedForRegistration,
    });
    const result = await training.save();
    res.send(result);
  } catch (e) {
    res.send(e.message);
  }
});

//API care returneaza toate training-urile cu data de inceput (startDate) aflata intre doua date calendaristice/toate training-urile
router.get("/", async (req, res, next) => {
  const pattern = "YYYY-MM-DD[T]HH:mm:ss";
  const { to } = req.query;
  const { from } = req.query;
  if (to || from) {
    const dataTo = moment(to, pattern, true).isValid();
    const dataFrom = moment(from, pattern, true).isValid();
    if (dataTo && dataFrom) {
      const result = await Training.find({
        startDate: {
          $gt: moment(to).format("YYYY-MM-DD"),
          $lt: moment(from).format("YYYY-MM-DD"),
        },
      });
      res.status(200).send(result);
    } else {
      res
        .status(400)
        .send(
          "To and/or from not valid. The valid format is: YYYY-MM-DDTHH:mm:ss"
        );
    }
  } else {
    const trainings = await Training.find();
    res.status(200).send(trainings);
  }
});

//API care retuneaza un training pe baza id-ului.
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Training.findById(id);

    if (!result) {
      res.status(404).send(`The training with id ${id} was not found`);
    } else {
      res.status(200).send(result);
    }
  } catch (e) {
    res.status(404).send(`The training with id ${id} was not found`);
  }
});

//API care modifica un training pe baza id-ului
router.post("/:id", async (req, res, next) => {
  const { id } = req.params;
  var resultById;
  try {
    const {
      name,
      trainingCapacity,
      availableSeats,
      startDate,
      endDate,
      isClosedForRegistration,
    } = req.body;

    resultById = await Training.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          trainingCapacity,
          availableSeats,
          startDate,
          endDate,
          isClosedForRegistration,
        },
      },
      {
        new: true,
      }
    );
    if (!resultById) {
      res.status(404).send(`The training with id ${id} was not found`);
    } else {
      const result = await resultById.save();
      res.status(200).send(result);
    }
  } catch (e) {
    res.status(400).send("Training is not valid");
  }
});

//API care sterge un training pe baza id-ului.
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const training = await Training.findByIdAndDelete(id);
    if (!training) {
      res.status(404).send(`The training with id ${id} was not found`);
    } else {
      res.status(200).send(training);
    }
  } catch (e) {
    res.status(404).send(`The training with id ${id} was not found`);
  }
});

module.exports = router;
