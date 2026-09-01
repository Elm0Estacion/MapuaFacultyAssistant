import React, { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserProfile, ChatMessage, Conversation, PillarInfo } from "../types";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { HandbookReferenceModal } from "./HandbookReferenceModal";
import { MAPUA_ACADEMIC_HANDBOOK_YEAR } from "../data/mapuaHandbookData";
import { generateChatTitle } from "../utils/chatUtils";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  BookOpen,
  Award,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Compass,
  CheckCircle2,
  Menu,
  Plus,
  MessageSquare,
  PanelLeft,
  Search,
  Terminal,
  Cpu,
} from "lucide-react";

interface NoodleOnboardingBotProps {
  user: UserProfile;
  isHandbookOpenExternal?: boolean;
  onCloseHandbookExternal?: () => void;
  onOpenHandbookExternal?: () => void;
}

// Student Pillars Definition (Centered on Noodle Factory & Walter AI with Academic Context)
const STUDENT_PILLARS: PillarInfo[] = [
  {
    id: "walter-ai-guide",
    title: "1. Walter AI Tutor in Blackboard",
    shortDesc: "Step-by-step guide to accessing Walter AI Tutor in Blackboard Course Content and using Rich Editor & Voice modes.",
    prompt: "How do I access and use Walter AI Tutor inside Mapúa Blackboard Course Content, and how do I use Rich Editor Mode for code and engineering formulas?",
    iconName: "Compass",
    badge: "Walter AI Tutor",
    benefits: ["Blackboard LTI access", "Rich Editor formulas & code", "Voice & Conversation modes"],
  },
  {
    id: "socratic-learning",
    title: "2. Socratic AI Learning & Hints",
    shortDesc: "Master complex concepts with step-by-step hints and guided problem-solving without spoiling answer keys.",
    prompt: "How does Noodle Factory's Socratic tutoring guide me step-by-step through difficult problems, and why doesn't it give direct answer keys?",
    iconName: "Sparkles",
    badge: "Socratic Pedagogy",
    benefits: ["Conceptual step-by-step hints", "Zero homework spoilers", "Continuous self-checks"],
  },
  {
    id: "quizzes-roleplay",
    title: "3. Interactive Quizzes & Role Plays",
    shortDesc: "Practice Course Outcomes (CO1-CO4) with auto-generated conversational quizzes and 3D avatar role-play scenarios.",
    prompt: "How do I take interactive quizzes and participate in simulated AI Role Play activities in Noodle Factory to master Course Outcomes (CO1-CO4)?",
    iconName: "Award",
    badge: "Active Practice",
    benefits: ["Instant remediation feedback", "Course Outcome drills", "AI Role Play simulations"],
  },
  {
    id: "handbook-ai-policy",
    title: "4. AI Attribution & Academic Policies",
    shortDesc: "Mapúa Generative AI Policy (Part D Sec III) attribution formatting, grading scales, and Dean's List requirements.",
    prompt: "According to the Mapúa Academic Handbook (Part D Section III), what is the required attribution format when using AI on assignments, and what are the Dean's List requirements?",
    iconName: "BookOpen",
    badge: "Academic Context",
    benefits: ["Reproducible AI attribution", "70%/80% grading criteria", "Dean's List QWA 1.00-1.75"],
  },
];

// Faculty Pillars Definition (Centered on Noodle Factory Platform Workflows)
const FACULTY_PILLARS: PillarInfo[] = [
  {
    id: "kb-creation",
    title: "1. Knowledge Base & Group Setup",
    shortDesc: "Convert course slides, PDFs, syllabi, and Blackboard content into a structured, zero-hallucination AI Assistant.",
    prompt: "How do I create a Knowledge Base in Noodle Factory, organize files into Knowledge Groups and Subgroups, and import Blackboard LMS content properly?",
    iconName: "BookOpen",
    badge: "Knowledge Base",
    benefits: ["One-time LMS import rule", "Subgroup modularization", "1000MB PDF/PPTX ingestion"],
  },
  {
    id: "agentic-mode",
    title: "2. Agentic Mode & Chat Behavior",
    shortDesc: "Configure Agentic Mode with Learning Companion Plus, and turn OFF Fallback to GPT for strict course grounding.",
    prompt: "What is Agentic Mode in Noodle Factory, how does 'Learning Companion Plus' guide students along Learning Outcomes, and why should I disable 'Fallback to GPT'?",
    iconName: "Sparkles",
    badge: "Agent Settings",
    benefits: ["Proactive learning paths", "Zero-hallucination guarantee", "Document diagrams toggle"],
  },
  {
    id: "quizzes-rubrics",
    title: "3. Question Banks & Rubric Grading",
    shortDesc: "Generate AI distractors, create conversational quizzes, and automate preliminary rubric scoring on lab reports.",
    prompt: "How do I use Noodle Factory's Question Bank to generate plausible distractors, and how does automated criteria-based rubric grading work with faculty moderation?",
    iconName: "Award",
    badge: "Activities & Grading",
    benefits: ["AI Distractor generator", "Automated rubric feedback", "100% faculty final approval"],
  },
  {
    id: "analytics-insights",
    title: "4. Analytics & Unanswered Queries",
    shortDesc: "Monitor student engagement, identify knowledge gaps from 'Unanswered Questions', and save 80% of office hours.",
    prompt: "How do I use Noodle Factory's Overview, Learner Insights, and Unanswered Questions tabs to detect syllabus gaps and optimize consultation hours?",
    iconName: "BarChart3",
    badge: "Class Analytics",
    benefits: ["Unanswered query tracker", "Course Outcome mastery", "Reclaimed consultation time"],
  },
];

// Student FAQs (Grounded in Handbook A.Y. 2026-2027)
const STUDENT_FAQS = [
  {
    question: "What is Mapúa's official policy on using Generative AI for assignments?",
    answer: "Under Part D, Section III of the Academic Handbook (A.Y. 2026-2027), Generative AI is permitted as a learning aid when allowed by the instructor. When permitted, students MUST provide reproducible attribution including: (1) date accessed, (2) URL/tool used, and (3) the exact prompt. Unpermitted AI use is treated as Academic Dishonesty resulting in an outright modular grade of 5.00/F and referral to the Prefect of Discipline (OPD).",
  },
  {
    question: "What is the 20% absence policy in Mapúa?",
    answer: "Based on CHED and Mapúa regulations (Part B, Section IV, Item 3), accumulating absences equal to 20% of class days results in an automatic grade of 5.00 (FAILURE): 1-unit course = 2 absences max; 2-unit course = 4 absences max; 3-unit course = 7 absences max; 4-unit course = 9 absences max; 5-unit course = 11 absences max.",
  },
  {
    question: "How do I qualify for Dean's List and President's List scholarship discounts?",
    answer: "Dean's List requires a QWA of 1.00 to 1.75, running GWA of 1.00 to 2.00, minimum 12 units enrolled, with NO grades of 5.00, F, ABS, IP, C, I, or W. Top ranking students on the Dean's List qualify for the President's List, which grants a 100% full tuition discount for QWA 1.00–1.50 or a 50% half tuition discount for QWA 1.51–1.75 on the succeeding term.",
  },
  {
    question: "What are the rules for completing an Incomplete ('I') grade?",
    answer: "An Incomplete ('I') grade must be resolved within the next two (2) succeeding terms (Part B, Section IV, Item 7.4). You must submit a Request to Complete Course Form (FM-RO-19) and Completion Report Form (FM-RO-20). If not completed within two terms, it automatically lapses into a 5.00 (Failure).",
  },
  {
    question: "When can I officially withdraw ('W') from a course?",
    answer: "A request for official course withdrawal ('W') must be filed through the Registrar's portal (FM-RO-21-02) not later than Friday of the 6th week of the term. A student is allowed to withdraw at most twice from the same course.",
  },
];

// Faculty FAQs (Grounded in Handbook A.Y. 2026-2027)
const FACULTY_FAQS = [
  {
    question: "How do I add a Generative AI policy statement to my course syllabus?",
    answer: "Under Part D, Section III of the Academic Handbook, faculty are instructed to explicitly state course expectations during orientation and in the syllabus on Cardinal Edge. You may choose: (1) Prohibitive (for self-reflective/introductory courses), (2) Controlled with Attribution (specifying exempt assignments with required prompt disclosure), or (3) Exploratory Design (with full prompt and access reproducibility).",
  },
  {
    question: "Will the AI Teaching Assistant give away direct solutions to students?",
    answer: "No. Noodle Factory is built on Socratic Pedagogy. When students ask for homework solutions, the AI prompts them with guiding questions, reviews foundational theorems, and guides them step-by-step without disclosing final answer keys.",
  },
  {
    question: "How do I retain control over grades when using Automated Rubric Marking?",
    answer: "Faculty retain 100% moderation authority. The AI provides preliminary rubric scoring, qualitative commentary, and highlighted evidence from student submissions. You can review, adjust points, and approve grades before publishing to Blackboard LMS.",
  },
  {
    question: "What are the rules for laboratory safety under ILMO?",
    answer: "Under Part G, Section II, shorts, sleeveless tops, and open shoes are strictly prohibited in all laboratories with chemical, electrical, or mechanical hazards. Mandatory PPE must be worn. Research/thesis reservations require submission at least three (3) working days prior.",
  },
];

export const NoodleOnboardingBot: React.FC<NoodleOnboardingBotProps> = ({
  user,
  isHandbookOpenExternal,
  onCloseHandbookExternal,
  onOpenHandbookExternal,
}) => {
  const isStudent = user.role === "student";
  const userStorageKey = `mapua_convos_${user.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  const [isHandbookModalOpen, setIsHandbookModalOpen] = useState(false);

  const isModalOpen = isHandbookOpenExternal !== undefined ? isHandbookOpenExternal : isHandbookModalOpen;
  const handleCloseModal = onCloseHandbookExternal || (() => setIsHandbookModalOpen(false));
  const handleOpenModal = onOpenHandbookExternal || (() => setIsHandbookModalOpen(true));

  const createInitialWelcomeMessage = useCallback((): ChatMessage => {
    const welcomeText = isStudent
      ? `Hello **${user.name}**! 🎓 Welcome to the **Noodle Factory AI Platform** at Mapúa University!

I am your **AI Learning & Academic Success Copilot**, fully integrated with the **Mapúa Academic Handbook (${MAPUA_ACADEMIC_HANDBOOK_YEAR})**. Here is how I can assist you:

1. 📖 **Mapúa Academic Handbook Guidance**: Instant answers and citations on the **Generative AI Policy (Part D Sec III)**, **Grading Scale**, **Dean's & President's List Scholarships**, **20% Absence Failures**, and **Shifting Rules**.
2. 🤖 **24/7 Socratic AI Tutor**: Step-by-step guidance on complex engineering equations, programming logic, and course concepts without spoiling answer keys.
3. 🎯 **Mapúa OBE Mastery**: Interactive drills mapped to Course Outcomes (**CO1 to CO4**) to prepare for departmental exams.
4. 📝 **MyMapua Administrative Guidance**: Assistance with overload petitions, prerequisite waivers, and Incomplete (INC) completion forms (FM-RO-19/20).

**Click any focus pillar above, browse the Academic Handbook, or ask a question below!**`
      : `Welcome, **${user.name}**! 💼 Welcome to the **Noodle Factory AI Platform** at Mapúa University!

I am your **Faculty Enablement & Pedagogy Specialist**, fully updated with the **Mapúa Academic Handbook (${MAPUA_ACADEMIC_HANDBOOK_YEAR})**. Here is how Noodle Factory optimizes your teaching:

1. 📚 **Knowledge Base Digitization**: Convert your course syllabi, lecture slides (PPT/PDF), and lab guides into an official 24/7 AI Teaching Assistant.
2. ⚖️ **Academic Policy & Generative AI Alignment**: Guidance on incorporating the **Mapúa Generative AI Policy (Part D Sec III)** into course syllabi and assignments.
3. 📊 **Automated Rubric Evaluation**: Instant criteria-based scoring and qualitative feedback on student lab reports and essays with full faculty moderation.
4. ⏳ **Reclaim Consultation Hours**: Offload up to 80%+ of repetitive student queries so your office hours focus on research and 1-on-1 mentoring.

**What feature or policy would you like to explore today? Click any pillar above, open the Academic Handbook, or ask a question below!**`;

    return {
      id: `welcome-${Date.now()}`,
      sender: "ai",
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }, [isStudent, user.name]);

  const createBlankConversation = useCallback(
    (customTitle?: string): Conversation => {
      const now = new Date().toISOString();
      return {
        id: `convo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userEmail: user.email,
        title: customTitle || "New Conversation",
        createdAt: now,
        updatedAt: now,
        role: user.role,
        messages: [createInitialWelcomeMessage()],
      };
    },
    [user.email, user.role, createInitialWelcomeMessage]
  );

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed: Conversation[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load local conversations", e);
    }
    return [createBlankConversation()];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    return conversations[0]?.id || "";
  });

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePillarId, setActivePillarId] = useState<string>(isStudent ? "socratic" : "kb");
  const [showFaq, setShowFaq] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get currently active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation ? activeConversation.messages : [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load conversations from server API on mount, merging with local
  useEffect(() => {
    async function fetchServerConversations() {
      try {
        const res = await fetch(`/api/conversations?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations) && data.conversations.length > 0) {
          setConversations(data.conversations);
          // If active ID is not in list, pick the first
          setActiveConversationId((currentId) => {
            const exists = data.conversations.some((c: Conversation) => c.id === currentId);
            return exists ? currentId : data.conversations[0].id;
          });
        }
      } catch (err) {
        console.warn("Could not sync with server conversations endpoint, using local cache:", err);
      }
    }
    fetchServerConversations();
  }, [user.email]);

  // Save conversations to localStorage and sync active convo to server
  const persistConversations = useCallback(
    (updatedList: Conversation[], activeConvoToSync?: Conversation) => {
      setConversations(updatedList);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(updatedList));
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }

      // Sync active conversation to backend
      if (activeConvoToSync) {
        fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation: activeConvoToSync }),
        }).catch((err) => console.warn("Failed to persist conversation to server:", err));
      }
    },
    [userStorageKey]
  );

  // 1. Handle New Chat Action
  const handleNewChat = () => {
    // Create new blank conversation
    const newConvo = createBlankConversation();
    const updatedList = [newConvo, ...conversations.filter((c) => c.id !== newConvo.id)];
    setActiveConversationId(newConvo.id);
    setInput("");
    persistConversations(updatedList, newConvo);
  };

  // 2. Handle Selecting a Conversation from History
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  // 3. Handle Renaming a Conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    const updatedList = conversations.map((c) => {
      if (c.id === id) {
        return { ...c, title: newTitle, updatedAt: new Date().toISOString() };
      }
      return c;
    });

    const targetConvo = updatedList.find((c) => c.id === id);
    persistConversations(updatedList, targetConvo);

    // Call server rename API
    fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, userEmail: user.email }),
    }).catch((err) => console.warn("Failed to update title on server:", err));
  };

  // 4. Handle Deleting a Conversation
  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);

    if (remaining.length === 0) {
      // If deleted the last one, create a fresh one
      const fresh = createBlankConversation();
      setConversations([fresh]);
      setActiveConversationId(fresh.id);
      persistConversations([fresh], fresh);
    } else {
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
      persistConversations(remaining);
    }

    // Call server delete API
    fetch(`/api/conversations/${id}?email=${encodeURIComponent(user.email)}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Failed to delete conversation from server:", err));
  };

  // 5. Handle Sending a Message
  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Calculate updated title if this is the first user message
    const isFirstUserMessage = activeConversation
      ? !activeConversation.messages.some((m) => m.sender === "user")
      : true;

    const updatedTitle =
      isFirstUserMessage && activeConversation?.title === "New Conversation"
        ? generateChatTitle(query)
        : activeConversation?.title || "New Conversation";

    const updatedMessages = [...(activeConversation?.messages || []), userMsg];
    const nowIso = new Date().toISOString();

    const updatedActiveConvo: Conversation = {
      ...(activeConversation || createBlankConversation()),
      title: updatedTitle,
      updatedAt: nowIso,
      messages: updatedMessages,
    };

    // Reorder so active convo is at top of history
    const updatedList = [
      updatedActiveConvo,
      ...conversations.filter((c) => c.id !== updatedActiveConvo.id),
    ];

    persistConversations(updatedList, updatedActiveConvo);

    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          role: user.role,
          user: {
            name: user.name,
            email: user.email,
            department: user.department,
            studentIdOrFacultyId: user.studentIdOrFacultyId,
          },
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: data.text,
        provider: data.provider || "Ollama API",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      const finalizedConvo: Conversation = {
        ...updatedActiveConvo,
        updatedAt: new Date().toISOString(),
        messages: finalMessages,
      };

      const finalList = [
        finalizedConvo,
        ...conversations.filter((c) => c.id !== finalizedConvo.id),
      ];

      persistConversations(finalList, finalizedConvo);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "ai",
        text: `⚠️ **System Note**: ${
          err.message || "Unable to reach Noodle AI server. Please verify your connection."
        }`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...updatedMessages, errorMsg];
      const finalizedConvo: Conversation = {
        ...updatedActiveConvo,
        updatedAt: new Date().toISOString(),
        messages: finalMessages,
      };

      const finalList = [
        finalizedConvo,
        ...conversations.filter((c) => c.id !== finalizedConvo.id),
      ];

      persistConversations(finalList, finalizedConvo);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentPillars = isStudent ? STUDENT_PILLARS : FACULTY_PILLARS;
  const currentFaqs = isStudent ? STUDENT_FAQS : FACULTY_FAQS;

  const studentPrompts = [
    "How does Noodle Factory's Socratic tutoring guide me without giving raw answers?",
    "Explain how to practice drills for Mapúa Course Outcomes (CO1 to CO4).",
    "How do I file a Units Overload and Prerequisite Waiver on MyMapua?",
    "Give me an effective 10-week Quarterm study schedule for engineering courses.",
    "What are the official steps to complete an Incomplete (INC) grade at Mapúa?",
    "How does Noodle AI help me review for departmental midterm examinations?",
  ];

  const facultyPrompts = [
    "How do I upload & digitize my syllabus into a Noodle AI Knowledge Base?",
    "How does automated rubric evaluation work for engineering lab reports & code?",
    "How can Noodle AI reduce my consultation hours while keeping students supported 24/7?",
    "How does Noodle Factory integrate with Blackboard LMS and track Mapúa OBE (CO1-CO4)?",
    "What is the faculty moderation workflow before AI grades are finalized?",
    "How to configure Socratic tutoring prompts so students don't get spoon-fed answers?",
  ];

  const currentPrompts = isStudent ? studentPrompts : facultyPrompts;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 flex gap-4 h-[calc(100vh-130px)] min-h-[620px]">
      
      {/* Handbook Knowledge Reference Modal */}
      <HandbookReferenceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectPrompt={(p) => handleSend(p)}
      />

      {/* 1. Chat History Sidebar Component */}
      <ChatHistorySidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        userRole={user.role}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#FAF8F5] rounded-3xl shadow-xl border border-[#E0D8C8] overflow-hidden relative">
        
        {/* Chat Header Bar (Eggshell White Theme) */}
        <div className="bg-[#FAF8F5] text-[#2C2723] px-4 sm:px-6 py-3 border-b border-[#E5DFD3] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            
            {/* Toggle Sidebar Button */}
            <button
              id="chat-toggle-sidebar-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EFE6] text-[#5C5346] hover:text-[#2C2723] transition cursor-pointer shrink-0 border border-[#DDD5C5] shadow-2xs"
              title={isSidebarOpen ? "Hide Chat History" : "Show Chat History"}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-[#800000] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <Bot className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-[#2C2723] truncate max-w-[180px] sm:max-w-[300px]">
                  {activeConversation?.title || "New Conversation"}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF2DE] text-[#7A4D05] border border-[#EAD5A8] shrink-0 hidden sm:inline-block font-semibold">
                  {isStudent ? "Student Mode" : "Faculty Mode"}
                </span>
              </div>
              <p className="text-[11px] text-[#6E6558] truncate flex items-center gap-1.5">
                <span>Noodle Factory</span>
                <span>•</span>
                <span className="text-[#800000] font-medium">Academic Handbook A.Y. 2026-2027</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Handbook & New Chat */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenModal}
              id="header-open-handbook-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDF2F2] hover:bg-[#FAE5E5] border border-[#E8C4C4] text-[#800000] text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Open Mapúa Academic Handbook 2026-2027 Explorer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Handbook Explorer</span>
            </button>

            <button
              onClick={handleNewChat}
              id="header-quick-new-chat-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800000] hover:bg-[#6b0000] text-[#FFFDF9] font-bold text-xs transition shadow-xs cursor-pointer border border-[#6d0000]"
              title="Start a new blank conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Learning Pillars Quick Exploration Ribbon */}
        <div className="bg-[#F4EFE6] border-b border-[#E5DFD3] px-4 py-2.5 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-bold text-[#6E6558] uppercase tracking-wider font-mono flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-[#B8860B]" />
              Focus Areas:
            </span>
            {currentPillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => {
                  setActivePillarId(pillar.id);
                  handleSend(pillar.prompt);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border ${
                  activePillarId === pillar.id
                    ? "bg-[#800000] text-[#FFFDF9] border-[#6d0000] shadow-xs"
                    : "bg-[#FFFFFF] text-[#3D362D] border-[#E0D8C8] hover:bg-[#FAF8F5] hover:border-[#C4B9A7]"
                }`}
              >
                <span>{pillar.title}</span>
                <span className="text-[10px] opacity-75 font-mono">({pillar.badge})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF8F5]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#3D362D] text-amber-200 border border-[#5C5346]"
                    : "bg-[#800000] text-amber-300 border border-amber-400/40"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-2xs border ${
                  msg.sender === "user"
                    ? "bg-[#800000] text-[#FFFDF9] border-[#6d0000] rounded-tr-xs"
                    : "bg-[#FFFFFF] text-[#2C2723] border-[#E5DFD3] rounded-tl-xs shadow-xs"
                }`}
              >
                {/* Header info in bubble */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold font-mono ${
                        msg.sender === "user" ? "text-amber-200" : "text-[#800000]"
                      }`}
                    >
                      {msg.sender === "user" ? user.name : isStudent ? "Noodle Learning Copilot" : "Noodle Faculty Copilot"}
                    </span>
                    {msg.sender === "ai" && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          msg.provider?.includes("ollama")
                            ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                            : "bg-[#FAF2DE] text-[#7A4D05] border border-[#EAD5A8]"
                        }`}
                        title={msg.provider?.includes("ollama") ? "Generated by Ollama Local AI" : "Generated by Gemini API Cloud"}
                      >
                        {msg.provider?.includes("ollama") ? "Ollama" : "Gemini API"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] ${
                        msg.sender === "user" ? "text-amber-200/70" : "text-[#8C8275]"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[#8C8275] hover:text-[#2C2723] p-0.5 rounded transition cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Content rendered cleanly */}
                <div className="font-sans text-xs sm:text-sm leading-relaxed space-y-2 break-words">
                  {msg.sender === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <div className="space-y-2 text-[#2C2723]">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-[#1F1C19]">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold text-[#800000] mt-3 mb-1.5">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold text-[#800000] mt-2.5 mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xs sm:text-sm font-bold text-[#2C2723] mt-2 mb-1">{children}</h3>,
                          code: ({ children, className }) => {
                            const isInline = !className?.includes("language-");
                            return isInline ? (
                              <code className="bg-[#FAF2DE] text-[#7A4D05] font-mono text-[11px] px-1.5 py-0.5 rounded border border-[#EAD5A8]">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-[#2C2723] text-[#FDFCF9] p-3 rounded-xl overflow-x-auto text-[11px] font-mono my-2 border border-[#453E37]">
                                <code>{children}</code>
                              </pre>
                            );
                          },
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-3 border-[#800000] pl-3 py-1 my-2 text-[#5C5346] italic bg-[#FAF2DE]/50 rounded-r-lg">
                              {children}
                            </blockquote>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full text-xs border border-[#E0D8C8] rounded-lg overflow-hidden">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="bg-[#F4EFE6] border-b border-[#E0D8C8] px-3 py-1.5 font-bold text-left text-[#2C2723]">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border-b border-[#EBE5DA] px-3 py-1.5 text-[#3D362D]">
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {msg.text}
                      </Markdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* AI Thinking Animation */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-[#800000] text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#B8860B] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#800000] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-[#B8860B] animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-[#6E6558] font-mono ml-2">
                  Consulting Noodle Factory & Mapúa OBE knowledge...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Handbook Quick Reference & Suggestions Pill Tray */}
        <div className="bg-[#FAF8F5] px-4 py-2 border-t border-[#E5DFD3] overflow-x-auto space-y-1.5">
          {/* Quick Handbook Index Pills */}
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={handleOpenModal}
              className="text-[11px] font-bold text-[#800000] hover:text-[#6b0000] bg-[#FDF2F2] hover:bg-[#FAE5E5] px-2.5 py-1 rounded-lg border border-[#E8C4C4] flex items-center gap-1 transition shrink-0 cursor-pointer"
              title="Browse full handbook reference"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Handbook Index:
            </button>
            <button
              onClick={() =>
                handleSend(
                  "Explain the Mapúa Academic Policy on Generative AI (Part D, Section III) and what attribution is required for student submissions."
                )
              }
              className="px-2.5 py-1 bg-[#FAF2DE] hover:bg-[#F5E6C4] text-[#7A4D05] rounded-lg text-[11px] font-medium border border-[#EAD5A8] transition cursor-pointer"
            >
              ⚖️ Generative AI Policy
            </button>
            <button
              onClick={() =>
                handleSend(
                  "What is the official Mapúa grading table (Part B, Section IV, Item 7) and the 70% and 80% passing percentage scale?"
                )
              }
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#FAF2DE] hover:text-[#7A4D05] text-[#3D362D] rounded-lg text-[11px] font-medium border border-[#E0D8C8] transition cursor-pointer"
            >
              📊 Grading & Honors Scale
            </button>
            <button
              onClick={() =>
                handleSend(
                  "What are the exact requirements to qualify for the Dean's List and President's List scholarship discounts at Mapúa?"
                )
              }
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#FAF2DE] hover:text-[#7A4D05] text-[#3D362D] rounded-lg text-[11px] font-medium border border-[#E0D8C8] transition cursor-pointer"
            >
              🏆 Dean's & President's List
            </button>
            <button
              onClick={() =>
                handleSend(
                  "Explain the 20% absence policy in Mapúa (Part B, Section IV) and how many absences result in an automatic 5.00 failure."
                )
              }
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#FAF2DE] hover:text-[#7A4D05] text-[#3D362D] rounded-lg text-[11px] font-medium border border-[#E0D8C8] transition cursor-pointer"
            >
              ⚠️ 20% Absence Rule
            </button>
            <button
              onClick={() =>
                handleSend(
                  "What are the rules and forms (FM-RO-19/20) for completing an Incomplete ('I') grade within two terms at Mapúa?"
                )
              }
              className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#FAF2DE] hover:text-[#7A4D05] text-[#3D362D] rounded-lg text-[11px] font-medium border border-[#E0D8C8] transition cursor-pointer"
            >
              📝 Incomplete ('I') Form
            </button>
          </div>

          {/* Socratic / Teaching Prompts Tray */}
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-bold text-[#8C8275] uppercase font-mono mr-1">
              Copilot Prompts:
            </span>
            {currentPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-0.5 bg-[#FFFFFF] hover:bg-[#F5F2EB] text-[#4A4237] rounded text-[10px] font-medium border border-[#E0D8C8] transition cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Toggle Bar */}
        <div className="bg-[#F4EFE6] border-t border-[#E5DFD3] px-4 py-1.5 flex items-center justify-between text-xs text-[#5C5346]">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="flex items-center gap-1.5 font-bold text-[#3D362D] hover:text-[#800000] transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Mapúa Academic Handbook ({MAPUA_ACADEMIC_HANDBOOK_YEAR}) Quick FAQ</span>
            {showFaq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleOpenModal}
            className="text-[11px] text-[#800000] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Browse All Handbook Sections</span>
          </button>
        </div>

        {/* Collapsible FAQ Drawer */}
        {showFaq && (
          <div className="bg-[#FAF2DE]/40 border-t border-[#E5DFD3] p-4 max-h-48 overflow-y-auto space-y-2 text-xs">
            {currentFaqs.map((faq, idx) => (
              <div key={idx} className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E0D8C8] shadow-2xs">
                <button
                  onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-[#2C2723] hover:text-[#800000] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {expandedFaqIndex === idx ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#8C8275]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C8275]" />
                  )}
                </button>
                {expandedFaqIndex === idx && (
                  <p className="mt-2 text-[#5C5346] leading-relaxed border-t border-[#EFECE3] pt-2">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#FAF8F5] border-t border-[#E5DFD3] flex items-center gap-2 shrink-0"
        >
          <div className="relative flex-1 flex items-center">
            <input
              id="noodle-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isStudent
                  ? "Ask about Mapúa AI policy, grading system, 20% absences, Socratic tutoring, petitions..."
                  : "Ask about digitizing syllabi, Mapúa AI policy in syllabus, rubric marking, ILMO lab rules..."
              }
              className="w-full bg-[#FFFFFF] border border-[#DDD5C5] focus:border-[#800000] focus:ring-1 focus:ring-[#800000] rounded-2xl pl-4 pr-12 py-3 text-xs sm:text-sm text-[#2C2723] placeholder:text-[#9E9484] focus:outline-hidden transition shadow-2xs"
            />
          </div>

          <button
            type="submit"
            id="noodle-chat-send-btn"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-[#800000] hover:bg-[#6b0000] text-[#FFFDF9] font-bold rounded-2xl shadow-xs border border-[#6d0000] flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
