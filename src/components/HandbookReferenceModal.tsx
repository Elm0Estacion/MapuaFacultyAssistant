import React, { useState, useMemo } from "react";
import {
  MAPUA_HANDBOOK_SECTIONS,
  MAPUA_ACADEMIC_HANDBOOK_YEAR,
  HandbookSection,
} from "../data/mapuaHandbookData";
import {
  BookOpen,
  Search,
  X,
  Sparkles,
  Award,
  ShieldAlert,
  GraduationCap,
  Building,
  History,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

interface HandbookReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const HandbookReferenceModal: React.FC<HandbookReferenceModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSectionId, setActiveSectionId] = useState<string>(
    MAPUA_HANDBOOK_SECTIONS[0].id
  );

  const categories = [
    "All",
    "AI Policy",
    "Grading & Honors",
    "Academics",
    "Admissions & Shifting",
    "Student Life & Discipline",
    "Services & Facilities",
    "History & Identity",
  ];

  const filteredSections = useMemo(() => {
    return MAPUA_HANDBOOK_SECTIONS.filter((sec) => {
      const matchesCat =
        selectedCategory === "All" || sec.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.sectionNumber.toLowerCase().includes(q) ||
        sec.keyPoints.some((k) => k.toLowerCase().includes(q)) ||
        sec.referenceText.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeSection = useMemo(() => {
    return (
      MAPUA_HANDBOOK_SECTIONS.find((s) => s.id === activeSectionId) ||
      filteredSections[0] ||
      MAPUA_HANDBOOK_SECTIONS[0]
    );
  }, [activeSectionId, filteredSections]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI Policy":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "Grading & Honors":
        return <Award className="w-4 h-4 text-emerald-500" />;
      case "Student Life & Discipline":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "Admissions & Shifting":
      case "Academics":
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case "Services & Facilities":
        return <Building className="w-4 h-4 text-blue-500" />;
      case "History & Identity":
      default:
        return <History className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div
      id="handbook-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="handbook-modal-container"
        className="relative w-full max-w-5xl h-[90vh] bg-[#FAF8F5] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E0D8C8]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5DFD3] bg-[#800000] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <BookOpen className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">
                  Mapúa Academic Handbook Knowledge Reference
                </h2>
                <span className="bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs px-2 py-0.5 rounded-full font-medium">
                  {MAPUA_ACADEMIC_HANDBOOK_YEAR}
                </span>
              </div>
              <p className="text-xs text-red-100/90">
                Official institutional guidelines, AI policy, grading system, scholarships, & student regulations
              </p>
            </div>
          </div>
          <button
            id="close-handbook-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Handbook Explorer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-[#E5DFD3] bg-[#F4EFE6] flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
            <input
              type="text"
              placeholder="Search policies (e.g. AI, 20% absence, Dean's List)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#FFFFFF] border border-[#DDD5C5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#800000] focus:border-[#800000] text-[#2C2723] placeholder:text-[#9E9484] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8275] hover:text-[#2C2723] text-xs bg-[#EFECE3] hover:bg-[#E0D8C8] rounded px-1.5 py-0.5 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#800000] text-[#FFFDF9] shadow-xs"
                    : "bg-[#FFFFFF] text-[#4A4237] hover:bg-[#FAF8F5] border border-[#DDD5C5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout: Sidebar List + Detail Panel */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left List of Sections */}
          <div className="w-full md:w-80 border-r border-[#E5DFD3] overflow-y-auto bg-[#F7F3EB] p-2 space-y-1.5 shrink-0">
            {filteredSections.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#8C8275]">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-[#C4B9A7]" />
                No handbook sections match your search.
              </div>
            ) : (
              filteredSections.map((sec) => {
                const isSelected = sec.id === activeSection.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-[#FFFFFF] border-[#800000] shadow-md ring-1 ring-[#800000]/20"
                        : "bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] border-[#E0D8C8] hover:border-[#C4B9A7] shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold tracking-wider text-[#800000] uppercase font-mono">
                        {sec.sectionNumber}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#6E6558]">
                        {getCategoryIcon(sec.category)}
                        <span>{sec.category}</span>
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-[#2C2723] line-clamp-2 leading-snug">
                      {sec.title}
                    </h3>
                    <p className="text-[11px] text-[#6E6558] mt-1 line-clamp-1">
                      {sec.summary}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Detailed Section View */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5] flex flex-col justify-between">
            <div>
              {/* Header Details */}
              <div className="border-b border-[#E5DFD3] pb-4 mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#800000] uppercase tracking-wider mb-1 font-mono">
                  <span>{activeSection.part}</span>
                  <span>•</span>
                  <span>{activeSection.sectionNumber}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#1F1C19] tracking-tight">
                  {activeSection.title}
                </h2>
                <p className="text-sm text-[#5C5346] mt-1">
                  {activeSection.summary}
                </p>
              </div>

              {/* Key Points */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#2C2723] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Key Policy Highlights & Guidelines
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeSection.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FFFFFF] border border-[#E0D8C8] rounded-xl text-xs text-[#3D362D] leading-relaxed flex items-start space-x-2.5 shadow-2xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#FAF2DE] text-[#7A4D05] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5 border border-[#EAD5A8]">
                        {idx + 1}
                      </div>
                      <div className="flex-1 font-medium">{point}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handbook Excerpt Text */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#2C2723] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#800000]" />
                  Authoritative Handbook Excerpt
                </h3>
                <div className="p-4 bg-[#FAF2DE]/50 border border-[#EAD5A8] rounded-xl text-xs text-[#2C2723] font-mono whitespace-pre-wrap leading-relaxed">
                  {activeSection.referenceText}
                </div>
              </div>
            </div>

            {/* Bottom Action Card: Prompt with AI */}
            <div className="pt-4 border-t border-[#E5DFD3] bg-[#FFFFFF] p-4 rounded-2xl border border-[#E0D8C8] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-[#800000] text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F1C19]">
                    Ask Noodle Factory AI About This Policy
                  </h4>
                  <p className="text-[11px] text-[#6E6558] line-clamp-1">
                    "{activeSection.samplePrompt}"
                  </p>
                </div>
              </div>
              <button
                id="ask-handbook-ai-btn"
                onClick={() => {
                  onSelectPrompt(activeSection.samplePrompt);
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#800000] hover:bg-[#6b0000] text-[#FFFDF9] text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer border border-[#6d0000] shrink-0"
              >
                <span>Ask AI Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
