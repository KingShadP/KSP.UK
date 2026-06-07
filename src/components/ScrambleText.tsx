/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  hoverText?: string;
  duration?: number;
  delay?: number;
  triggerOnHover?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+{}|[]<>";

export default function ScrambleText({
  text,
  hoverText,
  duration = 1000,
  delay = 0,
  triggerOnHover = false,
}: ScrambleTextProps) {
  const displayText = hoverText ? hoverText : text;
  const [currentText, setCurrentText] = useState(displayText);
  const [isAnimating, setIsAnimating] = useState(false);
  const triggerCount = useRef(0);

  const startAnimation = () => {
    setIsAnimating(true);
    triggerCount.current += 1;
    const currentTrigger = triggerCount.current;
    
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (triggerCount.current !== currentTrigger) return;
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealIndex = Math.floor(progress * displayText.length);
      
      let result = "";
      for (let i = 0; i < displayText.length; i++) {
        if (i < revealIndex) {
          result += displayText[i];
        } else if (displayText[i] === " ") {
          result += " ";
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      
      setCurrentText(result);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentText(displayText);
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startAnimation();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, hoverText, delay]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isAnimating) {
      startAnimation();
    }
  };

  return (
    <span onMouseEnter={handleMouseEnter} className="inline-block cursor-pointer">
      {currentText}
    </span>
  );
}
