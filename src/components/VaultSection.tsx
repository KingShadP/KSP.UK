/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, History, Sparkles, Filter, Calendar, BookOpen, ExternalLink, ArrowRight } from "lucide-react";

interface VaultRelease {
  title: string;
  era: "Sovereign Spatial" | "Aegean Gilt" | "Miami Heritage";
  year: number;
  type: "Official Single" | "Rough Tape Draft" | "Remix Bundle" | "Live Session";
  platformMetric: string;
  connectedArtifact: { title: string; price: string };
  description: string;
}

const VAULT_ITEMS_DATABASE: VaultRelease[] = [
  {
    title: "Regal Echoes of GOD (Demo)",
    era: "Sovereign Spatial",
    year: 2024,
    type: "Rough Tape Draft",
    platformMetric: "5.77K Plays on Audiomack",
    connectedArtifact: { title: "ARMORED LS", price: "420.00" },
    description: "Our closest look at perfect sovereign vocal performance. Captured in one take with analog pre-amps."
  },
  {
    title: "UNFINISHED. UNEDITED. UNTITLED",
    era: "Sovereign Spatial",
    year: 2023,
    type: "Official Single",
    platformMetric: "12.4K Plays on Spotify",
    connectedArtifact: { title: "CIPHER VEST", price: "580.00" },
    description: "Stripped-back performance focusing purely on vocals and hard rhythmic frames. No commercial filters."
  },
  {
    title: "Velocity Vectors // Flight Log",
    era: "Aegean Gilt",
    year: 2022,
    type: "Live Session",
    platformMetric: "4.1K Views on YouTube",
    connectedArtifact: { title: "CORRIDOR PARKA", price: "720.00" },
    description: "Live recording of synthesized wind tracks layered with deep vocal loops, recalling flight states."
  },
  {
    title: "Maintain Velocity",
    era: "Aegean Gilt",
    year: 2022,
    type: "Official Single",
    platformMetric: "8.9K Plays on SoundCloud",
    connectedArtifact: { title: "GILT LOGO CAP", price: "95.00" },
    description: "Lush digital soundwaves and high-speed synth paths traversing from coastal Florida to Greek shores."
  },
  {
    title: "God is a Woman (Remix)",
    era: "Miami Heritage",
    year: 2021,
    type: "Remix Bundle",
    platformMetric: "63.2K Runs on SoundCloud",
    connectedArtifact: { title: "SOCIETY MASK // L9", price: "1,850.00" },
    description: "A theatrical drill flipping of legendary pop vocals to assert sovereign independence."
  },
  {
    title: "Gilded Chaos // Manifest",
    era: "Miami Heritage",
    year: 2020,
    type: "Rough Tape Draft",
    platformMetric: "3.1K Plays on Audiomack",
    connectedArtifact: { title: "BRASS SEAL SIGIL", price: "120.00" },
    description: "Deep-south home studio recordings capturing the comedic bravado of the initial empire vision."
  }
];

interface EraData {
  id: "Sovereign Spatial" | "Aegean Gilt" | "Miami Heritage";
  years: string;
  theme: string;
  aesthetic: string;
  notes: string;
}

const ERAS_DEFINITIONS: EraData[] = [
  {
    id: "Sovereign Spatial",
    years: "2023 - PRESENT",
    theme: "Sovereign Digital Kingdom",
    aesthetic: "Tactical dark-marble panels, heavy custom uniforms, encryption logs, private biometric gates.",
    notes: "A total shift to mythic character-driven world building where music acts as a physical protective fortress. Creation of bespoke garments as tokens of era alignment."
  },
  {
    id: "Aegean Gilt",
    years: "2022",
    theme: "High-Speed Aegis Isolation",
    aesthetic: "Polished platinum, flight-recorder telemetry, golden light shafts, digital wind waves.",
    notes: "Captures the high-velocity flight from humid American coastal centers to isolating sanctuaries in Greece. Synthesizers reflect spacious shores and personal empire velocity."
  },
  {
    id: "Miami Heritage",
    years: "2020 - 2021",
    theme: "Raw Garage Foundations",
    aesthetic: "Deep bronze, neon backlights, humid studio logs, raw microphone feedback loops.",
    notes: "Where the mythology began. Raw experimental drill and DIY pop beats written to shield the psyche while mapping the grandiose dreams of a digital emperor."
  }
];

interface VaultSectionProps {
  onNavigate: (tab: "home" | "listen" | "vault" | "artifacts" | "lore" | "community") => void;
}

export default function VaultSection({ onNavigate }: VaultSectionProps) {
  const [activeEraFilter, setActiveEraFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortByDateDesc, setSortByDateDesc] = useState<boolean>(true);

  // Computed display items
  const filteredItems = VAULT_ITEMS_DATABASE.filter((item) => {
    const matchesEra = activeEraFilter === "All" || item.era === activeEraFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  }).sort((a, b) => {
    return sortByDateDesc ? b.year - a.year : a.year - b.year;
  });

  return (
    <div id="section-vault" className="w-full flex flex-col gap-16 py-24 mb-12 text-left relative">
      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
        03 // COAXIAL CHRONICLER / HISTORICAL VAULT
      </div>

      {/* --- INTERACTIVE ERA TIMELINE --- */}
      <div className="mt-10 border border-white/5 bg-black/40 p-8 select-none relative">
        <div className="absolute top-2 right-2 text-[#c6b89e]/20 font-mono text-[7px] tracking-[2px] uppercase">[SYS_ERA_ALIGN]</div>
        
        <div className="text-[9px] font-mono tracking-[4px] text-white/40 uppercase mb-8">
          MYTHIC TIMELINE CO-ORDINATE SYSTEM
        </div>

        {/* Visual timeline bar */}
        <div className="relative flex flex-col md:flex-row gap-8 justify-between items-stretch mt-4 border-l md:border-l-0 md:border-t border-[#c6b89e]/30 pt-6 pl-6 md:pl-0">
          
          {/* Horizontal/Vertical connector helper background lines */}
          <div className="absolute top-[-1px] left-0 w-full h-[1.5px] bg-[#c6b89e]/20 hidden md:block" />
          
          {ERAS_DEFINITIONS.map((era, idx) => {
            const isSelected = activeEraFilter === era.id;
            return (
              <div
                key={era.id}
                onClick={() => setActiveEraFilter(era.id)}
                className={`flex-1 flex flex-col justify-between group cursor-pointer border p-5 transition-all ${
                  isSelected
                    ? "border-[#c6b89e] bg-[#c6b89e]/5 shadow-[0_0_20px_rgba(198,184,158,0.1)]"
                    : "border-white/5 bg-[#030303]/60 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-mono text-[9px] text-[#ff4a00] tracking-[2px] font-mono">0{idx + 1} // ERA</span>
                    <span className="font-mono text-[10px] text-white/50 tracking-[1.5px] font-semibold">{era.years}</span>
                  </div>
                  
                  <h4 className="font-serif text-[18px] text-white font-medium group-hover:text-[#c6b89e] transition-colors uppercase">
                    {era.id}
                  </h4>
                  <div className="text-[10px] font-mono tracking-[1.5px] text-[#c6b89e] uppercase mt-1">
                    {era.theme}
                  </div>
                  
                  <p className="text-[11.5px] font-sans text-white/40 leading-relaxed font-light mt-4 text-justify">
                    {era.aesthetic}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6 text-[11px] font-sans text-white/60 text-justify italic font-light font-serif">
                  "{era.notes}"
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SEARCH, FILTER & SORT INTERFACES --- */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch select-none">
        {/* Search input field */}
        <div className="flex-1 bg-black/60 border border-white/10 px-4 py-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH VAULT TITLES OR CONTEXTS..."
            className="flex-1 bg-transparent font-mono text-[11px] tracking-[2px] outline-none border-none text-white placeholder-white/30 uppercase"
          />
        </div>

        {/* Filters and sort desk */}
        <div className="flex gap-4 items-stretch">
          <div className="border border-white/10 bg-black/60 px-4 flex items-center gap-3">
            <Filter className="w-4 h-4 text-[#c6b89e]" />
            <select
              value={activeEraFilter}
              onChange={(e) => setActiveEraFilter(e.target.value)}
              className="bg-transparent font-mono text-[10px] tracking-[2px] text-white/70 outline-none border-none uppercase cursor-pointer py-3 pr-4"
            >
              <option value="All">ALL HISTORICAL ERAS</option>
              <option value="Sovereign Spatial">SOVEREIGN SPATIAL</option>
              <option value="Aegean Gilt">AEGEAN GILT</option>
              <option value="Miami Heritage">MIAMI HERITAGE</option>
            </select>
          </div>

          <button
            onClick={() => setSortByDateDesc(!sortByDateDesc)}
            className="border border-[#c6b89e]/30 hover:border-[#c6b89e] bg-black/60 px-6 font-mono text-[10px] tracking-[2px] uppercase text-[#c6b89e] cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {sortByDateDesc ? "NEWEST FIRST" : "OLDEST FIRST"}
          </button>
        </div>
      </div>

      {/* --- HISTORICAL LISTINGS COAXIAL GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-text mb-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full border border-dashed border-white/10 p-12 text-center text-white/20 font-mono text-xs tracking-[3px] uppercase bg-black/20"
            >
              NO CORRESPONDING RECORD UNITS RETRIEVED
            </motion.div>
          ) : (
            filteredItems.map((valInfo) => (
              <motion.div
                key={valInfo.title}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border border-white/5 bg-[#050505] p-6 flex flex-col justify-between hover:border-white/20 transition-all text-justify min-h-[280px] relative"
              >
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-[#c6b89e]/30" />
                
                <div>
                  <div className="flex justify-between items-baseline mb-4 select-none">
                    <span className="text-[8px] font-mono text-white/30 tracking-[2px] bg-white/5 px-2 py-0.5 uppercase">
                      {valInfo.type}
                    </span>
                    <span className="text-[9px] font-mono text-[#c6b89e] tracking-[1.5px] uppercase">
                      {valInfo.year}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-normal text-white mb-2 leading-snug">
                    {valInfo.title}
                  </h4>
                  
                  <span className="text-[7.5px] font-mono text-[#ff4a00] tracking-[1px] uppercase block mb-4 select-none">
                    ERA: {valInfo.era.toUpperCase()}
                  </span>

                  <p className="font-sans text-[12.5px] text-white/50 leading-relaxed font-light mb-6">
                    {valInfo.description}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 select-none flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-black/60 p-2.5 border border-white/5">
                    <div>
                      <span className="text-[7px] font-mono text-white/30 block uppercase tracking-[1.5px]">CONNECTED ARTIFACT</span>
                      <span className="text-[10px] font-mono text-[#c6b89e] uppercase font-bold tracking-[0.5px]">{valInfo.connectedArtifact.title}</span>
                    </div>
                    <button
                      onClick={() => onNavigate("artifacts")}
                      className="text-[9px] font-mono text-[#ff4a00] hover:underline uppercase tracking-[2px]"
                    >
                      [ BUY / FORGE ]
                    </button>
                  </div>

                  <div className="text-[8.5px] font-mono text-white/40 tracking-[1.5px] uppercase mt-2">
                    VERIFIED REACH: {valInfo.platformMetric}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* --- LORE CALL-TO-ACTION TERMINAL --- */}
      <div className="bg-[#0b0b0c] border border-[#ff4a00]/20 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-[#ff4a00] shrink-0 animate-pulse" />
          <div>
            <h4 className="font-serif text-xl font-normal text-white tracking-wide">
              RETRACE THE DEEPER MYTHOLOGY.
            </h4>
            <p className="font-sans text-[12.5px] text-white/40 mt-1 font-light max-w-xl">
              Why do we construct clothing lines? What are the underlying philosophical foundations? Enter the complete catalog logs and gallery.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("lore")}
          className="px-6 py-4 border border-[#ff4a00] text-[#ff4a00] hover:bg-[#ff4a00]/10 font-mono text-[9px] tracking-[3px] uppercase block shrink-0 cursor-pointer text-center select-none"
        >
          [ EXTRACT LORE DOSSIER ]
        </button>
      </div>

    </div>
  );
}
