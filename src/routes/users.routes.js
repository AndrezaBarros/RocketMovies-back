const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/usersController");
const UsersAvatarController = require("../controllers/usersAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthentication");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRoutes.post("/", usersController.create) 
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, usersAvatarController.update);

module.exports = usersRoutes;