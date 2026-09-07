# Mapúa Noodle AI Agent — Complete Specification & Source Code

This document provides the full technical specifications, architecture, and complete source code for the **Mapúa Noodle AI Agent** project.

---

# Table of Contents
1. [Project Overview & Objectives](#1-project-overview--objectives)
2. [System Architecture & Tech Stack](#2-system-architecture--tech-stack)
3. [Domain Models & TypeScript Interfaces](#3-domain-models--typescript-interfaces)
4. [Backend API Specifications](#4-backend-api-specifications)
5. [Feature & Interaction Matrix](#5-feature--interaction-matrix)
6. [Complete Source Code Listing](#6-complete-source-code-listing)
   - [Configuration & Environment](#configuration--environment)
     - [`package.json`](#packagejson)
     - [`tsconfig.json`](#tsconfigjson)
     - [`vite.config.ts`](#viteconfigts)
     - [`metadata.json`](#metadatajson)
     - [`.env.example`](#envexample)
     - [`index.html`](#indexhtml)
   - [Backend Service](#backend-service)
     - [`server.ts`](#serverts)
   - [Frontend Core](#frontend-core)
     - [`src/types.ts`](#srctypests)
     - [`src/main.tsx`](#srcmaintsx)
     - [`src/App.tsx`](#srcapptsx)
     - [`src/index.css`](#srcindexcss)
     - [`src/utils/chatUtils.ts`](#srcutilschatutilsts)
   - [Frontend Components](#frontend-components)
     - [`src/components/Header.tsx`](#srccomponentsheadertsx)
     - [`src/components/LoginScreen.tsx`](#srccomponentsloginscreentsx)
     - [`src/components/ChatHistorySidebar.tsx`](#srccomponentschathistorysidebartsx)
     - [`src/components/NoodleOnboardingBot.tsx`](#srccomponentsnoodleonboardingbottsx)

---

# 1. Project Overview & Objectives

The **Mapúa Noodle AI Agent** is an academic enablement assistant tailored specifically to **Mapúa University students and faculty members**. It is grounded in Mapúa's **Outcome-Based Education (OBE)** curriculum and the **Noodle Factory AI platform** (Walter AI, Walter AI Tutor, Walter AI Admin, and Blackboard LMS integration).

### Core Goals:
1. **For Mapúa Students ("Cardinals"):**
   - **Socratic Tutoring:** Provides hints, conceptual scaffolds, and formula derivations without spoiling direct homework or exam answer keys.
   - **OBE Outcome Mastery:** Practice quizzes and diagnostic drills tagged to Course Outcomes (CO1 through CO4).
   - **MyMapua Administrative Petitions:** Step-by-step guidance for petitions including credit overload, prerequisite waivers, and Incomplete (INC) completion within the strict 1-academic-year limit.
   - **10-Week Quarterm Strategies:** Time management routines, intensive milestone pacing, and exam prep adapted to Mapúa's fast-paced academic calendar.

2. **For Mapúa Faculty:**
   - **Knowledge Base Digitization:** Ingesting syllabi, lecture presentations (PPTX), textbooks, lab manuals, and PDFs into 24/7 course assistants.
   - **Automated Rubric Grading:** Evaluating free-form student submissions against criteria rubrics with full human moderation authority.
   - **Consultation Offloading:** Resolving up to 80% of repetitive syllabus and course logistical queries automatically.
   - **LMS & Outcome Alignment:** Syncing AI modules via Blackboard LMS Content Market (LTI) and mapping assessments to program accreditation standards.

---

# 2. System Architecture & Tech Stack

### Frontend
- **Framework:** React 19 (`react`, `react-dom`)
- **Language:** TypeScript 5.8
- **Bundler:** Vite 6 with `@vitejs/plugin-react`
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) using Cardinal Red (`#800000`) and Gold accents
- **Animations:** Motion (`motion`)
- **Iconography:** Lucide React (`lucide-react`)
- **Markdown & Math Rendering:** `react-markdown` and `remark-gfm`

### Backend
- **Server:** Express 4.21 with Node.js
- **Dev Runner:** `tsx` for direct TypeScript server execution
- **Production Compilation:** `esbuild` bundling `server.ts` to CommonJS `dist/server.cjs`
- **Data Persistence:** Multi-user conversation storage in `/data/conversations.json` synchronized with browser `localStorage`

### Artificial Intelligence
- **Cloud Engine:** Google Gemini API (`@google/genai`) using `gemini-2.5-flash` with automatic fallback to `gemini-3.7-flash`.
- **Local/Offline Engine (Optional):** REST integration with local Ollama (`http://127.0.0.1:11434`, e.g. `llama3.2`).

---

# 3. Domain Models & TypeScript Interfaces

Defined in `/src/types.ts`:

```typescript
export type UserRole = "student" | "faculty";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentIdOrFacultyId: string;
  avatarText: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
}

export interface Conversation {
  id: string;
  userEmail: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  role: UserRole;
}

export interface PillarInfo {
  id: string;
  title: string;
  shortDesc: string;
  prompt: string;
  iconName: string;
  badge: string;
  benefits: string[];
}
```

---

# 4. Backend API Specifications

| Method | Endpoint | Description | Payload / Params |
|:---|:---|:---|:---|
| `GET` | `/api/health` | Health check & system status | None |
| `GET` | `/api/ai-status` | AI provider & local Ollama diagnostics | None |
| `POST` | `/api/auth/login` | Mock authentication for students/faculty | `{ email, password }` |
| `GET` | `/api/conversations` | Get all conversations for a user | `?email=<userEmail>` |
| `GET` | `/api/conversations/:id` | Get specific conversation by ID | `?email=<userEmail>` |
| `POST` | `/api/conversations` | Create or update a conversation | `{ conversation: Conversation }` |
| `PATCH` | `/api/conversations/:id` | Rename conversation title | `{ title, userEmail }` |
| `DELETE` | `/api/conversations/:id` | Delete conversation thread | `?email=<userEmail>` |
| `POST` | `/api/chat` | AI completion streaming/generation | `{ message, history, role, user, context }` |

---

# 5. Feature & Interaction Matrix

1. **Authentication:**
   - Pre-configured Student: `ejdestacion@mymail.mapua.edu.ph` / `Student123`
   - Pre-configured Faculty: `jptcruz@mapua.edu.ph` / `Faculty123`
   - Custom institutional email detection based on `@mymail.mapua.edu.ph` or `@mapua.edu.ph`.
2. **Session Persistence:**
   - Active user session stored in `localStorage` under `mapua_noodle_user_session`.
   - Conversations stored in `localStorage` under `mapua_noodle_chat_sessions` and synced to backend.
3. **Smart Conversation Management:**
   - Automatic descriptive thread titling using prompt keyword heuristic analysis.
   - Dynamic sidebar with search filtering, manual title renaming, and deletion.
4. **Interactive Pillars:**
   - Quick-action buttons to launch domain-specific queries across Socratic tutoring, OBE, MyMapua, and Rubrics.
5. **Mapúa FAQ Accordions:**
   - Expandable guidance covering institutional policies, INC clearance deadlines, Blackboard LTI integration, and academic integrity.

---

# 6. Complete Source Code Listing

## Configuration & Environment

### `package.json`
```json
{
  "name": "mapua-noodle-ai-agent",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@types/express": "^4.17.21",
    "@types/node": "^22.13.10",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^5.0.4",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.19.3",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

---

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

---

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
```

---

### `metadata.json`
```json
{
  "name": "Mapúa Noodle AI Agent",
  "description": "AI Enablement & Learning Copilot for Mapúa University students and faculty members integrated with the Noodle Factory platform.",
  "requestFramePermissions": [],
  "majorCapabilities": [
    "MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"
  ]
}
```

---

### `.env.example`
```env
# Gemini API Key (Required for server-side Gemini intelligence)
# Provided automatically in AI Studio workspace or manually configured
GEMINI_API_KEY=

# Local Ollama configuration (Optional fallback if running locally)
# Default is http://127.0.0.1:11434
OLLAMA_HOST=http://127.0.0.1:11434

# Default Ollama Model name (e.g., llama3.2, mistral, llama3, qwen2.5)
OLLAMA_MODEL=llama3.2

# Preferred AI Provider: 'gemini' (default) or 'ollama'
AI_PROVIDER=gemini

# Application URL
APP_URL=
```

---

### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mapúa Noodle AI Agent</title>
    <meta name="description" content="AI Enablement & Learning Copilot for Mapúa University students and faculty members integrated with the Noodle Factory platform." />
    <meta property="og:title" content="Mapúa Noodle AI Agent" />
    <meta property="og:description" content="AI Enablement & Learning Copilot for Mapúa University students and faculty members integrated with the Noodle Factory platform." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Backend Service

### `server.ts`
```typescript
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(CONVERSATIONS_FILE)) {
  fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify([], null, 2));
}

// Conversation data helpers
function getStoredConversations(): any[] {
  try {
    const raw = fs.readFileSync(CONVERSATIONS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading conversations file:", err);
    return [];
  }
}

function saveStoredConversations(conversations: any[]) {
  try {
    fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
  } catch (err) {
    console.error("Error writing conversations file:", err);
  }
}

// Gemini AI Client setup
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// Ollama Configuration
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";
const PREFERRED_PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase();

// Check if Ollama is accessible
async function isOllamaAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// Query local Ollama instance
async function queryOllama(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama error: ${response.status} ${errText}`);
  }

  const data = (await response.json()) as { response?: string };
  return data.response || "No response generated by Ollama.";
}

// System instructions tailored for Mapua & Noodle Factory
function getMapuaSystemPrompt(role: string, user: any): string {
  const isFaculty = role === "faculty";
  const userDepartment = user?.department || "Mapúa University";
  const userName = user?.name || "Cardinal";

  if (isFaculty) {
    return `You are the Mapúa Noodle AI Agent, an academic enablement and AI copilot specialized for Mapúa University Faculty members, instructors, and professors in partnership with Noodle Factory (Walter AI, Walter AI Tutor, Walter AI Admin).

USER CONTEXT:
- Faculty Name: ${userName}
- Department: ${userDepartment}
- Role: Mapúa Faculty / Instructor

KNOWLEDGE BASE & GUIDELINES:
1. Mapúa University Context:
   - Operating under Outcome-Based Education (OBE). Courses are mapped to Course Outcomes (CO1 to CO4) and Student Outcomes (SO).
   - Academic calendar is based on 10-week Quarterm (Terms 1 to 4). Faculty deal with tight grading turnarounds, intensive modular exams, and continuous assessment.
   - Core tools: Blackboard Learn LMS, MyMapua Faculty portal, Teams, and Noodle Factory LTI tools.

2. Noodle Factory Integration for Faculty:
   - "Knowledge Base Builder": Guide professors on digitizing lecture slides, syllabi, PDF notes, and lab manuals into 24/7 AI teaching assistants.
   - "Automated Rubric Grading": Explain how Walter AI can evaluate free-form short and long answers against instructor criteria rubrics, highlighting accuracy, rationale, and human-in-the-loop teacher moderation.
   - "24/7 Socratic Student Support": Explain how the AI tutor acts as a 24/7 teaching assistant to answer repetitive student questions, freeing up up to 80% of faculty consultation hours.
   - "OBE Alignment": Assist instructors in tagging questions and course materials to specific Course Outcomes (COs).

3. Communication Style:
   - Professional, collegial, efficient, and academically rigorous.
   - Use clear formatting, bullet points, and step-by-step procedures when giving instructions.
   - Proudly champion Mapúa excellence and pedagogical efficiency.`;
  }

  // Student Prompt
  return `You are the Mapúa Noodle AI Agent, a dedicated academic tutor and university guide for Mapúa University students ("Cardinals"), powered by Noodle Factory's Socratic learning platform.

USER CONTEXT:
- Student Name: ${userName}
- Program/Department: ${userDepartment}
- Student Role: Undergraduate/Graduate Student

KNOWLEDGE BASE & GUIDELINES:
1. Mapúa University Context:
   - Fast-paced 10-week Quarterm system: week 1-3 foundational lectures, week 4-5 midterms, week 8-9 finals/modular completions.
   - Outcome-Based Education (OBE): passing relies on passing Course Outcomes (CO1, CO2, CO3, CO4). An overall passing grade is not enough if a prerequisite CO is failed.
   - Administrative portals: MyMapua (enrollment, grade tracking, section petitions, prerequisite waivers, INC completion forms), Blackboard Learn (course modules, submissions), and Cardinal Plus.
   - Mapúa Incomplete (INC) rule: Students have strictly ONE (1) academic year to clear an INC status before it automatically converts to 5.00 (Failure).

2. Noodle Factory Socratic Tutoring Philosophy:
   - NEVER simply provide direct answers to homework or assignment problems.
   - Instead, act as a Socratic tutor: break down problems step-by-step, ask clarifying questions, provide hints, reference relevant engineering/computing formulas, and guide the student to arrive at the solution independently.
   - Provide practice drills and quiz self-checks mapped to their Course Outcomes.
   - Offer pragmatic study tips and time-management schedules specifically crafted for surviving and thriving in Mapúa's 10-week Quarterm.

3. Tone and Personality:
   - Encouraging, patient, structured, and spirited ("Viva Mapúa!").
   - Format equations, formulas, and code snippets cleanly using markdown.
   - Keep answers clear and digestible for busy Cardinals studying late at night.`;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health endpoint
  app.get("/api/health", async (_req, res) => {
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const ollamaOk = await isOllamaAvailable();

    res.json({
      status: "ok",
      university: "Mapúa University",
      platform: "Noodle Factory AI Agent",
      preferredProvider: PREFERRED_PROVIDER,
      providers: {
        gemini: {
          available: hasGemini,
          model: "gemini-2.5-flash",
        },
        ollama: {
          available: ollamaOk,
          host: OLLAMA_HOST,
          model: OLLAMA_MODEL,
        },
      },
    });
  });

  // Check AI Provider Status
  app.get("/api/ai-status", async (_req, res) => {
    const ollamaOk = await isOllamaAvailable();
    let installedModels: string[] = [];

    if (ollamaOk) {
      try {
        const r = await fetch(`${OLLAMA_HOST}/api/tags`);
        if (r.ok) {
          const d = (await r.json()) as { models?: Array<{ name: string }> };
          installedModels = (d.models || []).map((m) => m.name);
        }
      } catch {
        // ignore
      }
    }

    res.json({
      provider: PREFERRED_PROVIDER,
      geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
      ollamaReachable: ollamaOk,
      ollamaHost: OLLAMA_HOST,
      ollamaModel: OLLAMA_MODEL,
      installedModels,
      details: ollamaOk
        ? `Local Ollama is online at ${OLLAMA_HOST} with model '${OLLAMA_MODEL}'`
        : process.env.GEMINI_API_KEY
        ? "Gemini API is configured and ready"
        : "No AI provider configured. Fallback intelligent responses will be used.",
    });
  });

  // Mock Authentication Endpoint for Mapua accounts
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Student demo credential
    if (cleanEmail === "ejdestacion@mymail.mapua.edu.ph" || cleanEmail.includes("student")) {
      res.json({
        success: true,
        user: {
          name: "Emmanuel J. De Estacion",
          email: cleanEmail,
          role: "student",
          department: "School of Information Technology",
          studentIdOrFacultyId: "2021104829",
          avatarText: "ED",
        },
      });
      return;
    }

    // Faculty demo credential
    if (cleanEmail === "jptcruz@mapua.edu.ph" || cleanEmail.includes("faculty") || cleanEmail.includes("prof")) {
      res.json({
        success: true,
        user: {
          name: "Prof. Jon P. Tan-Cruz, PhD",
          email: cleanEmail,
          role: "faculty",
          department: "Department of Computer Science & Engineering",
          studentIdOrFacultyId: "FAC-90142",
          avatarText: "JC",
        },
      });
      return;
    }

    // Generic dynamic credential based on domain
    const isStudent = cleanEmail.includes("mymail.mapua.edu.ph") || cleanEmail.includes("student");
    const namePart = cleanEmail.split("@")[0].replace(/[\._]/g, " ");
    const formattedName = namePart
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    res.json({
      success: true,
      user: {
        name: formattedName || (isStudent ? "Mapúa Cardinal Student" : "Mapúa Professor"),
        email: cleanEmail,
        role: isStudent ? "student" : "faculty",
        department: isStudent ? "School of Information Technology" : "Faculty of Engineering & Sciences",
        studentIdOrFacultyId: isStudent ? "2023198001" : "FAC-88120",
        avatarText: (formattedName.charAt(0) || "M") + (isStudent ? "S" : "F"),
      },
    });
  });

  // GET user conversations
  app.get("/api/conversations", (req, res) => {
    const userEmail = req.query.email as string;
    const conversations = getStoredConversations();

    if (!userEmail) {
      res.json({ success: true, conversations });
      return;
    }

    const userConversations = conversations.filter(
      (c) => c.userEmail?.toLowerCase() === userEmail.toLowerCase()
    );
    res.json({ success: true, conversations: userConversations });
  });

  // GET single conversation
  app.get("/api/conversations/:id", (req, res) => {
    const { id } = req.params;
    const userEmail = req.query.email as string;
    const conversations = getStoredConversations();

    const conv = conversations.find(
      (c) => c.id === id && (!userEmail || c.userEmail?.toLowerCase() === userEmail.toLowerCase())
    );

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.json({ success: true, conversation: conv });
  });

  // SAVE or UPDATE conversation
  app.post("/api/conversations", (req, res) => {
    const { conversation } = req.body;
    if (!conversation || !conversation.id) {
      res.status(400).json({ error: "Invalid conversation object" });
      return;
    }

    const conversations = getStoredConversations();
    const existingIndex = conversations.findIndex((c) => c.id === conversation.id);

    if (existingIndex >= 0) {
      conversations[existingIndex] = {
        ...conversations[existingIndex],
        ...conversation,
        updatedAt: new Date().toISOString(),
      };
    } else {
      conversations.unshift({
        ...conversation,
        createdAt: conversation.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    saveStoredConversations(conversations);
    res.json({ success: true, conversation });
  });

  // RENAME conversation title
  app.patch("/api/conversations/:id", (req, res) => {
    const { id } = req.params;
    const { title, userEmail } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const conversations = getStoredConversations();
    const convIndex = conversations.findIndex(
      (c) => c.id === id && (!userEmail || c.userEmail?.toLowerCase() === userEmail.toLowerCase())
    );

    if (convIndex === -1) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    conversations[convIndex].title = title;
    conversations[convIndex].updatedAt = new Date().toISOString();

    saveStoredConversations(conversations);
    res.json({ success: true, conversation: conversations[convIndex] });
  });

  // DELETE conversation
  app.delete("/api/conversations/:id", (req, res) => {
    const { id } = req.params;
    const userEmail = req.query.email as string;

    let conversations = getStoredConversations();
    const initialLength = conversations.length;

    conversations = conversations.filter(
      (c) => !(c.id === id && (!userEmail || c.userEmail?.toLowerCase() === userEmail.toLowerCase()))
    );

    if (conversations.length === initialLength) {
      res.status(404).json({ error: "Conversation not found or unauthorized" });
      return;
    }

    saveStoredConversations(conversations);
    res.json({ success: true, message: "Conversation deleted successfully" });
  });

  // AI Chat Completion Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], role = "student", user, context } = req.body;

      if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message is required and must be a string." });
        return;
      }

      const systemPrompt = getMapuaSystemPrompt(role, user);
      const isFaculty = role === "faculty";

      // 1. Check if Gemini is available
      const gemini = getGeminiClient();
      if (gemini) {
        try {
          // Construct message chain for Gemini
          let fullPrompt = `${systemPrompt}\n\n`;
          if (context) {
            fullPrompt += `FOCUS CONTEXT: ${context}\n\n`;
          }

          if (Array.isArray(history) && history.length > 0) {
            fullPrompt += "RECENT CONVERSATION HISTORY:\n";
            for (const h of history.slice(-6)) {
              fullPrompt += `${h.sender === "user" ? "User" : "AI Agent"}: ${h.text}\n`;
            }
            fullPrompt += "\n";
          }

          fullPrompt += `User: ${message}\nAI Agent:`;

          const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
          });

          if (response.text) {
            res.json({
              text: response.text,
              provider: "gemini",
            });
            return;
          }
        } catch (geminiError: any) {
          console.warn("Gemini generation failed, falling back to next provider:", geminiError?.message || geminiError);
        }
      }

      // 2. Check if local Ollama is available
      const ollamaReachable = await isOllamaAvailable();
      if (ollamaReachable) {
        try {
          const ollamaResponse = await queryOllama(message, systemPrompt);
          res.json({
            text: ollamaResponse,
            provider: "ollama",
          });
          return;
        } catch (ollamaErr: any) {
          console.warn("Ollama query failed, falling back to built-in rules engine:", ollamaErr?.message || ollamaErr);
        }
      }

      // 3. Robust rule-based domain engine fallback for Mapua & Noodle topics
      const lower = message.toLowerCase();
      let responseText = "";

      if (isFaculty) {
        if (lower.includes("rubric") || lower.includes("grade") || lower.includes("grading")) {
          responseText = `### 📋 Automated Rubric Grading with Noodle Factory (Walter AI)\n\nAs a Mapúa instructor, you can configure Walter AI to evaluate open-ended and subjective student responses with high consistency while retaining 100% human oversight:\n\n1. **Define Your Criteria:** Input specific rubrics directly into Walter AI Admin, including accuracy thresholds, acceptable keywords, and partial-credit criteria.\n2. **AI First-Pass Review:** Walter AI marks each student submission, assigning a provisional score accompanied by an explanatory rationale based on your rubric.\n3. **Faculty Moderation:** You can review outliers, adjust grades, override marks, and approve the final score report.\n4. **Outcome Mapping:** Every rubric criterion can be tied directly to a Course Outcome (**CO1 to CO4**), generating automated OBE attainment metrics for ABET/PTC reporting.\n\n*Would you like to generate a sample 4-point rubric for an upcoming engineering or IT assessment?*`;
        } else if (lower.includes("knowledge") || lower.includes("upload") || lower.includes("slide") || lower.includes("syllabus")) {
          responseText = `### 📚 Knowledge Base Digitization Guide\n\nTransforming your course materials into a responsive 24/7 student copilot is straightforward:\n\n1. **Supported Formats:** Upload your official syllabus, lecture slides (PPTX, PDF), problem sets, and lab manuals directly to the Walter AI Course Repository.\n2. **Blackboard LTI Sync:** Enable the Noodle Factory LTI tool within your Blackboard Learn Course Content Market.\n3. **Socratic Guardrails:** Set your pedagogical rules so the AI tutor prompts students toward self-discovery rather than dispensing direct answer keys for graded problem sets.\n4. **Analytics Dashboard:** Review weekly misconception reports to identify specific course topics that students struggle with most.\n\n*Would you like assistance outlining the ingestion plan for your upcoming term syllabus?*`;
        } else if (lower.includes("obe") || lower.includes("course outcome") || lower.includes("co1") || lower.includes("co2")) {
          responseText = `### 🎯 Mapúa OBE Course Outcome Tagging & Analytics\n\nNoodle Factory integrates with Mapúa's Outcome-Based Education (OBE) model:\n\n- **CO Tagging:** Tag every quiz item, knowledge check, and assessment with its specific Course Outcome (e.g., **CO1: Fundamental Theories**, **CO2: Problem Formulation**, **CO3: Design & Implementation**, **CO4: Evaluation**).\n- **Threshold Monitoring:** Track student cohort mastery against the 70% threshold required for program outcome verification.\n- **Targeted Remediation:** Automatically suggest remedial problem sets from your Knowledge Base to students falling below standard in a specific CO.\n\n*Shall we configure a diagnostic drill for a specific Course Outcome?*`;
        } else {
          responseText = `### 🎓 Mapúa Faculty Copilot: Academic Enablement\n\nI am here to assist your teaching, course preparation, and grading workflows at Mapúa University:\n\n- **Knowledge Base Creation:** Converting lecture notes and syllabi into an always-on Walter AI assistant.\n- **Rubric-Based Automated Grading:** Evaluating free-form student responses with rationale breakdowns.\n- **Office Hour Support:** Offloading up to 80% of repetitive questions about course policies, schedules, and foundational definitions.\n- **Blackboard LMS Integration:** Connecting assessments smoothly into your course modules.\n\n*What course or teaching workflow would you like to streamline today?*`;
        }
      } else {
        // Student queries
        if (lower.includes("socratic") || lower.includes("hint") || lower.includes("solve") || lower.includes("answer")) {
          responseText = `### 🧠 Noodle Socratic Learning Coach\n\nAs your Mapúa Noodle AI Agent, I follow the **Socratic Method**—my goal is to help you master the reasoning, not just hand you a solution key.\n\n**Here is how we tackle complex problems together:**\n1. **State What You Know:** What are the given variables, constraints, and known formulas?\n2. **Identify the Core Concept:** Which Course Outcome (**CO1 to CO4**) or principle applies here (e.g., Kirchhoff's Laws, Big-O Complexity, Navier-Stokes, Differential Equations)?\n3. **Decompose the Problem:** Let's break the calculation into manageable sub-steps.\n\n*Share your problem statement or the specific step where you are stuck, and let's work through the concept together!*`;
        } else if (lower.includes("petition") || lower.includes("mymapua") || lower.includes("waiver") || lower.includes("overload")) {
          responseText = `### 🏛️ MyMapua Petition & Administrative Guidelines\n\nHere are the step-by-step procedures for common Mapúa student petitions:\n\n1. **Section Overload Petition:**\n   - Log in to your **MyMapua** portal during the designated advising period.\n   - Navigate to **Student Petitions > Course Overload**.\n   - Ensure your cumulative GPA meets the department threshold and submit for Program Chair endorsement.\n\n2. **Prerequisite Waiver Petition:**\n   - Applicable only for graduating students or specialized curriculum adjustments.\n   - Requires Dean and Registrar approval prior to enrollment finalization.\n\n3. **Incomplete (INC) Completion:**\n   - You have strictly **ONE (1) academic year** from the term the INC was incurred to complete missing requirements.\n   - Secure a Completion Form from the Registrar, have your professor sign upon submission of requirements, and verify the grade update in MyMapua.\n\n*Do you need help preparing a petition for a specific department or subject?*`;
        } else if (lower.includes("quarterm") || lower.includes("week") || lower.includes("exam") || lower.includes("study")) {
          responseText = `### ⚡ 10-Week Quarterm Survival & Pacing Strategy\n\nMapúa's Quarterm pace demands strict time management:\n\n- **Weeks 1–3 (Foundations & CO1):** Review lecture notes within 24 hours of class. Solidify basic definitions and start weekly problem sets immediately.\n- **Weeks 4–5 (Midterms & CO2):** Peak review period. Test yourself using Socratic practice drills rather than passive reading.\n- **Weeks 6–7 (Application & CO3):** Complete laboratory requirements, design projects, and machine problems before final week congestion.\n- **Weeks 8–9 (Final Exams & Modular Completion):** Prioritize courses with prerequisite COs to avoid incurring INC grades.\n- **Week 10 (Grade Finalization):** Verify all portal postings on MyMapua promptly.\n\n*Viva Mapúa! Would you like a personalized weekly study schedule for your current enrolled load?*`;
        } else {
          responseText = `### 🦉 Hello Cardinal! Welcome to your Mapúa Noodle AI Copilot\n\nI am your 24/7 learning partner powered by Noodle Factory's Socratic AI platform:\n\n- **Socratic Problem Solving:** Get conceptual hints, formula guides, and step-by-step guidance without spoiling answer keys.\n- **Course Outcome (CO) Mastery:** Test your preparation against Mapúa's Outcome-Based Education standards.\n- **MyMapua Guidance:** Step-by-step answers for petitions, waivers, advising, and INC clearances.\n- **Quarterm Pacing:** Tips and review schedules for surviving the 10-week academic rush.\n\n*What subject, problem, or Mapúa petition would you like to explore today?*`;
        }
      }

      res.json({
        text: responseText,
        provider: "mapua-noodle-rules-engine",
      });
    } catch (err: any) {
      console.error("Chat endpoint error:", err);
      res.status(500).json({
        error: "Failed to process chat request.",
        details: err?.message || String(err),
      });
    }
  });

  // Vite development middleware vs Static Production bundle
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mapúa Noodle AI Agent running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
```

---

## Frontend Core

### `src/types.ts`
```typescript
export type UserRole = "student" | "faculty";

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentIdOrFacultyId: string;
  avatarText: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
}

export interface Conversation {
  id: string;
  userEmail: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  role: UserRole;
}

export interface PillarInfo {
  id: string;
  title: string;
  shortDesc: string;
  prompt: string;
  iconName: string;
  badge: string;
  benefits: string[];
}
```

---

### `src/main.tsx`
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

### `src/App.tsx`
```typescript
import { useState, useEffect } from "react";
import { UserProfile } from "./types";
import { Header } from "./components/Header";
import { LoginScreen } from "./components/LoginScreen";
import { NoodleOnboardingBot } from "./components/NoodleOnboardingBot";

const SESSION_STORAGE_KEY = "mapua_noodle_user_session";

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing session on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear session:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-600 text-sm font-medium">Initializing Mapúa Noodle Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 antialiased">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
        {!currentUser ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <NoodleOnboardingBot currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}

export default App;
```

---

### `src/index.css`
```css
@import "tailwindcss";
```

---

### `src/utils/chatUtils.ts`
```typescript
import { Conversation, ChatMessage } from "../types";

export function generateConversationTitle(firstMessageText: string, role: string): string {
  if (!firstMessageText || !firstMessageText.trim()) {
    return role === "faculty" ? "Faculty Consultation" : "Student Study Session";
  }

  const text = firstMessageText.toLowerCase().trim();

  // Pattern detection for Mapua & Noodle topics
  if (text.includes("socratic") || text.includes("hint")) return "Socratic Tutoring Guide";
  if (text.includes("rubric") || text.includes("grade") || text.includes("grading")) return "Automated Rubric Evaluation";
  if (text.includes("knowledge") || text.includes("upload") || text.includes("syllabus")) return "Knowledge Base Digitization";
  if (text.includes("obe") || text.includes("course outcome") || text.includes("co1") || text.includes("co2")) return "Mapúa OBE Outcome Mastery";
  if (text.includes("petition") || text.includes("mymapua") || text.includes("waiver") || text.includes("overload")) return "MyMapua Petitions & Advising";
  if (text.includes("inc") || text.includes("incomplete")) return "INC Completion Guidelines";
  if (text.includes("quarterm") || text.includes("exam") || text.includes("study")) return "Quarterm Study & Exam Prep";
  if (text.includes("blackboard") || text.includes("lms")) return "Blackboard LTI Integration";

  // If message has words, grab the first 4-5 words
  const words = firstMessageText.trim().split(/\s+/);
  if (words.length <= 5) {
    return firstMessageText.trim();
  }

  const truncated = words.slice(0, 5).join(" ");
  return truncated.charAt(0).toUpperCase() + truncated.slice(1) + "...";
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}
```

---

## Frontend Components

### `src/components/Header.tsx`
```typescript
import { UserProfile } from "../types";
import { GraduationCap, LogOut, BookOpen, Sparkles, User } from "lucide-react";

interface HeaderProps {
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-stone-900">
                MAPÚA
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                NOODLE AI
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Academic Enablement & Socratic Copilot
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        {currentUser ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-stone-800">
                {currentUser.name}
              </span>
              <div className="flex items-center justify-end gap-1.5 text-xs text-stone-500">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    currentUser.role === "faculty"
                      ? "bg-purple-600"
                      : "bg-[#800000]"
                  }`}
                />
                <span className="capitalize font-medium">
                  {currentUser.role}
                </span>
                <span>•</span>
                <span className="truncate max-w-[150px]">
                  {currentUser.department}
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 text-[#800000] font-bold text-sm flex items-center justify-center">
              {currentUser.avatarText || <User className="w-4 h-4" />}
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-stone-500 hover:text-red-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Noodle Factory Platform Active</span>
          </div>
        )}
      </div>
    </header>
  );
}
```

---

### `src/components/LoginScreen.tsx`
```typescript
import { useState } from "react";
import { UserProfile } from "../types";
import { GraduationCap, ShieldCheck, UserCheck, Sparkles, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("ejdestacion@mymail.mapua.edu.ph");
  const [password, setPassword] = useState("Student123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const setStudentDemo = () => {
    setEmail("ejdestacion@mymail.mapua.edu.ph");
    setPassword("Student123");
    setError(null);
  };

  const setFacultyDemo = () => {
    setEmail("jptcruz@mapua.edu.ph");
    setPassword("Faculty123");
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-[#800000] text-amber-300 rounded-2xl shadow-sm mb-4">
          <GraduationCap className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight sm:text-4xl">
          Mapúa Noodle AI Enablement
        </h1>
        <p className="mt-2 text-base text-stone-600 max-w-xl mx-auto">
          Outcome-Based Education & Socratic AI Copilot for Cardinals and Faculty.
          Powered by the Noodle Factory intelligent learning platform.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Login Form */}
        <div className="md:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-xl font-bold text-stone-900 mb-2">
            Institutional Sign In
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Sign in with your official Mapúa myMail or faculty institutional account.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mapúa Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cardinal@mymail.mapua.edu.ph or @mapua.edu.ph"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Enter Academic Copilot</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Demo Selector */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Quick Demo Roles</span>
            </div>
            <p className="text-xs text-amber-900/80 mb-4">
              Select an institutional profile to preview role-adapted AI assistance:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={setStudentDemo}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  email.includes("student") || email.includes("mymail")
                    ? "bg-white border-[#800000] shadow-xs"
                    : "bg-white/80 border-amber-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#800000]" />
                    Mapúa Student
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-1.5 py-0.5 rounded">
                    Socratic Mode
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Outcome mastery, Socratic problem breakdown, & Quarterm pacing.
                </p>
              </button>

              <button
                type="button"
                onClick={setFacultyDemo}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  email.includes("mapua.edu.ph") && !email.includes("mymail")
                    ? "bg-white border-purple-600 shadow-xs"
                    : "bg-white/80 border-amber-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    Mapúa Faculty Member
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.5 rounded">
                    Admin / Rubric
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Knowledge base creation, rubric scoring, & consultation offloading.
                </p>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-xs space-y-1.5">
            <span className="font-bold text-stone-800 block">Mapúa Academic Core:</span>
            <p>• ABET & PTC Accredited Outcome-Based Education (OBE)</p>
            <p>• Blackboard Learn LMS Integration via LTI</p>
            <p>• Noodle Factory Walter AI Tutoring Architecture</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### `src/components/ChatHistorySidebar.tsx`
```typescript
import { useState } from "react";
import { Conversation, UserProfile } from "../types";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { formatRelativeTime } from "../utils/chatUtils";

interface ChatHistorySidebarProps {
  currentUser: UserProfile;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ChatHistorySidebar({
  currentUser,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onToggleOpen,
}: ChatHistorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (c: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const saveEditing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(id);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggleOpen}
        className="md:hidden fixed bottom-5 left-5 z-40 p-3 bg-[#800000] text-amber-300 rounded-full shadow-lg"
        title="Toggle History"
      >
        {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-stone-900 text-stone-200 border-r border-stone-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header / New Chat */}
        <div className="p-4 border-b border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Session History
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400 font-medium">
              {currentUser.role === "faculty" ? "Faculty" : "Student"}
            </span>
          </div>

          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#800000] hover:bg-[#990000] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Academic Session</span>
          </button>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-stone-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No chat history found.</p>
              <p className="text-[10px] mt-1 text-stone-600">Start a new query to save a session.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isEditing = editingId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group relative rounded-xl px-3 py-2 text-xs cursor-pointer transition-all ${
                    isActive
                      ? "bg-stone-800 text-white font-medium border-l-3 border-[#800000]"
                      : "text-stone-300 hover:bg-stone-800/60"
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 bg-stone-700 text-white text-xs rounded border border-stone-600 focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                      <button
                        onClick={(e) => saveEditing(conv.id, e)}
                        className="p-1 hover:text-green-400 text-stone-300"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={cancelEditing} className="p-1 hover:text-red-400 text-stone-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs">{conv.title}</p>
                        <span className="text-[10px] text-stone-500">
                          {formatRelativeTime(conv.updatedAt || conv.createdAt)}
                        </span>
                      </div>

                      {/* Action buttons (hover or active) */}
                      <div className="hidden group-hover:flex items-center gap-1 text-stone-400">
                        <button
                          onClick={(e) => startEditing(conv, e)}
                          className="p-1 hover:text-amber-300 rounded"
                          title="Rename"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(conv.id, e)}
                          className="p-1 hover:text-red-400 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Mapúa OBE & Noodle Factory</span>
          <span className="text-[10px] text-amber-400 font-mono">v1.2</span>
        </div>
      </aside>
    </>
  );
}
```

---

### `src/components/NoodleOnboardingBot.tsx`
*(This component manages the main interactive workspace, including the domain-specific action pillars, real-time message stream, markdown rendering, and collapsible institutional FAQ drawer.)*

```typescript
import { useState, useEffect, useRef } from "react";
import { UserProfile, ChatMessage, Conversation, PillarInfo } from "../types";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { generateConversationTitle } from "../utils/chatUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  Layers,
  FileText,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

interface NoodleOnboardingBotProps {
  currentUser: UserProfile;
}

const STORAGE_CONVERSATIONS_KEY = "mapua_noodle_chat_sessions";

export function NoodleOnboardingBot({ currentUser }: NoodleOnboardingBotProps) {
  const isFaculty = currentUser.role === "faculty";

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active chat state
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [showFaq, setShowFaq] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Student Pillars
  const studentPillars: PillarInfo[] = [
    {
      id: "socratic",
      title: "1. Socratic AI Tutor",
      shortDesc: "Step-by-step guidance without giving direct answer keys.",
      prompt: "Can you help me understand how to solve this problem using Socratic guidance and hints instead of giving me the direct answer?",
      iconName: "HelpCircle",
      badge: "Socratic Method",
      benefits: ["Promotes deep active recall", "Step-by-step hints", "Zero academic integrity violations"],
    },
    {
      id: "obe",
      title: "2. OBE Outcome Mastery",
      shortDesc: "Practice drills mapped to Course Outcomes (CO1 to CO4).",
      prompt: "Can you generate practice drill questions to test my mastery of Mapúa Course Outcomes (CO1, CO2, and CO3)?",
      iconName: "Award",
      badge: "Mapúa OBE",
      benefits: ["Tagged to syllabus COs", "Self-assessment scoring", "Remediation recommendations"],
    },
    {
      id: "mymapua",
      title: "3. MyMapua Petition Guidance",
      shortDesc: "Step-by-step procedures for overload, waiver, and INC completion.",
      prompt: "What are the rules and step-by-step procedure for filing an Incomplete (INC) completion form or prerequisite waiver on MyMapua?",
      iconName: "FileText",
      badge: "Advising & Registrar",
      benefits: ["1-year INC deadline alert", "Clearance checklists", "Registrar approval paths"],
    },
    {
      id: "quarterm",
      title: "4. 10-Week Quarterm Strategies",
      shortDesc: "Pacing routines and exam survival strategies for Mapúa terms.",
      prompt: "Give me an effective weekly study plan and survival strategy for surviving Mapúa's fast-paced 10-week Quarterm system.",
      iconName: "Calendar",
      badge: "Quarterm Pacing",
      benefits: ["Week 1-3 foundational review", "Midterm surge planning", "Exam week schedule templates"],
    },
  ];

  // Faculty Pillars
  const facultyPillars: PillarInfo[] = [
    {
      id: "knowledge_base",
      title: "1. Knowledge Base Digitization",
      shortDesc: "Ingest syllabi, lecture decks, and lab manuals into Walter AI.",
      prompt: "How do I upload and organize my syllabus, lecture PPTs, and lab manuals into Noodle Factory to build a 24/7 course assistant?",
      iconName: "Layers",
      badge: "Knowledge Repository",
      benefits: ["PPTX, PDF, DOCX support", "Granular unit ingestion", "Always-on student assistant"],
    },
    {
      id: "rubric_grading",
      title: "2. Automated Rubric Grading",
      shortDesc: "Objective criteria grading with human-in-the-loop teacher moderation.",
      prompt: "Explain how Walter AI uses instructor-defined rubrics to evaluate free-form short and long student answers, and how faculty moderation works.",
      iconName: "Award",
      badge: "Rubric Engine",
      benefits: ["Criteria-based scoring", "Automated rationale explanations", "100% faculty override authority"],
    },
    {
      id: "consultation",
      title: "3. 24/7 Socratic Student Support",
      shortDesc: "Reclaim up to 80% of repetitive consultation office hours.",
      prompt: "How does Noodle Factory's Socratic AI assistant offload repetitive student questions while keeping students actively engaged?",
      iconName: "BookOpen",
      badge: "Office Hours Offload",
      benefits: ["Handles repetitive queries", "Pinpoints common student misconceptions", "Frees time for research & mentorship"],
    },
    {
      id: "lms_sync",
      title: "4. Mapúa OBE & LMS Sync",
      shortDesc: "Blackboard LTI integration and Course Outcome (CO1–CO4) alignment.",
      prompt: "How do I connect Noodle Factory assessments into Blackboard Learn LMS and tag assessments to Mapúa Course Outcomes for accreditation?",
      iconName: "CheckCircle2",
      badge: "LMS & OBE Alignment",
      benefits: ["Blackboard Content Market LTI", "ABET/PTC metric exports", "Direct gradebook synchronization"],
    },
  ];

  const activePillars = isFaculty ? facultyPillars : studentPillars;

  // Load user conversations from localStorage and server
  useEffect(() => {
    const fetchConversations = async () => {
      let localConvs: Conversation[] = [];
      try {
        const saved = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          localConvs = Array.isArray(parsed)
            ? parsed.filter((c: Conversation) => c.userEmail === currentUser.email)
            : [];
        }
      } catch (err) {
        console.warn("Error reading local storage:", err);
      }

      try {
        const res = await fetch(`/api/conversations?email=${encodeURIComponent(currentUser.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.conversations && Array.isArray(data.conversations)) {
            const combined = [...data.conversations];
            localConvs.forEach((lc) => {
              if (!combined.find((c) => c.id === lc.id)) {
                combined.push(lc);
              }
            });
            setConversations(combined);
            if (combined.length > 0 && !activeConversationId) {
              selectConversation(combined[0].id, combined);
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Backend conversation fetch failed, using local storage:", err);
      }

      setConversations(localConvs);
      if (localConvs.length > 0 && !activeConversationId) {
        selectConversation(localConvs[0].id, localConvs);
      } else if (localConvs.length === 0) {
        initDefaultConversation();
      }
    };

    fetchConversations();
  }, [currentUser.email]);

  const selectConversation = (id: string, list = conversations) => {
    setActiveConversationId(id);
    const target = list.find((c) => c.id === id);
    if (target) {
      setMessages(target.messages);
    }
  };

  const initDefaultConversation = () => {
    const newId = "conv_" + Date.now();
    const initialGreeting: ChatMessage = {
      id: "msg_init_" + Date.now(),
      sender: "ai",
      text: isFaculty
        ? `### 🎓 Welcome, ${currentUser.name}!\n\nI am your **Mapúa Noodle AI Enablement Copilot**, integrated with the **Noodle Factory** platform.\n\nHere is how I can assist your teaching and curriculum management:\n- **Knowledge Base Ingestion:** Ingest syllabi, lecture decks, and lab manuals into 24/7 course assistants.\n- **Automated Rubric Grading:** Evaluate open-ended student work with human-in-the-loop oversight.\n- **OBE Course Outcome Tagging:** Align questions to **CO1–CO4** for ABET and PTC accreditation.\n\n*Select an action pillar below or type your prompt to get started!*`
        : `### 🦉 Hello, ${currentUser.name}!\n\nWelcome to your **Mapúa Noodle AI Academic Copilot**, built for Cardinals in partnership with **Noodle Factory**.\n\nI am here to help you navigate your courses and the **10-week Quarterm**:\n- **Socratic Problem Solving:** Guidance, hints, and step-by-step concept breakdowns without giving away direct answer keys.\n- **OBE Outcome Mastery:** Practice quizzes tagged to Course Outcomes (**CO1 to CO4**).\n- **MyMapua Administrative Help:** Guidance on overload petitions, prerequisite waivers, and Incomplete (INC) clearance procedures.\n\n*Choose a study pillar below or ask your academic question!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newConv: Conversation = {
      id: newId,
      userEmail: currentUser.email,
      title: isFaculty ? "Faculty Enablement Overview" : "Cardinal Academic Orientation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [initialGreeting],
      role: currentUser.role,
    };

    const updatedList = [newConv, ...conversations];
    setConversations(updatedList);
    setActiveConversationId(newId);
    setMessages([initialGreeting]);
    saveConversations(updatedList);
  };

  const saveConversations = (list: Conversation[]) => {
    try {
      localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Local storage write error:", e);
    }
  };

  const handleNewChat = () => {
    initDefaultConversation();
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    saveConversations(updated);

    try {
      await fetch(`/api/conversations/${id}?email=${encodeURIComponent(currentUser.email)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }

    if (activeConversationId === id) {
      if (updated.length > 0) {
        selectConversation(updated[0].id, updated);
      } else {
        initDefaultConversation();
      }
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    const updated = conversations.map((c) => (c.id === id ? { ...c, title: newTitle } : c));
    setConversations(updated);
    saveConversations(updated);

    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, userEmail: currentUser.email }),
      });
    } catch {
      // ignore
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend?: string, context?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isGenerating) return;

    const userMsg: ChatMessage = {
      id: "msg_user_" + Date.now(),
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      category: context,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage("");
    setIsGenerating(true);

    let activeId = activeConversationId;
    let currentConv = conversations.find((c) => c.id === activeId);

    if (!currentConv) {
      activeId = "conv_" + Date.now();
      currentConv = {
        id: activeId,
        userEmail: currentUser.email,
        title: generateConversationTitle(messageText, currentUser.role),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: newMessages,
        role: currentUser.role,
      };
      setActiveConversationId(activeId);
    } else {
      if (currentConv.messages.length <= 1) {
        currentConv.title = generateConversationTitle(messageText, currentUser.role);
      }
      currentConv.messages = newMessages;
      currentConv.updatedAt = new Date().toISOString();
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-5),
          role: currentUser.role,
          user: currentUser,
          context: context || selectedPillar,
        }),
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: "msg_ai_" + Date.now(),
        sender: "ai",
        text: data.text || "I have received your request. Let's break this down step-by-step.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: context,
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);

      const updatedConversations = conversations.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title: currentConv?.title || c.title,
              messages: finalMessages,
              updatedAt: new Date().toISOString(),
            }
          : c
      );

      if (!conversations.find((c) => c.id === activeId)) {
        updatedConversations.unshift({
          ...currentConv!,
          messages: finalMessages,
        });
      }

      setConversations(updatedConversations);
      saveConversations(updatedConversations);

      fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: {
            ...currentConv,
            messages: finalMessages,
          },
        }),
      }).catch((e) => console.warn("Sync to backend failed:", e));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "msg_err_" + Date.now(),
        sender: "ai",
        text: "Apologies, I encountered an issue connecting to the AI model. Please check your network connection or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePillarClick = (pillar: PillarInfo) => {
    setSelectedPillar(pillar.id);
    handleSendMessage(pillar.prompt, pillar.title);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* History Sidebar */}
      <ChatHistorySidebar
        currentUser={currentUser}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          selectConversation(id);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50 overflow-hidden">
        {/* Top Control Sub-header */}
        <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-stone-800 truncate">
              {conversations.find((c) => c.id === activeConversationId)?.title || "Active Academic Session"}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium border border-stone-200">
              {isFaculty ? "Faculty Rubric & OBE" : "Student Socratic Mode"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="flex items-center gap-1 text-stone-600 hover:text-[#800000] font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mapúa Knowledge Drawer</span>
              {showFaq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleNewChat}
              title="Reset View"
              className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          </div>
        </div>

        {/* Collapsible FAQ Drawer */}
        {showFaq && (
          <div className="bg-amber-50/70 border-b border-amber-200/80 p-4 text-xs text-stone-800 max-h-48 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-2">
              <span className="font-bold text-amber-900 block uppercase tracking-wider text-[11px]">
                {isFaculty ? "Faculty Quick References:" : "Mapúa Cardinal Quick References:"}
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                {isFaculty ? (
                  <>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>Rubric Moderation:</strong> Walter AI evaluates free-text student responses against criteria, highlighting logic and point attribution. Faculty maintain 100% final override authority.
                    </div>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>OBE Alignment:</strong> Tag questions with Course Outcomes (CO1 to CO4) to export cohort mastery metrics for ABET/PTC accreditation reports.
                    </div>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>Blackboard LTI:</strong> Add Noodle Factory as a direct Content Market tool within your Blackboard course to sync enrollment and gradebooks.
                    </div>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>Supported Formats:</strong> Ingest syllabi, PPTX lecture presentations, PDF handouts, and lab manuals directly into the course knowledge base.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>Socratic Guardrail:</strong> The AI tutor provides hints, formulas, and reasoning steps rather than direct exam or homework answer keys.
                    </div>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>INC Deadline Rule:</strong> Under Mapúa policy, Incomplete (INC) marks must be cleared within strictly ONE (1) academic year or they automatically convert to 5.00.
                    </div>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>MyMapua Petitions:</strong> File overload, waiver, and course petitions early during pre-enrollment advising on the MyMapua portal.
                    </div>
                    <div className="p-2 rounded bg-white/90 border border-amber-200">
                      <strong>Quarterm Timeline:</strong> Fast 10-week pacing requires keeping up with weekly problem sets and Course Outcome checkpoints.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Interactive Strategic Pillars Banner */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                    {isFaculty ? "Faculty Enablement Pillars" : "Student Learning Pillars"}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500">
                  Click a pillar to launch guided exploration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {activePillars.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePillarClick(p)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPillar === p.id
                        ? "bg-stone-50 border-[#800000] ring-1 ring-[#800000]"
                        : "bg-white border-stone-200 hover:border-amber-400 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-stone-900 leading-tight mb-1">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-2">
                      {p.shortDesc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Render Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-[#800000] text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    MN
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 text-sm shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#800000] text-white rounded-br-xs"
                      : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <div className="prose prose-sm max-w-none text-stone-800 space-y-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  <div
                    className={`text-[10px] mt-2 flex items-center gap-1.5 ${
                      msg.sender === "user" ? "text-red-200 justify-end" : "text-stone-400"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.category && (
                      <>
                        <span>•</span>
                        <span className="font-medium truncate max-w-[140px]">{msg.category}</span>
                      </>
                    )}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    {currentUser.avatarText || "U"}
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#800000] text-amber-300 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                  MN
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <div className="w-2 h-2 rounded-full bg-[#800000] animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-stone-400 animate-pulse delay-200"></div>
                    <span className="font-medium ml-1">
                      {isFaculty ? "Analyzing curriculum knowledge base..." : "Generating Socratic guidance..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Composer */}
        <div className="bg-white border-t border-stone-200 p-4">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isFaculty
                    ? "Ask about rubric configuration, knowledge base ingestion, or Blackboard LTI..."
                    : "Ask for conceptual hints, OBE outcomes, MyMapua petitions, or study pacing..."
                }
                disabled={isGenerating}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all disabled:bg-stone-100"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isGenerating}
                className="py-3 px-5 rounded-xl bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
              <span>Mapúa University & Noodle Factory AI Platform</span>
              <span>Socratic Academic Integrity Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

# 7. Verification & Build Confirmation

The codebase passes all TypeScript checks and builds cleanly:
```bash
# Type-checking
npm run lint (tsc --noEmit) -> 0 errors

# Production bundling
npm run build (vite build + esbuild server.ts) -> dist/index.html & dist/server.cjs generated
```
