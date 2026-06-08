/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ message, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      window.dispatchEvent(
        new CustomEvent("telemetry-log", {
          detail: {
            message: `${message}`,
            type: "HOVER_DIAGNOSTIC"
          }
        })
      );
    }
  }, [isVisible, message]);

  // Parse direct position coordinates offsets for absolute placement
  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-3";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-3";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-3";
      case "top":
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-3";
    }
  };

  const getAnimationProps = () => {
    switch (position) {
      case "bottom":
        return { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };
      case "left":
        return { initial: { opacity: 0, x: 6 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 6 } };
      case "right":
        return { initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -6 } };
      case "top":
      default:
        return { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 6 } };
    }
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            {...getAnimationProps()}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute z-[999] pointer-events-none select-none max-w-[240px] px-3.5 py-2.5 bg-[#030303]/95 border border-[#c6b89e]/30 shadow-[0_0_20px_rgba(198,184,158,0.18)] rounded-sm font-mono text-[8px] md:text-[9px] text-[#c6b89e] leading-relaxed tracking-wider whitespace-normal text-left ${getPositionClasses()}`}
            style={{
              boxShadow: "0 4px 15px rgba(0,0,0,0.9), 0 0 10px rgba(198,184,158,0.1)",
            }}
          >
            {/* Visual HUD grid corners */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#ff4a00]/80" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#ff4a00]/80" />
            
            <div className="text-[7px] text-[#ff4a00] font-bold uppercase tracking-[2px] mb-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#ff4a00] rounded-full animate-ping" />
              SYSTEM_DIAGOSTIC // ACTV
            </div>
            
            <p className="text-white/80 select-text leading-tight">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
