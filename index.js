const express = require("express");
const db = require("./db");

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Auth API
const bcrypt = require("bcrypt");
const UserDataSchema = require("./model/userData");

const jwt = require("jsonwebtoken");
const BooksDataSchema = require("./model/booksData");

//.env
require("dotenv").config;
const PORT = process.env.PORT || 3000;

//Register API
app.post("/register", async (request, response) => {
  try {
    const { username, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserDataSchema.findOne({ username: username });
    if (user === null) {
      const newData = new UserDataSchema({
        username: username,
        email: email,
        password: hashedPassword,
      });

      const responseData = await newData.save();
      response.status(200);
      response.send(responseData);
    } else {
      response.status(401);
      response.send("User Already Exist..");
    }
  } catch (e) {
    response.status(500);
    response.send("Internal Error..");
  }
});

//Login API
app.post("/login", async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await UserDataSchema.findOne({ username: username });
    if (user === null) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch === true) {
        const payload = { username: username };
        console.log(payload);
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.status(200);
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }
  } catch (e) {
    response.status(500);
    response.send("Internal Server Error..");
  }
});

//Auth Token
const authorizationToken = async (request, response, next) => {
  try {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      response.status(401);
      response.send("Invalid JWT Token");
    } else {
      jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
        if (error) {
          response.status(401);
          response.send("Invalid JWT Token");
        } else {
          request.username = payload.username;
          next();
        }
      });
    }
  } catch (e) {
    response.status(500).json("Internal Error");
  }
};

//GET Mthod Using verifying JWT Token
app.get("/profile", authorizationToken, async (request, response) => {
  try {
    const { username } = request;
    const getData = await UserDataSchema.find({ username: username });
    response.status(200).json(getData);
  } catch (e) {
    response.status(500);
    response.send("Internal Error..");
  }
});

//GET Data JWT Token Verifying
app.get("/data", authorizationToken, async (request, response) => {
  try {
    const getData = await UserDataSchema.find();
    response.status(200);
    response.send(getData);
  } catch (e) {
    response.status(500);
    response.send("Internal Error");
  }
});

//booksDataRoute
const router = require("./routes/booksRoutes");
app.use("/books", authorizationToken, router);

app.listen(PORT, () => {
  console.log("Server Runing http://localhost:3000/");
});
