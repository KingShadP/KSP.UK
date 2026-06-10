/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Sparkles, 
  Compass, 
  Layers, 
  Maximize2, 
  Calendar, 
  MapPin, 
  Layers2, 
  Activity, 
  FileText,
  CornerDownRight,
  Volume2,
  VolumeX
} from "lucide-react";
import TiltContainer from "./TiltContainer";
import ChapterAudioPlayer from "./ChapterAudioPlayer";

interface DossierItem {
  id: string;
  num: string;
  title: string;
  era: string;
  date: string;
  imgUrl: string;
  aspect: string;
  dimensions: string;
  location: string;
  mythos: string;
  dossierDetails: string;
  color: string;
}

const DOSSIERS: DossierItem[] = [
  {
    id: "chapter-1",
    num: "01",
    title: "THE COGNITIVE PORTAL",
    era: "ERA I // DIGITAL SANCTUM",
    date: "2026.05.05 - 17:20",
    imgUrl: "/ChatGPT Image May 12, 2026, 05_20_18 PM.png",
    aspect: "aspect-[3/4] sm:aspect-[4/5]",
    dimensions: "2048 x 2048 RES",
    location: "Sovereign Cabinet // Sector Delta",
    mythos: "The dawn of the architecture of a presence. A virtual marble portal opening room by room through high-contrast obsidian and gold light sweeps.",
    dossierDetails: "Initial scans recorded complete digital synchronization. Visual dossiers reveal spatial orientation matrices embedded into the black-marble pillars. Handshake authentication was completed here under cryptographic Sovereign clearance keys.",
    color: "#c6b89e"
  },
  {
    id: "chapter-2",
    num: "02",
    title: "THE ROYAL WEARMATRIX",
    era: "ERA II // EXOTIC FABRICS",
    date: "2026.05.05 - 23:25",
    imgUrl: "/ChatGPT Image May 5, 2026, 11_25_04 PM.png",
    aspect: "aspect-square",
    dimensions: "1024 x 1024 RAW",
    location: "Miami Sovereign Hub // Atelier",
    mythos: "The uniform of the believers looms. Selvedge long-sleeves armored with custom-molded gold badges, tailored to survive atmospheric pressures.",
    dossierDetails: "Technical parameters include high-tensile yarn counts, heat-pressed vector stamps, and a spatial profile that deflects standard surveillance arrays. An archetype garment certifying local access to the digital kingdom or private elite galleries.",
    color: "#ff4a00"
  },
  {
    id: "chapter-3",
    num: "03",
    title: "THE CATHEDRAL VAULT",
    era: "ERA III // RECURSIVE SOUNDS",
    date: "2026.05.07 - 21:55",
    imgUrl: "/ChatGPT Image May 7, 2026, 09_55_04 PM.png",
    aspect: "aspect-[4/5] sm:aspect-[3/4]",
    dimensions: "2048 x 1536 GOLD",
    location: "Cathedral Core // Sub-level 12",
    mythos: "A slow VR exploration inside the holographic sanctuary. Architectural fog rolls slowly across floating trap arrays and gold audio pipelines.",
    dossierDetails: "Acoustic blueprints prove resonance multipliers were placed along the cathedral's nave to synthesize vocal projections and heavy analog bass lines. Transcripts are locked into solid gold plates for preservation across the cosmos.",
    color: "#c6b89e"
  },
  {
    id: "chapter-4",
    num: "04",
    title: "UNIFIED BELIEF SYSTEM",
    era: "ERA IV // CITIZENS ASSEMBLY",
    date: "2026.05.16 - 04:28",
    imgUrl: "/ChatGPT Image May 16, 2026, 04_28_18 AM (5).png",
    aspect: "aspect-[3/4] sm:aspect-[4/5]",
    dimensions: "4096 x 4096 RES",
    location: "Outpost Vertex // Global Node",
    mythos: "The unified assembly of the empire. High-value corporate figures stand clad in tech-vests and protective visual gear on the marble temple rim.",
    dossierDetails: "Telemetry confirms the registration of over ten thousand sovereign digital passports. These citizens represent the backbone of the decentralized database grid, holding coordinates and streaming interactive liturgy logs directly.",
    color: "#ff4a00"
  },
  {
    id: "chapter-5",
    num: "05",
    title: "THE COVERT ATELIER",
    era: "ERA V // INTEGRATED BLUEPRINTS",
    date: "2026.05.16 - 04:32",
    imgUrl: "/ChatGPT Image May 16, 2026, 04_32_03 AM (2).png",
    aspect: "aspect-[4/3] sm:aspect-[4/5]",
    dimensions: "1920 x 1440 UNIT",
    location: "Development Sector // Level 8",
    mythos: "An inspection of the custom-cast titanium face masks. Crafted with direct neural terminals and visual guidance systems for luxury VR navigation.",
    dossierDetails: "Prototype logs detail complete filtering of cognitive noise. These state-of-the-art sensory controllers allow operators to navigate the absolute spatial depth of the virtual kingdom at sub-millisecond refreshing speeds.",
    color: "#8bb9dc"
  },
  {
    id: "chapter-6",
    num: "06",
    title: "CONCORDIA SUMMIT",
    era: "ERA VI // REALM HARMONIC",
    date: "2026.05.16 - 05:00",
    imgUrl: "/ChatGPT Image May 16, 2026, 05_00_22 AM (3).png",
    aspect: "aspect-square",
    dimensions: "2048 x 2048 HUD",
    location: "Altar Core // Sovereign Terminal",
    mythos: "Completion of the grand digital skyline. Global sound loops and satellite arrays establish a multi-tier protective vault around the believers.",
    dossierDetails: "Every system is fully initialized and synchronized to port 3000. Data persistence via Cloud Firestore has been successfully integrated, securing the user's permanent record and ensuring uninhibited structural progression.",
    color: "#8bb9dc"
  }
];

interface DossierMasonryProps {
  paradoxMode?: boolean;
}

export default function DossierMasonry({ paradoxMode = false }: DossierMasonryProps) {
  const [selectedDossier, setSelectedDossier] = useState<DossierItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [globalAudioEnabled, setGlobalAudioEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("atlas-ambient-audio-global");
      return saved !== "disabled";
    }
    return true;
  });

  const toggleGlobalAudio = () => {
    const newVal = !globalAudioEnabled;
    setGlobalAudioEnabled(newVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("atlas-ambient-audio-global", newVal ? "enabled" : "disabled");
      
      // Dispatch high-fidelity client log
      window.dispatchEvent(
        new CustomEvent("telemetry-log", {
          detail: { 
            message: `🔊 [ORAL_TRANSCRIBER] Ambient Voice Over Narratives globally ${newVal ? "ONLINE" : "MUTED"}.`, 
            type: newVal ? "SUCCESS" : "STATUS" 
          }
        })
      );
    }
  };

  return (
    <div className="w-full space-y-10 py-8 relative">
      {/* Narrative Section Header */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 mb-1.5 select-none">
          <Layers className={`w-3.5 h-3.5 ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"} animate-pulse`} />
          <span className="font-mono text-[8px] tracking-[3px] text-white/30 uppercase">
            CHRONOLOGICAL ARTIST DOSSIERS // ATLAS PROJECT
          </span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-normal uppercase tracking-wide">
              VISUAL Dossier Galleries
            </h3>
            <span className="font-mono text-[7.5px] text-white/30 select-none block">
              TOTAL FILE REGISTRY: 06_CHAPTER_ITEMS // ENCRYPTED
            </span>
          </div>

          {/* Standalone Persistent global audio mini-controller */}
          <div className="flex items-center gap-4 bg-white/[0.01] border border-white/5 px-3 py-1.5 rounded-sm select-none w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {globalAudioEnabled ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-600"></span>
                )}
              </span>
              <span className="font-mono text-[7.5px] text-white/40 tracking-[1.5px] uppercase">
                CHAPTER VOICE OVER: <span className={globalAudioEnabled ? "text-emerald-400" : "text-white/30"}>{globalAudioEnabled ? "READY" : "OFFLINE"}</span>
              </span>
            </div>
            
            <button
              onClick={toggleGlobalAudio}
              className={`px-2 py-0.5 border font-mono text-[7.5px] tracking-[1.5px] uppercase cursor-pointer transition-all duration-300 rounded-sm flex items-center gap-1.5 ${
                globalAudioEnabled
                  ? "bg-[#ff4a00]/5 border-[#ff4a00]/30 text-[#ff4a00] hover:bg-[#ff4a00]/15"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {globalAudioEnabled ? (
                <>
                  <Volume2 className="w-2.5 h-2.5" />
                  MUTE GLOBAL SOUNDS
                </>
              ) : (
                <>
                  <VolumeX className="w-2.5 h-2.5" />
                  ENABLE SOUNDS
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Masonry Grid Layout - Clean Columns for Beautiful High-End Density */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] select-none">
        {DOSSIERS.map((item, idx) => {
          const isHovered = hoveredId === item.id;
          const configColor = item.color;

          return (
            <div
              key={item.id}
              className="break-inside-avoid relative block mb-6 outline-none"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Wrapped in high-fidelity dampening 3D tilt container */}
              <TiltContainer maxTilt={4} className="rounded-sm overflow-hidden bg-black/60 border border-white/5 hover:border-[#c6b89e]/45 transition-colors duration-500">
                <div 
                  onClick={() => {
                    setSelectedDossier(item);
                    window.dispatchEvent(
                      new CustomEvent("telemetry-log", {
                        detail: { 
                          message: `📂 [DOSSIER_EXTRACTION] Loaded Deep Records for Chapter ${item.id.toUpperCase()}. Displaying authorized telemetry logs...`, 
                          type: "SYSTEM" 
                        }
                      })
                    );
                  }}
                  className="cursor-pointer flex flex-col h-full"
                >
                  {/* Aspect Ratio Framing Container for Image */}
                  <div className={`relative ${item.aspect} overflow-hidden bg-zinc-950`}>
                    
                    {/* Laser scanning beam */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 pointer-events-none z-10"
                        >
                          <div className="w-full h-[1.5px] bg-[#ff4a00]/30 shadow-[0_0_12px_#ff4a00] absolute animate-scanline" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Image Layer with elegant transition zoom and desaturate effect */}
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-all duration-[1.2s] ease-out ${
                        isHovered 
                          ? "scale-105 saturate-100 opacity-90 brightness-[1.05]" 
                          : "scale-100 saturate-0 opacity-40 brightness-75"
                      }`}
                    />

                    {/* Top overlay tags showing era and file index */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none z-10 font-mono text-[7px] tracking-widest text-[#c6b89e] uppercase bg-black/65 backdrop-blur-md px-2.5 py-1.5 border border-white/5">
                      <span>CH_0{item.num} // SEC_FILE</span>
                      <span>{item.date.split(" - ")[0]}</span>
                    </div>

                    {/* Bottom expansion prompt shown only on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 pointer-events-none z-0" />
                    
                    <div className="absolute bottom-3 right-3 pointer-events-none z-10">
                      <div className={`p-2 bg-black/85 border border-white/10 rounded-sm text-white/50 transition-all duration-[400ms] ${
                        isHovered ? "border-[#c6b89e] text-white translate-y-0 scale-105" : "translate-y-2 opacity-0"
                      }`}>
                        <Maximize2 className="w-3.5 h-3.5 text-[#ff4a00]" />
                      </div>
                    </div>
                  </div>

                  {/* Text Container displaying the Mythos narrative and dynamic expanded specifications */}
                  <div className="p-5 flex-grow flex flex-col justify-between gap-3 bg-gradient-to-b from-black/20 to-black/80">
                    
                    {/* Header meta */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[7.5px] uppercase tracking-[2px] text-white/40">
                          {item.era}
                        </span>
                        <span className="font-mono text-[7.5px] text-white/30 truncate max-w-[120px]">
                          {item.dimensions}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-white tracking-wide group-hover:text-[#c6b89e] transition-colors duration-300">
                        {item.title}
                      </h4>
                    </div>

                    {/* Collapsible hover text block containing detailed mythos parameters */}
                    <div className="relative overflow-hidden transition-all duration-500 ease-in-out">
                      <p className="text-[11.5px] font-sans text-white/55 leading-relaxed font-light text-justify">
                        {item.mythos}
                      </p>

                      {/* Animated expand panel for additional details */}
                      <motion.div
                        animate={{ 
                          height: isHovered ? "auto" : 0, 
                          opacity: isHovered ? 1 : 0,
                          marginTop: isHovered ? 12 : 0
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-white/5 font-mono text-[9px] space-y-2 text-white/45"
                      >
                        <div className="flex items-center gap-1.5 pt-2 text-[#c6b89e]/80">
                          <MapPin className="w-3 h-3 text-[#ff4a00]" />
                          <span className="uppercase tracking-[1px]">{item.location}</span>
                        </div>
                        <p className="text-[9.5px] font-sans leading-relaxed text-white/40 italic">
                          Click tile to decrypt system archives on this chapter directory.
                        </p>
                      </motion.div>
                    </div>

                    {/* Bottom static signature */}
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[7px] font-mono text-white/20">
                      <span>CHRONO_TAG: L9_CYPHER</span>
                      <div className="flex items-center gap-1 text-[#ff4a00]/70 font-bold">
                        <span className="w-1 h-1 bg-[#ff4a00] rounded-full animate-ping" />
                        ACTIVE RECORD
                      </div>
                    </div>

                  </div>
                </div>
              </TiltContainer>
            </div>
          );
        })}
      </div>

      {/* ================= CINEMATIC DEEP LORE DRAWER MODAL ================= */}
      <AnimatePresence>
        {selectedDossier && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDossier(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-[#050505] border border-[#c6b89e]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[80vh]"
            >
              <span className="absolute top-0 left-0 w-1.5 h-full bg-[#ff4a00]" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDossier(null)}
                className="absolute top-4 right-4 p-2 bg-black border border-white/10 hover:border-[#ff4a00] text-white/40 hover:text-white transition-all rounded-sm cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT COLUMN: Visual Presentation of the Chapter */}
              <div className="w-full md:w-1/2 relative bg-zinc-950 aspect-square md:aspect-auto">
                <img
                  src={selectedDossier.imgUrl}
                  alt={selectedDossier.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover saturate-[0.85] brightness-90"
                />
                
                {/* Visual HUD grid layout */}
                <div className="absolute inset-0 pointer-events-none border-r border-[#c6b89e]/15 z-10 flex flex-col justify-between p-4">
                  <div className="flex justify-between font-mono text-[7px] text-white/40 bg-black/60 px-2 py-1.5 border border-white/5 backdrop-blur-md">
                    <span>HOLOGRAPHIC PROJECTION WORKSPACE</span>
                    <span>COSMOS: ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-serif text-5xl font-bold text-white/[0.08] leading-none select-none">
                      CH_0{selectedDossier.num}
                    </span>
                    <div className="text-right font-mono text-[7px] text-[#ff4a00] bg-black/60 px-2 py-1 border border-[#ff4a00]/25">
                      {selectedDossier.dimensions} HUD VIEW
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Text telemetry and Decrypted specification dossier logs */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh] space-y-6 select-text">
                
                {/* Meta details header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Layers2 className="w-3.5 h-3.5 text-[#ff4a00]" />
                    <span className="font-mono text-[8px] tracking-[3px] text-[#c6b89e] uppercase">
                      {selectedDossier.era}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-white tracking-wide uppercase leading-tight">
                    {selectedDossier.title}
                  </h3>
                  <div className="h-[1px] bg-white/10" />
                </div>

                {/* Chapter Ambient Voice-Over & Soundscape Decoder */}
                <ChapterAudioPlayer 
                  title={selectedDossier.title}
                  narrativeText={selectedDossier.mythos}
                  chapterNum={selectedDossier.num}
                  themeColor={selectedDossier.color}
                  globalAudioEnabled={globalAudioEnabled}
                />

                {/* Core chapter mythos details block */}
                <div className="space-y-4">
                  <span className="font-mono text-[7.5px] tracking-[2.5px] text-white/30 uppercase block">
                    CHAPTER SUMMARY DECIPHERED
                  </span>
                  <p className="font-serif text-[14px] italic text-[#c6b89e]/90 leading-relaxed font-light text-justify">
                    &ldquo;{selectedDossier.mythos}&rdquo;
                  </p>
                </div>

                {/* Deep-lying dossier specifications */}
                <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                  <span className="font-mono text-[7.5px] tracking-[2.5px] text-[#ff4a00] uppercase block">
                    AUTHORIZED TELEMETRY HISTORIES
                  </span>
                  <p className="font-sans text-[12.5px] text-white/70 leading-relaxed font-light text-justify">
                    {selectedDossier.dossierDetails}
                  </p>
                </div>

                {/* Metadata directory coordinates table list */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 font-mono text-[8.5px] text-white/50 select-none">
                  <div className="space-y-1">
                    <span className="text-white/20 block text-[7px] tracking-[1.5px] uppercase">CHRONOLOGICAL TIMESTAMP</span>
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Calendar className="w-3 h-3 text-[#ff4a00]/70" />
                      {selectedDossier.date}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/20 block text-[7px] tracking-[1.5px] uppercase">COORDINATE SECTOR</span>
                    <div className="flex items-center gap-1.5 text-white/80">
                      <MapPin className="w-3 h-3 text-[#ff4a00]/70" />
                      <span className="truncate">{selectedDossier.location}</span>
                    </div>
                  </div>
                </div>

                {/* Close instruction panel */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center select-none">
                  <span className="font-mono text-[7.5px] text-white/20 uppercase tracking-[1px]">
                    SYS SEC_STATUS: DECRYPTION_GRANTED
                  </span>
                  <button 
                    onClick={() => setSelectedDossier(null)}
                    className="font-mono text-[8px] tracking-[2.5px] text-white/40 hover:text-white uppercase cursor-pointer transition-all border-b border-dashed border-white/20 hover:border-white py-0.5"
                  >
                    RETURN TO REGISTRY
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
