const express = require("express");
const router = express.Router();
const BooksDataSchema = require("../model/booksData");

//POST Book API
router.post("/", async (request, response) => {
  try {
    const data = request.body;
    const newData = new BooksDataSchema(data);
    const responseData = await newData.save();
    response.status(200);
    response.send(responseData);
  } catch (e) {
    response.status(500);
    response.send("Internal Server Error..");
  }
});

//GET BOOK API
router.get("/", async (request, response) => {
  try {
    const data = request.body;
    const getBookData = await BooksDataSchema.find();
    response.status(200);
    response.send(getBookData);
  } catch (e) {
    response.status(500);
    response.send("Internal Server Error..");
  }
});

//PUT And Update BOOK API
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;

    const updateResponse = await BooksDataSchema.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    response.status(200);
    response.send(updateResponse);
  } catch (e) {
    response.status(500);
    response.send("Internal Server Error..");
  }
});

//DELETE BOOK API
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const deleteBook = await BooksDataSchema.findByIdAndDelete(id);
    response.status(200);
    response.send(deleteBook);
    console.log("Data Deleted..");
  } catch (e) {
    response.status(500);
    response.send("Internal Server Error..");
  }
});

module.exports = router;
