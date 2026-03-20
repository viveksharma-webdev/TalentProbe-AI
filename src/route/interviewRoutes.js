const express = require("express");
const {authUser} = require("../middleware/authMiddleware.js");
const {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportController} = require("../controllers/interviewController.js");
const upload = require("../middleware/fileMiddleware.js");

const interviewRouter = express.Router();

interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReportController );
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController )
interviewRouter.get("/", authUser, getAllInterviewReportController)

module.exports = interviewRouter;