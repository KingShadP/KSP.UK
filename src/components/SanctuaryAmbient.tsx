/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Wind, VolumeX, Volume2, Waves } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Tooltip from "./Tooltip";

export default function SanctuaryAmbient() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [windVolume, setWindVolume] = useState(0.4);
  const [echoVolume, setEchoVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const windGainNodeRef = useRef<GainNode | null>(null);
  const echoGainNodeRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  
  // Keep track of active nodes to stop them
  const windSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const echoIntervalRef = useRef<number | null>(null);

  // Initialize Web Audio graph
  const initSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // --- LAYER 1: PROCEDURAL AEGEAN WINDS ---
      // Generate 2 seconds of white noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const outputData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        outputData[i] = Math.random() * 2 - 1;
      }

      // Create Buffer source for looping wind noise
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filter Node (lowpass) for wind gust effects
      const lowpassFilter = ctx.createBiquadFilter();
      lowpassFilter.type = "lowpass";
      lowpassFilter.frequency.setValueAtTime(140, ctx.currentTime); // Low rumbling freq
      lowpassFilter.Q.setValueAtTime(2.0, ctx.currentTime);
      filterNodeRef.current = lowpassFilter;

      // Wind level gain
      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(windVolume * 0.15, ctx.currentTime); // keep it subtle
      windGainNodeRef.current = windGain;

      // Connect Wind layer
      noiseSource.connect(lowpassFilter);
      lowpassFilter.connect(windGain);
      windGain.connect(masterGain);
      noiseSource.start();
      windSourceRef.current = noiseSource;

      // --- LAYER 2: CHANNELS OF STONE REVERB ECHOES ---
      const echoGain = ctx.createGain();
      echoGain.gain.setValueAtTime(echoVolume * 0.2, ctx.currentTime);
      echoGainNodeRef.current = echoGain;
      echoGain.connect(masterGain);

      // Procedural Wind Cutoff Modulation loop (sweeping gusts)
      let lastFreq = 180;
      const modulateWind = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed" || !filterNodeRef.current) return;
        const targetFreq = 120 + Math.random() * 180 + (Math.sin(Date.now() / 3200) * 40);
        // Smoothly transition between frequencies to make it natural and breathy
        filterNodeRef.current.frequency.exponentialRampToValueAtTime(
          Math.max(40, targetFreq),
          audioCtxRef.current.currentTime + 3.0
        );
        setTimeout(modulateWind, 3000);
      };
      modulateWind();

      // Stone Echoes interval scheduler (distant marble clicks and hollow resonance)
      const scheduleEcho = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed" || !echoGainNodeRef.current) return;

        const ctxLocal = audioCtxRef.current;
        // Schedule dynamic low synth plucks playing cavern notes
        const osc = ctxLocal.createOscillator();
        const pluckGain = ctxLocal.createGain();
        
        // Cavern long echo delay
        const delay = ctxLocal.createDelay();
        const feedback = ctxLocal.createGain();

        // Dynamic pitch of distant cave hums (harmonic pentatonic matches luxury chords)
        const notes = [65.4, 73.4, 87.3, 98.0, 110.0, 130.8]; // Low C, D, F, G, A
        const pitch = notes[Math.floor(Math.random() * notes.length)];
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(pitch, ctxLocal.currentTime);

        // Slow soft volume envelope to emulate ancient cave resonance
        pluckGain.gain.setValueAtTime(0, ctxLocal.currentTime);
        pluckGain.gain.linearRampToValueAtTime(0.3, ctxLocal.currentTime + 1.2);
        pluckGain.gain.exponentialRampToValueAtTime(0.001, ctxLocal.currentTime + 6.0);

        // Echo feedback settings
        delay.delayTime.setValueAtTime(0.8 + Math.random() * 0.6, ctxLocal.currentTime); // long latency
        feedback.gain.setValueAtTime(0.45, ctxLocal.currentTime); // feedback volume

        // Hook up delay reverberation
        osc.connect(pluckGain);
        pluckGain.connect(echoGainNodeRef.current);
        
        // feedback loop routing
        pluckGain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(echoGainNodeRef.current);

        osc.start();
        osc.stop(ctxLocal.currentTime + 6.5);

        // Re-schedule with random spacious delay intervals (ancient stones are non-robotic)
        const nextTime = 7000 + Math.random() * 12000;
        echoIntervalRef.current = window.setTimeout(scheduleEcho, nextTime);
      };
      // Start after initial delay
      echoIntervalRef.current = window.setTimeout(scheduleEcho, 4000);

      setIsEnabled(true);
    } catch (e) {
      console.error("Web Audio procedural synthesis error:", e);
    }
  };

  const handleToggle = () => {
    if (!audioCtxRef.current) {
      initSynth();
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

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(nextMuted ? 0 : 1, audioCtxRef.current.currentTime);
    }
  };

  // Sync sliders onto Web Audio gains
  useEffect(() => {
    if (windGainNodeRef.current && audioCtxRef.current) {
      windGainNodeRef.current.gain.linearRampToValueAtTime(
        windVolume * 0.15,
        audioCtxRef.current.currentTime + 0.2
      );
    }
  }, [windVolume]);

  useEffect(() => {
    if (echoGainNodeRef.current && audioCtxRef.current) {
      echoGainNodeRef.current.gain.linearRampToValueAtTime(
        echoVolume * 0.2,
        audioCtxRef.current.currentTime + 0.2
      );
    }
  }, [echoVolume]);

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      if (echoIntervalRef.current) {
        clearTimeout(echoIntervalRef.current);
      }
      if (windSourceRef.current) {
        try {
          windSourceRef.current.stop();
        } catch(e) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 p-4 border border-[#c6b89e]/20 bg-black/80 backdrop-blur-3xl rounded-sm shadow-2xl relative select-none">
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#c6b89e]" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Wind className={`w-4 h-4 ${isEnabled && !isMuted ? "text-[#c6b89e] animate-pulse" : "text-white/30"}`} />
          <span className="font-mono text-[8px] md:text-[9.5px] uppercase tracking-[3px] text-white/50">
            SANCTUM AEGEAN WINDSCAPE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <Tooltip message="SYS_DIAG: Toggle Aegean environmental mute states">
            <button
              onClick={handleMuteToggle}
              aria-label="Toggle environment sound mute"
              className="p-1 px-1.5 border border-white/10 hover:border-[#c6b89e]/60 hover:text-[#c6b89e] text-white/40 transition-colors text-[8px] font-mono tracking-widest cursor-pointer focus:outline-none"
            >
              {isMuted ? "UNMUTE" : "MUTE"}
            </button>
          </Tooltip>

          {/* Master power */}
          <Tooltip message="SYS_DIAG: Initialize real-time procedural Web Audio landscape">
            <button
              onClick={handleToggle}
              aria-label="Activate local acoustic synthesis"
              className={`p-1 px-2 border font-mono text-[8.5px] tracking-widest transition-all cursor-pointer focus:outline-none ${
                isEnabled && !isMuted
                  ? "bg-[#c6b89e]/15 border-[#c6b89e] text-[#c6b89e]"
                  : "bg-black border-white/10 text-white/50 hover:border-white/30"
              }`}
            >
              {isEnabled && !isMuted ? "ACTIVE" : "STANDBY"}
            </button>
          </Tooltip>
        </div>
      </div>

      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 pt-2 border-t border-white/5 select-text"
        >
          {/* Wind controller slider */}
          <div className="flex items-center justify-between gap-3 font-mono text-[7.5px] text-white/40 tracking-wider">
            <span className="w-20 uppercase">Aegean Winds:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={windVolume}
              onChange={(e) => setWindVolume(parseFloat(e.target.value))}
              className="flex-1 accent-[#c6b89e] bg-white/15 h-[2px] rounded-full cursor-pointer hover:accent-[#ff4a00] transition-colors"
            />
            <span className="w-8 text-right font-bold text-white/70">
              {Math.round(windVolume * 100)}%
            </span>
          </div>

          {/* Stone echo controller slider */}
          <div className="flex items-center justify-between gap-3 font-mono text-[7.5px] text-white/40 tracking-wider">
            <span className="w-20 uppercase">Stone Delay:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={echoVolume}
              onChange={(e) => setEchoVolume(parseFloat(e.target.value))}
              className="flex-1 accent-[#c6b89e] bg-white/15 h-[2px] rounded-full cursor-pointer hover:accent-[#ff4a00] transition-colors"
            />
            <span className="w-8 text-right font-bold text-white/70">
              {Math.round(echoVolume * 100)}%
            </span>
          </div>

          <div className="text-[7px] text-white/30 font-mono tracking-widest text-right select-none leading-relaxed">
            [ PROCEDURAL SYNTHESIS v1.0 ]
          </div>
        </motion.div>
      )}
    </div>
  );
}
