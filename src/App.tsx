/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Cpu, HelpCircle, Thermometer, Radio, Menu, X, Landmark, Compass, Droplet, ShieldAlert, Sparkles, Lock } from "lucide-react";
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
import AdminSection from "./components/AdminSection";

type TabState = "home" | "listen" | "vault" | "artifacts" | "lore" | "community" | "admin";

const SECTIONS_ORDER: TabState[] = ["home", "listen", "vault", "artifacts", "lore", "community", "admin"];
const SECTION_SELECTORS: Record<TabState, string> = {
  home: "section-home",
  listen: "section-listen",
  vault: "section-vault",
  artifacts: "section-artifacts",
  lore: "section-lore",
  community: "section-community",
  admin: "section-admin"
};

const ARCHIVE_LORE_LOOKUP: Record<string, { title: string; subtitle: string; era: string; desc: string }> = {
  "chap-01": {
    title: "The Miami Sanctuary Humid Isolation",
    subtitle: "FOUNDATION OF THE MYTHOLOGY",
    era: "2020 - 2021",
    desc: "The initial psychological shield constructed in coastal Florida apartments amid extreme creative isolation of the Miami beachfront era."
  },
  "chap-02": {
    title: "Aegean Gilt Velocity Transition",
    subtitle: "HIGH-SPEED FLIGHT ARCHITECTURE",
    era: "2022",
    desc: "Escaping public velocity centers to relocate the creative crucible inside hidden sanctuary chambers on private Greek shores."
  },
  "chap-03": {
    title: "Sovereign Digital Kingdom",
    subtitle: "THE MATRICULATED FORTRESS",
    era: "2023 - PRESENT",
    desc: "Unveiling encrypted biometric interfaces, bespoke uniforms, and unreleased studio demo records in a central physical environment."
  }
};

const SHIELD = 'aesthetic check';

export default function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabState>("home");
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Paradox Universe state
  const [paradoxMode, setParadoxMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kingshadp-paradox-mode") === "true";
    } catch {
      return false;
    }
  });

  // User Theme Preference
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("kingshadp-theme");
      return (saved === "light") ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("kingshadp-theme", next);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { 
        message: `🌗 THEME_SHIFT: Transitioned to luxury gallery environment: [${next.toUpperCase()} MODE].`, 
        type: "SYSTEM" 
      }
    }));
  };

  // Enhanced legibility & less transparency preferences
  const [readabilityEnhanced, setReadabilityEnhanced] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("kingshadp-readability") === "true";
      return saved;
    } catch {
      return false;
    }
  });

  const toggleReadability = () => {
    const next = !readabilityEnhanced;
    setReadabilityEnhanced(next);
    try {
      localStorage.setItem("kingshadp-readability", String(next));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { 
        message: next 
          ? "⚡ SYS_CONTRAST: ENHANCED readability active. Scale boosted, text opacities normalized." 
          : "✓ SYS_CONTRAST: Standard aesthetic transparency parameters restored.", 
        type: "SYSTEM" 
      }
    }));
  };

  const toggleParadoxMode = () => {
    const next = !paradoxMode;
    setParadoxMode(next);
    try {
      localStorage.setItem("kingshadp-paradox-mode", String(next));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { 
        message: next 
          ? "⚠️ SYS_MUTATION: Mutated timeline. OMEGA anti-matter void initialized. Shifted to the Parallel Universe." 
          : "✓ SYS_NOMINAL: Timeline restored. ALPHA golden physical core active.", 
        type: next ? "WARNING" : "SYSTEM" 
      }
    }));
  };

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
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [blueprintMounted, setBlueprintMounted] = useState(false);

  // Archive and Lore registration states
  const [archiveTab, setArchiveTab] = useState<"global" | "saved">("global");
  const [bookmarkedLoreIds, setBookmarkedLoreIds] = useState<string[]>([]);

  const syncBookmarks = () => {
    try {
      const saved = localStorage.getItem("kingshadp-bookmarked-lore");
      setBookmarkedLoreIds(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setBookmarkedLoreIds([]);
    }
  };

  const removeBookmarkFromArchive = (id: string) => {
    const next = bookmarkedLoreIds.filter((item) => item !== id);
    setBookmarkedLoreIds(next);
    localStorage.setItem("kingshadp-bookmarked-lore", JSON.stringify(next));
    window.dispatchEvent(new Event("lore-bookmarks-updated"));
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { message: `LORE_REGISTRY: Evicted dossier from within Archive systems dashboard.`, type: "WARNING" }
    }));
  };

  useEffect(() => {
    syncBookmarks();
    window.addEventListener("lore-bookmarks-updated", syncBookmarks);
    return () => {
      window.removeEventListener("lore-bookmarks-updated", syncBookmarks);
    };
  }, []);

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
      "section-admin": "admin",
      "home": "home",
      "listen": "listen",
      "vault": "vault",
      "artifacts": "artifacts",
      "lore": "lore",
      "community": "community",
      "admin": "admin"
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
  // Universe Omega: Purple-Violet (89, 42, 122) to Prism Ice (139, 185, 220) to Polished Platinum (197, 201, 203)
  const getInterpolatedColor = (pct: number) => {
    const startColor = paradoxMode ? { r: 89, g: 42, b: 122 } : { r: 147, g: 0, b: 10 };
    const midColor = paradoxMode ? { r: 139, g: 185, b: 220 } : { r: 220, g: 197, b: 123 };
    const endColor = { r: 201, g: 198, b: 197 };

    if (pct < 50) {
      const t = pct / 50;
      const r = Math.round(startColor.r * (1 - t) + midColor.r * t);
      const g = Math.round(startColor.g * (1 - t) + midColor.g * t);
      const b = Math.round(startColor.b * (1 - t) + midColor.b * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (pct - 50) / 50;
      const r = Math.round(midColor.r * (1 - t) + endColor.r * t);
      const g = Math.round(midColor.g * (1 - t) + endColor.g * t);
      const b = Math.round(midColor.b * (1 - t) + endColor.b * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const depthColor = getInterpolatedColor(scrollPercent);

  return (
    <div className={`min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#93000a]/35 selection:text-white custom-aiming-reticle relative transition-colors duration-500 ${
      theme === "light" ? "light-theme bg-[#f5f4ef] text-[#111111]" : "bg-[#020202] text-white"
    } ${readabilityEnhanced ? "readability-enhanced" : ""}`}>
      {/* High-fidelity CSS overrides for dynamic Universe Parallel Paradox Shift, Gallery Light Mode, and Enhanced Readability */}
      <style>{`
        ${paradoxMode ? `
          /* Dynamic theme variables matching the mystical blue-silver-purple paradox */
          .text-\\\\[\\\\#c6b89e\\\\] { color: #8bb9dc !important; }
          .border-\\\\[\\\\#c6b89e\\\\] { border-color: #8bb9dc !important; }
          .bg-\\\\[\\\\#c6b89e\\\\] { background-color: #8bb9dc !important; }
          .text-\\\\[\\\\#93000a\\\\] { color: #9c7cf4 !important; }
          .border-\\\\[\\\\#93000a\\\\] { border-color: #9c7cf4 !important; }
          .bg-\\\\[\\\\#93000a\\\\] { background-color: #9c7cf4 !important; }
          
          /* Hover updates */
          .hover\\\\:border-\\\\[\\\\#c6b89e\\\\]:hover { border-color: #8bb9dc !important; }
          .hover\\\\:bg-\\\\[\\\\#c6b89e\\\\]:hover { background-color: #8bb9dc !important; }
          .hover\\\\:text-\\\\[\\\\#c6b89e\\\\]:hover { color: #8bb9dc !important; }
          
          /* Transparent versions */
          .text-\\\\[\\\\#c6b89e\\\\]\\\\/60 { color: rgba(139, 185, 220, 0.6) !important; }
          .text-\\\\[\\\\#c6b89e\\\\]\\\\/40 { color: rgba(139, 185, 220, 0.4) !important; }
          .text-\\\\[\\\\#c6b89e\\\\]\\\\/30 { color: rgba(139, 185, 220, 0.3) !important; }
          .text-\\\\[\\\\#c6b89e\\\\]\\\\/70 { color: rgba(139, 185, 220, 0.7) !important; }
          .border-\\\\[\\\\#c6b89e\\\\]\\\\/30 { border-color: rgba(139, 185, 220, 0.3) !important; }
          .border-\\\\[\\\\#c6b89e\\\\]\\\\/20 { border-color: rgba(139, 185, 220, 0.2) !important; }
          .border-\\\\[\\\\#c6b89e\\\\]\\\\/10 { border-color: rgba(139, 185, 220, 0.1) !important; }
          .border-\\\\[\\\\#93000a\\\\]\\\\/30 { border-color: rgba(156, 124, 244, 0.3) !important; }
          .bg-\\\\[\\\\#c6b89e\\\\]\\\\/10 { background-color: rgba(139, 185, 220, 0.1) !important; }
          .bg-\\\\[\\\\#c6b89e\\\\]\\\\/5 { background-color: rgba(139, 185, 220, 0.05) !important; }
          .bg-\\\\[\\\\#93000a\\\\]\\\\/20 { background-color: rgba(156, 124, 244, 0.2) !important; }
          .selection\\\\:bg-\\\\[\\\\#93000a\\\\]\\\\/30::selection { background-color: rgba(156, 124, 244, 0.3) !important; }
          
          /* Shadow glowing filters */
          .shadow-\\\\[0_0_20px_rgba\\\\(147\\\\,0\\\\,10\\\\,0\\\\.3\\\\)\\\\] { box-shadow: 0 0 20px rgba(156, 124, 244, 0.35) !important; }
          .shadow-\\\\[0_0_20px_rgba\\\\(198\\\\,184\\\\,158\\\\,0\\\\.35\\\\)\\\\] { box-shadow: 0 0 20px rgba(139, 185, 220, 0.35) !important; }
          
          /* Glow filter tags */
          #sanctum-global-cursor-ring > div { background-color: #9c7cf4 !important; }
          #sanctum-global-cursor-ring { border-color: rgba(139, 185, 220, 0.3) !important; }
        ` : ''}

        /* DEFAULT SLIGHT OPACITY BOOST FOR NORMAL MODE BASED ON USER FEEDBACK */
        .text-white\\/50 { opacity: 0.78 !important; }
        .text-white\\/40 { opacity: 0.68 !important; }
        .text-white\\/30 { opacity: 0.58 !important; }

        /* =========================================================================
           AVARICE LUXURY HIGH-END LIGHT GALLERY THEME OVERRIDES
           ========================================================================= */
        .light-theme {
          background-color: #f5f4ef !important;
          color: #111111 !important;
        }
        
        .light-theme ::selection {
          background-color: rgba(147, 0, 10, 0.15) !important;
          color: #93000a !important;
        }
        
        /* Keep WebGL Virtual Stage extremely subtle and clean in light mode */
        .light-theme #virtual-kingdom-stage-canvas,
        .light-theme .virtual-kingdom-stage-img,
        .light-theme [style*="feGaussianBlur"],
        .light-theme .absolute.inset-0.w-full.h-full.overflow-hidden,
        .light-theme .z-0.overflow-hidden.mix-blend-screen {
          opacity: 0.08 !important;
        }
        
        /* Overrides for text color */
        .light-theme .text-white {
          color: #111111 !important;
        }
        .light-theme .text-white\\/90,
        .light-theme .text-white\\/80,
        .light-theme .text-white\\/70,
        .light-theme .text-white\\/60,
        .light-theme .text-white\\/55,
        .light-theme .text-white\\/50,
        .light-theme .text-white\\/45,
        .light-theme .text-white\\/40,
        .light-theme .text-white\\/30,
        .light-theme .text-white\\/20,
        .light-theme .text-white\\/10 {
          color: #292524 !important; /* Stone-800 - extreme visual readability */
          opacity: 1 !important;
        }
        
        /* Custom branding text colors in light mode */
        .light-theme .text-\\[\\#c6b89e\\] {
          color: #78350f !important; /* Deep Golden Bronze */
        }
        .light-theme .text-\\[\\#c6b89e\\]\\/60,
        .light-theme .text-\\[\\#c6b89e\\]\\/40,
        .light-theme .text-\\[\\#c6b89e\\]\\/30,
        .light-theme .text-\\[\\#c6b89e\\]\\/70 {
          color: #92400e !important;
          opacity: 1 !important;
        }
        
        .light-theme .text-\\[\\#93000a\\] {
          color: #93000a !important;
        }
        .light-theme .text-\\[\\#dcc57b\\] {
          color: #854d0e !important; /* Rich Dark Gold for highlight readability */
        }
        
        /* Subtitle block readabilities */
        .light-theme .text-emerald-400 {
          color: #047857 !important;
        }
        
        /* Component borders (hairlines) */
        .light-theme .border-white\\/5,
        .light-theme .border-white\\/10,
        .light-theme .border-white\\/20,
        .light-theme .border-white\\/30,
        .light-theme .border-\\[\\#c6b89e\\]\\/15,
        .light-theme .border-\\[\\#c6b89e\\]\\/20,
        .light-theme .border-\\[\\#c6b89e\\]\\/30,
        .light-theme .border-zinc-800,
        .light-theme .border-zinc-900 {
          border-color: rgba(17, 17, 17, 0.15) !important;
        }
        
        /* Component backgrounds (ivory paper surfaces instead of absolute black voids) */
        .light-theme .bg-black,
        .light-theme .bg-\\[\\#050505\\],
        .light-theme .bg-\\[\\#020202\\],
        .light-theme .bg-zinc-950,
        .light-theme .bg-zinc-900,
        .light-theme .bg-zinc-950\\/80,
        .light-theme .bg-black\\/80,
        .light-theme .bg-black\\/40,
        .light-theme .bg-black\\/60,
        .light-theme .bg-black\\/92,
        .light-theme .bg-black\\/95,
        .light-theme .bg-black\\/55,
        .light-theme .bg-white\\/\\[0\\.01\\],
        .light-theme .bg-white\\/\\[0\\.02\\],
        .light-theme .bg-white\\/\\[0\\.03\\],
        .light-theme .bg-white\\/\\[0\\.04\\],
        .light-theme .bg-white\\/5 {
          background-color: #faf9f5 !important;
          color: #111111 !important;
          backdrop-filter: blur(20px) !important;
        }
        
        /* Glowing controls */
        .light-theme .bg-gradient-to-b.from-white\\/5,
        .light-theme .bg-gradient-to-b.from-white\\/10 {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.03), transparent) !important;
        }
        
        /* CTA Buttons */
        .light-theme .bg-\\[\\#c6b89e\\] {
          background-color: #111111 !important;
          color: #ffffff !important;
          border-color: #111111 !important;
        }
        .light-theme .bg-\\[\\#c6b89e\\]:hover {
          background-color: transparent !important;
          color: #111111 !important;
          border-color: #111111 !important;
        }
        
        /* Correct terminal/telemetry blocks inside light mode */
        .light-theme .font-mono.text-emerald-500,
        .light-theme .font-mono.text-emerald-400 {
          color: #15803d !important;
        }
        .light-theme .font-mono.text-[9px].text-white\\/30 {
          color: #44403c !important;
        }
        .light-theme .scrollbar-thumb {
          background-color: rgba(0,0,0,0.15) !important;
        }
        
        /* Interactive Cursor on Light mode */
        .light-theme #sanctum-global-cursor-ring {
          border-color: rgba(0, 0, 0, 0.2) !important;
        }
        .light-theme #sanctum-global-cursor-ring > div {
          background-color: #93000a !important;
        }
        
        /* Dialogue / Chat overrides */
        .light-theme .bg-zinc-900\\/50 {
          background-color: rgba(0,0,0,0.04) !important;
        }
        
        /* =========================================================================
           ENHANCED READABILITY MODE RULES -- FOR ALL THEMES (REMOVES TRANSPARENCY)
           ========================================================================= */
        
        /* Scale texts and bolster spacing */
        .readability-enhanced p {
          font-size: 16.5px !important;
          line-height: 1.75 !important;
          font-weight: 400 !important;
          letter-spacing: normal !important;
        }
        .readability-enhanced .font-serif.text-\\[14px\\] {
          font-size: 16px !important;
        }
        .readability-enhanced .text-\\[13\\.5px\\],
        .readability-enhanced .text-xs,
        .readability-enhanced .text-\\[12px\\] {
          font-size: 14.5px !important;
        }
        
        .readability-enhanced .text-\\[9\\.5px\\],
        .readability-enhanced .text-\\[9px\\],
        .readability-enhanced .text-\\[8\\.5px\\],
        .readability-enhanced .text-\\[8px\\],
        .readability-enhanced .text-\\[7\\.5px\\],
        .readability-enhanced .text-\\[7px\\] {
          font-size: 11px !important;
          font-weight: 500 !important;
        }
        
        /* Absolutely solid opacities in Dark mode when Readability is Enhanced */
        :not(.light-theme).readability-enhanced .text-white\\/30,
        :not(.light-theme).readability-enhanced .text-white\\/40,
        :not(.light-theme).readability-enhanced .text-white\\/50,
        :not(.light-theme).readability-enhanced .text-white\\/60,
        :not(.light-theme).readability-enhanced .text-white\\/70,
        :not(.light-theme).readability-enhanced .text-white\\/80,
        :not(.light-theme).readability-enhanced .text-white\\/90 {
          color: #ffffff !important;
          opacity: 1 !important;
        }
        
        :not(.light-theme).readability-enhanced .text-\\[\\#c6b89e\\]\\/60,
        :not(.light-theme).readability-enhanced .text-\\[\\#c6b89e\\]\\/40,
        :not(.light-theme).readability-enhanced .text-\\[\\#c6b89e\\]\\/30,
        :not(.light-theme).readability-enhanced .text-\\[\\#c6b89e\\]\\/70 {
          color: #c6b89e !important;
          opacity: 1 !important;
        }
        
        /* Absolutely solid opacities in Light mode when Readability is Enhanced */
        .light-theme.readability-enhanced .text-white\\/30,
        .light-theme.readability-enhanced .text-white\\/40,
        .light-theme.readability-enhanced .text-white\\/50,
        .light-theme.readability-enhanced .text-white\\/60,
        .light-theme.readability-enhanced .text-white\\/70,
        .light-theme.readability-enhanced .text-white\\/80,
        .light-theme.readability-enhanced .text-white\\/90 {
          color: #111111 !important;
          opacity: 1 !important;
        }
        
        /* Background and Panel solidify */
        .readability-enhanced .bg-black\\/80,
        .readability-enhanced .bg-black\\/40,
        .readability-enhanced .bg-black\\/60,
        .readability-enhanced .bg-black\\/92,
        .readability-enhanced .bg-black\\/95,
        .readability-enhanced .bg-black\\/55,
        .readability-enhanced .bg-zinc-950\\/80 {
          opacity: 1 !important;
          background-color: rgba(0, 0, 0, 0.99) !important;
        }
        
        .light-theme.readability-enhanced .bg-black\\/80,
        .light-theme.readability-enhanced .bg-black\\/40,
        .light-theme.readability-enhanced .bg-black\\/60,
        .light-theme.readability-enhanced .bg-black\\/92,
        .light-theme.readability-enhanced .bg-black\\/95,
        .light-theme.readability-enhanced .bg-black\\/55,
        .light-theme.readability-enhanced .bg-zinc-950\\/80 {
          background-color: #ffffff !important;
          opacity: 1 !important;
          border-color: rgba(0,0,0,0.3) !important;
        }
      `}</style>
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
          <VirtualKingdomStage activeTab={activeTab} paradoxMode={paradoxMode} />

          {/* Simple, Pristine Vertical Navigation Dot Bar in Right Margin (No cluttered hud, no 3D rotation, no mesh glows) */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 select-none">
            {[
              { id: "home", label: "HOME", sectionId: "section-home" },
              { id: "listen", label: "LISTEN", sectionId: "section-listen" },
              { id: "vault", label: "VAULT", sectionId: "section-vault" },
              { id: "artifacts", label: "ARTIFACTS", sectionId: "section-artifacts" },
              { id: "lore", label: "LORE", sectionId: "section-lore" },
              { id: "community", label: "COMMUNITY", sectionId: "section-community" }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="group flex items-center justify-end w-24 h-6 cursor-pointer focus:outline-none text-right"
                >
                  <span className="text-[7px] font-sans tracking-[2px] uppercase opacity-0 group-hover:opacity-80 transition-all duration-300 mr-3 text-[#c6b89e] font-medium">
                    {item.label}
                  </span>
                  <div 
                    className="w-[1.5px] transition-all duration-300"
                    style={{
                      height: isActive ? "20px" : "8px",
                      backgroundColor: isActive ? "#c6b89e" : "rgba(198, 184, 158, 0.3)",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Core App Shell */}
          <div className="flex-1 flex flex-col min-h-screen relative z-10">
            
            {/* Main Branding header */}
            <header className="absolute top-0 left-0 right-0 p-6 md:p-12 z-45 flex justify-between items-center pointer-events-none mix-blend-difference select-none">
              <div className="pointer-events-auto flex gap-4 md:gap-6 items-center">
                {/* Fingerprint pulses grid block */}
                <div className="w-12 h-12 border border-[#c6b89e]/30 flex items-center justify-center relative overflow-hidden group hover:bg-white/5 transition-all duration-350 select-none">
                  <div className="w-1.5 h-1.5 bg-[#c6b89e] shadow-[0_0_8px_#c6b89e] animate-pulse rounded-full" />
                </div>
                
                <div>
                  <h1 className="font-serif text-[#c6b89e] text-lg tracking-[12px] uppercase m-0 leading-none">
                    <ScrambleText text="KINGSHADP" triggerOnHover delay={100} duration={1200} />
                  </h1>
                  <div className="text-[7px] uppercase tracking-[3px] opacity-70 font-mono mt-1.5 flex items-center gap-4 text-[#c6b89e]">
                    <ScrambleText text="PRIVATE GALLERY" delay={2000} duration={1000} />
                  </div>
                </div>
              </div>

              {/* Navigation Actions - Desktop viewports (Pristine list of serious tab components) */}
              <nav className="hidden md:flex gap-8 text-[9px] uppercase tracking-[3px] font-sans font-medium opacity-80 pointer-events-auto items-center">
                {[
                  { id: "home", label: "HOME", hover: "MAIN ATRIUM" },
                  { id: "listen", label: "LISTEN", hover: "FREQUENCIES" },
                  { id: "vault", label: "VAULT", hover: "CATALOGUE" },
                  { id: "artifacts", label: "ARTIFACTS", hover: "UNIFORMS" },
                  { id: "lore", label: "LORE", hover: "MYTHOLOGY" },
                  { id: "community", label: "COMMUNITY", hover: "BELIEVERS" },
                ].map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      scrollToSection(`section-${tab.id}`);
                    }}
                    aria-label={`Navigate to ${tab.label}`}
                    className={`hover:text-[#c6b89e] transition-colors pb-1.5 relative group cursor-pointer focus:outline-none ${
                      activeTab === tab.id ? "text-[#c6b89e] font-bold" : "text-white/60"
                    }`}
                  >
                    <ScrambleText text={tab.label} hoverText={tab.hover} delay={200} duration={600} triggerOnHover />
                    <span
                      className={`absolute bottom-0 right-0 h-[1px] bg-[#c6b89e] transition-all duration-300 ${
                        activeTab === tab.id ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                ))}

                {/* Secure Concierge AI Drawer controller */}
                <button
                  onClick={() => setShowChatDrawer(!showChatDrawer)}
                  className="hover:text-white transition-colors pb-1.5 font-sans font-medium text-white/50 hover:border-b hover:border-white focus:outline-none cursor-pointer"
                >
                  CONCIERGE
                </button>

                {/* Vault Admin Section Access */}
                <button
                  onClick={() => {
                    scrollToSection("admin");
                  }}
                  className={`hover:text-white transition-colors pb-1.5 font-sans font-medium focus:outline-none cursor-pointer ${
                    activeTab === "admin" ? "text-[#ff4a00]" : "text-white/40"
                  }`}
                >
                  ADMIN
                </button>
              </nav>

              {/* Mobile hamburger navigation toggler */}
              <div className="md:hidden pointer-events-auto flex gap-3 items-center">
                <button
                  onClick={() => setShowChatDrawer(!showChatDrawer)}
                  className="text-white p-2 border border-white/10 uppercase font-mono text-[8px] tracking-[2px] bg-black/60 backdrop-blur-md"
                >
                  CONCIERGE
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle mobile menu navigation"
                  className="text-[#c6b89e] p-2 border border-white/10 uppercase font-mono text-[8px] tracking-[2px] bg-black/60 backdrop-blur-md flex items-center justify-center cursor-pointer"
                >
                  {mobileMenuOpen ? "CLOSE" : "MENU"}
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
                  className="absolute top-24 left-0 right-0 bg-black/92 backdrop-blur-3xl z-45 border-b border-[#c6b89e]/20 p-8 flex flex-col gap-5 md:hidden select-none overflow-hidden"
                >
                  {/* MOBILE PROCEDURAL MESH GLOW OVERLAY */}
                  <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="mobile-hud-mesh-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.8 0" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <g stroke="#c6b89e" strokeWidth="0.5" opacity="0.35" filter="url(#mobile-hud-mesh-glow)">
                        <line x1="0" y1="25%" x2="100%" y2="25%" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" />
                        <line x1="0" y1="75%" x2="100%" y2="75%" />
                        <line x1="30%" y1="0" x2="30%" y2="100%" />
                        <line x1="70%" y1="0" x2="70%" y2="100%" />
                      </g>
                    </svg>
                  </div>

                  {/* Mobile Paradox Universe, Theme, and Readability Selector */}
                  <div className="relative z-10 border-b border-white/5 pb-4 mb-2 flex flex-col gap-4">
                    {/* Dimension */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[7px] text-white/50 tracking-[3px] uppercase">COSMOS DIMENSION:</span>
                        <span className="font-mono text-[7px] text-[#c6b89e] tracking-[1px]">
                          {paradoxMode ? "OMEGA_PARADOX_999" : "ALPHA_REALM_097"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => paradoxMode && toggleParadoxMode()}
                          className={`text-[8.5px] font-mono tracking-[2px] py-2 border text-center uppercase cursor-pointer focus:outline-none ${
                            !paradoxMode
                              ? "bg-[#c6b89e]/10 border-[#c6b89e] text-[#c6b89e] font-bold"
                              : "border-white/10 text-white/55"
                          }`}
                        >
                          ALPHA GOLD
                        </button>
                        <button
                          onClick={() => !paradoxMode && toggleParadoxMode()}
                          className={`text-[8.5px] font-mono tracking-[2px] py-2 border text-center uppercase cursor-pointer focus:outline-none ${
                            paradoxMode
                              ? "bg-[#8bb9dc]/10 border-[#8bb9dc] text-[#8bb9dc] font-bold shadow-[0_0_12px_rgba(139,185,220,0.15)]"
                              : "border-white/10 text-white/55"
                          }`}
                        >
                          OMEGA PARADOX
                        </button>
                      </div>
                    </div>

                    {/* Mobile Theme Switcher */}
                    <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[7px] text-white/50 tracking-[3px] uppercase">AMBIENT THEME:</span>
                        <span className="font-mono text-[7px] text-[#c6b89e] tracking-[1px]">
                          {theme === "light" ? "GALLERY_LIGHT" : "VOID_DARK"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => theme === "light" && toggleTheme()}
                          className={`text-[8.5px] font-mono tracking-[2px] py-2 border text-center uppercase cursor-pointer focus:outline-none ${
                            theme === "dark"
                              ? "bg-[#c6b89e]/10 border-[#c6b89e] text-[#c6b89e] font-bold"
                              : "border-white/10 text-white/55"
                          }`}
                        >
                          VOID (DARK)
                        </button>
                        <button
                          onClick={() => theme === "dark" && toggleTheme()}
                          className={`text-[8.5px] font-mono tracking-[2px] py-2 border text-center uppercase cursor-pointer focus:outline-none ${
                            theme === "light"
                              ? "bg-[#93000a]/10 border-[#93000a] text-[#93000a] font-bold"
                              : "border-white/10 text-white/55"
                          }`}
                        >
                          GALLERY (LIGHT)
                        </button>
                      </div>
                    </div>

                    {/* Mobile Readability Switcher */}
                    <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[7px] text-white/50 tracking-[3px] uppercase">READABILITY & SIZE:</span>
                        <span className="font-mono text-[7px] text-[#c6b89e] tracking-[1px]">
                          {readabilityEnhanced ? "ENHANCED_LARGE" : "STANDARD_MINIMAL"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => readabilityEnhanced && toggleReadability()}
                          className={`text-[8.5px] font-mono tracking-[2px] py-2 border text-center uppercase cursor-pointer focus:outline-none ${
                            !readabilityEnhanced
                              ? "bg-[#c6b89e]/10 border-[#c6b89e] text-[#c6b89e] font-bold"
                              : "border-white/10 text-white/55"
                          }`}
                        >
                          STANDARD
                        </button>
                        <button
                          onClick={() => !readabilityEnhanced && toggleReadability()}
                          className={`text-[8.5px] font-mono tracking-[2px] py-2 border text-center uppercase cursor-pointer focus:outline-none ${
                            readabilityEnhanced
                              ? "bg-[#dcc57b]/15 border-[#dcc57b] text-[#dcc57b] font-bold"
                              : "border-white/10 text-white/55"
                          }`}
                        >
                          LARGE / ENHANCED
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col gap-5">
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
                        className="text-left font-mono text-[10px] tracking-[6px] text-white/70 hover:text-[#c6b89e] transition-colors py-4 border-b border-white/5 flex justify-between items-center relative focus:outline-none"
                      >
                        <span>{tab.label}</span>
                        <span className="text-[8px] opacity-30">0{idx + 1}</span>
                      </button>
                    ))}
                  </div>
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
                    <HomeSection onNavigate={(tab) => scrollToSection(`section-${tab}`)} paradoxMode={paradoxMode} />
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
                    <LoreSection paradoxMode={paradoxMode} />
                  )}

                  {/* SECTION 6: COMMUNITY (Citadel Portal / Believers Platform) */}
                  {activeTab === "community" && (
                    <CommunitySection />
                  )}

                  {/* SECTION 7: ADMIN CONSOLE (Sovereign CMS Dynamic Panel) */}
                  {activeTab === "admin" && (
                    <AdminSection />
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

              <div className="flex flex-wrap items-center gap-6 text-[8px] font-mono tracking-[1.5px] text-[#c6b89e]/50 border-[#c6b89e]/10 lg:border-l lg:pl-6">
                <div className="flex items-center gap-2">
                  <span>THEME:</span>
                  <button 
                    onClick={toggleTheme} 
                    className="text-white/60 hover:text-[#c6b89e] transition-colors focus:outline-none cursor-pointer uppercase"
                  >
                    {theme === "dark" ? "VOID" : "GALLERY"}
                  </button>
                </div>
                <span className="opacity-10 hidden lg:inline">|</span>
                <div className="flex items-center gap-2">
                  <span>TEXT:</span>
                  <button 
                    onClick={toggleReadability} 
                    className="text-white/60 hover:text-[#c6b89e] transition-colors focus:outline-none cursor-pointer uppercase"
                  >
                    {readabilityEnhanced ? "LARGE" : "STANDARD"}
                  </button>
                </div>
                <span className="opacity-10 hidden lg:inline">|</span>
                <div className="flex items-center gap-2">
                  <span>FOCUS:</span>
                  <button 
                    onClick={toggleParadoxMode} 
                    className="text-white/60 hover:text-[#c6b89e] transition-colors focus:outline-none cursor-pointer uppercase"
                  >
                    {paradoxMode ? "OMEGA" : "ALPHA"}
                  </button>
                </div>
              </div>

              <span className="font-sans font-light tracking-[2px] uppercase text-[7.5px] text-[#c6b89e]/50">
                KingShadP Private Art Exhibition // All Rights Reserved
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

                  {/* TAB SELECTORS FOR THE ARCHIVE MODULE */}
                  <div className="flex gap-4 border-b border-white/10 pb-4 mb-10 select-none">
                    <button
                      onClick={() => setArchiveTab("global")}
                      className={`px-5 py-3 border font-mono text-[9px] uppercase tracking-[3px] cursor-pointer transition-all focus:outline-none ${
                        archiveTab === "global"
                          ? "border-[#c6b89e] bg-[#c6b89e]/10 text-[#c6b89e]"
                          : "border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      GLOBAL SYSTEMS TERMINAL
                    </button>
                    <button
                      onClick={() => setArchiveTab("saved")}
                      className={`px-5 py-3 border font-mono text-[9px] uppercase tracking-[3px] cursor-pointer transition-all focus:outline-none flex items-center gap-2 ${
                        archiveTab === "saved"
                          ? "border-red-600 bg-red-950/15 text-red-500"
                          : "border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      Saved Dossiers Registry
                      {bookmarkedLoreIds.length > 0 && (
                        <span className="bg-red-600 text-white text-[8px] font-mono px-1.5 py-0.5 rounded-none font-bold">
                          {bookmarkedLoreIds.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Tab Panes */}
                  <AnimatePresence mode="wait">
                    {archiveTab === "global" ? (
                      <motion.div
                        key="global"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                      >
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
                                  setBlueprintMounted(true);
                                }}
                                className={`px-3 py-1.5 border text-[9px] font-mono uppercase transition-all tracking-[2px] cursor-pointer ${
                                  blueprintMounted 
                                    ? "border-[#c6b89e] text-[#c6b89e] bg-[#c6b89e]/10 font-semibold"
                                    : "border-white/20 text-white hover:bg-white/10"
                                }`}
                              >
                                {blueprintMounted ? "✓ BLUEPRINTS MOUNTED" : "Mount Blueprint File"}
                              </button>
                              {blueprintMounted && (
                                <div className="text-[8.5px] font-mono text-[#c6b89e] mt-2 uppercase tracking-[1.5px] animate-pulse">
                                  // MOUNT OK: Aegean beachfront estate drawings successfully projected below
                                </div>
                              )}
                            </div>
                            <AcquisitionGrid isInline={true} />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="saved"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                      >
                        {bookmarkedLoreIds.length === 0 ? (
                          <div className="border border-dashed border-white/10 bg-black/40 py-24 text-center select-none text-[#ff4a00]">
                            <div className="font-mono text-xs tracking-[4px] uppercase mb-2">NO SECURE DOSSIERS MARKED FOR PRESERVATION</div>
                            <p className="font-sans text-[11.5px] text-white/30 font-light max-w-md mx-auto">
                              Open the LORE section and click "LOCK DOSSIER TO REGISTRY" on any historical intelligence chapter to archive it securely here.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {bookmarkedLoreIds.map((id) => {
                              const info = ARCHIVE_LORE_LOOKUP[id];
                              if (!info) return null;
                              return (
                                <div key={id} className="border border-white/10 bg-black/60 p-6 flex flex-col justify-between relative rounded-none text-left select-text">
                                  <div className="absolute top-2 right-2 text-white/20 font-mono text-[7.5px] select-none">// SECURE_ARCHIVE_LOCK</div>
                                  <div>
                                    <div className="font-mono text-[8.5px] text-[#ff4a00] tracking-[2.5px] uppercase mb-2 select-none">
                                      {info.subtitle}
                                    </div>
                                    <h4 className="font-serif text-xl text-white font-normal mb-1">{info.title}</h4>
                                    <div className="font-mono text-[9px] text-[#c6b89e] mb-4 select-none">MATRIX EPOCH: {info.era}</div>
                                    <p className="font-sans text-[12.5px] text-white/50 leading-relaxed font-light mb-8 text-justify">
                                      {info.desc}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeBookmarkFromArchive(id)}
                                    className="w-full py-2.5 border border-[#93000a] text-[#93000a] hover:bg-[#93000a] hover:text-white transition-all text-[9.5px] font-mono tracking-[3px] uppercase cursor-pointer focus:outline-none"
                                  >
                                    [ EVICT FROM CABINET ]
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

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

                  {!newsletterSubmitted ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent("telemetry-log", {
                          detail: { message: "COORDINATE DISPATCHED: Registered via floating modal popup.", type: "SYSTEM" }
                        }));
                        setNewsletterSubmitted(true);
                        setTimeout(() => {
                          setShowNewsletterModal(false);
                          // Reset state after close animation completes
                          setTimeout(() => setNewsletterSubmitted(false), 500);
                        }, 2000);
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
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 border border-[#c6b89e]/30 bg-[#c6b89e]/5 text-[#c6b89e] font-mono text-[10px] tracking-[1.5px] uppercase leading-relaxed text-center"
                    >
                      ✓ SECURED ENTRANCE:
                      <br />
                      Biometric credential list lock complete. Connecting signal...
                    </motion.div>
                  )}
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
