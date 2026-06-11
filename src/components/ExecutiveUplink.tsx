import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ExecutiveUplinkProps {
  onAccessGranted: () => void;
}

export default function ExecutiveUplink({ onAccessGranted }: ExecutiveUplinkProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [diagnosticText, setDiagnosticText] = useState("STANDBY COORDINATES DETECTED // SECURE CORE");

  const progressRef = useRef(0);
  const audioIntervalRef = useRef<any>(null);

  // Synthesize soft mechanical tick / hum using Web Audio API
  const playSoftTick = (freq: number = 220, vol: number = 0.04) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio permissions bypass
    }
  };

  // Synthesize full digital lock alignment release sequence
  const playLockReleaseSymphony = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Master heavy physical latch release thud
      const latchOsc = ctx.createOscillator();
      const latchGain = ctx.createGain();
      latchOsc.type = "sine";
      latchOsc.frequency.setValueAtTime(80, now);
      latchOsc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
      latchGain.gain.setValueAtTime(0.4, now);
      latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      latchOsc.connect(latchGain);
      latchGain.connect(ctx.destination);
      latchOsc.start();
      latchOsc.stop(now + 0.5);

      // Celestial golden chime chord (D-major luxury scale: F#5 -> A5 -> D6)
      const chimeFreqs = [739.99, 880.00, 1174.66];
      chimeFreqs.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
        chimeGain.gain.setValueAtTime(0.08, now + idx * 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start();
        chimeOsc.stop(now + 1.6);
      });
    } catch {
      // Audio permissions bypass
    }
  };

  // Update diagnostic text logs on alignment stages
  useEffect(() => {
    if (progressVal === 0) {
      setDiagnosticText("ATELIER GATEWAY KEYWAY ENGAGED [0/100]");
    } else if (progressVal < 30) {
      setDiagnosticText(`AUTHENTICATING BIOMETRIC IMPULSE: ${progressVal}%`);
    } else if (progressVal < 65) {
      setDiagnosticText(`DECRYPTING EPHEMERIS CORE INTERSECTIONS: ${progressVal}%`);
    } else if (progressVal < 95) {
      setDiagnosticText(`MATRICULATING VIRTUAL REALM PORTAL VECTORS: ${progressVal}%`);
    } else {
      setDiagnosticText("AUTHENTICATED. WELCOME TO THE SECTOR.");
    }
  }, [progressVal]);

  // Click-and-hold progress controller loop
  useEffect(() => {
    let animFrame: number;
    
    const updateProgress = () => {
      if (isPressing && !isLocked) {
        progressRef.current = Math.min(100, progressRef.current + 1.25);
        setProgressVal(Math.floor(progressRef.current));
        
        if (progressRef.current >= 100) {
          setIsLocked(true);
          setIsPressing(false);
          playLockReleaseSymphony();
          setTimeout(() => {
            onAccessGranted();
          }, 1400); // Allow maximum dramatic zoom alignment payout
          return;
        }
      } else if (!isLocked) {
        progressRef.current = Math.max(0, progressRef.current - 1.8);
        setProgressVal(Math.floor(progressRef.current));
      }
      
      animFrame = requestAnimationFrame(updateProgress);
    };

    animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, [isPressing, isLocked, onAccessGranted]);

  // Mechanical ticking feedback during active holding
  useEffect(() => {
    if (isPressing && !isLocked) {
      audioIntervalRef.current = setInterval(() => {
        // Frequency increases pitch as target alignment is approached
        const currentFreq = 220 + (progressRef.current * 4.5);
        const volume = 0.04 + (progressRef.current * 0.001);
        playSoftTick(currentFreq, volume);
      }, 100);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPressing, isLocked]);

  return (
    <div className="fixed inset-0 z-50 bg-[#060606] text-[#c9c6c5] flex flex-col justify-between p-8 sm:p-12 font-sans select-none overflow-hidden select-none">
      
      {/* Decorative ultra-thin golden corner accents */}
      <div className="absolute top-8 left-8 w-12 h-[1px] bg-[#dcc57b]/30" />
      <div className="absolute top-8 left-8 w-[1px] h-12 bg-[#dcc57b]/30" />
      <div className="absolute top-8 right-8 w-12 h-[1px] bg-[#dcc57b]/30" />
      <div className="absolute top-8 right-8 w-[1px] h-12 bg-[#dcc57b]/30" />
      
      <div className="absolute bottom-8 left-8 w-12 h-[1px] bg-[#dcc57b]/30" />
      <div className="absolute bottom-8 left-8 w-[1px] h-12 bg-[#dcc57b]/30" />
      <div className="absolute bottom-8 right-8 w-12 h-[1px] bg-[#dcc57b]/30" />
      <div className="absolute bottom-8 right-8 w-[1px] h-12 bg-[#dcc57b]/20" />

      {/* Marginals Header System */}
      <div className="flex justify-between items-start text-[7.5px] font-mono tracking-[4px] uppercase text-[#c9c6c5]/25">
        <div>
          <span>AVARICE CHRONOMETER SYSTEM v1.3</span>
        </div>
        <div className="text-right">
          <span>PRIVATE ATELIER // MATRICULATED ENTITY</span>
        </div>
      </div>

      {/* Main Center Area holding the Rare Compass alignment */}
      <div className="my-auto flex flex-col items-center justify-center max-w-lg mx-auto w-full relative">
        
        {/* Cinematic Zoom Container when fully authenticated */}
        <motion.div
          animate={isLocked ? {
            scale: 5.5,
            opacity: [1, 0],
            filter: "blur(2px)"
          } : {
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 1.3,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center justify-center"
        >
          {/* Subtly glowing outer radial coordinates */}
          <div className="absolute font-mono text-[6px] tracking-[2px] text-[#dcc57b]/30 -top-8 select-none">
            [ LAT 47.3769° N // LON 8.5417° E ]
          </div>

          {/* Core Astronomical Portal Dial Viewport */}
          <div className="relative w-56 h-56 items-center justify-center flex mb-8 select-none">
            
            {/* Outer Compass Tick Dial (Clockwise rotation) */}
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(220,197,123,0.12)",
                borderRadius: "9999px",
                position: "absolute"
              }}
              animate={{
                rotate: isPressing ? 360 + (progressVal * 3) : 360
              }}
              transition={{
                rotate: isPressing ? { duration: 15, repeat: Infinity, ease: "linear" } : { duration: 60, repeat: Infinity, ease: "linear" }
              }}
              className="flex items-center justify-center"
            >
              <div className="absolute w-[95%] h-[95%] border border-[rgba(201,198,197,0.06)] rounded-full border-dashed" />
              {/* Compass points ticks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-1 h-3 bg-[#dcc57b]/30"
                  style={{
                    transform: `rotate(${deg}deg) translateY(-108px)`,
                  }}
                />
              ))}
            </motion.div>

            {/* Middle Chronometer Ring with Roman hours (Counter-Clockwise rotation) */}
            <motion.div
              style={{
                width: "82%",
                height: "82%",
                border: "1px solid rgba(201,198,197,0.15)",
                borderRadius: "9999px",
                position: "absolute"
              }}
              animate={{
                rotate: isPressing ? -360 - (progressVal * 4.5) : -360
              }}
              transition={{
                rotate: isPressing ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 45, repeat: Infinity, ease: "linear" }
              }}
              className="flex items-center justify-center text-[7.5px] font-serif tracking-[1px] text-[#c9c6c5]/40"
            >
              <span className="absolute transform -translate-y-20 select-none">XII</span>
              <span className="absolute transform translate-x-20 select-none">III</span>
              <span className="absolute transform translate-y-20 select-none">VI</span>
              <span className="absolute transform -translate-x-20 select-none">IX</span>
              
              {/* Delicate alignment lines within middle dial */}
              <div className="absolute w-full h-[0.5px] bg-[#c9c6c5]/5" />
              <div className="absolute h-full w-[0.5px] bg-[#c9c6c5]/5" />
            </motion.div>

            {/* Inner Alignment Status Gate Arc */}
            <svg className="absolute w-36 h-36 transform -rotate-90 pointer-events-none select-none">
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="transparent"
                stroke="rgba(220, 197, 123, 0.08)"
                strokeWidth="1.5"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="transparent"
                stroke="#dcc57b"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - progressVal / 100)}`}
                className="transition-all duration-75"
              />
            </svg>

            {/* Touch Point: The Golden Celestial Diamond Sovereign Sigil */}
            <motion.div
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
              onTouchStart={() => setIsPressing(true)}
              onTouchEnd={() => setIsPressing(false)}
              className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none outline-none ${
                isPressing 
                  ? "bg-[#dcc57b]/12 shadow-[0_0_30px_rgba(220,197,123,0.25)] border border-[#dcc57b]" 
                  : "bg-[#0b0b0b] border border-[#c9c6c5]/25 hover:border-[#dcc57b]/60 hover:bg-black/80"
              }`}
              style={{
                touchAction: "none"
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Spinning particle core */}
              <motion.div
                animate={isPressing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-4 h-4 border border-[#dcc57b] rotate-45 flex items-center justify-center shadow-[0_0_8px_rgba(220,197,123,0.30)]"
              >
                <div className="w-1 h-1 bg-[#93000a] rounded-full" />
              </motion.div>
            </motion.div>

          </div>

          {/* Elegant Display Labels */}
          <h2 className="font-serif text-[#c9c6c5] text-lg sm:text-xl tracking-[18px] uppercase text-center ml-[18px] mb-2 font-medium">
            KINGSHADP
          </h2>
          
          <span className="font-sans text-[7.5px] tracking-[4px] text-[#dcc57b] uppercase font-bold block mb-8 text-center select-none">
            SOVEREIGN ARCHITECTURAL ATRIUM
          </span>
        </motion.div>

        {/* Central interactive instructional board */}
        <div className="w-full max-w-[340px] text-center px-4">
          <p className="text-[10px] font-serif italic text-[#c9c6c5]/40 leading-relaxed mb-6 select-none">
            "We build the architecture of sovereignty. Hold your cursor down over the central alignment sigil to release the heavy chambers."
          </p>

          <div className="p-3 bg-black/40 border border-white/5 space-y-2">
            {/* Live diagnostic telemetry readout */}
            <div className="font-mono text-[7px] text-left text-white/30 truncate flex justify-between select-none">
              <span>ACTIVE SYS_FEED:</span>
              <span className="text-[#dcc57b] font-bold">ONLINE</span>
            </div>
            
            <div className="font-mono text-[8px] text-[#c9c6c5]/80 text-center tracking-[1px] uppercase min-h-[12px] break-all select-none selection:bg-transparent">
              {diagnosticText}
            </div>

            {/* Hairline tactile progress meter */}
            <div className="w-full h-[1px] bg-white/5 relative overflow-hidden select-none">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#93000a] to-[#dcc57b] transition-all duration-75"
                style={{ width: `${progressVal}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[6.5px] font-mono text-[#c9c6c5]/30">
              <span>COORDINATE LOCK_INDEX: SEC01</span>
              <span>{progressVal}/100 ALIGNED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer System Margin */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-[7.5px] font-mono tracking-[3px] text-[#c9c6c5]/25 pt-4 border-t border-[#c9c6c5]/5 w-full uppercase gap-2">
        <span>EXCLUSIVITY ASSURED ENGINE // NO RETENTION POLICY REGISTERED</span>
        <span className="font-serif italic text-[10.5px] normal-case tracking-[1.5px] text-[#dcc57b]/45 mt-1 sm:mt-0 font-medium select-none">
          Avarice High-Luxury Collective
        </span>
      </div>

    </div>
  );
}
