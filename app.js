const express = require("express");
const app = express();
const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const atlasPw = "node-rest-shop-charlie";

// Connect to MongoAtlas server via URL
mongoose.connect(
  "mongodb://node-rest-shop-charlie:" +
    atlasPw +
    "@node-rest-shop-charlie-shard-00-00-f0g3f.mongodb.net:27017,node-rest-shop-charlie-shard-00-01-f0g3f.mongodb.net:27017,node-rest-shop-charlie-shard-00-02-f0g3f.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-charlie-shard-0&authSource=admin",
  { useNewUrlParser: true }
);

// Get logs of requests and displays it on the terminal
app.use(morgan("dev"));
// CORS headers
app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    res.status(200).json({});
  }

  next();
});

// parse the incoming body requests
// extract json data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// handle error when the route is not found
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 400;
  next(error);
});

// handle error from the database
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
