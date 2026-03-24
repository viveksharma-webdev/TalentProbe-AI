
const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewrReportModel.js");


function fixQuestionsArray(arr) {
    if (!Array.isArray(arr)) return [];

    // if already correct → return as is
    if (typeof arr[0] === "object") return arr;

    const result = [];

    for (let i = 0; i < arr.length; i += 6) {
        result.push({
            question: arr[i + 1] || "",
            intention: arr[i + 3] || "",
            answer: arr[i + 5] || ""
        });
    }

    return result;
}

function fixSkillGaps(arr) {
    if (!Array.isArray(arr)) return [];

    if (typeof arr[0] === "object") return arr;

    const result = [];

    for (let i = 0; i < arr.length; i += 4) {
        result.push({
            skill: arr[i + 1] || "",
            severity: arr[i + 3] || "low"
        });
    }

    return result;
}

function fixPreparationPlan(arr) {
    if (!Array.isArray(arr)) return [];

    if (typeof arr[0] === "object") return arr;

    const result = [];

    for (let i = 0; i < arr.length; i += 6) {
        result.push({
            day: Number(arr[i + 1]) || result.length + 1,
            focus: arr[i + 3] || "General",
            tasks: [arr[i + 5] || "Practice"]
        });
    }

    return result;
}


async function generateInterviewReportController(req, res) {
    try {

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        let interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

       
        interviewReportByAi = {
            matchScore: interviewReportByAi.matchScore || 0,

            technicalQuestions: fixQuestionsArray(interviewReportByAi.technicalQuestions),

            behavioralQuestions: fixQuestionsArray(interviewReportByAi.behavioralQuestions),

            skillGaps: fixSkillGaps(interviewReportByAi.skillGaps),

            preparationPlan: fixPreparationPlan(interviewReportByAi.preparationPlan),

            jobTitle: interviewReportByAi.jobTitle || "Software Engineer"
        };

       
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,

            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan,
            jobTitle: interviewReportByAi.jobTitle
        });

        console.log("FINAL RESPONSE:", interviewReport);

        res.status(201).json({
            message: "Interview Report Generated Successfully",
            interviewReport
        });

    } catch (error) {
        console.log("Error in generating interview Report", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(400).json({
                message: "Issue in getting the interview Report"
            });
        }

        res.status(200).json({
            message: "Report fetched successfully",
            interviewReport
        });

    } catch (error) {
        console.log("Error in getInterviewReportByIdController");
        res.status(500).json({ message: "Internal Server Error" });
    }
}



async function getAllInterviewReportController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v");

        res.status(200).json({
            message: "Interview Reports fetched successfully",
            interviewReports
        });

    } catch (error) {
        console.log("Error in getAllInterviewReports");
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportController
};