const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewrReportModel.js");


async function generateInterviewReportController(req,res){
    try {

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const {selfDescription, jobDescription} = req.body;

        const interviewReportByAi = await generateInterviewReport({resume: resumeContent.text, selfDescription, jobDescription});

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

         res.status(201).json({ message: "Interview Report Generated Successfully",
            interviewReport
        })

    } catch (error) {
        console.log("Error in generating interview Report")
    }
}


async function getInterviewReportByIdController(req,res){
    try {
        const {interviewId} = req.params;
        const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id});

        if(!interviewReport){
            return res.status(400).json({message: "Issue in getting the interview Report"})
        };

        res.status(200).json({
            message: 'Report fetched successfully',
            interviewReport: interviewReport
        })

    } catch (error) {
        console.log("Error in getInterviewReportByIdController")
    }
};


async function getAllInterviewReportController(req,res){
    try {
        const interviewReports = (await interviewReportModel.find({user: req.user.id})).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGap -preparationPlan");
        res.status(200).json({
            message: "Interview Reports fetched successfully",
            interviewReports
        })
    } catch (error) {
        console.log("Error in getAllInterviewReports")
    }
}


module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportController}