/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useVelocity } from "motion/react";
import { Landmark, Tv, Eye, Compass, Activity, Shield, RotateCw } from "lucide-react";

interface VirtualKingdomStageProps {
  activeTab?: string;
}

export default function VirtualKingdomStage({ activeTab }: VirtualKingdomStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(1000);
  const [vrActive, setVrActive] = useState(false);

  // Use elegant framer-motion scroll hooks for ultra-smooth updates
  const { scrollYProgress } = useScroll();
  
  // Create natural dampening springs for scrolling & mouse position to give that AVP Spatial feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 18 });
  
  const mX = useMotionValue(0.5);
  const mY = useMotionValue(0.5);
  const springX = useSpring(mX, { stiffness: 35, damping: 12 });
  const springY = useSpring(mY, { stiffness: 35, damping: 12 });

  // High-performance Scroll Velocity/Intensity Tracker using zero-draw CSS variables to avoid React re-renders!
  useEffect(() => {
    let lastY = window.scrollY;
    let animId: number;
    let currentSpeed = 0;

    const trackSpeed = () => {
      const currY = window.scrollY;
      const diff = Math.abs(currY - lastY);
      
      // Apply beautiful spring-like momentum decay
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
    const handleResize = () => {
      setWindowHeight(window.innerHeight || 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = e.clientX / window.innerWidth;
      const yNorm = e.clientY / window.innerHeight;
      mX.set(xNorm - 0.5); // Range -0.5 to 0.5
      mY.set(yNorm - 0.5); // Range -0.5 to 0.5
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mX, mY]);

  // Translate mouse position into subtle 3D rotational camera pivot
  const cameraRotateX = useTransform(springY, (val) => `${-val * 7}deg`);
  const cameraRotateY = useTransform(springX, (val) => `${val * 9}deg`);

  // --- UPGRADE: Dynamic Camera zoom in state that adapts to coordinates with spring physics ---
  const cameraBaseZoom = useSpring(1.0, { stiffness: 40, damping: 15 });
  useEffect(() => {
    if (activeTab === "main" || !activeTab) {
      cameraBaseZoom.set(1.0);
    } else if (activeTab === "assets") {
      cameraBaseZoom.set(1.10);
    } else if (activeTab === "command") {
      cameraBaseZoom.set(1.18);
    } else if (activeTab === "shopify") {
      cameraBaseZoom.set(1.24);
    }
  }, [activeTab, cameraBaseZoom]);

  // Combine scroll progression zoom with the active room base zoom
  const globalCameraScale = useTransform(
    [smoothProgress, cameraBaseZoom],
    ([scrollProg, baseZ]) => (scrollProg as number) * 0.14 + (baseZ as number)
  );

  // --- UPGRADE: Dynamic scrolling parallax transforms for background marble texture plates ---
  const room1MarbleY = useTransform(smoothProgress, [0, 0.35], [0, -140]);
  const room2MarbleY = useTransform(smoothProgress, [0.18, 0.62], [100, -100]);
  const room3MarbleY = useTransform(smoothProgress, [0.45, 0.88], [-100, 100]);
  const room4MarbleY = useTransform(smoothProgress, [0.65, 1.0], [120, 0]);

  // Chamber 1: The Sovereign Threshold
  const room1Scale = useTransform(smoothProgress, [0, 0.35], [1.0, 3.4]);
  const room1Opacity = useTransform(smoothProgress, [0, 0.28, 0.35], [1, 0.9, 0]);
  const room1Z = useTransform(smoothProgress, [0, 0.35], [0, 500]);
  const room1FogX = useTransform(springX, (v) => `${v * -25}px`);
  const room1GoldY = useTransform(smoothProgress, [0, 0.35], [0, -120]);

  // Chamber 2: The Sovereign Vault Gallery
  const room2Scale = useTransform(smoothProgress, [0, 0.3, 0.62], [0.38, 1.0, 3.0]);
  const room2Opacity = useTransform(smoothProgress, [0, 0.18, 0.28, 0.55, 0.62], [0, 0.2, 1, 0.95, 0]);
  const room2Z = useTransform(smoothProgress, [0.18, 0.62], [-400, 300]);
  const room2GoldY = useTransform(smoothProgress, [0.2, 0.62], [-40, 80]);

  // Chamber 3: The Holographic Constellation Deck
  const room3Scale = useTransform(smoothProgress, [0.32, 0.58, 0.88], [0.35, 1.0, 2.8]);
  const room3Opacity = useTransform(smoothProgress, [0.32, 0.45, 0.52, 0.82, 0.88], [0, 0.1, 1, 0.9, 0]);
  const room3Z = useTransform(smoothProgress, [0.45, 0.88], [-350, 250]);

  // Chamber 4: The Core Sanctum Terminus
  const room4Scale = useTransform(smoothProgress, [0.65, 0.93], [0.42, 1.0]);
  const room4Opacity = useTransform(smoothProgress, [0.65, 0.88], [0, 1]);
  const room4Z = useTransform(smoothProgress, [0.65, 0.95], [-250, 0]);

  // --- 4D VOLUMETRIC SPATIAL LAYERS DEF (MOUSE MOVEMENT PARALLAX INDICES VIA TRANSLATE3D) ---
  const room1Backdrop3d = useTransform(
    [springX, springY, room1MarbleY],
    ([mx, my, sy]) => `translate3d(${(mx as number) * -16}px, ${(my as number) * -16 + (sy as number)}px, -35px)`
  );
  const room1Mid3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * -35}px, ${(my as number) * -35}px, 25px)`
  );
  const room1Fore3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * -60}px, ${(my as number) * -60}px, 75px)`
  );
  const room1Light3d = useTransform(
    [springX, springY, room1GoldY],
    ([mx, my, gy]) => `translate3d(${(mx as number) * 75}px, ${(my as number) * 75 + (gy as number)}px, 10px)`
  );

  const room2Backdrop3d = useTransform(
    [springX, springY, room2MarbleY],
    ([mx, my, sy]) => `translate3d(${(mx as number) * -16}px, ${(my as number) * -16 + (sy as number)}px, -35px)`
  );
  const room2Mid3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * -35}px, ${(my as number) * -35}px, 25px)`
  );
  const room2Light3d = useTransform(
    [springX, springY, room2GoldY],
    ([mx, my, gy]) => `translate3d(${(mx as number) * 75}px, ${(my as number) * 75 + (gy as number)}px, 75px)`
  );

  const room3Backdrop3d = useTransform(
    [springX, springY, room3MarbleY],
    ([mx, my, sy]) => `translate3d(${(mx as number) * -16}px, ${(my as number) * -16 + (sy as number)}px, -35px)`
  );
  const room3Mid3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * -35}px, ${(my as number) * -35}px, 25px)`
  );
  const room3Light3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * 75}px, ${(my as number) * 75}px, 75px)`
  );

  const room4Backdrop3d = useTransform(
    [springX, springY, room4MarbleY],
    ([mx, my, sy]) => `translate3d(${(mx as number) * -16}px, ${(my as number) * -16 + (sy as number)}px, -35px)`
  );
  const room4Fore3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * -60}px, ${(my as number) * -60}px, 95px)`
  );
  const room4Light3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * 75}px, ${(my as number) * 75}px, 135px)`
  );
  const room4Dust3d = useTransform(
    [springX, springY],
    ([mx, my]) => `translate3d(${(mx as number) * -110}px, ${(my as number) * -110}px, 160px)`
  );

  // Velocity calculation for dynamic high-precision 4D depth offsets
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 45, damping: 15 });

  // Calculate mouse distance from center as a motion value for responsive depth expansion
  const mouseCenterDist = useTransform([springX, springY], ([x, y]) => {
    const dx = x as number;
    const dy = y as number;
    return Math.sqrt(dx * dx + dy * dy); // Range 0 to ~0.707
  });

  // Calculate distinct Z-axis offsets for every background layer chamber combining both scroll velocity and mouse position
  const room1VelocityZ = useTransform(smoothVelocity, (v) => Math.min(Math.abs(v as number) * 850, 200));
  const room1MouseZ = useTransform(mouseCenterDist, (dist) => (dist as number) * -120);
  const room1CombinedZ = useTransform([room1Z, room1VelocityZ, room1MouseZ], ([base, vel, mouse]) => (base as number) + (vel as number) + (mouse as number));

  const room2VelocityZ = useTransform(smoothVelocity, (v) => Math.min(Math.abs(v as number) * 1100, 250));
  const room2MouseZ = useTransform(mouseCenterDist, (dist) => (dist as number) * -160);
  const room2CombinedZ = useTransform([room2Z, room2VelocityZ, room2MouseZ], ([base, vel, mouse]) => (base as number) + (vel as number) + (mouse as number));

  const room3VelocityZ = useTransform(smoothVelocity, (v) => Math.min(Math.abs(v as number) * 1300, 290));
  const room3MouseZ = useTransform(mouseCenterDist, (dist) => (dist as number) * -200);
  const room3CombinedZ = useTransform([room3Z, room3VelocityZ, room3MouseZ], ([base, vel, mouse]) => (base as number) + (vel as number) + (mouse as number));

  const room4VelocityZ = useTransform(smoothVelocity, (v) => Math.min(Math.abs(v as number) * 1500, 350));
  const room4MouseZ = useTransform(mouseCenterDist, (dist) => (dist as number) * -240);
  const room4CombinedZ = useTransform([room4Z, room4VelocityZ, room4MouseZ], ([base, vel, mouse]) => (base as number) + (vel as number) + (mouse as number));

  // Cinematic portal gate fade flash screen triggers
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

  // Shared modular renderer to prevent copy-paste bloat and feed Left/Right eye modules instantly!
  const renderAtelierWorld = (eye: 'left' | 'right' | 'center') => {
    // Generate horizontal spatial offsets based on eye IPD
    const spatialXOffset = eye === 'left' ? "-14px" : eye === 'right' ? "14px" : "0px";
    const eyeRotateYDisparity = eye === 'left' ? -0.015 : eye === 'right' ? 0.015 : 0;
    
    // Adjusted camera rotation mapping with IPD misalignment
    const adjustedRotateY = useTransform(springX, (val) => `${(val + eyeRotateYDisparity) * 9}deg`);

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
        {/* --- DUST MOTES HIGH-PERFORMANCE INTERACTIVE CANVAS LAYER --- */}
        <MotesCanvas eye={eye} containerRef={containerRef} />

        {/* ROOM 1: Sovereign Atrium (The Outer Threshold Portal) */}
        <motion.div
          style={{
            scale: room1Scale,
            opacity: room1Opacity,
            z: room1CombinedZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {/* Parallax Marble Plate Backdrop 1 with golden details */}
          <motion.div
            style={{
              transform: room1Backdrop3d,
              transformStyle: "preserve-3d",
              backgroundImage: "radial-gradient(circle at center, rgba(16,16,16,0.94) 0%, rgba(4,4,4,1.0) 100%)",
            }}
            className="absolute inset-[-140px] filter saturate-[0.85] opacity-[0.98] -z-10 rounded-sm border border-white/[0.015]"
          >
            {/* Elegant luxury gold sanctuary light sweep layer */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-[0.14] animate-light-sweep"
              style={{
                background: "linear-gradient(110deg, transparent 25%, rgba(198,184,158,0.2) 42%, rgba(198,184,158,0.3) 50%, rgba(198,184,158,0.2) 58%, transparent 75%)",
                backgroundSize: "200% 100%",
              }}
            />
            {/* Sophisticated marble patterns */}
            <svg viewBox="0 0 1000 1000" className="absolute w-full h-full opacity-25 pointer-events-none stroke-[#c6b89e]/35 fill-none">
              <path d="M50,150 L200,320 L270,410 L150,750" strokeWidth="0.5" />
              <path d="M800,200 L650,450 L580,510 L700,850" strokeWidth="0.5" />
            </svg>
          </motion.div>

          {/* Deep Tunnel Perspective Lines */}
          <motion.div 
            style={{ transform: room1Mid3d, transformStyle: "preserve-3d" }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-1"
          >
            <svg viewBox="0 0 1000 600" className="w-[120%] h-[120%] opacity-35 mix-blend-screen">
              <line x1="0" y1="0" x2="350" y2="220" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
              <line x1="1000" y1="0" x2="650" y2="220" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
              <line x1="0" y1="600" x2="350" y2="380" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
              <line x1="1000" y1="600" x2="650" y2="380" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
              <rect x="250" y="150" width="500" height="300" rx="30" fill="none" stroke="#c6b89e" strokeWidth="0.75" strokeOpacity="0.15" />
              <rect x="350" y="210" width="300" height="180" rx="20" fill="none" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.2" />
            </svg>
          </motion.div>

          {/* Golden Column Pillars Left & Right */}
          <motion.div 
            style={{ transform: room1Fore3d, transformStyle: "preserve-3d" }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            <div className="absolute inset-y-0 left-[8%] w-[80px] bg-gradient-to-r from-black via-[#080808] to-[#11100e] border-r border-[#c6b89e]/20 flex flex-col justify-between py-16 opacity-85 shadow-[15px_0_35px_rgba(0,0,0,0.95)]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[1px] w-full bg-[#c6b89e]/30 shadow-[0_0_10px_#c6b89e]" />
              ))}
              <div className="absolute top-12 bottom-12 right-[4px] w-[1px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent" />
            </div>

            <div className="absolute inset-y-0 right-[8%] w-[80px] bg-gradient-to-l from-black via-[#080808] to-[#11100e] border-l border-[#c6b89e]/20 flex flex-col justify-between py-16 opacity-85 shadow-[-15px_0_35px_rgba(0,0,0,0.95)]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[1px] w-full bg-[#c6b89e]/30 shadow-[0_0_10px_#c6b89e]" />
              ))}
              <div className="absolute top-12 bottom-12 left-[4px] w-[1px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent" />
            </div>
          </motion.div>

          {/* Ground Reflective Floor */}
          <motion.div 
            style={{ transform: room1Mid3d, transformStyle: "preserve-3d" }}
            className="absolute bottom-0 left-[10%] right-[10%] h-[35%] opacity-15 pointer-events-none mix-blend-screen z-5"
          >
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: "linear-gradient(to top, rgba(198,184,158,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(198,184,158,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
                transform: "perspective(300px) rotateX(75deg)",
                transformOrigin: "bottom center",
              }}
            />
          </motion.div>

          {/* Central Portal Gate frame */}
          <motion.div 
            style={{ transform: room1Fore3d, transformStyle: "preserve-3d" }}
            className="w-[430px] h-[520px] border border-[#c6b89e]/25 bg-[#030303]/80 flex items-center justify-center relative overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.95)] rounded-t-full rounded-b-none backdrop-blur-xs z-20"
          >
            <div className="absolute inset-[3px] border border-[#c6b89e]/10 rounded-t-full pointer-events-none" />
            <div className="absolute inset-[15px] border border-dashed border-[#c6b89e]/10 rounded-t-full pointer-events-none" />
            
            {/* Focal glow backlight */}
            <motion.div
              style={{
                transform: room1Light3d,
                boxShadow: "0 0 100px 30px rgba(198, 184, 158, 0.16)",
              }}
              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-[#c6b89e]/15 to-[#c6b89e]/5 top-1/4"
            />

            <motion.div
              style={{ x: room1FogX }}
              className="absolute inset-0 bg-radial-gradient from-transparent via-[#010101]/85 to-[#010101] opacity-75 pointer-events-none"
            />
          </motion.div>
        </motion.div>

        {/* ROOM 2: The Sovereign Vault Gallery */}
        <motion.div
          style={{
            scale: room2Scale,
            opacity: room2Opacity,
            z: room2CombinedZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{
              transform: room2Backdrop3d,
              transformStyle: "preserve-3d",
              backgroundImage: "radial-gradient(circle at center, rgba(10,10,10,0.96) 0%, rgba(2,2,2,1.0) 100%)",
            }}
            className="absolute inset-[-140px] pointer-events-none opacity-[0.98] -z-10 rounded-sm"
          >
            <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-[0.11] animate-light-sweep"
              style={{
                background: "linear-gradient(110deg, transparent 20%, rgba(198,184,158,0.18) 38%, rgba(198,184,158,0.25) 50%, rgba(198,184,158,0.18) 62%, transparent 80%)",
                backgroundSize: "200% 100%",
                animationDelay: "-4s"
              }}
            />
            <svg viewBox="0 0 1000 1000" className="absolute w-full h-full opacity-18 pointer-events-none stroke-[#c6b89e]/25 fill-none">
              <path d="M120,50 L350,380 L520,680 L220,950" strokeWidth="0.5" />
              <path d="M920,80 L720,410 L680,680 L850,910" strokeWidth="0.5" />
            </svg>
          </motion.div>

          <motion.div 
            style={{ transform: room2Mid3d, transformStyle: "preserve-3d" }}
            className="absolute inset-0 flex items-center justify-center z-1"
          >
            <div className="absolute w-[80%] h-[1px] bg-[#c6b89e]/10 pointer-events-none" />
            <div className="absolute h-[80%] w-[1px] bg-[#c6b89e]/10 pointer-events-none" />

            <svg viewBox="0 0 600 600" className="w-[480px] h-[480px] opacity-25 stroke-[#c6b89e] fill-none max-w-full">
              <circle cx="300" cy="300" r="280" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="300" cy="300" r="250" strokeWidth="0.5" />
              <circle cx="300" cy="300" r="180" strokeWidth="0.75" />
              <circle cx="300" cy="300" r="100" strokeWidth="0.5" strokeDasharray="6 3" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 300 + Math.cos(angle) * 100;
                const y1 = 300 + Math.sin(angle) * 100;
                const x2 = 300 + Math.cos(angle) * 280;
                const y2 = 300 + Math.sin(angle) * 280;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.5" strokeOpacity="0.4" />
                );
              })}
            </svg>
          </motion.div>

          <motion.div
            style={{
              transform: room2Light3d,
              transformStyle: "preserve-3d",
            }}
            className="absolute flex items-center justify-center z-10"
          >
            <motion.div
              style={{
                boxShadow: "0 0 120px 40px rgba(198, 184, 158, 0.18)",
              }}
              className="w-32 h-32 rounded-full bg-[#1c1813] opacity-60 border border-[#c6b89e]/15 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-[#c6b89e]/40 animate-spin" style={{ animationDuration: "35s" }} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ROOM 3: The Holographic Constellation Deck */}
        <motion.div
          style={{
            scale: room3Scale,
            opacity: room3Opacity,
            z: room3CombinedZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{
              transform: room3Backdrop3d,
              transformStyle: "preserve-3d",
              backgroundImage: "radial-gradient(circle at center, rgba(12,12,12,0.96) 0%, rgba(1,1,1,1.0) 100%)",
            }}
            className="absolute inset-[-140px] pointer-events-none opacity-[0.98] -z-10 rounded-sm"
          >
            <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-[0.12] animate-light-sweep"
              style={{
                background: "linear-gradient(110deg, transparent 20%, rgba(198,184,158,0.18) 38%, rgba(198,184,158,0.25) 50%, rgba(198,184,158,0.18) 62%, transparent 80%)",
                backgroundSize: "200% 100%",
                animationDelay: "-8s"
              }}
            />
            <svg viewBox="0 0 1000 1000" className="absolute w-full h-full opacity-15 pointer-events-none stroke-[#c6b89e]/20 fill-none">
              <path d="M50,200 L280,380 L320,680 L180,950" strokeWidth="0.5" />
              <path d="M950,200 L718,380 L680,680 L820,950" strokeWidth="0.5" />
            </svg>
          </motion.div>

          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              style={{ transform: room3Mid3d, transformStyle: "preserve-3d" }}
              className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none"
            >
              <svg viewBox="0 0 800 800" className="w-[620px] h-[620px] opacity-20 stroke-[#ff4a00] fill-none max-w-full">
                <circle cx="400" cy="400" r="380" strokeWidth="0.5" strokeOpacity="0.15" />
                <circle cx="400" cy="400" r="350" strokeWidth="0.5" strokeDasharray="5 5" />
                <circle cx="400" cy="400" r="280" strokeWidth="0.75" />
                <polyline points="210,120 320,150 400,280 480,150 590,120" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.3" />
                <polyline points="210,680 320,650 400,520 480,650 590,680" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.3" />
                <circle cx="320" cy="150" r="4" fill="#ff4a00" />
                <circle cx="480" cy="150" r="4" fill="#ff4a00" />
                <circle cx="400" cy="280" r="6" fill="#c6b89e" />
                <circle cx="320" cy="650" r="4" fill="#c6b89e" />
                <circle cx="480" cy="650" r="4" fill="#c6b89e" />
                <circle cx="400" cy="520" r="6" fill="#ff4a00" />
              </svg>
            </motion.div>

            <motion.div
              style={{ transform: room3Light3d, transformStyle: "preserve-3d" }}
              className="absolute w-[450px] h-[450px] bg-gradient-radial from-[#ff4a00]/[0.025] to-transparent pointer-events-none rounded-full z-10"
            />
          </div>
        </motion.div>

        {/* ROOM 4: The Core Sanctum Terminus */}
        <motion.div
          style={{
            scale: room4Scale,
            opacity: room4Opacity,
            z: room4CombinedZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{
              transform: room4Backdrop3d,
              transformStyle: "preserve-3d",
              backgroundImage: "radial-gradient(circle at center, rgba(6,6,6,0.99) 0%, rgba(0,0,0,1.0) 100%)",
            }}
            className="absolute inset-[-140px] pointer-events-none opacity-100 -z-10 rounded-sm"
          >
            <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-color-dodge opacity-[0.14] animate-light-sweep"
              style={{
                background: "linear-gradient(110deg, transparent 20%, rgba(198,184,158,0.18) 38%, rgba(198,184,158,0.25) 50%, rgba(198,184,158,0.18) 62%, transparent 80%)",
                backgroundSize: "200% 100%",
                animationDelay: "-12s"
              }}
            />
            <svg viewBox="0 0 1000 1000" className="absolute w-full h-full opacity-18 pointer-events-none stroke-[#c6b89e]/30 fill-none">
              <path d="M80,80 L250,380 L380,680 L210,950" strokeWidth="0.5" />
              <path d="M920,80 L750,380 L620,680 L790,950" strokeWidth="0.5" />
            </svg>
          </motion.div>

          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div 
              style={{ transform: room4Fore3d, transformStyle: "preserve-3d" }}
              className="z-10 relative flex items-center justify-center"
            >
              <div className="w-[360px] h-[450px] border-t border-x border-[#c6b89e]/30 bg-gradient-to-b from-[#050403] to-black rounded-t-full flex flex-col justify-end items-center pb-12 relative shadow-[0_-50px_100px_rgba(198,184,158,0.12)] overflow-hidden">
                <div className="absolute inset-[3px] border-t border-x border-[#c6b89e]/15 rounded-t-full" />
                <div className="w-[1.5px] h-3/4 bg-gradient-to-t from-transparent via-[#c6b89e] to-transparent opacity-80" />
                
                <motion.div 
                  style={{ transform: room4Light3d, transformStyle: "preserve-3d" }}
                  className="w-14 h-14 rounded-full border border-[#c6b89e]/30 flex items-center justify-center mt-4 relative z-10 bg-black/80"
                >
                  <div className="w-3 h-3 rounded-full bg-[#ff4a00]" />
                </motion.div>
                <div className="absolute inset-0 bg-radial-gradient from-[#c6b89e]/8 via-[#010101]/80 to-black pointer-events-none -z-10" />
              </div>
            </motion.div>

            <motion.div 
              style={{ transform: room4Dust3d, transformStyle: "preserve-3d" }}
              className="absolute inset-0 pointer-events-none z-20"
            >
              <div className="absolute inset-y-0 left-[15%] w-[3px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent shadow-[0_0_12px_#c6b89e]" />
              <div className="absolute inset-y-0 right-[15%] w-[3px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent shadow-[0_0_12px_#c6b89e]" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Dedicated Left/Right operational metrics HUD overlays inside the VR Split Eye Lenses
  const renderVRHUD = (eyeLabel: string) => {
    return (
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-25 font-mono text-[9px] text-[#c6b89e]/70">
        {/* Circular Virtual Reticle Grid */}
        <div className="absolute inset-12 border border-[#c6b89e]/10 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 border-t border-l border-[#ff4a00]/70 absolute -top-1 -left-1" />
          <div className="w-2.5 h-2.5 border-t border-r border-[#ff4a00]/70 absolute -top-1 -right-1" />
          <div className="w-2.5 h-2.5 border-b border-l border-[#ff4a00]/70 absolute -bottom-1 -left-1" />
          <div className="w-2.5 h-2.5 border-b border-r border-[#ff4a00]/70 absolute -bottom-1 -right-1" />
          <div className="w-24 h-24 border border-dashed border-[#c6b89e]/15 rounded-full animate-spin" style={{ animationDuration: "120s" }} />
          <div className="w-[1px] h-12 bg-[#ff4a00]/15 absolute" />
          <div className="w-12 h-[1px] bg-[#ff4a00]/15 absolute" />
        </div>

        {/* Top HUD bar panel */}
        <div className="flex justify-between items-start bg-black/30 backdrop-blur-xs p-3 border border-white/5 relative">
          <div className="space-y-1">
            <div className="font-bold tracking-widest text-[#ff4a00] flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a00]" />
              STEREOSCOPIC VR // ACTIVE
            </div>
            <div className="text-white/40 uppercase text-[7px] tracking-wider">SPECTRAL MATRIX EYE: {eyeLabel}</div>
          </div>
          <div className="text-right space-y-0.5 text-[8px] text-white/55">
            <div>IPD: 64mm | FOV: 110°</div>
            <div>COORDS_4D_DEPTH: ULTRA</div>
          </div>
        </div>

        {/* Bottom telemetry indicators */}
        <div className="flex justify-between items-end bg-black/25 p-3 border border-white/5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#c6b89e]" />
              <span>PITCH_YAW_Y: TRUE_ALGN</span>
            </div>
            <div className="text-[7px] text-white/30 uppercase tracking-widest">Atelier Hologram Sync OK</div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#ff4a00] animate-pulse" />
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
      {/* Immersive Film Grain overlay to preserve corporate/luxury texture */}
      <div 
        className="absolute inset-0 z-30 opacity-[0.02] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* --- ADDITION: Soft Atmospheric Volumetric Dust Motes backplate layer --- */}
      <AtmosphericDustMotes />

      {/* --- UPGRADE: High-blur animated fog layer drifting dynamically --- */}
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
          className="absolute inset-[-120px] filter blur-3xl mix-blend-screen pointer-events-none animate-fog-drift"
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 60%, rgba(198, 184, 158, 0.15) 0%, transparent 65%),
                              radial-gradient(ellipse at 75% 25%, rgba(255, 74, 0, 0.08) 0%, transparent 55%),
                              radial-gradient(ellipse at 15% 85%, rgba(198, 184, 158, 0.10) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* RENDER THE MAJESTIC VIRTUAL ATMOSPHERE OR STEREOSCOPIC VR TWIN LAYOUT */}
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

      {/* --- FLOATING VR TOGGLE HUB CONTROLS PANEL (Pointer events enabled!) --- */}
      <div 
        className="absolute bottom-6 left-6 z-40 bg-black/75 border border-[#c6b89e]/20 hover:border-[#ff4a00]/40 p-3 flex items-center gap-4 pointer-events-auto transition-all backdrop-blur-md rounded-none shadow-[2px_15px_30px_rgba(0,0,0,0.8)]"
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
              ? "bg-[#ff4a00]/20 text-[#ff4a00] border-[#ff4a00] hover:bg-transparent hover:text-white"
              : "bg-transparent text-white border-white/20 hover:border-[#c6b89e] hover:text-[#c6b89e]"
          }`}
          title="Toggle 4D Spatial Stereoscopic dual-eye mode"
          id="VRSpatialModeToggleButton"
        >
          <Tv className="w-3 h-3" />
          <span>{vrActive ? "[ DISENGAGE VR ]" : "[ STEREOSCOPIC VR ]"}</span>
        </button>
      </div>

      {/* --- UPGRADE: Full-Screen Gateway Portal Flash Intersection Overlay --- */}
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
            <div className="w-16 h-16 rounded-full border border-dashed border-[#c6b89e] flex items-center justify-center animate-spin" style={{ animationDuration: "10s" }}>
              <Landmark className="w-6 h-6 text-[#c6b89e]/80" />
            </div>
            <div className="text-[12px] font-serif uppercase tracking-[15px] text-[#c6b89e] mt-4">
              CHANNELING SECURE PORTAL
            </div>
            <div className="text-[8px] font-mono tracking-[4px] text-[#ff4a00]">
              AUTO_COORDINATING SOVEREIGN GATEWAY...
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Sub-component rendering the High-Performance Canvas for organic dust motes drift and parallax deflection
function MotesCanvas({ 
  eye, 
  containerRef 
}: { 
  eye: 'left' | 'right' | 'center'; 
  containerRef: React.RefObject<HTMLDivElement | null>;
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

    // Seed variables
    const count = eye === 'center' ? 120 : 60; // Reduce counts slightly in dual-eye spatial blocks to maintain 60FPS compilation
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
        vy: (Math.random() - 0.7) * 0.55, // Continuous gentle upward movement
        size: 0.8 + Math.random() * 2.4,
        depth: 0.5 + Math.random() * 2.5, // 0.5 to 3.0 layering factor
        color: Math.random() > 0.4 ? "198, 184, 158" : "255, 74, 0", // Royal Gold and Ambient Ember
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
      ctx.clearRect(0,0, canvas.width, canvas.height);

      // Instantly query scroll speed variable compiled by container hook
      let scrollSpeed = 0;
      if (containerRef.current) {
        const speedVal = containerRef.current.style.getPropertyValue('--scroll-speed');
        if (speedVal) {
          scrollSpeed = parseFloat(speedVal) || 0;
        }
      }

      // Dynamic booster scaling based on scroll velocity
      const extraSpeedFactor = 1.0 + Math.min(scrollSpeed * 0.08, 4.0);
      const extraSizeFactor = 1.0 + Math.min(scrollSpeed * 0.02, 1.3);
      const extraAlphaFactor = Math.min(scrollSpeed * 0.01, 0.3);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.pulseTime += p.pulseSpeed;
        const currentPulse = Math.sin(p.pulseTime) * 0.12;

        // Apply physics
        p.y += p.vy * extraSpeedFactor;
        p.x += p.vx * extraSpeedFactor;

        // Reset positions if boundary crossed
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        // Realistic mouse-move shifting calculations
        const stereoscopicSplitDisparity = eye === 'left' ? -25 : eye === 'right' ? 25 : 0;
        const parallaxOffsetX = ((mouseX - canvas.width / 2) * (p.depth * 0.035)) + stereoscopicSplitDisparity * p.depth * 0.25;
        const parallaxOffsetY = (mouseY - canvas.height / 2) * (p.depth * 0.025);

        const rX = p.x + parallaxOffsetX;
        const rY = p.y + parallaxOffsetY;
        const rSize = p.size * (p.depth * 0.6) * extraSizeFactor * (1.0 + currentPulse);
        const rAlpha = Math.max(0.08, Math.min(p.alpha * (p.depth / 2.2) + extraAlphaFactor, 0.85));

        // Radial glow backplate
        ctx.beginPath();
        const glowRadius = rSize * 3.5;
        const grad = ctx.createRadialGradient(rX, rY, 0, rX, rY, glowRadius);
        grad.addColorStop(0, `rgba(${p.color}, ${rAlpha})`);
        grad.addColorStop(0.3, `rgba(${p.color}, ${rAlpha * 0.35})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.arc(rX, rY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // High-contrast glowing core
        ctx.beginPath();
        ctx.arc(rX, rY, rSize, 0, Math.PI*2);
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
  }, [eye, containerRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-15 opacity-85" />;
}

// Sub-component for background drifting dust motes using high-contrast volumetric filter
function AtmosphericDustMotes() {
  const moteCount = 35;
  // Generate stable coordinates and random animation properties for pristine, reproducible rendering
  const motes = useRef(
    Array.from({ length: moteCount }).map((_, i) => {
      const isGold = Math.random() > 0.45;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1.2 + Math.random() * 4.5,
        delay: `${Math.random() * -45}s`,
        duration: `${35 + Math.random() * 65}s`,
        color: isGold ? "rgba(198, 184, 158, 0.42)" : "rgba(255, 74, 0, 0.30)",
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
        .mote-emitter-element {
          animation: drift-up-angle linear infinite;
          will-change: transform, opacity;
        }
      `}</style>
      <div 
        className="absolute inset-0 z-[2] select-none pointer-events-none overflow-hidden opacity-50 mix-blend-screen"
        id="AtmosphericDustMotesLayer"
      >
        <svg className="w-full h-full">
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
          {motes.map((mote) => (
            <circle
              key={mote.id}
              r={mote.size}
              fill={mote.color}
              filter="url(#mote-glow-filter-3d)"
              className="mote-emitter-element"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animationDelay: mote.delay,
                animationDuration: mote.duration,
                top: mote.top,
                left: mote.left,
                position: "absolute",
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

