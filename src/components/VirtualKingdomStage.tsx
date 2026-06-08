/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useVelocity } from "motion/react";
import { Landmark, Tv, Compass, Activity } from "lucide-react";
import SovereignWebGLStage from "./SovereignWebGLStage";

interface ChamberData {
  idx: number;
  id: string;
  name: string;
  sub: string;
  imgUrl: string;
  imgRegen: string;
  brightness: number;
  blur: string;
  accentColor: string;
  lightSweepColor: string;
}

const CHAMBERS: ChamberData[] = [
  {
    idx: 0,
    id: "atrium",
    name: "THE ATRIUM KEYWAY",
    sub: "GATEWAY TO THE EMPIRE // ALPHA CORE",
    imgUrl: "/ChatGPT Image May 7, 2026, 09_55_04 PM.png",
    imgRegen: "/regenerated_image_1780886685578.png",
    brightness: 0.5,
    blur: "2px",
    accentColor: "rgba(198, 184, 158, 0.45)",
    lightSweepColor: "linear-gradient(135deg, rgba(198, 184, 158, 0.08) 0%, transparent 60%)"
  },
  {
    idx: 1,
    id: "sanctum",
    name: "THE SONIC SANCTUM",
    sub: "CHAMBER FOR INTENSIVE PLAYBACK",
    imgUrl: "/ChatGPT Image May 12, 2026, 05_20_18 PM.png",
    imgRegen: "/regenerated_image_1780886688598.png",
    brightness: 0.45,
    blur: "1.5px",
    accentColor: "rgba(147, 0, 10, 0.5)",
    lightSweepColor: "linear-gradient(45deg, rgba(147, 0, 10, 0.08) 0%, transparent 50%)"
  },
  {
    idx: 2,
    id: "exhibition",
    name: "THE EXHIBITION VAULT",
    sub: "PHYSICAL COZY BOUTIQUE ARCHIVE",
    imgUrl: "/ChatGPT Image May 16, 2026, 04_28_18 AM (5).png",
    imgRegen: "/regenerated_image_1780886692001.png",
    brightness: 0.5,
    blur: "2px",
    accentColor: "rgba(198, 184, 158, 0.45)",
    lightSweepColor: "linear-gradient(90deg, rgba(198, 184, 158, 0.07) 30%, transparent 70%)"
  },
  {
    idx: 3,
    id: "temple",
    name: "TEMPLE OF BELIEVERS",
    sub: "SOVEREIGN SACRED COMMUNITY CORE",
    imgUrl: "/ChatGPT Image May 16, 2026, 04_16_44 AM (5).png",
    imgRegen: "/regenerated_image_1780886695981.png",
    brightness: 0.42,
    blur: "2.5px",
    accentColor: "rgba(147, 0, 10, 0.45)",
    lightSweepColor: "linear-gradient(225deg, rgba(147, 0, 10, 0.08) 10%, transparent 80%)"
  }
];

function StagedImage({ primary, fallback, className, style }: { primary: string, fallback: string, className?: string, style?: any }) {
  const [src, setSrc] = useState(primary);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={src}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) {
          setSrc(fallback);
          setHasError(true);
        }
      }}
    />
  );
}

function ChamberEnvironmentPlate({
  chamber,
  smoothProgress,
  springX,
  springY,
  isLowPerformance,
  paradoxMode
}: {
  chamber: ChamberData,
  smoothProgress: any,
  springX: any,
  springY: any,
  isLowPerformance: boolean,
  paradoxMode: boolean
}) {
  // Parallax background scale & offset
  const bgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.18]);
  const bgX = useTransform(springX, [-0.5, 0.5], ["-25px", "25px"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["-20px", "20px"]);

  // Foreground Entry Portal frame (zooms pass fast)
  const portalScale = useTransform(smoothProgress, [0, 1], [1.0, 1.70]);
  const portalOpacity = useTransform(smoothProgress, [0, 0.65, 0.85], [1.0, 0.25, 0.05]);
  const portalX = useTransform(springX, [-0.5, 0.5], ["-40px", "40px"]);
  const portalY = useTransform(springY, [-0.5, 0.5], ["-35px", "35px"]);

  // Dynamically moving light sweeps
  const sweepX = useTransform(smoothProgress, [0, 1], ["-85%", "185%"]);
  const sweepY = useTransform(springY, [-0.5, 0.5], ["-15%", "15%"]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
      {/* 1. REAR WALL ENVIRONMENT IMAGE PLATE */}
      <motion.div
        style={{
          scale: bgScale,
          x: bgX,
          y: bgY,
          filter: `brightness(${chamber.brightness}) blur(${isLowPerformance ? "0px" : chamber.blur}) contrast(1.08)`,
          transformStyle: "preserve-3d"
        }}
        className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)]"
      >
        <StagedImage
          primary={chamber.imgRegen}
          fallback={chamber.imgUrl}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </motion.div>

      {/* 2. PROCEDURAL GOLD LIGHT SWEEP */}
      <motion.div
        style={{
          x: sweepX,
          y: sweepY,
          background: chamber.lightSweepColor,
        }}
        className="absolute inset-0 w-[180%] h-full pointer-events-none mix-blend-screen opacity-25 z-10"
      />

      {/* 3. ATMOSPHERIC VOLUMETRIC DRIFT FOG */}
      <div className="absolute inset-0 z-20 select-none pointer-events-none overflow-hidden mix-blend-screen opacity-15">
        <motion.div
          animate={{
            x: ["-5%", "5%"],
            y: ["-4%", "4%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute inset-[-60px] filter blur-2xl w-[calc(100%+120px)] h-[calc(100%+120px)]"
          style={{
            backgroundImage: `radial-gradient(circle at 40% 50%, ${chamber.accentColor} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* 4. HIGH-VALUE FOREGROUND GEOMETRIC MARBLE PORTAL CUTOUT */}
      <motion.div
        style={{
          scale: portalScale,
          opacity: portalOpacity,
          x: portalX,
          y: portalY,
          transformStyle: "preserve-3d"
        }}
        className="absolute inset-x-8 inset-y-12 pointer-events-none z-30 border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.85)] flex items-center justify-center rounded-sm"
      >
        {/* Symmetric left/right gold architectural pillars */}
        <div className="absolute top-0 bottom-0 left-0 w-1 sm:w-2 bg-gradient-to-b from-[#c6b89e]/10 via-[#c6b89e]/45 to-[#c6b89e]/10 border-r border-[#c6b89e]/20 opacity-80" />
        <div className="absolute top-0 bottom-0 right-0 w-1 sm:w-2 bg-gradient-to-b from-[#c6b89e]/10 via-[#c6b89e]/45 to-[#c6b89e]/10 border-l border-[#c6b89e]/20 opacity-80" />
        
        {/* Fine HUD-style margins and ticks */}
        <div className="absolute top-4 left-6 font-mono text-[7px] text-[#c6b89e]/40 tracking-[4px] uppercase">
          COUNCIL_PORTAL // {chamber.name}
        </div>
        <div className="absolute bottom-4 right-6 font-mono text-[7px] text-[#c6b89e]/30 tracking-[3px] uppercase">
          {chamber.sub}
        </div>

        {/* Framing inner ambient depth vignette */}
        <div 
          className="absolute inset-0 bg-transparent" 
          style={{
            boxShadow: `inset 0 0 100px rgba(0,0,0,0.92)`,
          }}
        />
      </motion.div>
    </div>
  );
}

interface VirtualKingdomStageProps {
  activeTab?: string;
  paradoxMode?: boolean;
}

export default function VirtualKingdomStage({ activeTab, paradoxMode = false }: VirtualKingdomStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vrActive, setVrActive] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [bgProjectedVideo, setBgProjectedVideo] = useState<string | null>(() => {
    try {
      return localStorage.getItem("kingshadp-projected-bgvideo") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleProj = (e: Event) => {
      const customEvent = e as CustomEvent<{ url: string | null }>;
      if (customEvent.detail) {
        setBgProjectedVideo(customEvent.detail.url);
      }
    };
    window.addEventListener("toggle-bg-video-projection", handleProj);
    return () => window.removeEventListener("toggle-bg-video-projection", handleProj);
  }, []);

  // Performance-driven active downsampling manager for low-end specs and throttling rescue
  useEffect(() => {
    const checkInitialHardware = () => {
      const ua = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const cores = navigator.hardwareConcurrency || 4;
      
      if (isMobileDevice) {
        return true; // Proactively rescue mobile frameworks to preserve 60FPS WebGL integration
      }
      if (window.innerWidth < 1024 && cores < 6) {
        return true;
      }
      return false;
    };

    if (checkInitialHardware()) {
      setIsLowPerformance(true);
      return;
    }

    let lastTime = performance.now();
    let frames = 0;
    let frameSamples: number[] = [];
    let animId: number;

    const sampleLoop = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        frameSamples.push(fps);
        if (frameSamples.length > 3) frameSamples.shift();

        if (frameSamples.length === 3) {
          const avgFps = frameSamples.reduce((a, b) => a + b, 0) / 3;
          if (avgFps < 48) {
            setIsLowPerformance(true);
            return;
          }
        }
        frames = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(sampleLoop);
    };

    animId = requestAnimationFrame(sampleLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Use elegant framer-motion scroll hooks for smooth updates
  const { scrollYProgress } = useScroll();
  
  // Create natural dampening springs for scrolling & mouse positions to give that VR/AVP Spatial feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 18 });
  
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const springX = useSpring(mX, { stiffness: 35, damping: 12 });
  const springY = useSpring(mY, { stiffness: 35, damping: 12 });

  // High-performance Scroll Velocity Tracker utilizing root CSS variables for zero-draw latency
  useEffect(() => {
    let lastY = window.scrollY;
    let animId: number;
    let currentSpeed = 0;

    const trackSpeed = () => {
      const currY = window.scrollY;
      const diff = Math.abs(currY - lastY);
      
      currentSpeed = currentSpeed * 0.88 + diff * 0.12;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--scroll-speed', currentSpeed.toFixed(2));
      }
      
      lastY = currY;
      animId = requestAnimationFrame(trackSpeed);
    };

    animId = requestAnimationFrame(trackSpeed);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = e.clientX / window.innerWidth;
      const yNorm = e.clientY / window.innerHeight;
      mX.set(xNorm - 0.5); // Range -0.5 to 0.5
      mY.set(yNorm - 0.5); // Range -0.5 to 0.5
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mX, mY]);

  // Translate mouse position into subtle 3D rotational camera pivot
  const cameraRotateX = useTransform(springY, (val) => `${-val * 6}deg`);
  const cameraRotateY = useTransform(springX, (val) => `${val * 8}deg`);

  // Dynamic Camera zoom in state that adapts to active tab landmarks with spring physics
  const cameraBaseZoom = useSpring(1.0, { stiffness: 40, damping: 15 });
  useEffect(() => {
    if (activeTab === "home" || !activeTab) {
      cameraBaseZoom.set(1.0);
    } else if (activeTab === "listen") {
      cameraBaseZoom.set(1.08);
    } else if (activeTab === "vault") {
      cameraBaseZoom.set(1.15);
    } else if (activeTab === "artifacts") {
      cameraBaseZoom.set(1.22);
    } else if (activeTab === "lore") {
      cameraBaseZoom.set(1.28);
    } else if (activeTab === "community") {
      cameraBaseZoom.set(1.34);
    }
  }, [activeTab, cameraBaseZoom]);

  // Combine scroll progression zoom with the active room base zoom
  const globalCameraScale = useTransform(
    [smoothProgress, cameraBaseZoom],
    ([scrollProg, baseZ]) => (scrollProg as number) * 0.12 + (baseZ as number)
  );

  // Velocity calculation for dynamic high-precision 4D depth offsets
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 45, damping: 15 });

  // Cinematic portal gate fade flash screen triggers during sector crossings
  const portalFlash = useTransform(
    smoothProgress,
    [0, 0.26, 0.34, 0.42, 0.56, 0.64, 0.72, 0.84, 0.91, 0.97, 1.0],
    [0,  0,    1.0,  0,    0,    1.0,  0,    0,    1.0,  0,    0]
  );
  const portalFlashScale = useTransform(
    smoothProgress,
    [0, 0.26, 0.34, 0.42, 0.56, 0.64, 0.72, 0.84, 0.91, 0.97, 1.0],
    [0.9, 0.95, 1.15, 1.3,  0.95, 1.15, 1.3,  0.95, 1.15, 1.3,  1.0]
  );

  // Map active tab state to index corresponding to each digital chamber
  const getChamberIndex = (tab: string | undefined): number => {
    if (!tab) return 0;
    if (tab === "home") return 0;
    if (tab === "listen" || tab === "vault") return 1;
    if (tab === "artifacts") return 2;
    if (tab === "lore" || tab === "community") return 3;
    return 0;
  };

  const currentChamberIdx = getChamberIndex(activeTab);

  // Shared VR twin eye renderer to feed left/right eye depth nodes dynamically
  const renderAtelierWorld = (eye: 'left' | 'right' | 'center') => {
    const spatialXOffset = eye === 'left' ? "-14px" : eye === 'right' ? "14px" : "0px";
    const eyeRotateYDisparity = eye === 'left' ? -0.015 : eye === 'right' ? 0.015 : 0;
    
    const adjustedRotateY = useTransform(springX, (val) => `${(val + eyeRotateYDisparity) * 8}deg`);

    return (
      <motion.div
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          rotateX: cameraRotateX,
          rotateY: adjustedRotateY,
          scale: globalCameraScale,
          x: spatialXOffset,
        }}
        className="w-full h-full flex items-center justify-center absolute inset-0"
      >
        {/* --- LAYERED ENVIRONMENT CHAMBERS --- */}
        {CHAMBERS.map((chamber) => {
          const isActive = chamber.idx === currentChamberIdx;
          return (
            <div
              key={chamber.id}
              className={`absolute inset-0 w-full h-full pointer-events-none select-none transition-all duration-1000 ${
                isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
              }`}
            >
              <ChamberEnvironmentPlate
                chamber={chamber}
                smoothProgress={smoothProgress}
                springX={springX}
                springY={springY}
                isLowPerformance={isLowPerformance}
                paradoxMode={paradoxMode}
              />
            </div>
          );
        })}

        {/* --- ORGANIC PARTICULATE DUST MOTES CANVAS LAYER --- */}
        <MotesCanvas eye={eye} containerRef={containerRef} isLowPerformance={isLowPerformance} />

        {/* --- CUSTOM 4D WEBGL SHADER DEPTH-BUFFER CORRIDOR SIMULATOR --- */}
        <SovereignWebGLStage isLowPerformance={isLowPerformance} paradoxMode={paradoxMode} />

        {/* --- 4D HOLOGRAPHIC GEOMETRICAL VOLUMETRIC CORRIDOR OVERLAY --- */}
        <VolumetricCorridor 
          smoothVelocity={smoothVelocity} 
          smoothProgress={smoothProgress} 
          springX={springX} 
          springY={springY} 
          isLowPerformance={isLowPerformance}
        />
      </motion.div>
    );
  };

  // Dedicated Left/Right stereoscopic status panels for active diagnostic readouts
  const renderVRHUD = (eyeLabel: string) => {
    return (
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-25 font-mono text-[9px] text-[#c6b89e]/70">
        <div className="absolute inset-12 border border-[#c6b89e]/10 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 border-t border-l border-[#93000a]/70 absolute -top-1 -left-1" />
          <div className="w-2.5 h-2.5 border-t border-r border-[#93000a]/70 absolute -top-1 -right-1" />
          <div className="w-2.5 h-2.5 border-b border-l border-[#93000a]/70 absolute -bottom-1 -left-1" />
          <div className="w-2.5 h-2.5 border-b border-r border-[#93000a]/70 absolute -bottom-1 -right-1" />
          <div className="w-24 h-24 border border-dashed border-[#c6b89e]/15 rounded-full animate-spin" style={{ animationDuration: "120s" }} />
          <div className="w-[1px] h-12 bg-[#93000a]/15 absolute" />
          <div className="w-12 h-[1px] bg-[#93000a]/15 absolute" />
        </div>

        <div className="flex justify-between items-start bg-black/30 backdrop-blur-xs p-3 border border-white/5 relative">
          <div className="space-y-1">
            <div className="font-bold tracking-widest text-[#93000a] flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#93000a]" />
              STEREOSCOPIC VR // ACTIVE
            </div>
            <div className="text-white/40 uppercase text-[7px] tracking-wider">SPECTRAL MATRIX EYE: {eyeLabel}</div>
          </div>
          <div className="text-right space-y-0.5 text-[8px] text-white/55">
            <div>IPD: 64mm | FOV: 110°</div>
            <div>COORDS_4D_DEPTH: WEBGL_CORE</div>
          </div>
        </div>

        <div className="flex justify-between items-end bg-black/25 p-3 border border-white/5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#c6b89e]" />
              <span>PITCH_YAW_Y: TRUE_ALGN</span>
            </div>
            <div className="text-[7px] text-white/30 uppercase tracking-widest">Atelier Hologram Sync OK</div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#93000a] animate-pulse" />
            <span className="tracking-wider text-[8px]">SENSORS_REFRESH: 90Hz</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#010101]"
      id="VirtualKingdomStageContainer"
    >
      {/* Projected Background Video Sentinel Portal */}
      {bgProjectedVideo && (
        <video
          key={bgProjectedVideo}
          src={bgProjectedVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-12 pointer-events-none z-0 mix-blend-screen scale-105"
          style={{
            filter: "brightness(0.65) contrast(1.15) blur(1.5px)",
          }}
        />
      )}

      {/* Living Archive: Resting Double-Pulse Heartbeat Aura Overlay */}
      <motion.div
        animate={{
          opacity: [0.08, 0.24, 0.14, 0.30, 0.08, 0.08],
          scale: [1.0, 1.022, 1.01, 1.042, 1.0, 1.0],
          backgroundColor: ["rgba(0,0,0,0)", "rgba(147,0,10,0.015)", "rgba(0,0,0,0)", "rgba(198,184,158,0.01)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"]
        }}
        transition={{
          duration: 4.5, // restful ~53 bpm heart cycle
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.14, 0.28, 0.42, 0.65, 1.0] // Double-beat sequence (lub-dub) followed by rest window
        }}
        className="absolute inset-0 pointer-events-none select-none z-[1] bg-[radial-gradient(circle_at_center,_rgba(147,0,10,0.07)_0%,_rgba(198,184,158,0.03)_55%,_transparent_100%)] mix-blend-screen"
        id="HeartbeatAuraOverlay"
      />

      {/* Immersive Film Grain overlay to preserve authentic corporate/luxury textures */}
      <div 
        className="absolute inset-0 z-30 opacity-[0.02] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='public/ChatGPT Image May 16, 2026, 04_16_44 AM (5).png'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Atmospheric Soft Volumetric Drift Dust backplate */}
      <AtmosphericDustMotes isLowPerformance={isLowPerformance} />

      {/* High-blur animated fog layers drifting dynamically in depth space */}
      <div className="absolute inset-0 z-1 select-none pointer-events-none overflow-hidden opacity-35">
        <motion.div
          animate={{
            x: ["-8%", "8%"],
            y: ["-4%", "4%"],
            scale: [1.1, 1.18, 1.1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute inset-[-120px] filter blur-3xl mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 60%, rgba(198, 184, 158, 0.15) 0%, transparent 65%),
                              radial-gradient(ellipse at 75% 25%, rgba(147, 0, 10, 0.08) 0%, transparent 55%),
                              radial-gradient(ellipse at 15% 85%, rgba(198, 184, 158, 0.10) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* STEREOSCOPIC VR DUAL EYE LAYOUT OR FULL-SCREEN CAMERA SYSTEM */}
      {vrActive ? (
        <div 
          className="absolute inset-0 w-full h-full flex flex-row pointer-events-auto overflow-hidden bg-black scale-105"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          {/* LEFT EYE CONTAINER */}
          <motion.div 
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              rotateY: useTransform(springX, (x) => 4.5 + (x as number) * 8),
              rotateX: useTransform(springY, (y) => -(y as number) * 8),
              translateZ: -40,
              scale: 0.97
            }}
            className="relative w-1/2 h-full overflow-hidden border-r border-white/5"
          >
            {renderAtelierWorld('left')}
            {renderVRHUD('LEFT EYE')}
          </motion.div>
          {/* RIGHT EYE CONTAINER */}
          <motion.div 
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              rotateY: useTransform(springX, (x) => -4.5 + (x as number) * 8),
              rotateX: useTransform(springY, (y) => -(y as number) * 8),
              translateZ: -40,
              scale: 0.97
            }}
            className="relative w-1/2 h-full overflow-hidden"
          >
            {renderAtelierWorld('right')}
            {renderVRHUD('RIGHT EYE')}
          </motion.div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {renderAtelierWorld('center')}
        </div>
      )}

      {/* --- SOVEREIGN VR TOGGLE HUB CONTROLS PANEL --- */}
      <div 
        className="absolute bottom-6 left-6 z-40 bg-black/75 border border-[#c6b89e]/20 hover:border-[#93000a]/40 p-3 flex items-center gap-4 pointer-events-auto transition-all backdrop-blur-md rounded-none shadow-[2px_15px_30px_rgba(0,0,0,0.8)]"
        id="SpatialHubControlsPanel"
      >
        <div className="flex flex-col gap-0.5">
          <div className="font-serif text-[11px] font-bold tracking-widest text-[#c6b89e] uppercase select-none">
            Sovereign Spatial HUD
          </div>
          <div className="font-mono text-[7px] text-white/45 uppercase tracking-wider select-none">
            Coordinates: {activeTab === "main" ? "DSS ATRIUM" : activeTab === "assets" ? "EXH EXHIBITION" : activeTab === "command" ? "CMD DECK" : "BTQ BOUTIQUE"}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[#c6b89e]/15" />

        <button
          onClick={() => setVrActive(!vrActive)}
          className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-mono tracking-[2px] uppercase transition-all duration-300 cursor-pointer border ${
            vrActive
              ? "bg-[#93000a]/20 text-[#93000a] border-[#93000a] hover:bg-transparent hover:text-white"
              : "bg-transparent text-white border-white/20 hover:border-[#c6b89e] hover:text-[#c6b89e]"
          }`}
          title="Toggle 4D Spatial Stereoscopic dual-eye mode"
          id="VRSpatialModeToggleButton"
        >
          <Tv className="w-3 h-3" />
          <span>{vrActive ? "[ DISENGAGE VR ]" : "[ STEREOSCOPIC VR ]"}</span>
        </button>
      </div>

      {/* --- SECTOR CLEARING PORTAL GATEWAY FLASH OVERLAY --- */}
      <motion.div
        style={{
          opacity: portalFlash,
          scale: portalFlashScale,
        }}
        className="absolute inset-0 z-45 bg-[#000000] mix-blend-normal pointer-events-none select-none flex items-center justify-center p-12 transition-all duration-200"
      >
        <div className="relative w-full h-[150%] max-w-2xl border-x-[0.5px] border-[#c6b89e]/20 flex items-center justify-center rounded-sm">
          <div 
            className="absolute inset-0 bg-[#050505] opacity-98"
            style={{
              backgroundImage: "radial-gradient(circle at center, transparent 35%, #000000 100%)",
            }}
          />
          <svg viewBox="0 0 1000 1000" className="absolute w-[150%] h-[150%] opacity-40 animate-pulse stroke-[#c6b89e]/50 fill-none pointer-events-none">
            <path d="M150,50 L400,420 L420,620 L280,920" strokeWidth="0.5" />
            <path d="M850,100 L620,460 L580,680 L720,980" strokeWidth="0.5" />
            <path d="M500,0 L420,320 L580,580 L520,1000" strokeWidth="0.5" strokeOpacity="0.2" />
          </svg>
          
          <div className="flex flex-col items-center gap-6 relative z-10 text-center">
            <div className="w-16 h-16 rounded-full border border-dashed border-[#c6b89e]/50 flex items-center justify-center animate-spin" style={{ animationDuration: "10s" }}>
              <Landmark className="w-6 h-6 text-[#c6b89e]/80" />
            </div>
            <div className="text-[12px] font-serif uppercase tracking-[15px] text-[#c6b89e] mt-4">
              CHANNELING SECURE PORTAL
            </div>
            <div className="text-[8px] font-mono tracking-[4px] text-[#93000a]">
              AUTO_COORDINATING SOVEREIGN GATEWAY...
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Organic dust particles rendering function using standard interactive high-performance canvas
function MotesCanvas({ 
  eye, 
  containerRef,
  isLowPerformance
}: { 
  eye: 'left' | 'right' | 'center'; 
  containerRef: React.RefObject<HTMLDivElement | null>;
  isLowPerformance: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const p = canvas.parentElement;
      if (p) {
        canvas.width = p.clientWidth;
        canvas.height = p.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const baseCount = eye === 'center' ? 120 : 60;
    const count = isLowPerformance ? Math.round(baseCount * 0.3) : baseCount; // 70% particle reduction
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      depth: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulseTime: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.7) * 0.55, 
        size: 0.8 + Math.random() * 2.4,
        depth: 0.5 + Math.random() * 2.5, 
        color: Math.random() > 0.4 ? "198, 184, 158" : "147, 0, 10", 
        alpha: 0.15 + Math.random() * 0.4,
        pulseSpeed: 0.008 + Math.random() * 0.015,
        pulseTime: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    let active = true;
    let frameId: number;

    const render = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let scrollSpeed = 0;
      if (containerRef.current) {
        const speedVal = containerRef.current.style.getPropertyValue('--scroll-speed');
        if (speedVal) {
          scrollSpeed = parseFloat(speedVal) || 0;
        }
      }

      const extraSpeedFactor = 1.0 + Math.min(scrollSpeed * 0.08, 4.0);
      const extraSizeFactor = 1.0 + Math.min(scrollSpeed * 0.02, 1.3);
      const extraAlphaFactor = Math.min(scrollSpeed * 0.01, 0.3);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.pulseTime += p.pulseSpeed;
        const currentPulse = Math.sin(p.pulseTime) * 0.12;

        p.y += p.vy * extraSpeedFactor;
        p.x += p.vx * extraSpeedFactor;

        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        const stereoscopicSplitDisparity = eye === 'left' ? -25 : eye === 'right' ? 25 : 0;
        const parallaxOffsetX = ((mouseX - canvas.width / 2) * (p.depth * 0.035)) + stereoscopicSplitDisparity * p.depth * 0.25;
        const parallaxOffsetY = (mouseY - canvas.height / 2) * (p.depth * 0.025);

        const rX = p.x + parallaxOffsetX;
        const rY = p.y + parallaxOffsetY;
        const rSize = p.size * (p.depth * 0.6) * extraSizeFactor * (1.0 + currentPulse);
        const rAlpha = Math.max(0.08, Math.min(p.alpha * (p.depth / 2.2) + extraAlphaFactor, 0.85));

        // Skip heavy gradient drawing entirely on low performance to conserve pixel fill rates
        if (!isLowPerformance) {
          ctx.beginPath();
          const glowRadius = rSize * 3.5;
          const grad = ctx.createRadialGradient(rX, rY, 0, rX, rY, glowRadius);
          grad.addColorStop(0, `rgba(${p.color}, ${rAlpha})`);
          grad.addColorStop(0.3, `rgba(${p.color}, ${rAlpha * 0.35})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.arc(rX, rY, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(rX, rY, rSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 205, ${rAlpha * 1.2})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [eye, containerRef, isLowPerformance]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-15 opacity-85" />;
}

// Atmospheric volumetric drift dust motes layout
function AtmosphericDustMotes({ isLowPerformance }: { isLowPerformance: boolean }) {
  const moteCount = isLowPerformance ? 8 : 35; // Downscale SVG motes significantly on mobile/low performance
  const motes = useRef(
    Array.from({ length: 35 }).map((_, i) => { // keep static pre-initialized array structure safe
      const isGold = Math.random() > 0.45;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1.2 + Math.random() * 4.5,
        delay: `${Math.random() * -45}s`,
        duration: `${35 + Math.random() * 65}s`,
        color: isGold ? "rgba(198, 184, 158, 0.42)" : "rgba(147, 0, 10, 0.30)",
      };
    })
  ).current;

  return (
    <>
      <style>{`
        @keyframes drift-up-angle {
          0% {
            transform: translateY(12vh) translateX(-20px) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(-112vh) translateX(65px) scale(1.15);
            opacity: 0;
          }
        }
        .mote-emitter-element-3d {
          animation: drift-up-angle linear infinite;
          will-change: transform, opacity;
        }
      `}</style>
      <div 
        className="absolute inset-0 z-[2] select-none pointer-events-none overflow-hidden opacity-50 mix-blend-screen"
        id="AtmosphericDustMotesLayer"
      >
        <svg className="w-full h-full">
          {/* Omit heavy filter definitions on mobile specs */}
          {!isLowPerformance && (
            <defs>
              <filter id="mote-glow-filter-3d" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3.0" result="blur" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          )}
          {motes.slice(0, moteCount).map((mote) => (
            <circle
              key={mote.id}
              r={mote.size}
              fill={mote.color}
              filter={isLowPerformance ? undefined : "url(#mote-glow-filter-3d)"}
              className="mote-emitter-element-3d"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animationDelay: mote.delay,
                animationDuration: mote.duration,
                cx: mote.left,
                cy: mote.top,
              } as React.CSSProperties}
            />
          ))}
        </svg>
      </div>
    </>
  );
}

interface VolumetricCorridorProps {
  smoothVelocity: any;
  smoothProgress: any;
  springX: any;
  springY: any;
  isLowPerformance: boolean;
}

function VolumetricCorridor({ smoothVelocity, smoothProgress, springX, springY, isLowPerformance }: VolumetricCorridorProps) {
  const displacementScale = useTransform(smoothVelocity, (v) => Math.min(32, Math.abs(v as number) * 0.045));
  
  const accelerationPull = useTransform(smoothVelocity, (v) => {
    const speed = Math.abs(v as number);
    return Math.min(1.22, 1.0 + speed * 0.002);
  });

  const speedGlowIntensity = useTransform(smoothVelocity, (v) => {
    const speed = Math.abs(v as number);
    return Math.min(0.85, 0.2 + speed * 0.015);
  });

  const mouseDriftX = useTransform(springX, (x) => `${(x as number) * -45}px`);
  const mouseDriftY = useTransform(springY, (y) => `${(y as number) * -45}px`);

  const portalRings = [
    { z: -150, opacity: 0.25, width: "100%", height: "100%" },
    { z: -100, opacity: 0.45, width: "85%", height: "85%" },
    { z: -50, opacity: 0.65, width: "70%", height: "70%" },
    { z: 0, opacity: 0.85, width: "55%", height: "55%" },
    { z: 50, opacity: 0.95, width: "40%", height: "40%" },
  ];

  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden mix-blend-screen"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {!isLowPerformance && (
        <svg className="w-0 h-0 absolute">
          <defs>
            <filter id="corridorWarpFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" result="noise" />
              <motion.feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale={displacementScale} 
                xChannelSelector="R" 
                yChannelSelector="G" 
              />
            </filter>
          </defs>
        </svg>
      )}

      <motion.div
        style={{
          scale: accelerationPull,
          x: mouseDriftX,
          y: mouseDriftY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center filter saturate-[0.9]"
      >
        {portalRings.map((ring, idx) => {
          return (
            <motion.div
              key={idx}
              style={{
                z: ring.z,
                width: ring.width,
                height: ring.height,
                transformStyle: "preserve-3d",
                filter: isLowPerformance ? undefined : "url(#corridorWarpFilter)",
                opacity: ring.opacity,
              }}
              className="absolute flex items-center justify-center border border-[#c6b89e]/15 shadow-inner transition-colors duration-500 rounded-lg pointer-events-none"
            >
              <motion.div 
                style={{
                  opacity: speedGlowIntensity,
                  background: `radial-gradient(circle at center, rgba(147, 0, 10, 0.04) 0%, rgba(198, 184, 158, 0.01) 70%, transparent 100%)`
                }}
                className="absolute inset-4 blur-2xl"
              />

              <div className="absolute inset-1 border border-dashed border-[#93000a]/5 rounded" />

              <span className="absolute top-2 left-3 font-mono text-[6.5px] text-[#c6b89e]/40 tracking-wider">
                CH_DEPT_Z // {ring.z}M
              </span>
              <span className="absolute bottom-2 right-3 font-mono text-[6px] text-white/20 tracking-wider">
                4D_CORRIDOR_METRIC_OK
              </span>
            </motion.div>
          );
        })}

        <motion.div
          style={{
            scale: useTransform(smoothVelocity, (v) => 1.0 + Math.abs(v as number) * 0.005),
            opacity: useTransform(smoothVelocity, (v) => Math.min(0.55, 0.15 + Math.abs(v as number) * 0.02)),
            boxShadow: `0 0 160px 80px rgba(147, 0, 10, 0.15), 0 0 80px 40px rgba(198, 184, 158, 0.1)`,
          }}
          className="w-16 h-16 rounded-full bg-white/5 absolute blur-md z-[-5]"
        />
      </motion.div>
    </div>
  );
}
