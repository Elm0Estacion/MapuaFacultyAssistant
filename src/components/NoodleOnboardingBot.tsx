import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, FacultyPillarInfo } from "../types";
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
  Briefcase,
  Award,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  BarChart3,
  GraduationCap
} from "lucide-react";

const FACULTY_PILLARS: FacultyPillarInfo[] = [
  {
    id: "kb",
    title: "1. Knowledge Base Digitization",
    shortDesc: "Convert course syllabi, lecture slides (PPT/PDF), and lab manuals into 24/7 AI Teaching Assistants.",
    prompt: "How do I upload and digitize my course syllabus, lecture slides, and lab manuals into a Noodle Factory Knowledge Base?",
    iconName: "BookOpen",
    badge: "Teaching Assistant",
    benefits: ["Strict source grounding", "Multi-file ingestion", "Quarterm module organization"]
  },
  {
    id: "rubric",
    title: "2. Automated Rubric Grading",
    shortDesc: "Set up criteria-based rubrics for instant preliminary scoring & qualitative feedback on lab reports and essays.",
    prompt: "Explain how automated rubric grading works in Noodle Factory: how to configure criteria, scoring weights, and faculty moderation.",
    iconName: "Award",
    badge: "Evaluation Engine",
    benefits: ["Consistent grading criteria", "Constructive feedback", "Faculty final approval"]
  },
  {
    id: "socratic",
    title: "3. 24/7 Socratic Student Support",
    shortDesc: "Reclaim up to 80% of repetitive consultation office hours with Socratic tutoring that promotes deep thinking.",
    prompt: "How does Noodle Factory's Socratic AI help students problem-solve without giving away answers, and how does this reduce faculty consultation hours?",
    iconName: "Clock",
    badge: "Time Optimization",
    benefits: ["Zero spoiler answer keys", "24/7 student availability", "More time for research"]
  },
  {
    id: "obe",
    title: "4. Mapúa OBE & LMS Sync",
    shortDesc: "Align assessments with Mapúa Course Outcomes (CO1-CO4) and sync with Blackboard LMS & MyMapua.",
    prompt: "How does Noodle Factory support Mapúa Outcome-Based Education (OBE) for CO1 to CO4, and how does it integrate with Blackboard LMS?",
    iconName: "BarChart3",
    badge: "OBE Analytics",
    benefits: ["CO1-CO4 attainment metrics", "Blackboard roster sync", "Early at-risk alerts"]
  }
];

const FACULTY_FAQS = [
  {
    question: "Will the AI Teaching Assistant give away direct solutions to students?",
    answer: "No. Noodle Factory is built on Socratic Pedagogy. When students ask for homework or problem set solutions, the AI prompts them with guiding questions, reviews foundational theorems (e.g. boundary conditions or loop invariants), and guides them step-by-step without disclosing final answer keys."
  },
  {
    question: "How do I retain control over grades when using Automated Rubric Marking?",
    answer: "Faculty retain 100% moderation authority. The AI provides preliminary rubric scoring, qualitative commentary, and highlighted evidence from student submissions. You can review, adjust points, and approve grades with a single click before releasing them to Blackboard LMS."
  },
  {
    question: "What file formats can I upload to my Noodle Knowledge Base?",
    answer: "Noodle Factory supports PDF documents, PowerPoint slides (.pptx), Word documents (.docx), Markdown, code files, and plaintext syllabi. The engine indexes the content by topic and Course Outcome (CO)."
  },
  {
    question: "How does Noodle Factory assist with fast-paced 10-week Quarterms at Mapúa?",
    answer: "By answering repetitive questions 24/7 and providing immediate formative feedback on practice quizzes, students master prerequisites faster, reducing failure rates and improving passing marks in Quarterm departmental exams."
  }
];

const WELCOME_MESSAGE = `Welcome, Mapúa University Faculty Member! 💼 

I am your dedicated **Noodle Factory AI Faculty Enablement Specialist**. My role is to train and guide you through leveraging the Noodle Factory AI platform to streamline your academic workload and empower your students under Mapúa's Outcome-Based Education (OBE) system.

### Core Capabilities for Faculty:
1. 📚 **Knowledge Base Digitization**: Turn your syllabus, slides, and lab guides into an official 24/7 AI Teaching Assistant.
2. ⚖️ **Automated Rubric Evaluation**: Generate instant criteria-based marking and actionable feedback for lab reports, essays, and capstones with full faculty moderation.
3. ⏳ **Reclaiming Consultation Hours**: Offload repetitive student Q&A to the AI so your office hours can focus on research, capstone advising, and 1-on-1 mentorship.
4. 📊 **Mapúa OBE & LMS Alignment**: Map course materials and assessments to Course Outcomes (CO1 to CO4) and integrate with Blackboard LMS.

**How can I assist your teaching and course management today? Click a pillar above or ask any question below!**`;

export const NoodleOnboardingBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-faculty-1",
      sender: "ai",
      text: WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePillarId, setActivePillarId] = useState<string>("kb");
  const [showFaq, setShowFaq] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const facultyPrompts = [
    "How do I upload & digitize my syllabus into a Noodle AI Knowledge Base?",
    "How does automated rubric evaluation work for engineering lab reports & code?",
    "How can Noodle AI reduce my consultation hours while keeping students supported 24/7?",
    "How does Noodle Factory integrate with Blackboard LMS and track Mapúa OBE (CO1-CO4)?",
    "What is the faculty moderation workflow before AI grades are finalized?",
    "How to configure Socratic tutoring prompts so students don't get spoon-fed answers?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `⚠️ **System Note**: ${err.message || "Unable to reach Noodle AI server. Please verify GEMINI_API_KEY setting."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-[#800000] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-amber-400 text-zinc-950 rounded-2xl shadow-md shrink-0">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Faculty Pedagogy Hub
              </span>
              <span className="text-xs text-zinc-300">• Mapúa University</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Noodle Factory AI Faculty Enablement & Onboarding Copilot
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5 max-w-2xl leading-relaxed">
              Explore how Noodle Factory optimizes course management, automates preliminary grading, and digitizes your syllabus into a 24/7 AI Teaching Assistant.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFaq(!showFaq)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-amber-200 transition shrink-0 self-stretch sm:self-auto justify-center"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{showFaq ? "Hide Faculty FAQ" : "Faculty Quick FAQ"}</span>
          {showFaq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Faculty FAQ Section */}
      {showFaq && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-all">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Frequently Asked Questions by Mapúa Faculty
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Noodle Factory Knowledge Base</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {FACULTY_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-amber-50/50 transition cursor-pointer"
                onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-800">{faq.question}</span>
                  {expandedFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </div>
                {expandedFaqIndex === idx && (
                  <p className="text-xs text-zinc-600 mt-2.5 pt-2 border-t border-zinc-200/60 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Platform Pillars Interactive Matrix */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide font-mono">
              Noodle Factory Core Capabilities for Faculty
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Click any pillar to ask Noodle AI</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {FACULTY_PILLARS.map((pillar) => {
            const isActive = activePillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => {
                  setActivePillarId(pillar.id);
                  handleSend(pillar.prompt);
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 relative group ${
                  isActive
                    ? "bg-amber-50/80 border-[#800000] text-[#800000] shadow-sm ring-1 ring-[#800000]/20"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-700">
                      {pillar.badge}
                    </span>
                    {pillar.id === "kb" && <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />}
                    {pillar.id === "rubric" && <Award className="w-4 h-4 text-amber-600 shrink-0" />}
                    {pillar.id === "socratic" && <Clock className="w-4 h-4 text-amber-600 shrink-0" />}
                    {pillar.id === "obe" && <BarChart3 className="w-4 h-4 text-amber-600 shrink-0" />}
                  </div>
                  <h4 className="font-bold text-xs text-zinc-900 group-hover:text-[#800000] transition">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] font-normal text-zinc-600 mt-1 leading-relaxed">
                    {pillar.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Explore Workflow</span>
                  <span className="text-[#800000] font-bold">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Faculty AI Chat Box */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 sm:p-5 h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === "user"
                  ? "bg-zinc-900 text-amber-400 font-bold"
                  : "bg-gradient-to-br from-[#800000] to-[#a00000] text-amber-300"
              }`}
            >
              {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                msg.sender === "user"
                  ? "bg-[#800000] text-white rounded-tr-none"
                  : "bg-zinc-50 text-zinc-800 border border-zinc-200/90 rounded-tl-none"
              }`}
            >
              {/* Copy Button */}
              {msg.sender === "ai" && (
                <button
                  onClick={() => copyToClipboard(msg.id, msg.text)}
                  className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-zinc-600 rounded transition opacity-0 group-hover:opacity-100 bg-white/80"
                  title="Copy"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}

              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] mb-2 opacity-80 border-b pb-1.5 border-current/10">
                <span className="font-semibold flex items-center gap-1.5">
                  {msg.sender === "user" ? (
                    "Mapúa Faculty Member"
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-500 inline" />
                      Noodle Factory Faculty Enablement Agent
                    </>
                  )}
                </span>
                <span className="font-mono text-[10px]">{msg.timestamp}</span>
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm space-y-2">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center space-x-3 text-zinc-500 text-xs italic p-2 bg-amber-50/50 rounded-xl border border-amber-200/50">
            <div className="w-8 h-8 rounded-xl bg-[#800000]/10 text-[#800000] flex items-center justify-center animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-zinc-800">Noodle Factory AI is retrieving pedagogical & platform guidelines...</span>
              <span className="text-[11px] text-zinc-500 font-mono">Generating response via Gemini 3.6 Flash</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Faculty Prompts Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Recommended Topics for Faculty & Course Chairs:
          </span>
          <span className="text-[11px] text-zinc-400">Click any prompt to ask</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {facultyPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-amber-50 text-zinc-700 hover:text-[#800000] border border-zinc-200 hover:border-amber-400 px-3.5 py-2 rounded-xl shadow-2xs transition text-left flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="relative flex items-center bg-white border border-zinc-300 rounded-2xl shadow-sm p-2 focus-within:border-[#800000] focus-within:ring-2 focus-within:ring-[#800000]/20 transition">
        <textarea
          id="noodle-faculty-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask Noodle Factory AI about syllabus digitization, automated rubric grading, consultation hour optimization, or Blackboard LMS sync..."
          rows={2}
          className="w-full text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 bg-transparent resize-none focus:outline-none px-3 py-1"
        />
        <button
          id="noodle-faculty-send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="ml-2 px-5 py-3 bg-gradient-to-r from-[#800000] to-[#990000] hover:from-[#6d0000] hover:to-[#800000] text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition shrink-0"
        >
          <span>Ask Agent</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
