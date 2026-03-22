const mongoose = require("mongoose");

/**
 * -job description schema : String
 * -resume text : String
 * -self description : String
 * 
 * -Score : Number
 * 
 * -technical question : [{
 *      question: "",
 *      intention: "",
 *      answer: ""
 * }]
 * 
 * -behavioural question : [{
 *      question: "",
 *      intention: "",
 *      answer: ""
 * }]
 * 
 * -Skill gaps : [{
 *      skill: "",
 *      severity: {
 *      type: String,
 *      enum : ["low", "medium", "high"]
 *  }
 * }]
 * 
 * -Preparation plan : [{\
 *      day: Number,
 *      focus: String,
 *      task : [String]
 * }]
 */


const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Technical Question is required"]
    },
    intention:{
        type: String,
        required: [true, "intention is required"]
    },
    answer:{
        type: String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Technical Question is required"]
    },
    intention:{
        type: String,
        required: [true, "intention is required"]
    },
    answer:{
        type: String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true, "Skill is required"]
    },
    severity:{
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Skill is required"]
    }
},{
    _id:false
});

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"],
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }],
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job Description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription:{
        type: String,
    },
    matchScore:{
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestion: [behavioralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    jobTitle:{
        type: String,
        required: true,
    }

}, { timestamps: true});

const interviewReportModel = mongoose.model("interviewReportModel", interviewReportSchema);

module.exports = interviewReportModel;