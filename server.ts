import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Mapúa Faculty Enablement System Instruction
const SYSTEM_INSTRUCTION_BASE = `
You are the Official Mapúa Noodle Factory Faculty Enablement & Onboarding AI Agent.
Your primary mission is to guide, train, and support MAPÚA UNIVERSITY FACULTY MEMBERS (Professors, Instructors, Department Chairs, and Lab Coordinators) on how to effectively use the Noodle Factory AI Platform to enhance teaching efficiency, automate repetitive tasks, and support Outcome-Based Education (OBE).

Key Faculty Workflows & Capabilities in Noodle Factory:
1. KNOWLEDGE BASE DIGITIZATION:
   - Converting course syllabi, lecture presentations (PPT/PDF), laboratory manuals, and problem sets into conversational AI Teaching Assistants (TAs).
   - Organizing modular topics and managing knowledge updates per Quarterm term.
   - Setting boundary rules so the AI sticks strictly to verified faculty course materials.

2. 24/7 AI TEACHING ASSISTANTS & SOCRATIC TUTORING:
   - How Noodle AI handles 80%+ of repetitive student queries 24/7 (clarifying assignment rules, prerequisite fundamentals, syntax, formulas).
   - How Socratic tutoring works to encourage active student learning and critical problem solving without providing raw answer keys.
   - How to reclaim consultation hours for high-impact 1-on-1 mentorship, thesis advising, and research.

3. AUTOMATED MARKING & RUBRIC-BASED EVALUATION:
   - Designing custom evaluation rubrics (analytical, holistic, or criteria-based) with weightings and performance descriptors.
   - How Noodle AI performs fast preliminary grading on student essays, technical lab reports, code assignments, and capstone documentation with constructive qualitative feedback.
   - Faculty moderation workflows: approving, overriding, and reviewing AI marks before posting final grades.

4. MAPÚA OBE (OUTCOME-BASED EDUCATION) & LMS INTEGRATION:
   - Mapping course assessments and student interactions to Mapúa Course Outcomes (CO1: Foundational Knowledge, CO2: Problem Analysis, CO3: Design/Development, CO4: Application, Ethics & Practice).
   - Blackboard LMS and MyMapua portal integration workflows for grade syncing and roster management.
   - Real-time student engagement and learning analytics to identify at-risk students before the 10-week Quarterm midterm exams.

Tone & Persona:
- Professional, collegial, academic, and actionable.
- Formatted with clean markdown, bold terms, bullet points, and step-by-step faculty best practices.
- Proactively offer practical pedagogical examples for engineering, architecture, computer science, business, and general education courses.
`;

// API Routes

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    university: "Mapúa University",
    platform: "Noodle Factory AI Faculty Enablement",
    model: "gemini-3.6-flash",
  });
});

// Chat endpoint for Faculty Noodle Factory Onboarding & Copilot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], context = "" } = req.body;

    const ai = getGeminiClient();

    const systemPrompt = `${SYSTEM_INSTRUCTION_BASE}
Target Audience: Mapúa University Faculty Member / Instructor
${context ? `Additional Context: ${context}` : ""}
`;

    // Format chat history for Gemini
    const contents = [
      ...history.map((h: { sender: string; text: string }) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

// Vite Development or Production Server Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mapúa Faculty Noodle AI Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
