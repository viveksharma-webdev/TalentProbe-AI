const express = require("express");
const app = express();

app.use(express.json());

/* requiring all the routes*/
const authRouter = require("./route/authRoutes.js");

app.use("/api/auth", authRouter);

module.exports = app;