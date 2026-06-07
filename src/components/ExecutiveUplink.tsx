/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Fingerprint, Lock, Unlock, Terminal, Activity, CheckCircle2, ChevronRight, CornerDownRight } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface ExecutiveUplinkProps {
  onAccessGranted: () => void;
}

const BOOT_LOG_LINES = [
  "SYS_PORT: ESTABLISHING QUANTUM ROUTE...",
  "GRID NODE SHUNT: ONLINE [STABLE @ 3.14ms]",
  "UPLINK CRYPTO: ENGAGING [AES-256-GCM / SHIELD]",
  "MEM REGISTERS: CLEANING ACTIVE SECTOR INDEXS...",
  "DETECTION ENGINE: ACTIVE [LOCAL BEACON TRACE]",
  "DECRYPT REGISTER: SYNCHRONIZING SECURE DATABASE...",
  "CREDENTIAL RETRIEVAL: OK // ROOT PRIVILEGES APPLIED",
  "OPERATOR RECOGNITION: APPROVED [PRINCIPAL_KINGSHADP]",
  "STAGING MANUAL BIOMETRIC ACCREDITATION EXCLUDE LEVEL_9..."
];

export default function ExecutiveUplink({ onAccessGranted }: ExecutiveUplinkProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [percent, setPercent] = useState(0);
  const [scanningState, setScanningState] = useState<"idle" | "booting" | "ready" | "scanning" | "error" | "complete">("booting");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
  const holdIntervalRef = useRef<number | null>(null);
  const logIndexRef = useRef(0);

  // Phase 1: Progressive Automatic Terminal Boot Logs
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LOG_LINES.length) {
        setLogs((prev) => [...prev, BOOT_LOG_LINES[currentLine]]);
        currentLine++;
        logIndexRef.current = currentLine;
      } else {
        clearInterval(interval);
        setScanningState("ready");
      }
    }, 380);

    return () => clearInterval(interval);
  }, []);

  // Phase 2: Handle Tactile Hold-to-Scan logic
  const handleScanStart = () => {
    if (scanningState !== "ready" && scanningState !== "error") return;
    setScanningState("scanning");
    setWarningMessage(null);

    // Increase progress smoothly while holding
    holdIntervalRef.current = window.setInterval(() => {
      setPercent((p) => {
        if (p < 100) {
          return p + 2; // Increments of 2%
        } else {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setScanningState("complete");
          // Play micro success feedback and transition
          setTimeout(() => {
            onAccessGranted();
          }, 1200);
          return 100;
        }
      });
    }, 25);
  };

  const handleScanEnd = () => {
    if (scanningState === "scanning") {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      // If released early, reset to error/idle and display interactive warning
      setScanningState("error");
      setWarningMessage("BIOMETRIC_FAIL: TOUCH SIGNATURE DISCONTINUOUS. ACCESS DENIED.");
      
      // Decelerate percentage smoothly back to zero
      let currentPct = percent;
      const drainInterval = setInterval(() => {
        if (currentPct > 0) {
          currentPct = Math.max(0, currentPct - 5);
          setPercent(currentPct);
        } else {
          clearInterval(drainInterval);
        }
      }, 20);
    }
  };

  // Ensure clean interval disposal on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [percent, scanningState]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020202] text-white flex flex-col justify-between p-6 sm:p-12 font-mono select-none overflow-hidden selection:bg-[#ff4a00]/30 selection:text-white">
      {/* Visual background textures */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      <div className="absolute top-8 left-8 text-[9px] text-[#ff4a00]/25 tracking-[4px] uppercase flex flex-col gap-1 pointer-events-none">
        <span>"SECURE SYS PORT"</span>
        <span>SYS-MAPPED: DECK_01</span>
      </div>

      <div className="absolute top-8 right-8 text-[9px] text-white/10 tracking-[3px] uppercase flex flex-col gap-1 text-right pointer-events-none">
        <span>UTC CLOCK / DIRECTIVE CONSOLE</span>
        <span className="font-sans font-extralight text-[#c6b89e]/60">ACTIVE COORD TRACE [SUITE-A]</span>
      </div>

      {/* Floating orbital ambient background circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/[0.01]/50 pointer-events-none" />

      {/* Center Console container */}
      <div className="m-auto w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 border border-white/5 bg-[#050505]/45 backdrop-blur-2xl p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)]">
        {/* Glowing visual corners */}
        <div className="absolute top-0 left-0 w-8 h-[1.5px] bg-[#ff4a00]" />
        <div className="absolute top-0 left-0 w-[1.5px] h-8 bg-[#ff4a00]" />
        <div className="absolute bottom-0 right-0 w-8 h-[1.5px] bg-[#c6b89e]" />
        <div className="absolute bottom-0 right-0 w-[1.5px] h-8 bg-[#c6b89e]" />

        {/* Ambient laser grid line running down */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#c6b89e]/15 to-transparent pointer-events-none" />

        {/* LEFT PANEL: Log Diagnostics Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0">
          <div>
            {/* Tactical branding */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 border border-[#ff4a00]/25 bg-[#ff4a00]/5 text-[#ff4a00] rounded-none shadow-[0_0_20px_rgba(255,74,0,0.1)] relative">
                <Shield className="w-6 h-6 animate-pulse" />
                <div className="absolute top-0 right-0 w-1 h-1 bg-[#ff4a00]" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-[#c6b89e] tracking-[2px] uppercase leading-none">
                  The Sanctum
                </h2>
                <p className="text-[9px] text-white/40 tracking-[4px] uppercase mt-2">
                  Command Interface Gateway
                </p>
              </div>
            </div>

            {/* Simulated Live Terminal scrolling feed */}
            <div className="h-[220px] md:h-[260px] border border-white/5 bg-black/60 p-5 md:p-6 mb-4 text-[10.5px] leading-relaxed text-white/60 overflow-y-auto font-mono custom-scrollbar flex flex-col justify-end">
              <div className="space-y-2.5">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 items-start ${
                      i === BOOT_LOG_LINES.length - 1 ? "text-[#c6b89e] font-semibold" : ""
                    }`}
                  >
                    <span className="text-[#ff4a00]/40 font-bold select-none">&gt;</span>
                    <span className="flex-1 tracking-wide">{log}</span>
                  </motion.div>
                ))}
                {scanningState === "booting" && (
                  <div className="flex gap-2 items-center text-[#ff3a00]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a00] inline-block animate-ping" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">DECRYPTING COREDATA SYSTEM TELEMETRY...</span>
                  </div>
                )}
                {scanningState === "ready" && (
                  <div className="flex gap-2 items-center text-[#c6b89e] font-bold">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#ff4a00]" />
                    <span className="text-[10px] uppercase tracking-widest animate-pulse">AWAITING BIOMETRIC TELEMETRY FEED...</span>
                  </div>
                )}
                {scanningState === "scanning" && (
                  <div className="flex gap-2 items-center text-[#ff4a00] font-bold">
                    <Activity className="w-3.5 h-3.5 animate-bounce" />
                    <span className="text-[10px] uppercase tracking-widest">TRANSMITTING CONTINUOUS BIOMETRIC STREAM [{percent}%]</span>
                  </div>
                )}
                {scanningState === "complete" && (
                  <div className="flex gap-2 items-center text-green-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-widest">SIGNATURE GRANTED. SECURE ARCHIVES DECRYPTION COMPLETE</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Gauge indicators */}
          <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/5 pt-4">
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${scanningState === "complete" ? "bg-green-400" : "bg-[#ff4a00] animate-pulse"}`} />
              SECURE PORTAL DECK v1.6
            </span>
            <span>NODE_82 // SECTOR_G</span>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Biometric Verification (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between items-center text-center p-2">
          
          <div className="w-full">
            <div className="text-[10px] uppercase tracking-[3px] text-white/40 mb-3 font-semibold">
              SIGNATURE IDENTIFICATION
            </div>
            
            {/* Decaying Error/Prompt message space */}
            <div className="min-h-[40px] px-2 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {warningMessage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-[9px] text-[#ff4a00] uppercase tracking-[2px] leading-relaxed"
                  >
                    {warningMessage}
                  </motion.div>
                ) : scanningState === "booting" ? (
                  <div className="text-[9px] text-white/30 uppercase tracking-[2px]">
                    PORTAL IS BOOTING DIAGNOSTIC TELEMETRY...
                  </div>
                ) : scanningState === "ready" ? (
                  <div className="text-[9px] text-[#c6b89e] uppercase tracking-[2.5px] font-semibold animate-pulse">
                    TOUCH AND HOLD THE SCANNER NODE TO VERIFY
                  </div>
                ) : scanningState === "scanning" ? (
                  <div className="text-[9px] text-white/80 uppercase tracking-[2px] flex items-center gap-2 justify-center">
                    MAINTAIN PRESSURE. DECRYPTING CODES...
                  </div>
                ) : scanningState === "complete" ? (
                  <div className="text-[9.5px] text-green-400 font-bold uppercase tracking-[3px]">
                    BIOMETRIC IDENTITY ACCESS VERIFIED
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* MAIN INTERACTIVE KEYPAD SECTION */}
          <div className="my-8 relative flex items-center justify-center">
            
            {/* Laser scanning beam line - visible during scanning state */}
            {scanningState === "scanning" && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-[1.5px] bg-[#ff4a00] shadow-[0_0_12px_#ff4a00] z-20 pointer-events-none mix-blend-screen"
              />
            )}

            {/* Circular scanning layout */}
            <div className="relative w-48 h-48 flex items-center justify-center select-none">
              
              {/* Spinning decorative geometric rings */}
              <motion.div
                animate={{ rotate: scanningState === "scanning" ? 360 : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-500 pointer-events-none ${
                  scanningState === "complete"
                    ? "border-green-400/40"
                    : scanningState === "scanning"
                    ? "border-[#ff4a00]/70"
                    : "border-white/10"
                }`}
              />
              <motion.div
                animate={{ rotate: scanningState === "scanning" ? -360 : 0 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-dotted border-[#c6b89e]/20 pointer-events-none"
              />

              {/* Pulsing visual circles inside */}
              <AnimatePresence>
                {scanningState === "scanning" && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0.2 }}
                    animate={{ scale: 1.25, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-8 rounded-full border-2 border-[#ff4a00] shadow-[0_0_20px_#ff4a00] pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Inner scanning pad button */}
              <motion.button
                onMouseDown={handleScanStart}
                onMouseUp={handleScanEnd}
                onMouseLeave={handleScanEnd}
                onTouchStart={handleScanStart}
                onTouchEnd={handleScanEnd}
                disabled={scanningState === "booting" || scanningState === "complete"}
                role="button"
                aria-label="Fingerprint Biometric Scanner"
                whileTap={{ scale: 0.94 }}
                className={`w-36 h-36 rounded-full border flex flex-col items-center justify-center transition-all duration-500 cursor-pointer outline-none relative overflow-hidden focus:outline-none ${
                  scanningState === "complete"
                    ? "bg-green-500/10 border-green-400/60 text-green-400 hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                    : scanningState === "scanning"
                    ? "bg-[#ff4a00]/10 border-[#ff4a00] text-[#ff4a00] shadow-[0_0_35px_rgba(255,74,0,0.25)]"
                    : scanningState === "error"
                    ? "bg-black border-[#ff4a00]/50 text-[#ff4a00]"
                    : "bg-[#090909] border-white/15 text-white/45 hover:border-[#c6b89e]/60 hover:text-[#c6b89e]"
                }`}
              >
                {/* Fingerprint icon with gorgeous layout state transitions */}
                <motion.div
                  animate={scanningState === "scanning" ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="z-10 relative mb-2"
                >
                  <Fingerprint className="w-12 h-12 stroke-[1.25]" />
                </motion.div>

                {scanningState === "complete" ? (
                  <span className="text-[10px] tracking-[2px] uppercase font-bold text-green-300">
                    GRANTED
                  </span>
                ) : scanningState === "scanning" ? (
                  <span className="text-[10px] tracking-[2.5px] uppercase font-bold text-white">
                    HOLDING...
                  </span>
                ) : (
                  <span className="text-[8.5px] tracking-[4px] uppercase opacity-70">
                    HOLD PAD
                  </span>
                )}

                {/* Secure Lock icon state */}
                <div className="absolute bottom-4 z-10 opacity-40">
                  {scanningState === "complete" ? (
                    <Unlock className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Concentric liquid progress filler under lay */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#ff4a00]/20 via-[#c6b89e]/15 to-transparent transition-all duration-150 ease-out"
                  style={{ height: `${percent}%` }}
                />
              </motion.button>
            </div>
          </div>

          {/* Core Interactive Percentage Loader bar */}
          <div className="w-full max-w-xs mt-2 select-none">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-[2px] text-white/40 mb-2">
              <span>"INTELLIGENCE SYNC"</span>
              <span className={`font-mono text-[10px] ${scanningState === "complete" ? "text-green-400" : "text-[#c6b89e]"} font-bold`}>
                {percent}%
              </span>
            </div>
            
            {/* Elegant Segmented indicator */}
            <div className="flex gap-[3px] select-none">
              {Array.from({ length: 40 }).map((_, index) => {
                const stepVal = index * 2.5; // 40 items total over 100%
                const isActive = percent >= stepVal;
                return (
                  <div
                    key={index}
                    className={`h-[9px] flex-grow transition-all duration-300 ${
                      isActive
                        ? scanningState === "complete"
                          ? "bg-green-400 shadow-[0_0_5px_#22c55e]"
                          : "bg-[#ff4a00] shadow-[0_0_5px_rgba(255,100,0,0.5)]"
                        : "bg-white/5"
                    }`}
                  />
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Info footer system stats */}
      <div className="text-white/25 select-none text-center pointer-events-none text-[8.5px] uppercase tracking-[6px] py-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-4">
        <span>SECURITY SYSTEMS ONLINE [PROTOCOL B9-S9]</span>
        <span className="font-serif italic mt-1 md:mt-0 text-[10.5px] normal-case tracking-[1px] text-[#c6b89e]">
          Designed for kingshadp
        </span>
      </div>
    </div>
  );
}
