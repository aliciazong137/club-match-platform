"use client";

import { useState, useRef, useEffect } from "react";
import { useWishlist } from "./WishlistContext";
import Link from "next/link";

interface ChatClub {
  id: number;
  name: string;
  logo: string;
  fee?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  clubs?: ChatClub[];
}

function parseAssistantReply(raw: string): { text: string; clubs: ChatClub[] } {
  try {
    const match = raw.match(/\{.*\}/s);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return { text: parsed.text || raw, clubs: parsed.clubs || [] };
    }
  } catch {}
  return { text: raw.replace(/[*#]/g, "").trim(), clubs: [] };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "wishlist">("wishlist");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "嗨！我是团团～告诉我你喜欢什么，我帮你找最合适的社团！", clubs: [] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { wishlist, removeFromWishlist, MAX_WISHLIST } = useWishlist();

  // Listen for #ai-chat hash to auto-open chat
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#ai-chat") {
        setOpen(true);
        setTab("chat");
        setBubbleDismissed(true);
        setShowBubble(false);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      const { text, clubs } = parseAssistantReply(data.reply);
      setMessages((prev) => [...prev, { role: "assistant", content: text, clubs }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "网络出了点问题，请稍后再试～" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "我喜欢编程",
    "想锻炼身体",
    "有什么文艺社团",
    "轻松不累的社团",
    "哪些社团要团费",
  ];

  const bubbleTips = [
    "不知道选哪个社团？问问我～",
    "我可以帮你推荐适合的社团",
    "不想盲选？先和 AI 聊聊",
    "3 分钟，帮你找到适合的社团",
    "想刷经历？我帮你找方向",
  ];
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    if (open || bubbleDismissed) return;
    const delay = setTimeout(() => {
      setBubbleText(bubbleTips[Math.floor(Math.random() * bubbleTips.length)]);
      setShowBubble(true);
    }, 2000);
    return () => clearTimeout(delay);
  }, [open, bubbleDismissed]);

  useEffect(() => {
    if (!showBubble) return;
    const hide = setTimeout(() => setShowBubble(false), 5000);
    return () => clearTimeout(hide);
  }, [showBubble]);

  return (
    <>
      {/* Floating bubble tip */}
      {showBubble && !open && (
        <div
          className="fixed bottom-24 right-6 z-50 animate-bounce-in cursor-pointer"
          onClick={() => { setShowBubble(false); setBubbleDismissed(true); setOpen(true); }}
        >
          <div className="relative bg-white rounded-2xl shadow-lg border border-[#f0f0f0] px-4 py-3 max-w-[220px]">
            <p className="text-sm text-[#444] leading-snug">{bubbleText}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); setBubbleDismissed(true); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-[#f0f0f0] rounded-full flex items-center justify-center text-[10px] text-[#999] hover:bg-[#ddd] transition"
            >
              x
            </button>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-[#f0f0f0] transform rotate-45" />
          </div>
        </div>
      )}

      {/* Float button */}
      <button
        onClick={() => { setOpen(!open); if (!open) { setShowBubble(false); setBubbleDismissed(true); } }}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 transition-all hover:scale-110 group ${!open && !bubbleDismissed ? "animate-pulse-soft" : ""}`}
        style={{ background: "linear-gradient(135deg, var(--pink), var(--purple))" }}
        title="小马助手 · 意向单"
      >
        {open ? (
          <span className="text-white text-xl">✕</span>
        ) : (
          <span className="relative">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Horse head */}
              <ellipse cx="45" cy="38" rx="22" ry="26" fill="white"/>
              <ellipse cx="45" cy="42" rx="18" ry="20" fill="#FFF5F5"/>
              {/* Ears */}
              <ellipse cx="33" cy="18" rx="5" ry="10" fill="white" transform="rotate(-15 33 18)"/>
              <ellipse cx="57" cy="18" rx="5" ry="10" fill="white" transform="rotate(15 57 18)"/>
              {/* Eyes */}
              <circle cx="38" cy="36" r="3" fill="#4A4A4A"/>
              <circle cx="52" cy="36" r="3" fill="#4A4A4A"/>
              <circle cx="39" cy="35" r="1" fill="white"/>
              <circle cx="53" cy="35" r="1" fill="white"/>
              {/* Mouth */}
              <path d="M40 48 Q45 52 50 48" stroke="#FFB5BA" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* Blush */}
              <circle cx="34" cy="44" r="4" fill="#FFB5BA" opacity="0.4"/>
              <circle cx="56" cy="44" r="4" fill="#FFB5BA" opacity="0.4"/>
              {/* Mane */}
              <path d="M30 14 Q25 22 28 30" stroke="#E6C6FF" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M34 12 Q28 20 30 28" stroke="#A8D8FF" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {/* Document/File in hand */}
              <rect x="62" y="52" width="22" height="28" rx="3" fill="white" stroke="#A8D8FF" strokeWidth="2"/>
              <line x1="67" y1="60" x2="79" y2="60" stroke="#E6C6FF" strokeWidth="2" strokeLinecap="round"/>
              <line x1="67" y1="65" x2="79" y2="65" stroke="#FFB5BA" strokeWidth="2" strokeLinecap="round"/>
              <line x1="67" y1="70" x2="75" y2="70" stroke="#B8E6B8" strokeWidth="2" strokeLinecap="round"/>
              {/* Hand holding doc */}
              <ellipse cx="62" cy="66" rx="5" ry="6" fill="#FFF5F5" stroke="white" strokeWidth="1"/>
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[32rem] macaron-card rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header with tabs */}
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, var(--pink), var(--purple))" }}>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="42" rx="20" ry="24" fill="white"/>
              <circle cx="42" cy="38" r="2.5" fill="#4A4A4A"/>
              <circle cx="58" cy="38" r="2.5" fill="#4A4A4A"/>
              <path d="M44 50 Q50 54 56 50" stroke="#FFB5BA" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-white font-semibold flex-1">小马助手</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTab("chat")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  tab === "chat" ? "bg-white/30 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                聊天
              </button>
              <button
                onClick={() => setTab("wishlist")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition relative ${
                  tab === "wishlist" ? "bg-white/30 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                意向单
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {tab === "chat" ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[var(--pink)] to-[var(--purple)] text-white rounded-br-md"
                            : "bg-[#F5F5F5] text-[var(--text)] rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                    {/* Club recommendation cards */}
                    {msg.clubs && msg.clubs.length > 0 && (
                      <div className="mt-2 space-y-1.5 ml-1">
                        {msg.clubs.map((club) => (
                          <div key={club.id} className="flex items-center gap-2 p-2.5 bg-white/80 rounded-xl border border-[#f0f0f0] shadow-sm">
                            <span className="text-lg">{club.logo}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-[var(--text)] block truncate">{club.name}</span>
                              {club.fee && <span className={`text-[10px] ${club.fee === "免费" ? "text-[#6CB46C]" : "text-[#F59E0B]"}`}>{club.fee}</span>}
                            </div>
                            <Link
                              href={`/clubs/${club.id}`}
                              className="text-[10px] px-2 py-1 rounded-full text-[var(--text-light)] border border-[#e0e0e0] hover:border-[var(--pink)] hover:text-[var(--pink)] transition"
                            >
                              详情
                            </Link>
                            <Link
                              href={`/apply/${club.id}`}
                              className="text-[10px] px-2.5 py-1 rounded-full text-white font-medium"
                              style={{ background: "linear-gradient(135deg, var(--pink), var(--purple))" }}
                            >
                              报名
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#F5F5F5] text-[var(--text-light)] px-3 py-2 rounded-2xl rounded-bl-md text-sm">
                      小马思考中...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="text-xs px-3 py-1.5 bg-[var(--pink)]/10 text-[var(--pink-deep)] rounded-full hover:bg-[var(--pink)]/20 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-3 border-t border-[#F0F0F0] flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="问问关于社团的问题..."
                  className="flex-1 px-3 py-2 border border-[var(--purple)]/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--pink)]/30 bg-white/70"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white transition disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, var(--pink), var(--purple))" }}
                >
                  发送
                </button>
              </div>
            </>
          ) : (
            /* Wishlist tab */
            <div className="flex-1 overflow-y-auto p-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-[var(--text-light)] text-sm mb-2">意向单还是空的</p>
                  <p className="text-[var(--text-lighter)] text-xs">浏览社团时点击「加入意向单」</p>
                  <p className="text-[var(--text-lighter)] text-xs">或完成智能匹配后添加</p>
                  <div className="mt-4 mx-6 px-3 py-2 bg-[#FFF8E1] rounded-lg border border-[#FFE082]">
                    <p className="text-xs text-[#F59E0B]">💡 每人最多报名 {MAX_WISHLIST} 个社团，精选最适合你的</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--text-light)]">
                      已添加 {wishlist.length}/{MAX_WISHLIST} 个社团
                    </p>
                    {wishlist.length >= MAX_WISHLIST && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#FFF8E1] text-[#F59E0B] rounded-full border border-[#FFE082]">已满</span>
                    )}
                  </div>
                  {wishlist.length < MAX_WISHLIST && (
                    <p className="text-[10px] text-[var(--text-lighter)]">💡 精挑细选，最多报名 {MAX_WISHLIST} 个哦</p>
                  )}
                  {wishlist.map((item) => (
                    <div key={item.clubId} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/60">
                      <span className="text-2xl">{item.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[var(--text)] truncate">{item.clubName}</div>
                        <div className="text-xs text-[var(--text-lighter)]">{item.category}</div>
                      </div>
                      <div className="flex gap-1.5">
                        <Link
                          href={`/apply/${item.clubId}`}
                          className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
                          style={{ background: "linear-gradient(135deg, var(--pink), var(--purple))" }}
                        >
                          报名
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item.clubId)}
                          className="text-xs px-2 py-1.5 rounded-full text-[var(--text-lighter)] hover:bg-red-50 hover:text-red-400 transition"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  ))}

                  {wishlist.length >= 2 && (
                    <Link
                      href="/compare"
                      className="block w-full text-center py-3 rounded-xl text-sm font-medium text-[var(--blue-deep)] bg-[var(--blue)]/10 hover:bg-[var(--blue)]/20 transition mt-4"
                    >
                      AI帮我比较这 {wishlist.length} 个社团
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
