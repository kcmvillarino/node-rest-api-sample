const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

// Handling get requests from /products
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      //console.log(docs);
      // if (docs => 0) {
      //res.status(200).json(docs);
      // } else {
      //     res.status(404).json({
      //         message: 'No entries found'
      //     });
      // }

      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:8000/products/" + doc._id
            }
          };
        })
      };

      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  // res.status(200).json({
  //     message: 'Handling GET requests to /products'
  // })
});

router.post("/", (req, res, next) => {
  // const product = {
  //     name : req.body.name,
  //     price : req.body.price
  // };

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created Product Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:8000/" + result._id
          }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });

  // Post sample data
  //   {
  //    "name" : value,
  //    "price" : value
  //    }
});

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;

  // if (id === 'special') {
  //     res.status(200).json({
  //         message: 'You discovered the special ID',
  //         id: id
  //     });
  // } else {
  //     res.status(200).json({
  //         message: 'You pass an ID'
  //     });
  // }

  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET ALL PRODUCTS",
            url: "http://localhost:8000/products"
          }
        });
      } else {
        res.status(404).json({
          message: "Not valid entry found for provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productID", (req, res, next) => {
  // res.status(200).json({
  //     message: 'Updated product!'
  // })
  const id = req.params.productID;
  const updateOps = {};

  // getting the req.body parameters
  // { $set: {name : req.body.newName, price: req.bodynewPrice } }
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      //console.log(result);
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          url: "http://localhost:8000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);

      // return 500 status with a json payload
      res.status(500).json({
        error: err
      });
    });

  // Usage of patch
  // pass an array object
  // [
  //   { "propName": "name", "value": "eilrahc" },
  //   { "propName" : "price", "value" : "20" }
  // ]
});

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  Product.remove({
    _id: id
  })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:8000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  // res.status(200).json({
  //     message: 'Deleted product!'
  // })
});

module.exports = router;
