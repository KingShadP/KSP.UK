/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Activity, 
  Flame, 
  Play, 
  Pause, 
  ChevronRight, 
  Fingerprint, 
  FileVideo, 
  Infinity as InfinityIcon, 
  HelpCircle, 
  Eye, 
  Crown,
  Volume2,
  ListRestart
} from "lucide-react";

interface BrandManifestoChronoPortalProps {
  onNavigate?: (tab: "home" | "listen" | "vault" | "artifacts" | "lore" | "community") => void;
  paradoxMode: boolean;
}

// 7-Part Manifesto Data structures
interface ManifestoPart {
  level: string;
  title: string;
  shortSummary: string;
  subtitle: string;
  icon: any;
  philosophicalCore: string;
  points: string[];
}

const MANIFESTO_PARTS: ManifestoPart[] = [
  {
    level: "PART 01",
    title: "WHO IS KINGSHADP?",
    shortSummary: "A creative identity built around music, myth, and personal power.",
    subtitle: "THE CREATOR REALM & VISUAL WORLD-BUILDER",
    icon: Fingerprint,
    philosophicalCore: "Confidence and vulnerability meet under a single majestic self-owned signature, refusing to ever blend in.",
    points: [
      "More than an artist name—a complete kingdom centering command, emotion, and extreme self-made presence.",
      "Creativity is treated like a persistent world, not a temporary hobby. No negotiations with mainstream standards.",
      "Handles pressure, grief, humor, anger, beauty, and massive ambition simultaneously."
    ]
  },
  {
    level: "PART 02",
    title: "THE NAME AS A SIGNATURE",
    shortSummary: "A personal seal that carries the weight of authority and command.",
    subtitle: "STAMP OF EMPIRE PRINCIPLE",
    icon: Crown,
    philosophicalCore: "'King' marks absolute authority. 'Shad' makes it personal. 'P' gives it a sharp final stamp.",
    points: [
      "Works as a royal digital seal, instantly direct, memorable, and entirely self-owned.",
      "An artistic signature destined to mark music releases, heavy garments, and permanent archive registers.",
      "Operates like a locked door, prompting the casual listener to wonder what secrets reside behind the portal."
    ]
  },
  {
    level: "PART 03",
    title: "THE BRAND PERSONALITY",
    shortSummary: "Royal, selective, direct, and intense, holding an obsidian twin-edge.",
    subtitle: "COMPOSED CHARGE & DEFENSIVE REFLECTION",
    icon: Shield,
    philosophicalCore: "A 'don't play with me' edge balanced by intense reflective wisdom that speaks only when precise.",
    points: [
      "Observed, quiet when needed, commanding when vocal, and precise with every frequency broadcasted.",
      "Fuses high physical bravado with deep, raw, and unvarnished emotional currents.",
      "Never tries to please everybody—built specifically to stand firm and resist industrial copycatting."
    ]
  },
  {
    level: "PART 04",
    title: "THE MISSION & MISSION STATEMENT",
    shortSummary: "Turning lived experience and divine pressure into architectural power.",
    subtitle: "PRESENCE OVER RANDOM ATTENTION",
    icon: Flame,
    philosophicalCore: "Persistent world-building transforms raw survival into permanent song, story, and wearable armor.",
    points: [
      "Attention is treated as temporary luxury noise. True presence is configured to last generations.",
      "Connecting music to symbols, colors, and clothing until the world becomes recognizable by feeling alone.",
      "Providing a real human pulse behind highly polished aesthetic shields, allowing believers a sanctuary."
    ]
  },
  {
    level: "PART 05",
    title: "CORE REALM SYMBOLS & MARKS",
    shortSummary: "Protecting the core geometry marks of the sovereign sanctuary.",
    subtitle: "SYMBOLIC SYSTEM REGISTRY",
    icon: Activity,
    philosophicalCore: "Protecting the five core symbols that command identity recognition across physical and digital planes.",
    points: [
      "Giragon: The mythic creature blending a giraffe's tall elegance with majestic dragon wings. Power & rarity.",
      "Halo Crown: Representation of authority, divinity, personal restraint, and royal lineage.",
      "SP Crest & KSP Monogram: Formal legacy seals stamping our garments as authorized companion plates."
    ]
  },
  {
    level: "PART 06",
    title: "THE CREATIVE UNIVERSE & SOUND",
    shortSummary: "Music as the core gravity. Analog oscillators meeting clinical sci-fi visuals.",
    subtitle: "THE ACOUSTIC INTEGRITY CRUCIBLE",
    icon: FileVideo,
    philosophicalCore: "Rejecting industrial loops to capture first-person energy direct to digital memory units.",
    points: [
      "Fusing extreme confidence and human frustration over heavy, customized hardware synthesizers.",
      "Clothing acts as wearable sound waves, binding the active follower's physical coordinates to our grid.",
      "A living, growing database of growth—every release, lyric, and illustration behaves as a permanent archive."
    ]
  },
  {
    level: "PART 07",
    title: "THE AUDIENCE & EMPIRE STANDARD",
    shortSummary: "For people who feel different, think deeply, and respect true craft.",
    subtitle: "THE SOVEREIGN SECTOR ALIGNMENT",
    icon: InfinityIcon,
    philosophicalCore: "Providing an elite experience with deep meaning for those who refuse to water down their identity.",
    points: [
      "Connecting with individuals who understand struggle, transformation, and personal reinvention.",
      "A community that notices details, rejects lazy templates, and respects dedicated aesthetic devotion.",
      "The ultimate signature of creative control: Choosing presence over passive performance."
    ]
  }
];

// 4 MP4 Video Portals Data
interface VideoPortalFeed {
  id: string;
  name: string;
  url: string;
  description: string;
  status: string;
  frequency: string;
}

const CHRONO_PORTALS: VideoPortalFeed[] = [
  {
    id: "portal-01",
    name: "The Architecture of a Presence",
    url: "/The_Architecture_of_a_Presence.mp4",
    description: "The primary digital portal. Focuses on the grand marble entries, columns, and spatial fog geometry of the private kingdom.",
    status: "PORTAL_LOCKED // SHIELDED",
    frequency: "877.29 MHz"
  },
  {
    id: "portal-02",
    name: "Grok Portal Quantum Grid",
    url: "/grok-video-8499d2b9-086f-45f4-901e-e75c87098469.mp4",
    description: "Deep dimensional quantum matrix interface. Tracking timeline branches and high-resonance parallel universe coordinate points.",
    status: "TEMPORAL_HOT // ONLINE",
    frequency: "555.08 MHz"
  },
  {
    id: "portal-03",
    name: "Aether Spacetime Core",
    url: "/grok-video-9b5f3cfc-647d-442c-9e8a-d68d20062bd9.mp4",
    description: "Sovereign power manifold tracking energetic fluctuations across multi-layered timeline anchors.",
    status: "CORE_STABLE // ACTIVE",
    frequency: "777.10 MHz"
  },
  {
    id: "portal-04",
    name: "Grok Quantum Tunneling B (720p)",
    url: "/grok-c6920801-c236-481f-84e0-4ae930d1bdd4-720p.mp4",
    description: "Accelerated visual tunnel. Tracks raw light sweeps, gold particles, and dimensional shift tracks.",
    status: "TUNNEL_STABLE // 720P",
    frequency: "419.00 MHz"
  },
  {
    id: "portal-05",
    name: "Grok Hyper-Jump Vector A",
    url: "/grok-video-b79bdd1d-d99a-49fc-81f9-764959713bd3.mp4",
    description: "Holographic vector tracking the flight paths from Miami Beach garages to the Aegean Gilt shoreline sanctuaries.",
    status: "VECTOR_HOT // ACTIVE",
    frequency: "991.02 MHz"
  },
  {
    id: "portal-06",
    name: "Warp Dimensional Anchor 87a",
    url: "/87a0378c-8aaa-40d4-a1a4-e25dc3bac64d.mp4",
    description: "Deep-layer antimatter monitoring of timeline mutations. Logs OMEGA parallel spectrum fluctuations.",
    status: "ANCHOR_MUTATED // VOID",
    frequency: "000.99 MHz"
  }
];

export default function BrandManifestoChronoPortal({ onNavigate, paradoxMode }: BrandManifestoChronoPortalProps) {
  const [activePartIdx, setActivePartIdx] = useState(0);
  const [activePortalIdx, setActivePortalIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(true);
  const [portalTelemetryLog, setPortalTelemetryLog] = useState("CHRONO_PORTAL SECURED: Waiting for temporal alignment...");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const activePart = MANIFESTO_PARTS[activePartIdx];
  const activePortal = CHRONO_PORTALS[activePortalIdx];

  // Sync volume state with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, activePortalIdx]);

  const handleSelectPortal = (idx: number) => {
    setActivePortalIdx(idx);
    setIsPlaying(true);
    triggerTelemetryLog(`CHRONO_PORTAL SWITCH: Channeling spacetime feed '${CHRONO_PORTALS[idx].name}' (${CHRONO_PORTALS[idx].frequency})`);
  };

  const triggerTelemetryLog = (msg: string) => {
    setPortalTelemetryLog(msg);
    window.dispatchEvent(
      new CustomEvent("telemetry-log", {
        detail: { message: msg, type: paradoxMode ? "WARNING" : "SYSTEM" }
      })
    );
  };

  const toggleVideoPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
      triggerTelemetryLog("FEED STREAM FROZEN: Suspended temporal rendering frame.");
    } else {
      v.play().catch(e => console.error("Playback error on empty mp4 placeholder:", e));
      setIsPlaying(true);
      triggerTelemetryLog("FEED STREAM RESUMED: Restoring live spatial timeline tracking.");
    }
  };

  return (
    <div className={`w-full border p-6 md:p-8 relative mt-12 transition-all duration-700 ${
      paradoxMode 
        ? "border-[#8bb9dc]/40 bg-black/85 shadow-[0_0_35px_rgba(139,185,220,0.15)]" 
        : "border-[#c6b89e]/30 bg-black/70 shadow-[0_0_25px_rgba(198,184,158,0.06)]"
    }`}>
      
      {/* Decorative corners */}
      <span className={`absolute -top-[1.5px] -left-[1.5px] w-4 h-4 border-t-2 border-l-2 ${paradoxMode ? "border-[#8bb9dc]" : "border-[#c6b89e]"} pointer-events-none`} />
      <span className={`absolute -bottom-[1.5px] -right-[1.5px] w-4 h-4 border-b-2 border-r-2 ${paradoxMode ? "border-[#8bb9dc]" : "border-[#c6b89e]"} pointer-events-none`} />

      {/* Grid subtle header overlay */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-8">
        <div>
          <span className={`font-mono text-[8px] tracking-[4px] uppercase block mb-1 ${paradoxMode ? "text-[#8bb9dc]" : "text-[#ff4a00]"}`}>
            {paradoxMode ? "Ω OMEGA SYSTEM PARADOX DIRECTIVES" : "α ALPHA SYSTEM GOLD MANIFESTO"}
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-white tracking-widest uppercase">
            BRAND MANIFESTO & CHROMO-PORTAL THEATRE
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${paradoxMode ? "bg-purple-500 animate-ping shadow-[0_0_6px_#9c7cf4]" : "bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]"}`} />
          <span className="font-mono text-[7px] text-white/40 tracking-[2px] uppercase">
            {paradoxMode ? "DIMENSION: OMEGA_PARADOX_999" : "DIMENSION: ALPHA_REALM_097"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ================= LEFT COLUMN: THE 7-PART BRAND MANIFESTO INTERACTIVE DISK ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#c6b89e] mb-4">
              <span className={`font-mono text-[9px] tracking-[3px] uppercase font-bold ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`}>
                I // THE 7-PART BRAND ARCHITECTURE & IDENTITY
              </span>
            </div>

            {/* Part selection pagination indicators */}
            <div className="flex flex-wrap gap-1.5 pb-4 border-b border-white/5">
              {MANIFESTO_PARTS.map((part, index) => {
                const isActive = index === activePartIdx;
                return (
                  <button
                    key={part.level}
                    onClick={() => {
                      setActivePartIdx(index);
                      triggerTelemetryLog(`MANIFESTO DECRYPT: Retrieved Brand Manifesto '${part.level} // ${part.title}'`);
                    }}
                    className={`px-3 py-2 text-[8px] font-mono tracking-[2px] border transition-all cursor-pointer focus:outline-none ${
                      isActive
                        ? paradoxMode
                          ? "border-[#8bb9dc] bg-[#8bb9dc]/15 text-white font-bold"
                          : "border-[#c6b89e] bg-[#c6b89e]/15 text-white font-bold"
                        : "border-white/5 bg-black/45 text-white/40 hover:text-white/80 hover:border-white/10"
                    }`}
                  >
                    {part.level}
                  </button>
                );
              })}
            </div>

            {/* Active Part content block */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePartIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 pt-2"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 border rounded-sm shrink-0 ${paradoxMode ? "border-[#8bb9dc]/30 bg-[#8bb9dc]/5" : "border-[#c6b89e]/20 bg-[#c6b89e]/5"}`}>
                    {(() => {
                      const IconComp = activePart.icon;
                      return <IconComp className={`w-6 h-6 ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`} />;
                    })()}
                  </div>

                  <div>
                    <span className="font-mono text-[8px] text-white/30 tracking-[3px] block">{activePart.subtitle}</span>
                    <h4 className="font-serif text-xl sm:text-2.5xl text-white tracking-widest uppercase mt-0.5">
                      {activePart.title}
                    </h4>
                    <p className={`font-mono text-[10px] tracking-[1.5px] mt-1 italic ${paradoxMode ? "text-[#8bb9dc]/75" : "text-[#c6b89e]/75"}`}>
                      &ldquo;{activePart.shortSummary}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Core Philosophy Box */}
                <div className="p-4 border border-dashed border-white/15 bg-black/40 text-justify">
                  <span className="text-[7.5px] font-mono text-white/40 block tracking-[2px] uppercase mb-1">PHILOSOPHICAL INSIGHT</span>
                  <p className="font-serif text-[13.5px] text-white/90 leading-relaxed font-light">
                    {activePart.philosophicalCore}
                  </p>
                </div>

                {/* Details Points list with customized styled checkboxes */}
                <div className="space-y-3">
                  <span className="text-[7px] font-mono text-white/30 tracking-[2px] block uppercase">CO-ORDINATE BULLETINS:</span>
                  {activePart.points.map((pt, i) => (
                    <div key={i} className="flex gap-3 items-start select-text leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${paradoxMode ? "bg-[#8bb9dc]" : "bg-[#c6b89e]"} animate-pulse`} />
                      <p className="text-[12.5px] font-sans text-white/60 font-light leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-black/20 p-4">
            <div>
              <span className="text-[7.5px] font-mono text-white/30 block tracking-[2px] uppercase">IDENTITY DISPATCH</span>
              <span className={`text-[10px] font-mono tracking-[1.5px] uppercase font-bold ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`}>
                {activePart.level} DECRYPTED // VERIFIED SECURE
              </span>
            </div>
            
            <button
              onClick={() => onNavigate && onNavigate("lore")}
              className={`px-5 py-2.5 border font-mono text-[8px] tracking-[2px] uppercase transition-all duration-300 cursor-pointer text-center focus:outline-none ${
                paradoxMode
                  ? "border-[#8bb9dc]/30 text-[#8bb9dc] hover:bg-[#8bb9dc] hover:text-black"
                  : "border-[#c6b89e]/30 text-[#c6b89e] hover:bg-[#c6b89e] hover:text-black"
              }`}
            >
              [ OPEN FULL LORE DOSSIER ]
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE HARDWARE CHRONO-PORTAL VIDEO PLAYBACK FEED ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-black/55 border border-white/5 p-6 relative">
          <div className="absolute top-2 right-3 font-mono text-[6px] text-white/20">PORTAL_FEED_MATRIX</div>
          
          <div className="space-y-5">
            <div>
              <span className={`text-[8px] font-mono tracking-[2px] block uppercase ${paradoxMode ? "text-[#8bb9dc]" : "text-[#ff4a00]"}`}>
                II // CHRONO-PORTAL STREAM SENSOR
              </span>
              <h4 className="font-serif text-[17px] text-white uppercase mt-0.5">SPATIAL CINEMATIC PORTALS</h4>
            </div>

            {/* Video preview viewport */}
            <div className="relative aspect-video w-full bg-black border border-white/10 group overflow-hidden">
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30 z-10 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30 z-10 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30 z-10 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30 z-10 pointer-events-none" />
              
              {/* Sci-fi Overlay Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-40" />

              {/* Real Video Element loading from user paths */}
              <video
                ref={videoRef}
                src={activePortal.url}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? "opacity-75" : "opacity-35"}`}
              />

              {/* Beautiful Sci-fi Hologram animation in case the raw MP4 empty file cannot show visual details */}
              <div className="absolute inset-0 bg-transparent flex flex-col justify-center items-center pointer-events-none select-none p-4 text-center z-5">
                {/* Visual grid sweeps */}
                <div className="w-12 h-12 rounded-full border border-dashed border-[#c6b89e]/30 flex items-center justify-center animate-spin" style={{ animationDuration: "16s" }}>
                  <div className={`w-8 h-8 rounded-full border border-[#ff4a00]/20 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                    <Fingerprint className={`w-4 h-4 ${paradoxMode ? "text-[#8bb9dc]/40" : "text-[#ff4a00]/40"}`} />
                  </div>
                </div>
                
                <span className="font-mono text-[7.5px] text-white/50 tracking-[3px] uppercase mt-4">
                  {isPlaying ? "SOLITARY PORTAL SYMMETRY ACTIVE" : "STREAM_FEED_HOLST_FREEZE"}
                </span>
                
                <span className={`font-mono text-[6.5px] mt-1 tracking-[1.5px] ${paradoxMode ? "text-[#8bb9dc]/70" : "text-[#c6b89e]/70"}`}>
                  {activePortal.frequency} // {activePortal.status}
                </span>
              </div>

              {/* Left/Right live scanning laser line */}
              {isPlaying && (
                <div className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#8bb9dc]/75 to-transparent shadow-[0_0_8px_rgba(139,185,220,0.5)] z-10 animate-pulse`} style={{ animationDuration: "3s" }} />
              )}

              {/* Video stats HUD box overlay */}
              <div className="absolute inset-x-0 top-0 p-2.5 bg-gradient-to-b from-black/95 to-transparent flex justify-between items-start font-mono text-[7.5px] text-white/40 pointer-events-none z-10 select-none">
                <div>
                  <span className={`font-bold ${paradoxMode ? "text-[#8bb9dc]" : "text-[#ff4a00]"}`}>CHANNEL: 0{activePortalIdx + 1}</span>
                  <div className="text-white/60 block truncate max-w-[120px] font-serif uppercase tracking-[0.5px] mt-0.5">{activePortal.name}</div>
                </div>

                <div className="text-right space-y-0.5 text-[6.5px]">
                  <div>DEC_RATE: {(30).toFixed(0)}_P/S</div>
                  <div className={paradoxMode ? "text-purple-400" : "text-emerald-400"}>SENS_OK</div>
                </div>
              </div>
            </div>

            {/* Play/Pause control suite bar */}
            <div className="flex justify-between items-center bg-black/45 p-2 border border-white/5 font-mono text-[8px] text-[#c6b89e]">
              <button
                onClick={toggleVideoPlay}
                className={`p-1.5 border border-white/10 hover:border-white text-white transition-colors cursor-pointer focus:outline-none`}
                title={isPlaying ? "Mute Sensor Feed" : "Unmute Sensor Feed"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 px-2 border border-white/5 hover:border-white font-mono text-[7px] text-white/60 hover:text-white uppercase cursor-pointer"
                >
                  {isMuted ? "[ AUD_OFF ]" : "[ AUD_ON ]"}
                </button>
              </div>

              <div className="text-[7px] tracking-[1px] text-white/40 select-none">
                COORD: 25.7617&deg; N
              </div>
            </div>

            {/* Selector list */}
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {CHRONO_PORTALS.map((portal, idx) => {
                const isActive = idx === activePortalIdx;
                return (
                  <div
                    key={portal.id}
                    onClick={() => handleSelectPortal(idx)}
                    className={`p-2.5 border transition-all duration-300 cursor-pointer flex justify-between items-center select-none ${
                      isActive
                        ? paradoxMode
                          ? "border-[#8bb9dc] bg-[#8bb9dc]/10"
                          : "border-[#c6b89e] bg-[#c6b89e]/10"
                        : "border-white/5 bg-black/35 hover:border-white/15"
                    }`}
                  >
                    <div>
                      <div className="font-serif text-[11px] font-semibold text-white uppercase flex items-center gap-1.5">
                        <span className={`w-1 h-1 rounded-full ${isActive ? (paradoxMode ? "bg-[#8bb9dc]" : "bg-[#ff4a00]") : "bg-white/20"}`} />
                        {portal.name}
                      </div>
                      <div className="text-[8px] font-mono text-white/30 uppercase mt-0.5 tracking-[1px]">{portal.status}</div>
                    </div>
                    <span className="font-mono text-[7.5px] text-white/50 tracking-[1.5px] uppercase">{portal.frequency}</span>
                  </div>
                );
              })}
            </div>

            {/* Selected description details */}
            <p className="font-sans text-[11.5px] text-white/40 leading-relaxed font-light text-justify px-1 pt-1">
              {activePortal.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[7px] space-y-1">
            <div className={`uppercase tracking-[2px] block ${paradoxMode ? "text-[#8bb9dc]/80" : "text-[#ff4a00]/80"}`}>
              TEMPORAL DEVIATION REPORT LOG:
            </div>
            <div className="bg-black/80 p-2 text-[7.5px] leading-normal text-white/60 border border-white/10 select-text font-mono tracking-wide uppercase">
              {portalTelemetryLog}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
