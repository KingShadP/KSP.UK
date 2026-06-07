/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Compass, Radio, Wifi, Lock, Send, Check } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface RadarTarget {
  id: string;
  name: string;
  cx: number;
  cy: number;
  r: number;
  telemetry: {
    latLong: string;
    azimuth: number;
    elevation: number;
    signal: string;
    encryption: string;
    status: string;
  };
}

const RADAR_TARGETS: RadarTarget[] = [
  {
    id: "aegean",
    name: "AEGEAN INTEL COMPOUND",
    cx: 55,
    cy: 85,
    r: 5,
    telemetry: {
      latLong: "37.6204° N, 24.1283° E",
      azimuth: 148.42,
      elevation: 32.19,
      signal: "SECURE LINK 100%",
      encryption: "AES-256-GCM",
      status: "STABLE",
    }
  },
  {
    id: "lisbon",
    name: "LISBON ULTRA-VAULT",
    cx: 140,
    cy: 130,
    r: 5,
    telemetry: {
      latLong: "38.7223° N, 9.1393° W",
      azimuth: 295.12,
      elevation: 18.45,
      signal: "DECRYPT ACTIVE 85%",
      encryption: "RSA-4096-OAEP",
      status: "INTERCEPTING",
    }
  },
  {
    id: "swiss",
    name: "SWISS MOUNTAIN ISOLATOR",
    cx: 110,
    cy: 45,
    r: 5,
    telemetry: {
      latLong: "46.8182° N, 8.2275° E",
      azimuth: 42.88,
      elevation: 54.12,
      signal: "ROUTED PROXY 95%",
      encryption: "CHACHA20-POLY",
      status: "SHIELDED",
    }
  }
];

export default function SatelliteRadar() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [azimuthJitter, setAzimuthJitter] = useState(0);
  const [elevationJitter, setElevationJitter] = useState(0);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [pumpStatus, setPumpStatus] = useState(false);

  const activeTarget = RADAR_TARGETS[selectedIdx] || RADAR_TARGETS[0];

  useEffect(() => {
    // Generate jittery mock coordinates offset
    const coordInterval = setInterval(() => {
      setAzimuthJitter((Math.random() - 0.5) * 0.15);
      setElevationJitter((Math.random() - 0.5) * 0.08);
    }, 850);

    // Continuous sweep angle rotation
    let animationFrameId: number;
    const rotateSweep = () => {
      setSweepAngle((prev) => (prev + 0.8) % 360);
      animationFrameId = requestAnimationFrame(rotateSweep);
    };
    rotateSweep();

    return () => {
      clearInterval(coordInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSelectTarget = (index: number) => {
    setSelectedIdx(index);
    setPumpStatus(false);
    setCopiedStatus(false);
  };

  const handlePumpToScribe = () => {
    setPumpStatus(true);
    
    // Create new directive note payload
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
      id: "radar-" + Date.now().toString(),
      timestamp: nowStr,
      title: `GPS LINK: ${activeTarget.name}`,
      text: `Tactical Satellite intercept logged.\nLocation: ${activeTarget.telemetry.latLong}\nAzimuth: ${(activeTarget.telemetry.azimuth + azimuthJitter).toFixed(2)}° N\nElevation: ${(activeTarget.telemetry.elevation + elevationJitter).toFixed(2)}°\nCrypto cipher: ${activeTarget.telemetry.encryption}\nSignal level: ${activeTarget.telemetry.signal}\nStatus: ${activeTarget.telemetry.status}`
    };

    // Load, append and save to localStorage
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

    // Dispatch custom window event so ScribeNotes component can re-sync instantly if rendered
    window.dispatchEvent(new Event("sanctum_notes_updated"));

    setTimeout(() => {
      setPumpStatus(false);
    }, 2500);
  };

  const handleCopyCoords = () => {
    const coordsStr = `TARGET: ${activeTarget.name} | LATLONG: ${activeTarget.telemetry.latLong} | AZIMUTH: ${(activeTarget.telemetry.azimuth + azimuthJitter).toFixed(2)}° N / ELEVATION: ${(activeTarget.telemetry.elevation + elevationJitter).toFixed(2)}°`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative bg-black/40 overflow-hidden group select-none">
      {/* HUD Header */}
      <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="text-[#ff4a00]"
          >
            <Compass className="w-4 h-4" />
          </motion.div>
          <span className="font-mono text-[9px] uppercase tracking-[4px] text-[#c6b89e] pt-0.5">
            <ScrambleText text="SATELLITE INTERCEPT" duration={900} />
          </span>
        </div>
        <div className="flex items-center gap-2 border border-[#c6b89e]/15 px-2 py-0.5 bg-black/60 font-mono text-[7.5px] text-[#c6b89e]/70 tracking-[2px]">
          <Wifi className="w-2.5 h-2.5 animate-pulse text-[#ff4a00]" />
          UPLINK_LIVE_NODE
        </div>
      </div>

      {/* Main interaction deck columns */}
      <div className="flex-grow flex flex-col xl:flex-row items-center justify-between gap-4 py-4 relative">
        
        {/* Radar Map Column */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-[175px] h-[175px] mix-blend-screen overflow-visible">
            {/* Outer circles */}
            <circle cx="100" cy="100" r="95" className="fill-none stroke-[#c6b89e]/10 stroke-[0.5px]" />
            <circle cx="100" cy="100" r="70" className="fill-none stroke-[#c6b89e]/10 stroke-[0.5px]" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="45" className="fill-none stroke-[#c6b89e]/10 stroke-[0.5px]" />
            <circle cx="100" cy="100" r="20" className="fill-none stroke-[#ff4a00]/15 stroke-[0.5px]" strokeDasharray="1 1" />

            {/* Crosshair alignment lines */}
            <line x1="5" y1="100" x2="195" y2="100" className="stroke-[#c6b89e]/15 stroke-[0.5px]" />
            <line x1="100" y1="5" x2="100" y2="195" className="stroke-[#c6b89e]/15 stroke-[0.5px]" />

            {/* Rotating sweeping dial laser */}
            <g transform={`rotate(${sweepAngle}, 100, 100)`}>
              <line x1="100" y1="100" x2="100" y2="5" className="stroke-[#ff4a00]/70 stroke-[1.5px]" strokeLinecap="round" />
              <polygon
                points="100,100 100,5 118,10"
                className="fill-gradient opacity-15"
                fill="url(#radarSweepGrad)"
              />
            </g>

            {/* Interactive Target nodes */}
            {RADAR_TARGETS.map((target, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <g
                  key={target.id}
                  onClick={() => handleSelectTarget(idx)}
                  className="cursor-pointer group/node"
                >
                  {/* Click/Touch buffer outer node target */}
                  <circle
                    cx={target.cx}
                    cy={target.cy}
                    r={20}
                    className="fill-transparent stroke-none pointer-events-auto"
                  />

                  {/* Pulsing selection ring */}
                  {isSelected && (
                    <motion.circle
                      cx={target.cx}
                      cy={target.cy}
                      r={10}
                      className="fill-none stroke-[#ff4a00]/40 stroke-[1px]"
                      animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  {/* Center item dot */}
                  <circle
                    cx={target.cx}
                    cy={target.cy}
                    r={target.id === "aegean" ? 3.5 : 2.5}
                    className={`transition-colors duration-300 ${isSelected ? "fill-[#ff4a00]" : "fill-[#c6b89e]/60 group-hover/node:fill-[#c6b89e]"}`}
                  />

                  {/* Target Cross grid overlays */}
                  <line
                    x1={target.cx}
                    y1={target.cy - 8}
                    x2={target.cx}
                    y2={target.cy + 8}
                    className={`stroke-[0.5px] transition-colors duration-300 ${isSelected ? "stroke-[#ff4a00]/50" : "stroke-[#c6b89e]/20 group-hover/node:stroke-[#c6b89e]/40"}`}
                  />
                  <line
                    x1={target.cx - 8}
                    y1={target.cy}
                    x2={target.cx + 8}
                    y2={target.cy}
                    className={`stroke-[0.5px] transition-colors duration-300 ${isSelected ? "stroke-[#ff4a00]/50" : "stroke-[#c6b89e]/20 group-hover/node:stroke-[#c6b89e]/40"}`}
                  />
                </g>
              );
            })}

            <defs>
              <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4a00" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff4a00" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Telemetry Display Column */}
        <div className="flex-grow flex flex-col justify-center gap-2.5 text-left font-mono pl-4 border-l border-white/5 w-full xl:w-auto">
          <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase tracking-[2px]">"DECRYPT_TARGET"</span>
            <span className="text-[11px] text-[#c6b89e] leading-snug tracking-wider truncate uppercase">
              {activeTarget.name}
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[7px] text-white/30 uppercase tracking-[2px]">"AZIMUTH"</span>
              <span className="text-[11px] text-[#c6b89e] leading-none">
                {(activeTarget.telemetry.azimuth + azimuthJitter).toFixed(2)}° N
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] text-white/30 uppercase tracking-[2px]">"ELEVATION"</span>
              <span className="text-[11px] text-[#ff4a00] leading-none">
                {(activeTarget.telemetry.elevation + elevationJitter).toFixed(2)}°
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase tracking-[2px]">"GRID_SECTOR"</span>
            <span className="text-[10px] text-white/70 leading-none tracking-wider">
              {activeTarget.telemetry.latLong}
            </span>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col">
              <span className="text-[7px] text-white/30 uppercase tracking-[2px]">"CIPHER"</span>
              <span className="text-[9px] text-white/50 leading-none">{activeTarget.telemetry.encryption}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] text-white/30 uppercase tracking-[2px]">"UPLINK"</span>
              <span className="text-[9px] text-[#ff4a00] leading-none font-bold">{activeTarget.telemetry.status}</span>
            </div>
          </div>

          {/* Quick HUD Interactions Panel */}
          <div className="flex gap-2 mt-2 w-full">
            <button
              onClick={handleCopyCoords}
              className="flex-1 py-1.5 min-h-[32px] border border-[#c6b89e]/30 text-[#c6b89e] hover:bg-[#c6b89e] hover:text-black font-mono text-[8px] uppercase tracking-[1px] transition-all cursor-pointer flex items-center justify-center gap-1 focus:outline-none"
            >
              {copiedStatus ? (
                <>
                  <Check className="w-3 h-3" />
                  COPIED
                </>
              ) : (
                <>
                  <Lock className="w-2.5 h-2.5" />
                  LOCK GPS
                </>
              )}
            </button>

            <button
              onClick={handlePumpToScribe}
              className="flex-1 py-1.5 min-h-[32px] border border-[#ff4a00]/30 text-[#ff4a00] hover:bg-[#ff4a00] hover:text-black font-mono text-[8px] uppercase tracking-[1px] transition-all cursor-pointer flex items-center justify-center gap-1 focus:outline-none"
            >
              {pumpStatus ? (
                <>
                  <Check className="w-3 h-3 animate-ping" />
                  PUMPING...
                </>
              ) : (
                <>
                  <Send className="w-2.5 h-2.5" />
                  PUMP DATA
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Footer tracker specs */}
      <div className="flex justify-between items-center border-t border-[#c6b89e]/10 pt-4 font-mono text-[8px] text-white/40 tracking-[2px] relative z-10 w-full mt-1.5">
        <span>LOCATE COORDINATES [{activeTarget.id}]</span>
        <span className="text-[#c6b89e]">{sweepAngle.toFixed(0)}° RETICLE</span>
      </div>
    </div>
  );
}
