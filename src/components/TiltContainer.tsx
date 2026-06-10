/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef, useState } from "react";

interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees
}

export default function TiltContainer({ 
  children, 
  className = "", 
  maxTilt = 6 
}: TiltContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Coordinate motion values relative to element's center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Heavy, high-end dampened weight spring to avoid cheap, clicky animations
  const springConfig = { damping: 45, stiffness: 180, mass: 0.9 };
  const rotateXSpring = useSpring(y, springConfig);
  const rotateYSpring = useSpring(x, springConfig);

  // Map normalized coordinates [-0.5, 0.5] to rotation degrees
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Inverse mapped translation for a luxury light-sweep reflection glint
  const glintX = useTransform(rotateYSpring, [-0.5, 0.5], ["-40%", "40%"]);
  const glintY = useTransform(rotateXSpring, [-0.5, 0.5], ["-40%", "40%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Center is (0.5, 0.5), range normalized to [-0.5, 0.5]
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative select-none"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full h-full ${className} transition-shadow duration-[600ms] ${
          isHovered 
            ? "shadow-[0_0_40px_rgba(198,184,158,0.12)] border-[#c6b89e]/30" 
            : "shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* Underlay glow spotlight backplane */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-radial-gradient from-[#c6b89e]/5 to-transparent z-0" 
          style={{ transform: "translateZ(-10px)" }}
        />

        {/* Outer content container inside the 3D grid space */}
        <div style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }} className="w-full h-full relative z-10">
          {children}
        </div>

        {/* Diagonal light sweep glint reflecting client orientation */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay z-20"
          style={{
            transform: "translateZ(25px) scale(1.6)",
            x: glintX,
            y: glintY,
            opacity: isHovered ? 0.35 : 0,
            transition: "opacity 500ms ease-out",
          }}
        />

        {/* Laser target corner bracket overlays to amplify engineering/atelier look */}
        <div className="absolute inset-0 pointer-events-none z-30" style={{ transform: "translateZ(15px)" }}>
          <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-white/5 transition-all duration-700 ${isHovered ? "border-[#c6b89e]/60 w-3 h-3" : ""}`} />
          <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-white/5 transition-all duration-700 ${isHovered ? "border-[#c6b89e]/60 w-3 h-3" : ""}`} />
          <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/5 transition-all duration-700 ${isHovered ? "border-[#c6b89e]/60 w-3 h-3" : ""}`} />
          <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/5 transition-all duration-700 ${isHovered ? "border-[#c6b89e]/60 w-3 h-3" : ""}`} />
        </div>
      </motion.div>
    </div>
  );
}
