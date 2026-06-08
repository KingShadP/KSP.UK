/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Headphones, Sparkles, Radio, HelpCircle, ArrowRight, ExternalLink, RefreshCw, AudioLines } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import SanctuaryAmbient from "./SanctuaryAmbient";

interface Release {
  id: string;
  title: string;
  era: string;
  year: number;
  mood: "Raw" | "Experimental" | "Melodic" | "Funny" | "Chaotic";
  type: "Official" | "Draft" | "Remix";
  plays: string;
  description: string;
  mythology: string;
  img: string; // Style coordinates
  platformLinks: { label: string; url: string }[];
}

const RELEASES_DATABASE: Release[] = [
  {
    id: "rel-01",
    title: "Regal Echoes of GOD (Demo)",
    era: "Sovereign Spatial",
    year: 2024,
    mood: "Experimental",
    type: "Draft",
    plays: "5.77K plays",
    description: "The god-complex made audible. Absolute system protection in high-tension environments.",
    mythology: "Recorded in complete isolation under Miami beach conditions. Formulates an acoustic fortress where sovereign identity rules over corporate distraction.",
    img: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=600&auto=format&fit=crop",
    platformLinks: [
      { label: "Audiomack", url: "https://audiomack.com" },
      { label: "SoundCloud", url: "https://soundcloud.com" }
    ]
  },
  {
    id: "rel-02",
    title: "UNFINISHED. UNEDITED. UNTITLED",
    era: "Sovereign Spatial",
    year: 2023,
    mood: "Raw",
    type: "Official",
    plays: "12.4K plays",
    description: "Brutalist acoustic outlines. Stuttering percussion and unfiltered vocal feeds.",
    mythology: "An absolute rejection of polished single mixes. The raw, unpolished static demonstrates that beauty resides in structured imperfection and raw confidence.",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    platformLinks: [
      { label: "Spotify", url: "https://spotify.com" },
      { label: "Apple Music", url: "https://apple.com" }
    ]
  },
  {
    id: "rel-03",
    title: "God is a Woman (Remix)",
    era: "Miami Heritage",
    year: 2021,
    mood: "Chaotic",
    type: "Remix",
    plays: "63.2K plays",
    description: "A grandiose statement of physical and spiritual presence. The female deity as king.",
    mythology: "Flipping timeless pop frequencies into aggressive DIY drill structures. It highlights the divine matrix of the queen as absolute sovereign of the empire.",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
    platformLinks: [
      { label: "SoundCloud", url: "https://soundcloud.com" },
      { label: "YouTube", url: "https://youtube.com" },
      { label: "Spotify", url: "https://spotify.com" }
    ]
  },
  {
    id: "rel-04",
    title: "Maintain Velocity",
    era: "Aegean Gilt",
    year: 2022,
    mood: "Melodic",
    type: "Official",
    plays: "8.9K plays",
    description: "High-speed coastal transition tracking. Lush synthwaves and rhythmic coastal flows.",
    mythology: "Capturing the fast flight mechanics from Miami Beach to the Aegean sea sanctuary. Elegant, golden-ratio production backing confident status statements.",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    platformLinks: [
      { label: "SoundCloud", url: "https://soundcloud.com" },
      { label: "Audiomack", url: "https://audiomack.com" }
    ]
  },
  {
    id: "rel-05",
    title: "Gilded Chaos // Manifest",
    era: "Miami Heritage",
    year: 2020,
    mood: "Funny",
    type: "Draft",
    plays: "3.1K plays",
    description: "Humor blended with extreme bravado. High pitch, accelerated synth beats.",
    mythology: "Recorded on single-channel microphone nodes inside coastal Florida apartments. Explores the ridiculous grandiosity of building a private estate from scratch.",
    img: "https://images.unsplash.com/photo-1543728741-ee98a285d634?q=80&w=600&auto=format&fit=crop",
    platformLinks: [
      { label: "Audiomack", url: "https://audiomack.com" }
    ]
  }
];

interface ListenSectionProps {
  onNavigate: (tab: "home" | "listen" | "vault" | "artifacts" | "lore" | "community") => void;
}

type FilterTab = "all" | "era" | "mood" | "drafts" | "remixes";

export default function ListenSection({ onNavigate }: ListenSectionProps) {
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>("all");
  const [selectedEra, setSelectedEra] = useState<string>("All");
  const [selectedMood, setSelectedMood] = useState<string>("All");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [releases, setReleases] = useState<Release[]>(RELEASES_DATABASE);

  // Hook up CMS database real-time loading
  useEffect(() => {
    // Primary retrieval from file database
    fetch("/api/cms")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Local API read fallback.");
      })
      .then((data) => {
        if (data && Array.isArray(data.releases)) {
          setReleases(data.releases);
        }
      })
      .catch((err) => console.log("Releases Fallback Active:", err));

    // Listen for live updates dispatched by the administrative desk
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && Array.isArray(customEvent.detail.releases)) {
        setReleases(customEvent.detail.releases);
      }
    };

    window.addEventListener("cms-data-updated", handleCmsUpdate);
    return () => {
      window.removeEventListener("cms-data-updated", handleCmsUpdate);
    };
  }, []);

  // Filter computation
  const filteredReleases = releases.filter((rel) => {
    if (activeFilterTab === "drafts") {
      return rel.type === "Draft";
    }
    if (activeFilterTab === "remixes") {
      return rel.type === "Remix";
    }
    if (activeFilterTab === "era" && selectedEra !== "All") {
      if (selectedEra === "2024") return rel.year === 2024;
      if (selectedEra === "2023") return rel.year === 2023;
      if (selectedEra === "2022") return rel.year === 2022;
      if (selectedEra === "Earlier") return rel.year <= 2021;
    }
    if (activeFilterTab === "mood" && selectedMood !== "All") {
      return rel.mood === selectedMood;
    }
    return true;
  });

  return (
    <div id="section-listen" className="w-full flex flex-col gap-16 py-24 mb-12 text-left relative">
      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase">
        02 // SOVEREIGN AUDIO TRANSMISSION / LISTEN
      </div>

      {/* --- FEATURED RELEASE HEADER --- */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left column: Dynamic soundboard deck */}
        <div className="lg:col-span-7 bg-black/60 backdrop-blur-3xl border border-[#c6b89e]/20 p-6 md:p-8 flex flex-col justify-between min-h-[440px] relative shadow-2xl">
          <div className="absolute top-0 left-0 w-24 h-[1.5px] bg-[#ff4a00]" />
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[9px] tracking-[4px] text-white/40 uppercase">
                CHANNEL CONTROLLER DECK // STANDALONE PLAYER
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" />
                <span className="font-mono text-[8px] text-[#c6b89e] tracking-[2px]">LINE INTEGRITY SECURE</span>
              </div>
            </div>

            {/* Custom embedded simulated audio controller */}
            <AudioPlayer />
          </div>

          <div className="border-t border-white/10 pt-6 mt-6 select-text">
            <h4 className="font-mono text-[8.5px] tracking-[3px] text-[#c6b89e] uppercase mb-2">FEATURED RECORD STORY:</h4>
            <div className="text-xl font-serif italic text-white mb-2">GOD IS A WOMAN (Remix)</div>
            <p className="font-sans text-[12.5px] text-white/50 leading-relaxed font-light">
              This remix fuses aggressive DIY underground flows with beautiful pop stems. Re-engineered straight into titanium flash units, the track strips the performance down to pure vocal authority, raw baseline grids, and comedic theater breaks.
            </p>
          </div>
        </div>

        {/* Right column: Platforms listing & Specs */}
        <div className="lg:col-span-5 bg-[#050505] border border-white/5 p-8 flex flex-col justify-between text-justify min-h-[440px] relative">
          <div>
            <div className="text-[9px] font-mono text-[#c6b89e] tracking-[3px] uppercase mb-2">STREAMING CONSOLE CREDENTIAL DISTRICT</div>
            <h3 className="font-serif text-2xl text-white tracking-wide">All Music. All Platforms.</h3>
            <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light mt-3 mb-6">
              Unlike traditional corporate artists who live behind algorithmic paywalls, our distribution nodes are fully encrypted and open-source. Choose your access terminal below to listen anywhere.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "SoundCloud", plays: "395 Believers", path: "https://soundcloud.com" },
                { name: "Audiomack", plays: "5.77K Era Plays", path: "https://audiomack.com" },
                { name: "Spotify", plays: "Sovereign Wave", path: "https://spotify.com" },
                { name: "Apple Music", plays: "Verified S5", path: "https://apple.com" }
              ].map((plat) => (
                <a
                  key={plat.name}
                  href={plat.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-[#c6b89e]/15 bg-black/40 hover:bg-[#93000a]/20 hover:border-[#93000a] transition-all flex flex-col justify-between"
                >
                  <span className="text-[14px] text-white font-serif italic">{plat.name}</span>
                  <span className="text-[8px] font-mono tracking-[1.5px] text-white/30 uppercase mt-2">{plat.plays}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 mt-6 select-none flex justify-between items-center bg-black/40 p-4 border border-dashed border-white/10">
            <div>
              <span className="text-[7.5px] font-mono text-white/30 block tracking-[2px] uppercase">UPGRADE PATHWAY</span>
              <span className="text-xs font-mono text-[#c6b89e] tracking-[1.5px] uppercase">GUEST SUITE ACTIVE</span>
            </div>
            <button
              onClick={() => onNavigate("artifacts")}
              className="text-[#ff4a00] font-mono text-[9px] tracking-[1.5px] uppercase hover:underline inline-flex items-center gap-1.5"
            >
              OWN AN ERA <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* --- SANCTUARY AMBIENT AUDIO ENVIRONMENT PANEL --- */}
      <div className="mt-8">
        <SanctuaryAmbient />
      </div>

      {/* --- FILTER & SORT OPTIONS TABS --- */}
      <div className="mt-6">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-white/10 pb-6 mb-8 select-none">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "ALL FREQUENCIES" },
              { id: "era", label: "FILTER BY ERA" },
              { id: "mood", label: "FILTER BY MOOD" },
              { id: "drafts", label: "ROUGH DRAFTS" },
              { id: "remixes", label: "REMIXES & COVERS" }
            ].map((tab) => {
              const isSelected = activeFilterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilterTab(tab.id as any);
                    setExpandedCard(null);
                  }}
                  className={`text-[9px] font-mono tracking-[3px] uppercase px-5 py-3 border.transition-all cursor-pointer ${
                    isSelected
                      ? "border border-[#c6b89e] bg-white text-black font-semibold"
                      : "border border-white/10 bg-black/40 text-white/50 hover:border-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sub-selectors overlay */}
          <AnimatePresence mode="wait">
            {activeFilterTab === "era" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-2"
              >
                {["All", "2024", "2023", "2022", "Earlier"].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedEra(y)}
                    className={`px-3 py-1.5 border font-mono text-[8px] tracking-[1px] uppercase transition-all cursor-pointer ${
                      selectedEra === y ? "border-[#ff4a00] text-[#ff4a00] bg-red-950/20" : "border-white/5 bg-black text-white/40"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </motion.div>
            )}

            {activeFilterTab === "mood" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap gap-2"
              >
                {["All", "Raw", "Experimental", "Melodic", "Funny", "Chaotic"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMood(m)}
                    className={`px-3 py-1.5 border font-mono text-[8px] tracking-[1px] uppercase transition-all cursor-pointer ${
                      selectedMood === m ? "border-[#ff4a00] text-[#ff4a00] bg-red-950/20" : "border-white/5 bg-black text-white/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- DYNAMIC RELEASE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text mb-12">
          {filteredReleases.length === 0 ? (
            <div className="col-span-full border border-white/15 bg-black/60 p-12 text-center text-white/30 font-mono text-xs tracking-widest uppercase">
              NO MATCHING BROADCAST FREQUENCIES LOCKED IN SECTOR
            </div>
          ) : (
            filteredReleases.map((release) => {
              const isExpanded = expandedCard === release.id;
              return (
                <div
                  key={release.id}
                  className="border border-white/10 bg-black/40 p-6 flex flex-col md:flex-row gap-6 hover:border-white/20 transition-all text-justify"
                >
                  {/* Card design artwork preview */}
                  <div className="w-full md:w-1/3 aspect-square bg-black relative border border-white/5 select-none overflow-hidden">
                    <img
                      src={release.img}
                      alt={release.title}
                      className="w-full h-full object-cover opacity-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3">
                      <span className="text-[7.5px] font-mono text-[#c6b89e] tracking-[1.5px] bg-black/80 border border-[#c6b89e]/20 px-2 py-0.5 uppercase block max-w-max">
                        {release.mood}
                      </span>
                    </div>
                  </div>

                  {/* Context and platform elements */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-baseline select-none">
                        <span className="font-mono text-[8px] text-white/30 tracking-[2.5px] uppercase">{release.era}</span>
                        <span className="font-mono text-[8.5px] text-[#ff4a00] font-bold">{release.plays}</span>
                      </div>
                      
                      <h4 className="font-serif text-lg md:text-xl text-white font-medium mt-1 leading-tight">{release.title}</h4>
                      <p className="font-sans text-[12px] text-white/50 leading-relaxed font-light mt-3">{release.description}</p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-white/5 text-[11.5px] font-light text-white/40 leading-relaxed font-sans"
                          >
                            <span className="font-mono text-[7px] text-[#c6b89e] block tracking-[2px] uppercase mb-1">MYTHOLOGICAL CONTEXT BRIEF:</span>
                            {release.mythology}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6 items-stretch select-none">
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : release.id)}
                        className="px-4 py-2 border border-white/5 text-white/50 text-[8.5px] hover:text-white font-mono uppercase tracking-[2px] cursor-pointer text-center whitespace-nowrap focus:outline-none"
                      >
                        {isExpanded ? "[ HIDE LORE ]" : "[ VIEW FULL LORE ]"}
                      </button>

                       <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("telemetry-log", {
                            detail: { message: `Playing track buffer: '${release.title}'`, type: "FORGE_SYNC" }
                          }));
                          
                          let streamIndex = -1;
                          if (release.id === "rel-01") streamIndex = 0;
                          else if (release.id === "rel-02") streamIndex = 1;
                          else if (release.id === "rel-03") streamIndex = 2;

                          if (streamIndex >= 0) {
                            window.dispatchEvent(new CustomEvent("play-track-index", {
                              detail: { index: streamIndex }
                            }));
                          } else {
                            // If they play a different track, log it inside telemetry as buffering from custom servers
                            window.dispatchEvent(new CustomEvent("telemetry-log", {
                              detail: { message: `BUFF FEED UNKNOWN: Loading external frequency wave for '${release.title}'`, type: "SYSTEM" }
                            }));
                          }
                        }}
                        className="px-4 py-2 bg-white text-black font-semibold text-[8.5px] font-mono uppercase tracking-[2px] hover:bg-[#c6b89e] transition-colors cursor-pointer text-center whitespace-nowrap focus:outline-none flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-black" /> [ STREAM ]
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- BEHIND THE SCENES SECTION (HOW IT'S MADE) --- */}
      <div className="border border-white/5 bg-[#050505] p-8 relative overflow-hidden">
        <div className="absolute top-2 right-2 text-[#c6b89e]/20 font-mono text-[7px] tracking-[3px] uppercase">[ISOLATION RECORDS SYSTEM]</div>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-12">
          <div className="w-full lg:w-1/3 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#ff4a00] mb-3 select-none">
              <AudioLines className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[8px] tracking-[4px] uppercase font-bold">HOW THE SOUND IS CONSTRUCTED</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-white tracking-wide">
              "HOW IT'S MADE"
            </h3>
            <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light mt-4 text-justify">
              We reject commercial recording templates, pre-packaged loops, and automated tuning rigs. Our mechanical process uses hardware synthesizers and analog microphone buffers to record first-person energy direct to digital memory units.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "STUDIO ISOLATION", text: "Every vocal track is captured in zero-emission chambers straight to memory blocks." },
              { title: "HARDWARE SYNTH NODES", text: "We modulate custom voltage oscillators to produce cold, majestic bass." },
              { title: "REMIX FLIPPING PIPELINE", text: "Dismantling chart frequencies to expose their raw, theatrical structure." },
              { title: "PRODUCTION TELEMETRY", text: "All engineering parameters are logged directly into our physical archives." }
            ].map((bts) => (
              <div key={bts.title} className="p-5 border border-white/10 bg-black/60 relative">
                <span className="absolute top-0 right-0 w-4 h-[1px] bg-[#c6b89e]/30" />
                <h4 className="font-mono text-[10px] tracking-[3px] text-[#c6b89e] uppercase font-bold mb-2">{bts.title}</h4>
                <p className="text-[12.5px] text-white/50 font-sans leading-relaxed text-justify font-extralight">{bts.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- VAULT LINK CALL-TO-ACTION --- */}
      <div className="text-center select-none py-8 border-t border-white/10 mt-6 flex flex-col items-center">
        <div className="text-[9px] font-mono text-white/40 tracking-[3px] uppercase mb-4">WANT THE FULL HISTORICAL TIMELINE HISTORY?</div>
        <button
          onClick={() => onNavigate("vault")}
          className="px-10 py-5 border border-[#c6b89e] text-[#c6b89e] hover:bg-[#c6b89e] hover:text-black transition-all duration-300 font-mono text-[9px] tracking-[4px] uppercase cursor-pointer"
        >
          [ ENTER THE COMPLETE ARCHIVE VAULT ]
        </button>
      </div>

    </div>
  );
}
