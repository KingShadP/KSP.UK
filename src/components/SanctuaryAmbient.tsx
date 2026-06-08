/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Wind, VolumeX, Volume2, Waves, Radio, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Tooltip from "./Tooltip";

export type AmbientTheme = "windscape" | "static" | "waves" | "hum";

interface ThemeDefinition {
  id: AmbientTheme;
  name: string;
  label: string;
  desc: string;
  icon: any;
  primarySliderLabel: string;
  detailSliderLabel: string;
}

const THEMES: ThemeDefinition[] = [
  {
    id: "windscape",
    name: "Aegean Winds",
    label: "AEGEAN WINDSCAPE",
    desc: "Subtle procedural gusts modeled on isolated Greek cliffs and deep cavern resonance.",
    icon: Wind,
    primarySliderLabel: "Winds level",
    detailSliderLabel: "Cavern echoes"
  },
  {
    id: "static",
    name: "Static Radio",
    label: "STATIC COOLDOWN",
    desc: "Analog interstellar signal wash, warm crackle grains, and cosmic thermal background.",
    icon: Radio,
    primarySliderLabel: "Interference",
    detailSliderLabel: "Crackle grain"
  },
  {
    id: "waves",
    name: "Beach Waves",
    label: "BEACH SHORELINE",
    desc: "Deep maritime wash modulated by systemic wave tide cycles and sweeping low cutoff.",
    icon: Waves,
    primarySliderLabel: "Wave swell",
    detailSliderLabel: "Foam spray"
  },
  {
    id: "hum",
    name: "Analog Hum",
    label: "TRANSFORMER HUMMING",
    desc: "Deep 60Hz transformer power line vibration, vintage pre-amp glow, and tape friction hiss.",
    icon: Activity,
    primarySliderLabel: "Grid volume",
    detailSliderLabel: "Tube warmth"
  }
];

export default function SanctuaryAmbient() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeTheme, setActiveTheme] = useState<AmbientTheme>("windscape");
  const [primaryVolume, setPrimaryVolume] = useState(0.4);
  const [detailVolume, setDetailVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Audio node references to manipulate in real-time
  const masterGainRef = useRef<GainNode | null>(null);
  const primaryGainRef = useRef<GainNode | null>(null);
  const detailGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Buffer sources and oscillators to enable cleanup
  const activeSourcesRef = useRef<any[]>([]);
  const intervalsRef = useRef<number[]>([]);

  // Safely stop all active audio nodes and reset states
  const stopSynth = () => {
    // Clear scheduled timers
    intervalsRef.current.forEach((id) => clearInterval(id));
    intervalsRef.current = [];

    // Stop and disconnect active source nodes
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Already stopped or disconnected
      }
    });
    activeSourcesRef.current = [];

    // Reset gain references
    primaryGainRef.current = null;
    detailGainRef.current = null;
    filterNodeRef.current = null;

    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // Build Web Audio graph based on selected theme
  const startSynth = (themeId: AmbientTheme) => {
    stopSynth();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Primary Gain Node
      const pGain = ctx.createGain();
      pGain.gain.setValueAtTime(primaryVolume, ctx.currentTime);
      pGain.connect(masterGain);
      primaryGainRef.current = pGain;

      // Detail Gain Node
      const dGain = ctx.createGain();
      dGain.gain.setValueAtTime(detailVolume, ctx.currentTime);
      dGain.connect(masterGain);
      detailGainRef.current = dGain;

      // Create high-quality White Noise Buffer common to several nodes
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const outputData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        outputData[i] = Math.random() * 2 - 1;
      }

      if (themeId === "windscape") {
        // --- 1. PROCEDURAL AEGEAN WINDS ---
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const lowpassFilter = ctx.createBiquadFilter();
        lowpassFilter.type = "lowpass";
        lowpassFilter.frequency.setValueAtTime(140, ctx.currentTime);
        lowpassFilter.Q.setValueAtTime(2.0, ctx.currentTime);
        filterNodeRef.current = lowpassFilter;

        noiseSource.connect(lowpassFilter);
        lowpassFilter.connect(pGain);
        noiseSource.start();
        activeSourcesRef.current.push(noiseSource);

        // Sweeping Wind Gusts Modulation
        const modulateWinds = () => {
          if (!audioCtxRef.current || !filterNodeRef.current) return;
          const targetFreq = 120 + Math.random() * 180 + Math.sin(Date.now() / 3200) * 40;
          try {
            filterNodeRef.current.frequency.exponentialRampToValueAtTime(
              Math.max(40, targetFreq),
              audioCtxRef.current.currentTime + 3.0
            );
          } catch (e) {}
        };
        modulateWinds();
        const windInterval = window.setInterval(modulateWinds, 3000);
        intervalsRef.current.push(windInterval);

        // --- 2. STONE CAVERN REVERB ECHOES ---
        const triggerCaveEcho = () => {
          if (!audioCtxRef.current || !detailGainRef.current) return;
          try {
            const osc = ctx.createOscillator();
            const pluckGain = ctx.createGain();
            const delay = ctx.createDelay();
            const feedback = ctx.createGain();

            const notes = [65.4, 73.4, 87.3, 98.0, 110.0, 130.8]; // Harmonic low tones
            const pitch = notes[Math.floor(Math.random() * notes.length)];

            osc.type = "sine";
            osc.frequency.setValueAtTime(pitch, ctx.currentTime);

            pluckGain.gain.setValueAtTime(0, ctx.currentTime);
            pluckGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.8);
            pluckGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.0);

            delay.delayTime.setValueAtTime(0.8 + Math.random() * 0.4, ctx.currentTime);
            feedback.gain.setValueAtTime(0.4, ctx.currentTime);

            osc.connect(pluckGain);
            pluckGain.connect(dGain);

            pluckGain.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(dGain);

            osc.start();
            osc.stop(ctx.currentTime + 5.5);
          } catch (err) {}
        };
        const echoInterval = window.setInterval(triggerCaveEcho, 8000);
        intervalsRef.current.push(echoInterval);

      } else if (themeId === "static") {
        // --- 1. PROCEDURAL BANDPASS STATIC ---
        const staticSource = ctx.createBufferSource();
        staticSource.buffer = noiseBuffer;
        staticSource.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.setValueAtTime(950, ctx.currentTime);
        bandpass.Q.setValueAtTime(1.2, ctx.currentTime);

        staticSource.connect(bandpass);
        bandpass.connect(pGain);
        staticSource.start();
        activeSourcesRef.current.push(staticSource);

        // Low grounding 60Hz hum line in static
        const humOsc = ctx.createOscillator();
        humOsc.type = "sine";
        humOsc.frequency.setValueAtTime(60, ctx.currentTime);
        const humGain = ctx.createGain();
        humGain.gain.setValueAtTime(0.12, ctx.currentTime);
        humOsc.connect(humGain);
        humGain.connect(pGain);
        humOsc.start();
        activeSourcesRef.current.push(humOsc);

        // --- 2. RANDOM CRACKLE GRAINS ---
        const triggerCrackle = () => {
          if (!audioCtxRef.current || !detailGainRef.current) return;
          try {
            const crackleDuration = 0.005 + Math.random() * 0.015;
            const singleBuffer = ctx.createBuffer(1, ctx.sampleRate * crackleDuration, ctx.sampleRate);
            const chanData = singleBuffer.getChannelData(0);
            for (let i = 0; i < chanData.length; i++) {
              chanData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / chanData.length, 2);
            }
            const grainNode = ctx.createBufferSource();
            grainNode.buffer = singleBuffer;
            
            const bandNode = ctx.createBiquadFilter();
            bandNode.type = "highpass";
            bandNode.frequency.setValueAtTime(5000 + Math.random() * 4000, ctx.currentTime);

            const grainGain = ctx.createGain();
            grainGain.gain.setValueAtTime(0.35 + Math.random() * 0.5, ctx.currentTime);

            grainNode.connect(bandNode);
            bandNode.connect(grainGain);
            grainGain.connect(dGain);

            grainNode.start();
          } catch (e) {}
        };
        const crackleInterval = window.setInterval(triggerCrackle, 400);
        intervalsRef.current.push(crackleInterval);

      } else if (themeId === "waves") {
        // --- 1. OCEAN WAVE TIDES modulated dynamically by LFO ---
        const waveSource = ctx.createBufferSource();
        waveSource.buffer = noiseBuffer;
        waveSource.loop = true;

        const waveFilter = ctx.createBiquadFilter();
        waveFilter.type = "lowpass";
        waveFilter.frequency.setValueAtTime(260, ctx.currentTime);
        waveFilter.Q.setValueAtTime(1.0, ctx.currentTime);

        // Modulate Wave Volume & Filter frequency using LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Wave period: 12.5 seconds
        lfo.type = "sine";

        const lfoGainNode = ctx.createGain();
        lfoGainNode.gain.setValueAtTime(0.18, ctx.currentTime); // modulating slider gain

        const lfoFilterNode = ctx.createGain();
        lfoFilterNode.gain.setValueAtTime(140, ctx.currentTime); // modulating cutoff frequency

        waveSource.connect(waveFilter);
        waveFilter.connect(pGain);

        // Connect the LFO to modulate filters/volumes
        lfo.connect(lfoFilterNode);
        lfoFilterNode.connect(waveFilter.frequency);
        lfo.connect(lfoGainNode);
        lfoGainNode.connect(pGain.gain);

        waveSource.start();
        lfo.start();

        activeSourcesRef.current.push(waveSource);
        activeSourcesRef.current.push(lfo);

        // --- 2. BEACH FOAM AND SPRAY (High-frequency, sizzling waves wash) ---
        const foamSource = ctx.createBufferSource();
        foamSource.buffer = noiseBuffer;
        foamSource.loop = true;

        const foamFilter = ctx.createBiquadFilter();
        foamFilter.type = "bandpass";
        foamFilter.frequency.setValueAtTime(4500, ctx.currentTime);
        foamFilter.Q.setValueAtTime(0.7, ctx.currentTime);

        const foamVolumeLfoGain = ctx.createGain();
        foamVolumeLfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

        foamSource.connect(foamFilter);
        foamFilter.connect(dGain);

        // Wave spray matches wave swells but phase shifted or slightly behind
        lfo.connect(foamVolumeLfoGain);
        foamVolumeLfoGain.connect(dGain.gain);

        foamSource.start();
        activeSourcesRef.current.push(foamSource);

      } else if (themeId === "hum") {
        // --- 1. PROCEDURAL SUB-FREQUENCY POWER HUM ---
        const hum60 = ctx.createOscillator();
        hum60.type = "sine";
        hum60.frequency.setValueAtTime(60, ctx.currentTime);

        const hum120 = ctx.createOscillator();
        hum120.type = "triangle";
        hum120.frequency.setValueAtTime(120, ctx.currentTime);

        const hum180 = ctx.createOscillator();
        hum180.type = "triangle";
        hum180.frequency.setValueAtTime(180, ctx.currentTime);

        const filter60 = ctx.createBiquadFilter();
        filter60.type = "lowpass";
        filter60.frequency.setValueAtTime(120, ctx.currentTime);

        const mixGain = ctx.createGain();
        const subGain = ctx.createGain();
        const harmGain1 = ctx.createGain();
        const harmGain2 = ctx.createGain();

        subGain.gain.setValueAtTime(0.8, ctx.currentTime);
        harmGain1.gain.setValueAtTime(0.18, ctx.currentTime);
        harmGain2.gain.setValueAtTime(0.08, ctx.currentTime);

        hum60.connect(subGain);
        hum120.connect(harmGain1);
        hum180.connect(harmGain2);

        subGain.connect(mixGain);
        harmGain1.connect(mixGain);
        harmGain2.connect(mixGain);

        mixGain.connect(filter60);
        filter60.connect(pGain);

        hum60.start();
        hum120.start();
        hum180.start();

        activeSourcesRef.current.push(hum60);
        activeSourcesRef.current.push(hum120);
        activeSourcesRef.current.push(hum180);

        // --- 2. ANALOG PRE-AMP TISS HISS & GLOW ---
        const hissSource = ctx.createBufferSource();
        hissSource.buffer = noiseBuffer;
        hissSource.loop = true;

        const hissFilter = ctx.createBiquadFilter();
        hissFilter.type = "highpass";
        hissFilter.frequency.setValueAtTime(7000, ctx.currentTime);

        const hissGain = ctx.createGain();
        hissGain.gain.setValueAtTime(0.04, ctx.currentTime); // low level persistent hiss

        hissSource.connect(hissFilter);
        hissFilter.connect(hissGain);
        hissGain.connect(dGain);

        hissSource.start();
        activeSourcesRef.current.push(hissSource);

        // Modulate tape pressure micro-deviations
        const triggerTapeFlicker = () => {
          if (!audioCtxRef.current || !dGain) return;
          try {
            const flickerVol = 0.03 + Math.random() * 0.05;
            dGain.gain.linearRampToValueAtTime(flickerVol, ctx.currentTime + 0.15);
          } catch (e) {}
        };
        const tapeInterval = window.setInterval(triggerTapeFlicker, 250);
        intervalsRef.current.push(tapeInterval);
      }

      setIsEnabled(true);
      
      // Dispatch telemetry feedback
      window.dispatchEvent(
        new CustomEvent("telemetry-log", {
          detail: {
            message: `AMBIENT_PROC: Fused procedure pipeline for '${themeId.toUpperCase()}' successfully.`,
            type: "SYSTEM"
          }
        })
      );
    } catch (e) {
      console.error("Web Audio procedural synthesis error:", e);
    }
  };

  const handleToggle = () => {
    if (!audioCtxRef.current) {
      startSynth(activeTheme);
    } else {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
        setIsEnabled(true);
      } else if (isEnabled) {
        audioCtxRef.current.suspend();
        setIsEnabled(false);
      } else {
        audioCtxRef.current.resume();
        setIsEnabled(true);
      }
    }
  };

  const handleThemeChange = (themeId: AmbientTheme) => {
    setActiveTheme(themeId);
    if (audioCtxRef.current || isEnabled) {
      startSynth(themeId);
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(nextMuted ? 0 : 1, audioCtxRef.current.currentTime);
    }
  };

  // Sync sliders onto Web Audio node parameters
  useEffect(() => {
    if (primaryGainRef.current && audioCtxRef.current) {
      primaryGainRef.current.gain.linearRampToValueAtTime(
        primaryVolume,
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [primaryVolume]);

  useEffect(() => {
    if (detailGainRef.current && audioCtxRef.current) {
      detailGainRef.current.gain.linearRampToValueAtTime(
        detailVolume,
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [detailVolume]);

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  const currentDef = THEMES.find((t) => t.id === activeTheme) || THEMES[0];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 border border-[#c6b89e]/20 bg-black/85 backdrop-blur-3xl rounded-none shadow-2xl relative select-none text-left">
      <div className="absolute top-0 left-0 w-32 h-[1.5px] bg-[#ff4a00]" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff4a00] animate-ping" />
            <span className="font-mono text-[9px] uppercase tracking-[4px] text-white/50">
              AUDIO ENVIRONMENT / COGNITIVE SOUNDSCAPES
            </span>
          </div>
          <h3 className="font-serif text-2xl text-white tracking-wide uppercase">
            Sanctuary Ambient Synth
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Mute toggle */}
          <Tooltip message="Toggle audio environmental output">
            <button
              onClick={handleMuteToggle}
              className="px-4 py-2 border border-white/15 hover:border-[#c6b89e] text-white/50 hover:text-white transition-all text-[9px] font-mono tracking-[2px] uppercase cursor-pointer focus:outline-none"
            >
              {isMuted ? "UNMUTE OUTPUT" : "MUTE SCAPE"}
            </button>
          </Tooltip>

          {/* Master power */}
          <Tooltip message="Initialize procedural Web Audio synthesizer pipeline">
            <button
              onClick={handleToggle}
              className={`px-5 py-2 border font-mono text-[9px] tracking-[2px] uppercase transition-all cursor-pointer focus:outline-none ${
                isEnabled && !isMuted
                  ? "bg-[#ff4a00]/10 border-[#ff4a00] text-[#ff4a00] hover:bg-[#ff4a00]/20"
                  : "bg-black border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              {isEnabled && !isMuted ? "SYNTH RUNNING" : "SYNTH STANDBY"}
            </button>
          </Tooltip>
        </div>
      </div>

      <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light">
        Avarice procedural audio synthesis builds real-time, non-periodic acoustic waves in your local processor. Select an acoustic node matrix to shield your ambient workspace coordinates.
      </p>

      {/* --- SELECTABLE THEME BUTTONS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        {THEMES.map((theme) => {
          const isSelected = activeTheme === theme.id;
          const Icon = theme.icon;
          return (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`p-4 border transition-all cursor-pointer text-left flex flex-col justify-between min-h-[110px] focus:outline-none ${
                isSelected
                  ? "border-[#c6b89e] bg-[#c6b89e]/10 shadow-[0_0_15px_rgba(198,184,158,0.1)]"
                  : "border-white/5 bg-black/40 hover:border-white/15"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#c6b89e]" : "text-white/30"}`} />
                <span className="font-mono text-[8px] text-white/20 tracking-[1px]">MODE L{theme.id === "windscape" ? "1" : theme.id === "static" ? "2" : theme.id === "waves" ? "3" : "4"}</span>
              </div>
              <div>
                <div className={`font-mono text-[9px] tracking-[2px] uppercase ${isSelected ? "text-[#c6b89e]" : "text-white/60"}`}>
                  {theme.name}
                </div>
                <div className="text-[10px] text-white/30 font-light mt-1 font-sans line-clamp-1">{theme.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-4 pt-5 pb-2 border-t border-white/5"
        >
          <div className="text-[9px] font-mono text-[#c6b89e]/80 uppercase tracking-[2px] mb-2 select-text">
            // PARAMETERS RETICULE // ACTIVE SOURCE: {currentDef.name.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
            {/* Primary Volume slider */}
            <div className="flex flex-col gap-1.5 font-mono text-[8px] text-white/40 tracking-wider">
              <span className="uppercase">{currentDef.primarySliderLabel}:</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={primaryVolume}
                  onChange={(e) => setPrimaryVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-[#c6b89e] bg-white/10 h-[2px] cursor-pointer hover:accent-[#ff4a00] transition-colors"
                />
                <span className="w-10 text-right font-bold text-white/70">
                  {Math.round(primaryVolume * 100)}%
                </span>
              </div>
            </div>

            {/* Detail Volume slider */}
            <div className="flex flex-col gap-1.5 font-mono text-[8px] text-white/40 tracking-wider">
              <span className="uppercase">{currentDef.detailSliderLabel}:</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={detailVolume}
                  onChange={(e) => setDetailVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-[#c6b89e] bg-white/10 h-[2px] cursor-pointer hover:accent-[#ff4a00] transition-colors"
                />
                <span className="w-10 text-right font-bold text-white/70">
                  {Math.round(detailVolume * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[7.5px] text-white/20 font-mono tracking-widest pt-2">
            <span>[ SYSTEM: EMPIRE_AMBIENCE NODE ]</span>
            <span>PROH_RATIO: 48000HZ BUFFER OUT</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
