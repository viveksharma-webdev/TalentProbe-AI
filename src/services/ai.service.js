const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,

});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 to 100 indicating how well candidate's profile matches the job description"),
    technicalQuestions : z.array(z.object({
        question: z.string().describe("the technical questions can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer the question, what to cover, how to approach")
    })).describe("Technical question that can be asked in interview along with their intention and how to answer"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("the behavioral questions can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer the question, what to cover, how to approach")
    })).describe("Behavioral question that can be asked in the interview along with their intention and how to answer"),
    skillGaps: z.array(z.object({
        skill: z.string().describe(" The skills which candidate is lacking"),
        severity: z.enum(["low","medium","high"]).describe("The severity of the skill gap")
    })).describe("List of skill gap in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string().describe("List of task to be done on this day to follow the preparation plan"))
    })).describe("A day-wise preparation plan for the candidate to follow in order to reduce the skill gap and severity")
})

async function generateInterviewReport({resume,selfDescription, jobDescription}){

    // const prompt = `Generate and interview report for a candidate with the following details:
    //                 Resume: ${resume}
    //                 Self Description: ${selfDescription}
    //                 Job Description: ${jobDescription}
    // `

   const prompt = `
                    You are a strict JSON generator.

                    Return ONLY valid JSON. No explanation, no text.

                    The JSON MUST follow this EXACT structure:

                    {
                    "matchScore": number,
                    "technicalQuestions": [
                        {
                        "question": string,
                        "intention": string,
                        "answer": string
                        }
                    ],
                    "behavioralQuestions": [
                        {
                        "question": string,
                        "intention": string,
                        "answer": string
                        }
                    ],
                    "skillGaps": [
                        {
                        "skill": string,
                        "severity": "low" | "medium" | "high"
                        }
                    ],
                    "preparationPlan": [
                        {
                        "day": number,
                        "focus": string,
                        "tasks": string[]
                        }
                    ]
                    }

                    Rules:
                    - Do NOT add fields like resumeAnalysis, strengths, etc.
                    - Do NOT skip any field
                    - Ensure correct types
                    - matchScore must be between 0–100

                    Now generate the report.

                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
                    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })
    return JSON.parse(response.text);
}

module.exports = generateInterviewReport;