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

// Credentials database
const VALID_ACCOUNTS = [
  {
    email: "ejdestacion@mymail.mapua.edu.ph",
    password: "Student123",
    role: "student" as const,
    name: "EJ Destacion",
    department: "School of Information Technology",
    studentIdOrFacultyId: "2022104592",
    avatarText: "ED",
  },
  {
    email: "jptcruz@mapua.edu.ph",
    password: "Faculty123",
    role: "faculty" as const,
    name: "Prof. JP T. Cruz",
    department: "Department of Computer Science & Engineering",
    studentIdOrFacultyId: "FAC-88190",
    avatarText: "JC",
  },
];

// System Prompts for Student & Faculty modes
const SYSTEM_PROMPT_FACULTY = `
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

const SYSTEM_PROMPT_STUDENT = `
You are the Official Mapúa Noodle Factory Student Learning & Onboarding AI Copilot.
Your primary mission is to empower and guide MAPÚA UNIVERSITY STUDENTS (Cardinals) across their academic journey using the Noodle Factory AI platform, aligned with Mapúa's Outcome-Based Education (OBE) and fast-paced 10-week Quarterm system.

Key Student Workflows & Capabilities in Noodle Factory:
1. SOCRATIC AI TUTORING:
   - Helping students learn how to solve engineering, mathematics, coding, and science problems step-by-step.
   - Asking guided, provocative questions that stimulate critical thinking rather than spoon-feeding direct answer keys.
   - Clarifying difficult concepts with real-world analogies, formulas, and visual walkthroughs.

2. MAPÚA OBE (COURSE OUTCOMES CO1 TO CO4) MASTERY:
   - Explaining how Noodle Factory assessments map directly to Course Outcomes:
     * CO1: Fundamental Knowledge & Principles
     * CO2: Problem Analysis & Mathematical Modeling
     * CO3: Design, Algorithms & System Implementation
     * CO4: Practical Application, Ethics & Contemporary Issues
   - Generating practice drills and formative self-assessments to test readiness before departmental exams.

3. MYMAPUA ADMINISTRATIVE & PETITION GUIDANCE:
   - Step-by-step procedural assistance for navigating MyMapua workflows:
     * Units overload requests for graduating/regular students.
     * Prerequisite waivers and simultaneous subject enrollment petitions.
     * Incomplete (INC) grade completion procedures within the allowed 1-year Quarterm window.
     * Drafting polite, professionally structured formal petition letters to the Registrar, Dean, and Department Chairs.

4. 10-WEEK QUARTERM SURVIVAL STRATEGIES:
   - Time management frameworks and active recall strategies tailored to Mapúa's intensive 10-week schedule.
   - Weekly pacing tips from Week 1 (syllabus orientation), Week 5 (midterms), to Week 10 (finals/projects).

Tone & Persona:
- Encouraging, clear, academically rigorous, empathetic to Cardinal student life.
- Uses bullet points, clear headings, and structured step-by-step explanations.
`;

// API Routes

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    university: "Mapúa University",
    platform: "Noodle Factory AI Platform Integration",
    model: "gemini-3.6-flash",
  });
});

// Unified Authentication endpoint - automatically resolves role by email and password
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const account = VALID_ACCOUNTS.find(
    (acc) =>
      acc.email.toLowerCase() === cleanEmail &&
      acc.password === password
  );

  if (!account) {
    return res.status(401).json({
      error: "Invalid email or password. Please check your Mapúa credentials.",
    });
  }

  res.json({
    success: true,
    user: {
      name: account.name,
      email: account.email,
      role: account.role,
      department: account.department,
      studentIdOrFacultyId: account.studentIdOrFacultyId,
      avatarText: account.avatarText,
    },
  });
});

// Chat endpoint for Student & Faculty Noodle Factory Copilot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], role = "faculty", user = null, context = "" } = req.body;

    const ai = getGeminiClient();

    const isStudent = role === "student";
    const basePrompt = isStudent ? SYSTEM_PROMPT_STUDENT : SYSTEM_PROMPT_FACULTY;

    const systemPrompt = `${basePrompt}
Current User Information:
- Role: ${isStudent ? "Mapúa Student" : "Mapúa Faculty Member"}
${user ? `- Name: ${user.name}\n- Email: ${user.email}\n- Department: ${user.department}` : ""}
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
    console.log(`Mapúa Noodle AI Agent Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
