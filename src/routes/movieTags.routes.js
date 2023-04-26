const { Router } = require("express");

const MovieTagsController = require("../controllers/movieTagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthentication");

const movieTagsRoutes = Router();

const movieTagsController = new MovieTagsController()

movieTagsRoutes.get("/", ensureAuthenticated, movieTagsController.index); 


module.exports = movieTagsRoutes;