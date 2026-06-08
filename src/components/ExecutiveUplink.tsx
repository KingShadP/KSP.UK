/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Eye, Lock, Unlock, Terminal, Activity, CheckCircle2, CornerDownRight, RotateCcw, Camera } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface ExecutiveUplinkProps {
  onAccessGranted: () => void;
}

const BOOT_LOG_LINES = [
  "ATELIER_PORT: INITIATING EXCLUSIVE VISITATION HANDSHAKE...",
  "ATELIER NODE: ESTABLISHING PREMIUM DESIGN INTERFACE...",
  "SENSORY SELECTIONS: SYNCHRONIZING PORTFOLIO SUITES...",
  "PORTAL_CAMERA: INITIATING LUXURY APERTURE CONTROLLER...",
  "VISUAL GEOMESH: SCHEMATIC CALIBRATION IN PROGRESS...",
  "LEDGER ALIGNMENT: COUPLING WITH BESPOKE SCRIBE JOURNAL...",
  "VISITOR VERIFICATION: BIOMETRIC EYE & FACE SCAN PROTOCOL ACTIVE..."
];

export default function ExecutiveUplink({ onAccessGranted }: ExecutiveUplinkProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [percent, setPercent] = useState(0);
  const [scanningState, setScanningState] = useState<"idle" | "booting" | "ready" | "scanning" | "error" | "complete">("booting");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
  // Camera state
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
    }, 320);

    return () => clearInterval(interval);
  }, []);

  // Request camera stream safely
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: "user" }
      });
      setCameraStream(stream);
      setHasCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLogs((prev) => [...prev, "SYS_OCULAR: CAMERA ACCESS GRANTED. LIVE BIOMETRIC FEED ENGAGED."]);
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setHasCamera(false);
      setLogs((prev) => [...prev, "SYS_OCULAR: WEBCAM FEED ABSENT. FALLBACK TO MATHEMATICAL GEOMESH MODEL."]);
    }
  };

  useEffect(() => {
    if (scanningState === "ready" && hasCamera === null) {
      startCamera();
    }
  }, [scanningState, hasCamera]);

  // Clean stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Phase 2: Handle Ocular / Retinal Recognition Scan process
  const startScanning = () => {
    if (scanningState !== "ready" && scanningState !== "error") return;
    setScanningState("scanning");
    setWarningMessage(null);
    setPercent(0);

    setLogs((prev) => [
      ...prev,
      "BIOMETRIC_ENGAGE: IRIS TARGET DETECTED.",
      "BIOMETRIC_ENGAGE: EXECUTING MULTI-SPECTRAL OCULAR SCAN..."
    ]);

    // Ocular scan takes steady alignment. Operator holds or clicks to continue.
    // In our premium biometric design, we run a continuous scan that takes ~3.5 seconds.
    holdIntervalRef.current = window.setInterval(() => {
      setPercent((p) => {
        const nextVal = p + 1;
        
        // Push intermediate telemetry logs to the terminal
        if (nextVal === 20) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: MEASURING IRIS APERTURE DEPTH... 20%"]);
        } else if (nextVal === 45) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: IDENTIFYING RETINAL RADIAL RIDGE BLOOD VESSELS... 45%"]);
        } else if (nextVal === 70) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: MAPPING 1024-POINT GEOMESH FACIAL TOPOGRAPHY... 70%"]);
        } else if (nextVal === 90) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: CALCULATING COHERENCE ALIGNMENT VECTOR... 90%"]);
        }

        if (nextVal < 100) {
          return nextVal;
        } else {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setScanningState("complete");
          setLogs((prev) => [
            ...prev,
            "BIOMETRIC_STATUS: CONFIRMED. OPERATOR DESIGNATION - LEVEL 9 PRINCIPAL."
          ]);
          
          // Stop camera stream once authenticated
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
          }

          // Trigger transition to system core after confirmation
          setTimeout(() => {
            onAccessGranted();
          }, 1500);
          return 100;
        }
      });
    }, 35);
  };

  const cancelScanning = () => {
    if (scanningState === "scanning") {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      setScanningState("error");
      setWarningMessage("OCULAR_FAIL: RETINAL ALIGNMENT LOST. TARGET ACQUISITION CORRUPTED.");
      setLogs((prev) => [...prev, "SYS_ALERT: SCAN DISRUPTED. IDENTITY MATCH TERMINATED."]);
      
      // Drain progress back
      let currentPct = percent;
      const drainInterval = setInterval(() => {
        if (currentPct > 0) {
          currentPct = Math.max(0, currentPct - 4);
          setPercent(currentPct);
        } else {
          clearInterval(drainInterval);
        }
      }, 15);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col justify-between p-6 sm:p-12 font-mono select-none overflow-hidden selection:bg-[#ff4a00]/30 selection:text-white">
      {/* Background cinematic lines */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      <div className="absolute top-8 left-8 text-[9px] text-[#ff4a00]/15 tracking-[4px] uppercase flex flex-col gap-1 pointer-events-none">
        <span>"SECURE SYS PORT"</span>
        <span>SYS-MAPPED: CORE_CHAMBER_DECK_S9</span>
      </div>

      <div className="absolute top-8 right-8 text-[9px] text-white/10 tracking-[3px] uppercase flex flex-col gap-1 text-right pointer-events-none">
        <span>UTC CLOCK / OCULAR PORT</span>
        <span className="font-sans font-extralight text-[#c9c6c5]/50">SECURE COORD TRACE [AVARICE]</span>
      </div>

      {/* Extreme luxury aesthetic geometry */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.015] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-white/[0.007] pointer-events-none" />

      {/* Main Avarice console container */}
      <div className="m-auto w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 border-[0.5px] border-white/10 bg-[#050505]/85 p-6 sm:p-10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.98)] rounded-none">
        
        {/* Glow corners - Oxblood top, Muted Gold bottom */}
        <div className="absolute top-0 left-0 w-12 h-[1px] bg-[#93000a]" />
        <div className="absolute top-0 left-0 w-[1px] h-12 bg-[#93000a]" />
        <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-[#dcc57b]" />
        <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-[#dcc57b]" />

        {/* Outer subtle hair lines */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#c9c6c5]/10 to-transparent pointer-events-none" />

        {/* LEFT PANEL: Log Diagnostics Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0">
          <div>
            {/* Tactical branding */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 border-[0.5px] border-[#93000a]/30 bg-[#93000a]/5 text-[#93000a] rounded-none shadow-[0_0_20px_rgba(147,0,10,0.1)] relative">
                <Eye className="w-6 h-6 animate-pulse" />
                <div className="absolute top-0 right-0 w-1 h-1 bg-[#dcc57b]" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-[#c9c6c5] tracking-[4px] uppercase leading-none">
                  BIOMETRIC SANCTUM
                </h2>
                <p className="text-[8px] text-white/40 tracking-[5px] uppercase mt-2 font-sans font-semibold">
                  RETINAL & EYE-SCAN PORTAL
                </p>
              </div>
            </div>

            {/* Simulated Live Terminal scrolling feed */}
            <div className="h-[220px] md:h-[260px] border-[0.5px] border-white/10 bg-black/80 p-5 md:p-6 mb-4 text-[10px] leading-relaxed text-white/50 overflow-y-auto font-mono custom-scrollbar flex flex-col justify-end rounded-none">
              <div className="space-y-2.5">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 items-start ${
                      i === logs.length - 1 ? "text-[#c9c6c5] font-semibold" : ""
                    }`}
                  >
                    <span className="text-[#93000a]/60 font-bold select-none">&gt;</span>
                    <span className="flex-1 tracking-wide">{log}</span>
                  </motion.div>
                ))}
                {scanningState === "booting" && (
                  <div className="flex gap-2 items-center text-[#93000a]/80">
                    <span className="w-1 h-1 rounded-full bg-[#93000a] inline-block animate-ping" />
                    <span className="text-[8px] uppercase tracking-widest font-bold">LOADING EYE CALIBRATION PARAMETERS...</span>
                  </div>
                )}
                {scanningState === "ready" && (
                  <div className="flex gap-2 items-center text-[#dcc57b] font-bold">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#dcc57b]/80" />
                    <span className="text-[9px] uppercase tracking-[3px] animate-pulse">AWAITING OCULAR BIOMETRIC SCANNING INITIALIZATION...</span>
                  </div>
                )}
                {scanningState === "scanning" && (
                  <div className="flex gap-2 items-center text-[#ff4a00] font-bold">
                    <Activity className="w-3.5 h-3.5 animate-bounce" />
                    <span className="text-[9px] uppercase tracking-[2.5px]">OCULAR SWEEP SIGNAL ACTIVE [{percent}%]</span>
                  </div>
                )}
                {scanningState === "complete" && (
                  <div className="flex gap-2 items-center text-green-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[9px] uppercase tracking-[3px]">IDENTITY COMMITTED. EXCLUSIVE SECURITY DECK ACCESS GRANTED</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex justify-between items-center text-[9px] text-white/30 border-t border-white/10 pt-4 font-sans uppercase tracking-[2px]">
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-none ${scanningState === "complete" ? "bg-green-400" : "bg-[#93000a] animate-pulse"}`} />
              SECURE SYSTEM BIOMETRICS (AVARICE CORP)
            </span>
            <span>NODE_SCAN_90 // SECURITY DECK [HONOLULU]</span>
          </div>
        </div>

        {/* RIGHT PANEL: Biometric Interactive Module (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between items-center text-center p-2 lg:p-4 gap-6">
          
          <div className="w-full">
            <div className="text-[10px] uppercase tracking-[4px] text-white/40 mb-3 font-semibold">
              SECURE IDENTITY VERIFICATION
            </div>
            
            {/* Active message feedback banner */}
            <div className="min-h-[48px] px-2 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {warningMessage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="text-[9px] text-[#93000a] uppercase tracking-[2px] leading-relaxed font-bold border-[0.5px] border-[#93000a]/25 px-4 py-1.5 bg-[#93000a]/5"
                  >
                    {warningMessage}
                  </motion.div>
                ) : scanningState === "booting" ? (
                  <div className="text-[9px] text-white/30 uppercase tracking-[2px]">
                    SYSTEM CONSOLE LOAD_OUT INTERFACE BOOT...
                  </div>
                ) : scanningState === "ready" ? (
                  <div className="text-[9px] text-[#dcc57b] uppercase tracking-[2.5px] font-semibold animate-pulse">
                    CENTER YOUR REFLECTION AND TRIG EYE SCAN
                  </div>
                ) : scanningState === "scanning" ? (
                  <div className="text-[9px] text-white/80 uppercase tracking-[2px] animate-pulse">
                    ALIGN IRIS // MULTI-POINT CORRELATION COMPUTING...
                  </div>
                ) : scanningState === "complete" ? (
                  <div className="text-[9px] text-green-400 font-bold uppercase tracking-[3px] border-[0.5px] border-green-500/30 bg-green-500/5 px-4 py-1.5">
                    RETINA AND GEOMESH AUTHENTICATED
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* MAIN INTERACTIVE DEVICE BOX */}
          <div className="relative w-64 h-64 border-[0.5px] border-white/10 bg-[#050505] flex items-center justify-center overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.9)]">
            
            {/* Thin framing corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-[0.5px] border-l-[0.5px] border-white/40" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-[0.5px] border-r-[0.5px] border-white/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-[0.5px] border-l-[0.5px] border-white/40" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-[0.5px] border-r-[0.5px] border-white/40" />

            {/* Simulated Live Video / Retro Camera Feed */}
            {hasCamera && scanningState !== "complete" ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80 filter saturate-50 contrast-125 mix-blend-lighten scale-x-[-1]"
              />
            ) : null}

            {/* Fallback & Overlay Vector Ocular scan graphic */}
            {(!hasCamera || scanningState === "complete" || scanningState === "scanning") && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Ocular alignment rings */}
                <svg viewBox="0 0 100 100" className="w-56 h-56 stroke-[#dcc57b]/25 fill-none opacity-80 z-10">
                  {/* Outer security radar sweep ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="0.25"
                    strokeDasharray="1 3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Facial cross-triangulation axis */}
                  <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.15" strokeDasharray="3 3" stroke="#93000a"/ >
                  <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.15" strokeDasharray="3 3" stroke="#93000a"/ >

                  {/* Concentric eyeball / iris contours */}
                  <circle cx="50" cy="50" r="28" strokeWidth="0.5" stroke="#c9c6c5"/ >
                  <circle cx="50" cy="50" r="18" strokeWidth="0.35" strokeDasharray="4 2" stroke="#dcc57b"/ >
                  <circle cx="50" cy="50" r="10" strokeWidth="0.75" stroke="#93000a"/ >

                  {/* Pupil focus point */}
                  <circle cx="50" cy="50" r="3" fill="#93000a" />

                  {/* Micro digital alignment notches */}
                  <path d="M50,15 L50,18" strokeWidth="0.75" />
                  <path d="M50,85 L50,82" strokeWidth="0.75" />
                  <path d="M15,50 L18,50" strokeWidth="0.75" />
                  <path d="M85,50 L82,50" strokeWidth="0.75" />

                  {/* Mathematical bounding box indicators */}
                  <rect x="42" y="42" width="16" height="16" strokeWidth="0.25" strokeDasharray="2 2" stroke="#dcc57b" />
                  <rect x="36" y="36" width="28" height="28" strokeWidth="0.2" strokeDasharray="4 4" stroke="#c9c6c5" />
                </svg>
              </div>
            )}

            {/* Ocular computer vision tracking markers (triangulation node indicators) */}
            {(scanningState === "scanning" || scanningState === "ready") && (
              <div className="absolute inset-0 z-15 pointer-events-none select-none">
                {/* 6 coordinate points tracking operator's critical points */}
                <motion.div
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
                  className="absolute w-1.5 h-1.5 bg-[#dcc57b] top-1/3 left-1/4"
                  style={{ transform: "rotate(45deg)" }}
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  className="absolute w-1.5 h-1.5 bg-[#dcc57b] top-1/3 right-1/4"
                  style={{ transform: "rotate(45deg)" }}
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="absolute w-1 h-1 bg-[#93000a] top-[48%] left-1/2 -translate-x-1/2"
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="absolute w-1 h-1 bg-[#c9c6c5] top-[58%] left-1/3"
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="absolute w-1 h-1 bg-[#c9c6c5] top-[58%] right-1/3"
                />
                <motion.div
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                  className="absolute w-1.5 h-1.5 bg-[#dcc57b] bottom-1/4 left-1/2 -translate-x-1/2"
                  style={{ transform: "rotate(45deg)" }}
                />

                {/* Floating telemetry text updates */}
                <div className="absolute bottom-4 left-4 text-[7px] text-[#c9c6c5]/60 flex flex-col items-start gap-0.5 text-left font-mono">
                  <span>IRIS_DIAMETER: 12.19mm</span>
                  <span>FOVEA_ALIGN: {hasCamera ? "OK" : "VIRTUAL_MESH"}</span>
                  <span>DISTORT_CALIB: 0.04%</span>
                </div>

                <div className="absolute top-4 right-4 text-[7px] text-[#93000a] flex flex-col items-end gap-0.5 text-right font-mono">
                  <span>COMP_MODEL: D_NEURAL_S9</span>
                  <span>SYNC_RATIO: 0.9982</span>
                  <span>COORDS: X={percent}, Y=0.{percent}</span>
                </div>
              </div>
            )}

            {/* Sweeping Laser Scan Line */}
            {scanningState === "scanning" && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-[1.5px] bg-[#93000a] shadow-[0_0_15px_#93000a] z-20 pointer-events-none mix-blend-screen"
              />
            )}

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30 select-none pointer-events-none" />
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(201, 198, 197, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(201, 198, 197, 0.15) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            {/* Access Granted Center overlay */}
            <AnimatePresence>
              {scanningState === "complete" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#050505]/95 z-30 flex flex-col items-center justify-center p-6"
                >
                  <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full border border-green-500/30 flex items-center justify-center text-green-400 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.1)] mb-4"
                  >
                    <Unlock className="w-8 h-8 stroke-[1.25]" />
                  </motion.div>
                  <span className="text-[10px] uppercase tracking-[4px] text-green-400 font-bold">
                    BIOMETRICS VERIFIED
                  </span>
                  <span className="text-[8px] uppercase tracking-[2px] text-white/50 mt-1 font-mono">
                    PROCEEDING TO CORE DECKS...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SENSOR TRIGGERS & ACTIONS */}
          <div className="w-full flex flex-col gap-3 items-center">
            {scanningState === "scanning" ? (
              <motion.button
                onClick={cancelScanning}
                className="w-full max-w-xs h-11 border-[0.5px] border-[#93000a] bg-[#93000a]/10 hover:bg-[#93000a]/20 text-[#fff] font-sans text-[10px] tracking-[4px] uppercase font-semibold transition-all duration-300 items-center justify-center flex cursor-pointer"
                whileTap={{ scale: 0.98 }}
              >
                ABORT BIOMETRIC SWEEP
              </motion.button>
            ) : (
              <motion.button
                onClick={startScanning}
                disabled={scanningState === "booting" || scanningState === "complete"}
                className={`w-full max-w-xs h-11 border-[0.5px] font-sans text-[10px] tracking-[4px] uppercase font-bold transition-all duration-500 cursor-pointer flex items-center justify-center ${
                  scanningState === "complete"
                    ? "bg-green-500/10 border-green-400/30 text-green-400 cursor-not-allowed"
                    : scanningState === "booting"
                    ? "bg-black/40 border-white/5 text-white/20 cursor-not-allowed"
                    : "bg-[#050505] border-[#dcc57b]/45 hover:border-[#dcc57b] text-[#dcc57b] hover:bg-[#dcc57b]/5"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {scanningState === "complete" ? "VERIFICATION CLEAR" : "ALIGN EYE & INITIALIZE SCAN"}
              </motion.button>
            )}

            {/* Manual Camera reload option for security decks */}
            {hasCamera === false && (
              <button
                onClick={startCamera}
                className="text-[8px] text-[#dcc57b]/70 hover:text-[#dcc57b] uppercase tracking-[2px] flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
              >
                <Camera className="w-3 h-3 text-[#dcc57b]" />
                RE-ENGAGE OPTICAL WEBCAM SENSOR
              </button>
            )}
          </div>

          {/* PROGRESS INTEGRITY SUB-GAUGE */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between items-center text-[8px] uppercase tracking-[3px] text-white/40 mb-2">
              <span>"INTELLIGENCE SYNC"</span>
              <span className={`font-mono text-[9px] ${scanningState === "complete" ? "text-green-400" : "text-[#dcc57b]"} font-bold`}>
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
                    className={`h-[7px] flex-grow transition-all duration-300 ${
                      isActive
                        ? scanningState === "complete"
                          ? "bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]"
                          : "bg-[#93000a] shadow-[0_0_5px_rgba(147,0,10,0.5)]"
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
        <span>FACIAL PROFILE SYNC EXCLUSIVE SYSTEM [PROTOCOL AV_90]</span>
        <span className="font-serif italic mt-1 md:mt-0 text-[10.5px] normal-case tracking-[1px] text-[#c9c6c5]">
          Avarice Luxury Deck // Reserved for Principal
        </span>
      </div>
    </div>
  );
}
