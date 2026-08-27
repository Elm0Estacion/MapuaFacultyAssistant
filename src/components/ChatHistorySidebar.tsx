import React, { useState } from "react";
import { Conversation, UserRole } from "../types";
import { formatConversationDate } from "../utils/chatUtils";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  Briefcase,
} from "lucide-react";

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  userRole: UserRole;
  isOpen: boolean;
  onToggle: () => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  conversations,
  activeConversationId,
  userRole,
  isOpen,
  onToggle,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isStudent = userRole === "student";

  // Filter conversations by search term
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const startEditing = (convo: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(convo.id);
    setEditTitle(convo.title);
  };

  const saveEditing = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const promptDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = (id: string) => {
    onDeleteConversation(id);
    setDeleteConfirmId(null);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col bg-[#FAF8F5] text-stone-800 border-r lg:border border-stone-200/90 lg:rounded-3xl transition-all duration-300 ease-in-out ${
          isOpen ? "w-72 sm:w-80 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-0"
        } h-full shadow-xl select-none overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-stone-200/80 flex items-center justify-between gap-2 bg-[#F3EFEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#800000] to-[#b30000] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xs">
              {isStudent ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-xs font-bold text-stone-900 tracking-wide uppercase font-mono">
                {isStudent ? "Student Workspace" : "Faculty Workspace"}
              </h2>
              <span className="text-[10px] text-stone-500 font-sans block">Chat History & Logs</span>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Action: + New Chat Button */}
        <div className="p-3.5 pb-2 bg-[#FAF8F5]">
          <button
            id="sidebar-new-chat-btn"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onToggle();
            }}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#800000] via-[#990000] to-[#b30000] hover:from-[#6d0000] hover:to-[#800000] text-amber-300 font-bold text-xs rounded-xl shadow-md border border-amber-500/30 flex items-center justify-center gap-2 transition transform active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Chat</span>
          </button>
        </div>

        {/* Search Filter if more than 3 chats */}
        {conversations.length > 2 && (
          <div className="px-3.5 py-1.5 bg-[#FAF8F5]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Label */}
        <div className="px-4 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-mono text-stone-500 uppercase tracking-wider bg-[#FAF8F5]">
          <span className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3 h-3 text-[#800000]" />
            Chat History ({conversations.length})
          </span>
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-1.5 scrollbar-thin scrollbar-thumb-stone-300 bg-[#FAF8F5]">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-stone-500 space-y-2 mt-4">
              <MessageSquare className="w-6 h-6 mx-auto opacity-40 text-[#800000]" />
              <p className="text-xs font-medium">No previous chats yet.</p>
              <p className="text-[11px] text-stone-400">
                Start typing to begin your first conversation!
              </p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-stone-500 text-xs">
              No conversations match "{searchQuery}"
            </div>
          ) : (
            filteredConversations.map((convo) => {
              const isActive = convo.id === activeConversationId;
              const isEditing = editingId === convo.id;
              const userMessageCount = convo.messages.filter((m) => m.sender === "user").length;

              return (
                <div
                  key={convo.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectConversation(convo.id);
                      if (window.innerWidth < 1024) onToggle();
                    }
                  }}
                  className={`group relative rounded-xl p-2.5 text-xs transition flex flex-col gap-1 cursor-pointer border ${
                    isActive
                      ? "bg-[#FFF8EB] border-amber-500 text-stone-900 shadow-xs ring-1 ring-amber-400/40"
                      : "bg-white/80 border-stone-200/90 text-stone-700 hover:bg-white hover:text-stone-950 hover:border-stone-300 hover:shadow-xs"
                  }`}
                >
                  {isEditing ? (
                    // Inline Rename Form
                    <form
                      onSubmit={(e) => saveEditing(convo.id, e)}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-white border border-[#800000] rounded-lg px-2 py-1 text-xs text-stone-900 focus:outline-none ring-1 ring-[#800000]"
                      />
                      <button
                        type="button"
                        onClick={(e) => saveEditing(convo.id, e)}
                        className="p-1 rounded hover:bg-emerald-100 text-emerald-700"
                        title="Save title"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 hover:text-stone-800"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    // Standard Row
                    <>
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? "text-[#800000]" : "text-stone-400 group-hover:text-stone-600"
                            }`}
                          />
                          <span
                            className={`font-semibold truncate text-xs ${
                              isActive ? "text-[#800000] font-bold" : "text-stone-800 group-hover:text-stone-950"
                            }`}
                            title={convo.title}
                          >
                            {convo.title}
                          </span>
                        </div>

                        {/* Action buttons (Rename / Delete) visible on hover or when active */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={(e) => startEditing(convo, e)}
                            className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700"
                            title="Rename chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => promptDelete(convo.id, e)}
                            className="p-1 rounded hover:bg-red-100 text-stone-400 hover:text-red-600"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Footer Info: Time & Message Count */}
                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pl-5.5">
                        <span>{formatConversationDate(convo.updatedAt)}</span>
                        <span className="text-stone-400">
                          {userMessageCount} {userMessageCount === 1 ? "query" : "queries"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Indicator */}
        <div className="p-3 border-t border-stone-200/90 bg-[#F3EFEA] text-[11px] text-stone-600 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sync: Persistent
          </span>
          <span className="text-stone-500 font-medium">{isStudent ? "Mapúa Student" : "Mapúa Faculty"}</span>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-[#FAF8F5] border border-stone-300 rounded-2xl p-5 shadow-2xl space-y-4 text-stone-900">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-950">Delete this conversation?</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  This action cannot be undone. All messages associated with this chat will be
                  permanently deleted.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-200/70 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md transition cursor-pointer"
              >
                Yes, Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
