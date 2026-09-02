"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@backend/contexts/AuthContext";
import {
  getSeenMessageIds,
  markMessageAsSeen,
  markAllMessagesAsSeen,
} from "@frontend/utils/messageTracker";
import {
  Envelope,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Warning,
  User,
  Phone,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle,
  PaperPlaneRight,
  X,
} from "@phosphor-icons/react";

type MessageDocument = {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  $createdAt: string;
};

export default function AdminMessagesPage() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MessageDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Reply Composer State
  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    setSeenIds(getSeenMessageIds());
  }, []);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.adminGetContacts();
      setMessages(res.messages || []);
      setSeenIds(getSeenMessageIds());
    } catch (err: any) {
      setError(formatApiError(err, "Could not load messages. Please check connection."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading || !isLoggedIn) return;
    fetchMessages();
  }, [fetchMessages, isAuthLoading, isLoggedIn]);

  // Keep selected message in sync if the messages list changes
  useEffect(() => {
    if (!selectedMessage) return;
    const updated = messages.find((m) => m.$id === selectedMessage.$id);
    if (!updated) {
      setSelectedMessage(null);
      setIsReplying(false);
    } else if (
      updated.name !== selectedMessage.name ||
      updated.email !== selectedMessage.email ||
      updated.phone !== selectedMessage.phone ||
      updated.subject !== selectedMessage.subject ||
      updated.message !== selectedMessage.message
    ) {
      setSelectedMessage(updated);
    }
  }, [messages, selectedMessage]);

  const handleSelectMessage = (msg: MessageDocument) => {
    setSelectedMessage(msg);
    setIsReplying(false);
    setReplySubject(`Re: ${msg.subject}`);
    setReplyMessage("");
    setReplySuccessMessage(null);
    setReplyError(null);
    markMessageAsSeen(msg.$id);
    setSeenIds((prev) => new Set([...prev, msg.$id]));
  };

  const handleStartReply = () => {
    if (!selectedMessage) return;
    setIsReplying(true);
    setReplySubject(`Re: ${selectedMessage.subject}`);
    setReplySuccessMessage(null);
    setReplyError(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;
    if (!replyMessage.trim()) {
      setReplyError("Please enter your reply message.");
      return;
    }

    setIsSendingReply(true);
    setReplyError(null);
    setReplySuccessMessage(null);
    try {
      const res = await api.adminReplyContact({
        to: selectedMessage.email,
        subject: replySubject.trim() || `Re: ${selectedMessage.subject}`,
        message: replyMessage.trim(),
        originalMessage: selectedMessage.message,
        recipientName: selectedMessage.name,
      });
      setReplySuccessMessage(res.message || "Reply sent successfully!");
      setReplyMessage("");
    } catch (err: any) {
      setReplyError(formatApiError(err, "Failed to send reply. Please try again."));
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = messages.map((m) => m.$id);
    markAllMessagesAsSeen(allIds);
    setSeenIds(new Set(allIds));
  };

  const handleDelete = async (msg: MessageDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the message from "${msg.name}"?`)) return;
    
    setDeletingId(msg.$id);
    try {
      await api.adminDeleteContact(msg.$id);
      setMessages((prev) => prev.filter((m) => m.$id !== msg.$id));
      if (selectedMessage?.$id === msg.$id) {
        setSelectedMessage(null);
        setIsReplying(false);
      }
    } catch {
      alert("Failed to delete message. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const query = search.toLowerCase();
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.message.toLowerCase().includes(query)
    );
  }, [messages, search]);

  const unseenCount = useMemo(() => {
    return messages.filter((m) => !seenIds.has(m.$id)).length;
  }, [messages, seenIds]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Split pane view logic
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Envelope size={28} className="text-[#14B8A6]" weight="duotone" />
            User Messages
            {unseenCount > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full border border-purple-200 ml-1">
                {unseenCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and respond to contact form inquiries submitted by users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unseenCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-200 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-all"
            >
              <CheckCircle size={16} weight="bold" />
              Mark all as read
            </button>
          )}
          <button
            onClick={fetchMessages}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <ArrowClockwise size={18} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Error Loading Messages</p>
            <p className="text-xs opacity-90 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Main content grid */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden flex min-h-0 shadow-sm">
        {/* Left list pane */}
        <div
          className={`w-full lg:w-96 border-r border-slate-200 flex flex-col min-h-0 flex-shrink-0 ${
            selectedMessage ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
                <p className="text-slate-400 text-xs font-semibold">Loading inbox...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6">
                <Envelope size={48} className="text-slate-200 mb-2" weight="duotone" />
                <p className="text-slate-700 font-bold text-sm">No messages found</p>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">
                  {search ? "Try adjusting your search terms." : "You have no contact form inquiries yet."}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.$id === msg.$id;
                const isUnseen = !seenIds.has(msg.$id);
                return (
                  <div
                    key={msg.$id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer transition-all flex flex-col gap-2 relative ${
                      isSelected
                        ? "bg-teal-50/40 border-l-4 border-l-[#14B8A6]"
                        : isUnseen
                        ? "bg-purple-50/30 border-l-4 border-l-purple-500 hover:bg-purple-50/50"
                        : "hover:bg-slate-50/70 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 text-sm truncate max-w-[180px] flex items-center gap-1.5">
                        {isUnseen && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 inline-block" />
                        )}
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                        {formatDate(msg.$createdAt).split(",")[0]}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 text-xs truncate">
                      {msg.subject}
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="flex justify-end gap-2 mt-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity lg:absolute lg:right-4 lg:bottom-4">
                      <button
                        onClick={(e) => handleDelete(msg, e)}
                        disabled={deletingId === msg.$id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Message"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right detail pane */}
        <div
          className={`flex-1 flex flex-col min-w-0 min-h-0 bg-white ${
            !selectedMessage ? "hidden lg:flex" : "flex"
          }`}
        >
          {selectedMessage ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Mobile Back Button */}
              <div className="p-4 border-b border-slate-100 flex items-center lg:hidden bg-slate-50">
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setIsReplying(false);
                  }}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
                >
                  <ArrowLeft size={18} />
                  Back to Inbox
                </button>
              </div>

              {/* Message Details Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#14B8A6] border border-teal-100 flex-shrink-0">
                    <User size={24} weight="duotone" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base leading-tight">
                      {selectedMessage.name}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <span className="text-slate-600 font-medium select-all">
                        {selectedMessage.email}
                      </span>
                      {selectedMessage.phone && (
                        <>
                          <span className="hidden sm:inline text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {selectedMessage.phone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {formatDate(selectedMessage.$createdAt)}
                  </span>
                </div>
              </div>

              {/* Message subject / action bar */}
              <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center gap-4">
                <h3 className="font-black text-slate-900 text-sm md:text-base leading-snug">
                  Subject: {selectedMessage.subject}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCopyText(selectedMessage.message, selectedMessage.$id)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                    title="Copy text"
                  >
                    {copiedId === selectedMessage.$id ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDelete(selectedMessage, e)}
                    disabled={deletingId === selectedMessage.$id}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                    title="Delete message"
                  >
                    <Trash size={18} />
                  </button>
                  <button
                    onClick={handleStartReply}
                    className="flex items-center gap-2 bg-[#1E293B] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm shadow-slate-200 cursor-pointer"
                  >
                    <PaperPlaneRight size={16} weight="fill" />
                    Reply
                  </button>
                </div>
              </div>

              {/* Message Content Area & Reply Box */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/10 space-y-6">
                <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-inner min-h-[14rem]">
                  <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Direct In-App Reply Box */}
                {isReplying && (
                  <div className="bg-white border border-teal-200 rounded-2xl p-6 shadow-md transition-all">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center font-bold">
                          <PaperPlaneRight size={18} weight="fill" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Direct Email Reply</h4>
                          <p className="text-xs text-slate-500">
                            Replying directly to{" "}
                            <span className="font-semibold text-slate-700">
                              {selectedMessage.email}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsReplying(false);
                          setReplyError(null);
                          setReplySuccessMessage(null);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Close reply box"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {replySuccessMessage && (
                      <div className="mb-4 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle size={18} className="text-teal-600 flex-shrink-0" weight="bold" />
                        <span>{replySuccessMessage}</span>
                      </div>
                    )}

                    {replyError && (
                      <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <Warning size={18} className="text-red-600 flex-shrink-0" />
                        <span>{replyError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSendReply} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          required
                          disabled={isSendingReply}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all disabled:bg-slate-50"
                          placeholder="Subject..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Reply Message
                        </label>
                        <textarea
                          rows={5}
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder={`Type your response to ${selectedMessage.name}...`}
                          required
                          disabled={isSendingReply}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all resize-y disabled:bg-slate-50"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <p className="text-[11px] text-slate-400">
                          Original message will be quoted in the email footer.
                        </p>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setIsReplying(false);
                              setReplyError(null);
                            }}
                            disabled={isSendingReply}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSendingReply || !replyMessage.trim()}
                            className="flex items-center gap-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          >
                            {isSendingReply ? (
                              <>
                                <ArrowClockwise size={14} className="animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <PaperPlaneRight size={14} weight="fill" />
                                Send Reply
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Envelope size={64} className="text-slate-200 mb-3" weight="duotone" />
              <h3 className="text-slate-700 font-black text-base">Select an inquiry</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                Click a message from the list on the left to read its full details and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

