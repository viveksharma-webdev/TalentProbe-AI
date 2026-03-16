const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");


app.use(cookieParser());
app.use(express.json());

/* requiring all the routes*/
const authRouter = require("./route/authRoutes.js");

app.use("/api/auth", authRouter);

module.exports = app;