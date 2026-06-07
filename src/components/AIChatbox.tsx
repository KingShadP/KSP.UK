/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Send, ServerCrash, X, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";
import ScrambleText from "./ScrambleText";

interface AIChatboxProps {
  onClose?: () => void;
}

const SHIELD = 'biometric scan';

export default function AIChatbox({ onClose }: AIChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "model",
      text: "Awaiting instruction, Principal. Enter tactical query coordinates to begin core optimization analysis."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputValue.trim();
    if (!prompt || isTyping) return;

    setInputValue("");
    const userMessageId = Date.now().toString();
    const updatedHistory: Message[] = [...messages, { id: userMessageId, role: "user", text: prompt }];
    setMessages(updatedHistory);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory })
      });

      if (!response.ok) {
        throw new Error(`Uplink Error ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: data.text || "Diagnostic query returned empty payload."
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "CONNECTION INTERRUPTED. Gateway response timeout. Re-establishing secure satellite communications alignment..."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#020202] relative overflow-hidden group border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Absolute Noise pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Top Console header */}
      <div className="flex items-center justify-between p-6 border-b border-[#c6b89e]/10 bg-black/60 backdrop-blur-md relative z-20">
        <div className="flex items-center gap-4">
          <Bot className="w-5 h-5 text-[#c6b89e]" />
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[4px] font-bold text-[#c6b89e]">
              <ScrambleText text="Executive Module" duration={800} />
            </div>
            <div className="font-mono text-[7px] uppercase tracking-[2px] opacity-40 mt-1">
              SYSTEM CONCIERGE: ACTIVE
            </div>
          </div>
        </div>

        {onClose && (
          <motion.button
            onClick={onClose}
            aria-label="Close AI Concierge"
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:text-[#c6b89e] transition-colors text-white/30 cursor-pointer hover:bg-[#c6b89e]/10 border border-transparent hover:border-[#c6b89e]/30 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Messages area container */}
      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative z-10 bg-black/25">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`flex flex-col max-w-[85%] select-text ${m.role === "user" ? "self-end items-end" : "self-start items-start"}`}
            >
              {/* User/Model Identifier badge */}
              <div className="font-mono text-[7.5px] uppercase tracking-[3px] text-white/20 mb-2 font-bold select-none">
                {m.role === "user" ? "Principal [KingshadP]" : "Executive Assistant"}
              </div>

              {/* Chat bubble */}
              <div
                className={`p-4 md:p-5 text-[12.5px] font-sans border selection:bg-[#ff4a00]/30 selection:text-white leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#ff4a00]/5 border-[#ff4a00]/35 text-white/90"
                    : "bg-[#c6b89e]/5 border-[#c6b89e]/15 text-[#c6b89e]/90"
                }`}
              >
                <div className="markdown-body">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start flex flex-col max-w-[85%] select-none"
          >
            <div className="font-mono text-[7.5px] uppercase tracking-[3px] text-white/20 mb-2 font-bold">
              Uplink decrypting...
            </div>
            <div className="flex gap-1.5 p-4 bg-white/2.5 border border-white/5 text-[#c6b89e] items-center">
              <span className="w-1.5 h-1.5 bg-[#c6b89e] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-[#c6b89e] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-[#c6b89e] rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Form input panel */}
      <form
        onSubmit={handleSendMessage}
        className="p-6 border-t border-[#c6b89e]/10 bg-black/80 flex items-center gap-4 relative z-20"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="State your directive, Principal..."
          disabled={isTyping}
          className="flex-grow bg-white/2.5 border border-white/10 px-5 py-4 text-white text-[13px] font-sans tracking-wide placeholder:text-white/20 hover:border-white/20 focus:border-[#c6b89e] focus:outline-none transition-colors duration-300 disabled:opacity-50"
        />

        <motion.button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          whileTap={{ scale: 0.95 }}
          className="p-4 px-6 bg-[#c6b89e] text-black hover:bg-white transition-colors duration-300 cursor-pointer flex items-center justify-center disabled:opacity-30 disabled:bg-white/10 disabled:text-white/40 border border-transparent hover:border-white"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}
export { SHIELD };
