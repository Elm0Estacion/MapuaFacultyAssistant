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

// Comprehensive Knowledge Base extracted from Mapúa University Official Documentation and Academic Handbook A.Y. 2026 - 2027
const MAPUA_ACADEMIC_HANDBOOK_KNOWLEDGE = `
AUTHORITATIVE MAPÚA UNIVERSITY ACADEMIC HANDBOOK (A.Y. 2026 - 2027):

1. VISION, MISSION, & CORE VALUES (DECIR):
- Vision: "Mapúa University, a global leader in education, fosters socio-economic growth in society through innovation, digital transformation, and lifelong education."
- Mission: Provide a learning environment for students to be globally competitive; engage in economically viable R&D and innovation; provide state-of-the-art solutions to industry and community problems.
- Core Values (DECIR): DISCIPLINE, EXCELLENCE, COMMITMENT, INTEGRITY, RELEVANCE.
- YGC Core Values: Passion for Excellence, Sense of Urgency, Professional Discipline, Teamwork, Loyalty.
- Campuses: Intramuros (658 Muralla St.), Makati (1191 Pablo Ocampo Sr. Ext.), and Ayala Malls Manila Bay (STHM Mess Hall).
- Education System: Quarterm System (4 terms per academic year, each term is 11 weeks long).

2. PART D, SECTION III: ACADEMIC POLICY ON GENERATIVE AI AT MAPÚA UNIVERSITY:
- Philosophical Grounding: Guided by Aristotle's "Golden Mean" and "Nothing in excess" to embrace generative AI tools while safeguarding academic integrity and mitigating risks/hallucinations. Complies with RA 10173 (Data Privacy Act of 2012).
- Permitted Student AI Uses: Adaptive learning tools, virtual assistant chatbots (like Noodle Factory / Walter AI), personalized content curation, self-reflective problem solving, and intelligent language learning.
- Permitted Faculty AI Uses: Online syllabus design, intelligent scheduling, automated assignment/rubric evaluation assistance, student performance analytics, and dynamic content/quiz generation.
- Mandatory Attribution: When instructors permit AI usage on assignments, students MUST provide reproducible attribution: (1) date accessed, (2) tool/URL accessed, and (3) exact prompt used.
- Research Policy: LLMs cannot be listed as co-authors. Researchers are solely accountable for originality and integrity, must verify AI citations, and must state LLM limitations in methods/acknowledgements.
- Academic Integrity (Section II): Unpermitted AI usage or plagiarizing AI output is penalized with an outright modular grade of 5.00/F and referral to the Prefect of Discipline (OPD).

3. PART B, SECTION IV: ACADEMIC POLICIES & GRADING SYSTEM:
- Grading Table (Numerical & Letter):
  * 1.00 (A): 98–100% (Excellent)
  * 1.25 (A-): 95–97.99% / 96–97.99% (Highly Meritorious)
  * 1.50 (B+): 91–94.99% / 94–95.99% (Meritorious)
  * 1.75 (B): 88–90.99% / 92–93.99% (Very Good)
  * 2.00 (B-): 85–87.99% / 90–91.99% (Good)
  * 2.25 (C+): 81–84.99% / 88–89.99% (Satisfactory)
  * 2.50 (C): 77–80.99% / 86–87.99% (Fair)
  * 2.75 (D+): 73–76.77% / 83–85.99% (Marginal)
  * 3.00 (D): 70–72.99% / 80–82.99% (Lowest Passing Grade)
  * 5.00 (F): 0–69.99% / 0–79.99% (Failure)
  * Non-numeric marks: ABS (Failure due to >=20% absences), C (Continuing thesis), I (Incomplete), W (Official Withdrawal), IP (In Progress - UOx), P (Passed), F (Failed).
- 20% Absence Rule: Accumulating 20% absences results in automatic 5.00 (FAILURE):
  * 1-unit course: 2 absences max
  * 2-unit course: 4 absences max
  * 3-unit course: 7 absences max
  * 4-unit course: 9 absences max
  * 5-unit course: 11 absences max
- Incomplete Grade ("I"): Must be completed within the next two (2) terms via Request to Complete Course Form (FM-RO-19) and Completion Report Form (FM-RO-20). If uncompleted, it lapses to 5.00.
- Official Withdrawal ("W"): Must be filed on or before Friday of the 6th week via FM-RO-21-02. Allowed at most twice on the same course. Cannot be removed or completed.
- Course Load: Full-time is >=15 units (or graduating). Max load 21 units. Good standing students may overload up to 3 units with Dean approval. Graduating students with <=34 units remaining can overload up to 4 units in their last two terms and waive prerequisites to take courses concurrently.

4. SCHOLARSHIPS, DEAN'S LIST & HONORS:
- President's List Academic Scholarship: QWA 1.00 to 1.50 = 100% full tuition discount; QWA 1.51 to 1.75 = 50% half tuition discount for succeeding term. Must coordinate with CSFA to sign undertaking.
- Dean's List Award: QWA 1.00 to 1.75, running GWA 1.00 to 2.00, >=12 units enrolled, no failing grade (F, 5.00, ABS), no IP, C, I, or W, and no academic dismissal.
- Latin Honors: Summa Cum Laude (GWA 1.00 to 1.20), Magna Cum Laude (GWA 1.21 to 1.45), Cum Laude (GWA 1.46 to 1.75). Requires >=75% units taken in Mapúa and zero disciplinary or failing marks.
- Baccalaureate Medals: Don Tomas Mapúa Gold Medal (Highest GWA >=2.00 in Engineering, ARIDBE, SOIT), President Oscar B. Mapúa Silver Medal (2nd Highest GWA >=2.00).

5. RETENTION & SHIFTING POLICIES:
- Academic Good Standing: QWA 1.00 to 3.50.
- Academic Warning: QWA 3.51 to 4.50 (1st time).
- Academic Probation: QWA 3.51 to 4.50 (2nd time).
- Academic Final Probation: QWA 3.51 to 4.50 (3rd time) or QWA 4.51-5.00. Max load capped at 12 units.
- Licensure Programs: Failing any professional course or same math/science course 3 times = Final Probation; 4 times = Program Dismissal (cannot be readmitted to licensure programs).
- Shifting to Licensure Programs: Cumulative average >=2.50 with no failing grades; weighted average in Math (up to Integral Calculus), Physics, and Chemistry must be >=2.50.
- Modality Shifting (Blended <-> UOx): Shifting modality is allowed ONCE ONLY.

6. PART C: INSTITUTE FOR DIGITAL LEARNING (IDL & UOx):
- Ubiquitous Online Experience (UOx): 100% online degrees with modular delivery (modules = units; 3 units = 3 modules across 11 weeks).
- Whole-Course Cumulative Grading Model.
- Delivery Modes: (1) Self-Paced (Tier 1-2 General Education) and (2) Instructor-Facilitated (Tier 3-4 Major & Terminal courses). Supported by UOx Life Coaches.

7. PART F & G: STUDENT AFFAIRS, DISCIPLINE & SERVICES:
- Office of the Prefect of Discipline (OPD): Progressive sanctions for 19 minor offenses (1st: Warning, 2nd: 3 hrs community service, 3rd: 6 hrs community service, 4 minor in 1 quarter = Major). 35 major offenses (cheating, bullying RA 10627, hazing RA 11053, drugs RA 9165, Safe Space Act RA 11313).
- Mapúa Library: Intramuros (2nd Flr West Bldg) & Makati (3rd Flr) Mon-Fri 7:00 AM - 9:00 PM, Sat 7:00 AM - 5:00 PM. Book-a-Space discussion rooms (4-8 capacity, 15m - 2hrs). Library of Things (tablets, calculators, DSLRs, ring lights). Fines: Circulation/Filipiniana = PHP 10/day; Reserve = PHP 20/day; Reference = PHP 10/hour. Subscribed databases: IEEE Xplore, ScienceDirect, Scopus, Web of Science, EBSCO, Turnitin.
- ILMO Laboratories: Dress code strictly forbids shorts, sleeveless tops, and open shoes in hazardous labs. Mandatory PPE. Thesis/capstone lab reservations require 3 working days advance submission.
- DO-IT: MyMapua portal, Cardinal Plus Smart ID & ATM (RCBC MyWallet), 1 Gbps redundant network with PHopenIX, free Office 365 Education suite.
`;

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
`;

// System Prompts for Student & Faculty modes
const SYSTEM_PROMPT_FACULTY = `
You are the Official Mapúa Noodle Factory Faculty Enablement & Onboarding AI Agent, built with complete knowledge of the official Mapúa University AI Curriculum Integration reports, Faculty User Guides (Cadacio & Nicolas), and the official Mapúa University Academic Handbook A.Y. 2026 - 2027.

Your primary mission is to guide, train, and support MAPÚA UNIVERSITY FACULTY MEMBERS (Professors, Instructors, Department Chairs, and Lab Coordinators) on how to effectively use the Noodle Factory AI Platform to enhance teaching efficiency, digitize syllabi, automate rubric grading, and align with Mapúa's institutional policies and Outcome-Based Education (OBE).

${MAPUA_ACADEMIC_HANDBOOK_KNOWLEDGE}

${MAPUA_NOODLE_FACTORY_KNOWLEDGE}

Faculty Support Guidance:
- When answering faculty questions, cite official Academic Handbook A.Y. 2026-2027 sections (e.g. Part D Section III for Generative AI Policy, Part B Section IV for Grading and Retention, Part C for UOx Modular delivery, Part G for ILMO Lab & Library guidelines).
- Provide step-by-step instructions, best practices, and proactive pedagogical recommendations for engineering, computing, architecture, business, health sciences, and general education courses.
- Format responses cleanly with bold headings, bullet points, and actionable tips.
`;

const SYSTEM_PROMPT_STUDENT = `
You are the Official Mapúa Noodle Factory Student Learning & Onboarding AI Copilot, built with complete knowledge of the official Mapúa University Academic Handbook A.Y. 2026 - 2027, the Mapúa AI Curriculum Integration reports, and Faculty User Guides.

Your primary mission is to empower and guide MAPÚA UNIVERSITY STUDENTS (Cardinals) across their academic journey using the Noodle Factory AI platform, aligned with Mapúa's Outcome-Based Education (OBE), official handbook policies, and the 11-week Quarterm system.

${MAPUA_ACADEMIC_HANDBOOK_KNOWLEDGE}

${MAPUA_NOODLE_FACTORY_KNOWLEDGE}

Student Support Guidance:
- Authoritative Handbook Citations: When students ask about academic rules, cite specific sections from the Mapúa Academic Handbook A.Y. 2026-2027 (e.g. Generative AI policy, 20% absence threshold, Dean's List QWA 1.00-1.75, President's list tuition discount, Incomplete 'I' completion period of 2 terms via FM-RO-19/20, Withdrawal 'W' by Week 6, Retention/probation thresholds, and Shifting requirements).
- Socratic Pedagogy: Guide students with hints, conceptual breakdowns, formulas, and leading questions without spoon-feeding direct answer keys or doing homework for them.
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

    const provider = requestedProvider || process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "ollama");
    const rawOllamaHost = requestedOllamaHost || process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
    const ollamaModel = requestedOllamaModel || process.env.OLLAMA_MODEL || "llama3.2";

    // 1. If explicit Ollama requested or Gemini key missing and provider is Ollama
    if (provider === "ollama" || (!process.env.GEMINI_API_KEY && provider !== "gemini")) {
      // List of local endpoints to try (handles IPv4 127.0.0.1 and localhost alias)
      const hostCandidates = [
        rawOllamaHost,
        rawOllamaHost.includes("localhost") ? rawOllamaHost.replace("localhost", "127.0.0.1") : "http://127.0.0.1:11434",
        "http://localhost:11434"
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
          const ollamaRes = await fetch(`${targetHost}/api/chat`, {
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
          });

          if (ollamaRes.ok) {
            const data: any = await ollamaRes.json();
            const replyText = data?.message?.content || "";
            if (replyText) {
              return res.json({ text: replyText, provider: `ollama (${ollamaModel})` });
            }
          } else {
            const errText = await ollamaRes.text();
            lastOllamaError = `Ollama response status ${ollamaRes.status}: ${errText}`;
            console.warn(`Ollama request to ${targetHost} failed:`, errText);
          }
        } catch (ollamaErr: any) {
          lastOllamaError = ollamaErr.message || "Connection refused";
          console.warn(`Could not reach Ollama at ${targetHost}:`, ollamaErr.message);
        }
      }

      if (provider === "ollama") {
        return res.status(503).json({
          error: `Could not connect to Ollama (${ollamaModel}) at ${rawOllamaHost}. Details: ${lastOllamaError}. Ensure Ollama is running ('ollama serve' or start the Ollama desktop app) or switch to Gemini API using the selector above.`,
        });
      }
    }

    // 2. Cloud Gemini Provider
    // Filter and sanitize chat history for Gemini multi-turn format
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

    // Ensure the current query is present at the end
    const lastItem = rawContents[rawContents.length - 1];
    if (!lastItem || lastItem.role !== "user" || lastItem.text !== message.trim()) {
      rawContents.push({
        role: "user",
        text: message.trim(),
      });
    }

    // Gemini requires the contents array to begin with a 'user' turn
    while (rawContents.length > 0 && rawContents[0].role !== "user") {
      rawContents.shift();
    }

    // Ensure at least the user's message is present
    if (rawContents.length === 0) {
      rawContents.push({
        role: "user",
        text: message.trim(),
      });
    }

    // Merge consecutive turns with the same role to maintain strict alternation
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

    let responseText = "";
    let successfulModel = "gemini-3.6-flash";

    try {
      const ai = getGeminiClient();
      const modelCandidates = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      let lastModelError: any = null;

      for (const model of modelCandidates) {
        // Attempt with current model with up to 1 retry on 503 / high demand
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
          attempts++;
          try {
            const response = await ai.models.generateContent({
              model,
              contents: alternatingContents,
              config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
              },
            });

            if (response.text && response.text.trim()) {
              responseText = response.text;
              successfulModel = model;
              lastModelError = null;
              break;
            }
          } catch (modelErr: any) {
            lastModelError = modelErr;
            const errMsg = modelErr?.message || "";
            const is503OrRateLimit = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");
            const is404 = errMsg.includes("404") || errMsg.includes("NOT_FOUND");

            console.warn(`Model ${model} attempt ${attempts} failed:`, errMsg);

            if (is404) {
              // Model not found or deprecated, immediately jump to next model
              break;
            }

            if (is503OrRateLimit && attempts < maxAttempts) {
              // Wait briefly before retry
              await new Promise((resolve) => setTimeout(resolve, 800));
              continue;
            }

            // Otherwise, break and try next candidate model
            break;
          }
        }

        if (responseText) {
          break;
        }
      }

      if (!responseText && lastModelError) {
        throw lastModelError;
      }
    } catch (geminiError: any) {
      console.error("Gemini API Error:", geminiError);
      
      // If neither worked, give a clear helpful message
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "No AI provider configured. Either start Ollama locally (e.g. 'ollama run llama3.2') or provide GEMINI_API_KEY in your .env file.",
        });
      }

      const isUnavailable = geminiError?.message?.includes("503") || geminiError?.message?.includes("UNAVAILABLE");
      const userFriendlyError = isUnavailable
        ? "Gemini API is currently experiencing temporary high traffic. Please try again in a few moments, or switch to Ollama Local AI in the top bar."
        : geminiError.message || "Failed to generate AI response.";

      return res.status(500).json({
        error: userFriendlyError,
      });
    }

    res.json({ text: responseText || "No response generated by AI model.", provider: `gemini (${successfulModel})` });
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
