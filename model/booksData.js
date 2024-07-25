const mongoose = require("mongoose");

const mongooseSchma = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
});

const BooksDataSchema = mongoose.model("Books", mongooseSchma);
module.exports = BooksDataSchema;
