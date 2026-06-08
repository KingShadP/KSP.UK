/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Map, Sparkles, Compass, Eye, Image as ImageIcon, LayoutGrid, Award } from "lucide-react";

interface LoreChapter {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  icon: any;
  summary: string;
  philosophicalCore: string;
  text: string;
}

const LORE_CHAPTERS_DATABASE: LoreChapter[] = [
  {
    id: "chap-01",
    title: "The Miami Sanctuary Humid Isolation",
    subtitle: "FOUNDATION OF THE MYTHOLOGY",
    dateRange: "2020 - 2021",
    icon: Map,
    summary: "The initial psychological shield constructed in coastal Florida apartments amid extreme creative isolation.",
    philosophicalCore: "Bravado, grandiosity, and custom drill tempos serve as an absolute protective fortress against industrial manipulation.",
    text: "Long before we occupied marble halls and digital servers, the blueprint was drawn in high-humidity garages. Surrounded by Florida sea level warnings and absolute isolation, we discovered that building a character god-complex is the only logical response to a flat, predictable industry. The music wasn't crafted to attract casual listeners—it was engineered to build an empire of believers."
  },
  {
    id: "chap-02",
    title: "Aegean Gilt Velocity Transition",
    subtitle: "HIGH-SPEED FLIGHT ARCHITECTURE",
    dateRange: "2022",
    icon: Compass,
    summary: "Escaping public velocity centers to relocate the creative crucible inside hidden sanctuary chambers on Greek shores.",
    philosophicalCore: "High-speed coastal transition tracking. Transitioning from raw regional feedback to pure international luxury isolation.",
    text: "The transition from Miami Beach to the Aegean sea was an act of deliberate self-exile. By physically centering the workshop inside private coastal fortresses surrounded by maritime history, we unlocked a majestic soundscape. Cold, clean synthesizers modeled after spatial sea breezes replaced the heavy humid baselines. We learned to fly with incredible velocity while keeping our secrets close."
  },
  {
    id: "chap-03",
    title: "Sovereign Digital Kingdom",
    subtitle: "THE MATRICULATED FORTRESS",
    dateRange: "2023 - PRESENT",
    icon: ShieldAlert,
    summary: "Unveiling encrypted biometric interfaces, bespoke uniforms, and unreleased studio demo records.",
    philosophicalCore: "Clothing as protective armor. Music as a direct token of alignment for active followers of the mythology.",
    text: "We have fully retired from traditional web spaces. This platform—our digital kingdom—represents a staged 3D marble palace where every pixel serves the creative empire. Here, physical uniforms and acoustic tapes are indistinguishable. We don't just sell apparel; we construct heavy garments that act as a physical companion plate of our sound frequencies, binding the believer's body to our coordinate grid."
  }
];

export default function LoreSection() {
  const [activeChapterId, setActiveChapterId] = useState<string>("chap-01");

  const selectedChapter = LORE_CHAPTERS_DATABASE.find((c) => c.id === activeChapterId) || LORE_CHAPTERS_DATABASE[0];

  return (
    <div id="section-lore" className="w-full flex flex-col gap-16 py-24 mb-12 text-left relative">
      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
        04 // LORE DOSSIER / THEOLOGICAL BLUEPRINTS
      </div>

      {/* --- RECONSTRUCTING PHILOSOPHY & WHY CLOTHING --- */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch select-text">
        
        {/* Left Card: Core Philosophy of God-Complex */}
        <div className="border border-[#c6b89e]/20 bg-black/60 backdrop-blur-md p-8 relative flex flex-col justify-between min-h-[380px]">
          <div className="absolute top-2 right-2 font-mono text-[7px] tracking-[2px] text-white/30">[PHILOSOPHICAL PROTOCOL]</div>
          
          <div>
            <div className="flex items-center gap-2 text-[#ff4a00] mb-4 select-none">
              <Award className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[9px] tracking-[3px] uppercase font-bold">THE INDEPENDENCE FORTRESS</span>
            </div>
            
            <h3 className="font-serif text-2xl md:text-3.5xl text-white tracking-wide uppercase leading-tight">
              The Sovereign God-Complex
            </h3>
            
            <p className="font-sans text-[13.5px] text-white/50 leading-relaxed font-light mt-6 text-justify">
              In an age where algorithmic aggregators dictate human aesthetic expression, maintaining raw personality is a political act. KingShadP’s god-complex is not an expression of vanity—it is a defensive shield. We write music with massive theatrical weight and high comedic confidence to protect the creative soul from flatline corporate templates. We are not mainstream targets; we are private digital rulers.
            </p>
          </div>

          <div className="border-t border-white/5 pt-6 mt-6 select-none flex justify-between items-center bg-black/40 p-4 border border-dashed border-white/10">
            <div>
              <span className="text-[7.5px] font-mono text-white/30 block tracking-[2px] uppercase">STATUS BRIEF</span>
              <span className="text-xs font-mono text-[#c6b89e] tracking-[1.5px] uppercase">CREATIVE DIRECTIVES SECURE</span>
            </div>
            <span className="text-white/40 font-mono text-[9px] tracking-[2px]">[LEVEL: L9]</span>
          </div>
        </div>

        {/* Right Card: Why Clothing is Constructed */}
        <div className="border border-white/5 bg-black/40 p-8 flex flex-col justify-between min-h-[380px]">
          <div className="absolute top-2 right-2 font-mono text-[7px] tracking-[2px] text-white/30">[TACTICAL UNIFORMOLOGY]</div>
          
          <div>
            <div className="flex items-center gap-2 text-[#c6b89e] mb-4 select-none">
              <ShieldAlert className="w-4 h-4 text-[#c6b89e]" />
              <span className="font-mono text-[9px] tracking-[3px] uppercase font-bold">GARMENTS AS SACRED COMPANION PLATES</span>
            </div>
            
            <h3 className="font-serif text-2xl md:text-3.5xl text-white tracking-wide uppercase leading-tight">
              Why We Forge Clothing
            </h3>
            
            <p className="font-sans text-[13.5px] text-white/50 leading-relaxed font-light mt-6 text-justify">
              For KingShadP, clothing is not passive fashion or a commercial side-hustle. It is the physical manifestation of our musical eras. Believers who wear the Armored LS or the Cipher Vest are not customer segments. They are wearing physical armor plates synced straight to the acoustic coordinates of the sound frequencies. To cover your body in these fabrics is to align your coordinates with the digital fortress, shielding yourself against flatline culture.
            </p>
          </div>

          <div className="border-t border-white/10 pt-4 text-[10.5px] font-mono text-[#ff4a00] uppercase tracking-[1.5px] select-none">
            "CLOTHING IS SOUND WE CAN WEAR ON OUR TEXTURE."
          </div>
        </div>
      </div>

      {/* --- CHAPTER SELECTIONS TIMELINE (Interactive deep dives) --- */}
      <div className="border border-white/10 bg-[#060606] p-8 mt-6">
        <div className="text-[9px] font-mono tracking-[4px] text-white/35 uppercase mb-8 select-none">
          CHRONICLER INTERACTIVE CHAPTER DEEP DIVE
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Chapter selection list (Left column) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3 select-none">
            {LORE_CHAPTERS_DATABASE.map((chap) => {
              const isSelected = activeChapterId === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapterId(chap.id)}
                  className={`text-left p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#c6b89e] bg-[#c6b89e]/10 shadow-[0_0_15px_rgba(198,184,158,0.1)]"
                      : "border-white/5 bg-black hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[8px] text-[#ff4a00] tracking-[2px]">0{chap.id.split("-")[1]} // TIME</span>
                    <span className="font-mono text-[9px] text-white/30 font-semibold">{chap.dateRange}</span>
                  </div>
                  <h4 className="font-serif text-[15px] font-normal text-white uppercase">{chap.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Chapter deep dive text (Right column) */}
          <div className="flex-1 border border-white/5 bg-black/60 p-6 md:p-8 flex flex-col justify-between text-justify select-text">
            <div>
              <div className="text-[8px] font-mono text-[#c6b89e] tracking-[3px] uppercase mb-1">
                LORE_DOSSIER // CONFIRMED CHAPTER EXTRACT
              </div>
              <h3 className="font-serif text-xl md:text-3xl text-white font-normal mb-1">{selectedChapter.title}</h3>
              <div className="font-mono text-[9px] text-[#ff4a00] tracking-[2px] uppercase mb-6">{selectedChapter.subtitle}</div>

              <div className="border-[#c6b89e]/20 border-l-2 pl-4 italic text-white/60 mb-6 font-serif text-[13.5px]">
                "{selectedChapter.philosophicalCore}"
              </div>

              <p className="font-sans text-[13.5px] text-white/40 leading-relaxed font-light">
                {selectedChapter.text}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-[9.5px] font-mono text-[#c6b89e]/40 tracking-[2px] uppercase select-none">
              RECORDS SHIELD INTEGRITY COMPILATION COMPLETE // ERA STATUS LOCK: STABLE
            </div>
          </div>
        </div>
      </div>

      {/* --- ENVIRONMENT VISUAL GALLERY --- */}
      <div className="border border-white/5 bg-black/40 p-8 mt-6">
        <div className="flex justify-between items-baseline mb-8 select-none">
          <div>
            <div className="text-[9px] font-mono text-[#ff4a00] tracking-[3px] uppercase mb-1">STAGED PLATFORMS</div>
            <h3 className="font-serif text-xl md:text-3.5xl text-white font-normal uppercase">ENVIRONMENT PLATE GEOMETRIES</h3>
          </div>
          <span className="text-[8px] font-mono text-white/30 tracking-[1.5px] uppercase">[VERIFIED IN SITU]</span>
        </div>

        {/* Gallery grid featuring premium architectural elements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { tag: "PLATE_01 // ATRIUM", title: "Black Marble Entrance", desc: "The defensive threshold leading into the private cybernetic fortress corridors.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop" },
            { tag: "PLATE_02 // COAXIAL", title: "Aegean Cliffside", desc: "Isolated Greek cliffside architecture modulating spacious synth breezes.", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop" },
            { tag: "PLATE_03 // CRUCIBLE", title: "Sovereign Laboratory", desc: "Humid coastal workshop holding custom microchips and vocal recorders.", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop" }
          ].map((plate) => (
            <div key={plate.tag} className="border border-white/5 bg-black/50 p-4 flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="relative aspect-video bg-black select-none overflow-hidden mb-4 border border-white/5">
                <img
                  src={plate.img}
                  alt={plate.title}
                  className="w-full h-full object-cover opacity-45 hover:opacity-70 transition-all duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 text-[8px] font-mono tracking-[1.5px] text-[#c6b89e] bg-black/90 px-2 py-0.5 border border-[#c6b89e]/15 uppercase">
                  {plate.tag}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-lg text-white font-normal mb-1">{plate.title}</h4>
                <p className="font-sans text-[11px] text-white/40 font-light leading-relaxed">{plate.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
