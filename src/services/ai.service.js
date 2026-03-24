const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number(),

    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).min(3), 

    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).min(3),

    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),

    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),

    jobTitle: z.string()
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are a strict JSON generator.

Return ONLY valid JSON. No explanation.

STRICT RULES:
- MUST return at least 5 technicalQuestions
- MUST return at least 5 behavioralQuestions
- DO NOT return empty arrays
- DO NOT skip any field
- DO NOT add extra fields
- matchScore must be between 0-100

FORMAT:
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
  ],
  "jobTitle": string
}

Now generate:

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
    });

    const parsed = JSON.parse(response.text);

    return {
        matchScore: parsed.matchScore || 0,

        technicalQuestions:
            parsed.technicalQuestions ||
            parsed.technicalQuestion ||
            [],

        behavioralQuestions:
            parsed.behavioralQuestions ||
            parsed.behavioralQuestion ||
            [],

        skillGaps:
            parsed.skillGaps ||
            parsed.skillGap ||
            [],

        preparationPlan:
            parsed.preparationPlan || [],

        jobTitle:
            parsed.jobTitle || "Software Engineer"
    };

}

module.exports = generateInterviewReport;
