const express = require("express");
const authRouter = express.Router();

const {registerUserController} = require("../controllers/authController.js");

authRouter.post("/register", registerUserController);
module.exports = authRouter;