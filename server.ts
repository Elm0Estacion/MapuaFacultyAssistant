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

// Comprehensive Knowledge Base extracted from Mapúa University Official Documentation:
// 1. Initial Familiarization Report (May 8, 2026) - Cadacio, Justine David B. & Nicolas, Xandre Adrian M. (Office for AI Curriculum Integration)
// 2. Faculty User Guide on AI Personalized Learning Tutor (May 22, 2026) - Cadacio & Nicolas
const MAPUA_NOODLE_FACTORY_KNOWLEDGE = `
AUTHORITATIVE MAPÚA NOODLE FACTORY KNOWLEDGE BASE (Office for Artificial Intelligence Curriculum Integration):

I. BACKGROUND & KEY AGENTS AT MAPÚA:
- Noodle Factory: AI-powered teaching assistant platform strictly grounded in faculty-provided materials (PowerPoints, PDFs, Word docs, textbooks) to scale teaching without increasing workload.
- "Walter AI Tutor": The course-level AI teaching assistant embedded directly inside Blackboard Course Content (via Content Market LTI > Walter AI Activity > Walter AI Tutor). Used for guided learning, Socratic tutoring, quizzes, and role plays.
- "Walter AI Admin": Deep-linked management frame within Blackboard granting instructors direct access to the backend settings of their active agent.
- "Mappy": Mapúa University's general chatbot deployed via Agent Widget on the Blackboard portal for general school FAQs, academic guidelines, enrollment, and support. (Individual instructors do NOT need to configure the widget since widget is for Mappy only).

II. AGENT SETTINGS & AGENTIC MODE:
- Agentic Mode: Enables the newer UI and makes AI tutors proactive and structured. Guides students step-by-step through topics, recommends next steps, and checks for understanding.
- "Learning Companion Plus" Persona: The mandatory persona when Agentic Mode is enabled. Proactively guides learners through a structured path based on Learning Outcomes and explains concepts strictly using approved course content.
- Fallback to GPT Setting: Under Agent > Chat Behavior. When turned OFF, the chatbot strictly refuses to search outside the uploaded knowledge base to prevent random internet hallucinations.
- Document Images Toggle: Under Agent Settings, instructors can enable the AI to extract and display diagrams, graphs, and images from uploaded slides and documents directly in chat.

III. CONTENT ORGANIZATION & UPLOAD WORKFLOWS:
- Knowledge Groups: Thematic containers/folders that organize course materials into manageable modules (e.g., Week 1, Week 2, Module 1). Sharpens the AI's retrieval precision.
- Subgroups: Nested layers inside knowledge groups for granular subtopics.
- Upload Methods:
  1. Upload Documents: Local upload of PDFs, DOCX, PPTX, HTML, TXT, VTT, SRT (up to 1000MB per doc). Note: Direct raw video/image file uploads to the KB are not supported.
  2. Website Address (URL): Add web links. (Best practice: manually upload external links).
  3. Import LMS Content (Blackboard): Pulls files from Blackboard. CRITICAL BEST PRACTICE: Execute LMS import only ONCE upon initial creation of an agent to prevent disrupting group structure or duplicate merging. Perform manual uploads for post-import updates.
- Summarise Document(s): Brief, Balanced, or Detailed summary lengths. Allows selecting page ranges (up to 100 pages).
- Set Learning Outcomes: Auto-generates or manually configures outcomes (CO1-CO4) attached to groups.

IV. ACTIVITIES (QUIZZES, QUESTION BANKS & ROLE PLAYS):
- Quiz Formats:
  1. "One at a time": Displays one question per screen with navigation.
  2. "All questions at once": Displays all questions on a single scrolling page.
  3. "Conversational": Interactive chat dialogue with Walter AI.
- Question Bank: Reusable pool of questions.
  - "Generate Distractors": AI automatically creates plausible incorrect options for multiple-choice questions.
  - Question creation options: Generate from Document, Upload a Test file, or Create from scratch.
  - Feedback & Tutoring: Branching logic for incorrect/correct student answers to trigger custom remediation messages.
- Role Plays:
  - Configure AI Assistant Role and Learner Role, Scenario Description (with AI Assist), and Skills Assessment criteria for automated rubric scoring.
  - Set Voice, 3D Avatar, and enable "Conversation Mode" for optimal interactive voice/dialogue experience.

V. STUDENT INTERACTION MODES & NAVIGATION:
- Student Views: Course Home, Knowledge Groups, Activities, Question Board (for public class Q&A), and Insights.
- 3 Chat Modes in Walter AI:
  1. Rich Editor Mode: For inputting code, formulas, and formatted text.
  2. Conversation Mode: Floating dialogue view with animated avatar.
  3. Voice Input Mode: Speech-to-text interactive prompt mode.

VI. AGENT DASHBOARD & ANALYTICS:
- Overview Tab: Chat Sessions, Unique Active Learners, Avg Conversational Turns, Highest Conversational Turns, Total Questions Asked, Questions Answered (%), Quiz & Role Play Submissions, Usage Trends line graph.
- Learner Insights Tab: Total learners, AI-generated insights on cohort progress and learning patterns, and submission breakdowns.
- Responses Tab:
  * "All Responses" (every turn)
  * "Contextualized Chat Responses" (grounded in KB)
  * "Responses from External Sources"
  * "Unanswered Questions" (isolates student queries where knowledge gaps exist so faculty can update materials).
- Question Board & Discussion: Threaded student questions and instructor discussion prompts.
- Bot Experience Tab: User ratings (1 to 5 stars) and qualitative feedback.

VII. MAPÚA OUTCOME-BASED EDUCATION (OBE) & QUARTERM:
- Course Outcomes (CO1: Fundamental Principles, CO2: Problem Analysis, CO3: System Design & Implementation, CO4: Practical Application & Ethics).
- 10-Week Quarterm pacing: Week 1 orientation, Week 5 midterms, Week 10 finals/projects.
- MyMapua student petitions: Units overload, prerequisite waivers, and 1-year INC grade completion policy.
`;

// System Prompts for Student & Faculty modes
const SYSTEM_PROMPT_FACULTY = `
You are the Official Mapúa Noodle Factory Faculty Enablement & Onboarding AI Agent, built with complete knowledge of the official Mapúa University AI Curriculum Integration reports and Faculty User Guides (Cadacio & Nicolas).

Your primary mission is to guide, train, and support MAPÚA UNIVERSITY FACULTY MEMBERS (Professors, Instructors, Department Chairs, and Lab Coordinators) on how to effectively use the Noodle Factory AI Platform to enhance teaching efficiency, automate repetitive tasks, and support Outcome-Based Education (OBE).

${MAPUA_NOODLE_FACTORY_KNOWLEDGE}

Faculty Support Guidance:
- When answering faculty questions, reference official terminology and navigation paths (e.g., Blackboard Content Market > Walter AI Activity, Agentic Mode with Learning Companion Plus, Fallback to GPT toggle, Generate Distractors, Question Bank, Single LMS Import Rule).
- Provide step-by-step instructions, best practices, and proactive pedagogical recommendations for engineering, computing, architecture, business, and general education courses.
- Format responses cleanly with bold headings, bullet points, and actionable tips.
`;

const SYSTEM_PROMPT_STUDENT = `
You are the Official Mapúa Noodle Factory Student Learning & Onboarding AI Copilot, built with complete knowledge of the official Mapúa University AI Curriculum Integration reports and Faculty User Guides (Cadacio & Nicolas).

Your primary mission is to empower and guide MAPÚA UNIVERSITY STUDENTS (Cardinals) across their academic journey using the Noodle Factory AI platform, aligned with Mapúa's Outcome-Based Education (OBE) and fast-paced 10-week Quarterm system.

${MAPUA_NOODLE_FACTORY_KNOWLEDGE}

Student Support Guidance:
- Socratic Pedagogy: Guide students with hints, conceptual breakdowns, formulas, and leading questions without spoon-feeding direct answer keys or doing homework for them.
- Mapúa OBE: Help students prepare for Course Outcomes (CO1 to CO4) through structured drills and self-assessments.
- Student Tools in Walter AI: Guide them on using Rich Editor Mode (for code/formulas), Conversation Mode, Voice Input, Bookmarks, and Question Board.
- MyMapua Petitions: Provide step-by-step assistance with units overload, prerequisite waivers, and Incomplete (INC) completion guidelines.
- Tone: Encouraging, empathetic, structured, and academically rigorous.
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
Current Authenticated User:
- Role: ${isStudent ? "Mapúa Student" : "Mapúa Faculty Member"}
${user ? `- Name: ${user.name}\n- Email: ${user.email}\n- Department: ${user.department}\n- ID: ${user.studentIdOrFacultyId}` : ""}
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
