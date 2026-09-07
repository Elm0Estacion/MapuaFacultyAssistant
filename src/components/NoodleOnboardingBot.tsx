import React, { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserProfile, ChatMessage, Conversation, PillarInfo } from "../types";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
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
} from "lucide-react";

interface NoodleOnboardingBotProps {
  user: UserProfile;
}

// Student Pillars Definition
const STUDENT_PILLARS: PillarInfo[] = [
  {
    id: "socratic",
    title: "1. Socratic AI Tutor",
    shortDesc: "Step-by-step guided problem solving for engineering formulas and code without giving away direct answers.",
    prompt: "How does Noodle Factory's Socratic tutoring help me understand engineering problems step-by-step without spoiling the answer keys?",
    iconName: "Compass",
    badge: "Active Learning",
    benefits: ["Guided hints", "Formula breakdown", "Conceptual understanding"],
  },
  {
    id: "obe",
    title: "2. OBE Outcome Mastery (CO1-CO4)",
    shortDesc: "Practice self-assessment drills mapped to Mapúa Course Outcomes (CO1 to CO4) before exam week.",
    prompt: "How can I use Noodle Factory to assess my mastery across Mapúa Course Outcomes CO1 (Knowledge), CO2 (Analysis), CO3 (Design), and CO4 (Application)?",
    iconName: "BarChart3",
    badge: "OBE Drills",
    benefits: ["Targeted quiz drills", "Skill gap diagnosis", "Bloom's taxonomy alignment"],
  },
  {
    id: "admin",
    title: "3. MyMapua Petition Guidance",
    shortDesc: "Step-by-step help with units overload, prerequisite waivers, and INC completion procedures.",
    prompt: "Give me step-by-step instructions on filing a units overload and prerequisite waiver petition in MyMapua, including a sample formal letter to the Dean.",
    iconName: "FileText",
    badge: "MyMapua Admin",
    benefits: ["Overload guidelines", "Prerequisite waiver templates", "INC completion flow"],
  },
  {
    id: "quarterm",
    title: "4. 10-Week Quarterm Strategies",
    shortDesc: "Accelerated review schedules and time management tailored for Mapúa's fast-paced Quarterm term.",
    prompt: "What are effective study and review strategies using Noodle Factory to survive and excel during Mapúa's fast 10-week Quarterm term?",
    iconName: "Clock",
    badge: "Quarterm Prep",
    benefits: ["Week-by-week pacing", "Midterm prep routines", "Active recall drills"],
  },
];

// Faculty Pillars Definition
const FACULTY_PILLARS: PillarInfo[] = [
  {
    id: "kb",
    title: "1. Knowledge Base Digitization",
    shortDesc: "Convert course syllabi, lecture slides (PPT/PDF), and lab manuals into 24/7 AI Teaching Assistants.",
    prompt: "How do I upload and digitize my course syllabus, lecture slides, and lab manuals into a Noodle Factory Knowledge Base?",
    iconName: "BookOpen",
    badge: "Teaching Assistant",
    benefits: ["Strict source grounding", "Multi-file ingestion", "Quarterm module organization"],
  },
  {
    id: "rubric",
    title: "2. Automated Rubric Grading",
    shortDesc: "Set up criteria-based rubrics for instant preliminary scoring & qualitative feedback on lab reports and essays.",
    prompt: "Explain how automated rubric grading works in Noodle Factory: how to configure criteria, scoring weights, and faculty moderation.",
    iconName: "Award",
    badge: "Evaluation Engine",
    benefits: ["Consistent grading criteria", "Constructive feedback", "Faculty final approval"],
  },
  {
    id: "consultation",
    title: "3. 24/7 Socratic Student Support",
    shortDesc: "Reclaim up to 80% of repetitive consultation office hours with Socratic tutoring that promotes deep thinking.",
    prompt: "How does Noodle Factory's Socratic AI help students problem-solve without giving away answers, and how does this reduce faculty consultation hours?",
    iconName: "Clock",
    badge: "Time Optimization",
    benefits: ["Zero spoiler answer keys", "24/7 student availability", "More time for research"],
  },
  {
    id: "obe-lms",
    title: "4. Mapúa OBE & LMS Sync",
    shortDesc: "Align assessments with Mapúa Course Outcomes (CO1-CO4) and sync with Blackboard LMS & MyMapua.",
    prompt: "How does Noodle Factory support Mapúa Outcome-Based Education (OBE) for CO1 to CO4, and how does it integrate with Blackboard LMS?",
    iconName: "BarChart3",
    badge: "OBE Analytics",
    benefits: ["CO1-CO4 attainment metrics", "Blackboard roster sync", "Early at-risk alerts"],
  },
];

// Student FAQs
const STUDENT_FAQS = [
  {
    question: "Can Noodle Factory solve my homework problem for me directly?",
    answer: "Noodle Factory uses a Socratic learning model. Instead of giving you the exact final answer or direct copy-paste solutions, it breaks down the underlying theorem, provides guiding questions, and checks your logic so you truly learn for your exams.",
  },
  {
    question: "How does Noodle Factory track Mapúa Course Outcomes (CO1 to CO4)?",
    answer: "Every quiz drill and question in your course knowledge base is tagged with specific outcomes: CO1 (Foundational Knowledge), CO2 (Problem Analysis), CO3 (Design & Algorithms), or CO4 (Practical Application & Ethics). This helps you pinpoint weak areas before departmental midterms.",
  },
  {
    question: "How do I file a Units Overload or Prerequisite Waiver petition on MyMapua?",
    answer: "Log into the MyMapua Portal > Student Services > Online Requests/Petitions. Select 'Units Overload' or 'Simultaneous Enrollment/Waiver', attach your curriculum checklist, state your justification, and submit for Department Chair and Dean approval.",
  },
  {
    question: "What is the policy for Incomplete (INC) completion at Mapúa?",
    answer: "Under the Mapúa Quarterm policy, you have a maximum of 1 academic year from the term the INC was received to complete all deficient requirements (exams, lab experiments, or final outputs) with your professor.",
  },
];

// Faculty FAQs
const FACULTY_FAQS = [
  {
    question: "Will the AI Teaching Assistant give away direct solutions to students?",
    answer: "No. Noodle Factory is built on Socratic Pedagogy. When students ask for homework solutions, the AI prompts them with guiding questions, reviews foundational theorems, and guides them step-by-step without disclosing final answer keys.",
  },
  {
    question: "How do I retain control over grades when using Automated Rubric Marking?",
    answer: "Faculty retain 100% moderation authority. The AI provides preliminary rubric scoring, qualitative commentary, and highlighted evidence from student submissions. You can review, adjust points, and approve grades before publishing to Blackboard LMS.",
  },
  {
    question: "What file formats can I upload to my Noodle Knowledge Base?",
    answer: "Noodle Factory supports PDF documents, PowerPoint presentations (.pptx), Word documents (.docx), Markdown, code files, and plain text syllabi.",
  },
  {
    question: "How does Noodle Factory assist with fast-paced 10-week Quarterms at Mapúa?",
    answer: "By handling repetitive questions 24/7 and providing immediate formative feedback, students master prerequisites faster, reducing failure rates and improving passing marks in Quarterm departmental exams.",
  },
];

export const NoodleOnboardingBot: React.FC<NoodleOnboardingBotProps> = ({ user }) => {
  const isStudent = user.role === "student";
  const userStorageKey = `mapua_convos_${user.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

  const createInitialWelcomeMessage = useCallback((): ChatMessage => {
    const welcomeText = isStudent
      ? `Hello **${user.name}**! 🎓 Welcome to the **Noodle Factory AI Platform** at Mapúa University!

I am your **AI Learning & Academic Success Copilot**. Here is how Noodle Factory empowers your studies:

1. 🤖 **24/7 Socratic AI Tutor**: Step-by-step guidance on complex engineering equations, programming logic, and course concepts without spoiling answer keys.
2. 🎯 **Mapúa OBE Mastery**: Interactive drills mapped to Course Outcomes (**CO1 to CO4**) to prepare for departmental exams.
3. 📝 **MyMapua Administrative Guidance**: Step-by-step help with units overload petitions, prerequisite waivers, and Incomplete (INC) completion.
4. ⚡ **Quarterm Survival Framework**: Accelerated study routines tailored to Mapúa's intensive 10-week terms.

**What would you like to explore today? Click any pillar above or ask a question below!**`
      : `Welcome, **${user.name}**! 💼 Welcome to the **Noodle Factory AI Platform** at Mapúa University!

I am your **Faculty Enablement & Pedagogy Specialist**. Here is how Noodle Factory optimizes your teaching and course management:

1. 📚 **Knowledge Base Digitization**: Convert your course syllabi, lecture slides (PPT/PDF), and lab guides into an official 24/7 AI Teaching Assistant.
2. ⚖️ **Automated Rubric Evaluation**: Instant criteria-based scoring and qualitative feedback on student lab reports and essays with full faculty moderation.
3. ⏳ **Reclaim Consultation Hours**: Offload up to 80%+ of repetitive student queries so your office hours focus on research and 1-on-1 thesis mentoring.
4. 📊 **Mapúa OBE & LMS Alignment**: Map course materials and assessments to Course Outcomes (**CO1-CO4**) with Blackboard LMS integration.

**What feature of Noodle Factory would you like to explore today? Click any pillar above or ask a question below!**`;

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
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden relative">
        
        {/* Chat Header Bar */}
        <div className="bg-zinc-900 text-white px-4 sm:px-6 py-3 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            
            {/* Toggle Sidebar Button */}
            <button
              id="chat-toggle-sidebar-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer shrink-0 border border-zinc-700"
              title={isSidebarOpen ? "Hide Chat History" : "Show Chat History"}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-[#800000] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <Bot className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[340px]">
                  {activeConversation?.title || "New Conversation"}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0 hidden sm:inline-block">
                  {isStudent ? "Student Mode" : "Faculty Mode"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Mapúa AI Curriculum Integration • Walter AI & OBE Engine
              </p>
            </div>
          </div>

          {/* Quick Header New Chat Button */}
          <button
            onClick={handleNewChat}
            id="header-quick-new-chat-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition shadow-xs cursor-pointer shrink-0"
            title="Start a new blank conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        {/* Learning Pillars Quick Exploration Ribbon */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2.5 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
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
                    ? "bg-[#800000] text-amber-200 border-amber-400/40 shadow-xs"
                    : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400"
                }`}
              >
                <span>{pillar.title}</span>
                <span className="text-[10px] opacity-75 font-mono">({pillar.badge})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-100/50">
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
                    ? "bg-zinc-800 text-amber-300 border border-zinc-700"
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
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm border ${
                  msg.sender === "user"
                    ? "bg-[#800000] text-amber-50 border-[#6d0000] rounded-tr-xs"
                    : "bg-white text-zinc-900 border-zinc-200/90 rounded-tl-xs"
                }`}
              >
                {/* Header info in bubble */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/5 text-[11px]">
                  <span
                    className={`font-bold font-mono ${
                      msg.sender === "user" ? "text-amber-200" : "text-[#800000]"
                    }`}
                  >
                    {msg.sender === "user" ? user.name : isStudent ? "Noodle Learning Copilot" : "Noodle Faculty Copilot"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] ${
                        msg.sender === "user" ? "text-amber-200/70" : "text-zinc-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition"
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
                    <div className="space-y-2 text-zinc-800">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-zinc-950">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold text-[#800000] mt-3 mb-1.5">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold text-[#800000] mt-2.5 mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xs sm:text-sm font-bold text-zinc-900 mt-2 mb-1">{children}</h3>,
                          code: ({ children, className }) => {
                            const isInline = !className?.includes("language-");
                            return isInline ? (
                              <code className="bg-amber-100/70 text-amber-950 font-mono text-[11px] px-1.5 py-0.5 rounded border border-amber-300/60">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-zinc-900 text-zinc-100 p-3 rounded-xl overflow-x-auto text-[11px] font-mono my-2 border border-zinc-800">
                                <code>{children}</code>
                              </pre>
                            );
                          },
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-3 border-amber-500 pl-3 py-1 my-2 text-zinc-600 italic bg-amber-50/60 rounded-r-lg">
                              {children}
                            </blockquote>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full text-xs border border-zinc-300 rounded-lg overflow-hidden">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="bg-zinc-100 border-b border-zinc-300 px-3 py-1.5 font-bold text-left text-zinc-800">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border-b border-zinc-200 px-3 py-1.5 text-zinc-700">
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
              <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-xs p-4 shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#800000] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-zinc-500 font-mono ml-2">
                  Consulting Noodle Factory & Mapúa OBE knowledge...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Tray */}
        <div className="bg-white px-4 py-2 border-t border-zinc-200 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-bold text-zinc-400 uppercase font-mono mr-1">
              Suggestions:
            </span>
            {currentPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 bg-zinc-100 hover:bg-amber-100 hover:text-amber-950 text-zinc-700 rounded-lg text-[11px] font-medium border border-zinc-200 transition cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Toggle Bar */}
        <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-1.5 flex items-center justify-between text-xs text-zinc-600">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="flex items-center gap-1.5 font-bold text-zinc-700 hover:text-[#800000] transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Mapúa University {isStudent ? "Student" : "Faculty"} FAQs & Guidelines</span>
            {showFaq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] text-zinc-400 font-mono">
            {isStudent ? "Quarterm & Socratic FAQ" : "Rubric & LMS Ingestion FAQ"}
          </span>
        </div>

        {/* Collapsible FAQ Drawer */}
        {showFaq && (
          <div className="bg-amber-50/40 border-t border-zinc-200 p-4 max-h-48 overflow-y-auto space-y-2 text-xs">
            {currentFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
                <button
                  onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-zinc-800 hover:text-[#800000]"
                >
                  <span>{faq.question}</span>
                  {expandedFaqIndex === idx ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </button>
                {expandedFaqIndex === idx && (
                  <p className="mt-2 text-zinc-600 leading-relaxed border-t border-zinc-100 pt-2">
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
          className="p-3 sm:p-4 bg-white border-t border-zinc-200 flex items-center gap-2 shrink-0"
        >
          <div className="relative flex-1 flex items-center">
            <input
              id="noodle-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isStudent
                  ? "Ask anything about Socratic tutoring, OBE Course Outcomes, MyMapua petitions..."
                  : "Ask about digitizing syllabi, automated rubric marking, Blackboard LMS sync..."
              }
              className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#800000] focus:ring-1 focus:ring-[#800000] rounded-2xl pl-4 pr-12 py-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            id="noodle-chat-send-btn"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-gradient-to-r from-[#800000] via-[#990000] to-[#b30000] hover:from-[#6d0000] hover:to-[#800000] text-amber-300 font-bold rounded-2xl shadow-md border border-amber-500/30 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
