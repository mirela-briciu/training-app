const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 10,
    validate: {
      validator: function (v) {
        return /^[A-Za-z][A-Za-z\d]*$/.test(v);
      },
      message: (prop) => `${prop.value} is not a correct format!`,
    },
  },
  trainingCapacity: { type: Number, min: 2, max: 30 },
  availableSeats: {
    type: Number,
    min: 0,
    validate: {
      validator: function (v) {
        return this.availableSeats <= this.trainingCapacity;
      },
      message: " the value is higher than the maximum training capacity! ",
    },
  },
  startDate: Date,
  endDate: {
    type: Date,
    validate: {
      validator: function (v) {
        return this.endDate > this.startDate;
      },
      message: "invalid date!",
    },
  },
  isClosedForRegistration: { type: Boolean, default: false },
});

const Training = mongoose.model("Training", trainingSchema);

module.exports = Training;
