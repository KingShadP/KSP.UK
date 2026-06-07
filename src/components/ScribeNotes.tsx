/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit3, CheckCircle, Trash2, Plus, PenSquare } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface NoteItem {
  id: string;
  timestamp: string;
  title: string;
  text: string;
}

export default function ScribeNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteTitle, setActiveNoteTitle] = useState("");
  const [activeNoteText, setActiveNoteText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Load notes helper
  const loadNotesObj = () => {
    const saved = localStorage.getItem("sanctum_notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Notes decryption error:", e);
      }
    } else {
      // Default placeholder directives for KINGSHADP
      const initial: NoteItem[] = [
        {
          id: "1",
          timestamp: "07-JUN-2026 / 14:22",
          title: "Aegean Bunker Logistics",
          text: "Ensure seismic isolation structural alignments are calibrated to conform with Richter-scale classification 9 parameters. Fuel inventory stands at 94% backup levels."
        },
        {
          id: "2",
          timestamp: "07-JUN-2026 / 10:15",
          title: "Stealth Yacht Deployment",
          text: "Position the radar-absorbent vesselOBJ-01 in deep-sea coordinate clusters [34°42'N, 23°15'E] until clearing is transmitted by the operator."
        }
      ];
      setNotes(initial);
      localStorage.setItem("sanctum_notes", JSON.stringify(initial));
    }
  };

  // Load notes on mount and on custom update events
  useEffect(() => {
    loadNotesObj();

    const handleSync = () => {
      loadNotesObj();
    };

    window.addEventListener("sanctum_notes_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("sanctum_notes_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const saveNotes = (updated: NoteItem[]) => {
    setNotes(updated);
    localStorage.setItem("sanctum_notes", JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNoteTitle.trim() || !activeNoteText.trim()) return;

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const nowStr = new Date().toLocaleDateString("en-GB", options).toUpperCase().replace(",", " /");

    const newNote: NoteItem = {
      id: Date.now().toString(),
      timestamp: nowStr,
      title: activeNoteTitle.trim(),
      text: activeNoteText.trim()
    };

    const nextList = [newNote, ...notes];
    saveNotes(nextList);
    setActiveNoteTitle("");
    setActiveNoteText("");
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string) => {
    const nextList = notes.filter((n) => n.id !== id);
    saveNotes(nextList);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-[#030303]/40 border border-white/5 overflow-hidden select-none relative group">
      {/* HUD Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#c6b89e]/10 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <PenSquare className="w-4 h-4 text-[#c6b89e] opacity-80" />
          <span className="font-mono text-[9px] uppercase tracking-[4px] text-[#c6b89e]">
            <ScrambleText text="SCRIBE DIRECTIVE PAD" duration={800} />
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          aria-label={isAdding ? "Cancel adding directive" : "Add new directive"}
          className="p-1 px-3.5 border border-[#c6b89e]/30 text-[#c6b89e] hover:bg-[#c6b89e] hover:text-black font-mono text-[8px] uppercase tracking-[2px] transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
        >
          {isAdding ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Log Entry
            </>
          )}
        </button>
      </div>

      {/* Main Core View Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar relative z-10 select-text max-h-[300px]">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAddNote}
              className="space-y-4 pr-1 select-none"
            >
              <input
                type="text"
                required
                value={activeNoteTitle}
                onChange={(e) => setActiveNoteTitle(e.target.value)}
                placeholder="Brief coordinates descriptor (e.g. Lisbon Vault)..."
                className="w-full bg-[#020202] border border-white/10 px-3 py-2 text-[12px] font-sans text-[#c6b89e] placeholder:text-white/20 hover:border-white/20 focus:border-[#c6b89e] focus:outline-none transition-colors"
              />
              <textarea
                required
                rows={4}
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
                placeholder="Log system directives, tactical schedules, or operational coordinates..."
                className="w-full bg-[#020202] border border-white/10 p-3 text-[11.5px] font-mono text-white/80 placeholder:text-white/20 hover:border-white/20 focus:border-[#c6b89e] focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                aria-label="Commit directive log entry"
                className="w-full py-3 bg-[#ff4a00] text-black font-mono text-[9px] uppercase tracking-[3px] font-bold hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,74,0,0.3)] transition-all cursor-pointer"
              >
                Commit Mission Spec
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {notes.length === 0 ? (
                <div className="text-center py-10 font-mono text-[9px] uppercase tracking-[3px] text-white/20 select-none">
                  [ No directive entries logged ]
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-black/40 border border-white/5 hover:border-[#c6b89e]/20 transition-all flex justify-between items-start group/card relative select-text"
                  >
                    <div className="flex-grow pr-4">
                      <div className="font-mono text-[7px] text-white/30 uppercase tracking-[3px] mb-1 select-none">
                        {note.timestamp}
                      </div>
                      <h4 className="font-sans text-sm tracking-wider text-[#c6b89e] font-light uppercase">
                        {note.title}
                      </h4>
                      <p className="font-mono text-[11px] text-white/60 tracking-normal mt-2 leading-relaxed whitespace-pre-wrap select-text selection:bg-[#ff4a00]/30 selection:text-white">
                        {note.text}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      aria-label={`Purge note: ${note.title}`}
                      className="opacity-0 group-hover/card:opacity-60 hover:opacity-100! text-white/20 hover:text-[#ff4a00] p-1.5 transition-all cursor-pointer select-none focus:outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info line */}
      <div className="mt-5 pt-3 border-t border-white/5 font-mono text-[8px] text-white/30 tracking-[3px] select-none flex justify-between items-center">
        <span>LOGS REGISTERED: {notes.length}</span>
        <span className="text-[#ff4a00]/50">ENCY CODE SECURE</span>
      </div>
    </div>
  );
}
