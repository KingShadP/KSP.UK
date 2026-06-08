/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Crosshair, ArrowLeft, Lock, Check, Send, Terminal, AlertCircle, Key, Cpu, Radio } from "lucide-react";
import ScrambleText from "./ScrambleText";
import { Asset } from "../types";

const VAL_HISTORY = "Valuation History";
const ACQ_COST = "Acquisition Cost";

const ASSETS_LIST: Asset[] = [
  {
    id: "OBJ-01",
    name: '"MEDITERRANEAN CRUISER"',
    specs: "HYBRID HULL / 86M / BESPOKE OUTLAY",
    price: "€ 142.000.000",
    img: "1569085812234-fc03d368e592",
    fullSpecs: [
      "86M L.O.A. Custom Hull",
      "Hybrid Propulsion Unit",
      "Zero-noise Cruise Dynamics",
      "Submersible Yacht Tender",
      "Acoustic Stabilization Systems",
    ],
    history: [
      { year: "2022", val: "€ 130.5M" },
      { year: "2024", val: "€ 138.0M" },
      { year: "CURRENT", val: "€ 142.0M" },
    ],
  },
  {
    id: "OBJ-02",
    name: '"EXECUTIVE TRANSIT JET"',
    specs: "G700 / EXTENDED RANGE / ACU-CABIN",
    price: "€ 88.500.000",
    img: "1540962222-1f4cc06994fb",
    fullSpecs: [
      "Extended Range Fuel Configuration",
      "Custom Chronos Flight Cabin Suite",
      "Acoustic Signature Dampening",
      "In-flight Secure Broadband Hub",
      "Carbon-neutral Aviation Certified",
    ],
    history: [
      { year: "2021", val: "€ 75.0M" },
      { year: "2023", val: "€ 82.2M" },
      { year: "CURRENT", val: "€ 88.5M" },
    ],
  },
  {
    id: "OBJ-03",
    name: '"AEGEAN SANCTUM COMPLEX"',
    specs: "CLIFFSIDE RESIDENCY / GEOTHERMAL",
    price: "€ 112.500.000",
    img: "1503387762-592deb58ef4e",
    fullSpecs: [
      "Self-sustaining Geothermal Plant",
      "Off-grid Seismic Damping Protection",
      "Cast Concrete Brutalist Geometry",
      "Automated Custom Climatic Balance",
      "Private Coastal Deep-water Access",
    ],
    history: [
      { year: "2019", val: "€ 95.0M" },
      { year: "2022", val: "€ 105.0M" },
      { year: "CURRENT", val: "€ 112.5M" },
    ],
  },
  {
    id: "OBJ-04",
    name: '"CREATIVE ATELIER WORKSTATION"',
    specs: "ATELIER HUB / DIGITAL COMMS",
    price: "€ 24.000.000",
    img: "1558494949-ef010cbdcc31",
    fullSpecs: [
      "Bespoke High-bandwidth Fiber Trunks",
      "Precision Solar Thermal Grid Backups",
      "Submerged Closed-loop Cooling Suite",
      "Monolithic Custom Cast Concrete Layout",
      "Unified Creative Design Server Stack",
    ],
    history: [
      { year: "2024", val: "€ 18.0M" },
      { year: "2025", val: "€ 21.0M" },
      { year: "CURRENT", val: "€ 24.0M" },
    ],
  },
];

interface AcquisitionGridProps {
  onClose?: () => void;
  isInline?: boolean;
}

export default function AcquisitionGrid({ onClose, isInline }: AcquisitionGridProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dossierTab, setDossierTab] = useState<"specs" | "blueprint" | "materials">("specs");
  
  // Custom interactive secure gateway state
  const [showGateway, setShowGateway] = useState(false);
  const [operatorCode, setOperatorCode] = useState("");
  const [selectedRelay, setSelectedRelay] = useState("AEGEAN DIRECT RELAY S7");
  const [secureMessage, setSecureMessage] = useState("");
  const [selectedCipher, setSelectedCipher] = useState("AES-256-GCM");
  
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionLog, setTransmissionLog] = useState<string[]>([]);
  const [isDoneTransmitting, setIsDoneTransmitting] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState("");

  const handleInquiryInit = () => {
    setShowGateway(true);
    setOperatorCode("");
    setSecureMessage("");
    setIsDoneTransmitting(false);
    setIsTransmitting(false);
    setTransmissionLog([]);
  };

  const startSecureTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorCode.trim()) return;
    
    setIsTransmitting(true);
    setIsDoneTransmitting(false);
    setTransmissionLog([]);
    
    const steps = [
      "CRITICAL: Handshake request broadcast to sat-link matrix...",
      "UPLINK STATUS: [CONNECTION SECURED] - Latency 14ms",
      "UPLINK STATUS: Relayed over geographical isolation unit node...",
      "PAYLOAD CONFIG: Compiling buy-request specs for " + selectedAsset?.name + "...",
      "CRYPTOGRAPHIC: Encrypting memory registers using " + selectedCipher + " cipher envelope...",
      "SECURITY HARDENING: Adding dual-pass biometric hash footprint...",
      "LOCAL PROTOCOL: Syncing telemetry to secure local directive logs...",
      "COMPLETED: Inquiry file dispatched. Cryptographic security locks engaged."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setTransmissionLog(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Auto-insert note note inside ScribeNotes local storage
        const purchaseReceipt = "SANCTUM-AQ-" + Math.floor(100000 + Math.random() * 90000) + "-CODE";
        setGeneratedReceipt(purchaseReceipt);
        
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const nowStr = new Date().toLocaleDateString("en-GB", options).toUpperCase().replace(",", " /");

        const newNote = {
          id: "acq-" + Date.now().toString(),
          timestamp: nowStr,
          title: `BUY REQ: ${selectedAsset?.name}`,
          text: `Confidential Operational Request logged.\nAsset Ref: ${selectedAsset?.id}\nInquiry Cost: ${selectedAsset?.price}\nOperator: ${operatorCode.toUpperCase()}\nUplink Route: ${selectedRelay}\nCipher: ${selectedCipher}\nDirect Receipt Access Code: ${purchaseReceipt}\nNotes: ${secureMessage || "N/A"}`
        };

        const saved = localStorage.getItem("sanctum_notes");
        let list = [];
        if (saved) {
          try {
            list = JSON.parse(saved);
          } catch (e) {
            console.error(e);
          }
        }
        const updated = [newNote, ...list];
        localStorage.setItem("sanctum_notes", JSON.stringify(updated));
        
        // Dispatch instant event to re-sync Notes components UI panels across views
        window.dispatchEvent(new Event("sanctum_notes_updated"));

        setIsTransmitting(false);
        setIsDoneTransmitting(true);
      }
    }, 450);
  };

  const handleCloseGateway = () => {
    setShowGateway(false);
    setSelectedAsset(null);
  };

  return (
    <motion.div
      initial={isInline ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={isInline
        ? "relative w-full z-30 flex flex-col select-none select-text mt-8"
        : "absolute inset-0 z-40 bg-[#020202]/95 backdrop-blur-2xl flex flex-col pt-12 md:pt-20 px-6 md:px-24 overflow-y-auto custom-scrollbar select-none"
      }
    >
      {!isInline && <div className="absolute inset-0 bg-[#050505] -z-10 mix-blend-multiply" />}

      {/* Top Banner section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 md:mb-16 gap-8 border-b border-[#c6b89e]/20 pb-8 relative">
        <div className="absolute top-0 right-0 w-32 h-[1px] bg-[#c6b89e]" />

        <div className="w-full">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8">
            {!isInline && onClose && (
              <button
                onClick={onClose}
                aria-label="Return to Sanctum main deck"
                className="px-4 py-3 min-h-[44px] min-w-[44px] border border-[#c6b89e]/30 text-[#c6b89e]/60 hover:text-black hover:bg-[#c6b89e] transition-all duration-300 font-mono text-[9px] md:text-[10px] tracking-[3px] md:tracking-[4px] uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c6b89e] focus:ring-offset-1 focus:ring-offset-black"
              >
                &lt; Return
              </button>
            )}

            <div className="inline-flex items-center gap-3 md:gap-4 border border-[#c6b89e] px-4 py-1.5 opacity-80">
              <span className="font-mono text-[8px] md:text-[10px] tracking-[4px] md:tracking-[6px] uppercase text-[#c6b89e]">
                <ScrambleText text="PREVUE SUITE" />
              </span>
            </div>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-widest text-[#c6b89e] font-light leading-none">
            <ScrambleText text="LUXURY LANDMARKS" duration={1200} />
          </h2>
          <p className="font-mono text-[9px] md:text-[10px] tracking-[3px] md:tracking-[5px] text-[#ff4a00]/70 mt-3 md:mt-4 uppercase">
            "ARCHITECTURAL PORTFOLIO & SPECIFICATION DEMOS"
          </p>
          <p className="font-sans text-[13px] md:text-sm text-white/50 tracking-normal leading-relaxed mt-4 max-w-4xl font-light">
            A curated virtual exhibition of our premium residential, transit, and structural commissions. KingShadP delivers self-sustaining brutalist cliffside compounds, state-of-the-art hybrid maritime vessels, and private design laboratories designed for discerning patrons worldwide.
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-32">
        {ASSETS_LIST.map((asset, s) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: s * 0.15 + 0.2, duration: 0.8 }}
            className="group cursor-pointer"
            onClick={() => setSelectedAsset(asset)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 group-hover:border-[#c6b89e]/50 transition-colors duration-500 bg-black">
              {/* Card top/corners HUD */}
              <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Crosshair className="w-6 h-6 text-[#c6b89e] opacity-0 group-hover:opacity-100 transition-opacity duration-500 origin-center group-hover:rotate-90" />
                  
                  <div className="border border-[#c6b89e] bg-black/50 backdrop-blur-md px-3 py-1 font-mono text-[9px] tracking-[4px] text-[#c6b89e] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    IDENT: {asset.id}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="font-mono text-[8px] tracking-[4px] text-white/50 bg-black/60 px-2 py-1 backdrop-blur-sm">
                    {asset.specs}
                  </div>
                  
                  {/* Glowing mini bar stats */}
                  <div className="flex items-end gap-[2px] h-6 mix-blend-screen opacity-50">
                    {[1, 3, 2, 8, 4, 1, 5, 2, 7, 3, 1, 4].map((c, x) => (
                      <div
                        key={x}
                        className="w-[2px] bg-[#c6b89e]"
                        style={{ height: `${c * 10}%` }}
                      />
                    ))}
                  </div>

                  <Lock className="w-4 h-4 text-[#ff4a00] ml-4" />
                </div>
              </div>

              {/* Dynamic Image */}
              <img
                src={`https://images.unsplash.com/photo-${asset.img}?q=80&w=1200&auto=format&fit=crop`}
                alt={asset.name}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[1.5s] ease-out mix-blend-screen"
              />
              
              {/* SCAN OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6b89e]/10 to-transparent -translate-y-full group-hover:animate-scanline pointer-events-none mix-blend-overlay" />
            </div>

            {/* Title and stats bar bottom */}
            <div className="mt-6 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-2xl tracking-widest text-[#c6b89e] flex items-center gap-4 uppercase font-light">
                  {asset.name}
                </h3>
                <span className="font-mono text-[10px] tracking-[3px] text-white/40 uppercase">
                  ESTATE SPECS & DEVELOPMENT DOSSIER
                </span>
              </div>
              <div className="text-xl font-mono tracking-wider text-white bg-[#020202] py-1 border-b border-[#c6b89e]/30 group-hover:text-[#ff4a00] transition-colors">
                {asset.price}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Dialog overlay modal */}
      <AnimatePresence>
        {selectedAsset && !showGateway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-3xl overflow-y-auto select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="bg-[#050505] border border-[#c6b89e]/20 w-full max-w-6xl h-auto md:h-[85vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/5"
            >
              {/* Laser beam animation scrolling bar */}
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-[#ff4a00]/30 shadow-[0_0_20px_#ff4a00] pointer-events-none z-50 mix-blend-screen"
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedAsset(null)}
                aria-label="Close detailed visual overlay"
                className="absolute top-6 right-6 z-50 py-3 px-5 bg-black/30 backdrop-blur-md border border-[#c6b89e]/20 text-[#c6b89e] hover:bg-[#c6b89e] hover:text-black transition-all duration-500 cursor-pointer flex items-center gap-4 font-mono text-[10px] tracking-[4px] uppercase group focus:outline-none focus:ring-2 focus:ring-[#c6b89e] focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-500">
                  Close View
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Left Side: Photo Frame container */}
              <div className="w-full md:w-1/2 h-[40vh] md:h-full relative border-b md:border-b-0 md:border-r border-[#c6b89e]/10 bg-black overflow-hidden flex-shrink-0 group/img">
                <motion.img
                  initial={{ scale: 1.2, filter: "grayscale(100%) blur(10px)" }}
                  animate={{ scale: 1, filter: "grayscale(80%) blur(0px)" }}
                  exit={{ scale: 1.1, filter: "grayscale(100%) blur(10px)" }}
                  transition={{ duration: 1.8 }}
                  referrerPolicy="no-referrer"
                  src={`https://images.unsplash.com/photo-${selectedAsset.img}?q=80&w=1600&auto=format&fit=crop`}
                  alt={selectedAsset.name}
                  className="w-full h-full object-cover mix-blend-screen opacity-70 group-hover/img:scale-110 group-hover/img:opacity-100 group-hover/img:filter-none transition-all duration-[4s] ease-out"
                />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="font-mono text-[10px] tracking-[4px] text-[#ff4a00] mb-3 uppercase animate-pulse flex items-center gap-3">
                    <span className="w-2.5 h-2.5 bg-[#ff4a00] rounded-full inline-block shadow-[0_0_8px_#ff4a00]" />
                    ESTABLISHING TARGET UPLINK...
                  </div>
                  <h3 className="text-2xl md:text-4xl text-white font-sans tracking-wider uppercase font-light">
                    {selectedAsset.name}
                  </h3>
                </div>
              </div>

              {/* Right Side: Configuration spec log */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between overflow-y-auto custom-scrollbar select-text bg-[#030303]">
                <div>
                  <div className="font-mono text-[9px] tracking-[4px] text-white/30 uppercase mb-2">
                    System Asset Number
                  </div>
                  <div className="text-white text-3xl font-mono tracking-widest mb-6 border-b border-white/10 pb-6 flex justify-between items-end">
                    <span>{selectedAsset.id}</span>
                    <span className="text-[#ff4a00] text-[10px] tracking-[3px] font-bold uppercase animate-pulse">CLASSIFIED DOSSIER</span>
                  </div>

                  {/* HIGH-FIDELITY ARCHITECTURAL SUBTABS */}
                  <div className="flex border-b border-white/10 mb-8 pb-[1px] gap-2 md:gap-4 select-none">
                    {[
                      { id: "specs", label: "TECHNICAL SPECS" },
                      { id: "blueprint", label: "ARCHITECTURAL BLUEPRINT" },
                      { id: "materials", label: "GEOTECH LEDGER" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDossierTab(tab.id as any)}
                        className={`pb-3 text-[9px] font-mono tracking-[2px] md:tracking-[3px] uppercase cursor-pointer transition-all relative ${
                          dossierTab === tab.id ? "text-[#c6b89e] font-bold" : "text-white/40 hover:text-white/80"
                        }`}
                      >
                        {tab.label}
                        {dossierTab === tab.id && (
                          <motion.div
                            layoutId="activeSubtabLine"
                            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c6b89e]"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {dossierTab === "specs" && (
                      <motion.div
                        key="specs"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mb-10"
                      >
                        <h3 className="text-[#c6b89e]/50 font-mono text-[9px] tracking-[5px] mb-6 uppercase">
                          Classified Technical Specs
                        </h3>
                        <ul className="space-y-4">
                          {selectedAsset.fullSpecs.map((spec, s_i) => (
                            <li
                              key={s_i}
                              className="flex items-center gap-4 text-white text-[12px] md:text-[14px] font-sans font-extralight group border-b border-[#c6b89e]/5 pb-3 hover:border-[#c6b89e]/30 transition-colors"
                            >
                              <span className="text-[#ff4a00]/30 group-hover:text-[#ff4a00] transition-colors font-bold">
                                {String(s_i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-white/80 group-hover:text-white transition-colors">
                                {spec}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {dossierTab === "blueprint" && (
                      <motion.div
                        key="blueprint"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mb-10"
                      >
                        <h4 className="text-[#c6b89e]/50 font-mono text-[9px] tracking-[5px] mb-4 uppercase">
                          Structural Projection Drawing
                        </h4>
                        
                        <div className="border border-[#c6b89e]/20 bg-black/60 p-5 rounded-sm select-none relative overflow-hidden mb-6">
                          <div className="absolute top-2 right-4 text-[7px] font-mono text-[#ff4a00]/50 tracking-[2px] uppercase">SYS_GRID_BLUEPRINT</div>
                          
                          {/* Laser blueprint vector layout drawing */}
                          <div className="h-44 w-full border border-dashed border-[#c6b89e]/10 relative mb-4 flex items-center justify-center bg-[#010101]/80">
                            <svg viewBox="0 0 400 200" className="w-5/6 h-5/6 stroke-[#c6b89e]/40 fill-none stroke-1">
                              {/* Grid lines in bg */}
                              <g stroke="rgba(198,184,158,0.05)" strokeWidth="0.5">
                                <line x1="50" y1="0" x2="50" y2="200" />
                                <line x1="100" y1="0" x2="100" y2="200" />
                                <line x1="150" y1="0" x2="150" y2="200" />
                                <line x1="200" y1="0" x2="200" y2="200" />
                                <line x1="250" y1="0" x2="250" y2="200" />
                                <line x1="300" y1="0" x2="300" y2="200" />
                                <line x1="350" y1="0" x2="350" y2="200" />
                                <line x1="0" y1="50" x2="400" y2="50" />
                                <line x1="0" y1="100" x2="400" y2="100" />
                                <line x1="0" y1="150" x2="400" y2="150" />
                              </g>
                              
                              {/* Dynamic shape depending on active asset ID */}
                              {selectedAsset.id === "OBJ-01" ? (
                                <>
                                  <path d="M 20 100 Q 80 100 120 110 L 320 110 L 360 85 L 320 85 Q 200 75 120 90 Z" strokeWidth="0.8" />
                                  <path d="M 120 90 L 260 90 L 290 85 L 150 85 Z" strokeWidth="0.5" strokeDasharray="3 2" />
                                  <circle cx="290" cy="98" r="5" stroke="#ff4a00" />
                                  <circle cx="160" cy="98" r="5" stroke="#ff4a00" />
                                  <line x1="20" y1="100" x2="380" y2="100" strokeWidth="0.5" strokeDasharray="6 6" strokeOpacity="0.2" />
                                </>
                              ) : selectedAsset.id === "OBJ-02" ? (
                                <>
                                  <path d="M 40 100 L 150 90 L 240 70 L 330 70 L 300 100 L 150 110 Z" strokeWidth="0.8" />
                                  <path d="M 150 90 L 300 100 M 180 90 L 220 130 L 210 135 L 160 90 Z" strokeWidth="0.5" />
                                  <line x1="330" y1="70" x2="350" y2="55" strokeWidth="0.5" />
                                  <circle cx="150" cy="100" r="4" stroke="#ff4a00" />
                                  <line x1="10" y1="100" x2="390" y2="100" strokeWidth="0.5" strokeDasharray="4 4" strokeOpacity="0.2" />
                                </>
                              ) : selectedAsset.id === "OBJ-03" ? (
                                <>
                                  <path d="M 10 140 L 110 140 L 140 90 L 180 90 L 180 50 L 280 50 L 280 90 L 320 90 L 350 140 Z" strokeWidth="0.8" />
                                  <line x1="140" y1="90" x2="320" y2="90" strokeWidth="0.5" strokeDasharray="3 3" />
                                  <path d="M 230 50 L 230 160" stroke="#ff4a00" strokeWidth="0.5" strokeDasharray="4 4" />
                                  <rect x="210" y="70" width="40" height="25" stroke="#ff4a00" strokeWidth="0.5" />
                                  <line x1="10" y1="140" x2="390" y2="140" strokeWidth="0.75" strokeOpacity="0.4" />
                                </>
                              ) : (
                                <>
                                  <rect x="120" y="40" width="160" height="120" rx="4" strokeWidth="0.8" />
                                  <line x1="120" y1="80" x2="280" y2="80" strokeWidth="0.5" />
                                  <line x1="120" y1="120" x2="280" y2="120" strokeWidth="0.5" />
                                  <circle cx="200" cy="100" r="20" stroke="#ff4a00" strokeWidth="0.5" strokeDasharray="3 2" />
                                  <circle cx="200" cy="100" r="2.5" fill="#ff4a00" />
                                </>
                              )}
                            </svg>
                          </div>

                          {/* Technical blueprints measurements specifications mapping */}
                          <div className="space-y-3.5 font-mono text-[9px] md:text-[10px] text-white/70 leading-relaxed uppercase pb-1">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-white/40">SPATIAL DIMENS:</span>
                              <span className="text-[#c6b89e] text-right font-semibold">
                                {selectedAsset.id === "OBJ-01" ? "L.O.A: 86.40m | Beam: 14.20m | Draft: 3.85m" :
                                 selectedAsset.id === "OBJ-02" ? "Wingspan: 31.39m | Length: 33.48m | Cabin Height: 1.91m" :
                                 selectedAsset.id === "OBJ-03" ? "Footprint: 1,840 sq m | Elevation: +442m above MSL" :
                                 "Basement Depth: -12.40m | Floor Area: 750 sq m"}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-white/40">DISPLACEMENT/LOAD:</span>
                              <span className="text-[#c6b89e] text-right">
                                {selectedAsset.id === "OBJ-01" ? "Gross Tonnage: 2,420 GT | Fuel: 180,000 L" :
                                 selectedAsset.id === "OBJ-02" ? "Max MTOW: 107,600 lbs | Fuel: 45,300 lbs" :
                                 selectedAsset.id === "OBJ-03" ? "Concrete Volume: 14,200 cu m | Boring Depth: 450m" :
                                 "Subterranean Feed: Triple-redundant 10 kV Power Grid"}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-white/40">SYSTEM DRIVES:</span>
                              <span className="text-[#c6b89e] text-right">
                                {selectedAsset.id === "OBJ-01" ? "Hybrid MTU 16V 4000 M73L (cada 2,560 kW)" :
                                 selectedAsset.id === "OBJ-02" ? "Dual Rolls-Royce Pearl 700 Thrust-vector (each 18,250 lbf)" :
                                 selectedAsset.id === "OBJ-03" ? "Bespoke Closed-loop Organic Rankine Geothermal Turbine" :
                                 "Water-cooled Cryogenic Server Heat Exchangers"}
                              </span>
                            </div>
                            <div className="flex justify-between pb-1">
                              <span className="text-white/40">GEOCOORDS PINPOINT:</span>
                              <span className="text-[#ff4a00] text-right font-bold">
                                {selectedAsset.id === "OBJ-01" ? "37.4262° N, 25.3267° E (MYK_CONSTRUCT)" :
                                 selectedAsset.id === "OBJ-02" ? "47.3769° N, 8.5417° E (ZRH_HANGER)" :
                                 selectedAsset.id === "OBJ-03" ? "36.4166° N, 25.4324° E (SANTORINI_CLIFF)" :
                                 "46.2044° N, 6.1432° E (CERN_GENEVA_LAB)"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {dossierTab === "materials" && (
                      <motion.div
                        key="materials"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mb-10"
                      >
                        <h3 className="text-[#c6b89e]/50 font-mono text-[9px] tracking-[5px] mb-6 uppercase">
                          Geotechnical & Shielding Index
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 text-left">
                          {[
                            { label: "EM_SHIELD_RATING", value: "120 dB at 10 GHz (Faradic Vault)" },
                            { label: "ACOUSTIC_NOISE_FLOOR", value: "NC-15 low-frequency damping profile" },
                            { label: "SEISMIC_DAMP_FACTOR", value: "8.5 Richter active-weight damping" },
                            { label: "THERMAL_INSULATION", value: "U = 0.12 W/(m²·K) (Triple Subzero)" },
                            { label: "FIRE_INTEGRITY", value: "EI-180 rated double containment walls" },
                            { label: "AUTONOMOUS_GRID", value: "720 hours geothermal/battery capacity" }
                          ].map((led, li) => (
                            <div key={li} className="border border-white/5 p-3.5 bg-[#010101]/60 flex flex-col justify-between hover:border-[#c6b89e]/20 transition-all text-ellipsis overflow-hidden">
                              <span className="text-[7.5px] font-mono text-white/30 tracking-[1px] mb-2">{led.label}</span>
                              <span className="text-[10px] font-mono text-[#c6b89e] font-light leading-snug">{led.value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Valuation History */}
                  <div className="mb-10">
                    <h3 className="text-[#c6b89e]/50 font-mono text-[9px] tracking-[5px] mb-6 uppercase block">
                      {VAL_HISTORY}
                    </h3>
                    <div className="flex gap-4">
                      {selectedAsset.history.map((hist, hist_i) => (
                        <div
                          key={hist_i}
                          className="bg-black/40 border border-[#c6b89e]/10 p-5 flex-1 hover:border-[#c6b89e]/40 transition-colors group backdrop-blur-sm"
                        >
                          <div className="font-mono text-[8px] md:text-[10px] tracking-[4px] text-white/30 mb-3 group-hover:text-white/60">
                            {hist.year}
                          </div>
                          <div className="font-mono text-[12px] md:text-[14px] tracking-[1px] text-[#c6b89e] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(198,184,158,0.2)] transition-all">
                            {hist.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secure buying / Inquiry CTA */}
                <div className="mt-12 pt-10 border-t border-[#c6b89e]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                  <div>
                    <div className="text-[9px] font-mono tracking-[4px] text-white/30 uppercase mb-2">
                      {ACQ_COST}
                    </div>
                    <div className="text-3xl md:text-5xl font-mono tracking-widest text-[#c6b89e]">
                      {selectedAsset.price}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleInquiryInit}
                    aria-label="Initiate confidential acquisition inquiry"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full md:w-auto px-10 py-5 bg-[#ff4a00] text-black font-sans font-bold text-[12px] tracking-[4px] uppercase hover:bg-white hover:shadow-[0_0_30px_rgba(255,74,0,0.6)] transition-all duration-500 cursor-pointer text-center group focus:outline-none focus:ring-2 focus:ring-[#ff4a00] focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <span className="relative z-10">Initiate Inquiry</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE ENCRYPTED INQUIRY GATEWAY OVERLAY MODAL */}
      <AnimatePresence>
        {showGateway && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl overflow-y-auto select-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="bg-[#040404] border border-[#ff4a00]/30 w-full max-w-3xl flex flex-col relative shadow-[0_0_100px_rgba(255,74,0,0.15)] select-text font-mono"
            >
              {/* Header security tag */}
              <div className="flex items-center justify-between p-5 border-b border-[#ff4a00]/25 bg-black/80 select-none">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-[#ff4a00] animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[4px] text-[#ff4a00] font-bold">
                    CRYPT-0 ENCRYPTED TRANSMISSION GATEWAY
                  </span>
                </div>
                <button
                  onClick={handleCloseGateway}
                  disabled={isTransmitting}
                  className="text-white/40 hover:text-[#ff4a00] transition-colors text-[9px] uppercase tracking-[3px] border border-white/10 px-2 py-1 bg-[#020202] hover:border-[#ff4a00]/30 cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                >
                  ABORT
                </button>
              </div>

              {/* Main Content Area */}
              <div className="p-6 md:p-8 flex-grow">
                {!isTransmitting && !isDoneTransmitting ? (
                  <form onSubmit={startSecureTransmission} className="space-y-6">
                    {/* Item identification banner */}
                    <div className="p-4 border border-white/5 bg-[#020202] flex items-center justify-between select-none">
                      <div>
                        <div className="text-[7.5px] uppercase tracking-[3px] text-white/30 mb-1">Target Asset</div>
                        <div className="text-sm text-[#c6b89e] uppercase font-serif tracking-widest">{selectedAsset.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[7.5px] uppercase tracking-[3px] text-white/30 mb-1">Valuation</div>
                        <div className="text-xs text-white tracking-widest">{selectedAsset.price}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Operator Code field */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[8px] uppercase tracking-[3px] text-white/40 select-none flex items-center gap-1.5 font-bold">
                          <Key className="w-3.5 h-3.5 text-[#ff4a00]" />
                          Operator Code Name <span className="text-[#ff4a00]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={operatorCode}
                          onChange={(e) => setOperatorCode(e.target.value)}
                          placeholder="e.g. AGENT-X / GUEST-48"
                          className="w-full bg-black border border-[#ff4a00]/20 p-3 text-[11px] font-mono text-white placeholder:text-white/20 hover:border-[#ff4a00]/45 focus:border-[#ff4a00] focus:outline-none transition-all outline-none"
                        />
                      </div>

                      {/* Transmission route dropdown */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[8px] uppercase tracking-[3px] text-white/40 select-none flex items-center gap-1.5 font-bold">
                          <Cpu className="w-3.5 h-3.5 text-[#ff4a00]" />
                          Uplink Relay Station
                        </label>
                        <select
                          value={selectedRelay}
                          onChange={(e) => setSelectedRelay(e.target.value)}
                          className="w-full bg-black border border-white/10 p-3 text-[10px] font-mono text-white appearance-none cursor-pointer hover:border-[#ff4a00]/30 focus:border-[#ff4a00] transition-all outline-none"
                        >
                          <option value="AEGEAN DIRECT RELAY S7">AEGEAN DIRECT RELAY S7</option>
                          <option value="LISBON COLD VAULT VA-02">LISBON COLD VAULT VA-02</option>
                          <option value="GENEVA SERVER CONTAINER 19">GENEVA SERVER CONTAINER 19</option>
                          <option value="SWISS DEEP SILO SL-4">SWISS DEEP SILO SL-4</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Cipher selection */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[8px] uppercase tracking-[3px] text-white/40 select-none flex items-center gap-1.5 font-bold">
                          <Lock className="w-3.5 h-3.5 text-[#ff4a00]" />
                          Cipher Algorithm
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {["AES-256-GCM", "RSA-4096-OAEP", "CHACHA20-POLY"].map((ciph) => (
                            <button
                              key={ciph}
                              type="button"
                              onClick={() => setSelectedCipher(ciph)}
                              className={`flex-1 py-2 text-[8px] tracking-[1px] uppercase border font-mono transition-all duration-300 ${
                                selectedCipher === ciph
                                  ? "bg-[#ff4a00]/10 border-[#ff4a00] text-[#ff4a00]"
                                  : "bg-black border-white/10 hover:border-white/20 text-white/50"
                              }`}
                            >
                              {ciph}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Decrypt check notification */}
                      <div className="p-4 border border-white/5 bg-[#020202] text-white/40 text-[9px] leading-relaxed flex items-start gap-3 select-none">
                        <AlertCircle className="w-4 h-4 text-[#ff4a00] flex-shrink-0" />
                        <span>Transmitting over military grade ciphers. Dispatch coordinates will instantly register onto Scribe Directives records.</span>
                      </div>
                    </div>

                    {/* Secure notes text area */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[8px] uppercase tracking-[3px] text-white/40 select-none font-bold">
                        Encrypted Instruction Set Notes
                      </label>
                      <textarea
                        rows={3}
                        value={secureMessage}
                        onChange={(e) => setSecureMessage(e.target.value)}
                        placeholder="Add specific directives, delivery terms, transport windows or offshore currency allocation options..."
                        className="w-full bg-black border border-white/10 p-3 text-[10px] font-mono text-white placeholder:text-white/20 hover:border-[#ff4a00]/30 focus:border-[#ff4a00] transition-all resize-none outline-none"
                      />
                    </div>

                    {/* Submit CTA button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#ff4a00] text-black font-sans font-bold text-[11px] tracking-[4px] uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(255,74,0,0.3)] transition-all cursor-pointer text-center"
                    >
                      ENGAGE SECURE TRANSMISSION
                    </button>
                  </form>
                ) : isTransmitting ? (
                  /* Live terminal logs transmission sequencer screen */
                  <div className="flex flex-col justify-center min-h-[250px] p-6 border border-[#ff4a00]/20 bg-[#020202]">
                    <div className="flex items-center gap-3.5 mb-6 text-[#ff4a00] animate-pulse">
                      <Radio className="w-5 h-5 animate-spin" />
                      <span className="text-[9px] uppercase tracking-[4px] font-bold">TRANSMITTING SECURE PAYLOAD CONTAINER_F7...</span>
                    </div>

                    {/* Simulated stream logs lines */}
                    <div className="space-y-2 font-mono text-[9.5px] text-white/70 leading-relaxed text-left">
                      {transmissionLog.map((line, logIdx) => (
                        <div key={logIdx} className="flex gap-2.5 items-start">
                          <span className="text-[#ff4a00]/60">►</span>
                          <span>{line}</span>
                        </div>
                      ))}
                      <div className="w-1.5 h-3.5 bg-[#ff4a00] inline-block animate-pulse ml-6 mt-1" />
                    </div>
                  </div>
                ) : (
                  /* Success Screen! */
                  <div className="flex flex-col items-center justify-center min-h-[250px] p-6 border border-[#ff4a00]/30 bg-black text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial-gradient from-[#ff4a00]/10 to-transparent pointer-events-none opacity-50" />
                    
                    <div className="w-12 h-12 border border-[#ff4a00] rounded-full flex items-center justify-center text-[#ff4a00] mb-6 relative">
                      <motion.div
                        className="absolute inset-0 rounded-full border border-[#ff4a00]"
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <Check className="w-5 h-5" />
                    </div>

                    <h4 className="text-sm text-white font-bold tracking-[4px] uppercase mb-1">
                      TRANSMISSION SUCCESSFUL
                    </h4>
                    <p className="font-mono text-[9px] tracking-[2px] text-[#ff4a00] uppercase mb-6">
                      OPERATOR TELEMETRY HANDED OFF SECURELY
                    </p>

                    <p className="text-[11.5px] text-white/60 font-sans font-light leading-relaxed max-w-md mb-8">
                      Your confidential inquiry files have been encrypted using <strong className="text-[#c6b89e]">{selectedCipher}</strong> and routed through <strong className="text-white">{selectedRelay}</strong>. The transaction ticket is locked in Scribe Directive logs.
                    </p>

                    {/* Receipt code component box */}
                    <div className="p-4 bg-[#0a0a0a] border border-white/5 font-mono text-center mb-10 w-full max-w-md select-all">
                      <div className="text-[7px] text-white/30 uppercase tracking-[3px] mb-2">OPERATIONAL ACCESS TOKEN</div>
                      <div className="text-sm font-bold text-[#c6b89e] tracking-widest">{generatedReceipt}</div>
                    </div>

                    <button
                      onClick={handleCloseGateway}
                      className="px-8 py-3.5 border border-[#ff4a00]/40 text-[#ff4a00] hover:bg-[#ff4a00] hover:text-black font-sans font-bold text-[10px] tracking-[4px] uppercase transition-all duration-300 cursor-pointer"
                    >
                      SECURE TERMINAL GATEWAY
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export { ASSETS_LIST };
