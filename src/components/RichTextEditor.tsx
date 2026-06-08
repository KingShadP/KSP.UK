/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Eye, 
  Terminal, 
  Sparkles, 
  Trash2,
  Heading1,
  Heading2,
  Link as LinkIcon
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function RichTextEditor({ value, onChange, label = "RICH TEXT WORKSPACE" }: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value from prop to editorRef content when prop changed externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const htmlContent = editorRef.current.innerHTML;
      onChange(htmlContent);
      isUpdatingRef.current = false;
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    handleEditorInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLink = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://spotify.com):");
    if (url !== null) {
      executeCommand("createLink", url);
    }
  };

  const handleInsertHeader = (level: "h3" | "h4") => {
    executeCommand("formatBlock", level);
  };

  const handleClearFormat = () => {
    executeCommand("removeFormat");
  };

  return (
    <div className="w-full flex flex-col border border-white/10 bg-[#030303] focus-within:border-[#c6b89e] transition-all">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-black/60 border-b border-white/5 px-4 py-2 gap-2 select-none">
        <span className="font-mono text-[8px] tracking-[2.5px] text-[#c6b89e] uppercase flex items-center gap-1.5 py-1">
          <Sparkles className="w-3 h-3 text-[#ff4a00] animate-pulse" />
          {label}
        </span>
        
        {/* Mode Toggles */}
        <div className="flex items-center gap-1 border border-white/5 p-0.5 bg-[#010101] max-w-max self-end sm:self-auto rounded-sm">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`cursor-pointer px-2.5 py-1 font-mono text-[7px] tracking-[1.5px] uppercase transition-all rounded-[1px] flex items-center gap-1 ${
              mode === "visual"
                ? "bg-[#c6b89e]/15 text-white font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Eye className="w-2.5 h-2.5" /> VISUAL EDIT
          </button>
          <span className="text-white/10 text-[9px]">|</span>
          <button
            type="button"
            onClick={() => {
              setMode("html");
              // Sync current innerHTML to the prop if in HTML mode standard rendering
            }}
            className={`cursor-pointer px-2.5 py-1 font-mono text-[7px] tracking-[1.5px] uppercase transition-all rounded-[1px] flex items-center gap-1 ${
              mode === "html"
                ? "bg-[#c6b89e]/15 text-white font-bold"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Terminal className="w-2.5 h-2.5" /> HTML SOURCE
          </button>
        </div>
      </div>

      {/* Formatting Toolbars - Active in Visual Mode */}
      {mode === "visual" && (
        <div className="flex flex-wrap items-center gap-1 bg-[#050505] border-b border-white/5 p-1.5 select-none">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Bold [Ctrl+B]"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Italic [Ctrl+I]"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Underline [Ctrl+U]"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="h-4 border-r border-white/10 mx-1" />

          <button
            type="button"
            onClick={() => handleInsertHeader("h3")}
            className="px-2 py-1 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all font-mono text-[8px] font-bold cursor-pointer"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => handleInsertHeader("h4")}
            className="px-2 py-1 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all font-mono text-[8px] font-bold cursor-pointer"
            title="Heading 4"
          >
            H4
          </button>

          <span className="h-4 border-r border-white/10 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Unordered List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <span className="h-4 border-r border-white/10 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "blockquote")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "pre")}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleLink}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-all cursor-pointer"
            title="Add Hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          <span className="h-4 border-r border-white/10 mx-1" />

          <button
            type="button"
            onClick={handleClearFormat}
            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-950/10 rounded-sm transition-all cursor-pointer font-mono text-[7px]"
            title="Clear Formatting"
          >
            [CLEAR]
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="relative min-h-[300px] flex flex-col">
        {mode === "visual" ? (
          <div
            id="wysiwyg-editor-portal"
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            className="w-full h-full flex-grow p-4 outline-none text-white/80 font-sans text-xs leading-relaxed text-justify overflow-y-auto max-h-[500px] prose prose-invert focus:prose-amber selection:bg-[#ff4a00]/30"
            style={{ minHeight: "300px" }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full flex-grow p-4 outline-none bg-[#020202] text-[#ff4a00]/90 font-mono text-xs leading-relaxed overflow-y-auto max-h-[500px]"
            style={{ minHeight: "300px" }}
            spellCheck={false}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#010101] px-3 py-1 border-t border-white/5 font-mono text-[7.5px] text-white/20 select-none flex justify-between">
        <span>MODE: {mode.toUpperCase()} SYNCHRONIZATION nominal</span>
        <span>HTML SIZE: {value?.length || 0} characters</span>
      </div>
    </div>
  );
}
