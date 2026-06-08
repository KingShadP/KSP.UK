/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Cpu, HelpCircle, Thermometer, Radio, Menu, X, Landmark, Compass, Droplet, ShieldAlert, Sparkles } from "lucide-react";
import ScrambleText from "./components/ScrambleText";
import AudioPlayer from "./components/AudioPlayer";
import AcquisitionGrid from "./components/AcquisitionGrid";
import ShopifyExport from "./components/ShopifyExport";
import ExecutiveUplink from "./components/ExecutiveUplink";
import AIChatbox from "./components/AIChatbox";
import ScribeNotes from "./components/ScribeNotes";
import SatelliteRadar from "./components/SatelliteRadar";
import VirtualKingdomStage from "./components/VirtualKingdomStage";
import SanctuaryAmbient from "./components/SanctuaryAmbient";
import Tooltip from "./components/Tooltip";
import TelemetryTerminal from "./components/TelemetryTerminal";
import HomeSection from "./components/HomeSection";
import ListenSection from "./components/ListenSection";
import VaultSection from "./components/VaultSection";
import LoreSection from "./components/LoreSection";
import CommunitySection from "./components/CommunitySection";

type TabState = "home" | "listen" | "vault" | "artifacts" | "lore" | "community";

const SECTIONS_ORDER: TabState[] = ["home", "listen", "vault", "artifacts", "lore", "community"];
const SECTION_SELECTORS: Record<TabState, string> = {
  home: "section-home",
  listen: "section-listen",
  vault: "section-vault",
  artifacts: "section-artifacts",
  lore: "section-lore",
  community: "section-community"
};

const SHIELD = 'aesthetic check';

export default function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabState>("home");
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Scroll dynamics parameters for 4D HUD acceleration tracker
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");

  // High-fidelity interactive dashboard states
  const [climateUnit, setClimateUnit] = useState<"F" | "C" | "H">("F");
  const [shieldLevel, setShieldLevel] = useState<1 | 5 | 9>(5);

  // Secondary overlay states
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Monitor scroll depth of active page to highlight HUD scrollbars and logs
  useEffect(() => {
    if (!accessGranted) return;
    let lastScrollY = window.scrollY;
    let timeoutId: any = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = Math.abs(currentScrollY - lastScrollY);
      setScrollSpeed(Math.min(65, velocity));
      setScrollDirection(currentScrollY > lastScrollY ? "down" : currentScrollY < lastScrollY ? "up" : "none");

      // Calculate total document scroll completion percent
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((currentScrollY / totalHeight) * 100);
      } else {
        setScrollPercent(0);
      }

      lastScrollY = currentScrollY;

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrollSpeed(0);
        setScrollDirection("none");
      }, 100);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial call
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [accessGranted, activeTab]);

  const scrollToSection = (sectionId: string) => {
    const tabMap: Record<string, TabState> = {
      "section-home": "home",
      "section-listen": "listen",
      "section-vault": "vault",
      "section-artifacts": "artifacts",
      "section-lore": "lore",
      "section-community": "community",
      "home": "home",
      "listen": "listen",
      "vault": "vault",
      "artifacts": "artifacts",
      "lore": "lore",
      "community": "community"
    };
    const targetTab = tabMap[sectionId] || "home";
    setActiveTab(targetTab);
    
    // Smooth transitions between distinct page coordinates while automatically recovering scrolling bounds
    window.scrollTo({ top: 0, behavior: "instant" as any });
    setScrollPercent(0);
  };

  useEffect(() => {
    // Inject custom tactical cursor styled tracker logic when access is granted
    const handler = (e: MouseEvent) => {
      if (!accessGranted) return;
      const ring = document.getElementById("sanctum-global-cursor-ring");
      if (ring) {
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [accessGranted]);

  const prevTabRef = useRef<string>("");

  useEffect(() => {
    if (!accessGranted) return;
    
    // Initial load sets the base ref state
    if (!prevTabRef.current) {
      prevTabRef.current = activeTab;
      return;
    }

    if (activeTab !== prevTabRef.current) {
      const leavingName = prevTabRef.current.toUpperCase();
      const enteringName = activeTab.toUpperCase();

      const messages: { [key: string]: string } = {
        home: "EMPIRE DETECT: ENTERED THE SECTORS MANIFESTO. INTUITING GENERAL KING DIRECTIVES.",
        listen: "EMPIRE DETECT: SYNCHRONIZING REALTIME FREQUENCY CHANNELS. INITIALIZING EMBED STREAM NODES.",
        vault: "EMPIRE DETECT: LINKING TIMELINE HISTORICAL ARCHIVES AND SOUND DEMO PLAYMETRIC REGISTERS.",
        artifacts: "EMPIRE DETECT: BOOTING COMMERCE TERMINALS. UNIFORM REPLICAS PRE-EMPTED [0PX ENVELOPE].",
        lore: "EMPIRE DETECT: OPENING ENCRYPTED THEOLOGY DOSSIER. PLAY IDENT PERSONA RECORDS.",
        community: "EMPIRE DETECT: STANDING WITH THE BELIEVERS. SECURING MULTIPLEX SOCIAL LINK AND DROP REMINDER NODES."
      };

      const leavingMsg = `SYS_ROUTE: EXITED SECTOR CONTAINER [${leavingName}]. SHUTTING DOWN LOCAL MATRIX.`;
      const enteringMsg = messages[activeTab] || `SYS_ROUTE: ACQUIRED INTERFACE COORDINATES FOR [${enteringName}].`;

      // Dispatch 'warning/leaving' state
      window.dispatchEvent(new CustomEvent("telemetry-log", {
        detail: { message: leavingMsg, type: "WARNING" }
      }));

      // Dispatch 'system/entering' state shortly after for visual rhythm and elite feedback
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("telemetry-log", {
          detail: { message: enteringMsg, type: "SYSTEM" }
        }));
      }, 150);

      prevTabRef.current = activeTab;
    }
  }, [activeTab, accessGranted]);

  const handleInitiateDeploy = () => {
    setShowChatDrawer(true);
  };

  // Deep Oxblood Crimson (147, 0, 10) to Muted Gold (220, 197, 123) to Polished Platinum (201, 198, 197)
  const getInterpolatedColor = (pct: number) => {
    if (pct < 50) {
      const t = pct / 50;
      const r = Math.round(147 * (1 - t) + 220 * t);
      const g = Math.round(0 * (1 - t) + 197 * t);
      const b = Math.round(10 * (1 - t) + 123 * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (pct - 50) / 50;
      const r = Math.round(220 * (1 - t) + 201 * t);
      const g = Math.round(197 * (1 - t) + 198 * t);
      const b = Math.round(123 * (1 - t) + 197 * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const depthColor = getInterpolatedColor(scrollPercent);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden selection:bg-[#93000a]/30 selection:text-white custom-aiming-reticle relative">
      {/* Immersive Client custom cursor rings */}
      {accessGranted && (
        <div
          id="sanctum-global-cursor-ring"
          className="w-10 h-10 border border-[#c6b89e]/30 rounded-full pointer-events-none fixed -translate-x-[20px] -translate-y-[20px] z-[99999] transition-all duration-75 mix-blend-difference hidden lg:block"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#93000a] rounded-full" />
        </div>
      )}

      {/* Entry Biometric preloader */}
      <AnimatePresence mode="wait">
        {!accessGranted && (
          <ExecutiveUplink onAccessGranted={() => setAccessGranted(true)} />
        )}
      </AnimatePresence>

      {/* Cyberpunk Scanline ambient tracker */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden opacity-[0.015]">
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#93000a] to-transparent animate-scanline" />
      </div>



      {/* Main Container workspace */}
      {accessGranted && (
        <div className="min-h-screen flex flex-col md:flex-row relative">
          
          {/* Magnificent 3D Virtual Kingdom Scenic Background */}
          <VirtualKingdomStage activeTab={activeTab} />

          {/* System Telemetry Log HUD Terminal (JetBrains Mono Terminal style) */}
          <TelemetryTerminal />

          {/* FIXED VERTICAL SCROLL PROGRESS & HUD LOCATION LOCATOR (RIGHT SIDE) WITH DYNAMIC MESH GLOW FILTER */}
          <div 
            className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-6 select-none backdrop-blur-3xl p-4 md:p-5 border shadow-2xl rounded-sm pointer-events-auto overflow-hidden"
            style={{
              perspective: "500px",
              transformStyle: "preserve-3d",
              transform: `perspective(500px) rotateY(-18deg) rotateX(${
                scrollDirection === "down" ? 14 : scrollDirection === "up" ? -14 : 0
              }deg) scale(${1 + scrollSpeed * 0.0025})`,
              boxShadow: `0 0 12px rgba(0,0,0,0.85), inset 0 0 20px ${depthColor}44, 0 0 ${15 + scrollSpeed * 3.5}px ${depthColor}`,
              borderColor: scrollSpeed > 8 ? depthColor : `${depthColor}44`,
              backgroundImage: `radial-gradient(at 0% 0%, ${depthColor}22 0%, transparent 60%), radial-gradient(at 100% 100%, ${depthColor}33 0%, transparent 70%), linear-gradient(to bottom, rgba(6,6,6,0.95), rgba(0,0,0,0.98))`,
              transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease-out, border-color 180ms ease-out, background-image 250ms ease-out",
            } as any}
          >
            {/* PROCEDURAL MESH GLOW FILTER SYSTEM */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="hud-mesh-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.0 0" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Tactical grid background lines */}
                <g stroke={depthColor} strokeWidth="0.5" opacity="0.4" filter="url(#hud-mesh-glow)">
                  <line x1="0" y1="20" x2="100%" y2="20" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" />
                  <line x1="0" y1="90%" x2="100%" y2="90%" />
                  <line x1="25%" y1="0" x2="25%" y2="100%" />
                  <line x1="75%" y1="0" x2="75%" y2="100%" />
                </g>
                {/* Acceleration tracking scanner sweeping vertically */}
                <line 
                  x1="0" 
                  y1={`${scrollPercent}%`} 
                  x2="100%" 
                  y2={`${scrollPercent}%`} 
                  stroke="#ff4a00" 
                  strokeWidth="1.5" 
                  opacity="0.8" 
                  filter="url(#hud-mesh-glow)" 
                />
              </svg>
            </div>

            <div className="text-[7.5px] font-mono text-[#c6b89e]/60 uppercase tracking-[3px] font-bold z-10">L_SEC</div>
            
            <div className="h-44 w-[2px] bg-white/5 relative flex flex-col justify-between items-center py-2 z-10">
              {/* Dynamic scroll sliding height marker node */}
              <div 
                className="absolute left-0 right-0 top-0 transition-all duration-[80ms] ease-out"
                style={{ 
                  height: `${scrollPercent}%`,
                  background: `linear-gradient(to bottom, ${depthColor}, rgba(0,0,0,0.15))`,
                  boxShadow: `0 0 12px ${depthColor}`,
                }}
              />

              {[
                { id: "home", num: "01", label: "HOME (Manifesto)", sectionId: "section-home" },
                { id: "listen", num: "02", label: "LISTEN (Frequencies)", sectionId: "section-listen" },
                { id: "vault", num: "03", label: "VAULT (Live Catalog)", sectionId: "section-vault" },
                { id: "artifacts", num: "04", label: "ARTIFACTS (Uniforms)", sectionId: "section-artifacts" },
                { id: "lore", num: "05", label: "LORE (Mythology)", sectionId: "section-lore" },
                { id: "community", num: "06", label: "COMMUNITY (Believers)", sectionId: "section-community" }
              ].map((item, idx) => {
                const isActive = activeTab === item.id;
                return (
                  <Tooltip key={item.id} message={`SYS_NAV: Coordinate jump to ${item.num} // ${item.label}`}>
                    <button
                      onClick={() => scrollToSection(item.sectionId)}
                      onMouseEnter={() => {
                        const messages: {[key: string]: string} = {
                          home: "🛡️ [GATEWAY] Live biometric trace aligned... Main Atrium credentials set to Sovereign level.",
                          listen: "🎵 [FREQUENCY] Buffers engaged. Active list of sound channels ready. Checking hardware synth.",
                          vault: "🗄️ [VAULT] Tracking streams: 395 SoundCloud believers, 5.77K Audiomack manifests secured.",
                          artifacts: "👕 [ITEMS] Artifact drop inventory: ARMORED LS (25 total units), CIPHER VEST (custom geometry).",
                          lore: "📖 [THEOLOGY] Parsing character god-complex briefs and Miami roots archive timeline.",
                          community: "👥 [BELIEVERS] Accessing VIP email registry, live social outlets, FAQs, and event schedules."
                        };
                        window.dispatchEvent(new CustomEvent("telemetry-log", { 
                          detail: { message: messages[item.id], type: item.id === "artifacts" || item.id === "listen" ? "FORGE_SYNC" : "SYSTEM" } 
                        }));
                      }}
                      aria-label={`Scroll to ${item.label}`}
                      className="group relative flex items-center justify-center w-7 h-7 cursor-pointer focus:outline-none"
                    >
                      {/* Left hovering expansion bubble */}
                      <div className="absolute right-8 px-3 py-1 border border-[#c6b89e]/30 bg-black/95 text-white text-[8px] font-mono tracking-[3px] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-1.5 group-hover:translate-x-0 shadow-lg">
                        {item.num} // {item.label} {isActive ? "[ ACTIVE ]" : ""}
                      </div>

                      <div className="w-4 h-4 flex items-center justify-center relative">
                        {/* Glow indicator line */}
                        <div 
                          className="absolute w-3 h-3 border transition-all duration-300 scale-50 group-hover:scale-100 rotate-45"
                          style={{
                            borderColor: isActive ? depthColor : "rgba(198, 184, 158, 0.4)",
                            boxShadow: isActive ? `0 0 12px ${depthColor}` : "none",
                            transform: `rotate(45deg) scale(${isActive ? 1.0 : 0.5})`,
                          }}
                        />
                        {/* Status core dot */}
                        <div 
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: isActive ? depthColor : "rgba(198, 184, 158, 0.7)",
                            transform: `scale(${isActive ? 1.25 : 1.0})`,
                            boxShadow: isActive ? `0 0 6px ${depthColor}` : "none",
                          }}
                        />
                      </div>
                    </button>
                  </Tooltip>
                );
              })}
            </div>

            <div className="text-[8.5px] font-mono text-[#c6b89e] font-semibold flex flex-col items-center leading-none z-10">
              <span className="text-[6px] opacity-40 mb-0.5">DEP</span>
              <span>{Math.round(scrollPercent)}%</span>
            </div>
          </div>

          {/* Left Decorative margin bar - Desktop only */}
          <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-[#c6b89e]/10 flex flex-col items-center justify-between py-12 pointer-events-none z-35 hidden md:flex mix-blend-screen select-none">
            <div className="w-[1.5px] h-32 bg-gradient-to-b from-[#c6b89e]/80 to-transparent" />
            <div className="rotate-[-90deg] font-mono text-[7px] tracking-[8px] text-[#c6b89e]/40 uppercase whitespace-nowrap">
              Orbital Alignment Active
            </div>
            <div className="w-[1.5px] h-32 bg-gradient-to-t from-[#c6b89e]/80 to-transparent" />
          </div>

          {/* Right Decorative margin bar - Desktop only */}
          <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-[#c6b89e]/10 flex flex-col items-center justify-between py-12 pointer-events-none z-35 hidden md:flex mix-blend-screen select-none">
            <div className="w-1.5 h-1.5 bg-[#93000a] animate-pulse rounded-full shadow-[0_0_8px_#93000a]" />
            <div className="rotate-90 font-mono text-[7px] tracking-[8px] text-[#93000a]/80 uppercase whitespace-nowrap">
              "SYSTEMS_NOMINAL"
            </div>
            <div className="w-[1px] h-32 border-l border-dashed border-[#c6b89e]/40" />
          </div>

          {/* Core App Shell */}
          <div className="flex-1 flex flex-col min-h-screen relative z-10">
            
            {/* Main Branding header */}
            <header className="absolute top-0 left-0 right-0 p-6 md:p-12 z-40 flex justify-between items-start pointer-events-none mix-blend-difference select-none">
              <div className="pointer-events-auto flex gap-4 md:gap-6 items-center">
                {/* Fingerprint pulses grid block */}
                <div className="w-12 h-12 md:w-16 md:h-16 border border-[#c6b89e]/30 flex items-center justify-center relative overflow-hidden group hover:bg-white/5 transition-all duration-350 select-none">
                  <div className="w-2 h-2 bg-[#c6b89e] shadow-[0_0_12px_#c6b89e] animate-pulse rounded-full" />
                  <div className="absolute inset-0 border border-[#c6b89e]/25 scale-150 group-hover:scale-100 transition-transform duration-500" />
                </div>
                
                <div>
                  <h1 className="font-serif text-[#c6b89e] text-xl md:text-2xl tracking-[10px] md:tracking-[18px] uppercase m-0 leading-none">
                    <ScrambleText text="KINGSHADP" triggerOnHover delay={100} duration={1200} />
                  </h1>
                  <div className="text-[7px] md:text-[8px] uppercase tracking-[4px] md:tracking-[6px] opacity-70 font-mono mt-2 md:mt-3 flex items-center gap-4 text-[#c6b89e]">
                    <ScrambleText text="PRIVATE VISITOR ATELIER" delay={2000} duration={1000} />
                  </div>
                </div>
              </div>

              {/* Navigation Actions - Desktop viewports */}
              <nav className="hidden md:flex gap-10 text-[9px] uppercase tracking-[6px] font-mono opacity-80 pointer-events-auto mt-2 items-center">
                <Tooltip message="SYS_DIAG: Launch secure uplink proxy node and request live AI Concierge session.">
                  <button
                    onClick={() => setShowChatDrawer(!showChatDrawer)}
                    aria-label="Toggle executive AI system"
                    className="px-4 py-2 border border-[#93000a]/30 hover:bg-[#93000a] hover:text-white font-semibold tracking-[3px] text-[#93000a] hover:shadow-[0_0_20px_rgba(147,0,10,0.3)] transition-all uppercase cursor-pointer mr-6 font-mono"
                  >
                    "CHAT CONCIERGE"
                  </button>
                </Tooltip>

                {[
                  { id: "home", label: "HOME", hover: "MANIFESTO", diag: "🛡️ [GATEWAY] Live biometric trace aligned... Main Atrium credentials set to Sovereign level." },
                  { id: "listen", label: "LISTEN", hover: "FREQUENCY", diag: "🎵 [FREQUENCY] Buffers engaged. Active list of sound channels ready. Checking hardware synth." },
                  { id: "vault", label: "VAULT", hover: "CATALOG", diag: "🗄️ [VAULT] Tracking streams: 395 SoundCloud believers, 5.77K Audiomack manifests secured." },
                  { id: "artifacts", label: "ARTIFACTS", hover: "UNIFORMS", diag: "👕 [ITEMS] Artifact drop inventory: ARMORED LS (25 total units), CIPHER VEST (custom geometry)." },
                  { id: "lore", label: "LORE", hover: "MYTHOLOGY", diag: "📖 [THEOLOGY] Parsing character god-complex briefs and Miami roots archive timeline." },
                  { id: "community", label: "COMMUNITY", hover: "BELIEVERS", diag: "👥 [BELIEVERS] Accessing VIP email registry, live social outlets, FAQs, and event schedules." },
                ].map((tab, idx) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      scrollToSection(`section-${tab.id}`);
                    }}
                    onMouseEnter={() => {
                      window.dispatchEvent(new CustomEvent("telemetry-log", { 
                        detail: { message: tab.diag, type: tab.id === "artifacts" || tab.id === "listen" ? "FORGE_SYNC" : "SYSTEM" } 
                      }));
                    }}
                    aria-label={`Navigate to ${tab.label}`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`hover:text-[#c6b89e] transition-colors pb-2 relative group flex flex-col items-end cursor-pointer focus:outline-none ${
                      activeTab === tab.id ? "text-[#c6b89e] font-bold" : "text-white/60"
                    }`}
                  >
                    <span className="text-[7.5px] opacity-30 absolute -top-4 -right-1.5 font-mono">
                      0{idx + 1}
                    </span>
                    <ScrambleText text={tab.label} hoverText={tab.hover} delay={200} duration={600} triggerOnHover />
                    <span
                      className={`absolute bottom-0 right-0 h-[1.5px] bg-[#c6b89e] transition-all duration-350 ${
                        activeTab === tab.id ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </motion.button>
                ))}
              </nav>

              {/* Mobile hamburger navigation toggler */}
              <div className="md:hidden pointer-events-auto mt-2 flex gap-4 items-center">
                <button
                  onClick={() => setShowChatDrawer(!showChatDrawer)}
                  className="text-[#93000a] p-2.5 h-full border border-[#93000a]/30 uppercase font-mono text-[9px] tracking-[2px] bg-black/60 backdrop-blur-md"
                >
                  CHAT
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle mobile menu navigation"
                  className="text-[#c6b89e] p-2.5 h-full border border-[#c6b89e]/30 uppercase font-mono text-[9px] tracking-[2px] bg-black/60 backdrop-blur-md flex items-center justify-center cursor-pointer"
                >
                  {mobileMenuOpen ? "[ CLOSE ]" : "[ MENU ]"}
                </button>
              </div>
            </header>

            {/* Mobile Dropdown navigation drawer */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-24 left-0 right-0 bg-black/57 backdrop-blur-3xl z-45 border-b border-[#c6b89e]/20 p-8 flex flex-col gap-5 md:hidden select-none"
                >
                  {[
                    { id: "home", label: "01 HOME", hover: "THE ARCHIVE", diag: "🛡️ [GATEWAY] Mobile login registered." },
                    { id: "listen", label: "02 LISTEN", hover: "STREAM MUSIC", diag: "🎵 [FREQUENCY] Buffering soundtrack." },
                    { id: "vault", label: "03 VAULT", hover: "LOGS", diag: "🗄️ [VAULT] Historical releases synced." },
                    { id: "artifacts", label: "04 ARTIFACTS", hover: "BUY CLOTHING", diag: "👕 [ITEMS] Secure mobile store active." },
                    { id: "lore", label: "05 LORE", hover: "STORY", diag: "📖 [THEOLOGY] Reading Miami/Aegean biography." },
                    { id: "community", label: "06 COMMUNITY", hover: "BELIEVERS", diag: "👥 [BELIEVERS] Accessing VIP email registry, live social outlets, FAQs, and event schedules." },
                  ].map((tab, idx) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        scrollToSection(`section-${tab.id}`);
                        setMobileMenuOpen(false);
                        window.dispatchEvent(new CustomEvent("telemetry-log", { 
                          detail: { message: tab.diag, type: tab.id === "artifacts" || tab.id === "listen" ? "FORGE_SYNC" : "SYSTEM" } 
                        }));
                      }}
                      className="text-left font-mono text-[10px] tracking-[6px] text-white/70 hover:text-[#c6b89e] transition-colors py-4 border-b border-white/5 flex justify-between items-center"
                    >
                      <span>{tab.label}</span>
                      <span className="text-[8px] opacity-30">0{idx + 1}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

             {/* Central routing screen loader container */}
            <div className="flex-grow flex flex-col w-full px-6 md:px-12 xl:px-24 relative z-20">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 70, scale: 0.985, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -70, scale: 0.985, filter: "blur(10px)" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col"
                >
                  {/* SECTION 1: HOME (Manifesto Threshold) */}
                  {activeTab === "home" && (
                    <HomeSection onNavigate={(tab) => scrollToSection(`section-${tab}`)} />
                  )}

                  {/* SECTION 2: LISTEN (Sovereign Channels) */}
                  {activeTab === "listen" && (
                    <ListenSection onNavigate={(tab) => scrollToSection(`section-${tab}`)} />
                  )}

                  {/* SECTION 3: VAULT (The Interactive Release Timeline Record) */}
                  {activeTab === "vault" && (
                    <VaultSection onNavigate={(tab) => scrollToSection(`section-${tab}`)} />
                  )}

                  {/* SECTION 4: ARTIFACTS (Shopify Portfolio uniform boutique) */}
                  {activeTab === "artifacts" && (
                    <div
                      id="section-artifacts"
                      className="w-full min-h-[calc(100vh-200px)] py-24 mb-12 relative text-left"
                    >
                      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
                        04 // SACRED UNIFORMS & RELICS / ARTIFACTS
                      </div>

                      <div className="mt-16 bg-black/20 p-6 md:p-8 border border-white/5">
                        <div className="mb-10 text-center md:text-left">
                          <h3 className="font-serif text-3xl md:text-5xl font-light text-white mb-2 uppercase tracking-wide">
                            Wear The Mythology
                          </h3>
                          <div className="font-mono text-[9px] uppercase tracking-[4px] text-[#c6b89e]">
                            "Own a piece of the empire" // Uniform of the believers
                          </div>
                        </div>

                        <ShopifyExport isInline={true} />
                      </div>
                    </div>
                  )}

                  {/* SECTION 5: LORE (Editorial Gallery Dossier) */}
                  {activeTab === "lore" && (
                    <LoreSection />
                  )}

                  {/* SECTION 6: COMMUNITY (Citadel Portal / Believers Platform) */}
                  {activeTab === "community" && (
                    <CommunitySection />
                  )}
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Bottom Global Coordinates tracking footer bar */}
            <footer className="w-full py-6 border-t border-[#c6b89e]/10 bg-[#020202] tracking-[2px] text-white/40 z-35 relative flex flex-col md:flex-row justify-between items-center px-12 gap-6 select-none">
              <div className="flex flex-wrap items-center gap-6 text-[9px] font-mono tracking-[3px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAboutModal(true);
                    window.dispatchEvent(new CustomEvent("telemetry-log", {
                      detail: { message: "CORE_LOG: Loaded artist lore dossiers.", type: "SYSTEM" }
                    }));
                  }}
                  className="hover:text-white cursor-pointer transition-colors focus:outline-none"
                >
                  [ ABOUT MYTHOLOGY ]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowArchiveModal(true);
                    window.dispatchEvent(new CustomEvent("telemetry-log", {
                      detail: { message: "DIAG_SYNC: Accessing satellite radar array terminal.", type: "SYSTEM" }
                    }));
                  }}
                  className="hover:text-white cursor-pointer transition-colors focus:outline-none"
                >
                  [ ARCHIVE SYSTEMS ]
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewsletterModal(true);
                    window.dispatchEvent(new CustomEvent("telemetry-log", {
                      detail: { message: "CONN_LOG: Requesting digital credentials gateway.", type: "SYSTEM" }
                    }));
                  }}
                  className="hover:text-white cursor-pointer transition-colors focus:outline-none"
                >
                  [ NEWSLETTER INTAKE ]
                </button>
              </div>

              <span className="font-sans font-light capitalize text-[9.5px] text-[#c6b89e]/70">
                Authorized Executive Lounge Session and Terminal Interface
              </span>
            </footer>

          </div>

          {/* Collapsible Slide-in AI Terminal chat sidebar drawer */}
          <AnimatePresence>
            {showChatDrawer && (
              <motion.div
                initial={{ x: "100%", opacity: 0.6 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.6 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] md:w-[540px] z-50 bg-black shadow-2xl flex flex-col select-none"
              >
                <AIChatbox onClose={() => setShowChatDrawer(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* About Mythology Cinematic Overlay */}
          <AnimatePresence>
            {showAboutModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-[#050505] border border-[#c6b89e]/30 max-w-2xl w-full p-8 md:p-10 relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 left-0 w-24 h-[1.5px] bg-[#ff4a00]" />
                  <button
                    type="button"
                    onClick={() => setShowAboutModal(false)}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors cursor-pointer text-xs font-mono font-bold"
                  >
                    [ ESCAPE // CLOSE ]
                  </button>

                  <div className="text-[9px] font-mono tracking-[4px] text-[#c6b89e] uppercase mb-4">
                    FILE ID: MASTER_TACTIC_DOSSIER
                  </div>

                  <h3 className="font-serif text-3xl md:text-4.5xl text-white tracking-wide uppercase mb-6 leading-tight select-none">
                    The KingShadP Character Mythology
                  </h3>

                  <div className="space-y-6 font-sans text-[13px] md:text-[14px] text-white/50 leading-relaxed font-light text-justify select-text">
                    <p>
                      KingShadP is not a polished rapper or a luxury lifestyle brand. This is a highly theatrical, character-driven DIY empire centering music as the primary armor of the soul. Operates in total creative digital isolation—building a private sound castle room-by-room, leaving unedited rough drafts, vocal demos, and aggressive beachside freestyles for believers to experience.
                    </p>
                    <p>
                      Drawing heavy performance notes from custom-constructed artist universes like <span className="text-white">Tyler, The Creator’s raw storybooks</span>, the confrontational theatricality of <span className="text-white">Vince Staples</span>, and the rough underground architecture of <span className="text-white">Earl Sweatshirt</span>.
                    </p>
                    <p>
                      The garments we curate are physically wearable protective uniformity plates matching specific musical chapters. Wear the fabric, lock your coordinates, and secure your psyche inside our fortress.
                    </p>

                    <div className="border-t border-white/10 pt-4 font-mono text-[9.5px] text-[#ff4a00] uppercase tracking-[2px] space-y-1">
                      <div>// ESTABLISHED LOCATIONS: Southern Beachfront Shorelines</div>
                      <div>// COGNITIVE LEVEL: Grandiose God-Complex</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Archival Systems Console Bento Drawer */}
          <AnimatePresence>
            {showArchiveModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#020202]/95 backdrop-blur-lg flex flex-col justify-between p-6 md:p-12 overflow-y-auto"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-10 select-none">
                    <div>
                      <div className="text-[9px] font-mono tracking-[3px] text-[#ff4a00] uppercase mb-1">
                        SECURE LOG PORTAL / TELEMETRY TERMINUS
                      </div>
                      <h3 className="font-serif text-2xl md:text-4.5xl text-white tracking-wide uppercase">
                        Global Archival Matrix Systems
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowArchiveModal(false)}
                      className="px-5 py-3 border border-white/20 hover:border-white text-white font-mono text-[9px] uppercase tracking-[3px] cursor-pointer transition-all"
                    >
                      [ CLOSE MATRIX ]
                    </button>
                  </div>

                  {/* Archival system bento array */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Panel 1: Satellite Radar */}
                    <div className="flex flex-col gap-3">
                      <div className="font-mono text-[9px] uppercase tracking-[3px] text-white/50 px-1">
                        // COORDINATES_RADAR_HUD [ACTIVE]
                      </div>
                      <div className="bg-black border border-white/10 h-[380px] overflow-hidden relative rounded-sm">
                        <SatelliteRadar />
                      </div>
                    </div>

                    {/* Panel 2: Scribe Diary Notes */}
                    <div className="flex flex-col gap-3">
                      <div className="font-mono text-[9px] uppercase tracking-[3px] text-white/50 px-1">
                        // SCRIPT_ATHENA_RECORDS_LOG
                      </div>
                      <div className="bg-black border border-white/10 h-[380px] relative rounded-sm">
                        <ScribeNotes />
                      </div>
                    </div>

                    {/* Panel 3: Previous Blueprints Grid */}
                    <div className="flex flex-col gap-3">
                      <div className="font-mono text-[9px] uppercase tracking-[3px] text-white/50 px-1">
                        // ARCHITECTURE_BLUEPRINT_VAULT
                      </div>
                      <div className="bg-black border border-white/10 h-[380px] p-6 relative rounded-sm overflow-y-auto">
                        <div className="p-4 border border-teal-500/10 mb-4 bg-teal-500/5 text-justify select-text">
                          <div className="text-[10px] font-mono tracking-[2px] text-[#dcc57b] uppercase mb-1 font-bold">
                            AEGEAN SEA SESS COORDINATES
                          </div>
                          <div className="text-[11px] text-white/40 mb-3 leading-relaxed">
                            Decrypted records of private villa drafts, sovereign custom yachts, and heavy aerial helicopters are kept securely on file.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent("telemetry-log", {
                                detail: { message: "AEGEAN ACCESSED: decryption lock synced.", type: "FORGE_SYNC" }
                              }));
                              alert("System Decryption: Accessing historical Aegean beachfront estate drawings.");
                            }}
                            className="px-3 py-1.5 border border-white/20 text-[9px] font-mono text-white hover:bg-white/10 uppercase transition-all tracking-[2px] cursor-pointer"
                          >
                            Mount Blueprint File
                          </button>
                        </div>
                        <AcquisitionGrid isInline={true} />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 mt-16 font-mono text-[8.5px] uppercase tracking-[5px] text-white/20 flex flex-col md:flex-row justify-between pointer-events-none select-none">
                  <span>SECURE CHRONOS RECORD LOCK: ENGAGED</span>
                  <span>CITADEL MATRIX SYSTEM LOGS OK [2026]</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Newsletter Modal Popup */}
          <AnimatePresence>
            {showNewsletterModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.96, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 15 }}
                  className="bg-[#050505] border border-[#ff4a00]/30 max-w-md w-full p-8 relative overflow-hidden text-left"
                >
                  <button
                    type="button"
                    onClick={() => setShowNewsletterModal(false)}
                    className="absolute top-5 right-5 text-white/30 hover:text-white font-mono text-[9px] cursor-pointer select-none"
                  >
                    [ CLOSE ]
                  </button>

                  <div className="flex items-center gap-2 text-[#ff4a00] mb-4 select-none">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span className="font-mono text-[8px] tracking-[3px] uppercase font-bold">EMPIRE SIGNAL ACCESS</span>
                  </div>

                  <h3 className="font-serif text-2xl text-white tracking-wide uppercase mb-3">
                    Secure Earliest Decryptions
                  </h3>
                  <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light mb-6 text-justify">
                    Submit your primary coordinate email address below to join the private fortress directory list. Get early audio demo cassette dispatches, behind-the-scenes beach room briefings, and physical gear launch updates.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent("telemetry-log", {
                        detail: { message: "COORDINATE DISPATCHED: Registered via floating modal popup.", type: "SYSTEM" }
                      }));
                      alert("Secured Entrance: Biometric credential list lock complete.");
                      setShowNewsletterModal(false);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="email"
                      required
                      placeholder="BIOMETRIC_ID@DOMAIN.XYZ"
                      className="w-full bg-[#030303] border border-white/10 px-4 py-3 font-mono text-[10px] text-white tracking-[2px] outline-none focus:border-[#c6b89e] transition-all rounded-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-white text-black text-[9px] font-mono font-semibold tracking-[4px] uppercase hover:bg-[#c6b89e] transition-all cursor-pointer"
                    >
                      REGISTER DIGITAL COORDINATE
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
export { SHIELD };
