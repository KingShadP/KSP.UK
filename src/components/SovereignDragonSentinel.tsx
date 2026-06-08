/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RefreshCw, Layers, Shield, Eye, HelpCircle, Activity, Info, EyeOff } from "lucide-react";

interface DroneFeed {
  id: string;
  name: string;
  path: string;
  epoch: string;
  renderModel: string;
  description: string;
}

const DRONE_FEEDS: DroneFeed[] = [
  {
    id: "feed-01",
    name: "Sovereign Crowned Sentinel (Rose Gold Loop)",
    path: "/grok-video-8499d2b9-086f-45f4-901e-e75c87098469.mp4",
    epoch: "ERA_03 // THE FOUNDATION",
    renderModel: "Google Veo Spatial 4D Reconstruction",
    description: "The primary guardian gatekeeper of the cybernetic temple. Sculpted in pure rose-gold filigree pattern, lifting wings to summon security waves."
  },
  {
    id: "feed-02",
    name: "Gilded Sentinel (Ornaments Loop)",
    path: "/grok-video-9b5f3cfc-647d-442c-9e8a-d68d20062bd9.mp4",
    epoch: "ERA_04 // THE EMPIRE",
    renderModel: "Google Veo High-Fidelity Synthesis",
    description: "Sovereign dragon turning 360-degrees with high metallic shine & royal crowned aesthetics. Sinks ambient gold dust over the private estate."
  }
];

export default function SovereignDragonSentinel() {
  const [currentFeedIndex, setCurrentFeedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isProjected, setIsProjected] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kingshadp-projected-bgvideo") !== null;
    } catch {
      return false;
    }
  });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(false);
  const [latestLog, setLatestLog] = useState("SENTINEL FEED COMPILED: Signal lock established.");

  const videoRef = useRef<HTMLVideoElement>(null);
  const activeFeed = DRONE_FEEDS[currentFeedIndex];

  // Sync playback speed with input speeds
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, currentFeedIndex]);

  // Keep background projection synced with localStorage & trigger events
  const handleToggleProjection = () => {
    const nextProj = !isProjected;
    setIsProjected(nextProj);
    try {
      if (nextProj) {
        localStorage.setItem("kingshadp-projected-bgvideo", activeFeed.path);
        window.dispatchEvent(
          new CustomEvent("toggle-bg-video-projection", { detail: { url: activeFeed.path } })
        );
        triggerLog(`PROJECTION MOUNTED: Projecting '${activeFeed.name}' across the full spatial background.`);
      } else {
        localStorage.removeItem("kingshadp-projected-bgvideo");
        window.dispatchEvent(
          new CustomEvent("toggle-bg-video-projection", { detail: { url: null } })
        );
        triggerLog("PROJECTION DISENGAGED: Reverted to default WebGL spatial depth corridor.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch feed and update active background if projection is enabled
  const handleSelectFeed = (index: number) => {
    setCurrentFeedIndex(index);
    triggerLog(`SIGNAL ROUTE SWITCH: Swapping feed to '${DRONE_FEEDS[index].name}'`);
    if (isProjected) {
      try {
        localStorage.setItem("kingshadp-projected-bgvideo", DRONE_FEEDS[index].path);
        // Let background component update quickly
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("toggle-bg-video-projection", { detail: { url: DRONE_FEEDS[index].path } })
          );
        }, 50);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const triggerLog = (msg: string) => {
    setLatestLog(msg);
    window.dispatchEvent(
      new CustomEvent("telemetry-log", {
        detail: { message: msg, type: "SYSTEM" }
      })
    );
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
      triggerLog("MONITORING PAUSED: Manual freeze frame recorded.");
    } else {
      v.play().catch(e => console.error(e));
      setIsPlaying(true);
      triggerLog("MONITORING ACTIVE: Core loop resuming.");
    }
  };

  return (
    <div className="w-full bg-black/95 border border-[#c6b89e]/30 p-6 md:p-8 relative select-none">
      {/* Absolute ambient glow header */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c6b89e]/40 to-transparent" />
      
      {/* Visual background heartbeat sync visual cue */}
      <div className="absolute top-2.5 right-4 flex items-center gap-2 font-mono text-[7px] text-[#c6b89e]/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#93000a] animate-pulse" />
        <span>SYS_HEART_RATE_SYNC // ACTIVE</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch">
        
        {/* --- LEFT HAND: CINEMATIC SCREEN WITH OVERLAYS --- */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[8.5px] font-mono tracking-[4px] text-[#ff4a00] uppercase mb-1">
              GUARD SECURITY ARCHIVE // TARGET 01
            </div>
            <h3 className="font-serif text-2xl md:text-3.5xl text-white font-normal uppercase tracking-wide leading-tight mb-4">
              SOVEREIGN SENTINEL CODES
            </h3>
            <p className="font-sans text-[13px] text-white/50 leading-relaxed font-light mb-6">
              Neural holographic render of our crowned dragon sentinel protecting the private digital kingdom. Generated via deep-diffusion models, this sequence functions as our digital shield.
            </p>
          </div>

          {/* Majestic Video Viewport Container */}
          <div className="relative aspect-video w-full bg-black border border-white/10 group overflow-hidden">
            
            {/* Custom Overlay corner ticks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c6b89e]/40 z-10" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#c6b89e]/40 z-10" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#c6b89e]/40 z-10" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c6b89e]/40 z-10" />
            
            {/* Scanlines layer */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.03),_rgba(0,255,0,0.01),_rgba(0,0,255,0.03))] bg-[size:100%_4px,_6px_100%] pointer-events-none z-10 opacity-65" />

            {/* Video Feed */}
            <motion.div 
              style={{ scale: zoomLevel }}
              className="w-full h-full flex items-center justify-center transition-transform duration-500"
            >
              <video
                ref={videoRef}
                src={activeFeed.path}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>

            {/* Live scanning overlay line */}
            <div className="absolute left-0 top-0 w-full h-[1px] bg-[#c6b89e]/45 shadow-[0_0_8px_#c6b89e] animate-bounce pointer-events-none z-10" style={{ animationDuration: "12s" }} />

            {/* In-viewport diagnostic HUD overlay */}
            <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start pointer-events-none z-10 font-mono text-[8px] text-[#c6b89e]/80">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-white">
                  <span className="w-1 to-1.5 h-1 to-1.5 rounded-full bg-[#ff4a00] animate-ping" />
                  <span>FEED_ID: {activeFeed.id.toUpperCase()}</span>
                </div>
                <div>{activeFeed.epoch}</div>
              </div>
              <div className="text-right space-y-0.5">
                <div>FPS: {(24 * playbackSpeed).toFixed(2)} / SEC</div>
                <div>RES: 1024x1024 (1:1 RAW)</div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end pointer-events-none z-10 font-mono text-[7.5px] text-[#c6b89e]/60">
              <div>RENDER_MODEL: {activeFeed.renderModel}</div>
              <div className="text-white bg-[#93000a] px-1.5 py-0.5 border border-[#93000a]/20">
                {playbackSpeed === 1.0 ? "REAL_TIME" : `${playbackSpeed}x SPEED`}
              </div>
            </div>
          </div>

          {/* Quick playback control buttons underneath preview window */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 bg-black/60 p-3 border border-white/5">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 border border-white/10 hover:border-[#c6b89e] text-white hover:text-[#c6b89e] transition-colors cursor-pointer focus:outline-none"
                title={isPlaying ? "Pause Video Playback" : "Resume Video Playback"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <div className="h-5 w-[1px] bg-white/10" />

              {/* VR cinematic speeds */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[8px] text-white/30 mr-1">PLAY_SPEED:</span>
                {[0.25, 0.5, 0.75, 1.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      triggerLog(`PLAYBACK RATE ADJUSTED: Sinking motion frames to ${spd}x for spatial immersion.`);
                    }}
                    className={`px-2 py-0.5 font-mono text-[8px] transition-all cursor-pointer focus:outline-none border ${
                      playbackSpeed === spd
                        ? "border-[#c6b89e] text-[#c6b89e] bg-[#c6b89e]/5"
                        : "border-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    {spd === 0.25 ? "Slow VR (0.25x)" : `${spd}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale aspect slider multiplier */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] text-white/30">ZOOM:</span>
              <button 
                onClick={() => setZoomLevel(prev => prev === 1.0 ? 1.25 : prev === 1.25 ? 1.5 : 1.0)} 
                className="px-2 py-1 border border-white/10 text-white font-mono text-[8.5px] hover:border-[#c6b89e] cursor-pointer"
              >
                {zoomLevel === 1.0 ? "[ Fit ]" : `[ zoom ${zoomLevel}x ]`}
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT HAND: COMPILATION CONTROL PANEL & PROJECTION SWITCHER --- */}
        <div className="w-full xl:w-[360px] flex flex-col justify-between bg-black/40 border border-white/5 p-6 relative">
          <div className="absolute top-2 right-3 font-mono text-[6.5px] text-white/20">CTRL_BLOCK_04G</div>
          
          <div className="space-y-6">
            <div>
              <span className="text-[8px] font-mono text-white/40 tracking-[2px] block uppercase">CONTROL DECK MATRIX</span>
              <h4 className="font-serif text-lg text-[#c6b89e] uppercase mt-1">SENTINEL CHANNELS</h4>
            </div>

            {/* Loop Select Accordion Item Cards */}
            <div className="space-y-3">
              {DRONE_FEEDS.map((feed, idx) => {
                const isActive = idx === currentFeedIndex;
                return (
                  <div
                    key={feed.id}
                    onClick={() => handleSelectFeed(idx)}
                    className={`p-3.5 border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-[#c6b89e] bg-[#c6b89e]/5"
                        : "border-white/5 bg-black/30 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-serif text-xs font-medium text-white flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#ff4a00]" : "bg-white/20"}`} />
                        {feed.id.toUpperCase()} // LOOP
                      </div>
                      <span className="font-mono text-[7px] text-[#c6b89e]">{feed.epoch}</span>
                    </div>
                    <div className="text-[10.5px] font-mono text-white/50 tracking-[0.5px] line-clamp-1">{feed.name}</div>
                  </div>
                );
              })}
            </div>

            {/* Description details of selected sentinel */}
            <div className="p-3 border border-[#c6b89e]/10 bg-black/60 font-sans text-[11px] text-white/40 leading-relaxed font-light">
              <div className="font-mono text-[8px] tracking-[2px] text-[#c6b89e] uppercase mb-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> GUARDIAN ARCHETYPE MYTH
              </div>
              {activeFeed.description}
            </div>

            {/* --- CORE IMMERSIVE PROJECTION INJECTOR BUTTON --- */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={handleToggleProjection}
                className={`w-full py-4 px-4 border font-mono text-[9px] tracking-[2px] uppercase transition-all duration-500 cursor-pointer text-center flex items-center justify-center gap-2 font-bold ${
                  isProjected
                    ? "bg-[#93000a]/20 text-[#ff4a00] border-[#93000a] hover:bg-transparent hover:text-white"
                    : "bg-white text-black border-white hover:bg-[#c6b89e] hover:border-[#c6b89e] hover:shadow-[0_0_20px_rgba(198,184,158,0.35)]"
                }`}
                title="Inject the current high-end golden dragon loop as the global webpage backdrop"
              >
                {isProjected ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isProjected ? "[ DISENGAGE BACKSTAGE PROJECTION ]" : "[ PROJECT SENIOR BACKSTAGE PORTAL ]"}
              </button>
              
              <p className="text-[9.5px] font-sans text-center text-white/40 leading-relaxed font-light">
                {isProjected 
                  ? "✓ Projection active: The legendary crowned dragon is now sweeping the ambient stage corridors of your private district."
                  : "Click above to wrap your entire background within this spectacular 3D-staged dragon portal."
                }
              </p>
            </div>
          </div>

          {/* Embedded live scanning logs output */}
          <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[8px] text-white/40 space-y-1">
            <div className="text-[#93000a]">TELEMETRY CONSOLE FEED // ACTIVE:</div>
            <div className="bg-black p-2 max-h-[44px] overflow-hidden leading-normal text-[#c6b89e]/80 tracking-wide uppercase">
              {latestLog}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
