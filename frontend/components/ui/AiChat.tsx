"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Loader2, Bot, Minimize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiChatProps {
  // Optional context from current page
  lessonTitle?: string;
  lessonType?: string;
  courseTitle?: string;
  pageContext?: string; // e.g. "courses", "dashboard", "lesson"
}

const SYSTEM_PROMPT = `Ты — AI-помощник образовательной платформы AviationEnglish.kz.

Платформа обучает авиационному английскому языку по стандартам ICAO для пилотов, авиадиспетчеров и курсантов.

Ты помогаешь студентам:
- Объяснять термины и фразы авиационного английского
- Разбирать правила ICAO фразеологии
- Отвечать на вопросы по уроку
- Помогать с произношением и значением слов
- Объяснять разницу между похожими командами (Roger vs Wilco, Mayday vs Pan-Pan)

Правила общения:
- Отвечай кратко и по существу
- Используй русский язык по умолчанию
- Авиационные термины пиши на английском с переводом
- Если вопрос не связан с авиационным английским — вежливо направь обратно к теме
- Максимум 3-4 предложения на ответ если не просят подробнее`;

export function AiChat({ lessonTitle, lessonType, courseTitle, pageContext }: AiChatProps) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [minimized,setMinimized]= useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open, minimized]);

  // Build context-aware system prompt
  const buildSystemPrompt = () => {
    let ctx = SYSTEM_PROMPT;
    if (lessonTitle) ctx += `\n\nТекущий урок: "${lessonTitle}"`;
    if (lessonType)  ctx += ` (тип: ${lessonType})`;
    if (courseTitle) ctx += `\nКурс: "${courseTitle}"`;
    if (pageContext) ctx += `\nСтраница: ${pageContext}`;
    return ctx;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(),
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const reply = data.text ?? data.error ?? "Извините, не удалось получить ответ.";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Ошибка соединения. Попробуйте ещё раз.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setOpen(true);
    setMinimized(false);
    // Welcome message on first open
    if (messages.length === 0) {
      const welcomeCtx = lessonTitle
        ? `Привет! Я помогу разобраться с уроком **"${lessonTitle}"**. Задай любой вопрос по авиационному английскому! ✈️`
        : "Привет! Я AI-помощник по авиационному английскому. Задай любой вопрос по терминологии ICAO, фразеологии или урокам! ✈️";
      setMessages([{ role: "assistant", content: welcomeCtx }]);
    }
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: 88,
          right: 24,
          width: 360,
          height: minimized ? 56 : 500,
          background: "var(--color-background-primary, #fff)",
          border: "1px solid var(--color-border-secondary, rgba(0,0,0,0.1))",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1000,
          transition: "height 0.2s ease",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px",
            background: "var(--color-background-primary)",
            borderBottom: minimized ? "none" : "1px solid var(--color-border-tertiary)",
            flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--color-primary, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                AI Помощник
              </div>
              {lessonTitle && !minimized && (
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lessonTitle}
                </div>
              )}
            </div>
            <button onClick={() => setMinimized(!minimized)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-tertiary)", display: "flex" }}>
              <Minimize2 size={15} />
            </button>
            <button onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-tertiary)", display: "flex" }}>
              <X size={15} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "12px 14px",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      maxWidth: "82%",
                      padding: "8px 12px",
                      borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      background: msg.role === "user"
                        ? "var(--color-primary, #3B82F6)"
                        : "var(--color-background-secondary, #F5F5F5)",
                      color: msg.role === "user"
                        ? "white"
                        : "var(--color-text-primary)",
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}>
                      {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{
                      padding: "8px 14px",
                      borderRadius: "12px 12px 12px 4px",
                      background: "var(--color-background-secondary, #F5F5F5)",
                      display: "flex", gap: 4, alignItems: "center",
                    }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--color-text-tertiary, #aaa)",
                          animation: "bounce 1.2s ease infinite",
                          animationDelay: `${i * 0.2}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Quick prompts (only when no messages beyond welcome) */}
              {messages.length <= 1 && (
                <div style={{ padding: "0 14px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    lessonTitle ? `Объясни тему урока` : `Что такое ICAO Level 4?`,
                    "Разница Roger и Wilco",
                    "Как произносить Mayday",
                  ].map(q => (
                    <button key={q} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                      style={{
                        fontSize: 11, padding: "4px 10px",
                        borderRadius: 20, border: "1px solid var(--color-border-secondary)",
                        background: "transparent", cursor: "pointer",
                        color: "var(--color-text-secondary)",
                        transition: "all 0.1s",
                      }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: "10px 14px",
                borderTop: "1px solid var(--color-border-tertiary)",
                display: "flex", gap: 8, alignItems: "center",
                flexShrink: 0,
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Задай вопрос..."
                  disabled={loading}
                  style={{
                    flex: 1, padding: "8px 12px",
                    border: "1px solid var(--color-border-secondary)",
                    borderRadius: 20, fontSize: 13,
                    background: "var(--color-background-secondary)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: !input.trim() || loading ? "var(--color-border-tertiary)" : "var(--color-primary, #3B82F6)",
                    border: "none", cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background 0.15s",
                  }}>
                  {loading ? <Loader2 size={15} color="white" style={{ animation: "spin 0.7s linear infinite" }} />
                           : <Send size={15} color="white" />}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={open ? () => setOpen(false) : openChat}
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--color-primary, #3B82F6)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          zIndex: 1001,
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        title="AI Помощник"
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
