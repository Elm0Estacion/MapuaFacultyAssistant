// Title generator from first user prompt
export function generateChatTitle(firstPrompt: string): string {
  if (!firstPrompt) return "New Conversation";

  const clean = firstPrompt
    .replace(/[^\w\s-]/g, "")
    .trim();

  const lower = clean.toLowerCase();

  if (lower.includes("create") && (lower.includes("agent") || lower.includes("ai"))) {
    return "Creating an AI Agent";
  }
  if (lower.includes("socratic") || lower.includes("tutor")) {
    return "Socratic Tutoring Guide";
  }
  if (lower.includes("rubric") || lower.includes("grading")) {
    return "Automated Rubric Evaluation";
  }
  if (lower.includes("obe") || lower.includes("co1") || lower.includes("course outcome")) {
    return "Mapúa OBE Outcome Mastery";
  }
  if (lower.includes("petition") || lower.includes("overload") || lower.includes("waiver") || lower.includes("inc")) {
    return "MyMapua Petitions & Requests";
  }
  if (lower.includes("quarterm") || lower.includes("10-week") || lower.includes("schedule")) {
    return "10-Week Quarterm Strategies";
  }
  if (lower.includes("knowledge") || lower.includes("syllabus") || lower.includes("digitiz")) {
    return "Knowledge Base Digitization";
  }
  if (lower.includes("blackboard") || lower.includes("lms")) {
    return "Blackboard LMS Integration";
  }
  if (lower.includes("distractor") || lower.includes("quiz") || lower.includes("question bank")) {
    return "Quiz & Question Bank Setup";
  }
  if (lower.includes("role play") || lower.includes("roleplay")) {
    return "Role Play Activity Setup";
  }

  // Capitalize first 4-6 words or 35 chars
  const words = clean.split(/\s+/).slice(0, 5);
  const truncated = words.join(" ");
  if (truncated.length > 0) {
    return truncated.charAt(0).toUpperCase() + truncated.slice(1);
  }

  return "General Inquiries";
}

// Group conversations by relative date
export function formatConversationDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  } catch {
    return "Recent";
  }
}
