/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
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

type TabState = "main" | "assets" | "command" | "shopify";

const SHIELD = 'aesthetic check';

export default function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabState>("main");
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Scroll dynamics parameters for 4D HUD acceleration tracker
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");

  // High-fidelity interactive dashboard states
  const [climateUnit, setClimateUnit] = useState<"F" | "C" | "H">("F");
  const [shieldLevel, setShieldLevel] = useState<1 | 5 | 9>(5);

  // Monitor real scroll depth to highlight the headers links appropriately
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
      }

      const dossierEl = document.getElementById("section-dossier");
      const assetsEl = document.getElementById("section-assets");
      const commandEl = document.getElementById("section-command");
      const shopifyEl = document.getElementById("section-shopify");

      const scrollPos = currentScrollY + window.innerHeight / 3;

      if (shopifyEl && scrollPos >= shopifyEl.offsetTop) {
        setActiveTab("shopify");
      } else if (commandEl && scrollPos >= commandEl.offsetTop) {
        setActiveTab("command");
      } else if (assetsEl && scrollPos >= assetsEl.offsetTop) {
        setActiveTab("assets");
      } else if (dossierEl) {
        setActiveTab("main");
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
  }, [accessGranted]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  const handleInitiateDeploy = () => {
    setShowChatDrawer(true);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden selection:bg-[#ff4a00]/30 selection:text-white custom-aiming-reticle relative">
      {/* Immersive Client custom cursor rings */}
      {accessGranted && (
        <div
          id="sanctum-global-cursor-ring"
          className="w-10 h-10 border border-[#c6b89e]/30 rounded-full pointer-events-none fixed -translate-x-[20px] -translate-y-[20px] z-[99999] transition-all duration-75 mix-blend-difference hidden lg:block"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#ff4a00] rounded-full" />
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
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#ff4a00] to-transparent animate-scanline" />
      </div>

      {/* Main Container workspace */}
      {accessGranted && (
        <div className="min-h-screen flex flex-col md:flex-row relative">
          
          {/* Magnificent 3D Virtual Kingdom Scenic Background */}
          <VirtualKingdomStage activeTab={activeTab} />

          {/* System Telemetry Log HUD Terminal (JetBrains Mono Terminal style) */}
          <TelemetryTerminal />

          {/* FIXED VERTICAL SCROLL PROGRESS & HUD LOCATION LOCATOR (RIGHT SIDE) */}
          <div 
            className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-6 select-none bg-black/75 backdrop-blur-3xl p-4 md:p-5 border shadow-2xl rounded-sm pointer-events-auto"
            style={{
              perspective: "500px",
              transformStyle: "preserve-3d",
              transform: `perspective(500px) rotateY(-18deg) rotateX(${
                scrollDirection === "down" ? 14 : scrollDirection === "up" ? -14 : 0
              }deg) scale(${1 + scrollSpeed * 0.0025})`,
              boxShadow: `0 0 ${18 + scrollSpeed * 1.5}px rgba(255, 74, 0, ${0.12 + scrollSpeed * 0.012})`,
              borderColor: scrollSpeed > 8 ? "rgba(255, 74, 0, 0.45)" : "rgba(198, 184, 158, 0.2)",
              transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease-out, border-color 180ms ease-out",
            } as any}
          >
            <div className="text-[7.5px] font-mono text-[#c6b89e]/60 uppercase tracking-[3px] font-bold">L_SEC</div>
            
            <div className="h-44 w-[2px] bg-white/5 relative flex flex-col justify-between items-center py-2">
              {/* Dynamic scroll sliding height marker node */}
              <div 
                className="absolute left-0 right-0 top-0 bg-gradient-to-b from-[#ff4a00] to-[#c6b89e] transition-all duration-[80ms] ease-out shadow-[0_0_8px_#ff4a00]"
                style={{ height: `${scrollPercent}%` }}
              />

              {[
                { id: "main", num: "01", label: "ATRIUM (Overview)", sectionId: "section-dossier" },
                { id: "assets", num: "02", label: "EXHIBITION (Our Work)", sectionId: "section-assets" },
                { id: "command", num: "03", label: "COMMAND (Interactive Map)", sectionId: "section-command" },
                { id: "shopify", num: "04", label: "BOUTIQUE (Atelier Store)", sectionId: "section-shopify" }
              ].map((item, idx) => {
                const isActive = activeTab === item.id;
                return (
                  <Tooltip key={item.id} message={`SYS_NAV: Coordinate jump to ${item.num} // ${item.label}`}>
                    <button
                      onClick={() => scrollToSection(item.sectionId)}
                      onMouseEnter={() => {
                        const messages: {[key: string]: string} = {
                          main: "🛡️ [SANCTUM SECURITY] Active gateway checking credentials... IP mapped to Sector 0xAA. Atrium clearance Level-5 verified.",
                          assets: "⚠️ [SANCTUM SECURITY] Querying physical & digital design vault collection matrices... Decrypting catalog signatures...",
                          command: "🛰️ [SANCTUM SECURITY] Syncing satellite alignment telemetry. Global visitation journals database online & synchronized.",
                          shopify: "⚡ [SANCTUM SECURITY] Secured Shopify storefront synchronized. Direct camera-AR visual projection controller calibration active."
                        };
                        window.dispatchEvent(new CustomEvent("telemetry-log", { 
                          detail: { message: messages[item.id], type: item.id === "shopify" || item.id === "assets" ? "FORGE_SYNC" : "SYSTEM" } 
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
                        <div className={`absolute w-3 h-3 border transition-all duration-300 scale-50 group-hover:scale-100 rotate-45 ${isActive ? "border-[#ff4a00] scale-100 rotate-45 shadow-[0_0_12px_rgba(255,74,0,0.5)]" : "border-[#c6b89e]/40"}`} />
                        {/* Status core dot */}
                        <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isActive ? "bg-[#ff4a00] scale-125 shadow-[0_0_6px_#ff4a00]" : "bg-[#c6b89e]/70 group-hover:bg-[#c6b89e]"}`} />
                      </div>
                    </button>
                  </Tooltip>
                );
              })}
            </div>

            <div className="text-[8.5px] font-mono text-[#c6b89e] font-semibold flex flex-col items-center leading-none">
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
            <div className="w-1.5 h-1.5 bg-[#ff4a00] animate-pulse rounded-full shadow-[0_0_8px_#ff4a00]" />
            <div className="rotate-90 font-mono text-[7px] tracking-[8px] text-[#ff4a00]/80 uppercase whitespace-nowrap">
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
                    className="px-4 py-2 border border-[#ff4a00]/30 hover:bg-[#ff4a00] hover:text-black font-semibold tracking-[3px] text-[#ff4a00] hover:shadow-[0_0_20px_rgba(255,74,0,0.3)] transition-all uppercase cursor-pointer mr-6 font-mono"
                  >
                    "CHAT CONCIERGE"
                  </button>
                </Tooltip>

                {[
                  { id: "main", label: "01 ATRIUM (Entrance)", hover: "OVERVIEW", diag: "🛡️ [SANCTUM SECURITY] Active gateway checking credentials... IP mapped to Sector 0xAA. Atrium clearance Level-5 verified." },
                  { id: "assets", label: "02 GALLERY (Our Work)", hover: "VAULT MUSEUM", diag: "⚠️ [SANCTUM SECURITY] Querying physical & digital design vault collection matrices... Decrypting rare asset signatures..." },
                  { id: "command", label: "03 COMMAND (Active Map)", hover: "RADAR HUD", diag: "🛰️ [SANCTUM SECURITY] Syncing satellite alignment telemetry. Global client visitation database online & synced." },
                  { id: "shopify", label: "04 STORE (Boutique)", hover: "ATELIER SHOP", diag: "⚡ [SANCTUM SECURITY] Secured Shopify storefront synced. Direct camera-AR visual projection controller calibration active." },
                ].map((tab, idx) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      const sectionId = tab.id === "main" ? "section-dossier" : tab.id === "assets" ? "section-assets" : tab.id === "command" ? "section-command" : "section-shopify";
                      scrollToSection(sectionId);
                    }}
                    onMouseEnter={() => {
                      window.dispatchEvent(new CustomEvent("telemetry-log", { 
                        detail: { message: tab.diag, type: tab.id === "shopify" || tab.id === "assets" ? "FORGE_SYNC" : "SYSTEM" } 
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
                    <ScrambleText text={tab.label} hoverText={tab.hover} delay={2200} duration={600} triggerOnHover />
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
                  className="text-[#ff4a00] p-2.5 h-full border border-[#ff4a00]/30 uppercase font-mono text-[9px] tracking-[2px] bg-black/60 backdrop-blur-md"
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
                    { id: "main", label: "01 ATRIUM (Entrance)", hover: "OVERVIEW", diag: "🛡️ [SANCTUM SECURITY] Mobile connection mapped... Sector Atrium clearance Level-5 verified." },
                    { id: "assets", label: "02 GALLERY (Our Work)", hover: "VAULT MUSEUM", diag: "⚠️ [SANCTUM SECURITY] Decrypting mobile design vault collection matrices..." },
                    { id: "command", label: "03 COMMAND (Active Map)", hover: "RADAR HUD", diag: "🛰️ [SANCTUM SECURITY] Mobile node linked. Satellite coordinate alignment synced." },
                    { id: "shopify", label: "04 STORE (Boutique)", hover: "ATELIER SHOP", diag: "⚡ [SANCTUM SECURITY] Secure storefront synchronized. Interactive mobile AR active." },
                  ].map((tab, idx) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        const sectionId = tab.id === "main" ? "section-dossier" : tab.id === "assets" ? "section-assets" : tab.id === "command" ? "section-command" : "section-shopify";
                        scrollToSection(sectionId);
                        setMobileMenuOpen(false);
                        window.dispatchEvent(new CustomEvent("telemetry-log", { 
                          detail: { message: tab.diag, type: tab.id === "shopify" || tab.id === "assets" ? "FORGE_SYNC" : "SYSTEM" } 
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
              
              {/* SECTION 1: DOSSIER CHAMBER (Sovereign Threshold / Outer Portal Room) */}
              <div
                id="section-dossier"
                className="w-full min-h-screen flex flex-col lg:flex-row gap-12 pt-28 pb-16 items-stretch relative"
              >
                <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
                  01 // INTRODUCTORY ATRIUM
                </div>

                {/* Left Panel column: Critical recommendations introduction */}
                <div className="flex-grow flex-1 flex flex-col justify-center text-left py-10 md:py-16">
                  <div className="inline-flex max-w-max items-center gap-4 mb-8 border border-[#c6b89e]/20 bg-black/40 px-5 py-2.5 backdrop-blur-md">
                    <Cpu className="w-4 h-4 text-[#c6b89e] animate-pulse" />
                    <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[5px] text-[#c6b89e] pt-0.5 font-bold">
                      <ScrambleText text="EXCLUSIVE ATELIER SUITE" delay={2100} duration={100} />
                    </span>
                  </div>

                  <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-normal leading-none tracking-tighter text-white mb-6 relative select-none">
                    {/* Orange Floating identity tag */}
                    <div className="absolute top-[-15px] right-[10%] rotate-[12deg] bg-[#ff4a00] text-black font-sans font-bold text-[9px] md:text-[10px] px-3 py-1 uppercase tracking-[3px] shadow-[0_10px_20px_rgba(255,74,0,0.3)] select-none">
                      "ESTATE"
                    </div>

                    <span className="block italic text-[#c6b89e] opacity-90 leading-tight">
                      <ScrambleText text="Atelier" delay={2300} duration={1200} triggerOnHover />
                    </span>
                    <span className="block ml-6 sm:ml-12 md:ml-16 leading-tight">
                      Kingshadp.
                    </span>
                  </h2>

                  {/* Decrypted descriptive copy briefs */}
                  <div className="grid grid-cols-1 gap-8 border-t border-[#c6b89e]/30 pt-8 mt-10 max-w-3xl relative select-text">
                    <div className="absolute top-0 left-0 w-24 h-[1px] bg-[#c6b89e] shadow-[0_0_15px_rgba(198,184,158,0.8)]" />
                    <p className="text-[13.5px] md:text-base text-white/50 font-light leading-relaxed font-sans text-justify selection:bg-[#ff4a00]/30">
                      <span className="text-[#c6b89e] text-lg md:text-xl font-serif italic mr-2 text-left leading-none tracking-tight">"Welcome</span>
                      to Atelier Kingshadp. An elite architectural sanctuary and digital design laboratory overlooking absolute Aegean horizons. We craft bespoke physical commissions, private luxury products, and custom high-fidelity Shopify storefronts with timeless precision.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 items-stretch mt-4">
                      <Tooltip message="SYS_DIAG: Open encrypted communication pipeline to our AI concierge for personalized specifications.">
                        <button
                          onClick={handleInitiateDeploy}
                          aria-label="Access AI Concierge Assistant"
                          className="flex items-center justify-between gap-8 px-8 py-5 border border-[#c6b89e] text-[#c6b89e] font-mono text-[9.5px] tracking-[5px] uppercase hover:bg-[#c6b89e] hover:text-black hover:shadow-[0_0_30px_rgba(198,184,158,0.3)] transition-all duration-500 relative overflow-hidden group cursor-pointer focus:outline-none"
                        >
                          <span className="relative z-10 font-bold pt-0.5">
                            <ScrambleText text="TALK TO CONCIERGE" hoverText="ACTIVATE" delay={2500} duration={800} triggerOnHover />
                          </span>
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </button>
                       </Tooltip>

                      <button
                        onClick={() => scrollToSection("section-assets")}
                        aria-label="Browse catalog archives"
                        className="px-6 py-4 border border-white/5 hover:border-white/20 select-none text-white/40 hover:text-white font-mono text-[8px] md:text-[9px] uppercase tracking-[4px] py-5 flex items-center justify-center transition-colors focus:outline-none"
                      >
                        [ VIEW DETAILED PORTFOLIO ]
                      </button>
                    </div>
                  </div>
                </div>

                 {/* Right Panel stack columns */}
                <div className="w-full lg:w-[420px] xl:w-[480px] flex flex-col gap-8 justify-center relative select-none">
                  
                  {/* Stack Block 1: Beethoven Moonlight sonata music audio deck */}
                  <div className="bg-black/60 backdrop-blur-3xl border border-[#c6b89e]/20 shadow-2xl relative overflow-hidden">
                    <AudioPlayer />
                  </div>

                  {/* Sanctuary ambient soundscape controls */}
                  <SanctuaryAmbient />

                  {/* Stack Block 2: Sensory climate and status dashboard gauges */}
                  <div className="grid grid-cols-2 gap-6 select-none">
                    
                    {/* Subcard A: Current Climate coordinates gauge */}
                    <Tooltip message="SYS_DIAG: Query Aegean base telemetry relative humidity and thermal payload index.">
                      <motion.div
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setClimateUnit((u) => u === "F" ? "C" : u === "C" ? "H" : "F");
                        }}
                        className="bg-black/60 backdrop-blur-3xl border border-[#c6b89e]/20 hover:border-[#c6b89e]/55 p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 cursor-pointer shadow-2xl min-h-[140px]"
                      >
                        <div className="absolute inset-0 bg-[#c6b89e]/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500" />
                        
                        <div className="absolute top-5 right-5 z-20">
                          {climateUnit === "F" && (
                            <Thermometer className="w-4 h-4 text-[#ff4a00] opacity-80 group-hover:opacity-100 transition-opacity" />
                          )}
                          {climateUnit === "C" && (
                            <Thermometer className="w-4 h-4 text-[#c6b89e] opacity-80 group-hover:opacity-100 transition-opacity" />
                          )}
                          {climateUnit === "H" && (
                            <Droplet className="w-4 h-4 text-[#c6b89e] opacity-80 group-hover:opacity-100 transition-opacity animate-bounce" />
                          )}
                        </div>

                        <div className="relative z-10">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={climateUnit}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.25 }}
                              className="text-3xl md:text-4xl font-serif text-white group-hover:text-[#c6b89e] transition-colors font-light leading-none mb-4"
                            >
                              {climateUnit === "F" ? "82.4°F" : climateUnit === "C" ? "28.0°C" : "44.2% RH"}
                            </motion.div>
                          </AnimatePresence>

                          <div className="text-[7.5px] uppercase tracking-[3px] text-[#c6b89e] font-mono mb-1">
                            {climateUnit === "F" ? "Thermal payload" : climateUnit === "C" ? "Celsius Matrix" : "Air Moisture"}
                          </div>
                          <div className="text-[10px] text-white/45 font-sans font-light leading-none">
                            Aegean Vault, GR
                          </div>
                        </div>
                        
                        <div className="absolute bottom-2 right-4 text-[6.5px] tracking-[1.5px] uppercase font-mono text-[#c6b89e]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-350 select-none">
                          TAP_TOGGLE
                        </div>
                      </motion.div>
                    </Tooltip>

                    {/* Subcard B: Live status check indicator with shielding level triggers */}
                    <Tooltip message="SYS_DIAG: Recalibrate optimal radio suppression and signal scrambler levels.">
                      <motion.div
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setShieldLevel((l) => l === 5 ? 9 : l === 9 ? 1 : 5);
                        }}
                        className="bg-black/60 backdrop-blur-3xl border border-[#c6b89e]/20 hover:border-[#c6b89e]/55 p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 cursor-pointer shadow-2xl min-h-[140px]"
                      >
                        <div className="absolute inset-0 bg-[#c6b89e]/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500" />
                        
                        <div className="absolute top-5 right-5 z-20">
                          {shieldLevel === 1 && <Sparkles className="w-4 h-4 text-[#c6b89e]/40" />}
                          {shieldLevel === 5 && <Radio className="w-4 h-4 text-[#c6b89e] animate-pulse" />}
                          {shieldLevel === 9 && <ShieldAlert className="w-4 h-4 text-[#ff4a00] animate-pulse" />}
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3 mt-1">
                            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              shieldLevel === 1 ? "bg-[#c6b89e]/40 shadow-none" : 
                              shieldLevel === 5 ? "bg-[#c6b89e] shadow-[0_0_8px_#c6b89e]" : 
                              "bg-[#ff4a00] shadow-[0_0_12px_#ff4a00]"
                            }`} />
                            <span className="text-[10px] uppercase font-mono tracking-[3px] text-white font-bold leading-none">
                              {shieldLevel === 1 ? "PASSIVE L1" : shieldLevel === 5 ? "ARMORED L5" : "STEALTH L9"}
                            </span>
                          </div>

                          <div className="text-[7.5px] uppercase tracking-[3px] text-[#c6b89e] font-mono mb-1">
                            {shieldLevel === 1 ? "Soft Filter" : shieldLevel === 5 ? "Acoustic Void" : "Suppressed Void"}
                          </div>
                          <div className="text-[10px] text-white/45 font-sans font-light leading-none">
                            {shieldLevel === 1 ? "Minimum Defenses" : shieldLevel === 5 ? "Optimal Shielding" : "Total Electromagnetic Dark"}
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-4 text-[6.5px] tracking-[1.5px] uppercase font-mono text-[#c6b89e]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-350 select-none">
                          TAP_SHIELD
                        </div>
                      </motion.div>
                    </Tooltip>

                  </div>
                </div>

              </div>

              {/* SECTION 2: ACQUISITION VAULT CHAMBER (Middle Golden Vault Room) */}
              <div
                id="section-assets"
                className="w-full min-h-screen py-24 mb-12 border-t border-[#c6b89e]/15 relative"
              >
                <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
                  02 // CURATED LUXURY EXHIBITION
                </div>

                <div className="mt-16">
                  <AcquisitionGrid isInline={true} />
                </div>
              </div>

              {/* SECTION 3: COMMAND RADAR & DIRECTIVES (Orbital Constellation Deck) */}
              <div
                id="section-command"
                className="w-full min-h-screen py-24 mb-12 border-t border-[#c6b89e]/15 relative flex flex-col justify-center"
              >
                <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
                  03 // GLOBAL VISITATION & JOURNAL
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 select-text">
                  {/* Left: Star Map Orbit Radar widget */}
                  <div className="flex flex-col gap-4 select-none">
                    <div className="font-mono text-[9px] uppercase tracking-[4px] text-white/30 px-1">
                      REAL-TIME VISITATION ORBIT
                    </div>
                    <div className="bg-black/60 backdrop-blur-2xl border border-[#c6b89e]/20 h-[400px] overflow-hidden relative shadow-2xl rounded-sm">
                      <SatelliteRadar />
                    </div>
                  </div>

                  {/* Right: Notes logger scribe tool */}
                  <div className="flex flex-col gap-4 select-none">
                    <div className="font-mono text-[9px] uppercase tracking-[4px] text-white/30 px-1">
                      BESPOKE ATELIER JOURNAL & NOTES
                    </div>
                    <div className="bg-black/60 backdrop-blur-2xl border border-[#c6b89e]/20 min-h-[400px] relative shadow-2xl rounded-sm">
                      <ScribeNotes />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: THE SHOP_EXPORT TERMINUS (Royal Monolith Deck) */}
              <div
                id="section-shopify"
                className="w-full min-h-screen py-24 mb-12 border-t border-[#c6b89e]/15 relative"
              >
                <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
                  04 // ACTIVE SHOPIFY STOREFRONT INTEGRATION
                </div>

                <div className="mt-16">
                  <ShopifyExport isInline={true} />
                </div>
              </div>

            </div>

            {/* Bottom Global Coordinates tracking footer bar */}
            <footer className="w-full py-6 border-t border-[#c6b89e]/10 bg-[#020202] text-center select-none text-[8.5px] uppercase tracking-[6px] text-white/20 z-35 relative flex flex-col md:flex-row justify-between items-center px-12 gap-2 pointer-events-none mix-blend-screen">
              <span>COORDS STATUS DETECT [OK]</span>
              <span className="font-sans font-light capitalize tracking-[1px] text-[#c6b89e]/70">
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

        </div>
      )}

    </div>
  );
}
export { SHIELD };
