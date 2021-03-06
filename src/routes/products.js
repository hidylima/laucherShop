const express = require("express");
const routes = express.Router();

const multer = require("../app/middlewares/multer");
const { onlyUsers } = require("../app/middlewares/session");
const ProductController = require("../app/controller/ProductController");
const SearchController = require("../app/controller/SearchController");

//Products
//Search
routes.get("/search", SearchController.index);
//CREATE
routes.get("/create", onlyUsers, ProductController.create);
//EDIT
routes.get("/edit/:id", onlyUsers,  ProductController.edit);
//SHOW
routes.get("/:id", ProductController.show);
//SALVE CREATED
routes.post("/", onlyUsers, multer.array("photos", 6), ProductController.post);
//SALVE EDIT
routes.put("/", onlyUsers, multer.array("photos", 6), ProductController.put);
//DELETE
routes.delete("/", onlyUsers, ProductController.delete);

module.exports = routes;
