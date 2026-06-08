import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Eye, Lock, Unlock, Terminal, Activity, CheckCircle2, CornerDownRight, RotateCcw, Camera } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface ExecutiveUplinkProps {
  onAccessGranted: () => void;
}

const BOOT_LOG_LINES = [
  "ATELIER_PORT: INITIATING SYSTEM HANDSHAKE...",
  "ATELIER NODE: INITIALIZING SECURE INTERFACE...",
  "SENSORY SYNC: MOUNT EM PORTFOLIO VECTOR BUFFERS...",
  "PORTAL_CAMERA: TESTING LUXURY SENSOR RESPONSE...",
  "VISOR VERIFICATION: BIOMETRIC EYE SCAN ACTIVE..."
];

export default function ExecutiveUplink({ onAccessGranted }: ExecutiveUplinkProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [percent, setPercent] = useState(0);
  const [scanningState, setScanningState] = useState<"idle" | "booting" | "ready" | "scanning" | "error" | "complete" | "success">("booting");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
  // Camera state
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const holdIntervalRef = useRef<number | null>(null);

  // Phase 1: Snappy Automatic Terminal Boot Logs
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LOG_LINES.length) {
        setLogs((prev) => [...prev, BOOT_LOG_LINES[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setScanningState("ready");
      }
    }, 150); // Faster initial boot response

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
      setLogs((prev) => [...prev, "SYS_OCULAR: LIVE USER CAMERA STREAM ACTIVE."]);
    } catch (err) {
      console.warn("Camera access denied:", err);
      setHasCamera(false);
      setLogs((prev) => [...prev, "SYS_OCULAR: CAMERA ACCESS BYPASSED. USING VECTOR GEOMESH ENGINE."]);
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

  // Phase 2: Rapid & Satisfying Biometric Scan Process
  const startScanning = () => {
    if (scanningState !== "ready" && scanningState !== "error") return;
    setScanningState("scanning");
    setWarningMessage(null);
    setPercent(0);

    setLogs((prev) => [
      ...prev,
      "BIOMETRIC: SWEEPING OPTICAL COORDINATES...",
      "BIOMETRIC: ALIGNING IRIS RETINA VECTOR MODULES..."
    ]);

    // Faster step transitions for lag-free, high-performance experience (takes ~1.2s total)
    holdIntervalRef.current = window.setInterval(() => {
      setPercent((p) => {
        const nextVal = p + 2; // Increments of 2 for snappy movement
        
        if (nextVal === 20) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: READING RETINAL APERTURE... 20%"]);
        } else if (nextVal === 50) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: VERIFYING EYE GEOMESH ALIGNMENT... 50%"]);
        } else if (nextVal === 80) {
          setLogs((prev) => [...prev, "SCAN_TELEMETRY: DECRYPTING CIPHER CREDENTIAL CHANNELS... 80%"]);
        }

        if (nextVal < 100) {
          return nextVal;
        } else {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setScanningState("complete");
          setLogs((prev) => [
            ...prev,
            "BIOMETRIC_STATUS: CONFIRMED. ACCESS CLEARANCE LEVEL 9 PRINCIPAL GRANTED."
          ]);
          
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
          }

          // Trigger smooth access transition
          setTimeout(() => {
            setScanningState("success");
            setTimeout(() => {
              onAccessGranted();
            }, 800);
          }, 800);
          return 100;
        }
      });
    }, 20); // Snappy scanning updates for lag-free performance
  };

  const cancelScanning = () => {
    if (scanningState === "scanning") {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      setScanningState("error");
      setWarningMessage("ALIGN_ERR: OCULAR TARGET INTERRUPTED.");
      setLogs((prev) => [...prev, "SYS_ALERT: BIOMETRIC SEQUENCE DISRUPTED."]);
      setPercent(0);
    }
  };

  const displayedLogs = logs.slice(-6);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col justify-between p-4 sm:p-8 font-mono select-none overflow-y-auto sm:overflow-hidden selection:bg-[#ff4a00]/30 selection:text-white">
      {/* Dynamic Scoped CSS Stylesheet for pure GPU-Compositor 60fps animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gpuFadeIn {
          from { opacity: 0; transform: translate3d(-3px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes gpuPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95) translate3d(0,0,0); }
          50% { opacity: 1; transform: scale(1.05) translate3d(0,0,0); }
        }
        @keyframes gpuLaserSweep {
          0% { transform: translate3d(0, 8%, 0); }
          50% { transform: translate3d(0, 82%, 0); }
          100% { transform: translate3d(0, 8%, 0); }
        }
        @keyframes gpuSpinCircle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-gpu-fade {
          animation: gpuFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: opacity, transform;
        }
        .animate-gpu-spin {
          animation: gpuSpinCircle 18s infinite linear;
          transform-origin: center;
          will-change: transform;
        }
        .animate-gpu-pulse-dot {
          animation: gpuPulse 1.2s infinite alternate ease-in-out;
          will-change: opacity, transform;
        }
        .animate-gpu-laser {
          animation: gpuLaserSweep 1.6s infinite ease-in-out;
          will-change: transform;
        }
      `}} />

      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      
      {/* Top Margin Info */}
      <div className="flex justify-between items-start text-[7.5px] sm:text-[9.5px] text-white/30 tracking-[2px] sm:tracking-[3px] uppercase pointer-events-none mt-1 sm:mt-2 px-1 sm:px-2 z-10 w-full">
        <div className="flex flex-col gap-0.5">
          <span>"SECURE SYS PORT"</span>
          <span className="text-[#ff4a00]/40">SYS-MAPPED: ATELIER_S9</span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span>BIOMETRIC SCANNING SYSTEM</span>
          <span className="font-sans font-extralight text-[#c9c6c5]/40 text-[6.5px] sm:text-[8px]">KINDSHADP VERIFICATION</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="my-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 border-[0.5px] border-white/10 bg-[#050505]/95 p-3 sm:p-5 md:p-8 relative overflow-hidden shadow-2xl rounded-sm z-10">
        
        {/* Glow corners */}
        <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#ff4a00]/80" />
        <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#ff4a00]/80" />
        <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-[#c6b89e]" />
        <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-[#c6b89e]" />

        {/* LEFT PANEL: Diagnostics console */}
        <div className="md:col-span-7 flex flex-col justify-between gap-3 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6 text-left">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 md:mb-4">
              <div className="p-1.5 border-[0.5px] border-[#ff4a00]/30 bg-[#ff4a00]/5 text-[#ff4a00] rounded-sm relative shadow-md">
                <Eye className="w-4 h-4 sm:w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-md md:text-lg font-serif text-[#c6b89e] tracking-[2px] sm:tracking-[3px] uppercase leading-none">
                  BIOMETRIC SANCTUM
                </h2>
                <div className="text-[7px] text-white/40 tracking-[3px] uppercase mt-0.5 sm:mt-1 font-sans font-semibold">
                  DECKS GATEWAY AUTHENTICATION
                </div>
              </div>
            </div>

            {/* Scrolling logs console - reduced height on mobile to prevent cutoff */}
            <div className="h-[80px] sm:h-[120px] md:h-[185px] border-[0.5px] border-white/5 bg-black/75 p-3 md:p-4 mb-2 text-[8.5px] leading-relaxed text-white/45 overflow-y-auto font-mono custom-scrollbar flex flex-col justify-end">
              <div className="space-y-1 pt-2">
                {displayedLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`flex gap-1.5 items-start animate-gpu-fade ${
                      i === displayedLogs.length - 1 ? "text-[#c6b89e] font-semibold" : ""
                    }`}
                  >
                    <span className="text-[#ff4a00]/60 font-bold select-none">&gt;</span>
                    <span className="flex-1 tracking-wide">{log}</span>
                  </div>
                ))}
                {scanningState === "booting" && (
                  <div className="flex gap-1 items-center text-[#ff4a00]/80">
                    <span className="w-1 h-1 rounded-full bg-[#ff4a00] inline-block animate-ping" />
                    <span className="text-[7.5px] uppercase tracking-wider">BOOTING INTERFACE STATE MODULES...</span>
                  </div>
                )}
                {scanningState === "ready" && (
                  <div className="flex gap-1 items-center text-[#c6b89e] font-semibold">
                    <CornerDownRight className="w-2.5 h-2.5 text-[#c6b89e]/60" />
                    <span className="text-[7.5px] uppercase tracking-[1.5px] animate-pulse">AWAITING BIOMETRIC INITIATION COMMAND...</span>
                  </div>
                )}
                {scanningState === "scanning" && (
                  <div className="flex gap-1 items-center text-[#ff4a00] font-bold">
                    <Activity className="w-2.5 h-2.5 animate-bounce" />
                    <span className="text-[7.5px] uppercase tracking-[1.5px]">SWEEP CONSOLE INTERACTION ENGAGED [{percent}%]</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[7.5px] text-white/30 pt-2.5 border-t border-white/5 uppercase tracking-[1.5px]">
            <span>CREDENTIAL VERIFICATION: AUTOMATED</span>
            <span>SECURE GATEWAY</span>
          </div>
        </div>

        {/* RIGHT PANEL: Biometric Ocular Interactive Box */}
        <div className="md:col-span-5 flex flex-col justify-between items-center p-1 md:p-2 gap-3 md:gap-4">
          
          <div className="w-full">
            <div className="min-h-[24px] md:min-h-[32px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {warningMessage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[7.5px] text-[#ff4a00] uppercase tracking-[1.5px] font-bold border border-[#ff4a00]/25 px-2.5 py-0.5 bg-[#ff4a00]/5 text-center"
                  >
                    {warningMessage}
                  </motion.div>
                ) : scanningState === "booting" ? (
                  <div className="text-[7.5px] text-white/20 uppercase tracking-[1.5px]">
                    SYSTEM CONSOLE STATUS: SYSTEM BOOTING
                  </div>
                ) : scanningState === "ready" ? (
                  <div className="text-[7.5px] text-[#c6b89e] uppercase tracking-[1.5px] font-bold animate-pulse text-center">
                    CENTER REFLECTION AND TAP BUTTON BELOW
                  </div>
                ) : scanningState === "scanning" ? (
                  <div className="text-[7.5px] text-white/80 uppercase tracking-[1.5px] animate-pulse text-center">
                    COMPUTATION FLOW CALIBRATING CODES...
                  </div>
                ) : (scanningState === "complete" || scanningState === "success") ? (
                  <div className="text-[7.5px] text-green-400 font-bold uppercase tracking-[1.5px] border border-green-500/20 bg-green-500/5 px-2.5 py-0.5 text-center">
                    BIOMETRIC PROFILE AUTHENTICATED
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* MAIN INTERACTIVE DEVICE BOX - Optimized, responsive, non-cluttered & GPU-ready sizing */}
          <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 border-[0.5px] border-white/10 bg-[#020202] flex items-center justify-center overflow-hidden rounded-full shadow-inner shadow-black transition-all" style={{ transform: "translate3d(0, 0, 0)" }}>
            
            {/* Camera feed or fallback ocular contours */}
            {hasCamera && (scanningState !== "complete" && scanningState !== "success") ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-60 filter grayscale brightness-110 contrast-125 scale-x-[-1]"
              />
            ) : null}

            {/* Simplified, Elegant Ocular Alignment Target Scope (Uncluttered & High-End) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
              <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] stroke-[#c6b89e]/30 fill-none">
                {/* Single GPU-accelerated spin dashed target ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  strokeWidth="0.3"
                  strokeDasharray="2 4"
                  className="animate-gpu-spin"
                />
                
                {/* Central main framing circle */}
                <circle cx="50" cy="50" r="28" strokeWidth="0.4" stroke="#c6b89e" strokeOpacity="0.4" />
                
                {/* Focus indicator circle */}
                <circle cx="50" cy="50" r="14" strokeWidth="0.5" stroke="#ff4a00" strokeOpacity="0.6" />
                
                {/* Center micro dot */}
                <circle cx="50" cy="50" r="1.5" fill="#ff4a00" />

                {/* Highly aesthetic fine crosshairs */}
                <line x1="50" y1="12" x2="50" y2="88" strokeWidth="0.15" strokeDasharray="2 2" stroke="#ff4a00" strokeOpacity="0.35" />
                <line x1="12" y1="50" x2="88" y2="50" strokeWidth="0.15" strokeDasharray="2 2" stroke="#ff4a00" strokeOpacity="0.35" />

                {/* Outer lock corner tabs */}
                <path d="M 44,44 L 44,42 L 42,42 L 42,44" strokeWidth="0.25" stroke="#c6b89e" strokeOpacity="0.7" />
                <path d="M 56,44 L 56,42 L 58,42 L 58,44" strokeWidth="0.25" stroke="#c6b89e" strokeOpacity="0.7" />
                <path d="M 44,56 L 44,58 L 42,58 L 42,56" strokeWidth="0.25" stroke="#c6b89e" strokeOpacity="0.7" />
                <path d="M 56,56 L 56,58 L 58,58 L 58,56" strokeWidth="0.25" stroke="#c6b89e" strokeOpacity="0.7" />
              </svg>
            </div>

            {/* Active tracking telemetry indicators - Compact & GPU animated */}
            {scanningState === "scanning" && (
              <div className="absolute inset-0 z-15 pointer-events-none select-none">
                <div
                  className="absolute w-1 h-1 bg-[#ff4a00] top-[30%] left-[30%] rounded-full shadow-[0_0_6px_#ff4a00] animate-gpu-pulse-dot"
                />
                <div
                  className="absolute w-1 h-1 bg-[#c6b89e] bottom-[30%] right-[30%] rounded-full shadow-[0_0_6px_#c6b89e] animate-gpu-pulse-dot"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            )}

            {/* Sweeping scan line - Transformed to 100% GPU translation wrapper (Layout friendly) */}
            {scanningState === "scanning" && (
              <div
                className="absolute inset-0 w-full h-full pointer-events-none z-20 animate-gpu-laser"
              >
                <div className="w-full h-[1px] bg-[#ff4a00] shadow-[0_0_8px_#ff4a00] opacity-90" />
              </div>
            )}

            {/* Success unlocked key overlay */}
            <AnimatePresence>
              {(scanningState === "complete" || scanningState === "success") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center p-3 rounded-full border border-green-500/20"
                >
                  <motion.div
                    animate={{ scale: [0.97, 1.05, 0.97] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-8 h-8 rounded-full border border-green-500/30 flex items-center justify-center text-green-400 bg-green-500/5 shadow-[0_0_15px_rgba(74,222,128,0.2)] mb-1.5"
                  >
                    <Unlock className="w-4 h-4 stroke-[1.5]" />
                  </motion.div>
                  <span className="text-[6.5px] uppercase tracking-[1.5px] text-green-400 font-bold">
                    ACCESS GRANTED
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trigger interactive actions */}
          <div className="w-full flex flex-col gap-2 items-center select-none">
            {scanningState === "scanning" ? (
              <button
                type="button"
                onClick={cancelScanning}
                className="w-full max-w-[200px] sm:max-w-xs h-8 sm:h-10 border-[0.5px] border-[#ff4a00] bg-[#ff4a00]/10 hover:bg-[#ff4a00]/20 text-[#fff] font-sans text-[8px] sm:text-[8.5px] tracking-[2px] uppercase font-bold transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md rounded-sm"
              >
                ABORT EXAMINATION
              </button>
            ) : (
              <button
                type="button"
                onClick={startScanning}
                disabled={scanningState === "booting" || scanningState === "complete" || scanningState === "success"}
                className={`w-full max-w-[200px] sm:max-w-xs h-8 sm:h-10 border-[0.5px] font-sans text-[8px] sm:text-[9px] tracking-[2px] uppercase font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center rounded-sm ${
                  scanningState === "complete" || scanningState === "success"
                    ? "bg-green-500/10 border-green-400/30 text-green-400 cursor-not-allowed"
                    : scanningState === "booting"
                    ? "bg-black/40 border-white/5 text-white/20 cursor-not-allowed animate-pulse"
                    : "bg-[#050505] border-[#c6b89e]/45 hover:border-[#ff4a00] hover:bg-[#ff4a00]/5 text-[#c6b89e] hover:text-white"
                }`}
              >
                {scanningState === "complete" || scanningState === "success" ? "VERIFIED PRINCIPAL" : scanningState === "booting" ? "LOADING CRITICAL RECT..." : "INITIALIZE SCAN"}
              </button>
            )}

            {/* Quick manual camera trigger */}
            {hasCamera === false && (
              <button
                type="button"
                onClick={startCamera}
                className="text-[7px] text-[#c6b89e]/60 hover:text-[#ff4a00] uppercase tracking-[1px] flex items-center gap-1 font-mono cursor-pointer transition-colors"
              >
                <Camera className="w-2.5 h-2.5 text-[#ff4a00]" />
                RE-ENGAGE LENS
              </button>
            )}
          </div>

          {/* progress meter */}
          <div className="w-full max-w-[200px] sm:max-w-xs mt-0.5 sm:mt-1">
            <div className="flex justify-between items-center text-[7px] uppercase tracking-[2px] text-white/30 mb-1">
              <span>SCAN SIGN_STRENGTH</span>
              <span className={`font-mono text-[7.5px] font-bold ${scanningState === "complete" || scanningState === "success" ? "text-green-400" : "text-[#c6b89e]"}`}>
                {percent}%
              </span>
            </div>
            
            {/* Compact beautiful segmented bar */}
            <div className="flex gap-[1.5px] sm:gap-[2.5px]">
              {Array.from({ length: 30 }).map((_, index) => {
                const stepVal = index * 3.33;
                const isActive = percent >= stepVal;
                return (
                  <div
                    key={index}
                    className={`h-[3.5px] sm:h-[4.5px] flex-grow transition-all duration-200 ${
                      isActive
                        ? (scanningState === "complete" || scanningState === "success")
                          ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]"
                          : "bg-[#ff4a00] shadow-[0_0_6px_rgba(255,74,0,0.4)]"
                        : "bg-white/5"
                    }`}
                  />
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Footer stats */}
      <div className="text-white/20 text-center pointer-events-none text-[7.5px] sm:text-[8px] uppercase tracking-[3px] sm:tracking-[5px] mt-1 pb-1 flex flex-col md:flex-row justify-between items-center px-2 z-10 border-t border-white/5 pt-2 w-full">
        <span>SECURITY SYSTEMS ONLINE // VIP PORTAL PROPORTIONAL SCALES</span>
        <span className="font-serif italic mt-0.5 md:mt-0 text-[9px] sm:text-[10px] normal-case tracking-[1px] text-[#c6b89e]">
          Exclusive kingshadp.com Atelier Entry
        </span>
      </div>
    </div>
  );
}
