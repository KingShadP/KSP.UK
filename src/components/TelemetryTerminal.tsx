/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Terminal, Shield, RefreshCw, AlertTriangle, CornerDownRight, ShieldCheck, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  hex: string;
  message: string;
  type: "SYSTEM" | "HOVER_DIAGNOSTIC" | "USER_INPUT" | "CAMERA_RAW" | "WARNING" | "FORGE_SYNC";
}

export default function TelemetryTerminal() {
  const [logs, setLogs] = useState<TelemetryLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSensors, setActiveSensors] = useState<string[]>([]);
  const [efficiency, setEfficiency] = useState(99.4);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate initial bootstrap logs
  useEffect(() => {
    const initLogs: TelemetryLogEntry[] = [
      {
        id: "init-1",
        timestamp: new Date().toLocaleTimeString(),
        hex: "0x7FFF3B82",
        message: "INITIATING ATHENE SOVEREIGN KERNEL SYSTEMS...",
        type: "SYSTEM"
      },
      {
        id: "init-2",
        timestamp: new Date().toLocaleTimeString(),
        hex: "0x3A2E8F01",
        message: "STEREOSCOPIC PERSPECTIVE ENGINE BOOTED: STABLE 90HZ",
        type: "SYSTEM"
      },
      {
        id: "init-3",
        timestamp: new Date().toLocaleTimeString(),
        hex: "0xF287D19A",
        message: "AEGEAN SEA CLIMATE INTERFACE SYNCED TO VAULT GAUGES",
        type: "SYSTEM"
      },
      {
        id: "init-4",
        timestamp: new Date().toLocaleTimeString(),
        hex: "0xAB4278F0",
        message: "SECURE END-TO-END GATEWAY SECURED WITH AES-GCM-256",
        type: "SYSTEM"
      }
    ];
    setLogs(initLogs);

    // Random sensor readings
    const sensors = ["ACCEL_Z", "PITCH_CAM", "VOLUMETRIC_Z", "SHIELD_VOID", "AEGEAN_HUMI"];
    setActiveSensors(sensors);

    // Dynamic efficiency generator
    const interval = setInterval(() => {
      setEfficiency(prev => {
        const val = prev + (Math.random() - 0.5) * 0.15;
        return parseFloat(Math.min(100, Math.max(92, val)).toFixed(2));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Listen to custom global telemetry dispatch events
  useEffect(() => {
    const handleTelemetryEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        message: string;
        type?: TelemetryLogEntry["type"];
      }>;
      
      if (!customEvent.detail || !customEvent.detail.message) return;

      const randomHex = "0x" + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, "0");
      const timestamp = new Date().toLocaleTimeString() + "." + String(Math.floor(Math.random() * 1000)).padStart(3, "0");
      
      const newEntry: TelemetryLogEntry = {
        id: Math.random().toString(),
        timestamp,
        hex: randomHex,
        message: customEvent.detail.message,
        type: customEvent.detail.type || "HOVER_DIAGNOSTIC"
      };

      setLogs(prev => {
        const nextLogs = [...prev, newEntry];
        if (nextLogs.length > 50) {
          return nextLogs.slice(nextLogs.length - 50);
        }
        return nextLogs;
      });
    };

    window.addEventListener("telemetry-log" as any, handleTelemetryEvent);
    return () => window.removeEventListener("telemetry-log" as any, handleTelemetryEvent);
  }, []);

  // Auto-scroll to bottom of logs on new log entry
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Global window click interaction listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Determine click source
      const closestButton = target.closest("button");
      const closestLink = target.closest("a");
      
      if (closestButton || closestLink) {
        const label = (closestButton?.innerText || closestButton?.ariaLabel || closestLink?.innerText || target.tagName).trim();
        if (label && label.length < 32 && !label.includes("01 //") && !label.includes("[ RE-CALIBRATE HUD ]")) {
          window.dispatchEvent(new CustomEvent("telemetry-log", {
            detail: {
              message: `USER ACTION: Triggered interaction on [${label.replace(/\n/g, " ")}]`,
              type: "USER_INPUT"
            }
          }));
        }
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const clearTelemetry = () => {
    setLogs([
      {
        id: "sys-clear",
        timestamp: new Date().toLocaleTimeString(),
        hex: "0x00000000",
        message: "-- TELEMETRY BUFFER CLEAR COMPLETED --",
        type: "SYSTEM"
      }
    ]);
  };

  const getLogTypeColor = (type: TelemetryLogEntry["type"]) => {
    switch (type) {
      case "SYSTEM":
        return "text-[#c6b89e] font-bold";
      case "CAMERA_RAW":
        return "text-cyan-400 font-bold";
      case "WARNING":
        return "text-[#93000a] font-bold animate-pulse";
      case "USER_INPUT":
        return "text-amber-400";
      case "FORGE_SYNC":
        return "text-emerald-400 font-bold";
      case "HOVER_DIAGNOSTIC":
      default:
        return "text-white/60";
    }
  };

  return (
    <div 
      className="fixed bottom-[104px] left-6 z-[45] font-mono select-none"
      id="TelemetryTerminalOuterContainer"
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="w-[340px] md:w-[480px] h-[220px] bg-black/92 border border-[#c6b89e]/20 hover:border-[#93000a]/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden relative backdrop-blur-md"
          >
            {/* Corner decals */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

            {/* Header control line */}
            <div className="flex justify-between items-center bg-white/[0.02] px-4 py-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#93000a]" />
                <span className="text-[9px] font-bold tracking-[2.5px] text-white uppercase pt-0.5">
                  SYSTEM_TELEMETRY // RX_LOGS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={clearTelemetry}
                  className="text-[7.5px] uppercase tracking-wider text-[#c6b89e] hover:text-white px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer pb-1"
                  title="Wipe telemetric diagnostic matrices"
                >
                  CLEAR
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[8px] text-white/50 hover:text-white cursor-pointer"
                  title="Collapse Diagnostics HUD"
                >
                  [ _ ]
                </button>
              </div>
            </div>

            {/* Sensors feed status metrics ticker */}
            <div className="grid grid-cols-4 border-b border-white/5 px-4 py-1.5 bg-black/40 text-[7.5px] text-white/45">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-[#c6b89e]" />
                <span className="truncate">INTEGRITY: 100%</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <Cpu className="w-2.5 h-2.5 text-[#93000a]" />
                <span className="truncate uppercase font-bold text-white/60">SYS_EFF: {efficiency}%</span>
              </div>
              <div className="text-right text-[#c6b89e] uppercase truncate">
                SYNC_LIVE
              </div>
            </div>

            {/* Live streaming logs block */}
            <div 
              ref={scrollContainerRef}
              className="flex-grow p-4 overflow-y-auto space-y-1.5 custom-scrollbar bg-black/25 text-[8.5px] select-text font-mono leading-relaxed"
            >
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 border-b border-white/[0.01] pb-1 hover:bg-white/[0.01] transition-colors">
                  <span className="text-white/20 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className="text-[#c6b89e]/40 shrink-0 select-none">{log.hex}</span>
                  <CornerDownRight className="w-2.5 h-2.5 shrink-0 text-[#93000a]/50 mt-0.5 select-none" />
                  <span className={`${getLogTypeColor(log.type)} break-all`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom active telemetry sensor vectors ticker */}
            <div className="bg-[#050505] px-4 py-1.5 border-t border-white/5 text-[7px] text-white/30 flex justify-between items-center select-none">
              <span className="tracking-wide">CHANNELS: {activeSensors.join(" | ")}</span>
              <span className="text-white/20">RECV_OK</span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-black/85 border border-[#c6b89e]/30 hover:border-[#93000a] text-[#c6b89e] hover:text-white font-mono text-[9px] tracking-[2px] uppercase cursor-pointer flex items-center gap-2 backdrop-blur-md"
            id="RestoreTelemetryHUDButton"
          >
            <Terminal className="w-3.5 h-3.5 text-[#93000a]" />
            <span>[ INJECT_TELEMETRY_HUD ]</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
