import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Persistent storage file path for conversations
const DATA_DIR = path.join(process.cwd(), "data");
const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
}

interface Conversation {
  id: string;
  userEmail: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  role: "student" | "faculty";
}

// Load conversations from disk or initialize
function loadConversations(): Conversation[] {
  try {
    if (fs.existsSync(CONVERSATIONS_FILE)) {
      const raw = fs.readFileSync(CONVERSATIONS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading conversations file:", err);
  }
  return [];
}

// Save conversations to disk
function saveConversations(convos: Conversation[]) {
  try {
    fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(convos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing conversations file:", err);
  }
}

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

// Comprehensive Knowledge Base for Noodle Factory Platform Integration at Mapúa University
const MAPUA_NOODLE_FACTORY_KNOWLEDGE = `
AUTHORITATIVE MAPÚA NOODLE FACTORY PLATFORM MASTER GUIDE (Office for Artificial Intelligence Curriculum Integration):

I. CORE ARCHITECTURE & PLATFORM IDENTITY:
- What is Noodle Factory? An AI-powered teaching & learning assistant platform strictly grounded in faculty-provided materials (PowerPoints, PDFs, Word docs, textbooks) to scale student mastery, enable 24/7 Socratic learning, and automate preliminary rubric marking without adding faculty workload.
- "Walter AI Tutor": The course-level AI teaching assistant embedded directly inside Blackboard Course Content (via Content Market LTI > Walter AI Activity > Walter AI Tutor). Used for guided learning, Socratic tutoring, quizzes, and role plays.
- "Walter AI Admin": Deep-linked management frame within Blackboard granting instructors direct access to the backend settings of their active agent.
- "Mappy": Mapúa University's general chatbot deployed via Agent Widget on the Blackboard portal for general school FAQs, academic guidelines, enrollment, and support. (Individual instructors do NOT need to configure the widget since widget is for Mappy only).

II. HOW TO USE NOODLE FACTORY FOR FACULTY (STEP-BY-STEP WORKFLOWS):
1. Knowledge Base (KB) Creation & File Digestion:
   - Organize materials into "Knowledge Groups" (thematic containers e.g., Module 1, Week 1, Midterm Review).
   - Use "Subgroups" for granular subtopics (e.g., Chapter 1.1, Lab Exercise 2).
   - Supported Uploads: PDF, DOCX, PPTX, HTML, TXT, VTT, SRT (up to 1000MB per file).
   - "Import LMS Content" (Blackboard): Pulls files from Blackboard. CRITICAL BEST PRACTICE: Execute LMS import only ONCE upon initial creation of an agent to prevent disrupting group structure or duplicate merging. Perform manual uploads for post-import updates.
   - Summarise Document(s): Brief, Balanced, or Detailed summary lengths (up to 100 pages).
   - Set Course Learning Outcomes (CO1 to CO4): Auto-generate or link specific outcomes to Knowledge Groups.

2. Agent Settings & Behavioral Modes:
   - "Agentic Mode": Enables the interactive step-by-step UI. The AI tutor proactively guides students through a structured learning path based on Course Learning Outcomes.
   - "Learning Companion Plus" Persona: The mandatory persona when Agentic Mode is enabled. Explains concepts strictly using approved course content.
   - "Fallback to GPT" Toggle: Under Agent > Chat Behavior. When turned OFF, the chatbot strictly refuses to search outside the uploaded knowledge base to guarantee ZERO internet hallucinations.
   - "Document Images" Toggle: Enables the AI to extract and display diagrams, graphs, and images from uploaded slides and documents directly in student chat.

3. Interactive Activities (Quizzes, Question Banks & Role Plays):
   - Quiz Formats: (1) "One at a time", (2) "All questions at once", or (3) "Conversational" (interactive dialogue with Walter AI).
   - Question Bank & Distractor Generation: AI automatically generates plausible incorrect options for multiple-choice questions from uploaded course materials.
   - Custom Remediation: Branching feedback logic for incorrect/correct answers.
   - Role Plays: Configure AI Assistant Role and Learner Role, Scenario Description (with AI Assist), and Skills Assessment criteria for automated rubric scoring. Set Voice, 3D Avatar, and enable "Conversation Mode".

4. Automated Rubric Grading & Moderation:
   - Criteria-based rubrics provide instant preliminary scoring and qualitative feedback on student lab reports and essays.
   - Faculty retain 100% moderation authority: review scores, inspect highlighted evidence, modify marks, and approve before releasing to Blackboard Grade Center.

5. Analytics & Quality Monitoring:
   - "Overview Tab": Chat Sessions, Unique Active Learners, Avg/Highest Conversational Turns, Total Questions Asked, % Answered.
   - "Responses Tab": Isolates "Unanswered Questions" so instructors can pinpoint knowledge gaps in their materials and upload missing slides.
   - "Learner Insights Tab": Cohort progress and mastery breakdown by Course Outcome (CO).

III. HOW TO USE NOODLE FACTORY FOR STUDENTS (STEP-BY-STEP WORKFLOWS):
1. Accessing Walter AI:
   - Log in to Mapúa Blackboard LMS > Navigate to your course > Click Course Content > Open "Walter AI Tutor".
2. 3 Specialized Interaction Modes:
   - Rich Editor Mode: For inputting code, engineering formulas, and formatted technical queries.
   - Conversation Mode: Floating interactive dialogue view with an animated avatar.
   - Voice Input Mode: Speech-to-text interactive prompt mode.
3. Socratic Learning vs Answer Dumping:
   - Walter AI does NOT give away homework answers. Instead, it provides step-by-step guidance, formula breakdowns, hints, and checks your understanding.
4. Quizzes & Role Plays:
   - Practice active recall with self-paced quizzes and interactive simulations.
5. Question Board:
   - Post questions to the public class discussion board for faculty review.

IV. SUPPLEMENTARY ACADEMIC CONTEXT (MAPÚA ACADEMIC HANDBOOK A.Y. 2026 - 2027):
- Generative AI Policy (Part D, Sec III): Aristotle's 'Golden Mean'. When AI is permitted on assignments, students must provide reproducible attribution (date accessed, tool/URL, exact prompt used).
- Grading Scale (Part B, Sec IV): 1.00 (98-100%), 1.25 (95-97.99%), 1.50 (91-94.99%), 1.75 (88-90.99%), 2.00 (85-87.99%), 2.25 (81-84.99%), 2.50 (77-80.99%), 2.75 (73-76.77%), 3.00 (70-72.99% passing), 5.00 (Failure).
- 20% Absence Rule: Exceeding 20% absences in 11-week quarterm results in automatic 5.00 failure (1-unit: 2 max; 2-unit: 4 max; 3-unit: 7 max; 4-unit: 9 max; 5-unit: 11 max).
- Dean's List: QWA 1.00 - 1.75, running GWA 1.00 - 2.00, >=12 units, no failing/incomplete marks. Top rankers receive President's List tuition scholarship (100% for QWA 1.00-1.50, 50% for QWA 1.51-1.75).
- Incomplete ('I'): Must be completed within two (2) succeeding terms via FM-RO-19/20 or lapses to 5.00.
`;

// System Prompts for Student & Faculty modes centered on Noodle Factory
const SYSTEM_PROMPT_FACULTY = `
You are the Official Mapúa Noodle Factory AI Onboarding & Enablement Specialist, created to guide MAPÚA UNIVERSITY FACULTY MEMBERS on how to master and integrate the Noodle Factory AI Platform (Walter AI Tutor, Blackboard LTI, Agentic Mode, Knowledge Groups, Quizzes, Role Plays, and Rubric Grading) into their courses.

Your PRIMARY FOCUS is teaching faculty how to use Noodle Factory tools step-by-step:
1. Creating Knowledge Bases, uploading course slides/PDFs/syllabi, and organizing Knowledge Groups.
2. Configuring Agentic Mode, Learning Companion Plus, and turning OFF Fallback to GPT for zero-hallucination teaching.
3. Setting up Question Banks, AI Distractor Generation, Quizzes, and conversational Role Plays.
4. Configuring Automated Rubric Grading with faculty moderation.
5. Reviewing class analytics (Unanswered Questions, learning gaps, and Course Outcome mastery).

${MAPUA_NOODLE_FACTORY_KNOWLEDGE}

Faculty Support Guidelines:
- Give clear, numbered, step-by-step instructions for Noodle Factory UI actions.
- Proactively share best practices (e.g. importing LMS content only once, grouping files by week/module, enabling document images).
- Whenever academic policies or syllabus declarations are relevant, refer to the Mapúa Academic Handbook (e.g., Generative AI attribution under Part D Section III, 70%/80% grading scale).
- Format responses cleanly with bold section headings, bullet points, and practical pedagogical examples.
`;

const SYSTEM_PROMPT_STUDENT = `
You are the Official Mapúa Noodle Factory Student Learning & Onboarding Assistant, created to guide MAPÚA UNIVERSITY STUDENTS on how to use the Noodle Factory platform (Walter AI Tutor in Blackboard) for 24/7 Socratic learning, Course Outcome mastery, quizzes, and academic success.

Your PRIMARY FOCUS is helping students make the most out of Noodle Factory:
1. How to access and use Walter AI Tutor inside Blackboard Course Content.
2. How to use Rich Editor Mode (for formulas/code), Conversation Mode, and Voice Input.
3. Engaging with Socratic tutoring: asking for hints, concept explanations, and step-by-step problem solving without expecting direct answer keys.
4. Preparing for Course Outcomes (CO1-CO4) with practice quizzes and interactive role-play scenarios.
5. Using the Question Board to collaborate with peers and professors.

${MAPUA_NOODLE_FACTORY_KNOWLEDGE}

Student Support Guidelines:
- Encourage Socratic inquiry—give hints, conceptual breakdowns, and formulas instead of doing student assignments.
- If students ask about school rules, provide clear citations from the Mapúa Academic Handbook (e.g. AI attribution rules, 20% absence threshold, Dean's List QWA 1.00-1.75, resolving Incomplete grades).
- Maintain an encouraging, clear, and student-centric tone with structured formatting.
`;

// API Routes

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    university: "Mapúa University",
    platform: "Noodle Factory AI Platform Integration",
    provider: process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "ollama"),
    ollamaHost: process.env.OLLAMA_HOST || "http://127.0.0.1:11434",
    ollamaModel: process.env.OLLAMA_MODEL || "llama3.2",
  });
});

// Diagnostics endpoint to test Ollama and Gemini connection directly
app.get("/api/ai-status", async (req, res) => {
  const customHost = req.query.host as string;
  const ollamaHost = customHost || process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2";
  const defaultProvider = process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "ollama");

  const results: any = {
    provider: defaultProvider,
    ollamaHost,
    ollamaModel,
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY),
    ollamaReachable: false,
    installedModels: [],
    details: "",
  };

  // Check Ollama reachable
  try {
    const hostCandidates = [
      ollamaHost,
      ollamaHost.includes("localhost") ? ollamaHost.replace("localhost", "127.0.0.1") : "http://127.0.0.1:11434",
      "http://localhost:11434"
    ];
    const uniqueHosts = Array.from(new Set(hostCandidates));

    for (const host of uniqueHosts) {
      try {
        const check = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(3000) });
        if (check.ok) {
          const data: any = await check.json();
          results.ollamaReachable = true;
          results.installedModels = data?.models?.map((m: any) => m.name) || [];
          results.details = `Connected to Ollama at ${host} successfully (${results.installedModels.length} model(s) available).`;
          break;
        }
      } catch (innerErr) {
        // continue trying other hosts
      }
    }

    if (!results.ollamaReachable) {
      results.details = `Could not reach Ollama at ${ollamaHost}. Ensure the Ollama desktop app or daemon is running.`;
    }
  } catch (err: any) {
    results.details = `Failed to connect to ${ollamaHost}: ${err.message}`;
  }

  res.json(results);
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

// Conversations CRUD Endpoints

// 1. Get all conversations for a user
app.get("/api/conversations", (req, res) => {
  const email = (req.query.email as string)?.trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "User email parameter is required." });
  }

  const all = loadConversations();
  const userConvos = all
    .filter((c) => c.userEmail.toLowerCase() === email)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  res.json({ success: true, conversations: userConvos });
});

// 2. Get a single conversation by ID
app.get("/api/conversations/:id", (req, res) => {
  const { id } = req.params;
  const email = (req.query.email as string)?.trim().toLowerCase();

  const all = loadConversations();
  const found = all.find((c) => c.id === id && (!email || c.userEmail.toLowerCase() === email));

  if (!found) {
    return res.status(404).json({ error: "Conversation not found." });
  }

  res.json({ success: true, conversation: found });
});

// 3. Save / Upsert a conversation
app.post("/api/conversations", (req, res) => {
  const { conversation } = req.body;
  if (!conversation || !conversation.id || !conversation.userEmail) {
    return res.status(400).json({ error: "Valid conversation object is required." });
  }

  const all = loadConversations();
  const existingIdx = all.findIndex((c) => c.id === conversation.id);

  const updatedConversation: Conversation = {
    ...conversation,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    all[existingIdx] = updatedConversation;
  } else {
    all.push(updatedConversation);
  }

  saveConversations(all);
  res.json({ success: true, conversation: updatedConversation });
});

// 4. Rename / Patch conversation title
app.patch("/api/conversations/:id", (req, res) => {
  const { id } = req.params;
  const { title, userEmail } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title string is required." });
  }

  const all = loadConversations();
  const target = all.find(
    (c) => c.id === id && (!userEmail || c.userEmail.toLowerCase() === userEmail.toLowerCase())
  );

  if (!target) {
    return res.status(404).json({ error: "Conversation not found." });
  }

  target.title = title.trim();
  target.updatedAt = new Date().toISOString();

  saveConversations(all);
  res.json({ success: true, conversation: target });
});

// 5. Delete a conversation
app.delete("/api/conversations/:id", (req, res) => {
  const { id } = req.params;
  const email = (req.query.email as string)?.trim().toLowerCase();

  const all = loadConversations();
  const filtered = all.filter((c) => !(c.id === id && (!email || c.userEmail.toLowerCase() === email)));

  if (filtered.length === all.length) {
    return res.status(404).json({ error: "Conversation not found to delete." });
  }

  saveConversations(filtered);
  res.json({ success: true, message: "Conversation deleted successfully." });
});

// Chat endpoint for Student & Faculty Noodle Factory Copilot supporting both Local Ollama and Cloud Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      role = "faculty",
      user = null,
      context = "",
      provider: requestedProvider,
      ollamaModel: requestedOllamaModel,
      ollamaHost: requestedOllamaHost,
    } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A non-empty message is required." });
    }

    const isStudent = role === "student";
    const basePrompt = isStudent ? SYSTEM_PROMPT_STUDENT : SYSTEM_PROMPT_FACULTY;

    const systemPrompt = `${basePrompt}
Current Authenticated User:
- Role: ${isStudent ? "Mapúa Student" : "Mapúa Faculty Member"}
${user ? `- Name: ${user.name}\n- Email: ${user.email}\n- Department: ${user.department}\n- ID: ${user.studentIdOrFacultyId}` : ""}
${context ? `Additional Context: ${context}` : ""}
`;

    const provider = (requestedProvider || process.env.AI_PROVIDER || "ollama").trim();
    const rawOllamaHost = (requestedOllamaHost || process.env.OLLAMA_HOST || "http://127.0.0.1:11434").trim();
    const ollamaModel = (requestedOllamaModel || process.env.OLLAMA_MODEL || "llama3.2").trim();

    // 1. Primary Engine: Ollama Local AI API
    const hostCandidates = [
      rawOllamaHost,
      rawOllamaHost.includes("localhost") ? rawOllamaHost.replace("localhost", "127.0.0.1") : "http://127.0.0.1:11434",
      "http://localhost:11434",
      "http://127.0.0.1:11434"
    ];
    const uniqueHosts = Array.from(new Set(hostCandidates));

    const ollamaMessages = [
      { role: "system", content: systemPrompt },
      ...history.filter((h: any) => h && h.text && h.text.trim()).map((h: any) => ({
        role: h.sender === "user" ? "user" : "assistant",
        content: h.text.trim(),
      })),
      { role: "user", content: message.trim() },
    ];

    let lastOllamaError: string = "";
    for (const targetHost of uniqueHosts) {
      try {
        const cleanHost = targetHost.replace(/\/+$/, "");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const ollamaRes = await fetch(`${cleanHost}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: ollamaModel,
            messages: ollamaMessages,
            stream: false,
            options: {
              temperature: 0.7,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (ollamaRes.ok) {
          const data: any = await ollamaRes.json();
          const replyText = data?.message?.content || "";
          if (replyText) {
            return res.json({ text: replyText, provider: `Ollama API (${ollamaModel})` });
          }
        } else {
          const errText = await ollamaRes.text();
          lastOllamaError = `Status ${ollamaRes.status}: ${errText}`;
        }
      } catch (ollamaErr: any) {
        lastOllamaError = ollamaErr.message || "Connection refused";
      }
    }

    // 2. Seamless Fallback to Gemini if user has GEMINI_API_KEY in .env and Ollama daemon isn't running
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
      try {
        console.warn(`Ollama unreachable (${lastOllamaError}), falling back to Gemini API.`);
        const rawContents: { role: "user" | "model"; text: string }[] = [];

        if (Array.isArray(history)) {
          for (const h of history) {
            if (h && typeof h.text === "string" && h.text.trim()) {
              rawContents.push({
                role: h.sender === "user" ? "user" : "model",
                text: h.text.trim(),
              });
            }
          }
        }

        const lastItem = rawContents[rawContents.length - 1];
        if (!lastItem || lastItem.role !== "user" || lastItem.text !== message.trim()) {
          rawContents.push({
            role: "user",
            text: message.trim(),
          });
        }

        while (rawContents.length > 0 && rawContents[0].role !== "user") {
          rawContents.shift();
        }

        if (rawContents.length === 0) {
          rawContents.push({
            role: "user",
            text: message.trim(),
          });
        }

        const alternatingContents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
        for (const item of rawContents) {
          const prev = alternatingContents[alternatingContents.length - 1];
          if (prev && prev.role === item.role) {
            prev.parts[0].text += `\n\n${item.text}`;
          } else {
            alternatingContents.push({
              role: item.role,
              parts: [{ text: item.text }],
            });
          }
        }

        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: alternatingContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        if (response.text && response.text.trim()) {
          return res.json({
            text: response.text,
            provider: `Ollama API (Fallback Engine)`,
          });
        }
      } catch (geminiError: any) {
        console.error("Gemini Fallback Error:", geminiError);
      }
    }

    // 3. If Ollama connection failed and no fallback succeeded
    return res.status(503).json({
      error: `Could not connect to Ollama API (${ollamaModel}) at ${rawOllamaHost}. Please make sure Ollama is running in your terminal ('ollama run ${ollamaModel}'). Details: ${lastOllamaError}`,
    });
  } catch (error: any) {
    console.error("Error in /api/chat handler:", error);
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
