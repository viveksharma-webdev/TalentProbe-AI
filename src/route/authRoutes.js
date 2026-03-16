const express = require("express");
const authRouter = express.Router();
const {authUser} = require("../middleware/authMiddleware.js");

const {registerUserController, loginUserController, logoutUserController, getMeController} = require("../controllers/authController.js");

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.get("/logout", logoutUserController);

authRouter.get("/get-me",authUser, getMeController)

module.exports = authRouter;