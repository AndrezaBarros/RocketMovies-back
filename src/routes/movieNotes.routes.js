const { Router } = require("express");

const MovieNotesController = require("../controllers/movieNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthentication");

const movieNotesRoutes = Router();

const movieNotesController = new MovieNotesController()

movieNotesRoutes.use(ensureAuthenticated);

movieNotesRoutes.post("/", movieNotesController.create); 
movieNotesRoutes.get("/:id", movieNotesController.show); 
movieNotesRoutes.delete("/:id", movieNotesController.delete); 
movieNotesRoutes.get("/", movieNotesController.index); 


module.exports = movieNotesRoutes;