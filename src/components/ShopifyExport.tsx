/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check, Info, FileText, Layout, ExternalLink } from "lucide-react";
import ScrambleText from "./ScrambleText";

interface TemplateItem {
  id: string;
  name: string;
  filename: string;
  type: "CSS" | "JSON" | "HTML" | "TEXT";
  size: string;
  description: string;
  code: string;
}

// Replicate the exact extracted strings from our discovery payload
const EXPORT_TEMPLATES: TemplateItem[] = [
  {
    id: "CSS_BASE",
    name: "Base Custom CSS",
    filename: "Assets > base.css",
    type: "CSS",
    size: "6.8 KB",
    description: "Espionage visual layout configurations overriding Shopify default styling rules.",
    code: `/* ========================================================
   THE SANCTUM | TACTICAL ESPIONAGE THEME
   Shopify Custom CSS (base.css or theme.liquid)
   ======================================================== */

:root {
  /* Core Palette */
  --color-background: #020202;
  --color-foreground: #ffffff;
  --color-accent-gold: #c6b89e;
  --color-accent-tactical: #ff4a00;
  
  /* Typography */
  --font-heading-family: "Playfair Display", serif; /* Replace with your desired serif */
  --font-body-family: "Inter", sans-serif;
  --font-mono-family: "JetBrains Mono", monospace;
  
  /* Spacing & Borders */
  --border-thin: 1px solid rgba(198, 184, 158, 0.2);
  --border-tactical: 1px solid rgba(255, 74, 0, 0.4);
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-body-family);
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3 {
  font-family: var(--font-heading-family);
  text-transform: uppercase;
  letter-spacing: -0.05em;
  font-weight: 300;
}

/* Tactical Data Elements */
.tactical-label {
  font-family: var(--font-mono-family);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--color-accent-gold);
  opacity: 0.7;
}

/* Off-White Identity Tag */
.identity-tag {
  background-color: var(--color-accent-tactical);
  color: #000;
  font-family: var(--font-body-family);
  font-weight: bold;
  font-size: 0.8rem;
  padding: 4px 12px;
  text-transform: uppercase;
  letter-spacing: 4px;
  transform: rotate(12deg);
  display: inline-block;
  box-shadow: 0 10px 20px rgba(255, 74, 0, 0.3);
}

/* Product Card - Anti-Template */
.card-wrapper {
  position: relative;
  border: var(--border-thin);
  background: black;
  transition: all 0.5s ease;
  cursor: crosshair;
}

.card-wrapper:hover {
  border-color: rgba(198, 184, 158, 0.5);
}

.card-wrapper img {
  filter: grayscale(100%) contrast(1.2);
  mix-blend-mode: screen;
  transition: all 1.5s ease;
  opacity: 0.6;
}

.card-wrapper:hover img {
  filter: grayscale(0%) contrast(1);
  opacity: 1;
  transform: scale(1.05); /* Slow zoom */
}

/* Crosshair Corners on Hover */
.card-wrapper::before,
.card-wrapper::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1px solid transparent;
  transition: all 0.3s;
  pointer-events: none;
  z-index: 2;
}

.card-wrapper:hover::before {
  top: 10px; left: 10px;
  border-top-color: var(--color-accent-gold);
  border-left-color: var(--color-accent-gold);
}

.card-wrapper:hover::after {
  bottom: 10px; right: 10px;
  border-bottom-color: var(--color-accent-tactical);
  border-right-color: var(--color-accent-tactical);
}

/* Buttons - Brutalist */
.button, .btn {
  background: transparent;
  color: var(--color-accent-gold);
  border: 1px solid var(--color-accent-gold);
  font-family: var(--font-mono-family);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 0.75rem;
  padding: 16px 32px;
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.button:hover, .btn:hover {
  background: var(--color-accent-gold);
  color: #000;
  box-shadow: 0 0 30px rgba(198, 184, 158, 0.3);
}

.button--primary {
  background: var(--color-accent-tactical);
  color: #000;
  border-color: var(--color-accent-tactical);
}

.button--primary:hover {
  background: #fff;
  border-color: #fff;
  box-shadow: 0 0 30px rgba(255, 74, 0, 0.6);
}

/* Glitch Animation for text */
@theme {
  --animate-scanline: scanline 6s linear infinite;
}
@keyframes textGlitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 2px) }
  40% { transform: translate(-2px, -2px) }
  60% { transform: translate(2px, 2px) }
  80% { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
}
.glitch-hover:hover {
  animation: textGlitch 0.2s linear infinite both;
  color: var(--color-accent-tactical);
}

/* --------------------------------------------------------
   PRODUCT CARDS | THE SANCTUM
   -------------------------------------------------------- */
.card-wrapper {
  background: var(--color-background);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(198, 184, 158, 0.1);
  transition: all 0.5s ease;
}

.card-wrapper:hover {
  border-color: rgba(198, 184, 158, 0.4);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.card__inner {
  position: relative;
  overflow: hidden;
  background: #050505;
}

.card__media img {
  filter: grayscale(100%) contrast(1.1);
  transition: filter 1s ease, transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.card-wrapper:hover .card__media img {
  filter: grayscale(0%);
  transform: scale(1.05);
}

.card__content {
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
}

.card-information__text {
  font-family: var(--font-mono-family, monospace);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent-gold, #c6b89e);
  margin-bottom: 0.5rem;
}

.price {
  font-family: var(--font-mono-family, monospace);
  color: #ffffff;
  font-size: 1rem;
}

/* Tactical Crosshairs on Cards */
.card-wrapper::before,
.card-wrapper::after,
.card__inner::before,
.card__inner::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  border: 1px solid transparent;
  opacity: 0;
  transition: all 0.4s ease;
  z-index: 10;
  pointer-events: none;
}

.card-wrapper::before { top: 10px; left: 10px; border-top-color: var(--color-accent-gold); border-left-color: var(--color-accent-gold); }
.card-wrapper::after { top: 10px; right: 10px; border-top-color: var(--color-accent-gold); border-right-color: var(--color-accent-gold); }
.card__inner::before { bottom: 10px; left: 10px; border-bottom-color: var(--color-accent-gold); border-left-color: var(--color-accent-gold); }
.card__inner::after { bottom: 10px; right: 10px; border-bottom-color: var(--color-accent-gold); border-right-color: var(--color-accent-gold); }

.card-wrapper:hover::before,
.card-wrapper:hover::after,
.card-wrapper:hover .card__inner::before,
.card-wrapper:hover .card__inner::after {
  opacity: 1;
}

/* Data Overlay on Hover */
.tactical-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 5;
  border-top: 1px solid rgba(198, 184, 158, 0.2);
}

.card-wrapper:hover .tactical-overlay {
  transform: translateY(0);
}

.tactical-data-line {
  font-family: var(--font-mono-family, monospace);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.tactical-data-line span:last-child {
  color: var(--color-accent-tactical);
}
}`,
  },
  {
    id: "SCHEMA_JSON",
    name: "Settings Custom Schema",
    filename: "Config > settings_schema.json",
    type: "JSON",
    size: "1.1 KB",
    description: "Configures theme customization variables for background backgrounds, body typography, and neon accent selections in the Shopify editor.",
    code: `  {
    "name": "The Sanctum Customization",
    "settings": [
      {
        "type": "header",
        "content": "Tactical Colors"
      },
      {
        "type": "color",
        "id": "color_background",
        "label": "Background",
        "default": "#020202"
      },
      {
        "type": "color",
        "id": "color_text",
        "label": "Text",
        "default": "#ffffff"
      },
      {
        "type": "color",
        "id": "color_accent_gold",
        "label": "Accent Gold",
        "default": "#c6b89e"
      },
      {
        "type": "color",
        "id": "color_accent_tactical",
        "label": "Accent Tactical",
        "default": "#ff4a00"
      },
      {
        "type": "header",
        "content": "Tactical Typography"
      },
      {
        "type": "font_picker",
        "id": "font_heading",
        "label": "Heading Font",
        "default": "playfair_display_n4"
      },
      {
        "type": "font_picker",
        "id": "font_body",
        "label": "Body Font",
        "default": "inter_n3"
      }
    ]
  }`,
  },
  {
    id: "SCHEMA_DATA",
    name: "Settings Custom Data",
    filename: "Config > settings_data.json",
    type: "JSON",
    size: "240 Bytes",
    description: "Initial color parameters injected into settings_data JSON mapping file.",
    code: `{
  "current": {
    "color_background": "#020202",
    "color_text": "#ffffff",
    "color_accent_gold": "#c6b89e",
    "color_accent_tactical": "#ff4a00",
    "font_heading": "playfair_display_n4",
    "font_body": "inter_n3"
  }
}`,
  },
  {
    id: "CURSOR_HTML",
    name: "Holographic Focus Cursor",
    filename: "Layout > theme.liquid (Cursor)",
    type: "HTML",
    size: "4.1 KB",
    description: "Immersive custom cursor script following the cursor with tactical alignment rings and floating crosshair tracking readouts.",
    code: `<!-- THE SANCTUM | CUSTOM CURSOR -->
<!-- Add this to theme.liquid before closing </body> tag -->
<div id="sanctum-cursor-core"></div>
<div id="sanctum-cursor-ring">
  <div class="line top-line"></div>
  <div class="line bottom-line"></div>
  <div class="line left-line"></div>
  <div class="line right-line"></div>
</div>
<div id="sanctum-cursor-coords">
   <span class="dot"></span>
   <span id="coord-text">[0 x 0]</span>
</div>

<style>
@media (pointer: fine) {
  body, a, button, [role="button"], input, select, textarea { cursor: none; }
}

#sanctum-cursor-core {
  position: fixed; top: 0; left: 0;
  width: 4px; height: 4px; background: #ff4a00;
  border-radius: 2px; pointer-events: none;
  mix-blend-mode: screen; box-shadow: 0 0 15px #ff4a00;
  transform: translate(-50%, -50%); z-index: 9999999;
  transition: opacity 0.3s, transform 0.05s linear;
}

#sanctum-cursor-ring {
  position: fixed; top: 0; left: 0;
  width: 50px; height: 50px;
  border: 1px solid rgba(198, 184, 158, 0.3); border-radius: 50%;
  pointer-events: none; mix-blend-mode: difference;
  transform: translate(-50%, -50%); z-index: 9999;
  transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s, transform 0.15s ease-out;
}

#sanctum-cursor-ring.hovering {
  width: 60px; height: 60px;
  border-color: rgba(255, 74, 0, 0.8);
  background: rgba(255, 74, 0, 0.2);
  box-shadow: 0 0 20px rgba(255, 74, 0, 0.4);
}

#sanctum-cursor-ring.clicking { width: 30px; height: 30px; }

.line { position: absolute; background: rgba(198, 184, 158, 0.8); transition: background 0.3s; }
#sanctum-cursor-ring.hovering .line { background: #ff4a00; }

.top-line { width: 2px; height: 6px; top: -3px; left: 50%; transform: translateX(-50%); }
.bottom-line { width: 2px; height: 6px; bottom: -3px; left: 50%; transform: translateX(-50%); }
.left-line { width: 6px; height: 2px; left: -3px; top: 50%; transform: translateY(-50%); }
.right-line { width: 6px; height: 2px; right: -3px; top: 50%; transform: translateY(-50%); }

#sanctum-cursor-coords {
  position: fixed; top: 24px; left: 24px;
  color: rgba(255, 74, 0, 0.8); font-family: monospace; font-size: 9px;
  text-transform: uppercase; letter-spacing: 3px;
  pointer-events: none; z-index: 9999999;
  display: flex; align-items: center; gap: 8px; transition: opacity 0.3s;
}

#sanctum-cursor-coords .dot {
  width: 4px; height: 4px; background: #ff4a00;
  border-radius: 50%; box-shadow: 0 0 8px #ff4a00; animation: pulse 2s infinite;
}

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  if (matchMedia('(pointer: coarse)').matches) return; // Ignore mobile

  const core = document.getElementById('sanctum-cursor-core');
  const ring = document.getElementById('sanctum-cursor-ring');
  const coords = document.getElementById('sanctum-cursor-coords');
  const coordText = document.getElementById('coord-text');

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    core.style.transform = \`translate(calc(-50% + \${mouseX}px), calc(-50% + \${mouseY}px))\`;
    coordText.textContent = \`[\${Math.round(mouseX)} x \${Math.round(mouseY)}]\`;
  });

  const loop = () => {
    ringX += (mouseX - ringX) * 0.2; ringY += (mouseY - ringY) * 0.2;
    ring.style.transform = \`translate(calc(-50% + \${ringX}px), calc(-50% + \${ringY}px))\`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

  document.querySelectorAll('a, button, input, select, textarea, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('hovering'); core.style.opacity = '0'; coords.style.opacity = '0'; });
    el.addEventListener('mouseleave', () => { ring.classList.remove('hovering'); core.style.opacity = '1'; coords.style.opacity = '1'; });
  });
});
</script>`,
  },
  {
    id: "SCRAMBLE_JS",
    name: "Text Scramble Matrix Script",
    filename: "Layout > theme.liquid (Scramble)",
    type: "HTML",
    size: "2.1 KB",
    description: "Applies a highly polished cyberpunk glitched scrambling character animation over designated heading components.",
    code: `<!-- THE SANCTUM | SCRAMBLE TEXT EFFECT -->
<!-- Add this to theme.liquid before closing </body> tag -->
<script>
class SanctumScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+{}|[]<>';
    this.originalText = el.innerText;
    this.duration = parseInt(el.dataset.scrambleDuration) || 1500;
    this.delay = parseInt(el.dataset.scrambleDelay) || 0;
    this.triggerOnHover = el.dataset.scrambleHover === 'true';
    this.isAnimating = false;
    this.triggerCount = 0;

    this.init();
  }

  init() {
    setTimeout(() => this.startAnimation(), this.delay);
    if (this.triggerOnHover) {
      this.el.addEventListener('mouseenter', () => {
        if (!this.isAnimating) this.startAnimation();
      });
    }
  }

  startAnimation() {
    let startTime;
    this.triggerCount++;
    const currentTrigger = this.triggerCount;
    this.isAnimating = true;

    const animate = (timestamp) => {
      if (this.triggerCount !== currentTrigger) return;
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const revealIndex = Math.floor(progress * this.originalText.length);

      let result = '';
      for (let i = 0; i < this.originalText.length; i++) {
        if (i < revealIndex) {
          result += this.originalText[i];
        } else if (this.originalText[i] === ' ') {
          result += ' ';
        } else {
          result += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }

      this.el.innerText = result;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.el.innerText = this.originalText;
        this.isAnimating = false;
      }
    };

    requestAnimationFrame(animate);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scramble-text').forEach(el => new SanctumScramble(el));
});
</script>

<!-- Usage Example: -->
<!-- <h2 class="scramble-text" data-scramble-duration="2000" data-scramble-hover="true">MISSION CRITICAL</h2> -->`,
  },
  {
    id: "LANDING_PAGE",
    name: "classified Landing Page (Liquid)",
    filename: "Templates > page.the-sanctum.liquid",
    type: "HTML",
    size: "7.9 KB",
    description: "An ultra-premium standalone landing code representing key cinematic intro animations, fluid responsive video panels, lock screens, and inline vector visual distortions.",
    code: `{% layout none %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} | The Sanctum</title>
  <style>
    :root {
      --color-background: #020202;
      --color-foreground: #ffffff;
      --color-accent-gold: #c6b89e;
      --color-accent-tactical: #ff4a00;
      --border-thin: 1px solid rgba(198, 184, 158, 0.2);
    }
    body {
      margin: 0; background: #000; color: #fff;
      font-family: 'Inter', sans-serif; overflow-x: hidden;
    }
    
    /* Noise Overlay */
    .noise-overlay {\n      position: fixed; inset: 0; z-index: 50; pointer-events: none;
      opacity: 0.03; mix-blend-mode: screen;
      background-image: url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E");
    }

    /* Video Background */
    .bg-video {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      object-fit: cover; z-index: 0; opacity: 0.4; mix-blend-mode: color-dodge;
      filter: sepia(100%) hue-rotate(330deg) saturate(200%) contrast(1.2) brightness(0.6);
      transform: scale(1.1); animation: heartbeat 10s infinite;
    }
    @keyframes heartbeat { 0%, 100% { transform: scale(1.1); filter: brightness(0.6); } 50% { transform: scale(1.15); filter: brightness(0.7); } }

    /* UI Layout */
    .sanctum-layout {
      position: relative; z-index: 10; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem;
    }

    .glass-panel {
      border: var(--border-thin);
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(16px);
      padding: 3rem;
      max-width: 800px;
      width: 100%;
      text-align: center;
      position: relative;
    }

    /* Crosshairs */
    .crosshair { position: absolute; width: 20px; height: 20px; border: 1px solid transparent; }
    .crosshair-tl { top: -1px; left: -1px; border-top-color: var(--color-accent-gold); border-left-color: var(--color-accent-gold); }
    .crosshair-tr { top: -1px; right: -1px; border-top-color: var(--color-accent-gold); border-right-color: var(--color-accent-gold); }
    .crosshair-bl { bottom: -1px; left: -1px; border-bottom-color: var(--color-accent-gold); border-left-color: var(--color-accent-gold); }
    .crosshair-br { bottom: -1px; right: -1px; border-bottom-color: var(--color-accent-gold); border-right-color: var(--color-accent-gold); }

    .identity-tag {
      background-color: var(--color-accent-tactical); color: #000;
      font-weight: bold; font-size: 0.8rem; padding: 4px 12px;
      text-transform: uppercase; letter-spacing: 4px;
      transform: rotate(12deg); display: inline-block;
      box-shadow: 0 10px 20px rgba(255, 74, 0, 0.3);
      position: absolute; top: -15px; right: 20px;
    }

    h1 { font-family: 'Playfair Display', serif; font-size: 4rem; text-transform: uppercase; margin: 0 0 1rem 0; letter-spacing: -0.05em; font-weight: 300; }
    p { font-family: 'JetBrains Mono', monospace; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.1em; line-height: 1.6; font-size: 0.85rem; margin-bottom: 2rem; }
    
    .btn {
      display: inline-block;
      background: transparent; color: var(--color-accent-gold);
      border: 1px solid var(--color-accent-gold);
      font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
      letter-spacing: 4px; font-size: 0.75rem; padding: 16px 32px;
      transition: all 0.4s ease; text-decoration: none; cursor: pointer;
    }
    .btn:hover { background: var(--color-accent-gold); color: #000; box-shadow: 0 0 30px rgba(198, 184, 158, 0.3); }

    /* Text Scramble Setup */
    .scramble-text { display: inline-block; }
  </style>
</head>
<body>
  <div class="noise-overlay"></div>
  
  <!-- High-Resolution Luxury Asset URL -->
  <video class="bg-video" autoplay loop muted playsinline preload="metadata" poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop">
    <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-luxury-car-driving-through-the-city-at-night-41832-large.mp4" type="video/mp4">
  </video>

  <div class="sanctum-layout">
    <div class="glass-panel">
      <div class="crosshair crosshair-tl"></div>
      <div class="crosshair crosshair-tr"></div>
      <div class="crosshair crosshair-bl"></div>
      <div class="crosshair crosshair-br"></div>
      
      <div class="identity-tag">IDENTITY</div>
      
      <h1 class="scramble-text" data-scramble-duration="2000">{{ page.title | default: "THE SANCTUM" }}</h1>
      <p class="scramble-text" data-scramble-duration="3000" data-scramble-delay="500">
        {{ page.content | strip_html | default: "TACTICAL ESPIONAGE OPERATIONS.<br>AWAITING CLEARANCE. PROCEED WITH CAUTION." }}
      </p>
      
      <a href="/collections/all" class="btn">ACCESS ARCHIVES</a>
    </div>
  </div>

  <script>
    // Adaptive Loading: Only play video on fast connections
    document.addEventListener('DOMContentLoaded', () => {
      const video = document.querySelector('.bg-video');
      if (video && navigator.connection) {
        const conn = navigator.connection;
        if (conn.saveData || (conn.effectiveType && ['2g', '3g'].includes(conn.effectiveType))) {
          video.remove(); 
        }
      }
    });

    class SanctumScramble {
      constructor(el) {
        this.el = el;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+{}|[]<>';
        this.originalText = el.innerText;
        this.duration = parseInt(el.dataset.scrambleDuration) || 1500;
        this.delay = parseInt(el.dataset.scrambleDelay) || 0;
        this.triggerOnHover = el.dataset.scrambleHover === 'true';
        this.isAnimating = false;
        this.triggerCount = 0;

        this.init();
      }

      init() {
        setTimeout(() => this.startAnimation(), this.delay);
        if (this.triggerOnHover) {
          this.el.addEventListener('mouseenter', () => {
            if (!this.isAnimating) this.startAnimation();
          });
        }
      }

      startAnimation() {
        let startTime;
        this.triggerCount++;
        const currentTrigger = this.triggerCount;
        this.isAnimating = true;

        const animate = (timestamp) => {
          if (this.triggerCount !== currentTrigger) return;
          if (!startTime) startTime = timestamp;
          
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / this.duration, 1);
          const revealIndex = Math.floor(progress * this.originalText.length);

          let result = '';
          for (let i = 0; i < this.originalText.length; i++) {
            if (i < revealIndex) {
              result += this.originalText[i];
            } else if (this.originalText[i] === ' ') {
              result += ' ';
            } else {
              result += this.chars[Math.floor(Math.random() * this.chars.length)];
            }
          }

          this.el.innerText = result;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.el.innerText = this.originalText;
            this.isAnimating = false;
          }
        };

        requestAnimationFrame(animate);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.scramble-text').forEach(el => new SanctumScramble(el));
    });
  </script>
</body>
</html>`,
  },
  {
    id: "CANVAS_BG",
    name: "Ambient Matrix Canvas Background",
    filename: "Layout > theme.liquid (Matrix Canvas)",
    type: "HTML",
    size: "2.2 KB",
    description: "Generates high frequency tactical floating star constellations merging together as they hover dynamically on the client background.",
    code: `<!-- THE SANCTUM | AMBIENT MATRIX BACKGROUND -->
<!-- Add before closing </body> in theme.liquid -->
<canvas id="sanctum-ambient-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;opacity:0.6;mix-blend-mode:screen;"></canvas>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('sanctum-ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  const particleCount = 100;
  
  const tacticalColors = ['rgba(198, 184, 158, 0.4)', 'rgba(255, 74, 0, 0.3)', 'rgba(50, 50, 50, 0.5)'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      color: tacticalColors[Math.floor(Math.random() * tacticalColors.length)],
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5
    });
  }

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = \`rgba(198, 184, 158, \${0.1 - dist/1000})\`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  };
  loop();
});
</script>`,
  },
  {
    id: "MAGNETIC_EL",
    name: "Magnetic brutalist Button Scripts",
    filename: "Layout > theme.liquid (Magnetic)",
    type: "HTML",
    size: "895 Bytes",
    description: "Attaches subtle kinetic mass physics overlays dragging buttons towards mouse hover coordinates for sleek high quality feedback.",
    code: `<!-- THE SANCTUM | MAGNETIC BUTTONS -->
<!-- Add to theme.liquid before closing </body> -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  if (matchMedia('(pointer: coarse)').matches) return;
  
  const magneticEls = document.querySelectorAll('.magnetic, .btn, .button, a');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = \`translate(\${x * 0.2}px, \${y * 0.2}px)\`;
      el.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
  });
});
</script>`,
  },
  {
    id: "BOOT_SEQUENCE",
    name: "Liquid pre-Boot Sequence preloader",
    filename: "Layout > theme.liquid (Boot Loader)",
    type: "HTML",
    size: "1.9 KB",
    description: "Introductory command loader running memory alignment outputs and biometric authentication sequences upon first entry.",
    code: `<!-- THE SANCTUM | BOOT SEQUENCE -->
<!-- Place inside <body> right at the top in theme.liquid -->
<div id="sanctum-boot-sequence" style="position:fixed;inset:0;background:#020202;z-index:99999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ff4a00;font-family:monospace;overflow:hidden;transition:opacity 0.8s ease-out;">
  <div style="text-align:left;max-width:600px;width:90%;font-size:12px;line-height:1.5;opacity:0.8;word-wrap:break-word;">
    <div id="boot-log"></div>
    <div id="boot-cursor" style="display:inline-block;width:8px;height:14px;background:#ff4a00;animation:blink 1s infinite;vertical-align:middle;margin-top:-2px;"></div>
  </div>
</div>
<style>
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const bootLines = [
    "INITIALIZING SANCTUM PROTOCOL v1.0.0...",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING TACTICAL IDENTITY...",
    "LOADING ACQUISITION GRID...",
    "INJECTING THEME ASSETS [SUCCESS]",
    "ACCESS GRANTED."
  ];
  
  const bootLog = document.getElementById('boot-log');
  const bootScreen = document.getElementById('sanctum-boot-sequence');
  let currentLine = 0;
  
  if(sessionStorage.getItem('sanctumBooted')) {
    bootScreen.style.display = 'none';
    return;
  }
  
  const typeLine = () => {
    if (currentLine >= bootLines.length) {
      setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => bootScreen.style.display = 'none', 800);
        sessionStorage.setItem('sanctumBooted', 'true');
      }, 500);
      return;
    }
    
    const div = document.createElement('div');
    div.innerText = bootLines[currentLine];
    bootLog.appendChild(div);
    currentLine++;
    
    setTimeout(typeLine, Math.random() * 200 + 100);
  };
  
  setTimeout(typeLine, 300);
});
</script>`,
  },
  {
    id: "INSTRUCT_DOC",
    name: "classified Integration Protocol Guidelines",
    filename: "Guides > IntegrationProtocol.txt",
    type: "TEXT",
    size: "1.7 KB",
    description: "Detailed system instructions explaining exactly how to patch files inside Shopify theme directories.",
    code: `INTEGRATION PROTOCOL [SHOPIFY]

WARNING: ALWAYS DUPLICATE YOUR THEME BEFORE OVERRIDING CORE FILES.

[1] BASE_CSS
- Navigate: Online Store > Themes > [...] > Edit Code
- Locate: Assets > base.css (or theme.css)
- Action: Paste the base.css payload at the very bottom of the file.

[2] SETTINGS_SCHEMA (Simple Placement)
- Locate: Config > settings_schema.json
- Action: Scroll to the VERY TOP of the file. You will see an opening bracket \`[\`.
- Paste our Schema payload right after that first \`[\` bracket.
- IMPORTANT: Make sure to add a comma \`,\` immediately after the closing brace \`}\` of our payload, before the next section begins.

[3] SETTINGS_DATA (Simple Placement)
- Locate: Config > settings_data.json
- Action: Find the "current" object and replace the color and font values with the ones provided. DO NOT delete the whole file.

[4] INTERACTIVE SCRIPTS (CURSOR, SCRAMBLE, AMBIENT, MAGNETIC)
- Locate: Layout > theme.liquid
- Action: Scroll to the absolute bottom. Paste all 4 JS payloads immediately before the closing </body> tag.

[5] BOOT SEQUENCE (PRELOADER)
- Locate: Layout > theme.liquid
- Action: Find the opening <body> tag. Paste the Boot Sequence Liquid immediately after it.

[6] ACQUISITION GRID SECTION
- Navigate: Sections > Add a new section > select 'Liquid'
- Name it: "acquisition-grid"
- Action: Paste the entire Acquisition Grid payload. Go to your Theme Editor and add "Acquisition Grid" to any page!

[7] FULL LANDING PAGE
- Navigate: Templates > Add a new template > select 'page' > select 'Liquid'
- Name it 'the-sanctum' (creates page.the-sanctum.liquid).
- Action: YES, delete EVERY line of the default code generated by Shopify. The file should be completely empty. THEN, paste the entire "Landing Page (Liquid)" payload.`,
  },
];

interface ShopifyExportProps {
  onKeepPlaying?: boolean;
  onClose?: () => void;
  isInline?: boolean;
}

export default function ShopifyExport({ onClose, isInline }: ShopifyExportProps) {
  const [selectedItem, setSelectedItem] = useState<TemplateItem>(EXPORT_TEMPLATES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: TemplateItem) => {
    navigator.clipboard.writeText(item.code);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
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
      {!isInline && <div className="absolute inset-0 bg-[#060606] -z-10 mix-blend-multiply" />}

      {/* Header operations bar */}
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

            <div className="inline-flex items-center gap-3 border border-[#ff4a00]/30 bg-[#ff4a00]/5 px-4 py-1.5 opacity-80">
              <Terminal className="w-3.5 h-3.5 text-[#ff4a00]" />
              <span className="font-mono text-[8px] md:text-[10px] tracking-[4px] md:tracking-[5px] uppercase text-[#ff4a00]">
                <ScrambleText text="EXPORT CONSOLE [V1.0]" />
              </span>
            </div>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-widest text-[#c6b89e] font-light leading-none">
            <ScrambleText text="SHOPIFY EXPORTER" duration={1200} />
          </h2>
          <p className="font-mono text-[9px] md:text-[10px] tracking-[3px] md:tracking-[5px] text-[#ff4a00]/70 mt-3 md:mt-4 uppercase">
            "INTEGRITY LEVEL A1 / SYNCH ORDER ACTIVE"
          </p>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="flex flex-col lg:flex-row gap-12 pb-32 items-stretch min-h-[55vh]">
        
        {/* Left Column: Asset Selection Card items */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto max-h-[60vh] lg:max-h-none pr-2 custom-scrollbar">
          <div className="font-mono text-[9px] uppercase tracking-[4px] text-white/30 mb-2 px-1">
            Classified Payload List
          </div>
          {EXPORT_TEMPLATES.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedItem(item);
              }}
              className={`border p-5 text-left cursor-pointer transition-all duration-300 relative group focus:outline-none ${
                selectedItem.id === item.id
                  ? "bg-[#c6b89e]/10 border-[#c6b89e] shadow-[0_0_20px_rgba(198,184,158,0.1)]"
                  : "bg-black/30 border-white/10 hover:border-[#c6b89e]/40 hover:bg-black/50"
              }`}
            >
              {/* Highlight neon bar */}
              <div
                className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff4a00] transition-transform ${
                  selectedItem.id === item.id ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                } origin-top duration-300`}
              />

              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[8px] tracking-[2px] uppercase bg-white/5 border border-white/10 px-2 py-0.5 text-white/60">
                  {item.type}
                </span>
                <span className="font-mono text-[9px] text-white/30">{item.size}</span>
              </div>

              <h4 className="font-serif text-lg tracking-wider text-[#c6b89e] group-hover:text-white transition-colors">
                {item.name}
              </h4>
              <p className="font-mono text-[8.5px] text-white/40 tracking-wider truncate mb-1 mt-2">
                {item.filename}
              </p>
              <p className="text-[11px] text-white/60 font-sans font-extralight line-clamp-2 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Code block scroll viewer */}
        <div className="w-full lg:w-2/3 flex flex-col border border-white/10 bg-[#030303] select-text relative">
          
          {/* Virtual File Header Tabs */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 select-none">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#c6b89e] opacity-60" />
              <span className="font-mono text-[10px] tracking-widest text-white/80 uppercase">
                {selectedItem.filename}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => handleCopy(selectedItem)}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-[#c6b89e] text-black hover:bg-white text-[10px] font-mono tracking-[3px] uppercase flex items-center gap-3 transition-colors duration-350 cursor-pointer"
              >
                {copiedId === selectedItem.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Payload
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Actual Code View container */}
          <div className="p-8 flex-grow overflow-auto font-mono text-[11px] text-white/80 border-b border-white/10 max-h-[50vh] leading-relaxed custom-scrollbar whitespace-pre-wrap select-text selection:bg-[#ff4a00]/30 selection:text-white">
            {selectedItem.code}
          </div>

          {/* Bottom quick notes explanation overlay */}
          <div className="p-6 bg-[#020202] flex items-start gap-4 select-none">
            <Info className="w-5 h-5 text-[#ff4a00] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[3px] text-[#ff4a00] mb-2 font-bold">
                Integration Recommendation
              </div>
              <p className="text-[12px] font-sans font-extralight text-white/60 leading-relaxed text-left">
                {selectedItem.id === "INSTRUCT_DOC"
                  ? "Carefully audit the instruction set. Always create deep file backups of your Shopify Online store themes beforehand."
                  : `Ensure that you import the template elements safely inside Shopify's code editor. Paste this script directly inside high priority theme nodes, conforming with the ${selectedItem.filename} location.`}
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
export { EXPORT_TEMPLATES };
