const { Router } = require("express");

const MovieNotesController = require("../controllers/movieNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthentication");

const movieNotesRoutes = Router();

const movieNotesController = new MovieNotesController()

movieNotesRoutes.post("/", ensureAuthenticated ,movieNotesController.create); 
movieNotesRoutes.get("/:id", ensureAuthenticated, movieNotesController.show); 
movieNotesRoutes.delete("/:id", ensureAuthenticated, movieNotesController.delete); 
movieNotesRoutes.get("/", ensureAuthenticated, movieNotesController.index); 


module.exports = movieNotesRoutes;