const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))

/* requiring all the routes*/
const authRouter = require("./route/authRoutes.js");
const interviewRouter = require("./route/interviewRoutes.js");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;