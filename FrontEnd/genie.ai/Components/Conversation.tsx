import React, { useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = "guest" | "assistant" | "staff";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
}

export interface GuestProfile {
  name: string;
  loyaltyTier: string;
  stays: number;
  totalSpend: string;
  avatarUrl?: string;
  online?: boolean;
  roomNumber: string;
  checkoutDate: string;
  reservationDates: string;
  roomFrom: string;
  roomTo: string;
  preferences: string[];
}

export interface AISuggestion {
  label: string;
  icon?: React.ReactNode;
}

export interface ConversationPanelProps {
  messages: Message[];
  guest: GuestProfile;
  aiSuggestions?: AISuggestion[];
  onSuggestionClick?: (suggestion: AISuggestion) => void;
  onGenerateOffer?: () => void;
  onViewHistory?: () => void;
  onViewFullProfile?: () => void;
  onSendMessage?: (text: string) => void;
  onSendFile?: (file: File) => void;
  onSendImage?: (file: File) => void;
  onSendAudio?: (file: File) => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconEmoji = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7.5" stroke="#94a3b8" strokeWidth="1.3"/>
    <circle cx="6.5" cy="7.5" r="1" fill="#94a3b8"/>
    <circle cx="11.5" cy="7.5" r="1" fill="#94a3b8"/>
    <path d="M6 11.5C6.5 13 11.5 13 12 11.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconImage = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="3.5" width="14" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.3"/>
    <circle cx="6.5" cy="7.5" r="1.5" stroke="#94a3b8" strokeWidth="1.2"/>
    <path d="M2 12L5.5 9L8.5 12L11.5 9.5L16 13" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconFile = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M10 2H4.5C3.67 2 3 2.67 3 3.5V14.5C3 15.33 3.67 16 4.5 16H13.5C14.33 16 15 15.33 15 14.5V7L10 2Z" stroke="#94a3b8" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M10 2V7H15" stroke="#94a3b8" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M6 10H12M6 12.5H10" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const IconAudio = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="6.5" y="2" width="5" height="9" rx="2.5" stroke="#94a3b8" strokeWidth="1.3"/>
    <path d="M3.5 9C3.5 12.04 6.19 14.5 9 14.5C11.81 14.5 14.5 12.04 14.5 9" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M9 14.5V16.5" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14 8L2 2L5 8L2 14L14 8Z" fill="white" strokeLinejoin="round"/>
  </svg>
);

// ─── Emoji Picker (simple grid) ───────────────────────────────────────────────

const EMOJIS = ["😊","😂","🙏","👍","❤️","🔥","✅","🎉","😍","🤝","👋","💯","😅","🙌","💪","🤔","😢","🎊","⭐","🏨"];

const EmojiPicker: React.FC<{ onSelect: (e: string) => void }> = ({ onSelect }) => (
  <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 100 }}>
    {EMOJIS.map((e) => (
      <button key={e} onClick={() => onSelect(e)} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "transparent", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        onMouseEnter={(ev) => (ev.currentTarget.style.background = "#f1f5f9")}
        onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
      >{e}</button>
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  guest,
  aiSuggestions = [],
  onSuggestionClick,
  onGenerateOffer,
  onViewHistory,
  onViewFullProfile,
  onSendMessage,
  onSendFile,
  onSendImage,
  onSendAudio,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const initials = guest.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage?.(inputValue.trim());
    setInputValue("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const iconBtn = (onClick: () => void, icon: React.ReactNode, title: string) => (
    <button title={title} onClick={onClick} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >{icon}</button>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet"/>

      {/* Hidden file inputs */}
      <input ref={imageRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) onSendImage?.(e.target.files[0]); e.target.value = ""; }}/>
      <input ref={fileRef} type="file" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) onSendFile?.(e.target.files[0]); e.target.value = ""; }}/>
      <input ref={audioRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) onSendAudio?.(e.target.files[0]); e.target.value = ""; }}/>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", overflow: "hidden" }}>

        {/* ── Chat Column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #e2e8f0", minWidth: 0 }}>

          {/* Header */}
          <div style={{ padding: "14px 20px", background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
                {guest.avatarUrl
                  ? <img src={guest.avatarUrl} alt={guest.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}/>
                  : <span style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{initials}</span>
                }
                <span style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: guest.online ? "#22c55e" : "#94a3b8", border: "1.5px solid #fff" }}/>
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", letterSpacing: "-0.01em" }}>{guest.name}</div>
                <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 1 }}>Room {guest.roomNumber} · Check-out {guest.checkoutDate}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={onViewHistory} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5C3.74 1.5 1.5 3.74 1.5 6.5C1.5 9.26 3.74 11.5 6.5 11.5" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/><path d="M6.5 3.5V6.5L8 8" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 1L11.5 1L11.5 3.5" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                History
              </button>
              <button onClick={onGenerateOffer} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8 4.5L11.5 5.5L9 8L9.5 12L6.5 10.5L3.5 12L4 8L1.5 5.5L5 4.5L6.5 1Z" fill="white"/></svg>
                Generate Offer
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column" }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1", fontSize: 13, fontWeight: 500 }}>No messages yet</div>
            ) : messages.map((msg) => {
              if (msg.role === "assistant") return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                  <div style={{ maxWidth: "78%", background: "linear-gradient(135deg,#f8f7ff,#f0effe)", border: "1px solid #e0d9fd", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", boxShadow: "0 1px 4px rgba(99,102,241,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 4, background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L6.2 3.8L9 4.5L7 6.5L7.5 9.5L5 8L2.5 9.5L3 6.5L1 4.5L3.8 3.8L5 1Z" fill="white"/></svg>
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Assistant Response</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#334155" }}>{msg.content}</p>
                  </div>
                </div>
              );
              if (msg.role === "guest") return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
                  <div style={{ maxWidth: "78%" }}>
                    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px 4px 16px 16px", padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#1e293b" }}>{msg.content}</p>
                    </div>
                    {msg.timestamp && <p style={{ margin: "4px 4px 0 0", textAlign: "right" as const, fontSize: 10.5, color: "#94a3b8" }}>{msg.timestamp}</p>}
                  </div>
                  <span style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, marginBottom: msg.timestamp ? 20 : 0 }}>{initials}</span>
                </div>
              );
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <div style={{ maxWidth: "78%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "16px 4px 16px 16px", padding: "14px 18px", boxShadow: "0 2px 8px rgba(99,102,241,0.25)" }}>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#fff" }}>{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div style={{ padding: "10px 20px 10px", background: "#fff", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, flexShrink: 0 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em", textTransform: "uppercase" as const, display: "flex", alignItems: "center", gap: 4, marginRight: 4 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L6.2 3.8L9 4.5L7 6.5L7.5 9.5L5 8L2.5 9.5L3 6.5L1 4.5L3.8 3.8L5 1Z" fill="#6366f1"/></svg>
                AI Suggested
              </span>
              {aiSuggestions.map((s, i) => (
                <button key={i} onClick={() => onSuggestionClick?.(s)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 13px", borderRadius: 20, border: "1.5px solid #e0d9fd", background: "#faf9ff", color: "#4338ca", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" as const }}>
                  {s.icon}{s.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Input Bar ── */}
          <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "10px 16px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "8px 10px 8px 14px", transition: "border-color 0.15s" }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = "#a5b4fc")}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              {/* Attachment icons */}
              <div style={{ display: "flex", alignItems: "center", gap: 2, paddingBottom: 2, position: "relative" }}>
                {/* Emoji */}
                <div style={{ position: "relative" }}>
                  {iconBtn(() => setShowEmoji((v) => !v), <IconEmoji/>, "Emoji")}
                  {showEmoji && <EmojiPicker onSelect={(e) => { setInputValue((v) => v + e); setShowEmoji(false); }}/>}
                </div>
                {iconBtn(() => imageRef.current?.click(), <IconImage/>, "Send image")}
                {iconBtn(() => fileRef.current?.click(), <IconFile/>, "Send file")}
                {iconBtn(() => audioRef.current?.click(), <IconAudio/>, "Send audio")}
                {/* Divider */}
                <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 4px" }}/>
              </div>

              {/* Textarea */}
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Write a message or use AI suggestions..."
                rows={1}
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", resize: "none", fontSize: 13.5, color: "#1e293b", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, maxHeight: 120, overflowY: "auto", paddingTop: 2 }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: inputValue.trim() ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#e2e8f0", color: "#fff", cursor: inputValue.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: inputValue.trim() ? "0 2px 8px rgba(99,102,241,0.3)" : "none" }}
              >
                <IconSend/>
              </button>
            </div>

            {/* Status row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 7, paddingLeft: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#22c55e", fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}/>
                  AI Concierge Active
                </span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>Auto-reply in 5m</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>● Staff Typing…</span>
            </div>
          </div>
        </div>

        {/* ── Guest Profile Sidebar (reduced to 220px) ── */}
        <div style={{ width: 220, flexShrink: 0, background: "#fff", overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column" }}>

          <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Guest Profile</p>

          <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 2 }}>{guest.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 14 }}>
            Loyalty Tier: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{guest.loyaltyTier}</span>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 18 }}>
            {[{ label: "Stays", value: String(guest.stays) }, { label: "Spend", value: guest.totalSpend }].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", padding: "10px 12px" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{stat.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: stat.label === "Spend" ? "#6366f1" : "#0f172a", letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", marginTop: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Reservation</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {[
              { icon: <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="1.5" stroke="#64748b" strokeWidth="1.2"/><path d="M4 1V3M9 1V3M1 5H12" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round"/></svg>, label: "Dates", value: guest.reservationDates },
              { icon: <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="2" stroke="#64748b" strokeWidth="1.2"/><path d="M4 6.5H9M6.5 4L9 6.5L6.5 9" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "Room", value: `${guest.roomFrom} → ${guest.roomTo}` },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginTop: 1 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Preferences</p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginBottom: 20 }}>
            {guest.preferences.map((pref) => {
              const isAllergy = pref.toLowerCase().includes("allerg");
              return (
                <span key={pref} style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: isAllergy ? "#fef3c7" : "#f1f5f9", color: isAllergy ? "#92400e" : "#475569", border: `1px solid ${isAllergy ? "#fde68a" : "#e2e8f0"}` }}>
                  {isAllergy ? `⚠ ${pref}` : pref}
                </span>
              );
            })}
          </div>

          <button onClick={onViewFullProfile} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "9px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "auto" }}>
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M6.5 1C4.01 1 2 3.01 2 5.5C2 7.99 4.01 10 6.5 10C8.99 10 11 7.99 11 5.5C11 3.01 8.99 1 6.5 1Z" stroke="#64748b" strokeWidth="1.2"/><path d="M3 11.5C3.5 10.5 5 9.5 6.5 9.5C8 9.5 9.5 10.5 10 11.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Full Guest Profile
          </button>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        textarea::placeholder { color: #94a3b8; }
      `}</style>
    </>
  );
};

export default ConversationPanel;
