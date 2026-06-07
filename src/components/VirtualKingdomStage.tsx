/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";

export default function VirtualKingdomStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(1000);

  // Use elegant framer-motion scroll hooks for ultra-smooth updates
  const { scrollYProgress } = useScroll();
  
  // Create natural dampening springs for scrolling & mouse position to give that AVP Spatial feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 18 });
  
  const mX = useMotionValue(0.5);
  const mY = useMotionValue(0.5);
  const springX = useSpring(mX, { stiffness: 35, damping: 12 });
  const springY = useSpring(mY, { stiffness: 35, damping: 12 });

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

  // Translate mouse position into subtle 3D rotational camera pivot (prevents spinning/disorientation)
  const cameraRotateX = useTransform(springY, (val) => `${-val * 5}deg`);
  const cameraRotateY = useTransform(springX, (val) => `${val * 6}deg`);

  // Transform functions for each of the 4 chambers of the virtual kingdom, mapping scale and opacity
  
  // Chamber 1: The Sovereign Threshold (Outer Marble Portal)
  // Highly loaded in the beginning; flies out past the camera at progress 0.35
  const room1Scale = useTransform(smoothProgress, [0, 0.35], [1.0, 3.4]);
  const room1Opacity = useTransform(smoothProgress, [0, 0.28, 0.35], [1, 0.9, 0]);
  const room1Z = useTransform(smoothProgress, [0, 0.35], [0, 500]);
  
  // Parallax layers for Chamber 1 (Fog vs. Gold Lights vs. Columns)
  const room1FogX = useTransform(springX, (v) => `${v * -25}px`);
  const room1GoldY = useTransform(smoothProgress, [0, 0.35], [0, -120]);
  const room1GoldX = useTransform(springX, (v) => `${v * 40}px`);

  // Chamber 2: The Sovereign Vault Gallery (Middle Chamber)
  // Starts scaled down and invisible; fades in as room 1 exits; flies out at progress 0.65
  const room2Scale = useTransform(smoothProgress, [0, 0.3, 0.62], [0.38, 1.0, 3.0]);
  const room2Opacity = useTransform(smoothProgress, [0, 0.18, 0.28, 0.55, 0.62], [0, 0.2, 1, 0.95, 0]);
  const room2Z = useTransform(smoothProgress, [0.18, 0.62], [-400, 300]);
  const room2GoldY = useTransform(smoothProgress, [0.2, 0.62], [-40, 80]);

  // Chamber 3: The Holographic Constellation Deck (Command Room)
  // Starts tiny; peaks at progress 0.82; flies out at 0.95
  const room3Scale = useTransform(smoothProgress, [0.32, 0.58, 0.88], [0.35, 1.0, 2.8]);
  const room3Opacity = useTransform(smoothProgress, [0.32, 0.45, 0.52, 0.82, 0.88], [0, 0.1, 1, 0.9, 0]);
  const room3Z = useTransform(smoothProgress, [0.45, 0.88], [-350, 250]);

  // Chamber 4: The Core Sanctum Terminus (Digital Monolith Entrance)
  // Emerges as the ultimate terminal space for Shopify exports; slides in and centers
  const room4Scale = useTransform(smoothProgress, [0.65, 0.93], [0.42, 1.0]);
  const room4Opacity = useTransform(smoothProgress, [0.65, 0.88], [0, 1]);
  const room4Z = useTransform(smoothProgress, [0.65, 0.95], [-250, 0]);

  // Ambient drifting dust particles (controlled, non-chaotic)
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: number; scale: number; duration: number }>>([]);
  useEffect(() => {
    // Generate constant state-based luxury embers once on mount
    const list = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 80}%`,
      delay: Math.random() * -12,
      scale: 0.5 + Math.random() * 0.8,
      duration: 10 + Math.random() * 15,
    }));
    setParticles(list);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#010101] pointer-events-none select-none select-none"
    >
      {/* Immersive Film Grain overlay to preserve corporate/luxury texture */}
      <div 
        className="absolute inset-0 z-30 opacity-[0.022] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Floating high-end golden ambient embers */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden mix-blend-screen">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-[#c6b89e]/30"
            style={{
              left: p.left,
              top: p.top,
              scale: p.scale,
              boxShadow: "0 0 8px #c6b89e",
            }}
            animate={{
              y: [-25, -95],
              x: [-15, 25, -15],
              opacity: [0, 0.8, 0.4, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Primary 3D Virtual Camera Space */}
      <motion.div
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          rotateX: cameraRotateX,
          rotateY: cameraRotateY,
        }}
        className="relative w-full h-full flex items-center justify-center transition-all duration-300"
      >
        {/* ROOM 1: Sovereign Atrium (The Outer Threshold Portal) */}
        <motion.div
          style={{
            scale: room1Scale,
            opacity: room1Opacity,
            z: room1Z,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center transition-all duration-100"
        >
          {/* Deep Tunnel Perspective Lines */}
          <svg viewBox="0 0 1000 600" className="absolute w-[120%] h-[120%] opacity-40 mix-blend-screen">
            <line x1="0" y1="0" x2="350" y2="220" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
            <line x1="1000" y1="0" x2="650" y2="220" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
            <line x1="0" y1="600" x2="350" y2="380" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
            <line x1="1000" y1="600" x2="650" y2="380" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.25" />
            
            {/* Concentric golden architectural rings fading to center */}
            <rect x="250" y="150" width="500" height="300" rx="30" fill="none" stroke="#c6b89e" strokeWidth="0.75" strokeOpacity="0.15" />
            <rect x="350" y="210" width="300" height="180" rx="20" fill="none" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.2" />
          </svg>

          {/* Golden Column Pillars Left & Right */}
          <div className="absolute inset-y-0 left-[8%] w-[80px] bg-gradient-to-r from-black via-[#0a0a0a] to-[#12110f] border-r border-[#c6b89e]/20 flex flex-col justify-between py-16 opacity-85 shadow-[15px_0_35px_rgba(0,0,0,0.95)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[1px] w-full bg-[#c6b89e]/30 shadow-[0_0_10px_#c6b89e]" />
            ))}
            {/* Elegant luxury gold trims on columns */}
            <div className="absolute top-12 bottom-12 right-[4px] w-[1px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent" />
          </div>

          <div className="absolute inset-y-0 right-[8%] w-[80px] bg-gradient-to-l from-black via-[#0a0a0a] to-[#12110f] border-l border-[#c6b89e]/20 flex flex-col justify-between py-16 opacity-85 shadow-[-15px_0_35px_rgba(0,0,0,0.95)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[1px] w-full bg-[#c6b89e]/30 shadow-[0_0_10px_#c6b89e]" />
            ))}
            <div className="absolute top-12 bottom-12 left-[4px] w-[1px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent" />
          </div>

          {/* Ground Marble Floor Surface Reflective Grid */}
          <div 
            className="absolute bottom-0 left-[10%] right-[10%] h-[35%] opacity-20 pointer-events-none mix-blend-screen"
            style={{
              backgroundImage: "linear-gradient(to top, rgba(198,184,158,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(198,184,158,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              transform: "perspective(300px) rotateX(75deg)",
              transformOrigin: "bottom center",
            }}
          />

          {/* Central Portal Gate frame */}
          <div className="w-[450px] h-[550px] border border-[#c6b89e]/25 bg-[#030303]/75 flex items-center justify-center relative overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.95)] rounded-t-full rounded-b-none backdrop-blur-sm">
            {/* Outer golden rim sweeps */}
            <div className="absolute inset-[3px] border border-[#c6b89e]/10 rounded-t-full pointer-events-none" />
            <div className="absolute inset-[15px] border border-dashed border-[#c6b89e]/10 rounded-t-full pointer-events-none" />
            
            {/* Glowing gold backlighting focal node */}
            <motion.div
              style={{
                y: room1GoldY,
                x: room1GoldX,
                boxShadow: "0 0 100px 30px rgba(198, 184, 158, 0.15)",
              }}
              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-[#c6b89e]/20 to-[#c6b89e]/5 top-1/4"
            />

            {/* Immersive Fog Mist overlay drifts */}
            <motion.div
              style={{ x: room1FogX }}
              className="absolute inset-0 bg-radial-gradient from-transparent via-[#010101]/85 to-[#010101] opacity-75 pointer-events-none"
            />
          </div>
        </motion.div>


        {/* ROOM 2: The Sovereign Vault Gallery (The Middle Hallway Vaults) */}
        <motion.div
          style={{
            scale: room2Scale,
            opacity: room2Opacity,
            z: room2Z,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center transition-all duration-100"
        >
          {/* Radial concentric rings representing digital luxury vault security gates */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Background alignment crosshair matrices */}
            <div className="absolute w-[80%] h-[1px] bg-[#c6b89e]/10 pointer-events-none" />
            <div className="absolute h-[80%] w-[1px] bg-[#c6b89e]/10 pointer-events-none" />

            {/* Layered luxury architecture vaults */}
            <svg viewBox="0 0 600 600" className="w-[500px] h-[500px] opacity-25 stroke-[#c6b89e] fill-none max-w-full">
              <circle cx="300" cy="300" r="280" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="300" cy="300" r="250" strokeWidth="0.5" />
              <circle cx="300" cy="300" r="180" strokeWidth="0.75" />
              <circle cx="300" cy="300" r="100" strokeWidth="0.5" strokeDasharray="6 3" />
              
              {/* Dynamic perspective lines of Vault Rooms */}
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

            {/* Glowing active security chamber node */}
            <motion.div
              style={{
                y: room2GoldY,
                boxShadow: "0 0 120px 40px rgba(198, 184, 158, 0.2)",
              }}
              className="absolute w-32 h-32 rounded-full bg-[#1e1a14] opacity-55 border border-[#c6b89e]/15 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-[#c6b89e]/40 animate-spin" style={{ animationDuration: "35s" }} />
            </motion.div>
          </div>
        </motion.div>


        {/* ROOM 3: The Holographic Constellation Deck (The Satellite Command Room) */}
        <motion.div
          style={{
            scale: room3Scale,
            opacity: room3Opacity,
            z: room3Z,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center transition-all duration-100"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Digital Constellation star grids mapped to radar sectors */}
            <svg viewBox="0 0 800 800" className="w-[650px] h-[650px] opacity-20 stroke-[#ff4a00] fill-none max-w-full">
              {/* Concentric sweep indicators aligned index */}
              <circle cx="400" cy="400" r="380" strokeWidth="0.5" strokeOpacity="0.15" />
              <circle cx="400" cy="400" r="350" strokeWidth="0.5" strokeDasharray="5 5" />
              <circle cx="400" cy="400" r="280" strokeWidth="0.75" />
              
              {/* Star system coordinates lines connection */}
              <polyline points="210,120 320,150 400,280 480,150 590,120" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.3" />
              <polyline points="210,680 320,650 400,520 480,650 590,680" stroke="#c6b89e" strokeWidth="0.5" strokeOpacity="0.3" />
              
              <circle cx="320" cy="150" r="4" fill="#ff4a00" />
              <circle cx="480" cy="150" r="4" fill="#ff4a00" />
              <circle cx="400" cy="280" r="6" fill="#c6b89e" />
              
              <circle cx="320" cy="650" r="4" fill="#c6b89e" />
              <circle cx="480" cy="650" r="4" fill="#c6b89e" />
              <circle cx="400" cy="520" r="6" fill="#ff4a00" />
            </svg>

            {/* Glowing radar scan sweep beam background */}
            <div className="absolute w-[500px] h-[500px] bg-gradient-radial from-[#ff4a00]/[0.025] to-transparent pointer-events-none rounded-full" />
          </div>
        </motion.div>


        {/* ROOM 4: The Core Sanctum Terminus (Digital Monolith Entrance) */}
        <motion.div
          style={{
            scale: room4Scale,
            opacity: room4Opacity,
            z: room4Z,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 flex items-center justify-center transition-all duration-100"
        >
          <div className="relative w-full h-full flex items-center justify-center select-none">
            
            {/* Monumental shining luxury gold monolith arch */}
            <div className="w-[380px] h-[480px] border-t border-x border-[#c6b89e]/30 bg-gradient-to-b from-[#060504] to-black rounded-t-full flex flex-col justify-end items-center pb-12 relative shadow-[0_-50px_100px_rgba(198,184,158,0.15)] overflow-hidden">
              <div className="absolute inset-[3px] border-t border-x border-[#c6b89e]/15 rounded-t-full" />
              
              {/* Virtual Throne high-contrast beam */}
              <div className="w-[1.5px] h-3/4 bg-gradient-to-t from-transparent via-[#c6b89e] to-transparent opacity-80" />
              <div className="w-16 h-16 rounded-full border border-[#c6b89e]/30 flex items-center justify-center animate-pulse mt-4 relative z-10 bg-black/80">
                <div className="w-4 h-4 rounded-full bg-[#ff4a00]" />
              </div>

              {/* Shifting background portal light gradient glow */}
              <div className="absolute inset-0 bg-radial-gradient from-[#c6b89e]/10 via-[#010101]/80 to-black pointer-events-none -z-10" />
            </div>

            {/* Symmetric columns representing Sovereign Terminus gateway */}
            <div className="absolute inset-y-0 left-[15%] w-[4px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent shadow-[0_0_12px_#c6b89e]" />
            <div className="absolute inset-y-0 right-[15%] w-[4px] bg-gradient-to-b from-transparent via-[#c6b89e]/40 to-transparent shadow-[0_0_12px_#c6b89e]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
