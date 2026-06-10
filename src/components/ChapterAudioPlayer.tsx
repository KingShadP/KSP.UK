/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Sliders, 
  Compass, 
  TrendingUp, 
  Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChapterAudioPlayerProps {
  title: string;
  narrativeText: string;
  chapterNum: string;
  themeColor?: string; // e.g. "#c6b89e" or "#ff4a00"
  globalAudioEnabled?: boolean;
}

export default function ChapterAudioPlayer({
  title,
  narrativeText,
  chapterNum,
  themeColor = "#c6b89e",
  globalAudioEnabled = true
}: ChapterAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.85); // Elegant slow reading by default
  const [voiceGender, setVoiceGender] = useState<"sovereign" | "sanctuary">("sovereign");
  const [audioProgress, setAudioProgress] = useState(0);
  const [durationEstimate, setDurationEstimate] = useState(0);
  
  // Audio synthesis references
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOsc1Ref = useRef<OscillatorNode | null>(null);
  const droneOsc2Ref = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  // Spectral bar simulation state
  const [spectrumBars, setSpectrumBars] = useState<number[]>(Array(16).fill(10));
  const animFrameRef = useRef<number | null>(null);

  // Stop active speech/drone if global ambient status turns false
  useEffect(() => {
    if (!globalAudioEnabled) {
      stopAllAudio();
    }
  }, [globalAudioEnabled]);

  // Initialize Speech Synthesis & estimate duration based on words count
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      // Estimate duration: average 130 words per minute at 1x speed
      const wordCount = narrativeText.split(/\s+/).length;
      const baseMinutes = wordCount / 130;
      const baseSeconds = baseMinutes * 60;
      setDurationEstimate(Math.round(baseSeconds / playbackRate));
    }

    return () => {
      stopAllAudio();
    };
  }, [narrativeText, playbackRate]);

  // Audio spectrum visualizer animation loop
  useEffect(() => {
    let lastTime = 0;
    const updateSpectrum = (time: number) => {
      if (isPlaying) {
        // Generate high-end aesthetic waveforms
        const nextBars = spectrumBars.map((_, i) => {
          const wave1 = Math.sin((time * 0.003) + i * 0.5);
          const wave2 = Math.cos((time * 0.007) - i * 0.2);
          const voiceMod = Math.random() * 0.4 + 0.6; // speak vibration
          const intensity = Math.abs(wave1 * 0.6 + wave2 * 0.4) * 85 * voiceMod;
          return Math.max(12, Math.min(100, intensity));
        });
        setSpectrumBars(nextBars);
        // Slowly update mock progress bar
        setAudioProgress(prev => {
          if (prev >= 100) {
            stopAllAudio();
            return 0;
          }
          return prev + (0.08 * playbackRate);
        });
      } else {
        // Slow standby pulse
        const nextBars = spectrumBars.map((val, i) => {
          const standby = Math.max(6, 12 + Math.sin(time * 0.001 + i * 0.8) * 8);
          // Interpolate to standby state smoothly
          return val - (val - standby) * 0.1;
        });
        setSpectrumBars(nextBars);
      }
      animFrameRef.current = requestAnimationFrame(updateSpectrum);
    };

    animFrameRef.current = requestAnimationFrame(updateSpectrum);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackRate]);

  // Handle synthesized backing drone oscillator using Web Audio API
  const startAmbientDrone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create primary volume controller
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.06, ctx.currentTime + 1.5); // Warm, subtle volume cap
      droneGainRef.current = masterGain;

      // Filter to keep only warm, heavy sub frequencies
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      // Low Base drone: 55Hz (A1 frequency)
      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      // Warm Fifth drone: 82.4Hz (E2 frequency)
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(82.41, ctx.currentTime);

      // Connect modules
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Start frequencies
      osc1.start();
      osc2.start();

      droneOsc1Ref.current = osc1;
      droneOsc2Ref.current = osc2;
    } catch (e) {
      console.warn("Ambient Audio Context generation is limited by browser policy:", e);
    }
  };

  const stopAmbientDrone = () => {
    if (droneGainRef.current && audioCtxRef.current) {
      try {
        const curTime = audioCtxRef.current.currentTime;
        droneGainRef.current.gain.linearRampToValueAtTime(0, curTime + 0.5);
        setTimeout(() => {
          droneOsc1Ref.current?.stop();
          droneOsc2Ref.current?.stop();
          droneOsc1Ref.current = null;
          droneOsc2Ref.current = null;
          droneGainRef.current = null;
        }, 600);
      } catch (err) {
        // Already stopped or offline
      }
    }
  };

  // Toggle Mute State
  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    
    // Mute speech synthesis if browser supports it
    if (synthRef.current) {
      if (newVal) {
        synthRef.current.pause();
      } else if (isPlaying) {
        synthRef.current.resume();
      }
    }

    // Mute synthesized background atmosphere
    if (droneGainRef.current && audioCtxRef.current) {
      droneGainRef.current.gain.linearRampToValueAtTime(
        newVal ? 0 : 0.06,
        audioCtxRef.current.currentTime + 0.3
      );
    }
  };

  // Dispatch fully unified play states
  const playVoiceOver = () => {
    if (!synthRef.current) return;

    // Dispatch system events
    window.dispatchEvent(
      new CustomEvent("telemetry-log", {
        detail: { 
          message: `🎙️ [VOCAL_UP_TRANSCRIPTION] Decrypting oral telemetry narrative archives for CH_0${chapterNum}...`, 
          type: "SYSTEM" 
        }
      })
    );

    // Cancel active sequences
    synthRef.current.cancel();

    // Setup speech parameters
    const utterance = new SpeechSynthesisUtterance(narrativeText);
    utteranceRef.current = utterance;

    // Premium fine-grained narration tuning
    utterance.rate = playbackRate;
    utterance.pitch = voiceGender === "sovereign" ? 0.65 : 0.95; // sovereign: heavy and slow; sanctuary: crisp guidance AI
    utterance.volume = isMuted ? 0 : 0.95;

    // Find custom deep high-premium English/Germanic voices if available
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;
    
    if (voiceGender === "sovereign") {
      // Find premium male or lower pitch base english voice
      selectedVoice = voices.find(v => v.lang.startsWith("en-GB") && v.name.includes("Male")) ||
                      voices.find(v => v.name.includes("Google US English")) ||
                      voices.find(v => v.lang.startsWith("en"));
    } else {
      // High clean female
      selectedVoice = voices.find(v => v.lang.startsWith("en-GB") && v.name.includes("Female")) ||
                      voices.find(v => v.lang.startsWith("en-US") && v.name.includes("Zira")) ||
                      voices.find(v => v.lang.startsWith("en"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      stopAmbientDrone();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      stopAmbientDrone();
    };

    // Speak
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    startAmbientDrone();
  };

  const pauseVoiceOver = () => {
    if (synthRef.current) {
      synthRef.current.pause();
    }
    setIsPlaying(false);
    stopAmbientDrone();
  };

  const resumeVoiceOver = () => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
      startAmbientDrone();
    } else {
      playVoiceOver();
    }
  };

  const stopAllAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    stopAmbientDrone();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseVoiceOver();
    } else {
      resumeVoiceOver();
    }
  };

  const restartAudio = () => {
    setAudioProgress(0);
    playVoiceOver();
  };

  return (
    <div className="w-full bg-black/60 border border-white/5 p-4 rounded-sm relative overflow-hidden select-none">
      {/* Absolute gold highlight line showing active visual telemetry */}
      <div 
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff4a00]/80 to-transparent transition-all duration-300"
        style={{ width: `${audioProgress}%` }}
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Left Side: Chapter & Interactive Spectral Visualizer */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          {/* Neon spinning interface badge */}
          <div className="relative">
            <div className={`w-10 h-10 border flex items-center justify-center transition-all duration-700 ${
              isPlaying ? "border-[#ff4a00] bg-[#ff4a00]/5 rotate-45" : "border-white/10 bg-white/[0.02]"
            }`}>
              <Radio className={`w-4 h-4 text-white/60 ${isPlaying ? "text-[#ff4a00] animate-pulse" : ""}`} />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4a00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4a00]"></span>
              </span>
            )}
          </div>

          <div className="text-left space-y-1">
            <span className="font-mono text-[7px] text-[#ff4a00] uppercase tracking-[2px] block">
              CH_0{chapterNum} VOCAL DECODER // ATELIER
            </span>
            <h5 className="font-serif text-sm text-white uppercase tracking-wide">
              {title}
            </h5>
            <div className="flex gap-1 items-end h-4 min-w-[124px]">
              {spectrumBars.map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] bg-white transition-all duration-75"
                  style={{
                    height: `${h}%`,
                    opacity: isPlaying ? 0.35 + (i * 0.03) : 0.08,
                    backgroundColor: isPlaying ? themeColor : "#ffffff",
                    boxShadow: isPlaying ? `0 0 6px ${themeColor}40` : "none"
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle Controls Block */}
        <div className="flex items-center gap-3 justify-center w-full md:w-auto">
          
          {/* Mute toggle button */}
          <button
            onClick={toggleMute}
            disabled={!globalAudioEnabled}
            className={`p-2 border transition-all rounded-sm ${
              !globalAudioEnabled
                ? "border-white/5 text-white/10 cursor-not-allowed"
                : isMuted 
                  ? "border-red-900/30 text-red-400 bg-red-950/20 cursor-pointer" 
                  : "border-white/5 text-white/50 hover:text-white hover:border-[#c6b89e]/30 cursor-pointer"
            }`}
            title={!globalAudioEnabled ? "Global audio is offline" : (isMuted ? "Unmute Voice" : "Mute Voice")}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Reverse reload track */}
          <button
            onClick={restartAudio}
            disabled={!globalAudioEnabled}
            className={`p-2 border transition-all rounded-sm ${
              !globalAudioEnabled
                ? "border-white/5 text-white/10 cursor-not-allowed"
                : "border-white/5 text-white/50 hover:text-white hover:border-[#c6b89e]/30 cursor-pointer"
            }`}
            title={!globalAudioEnabled ? "Global audio is offline" : "Restart Chronicle"}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            disabled={!globalAudioEnabled}
            className={`px-4 py-2 border transition-all duration-300 font-mono text-[9px] tracking-[2px] uppercase flex items-center gap-2 rounded-sm ${
              !globalAudioEnabled
                ? "border-white/5 text-white/20 bg-transparent cursor-not-allowed"
                : isPlaying 
                  ? "border-[#ff4a00] text-white bg-[#ff4a00]/10 shadow-[0_0_15px_rgba(255,74,0,0.15)] cursor-pointer" 
                  : "border-[#c6b89e] text-[#c6b89e] hover:bg-[#c6b89e]/10 cursor-pointer"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-[#ff4a00] stroke-[#ff4a00]" />
                PAUSE_NARRATIVE
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-[#c6b89e] stroke-[#c6b89e]" />
                {globalAudioEnabled ? "PLAY_NARRATIVE" : "MUTED_GLOBALLY"}
              </>
            )}
          </button>

        </div>

        {/* Right Side: Options and Specs Tuning */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0">
          
          {/* Synthesis Profile Selector */}
          <div className="flex flex-col items-start gap-1">
            <span className="font-mono text-[7px] text-white/30 uppercase tracking-[1px]">PROFILE SPEAKER</span>
            <div className="flex gap-1">
              <button
                onClick={() => { if (!globalAudioEnabled) return; setVoiceGender("sovereign"); if (isPlaying) playVoiceOver(); }}
                disabled={!globalAudioEnabled}
                className={`px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[1px] border rounded-sm transition-all ${
                  !globalAudioEnabled
                    ? "border-transparent text-white/10 cursor-not-allowed"
                    : voiceGender === "sovereign" 
                      ? "border-[#c6b89e] text-white bg-white/[0.04] cursor-pointer" 
                      : "border-transparent text-white/30 hover:text-white/50 cursor-pointer"
                }`}
              >
                SOVEREIGN AI
              </button>
              <button
                onClick={() => { if (!globalAudioEnabled) return; setVoiceGender("sanctuary"); if (isPlaying) playVoiceOver(); }}
                disabled={!globalAudioEnabled}
                className={`px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[1px] border rounded-sm transition-all ${
                  !globalAudioEnabled
                    ? "border-transparent text-white/10 cursor-not-allowed"
                    : voiceGender === "sanctuary" 
                      ? "border-[#8bb9dc] text-white bg-white/[0.04] cursor-pointer" 
                      : "border-transparent text-white/30 hover:text-white/50 cursor-pointer"
                }`}
              >
                SANCTUARY CORE
              </button>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {/* Reading Pace Controller */}
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[7px] text-white/30 uppercase tracking-[1px]">NARRATOR PACE</span>
            <div className="flex gap-1.5 items-center">
              <button 
                onClick={() => { if (globalAudioEnabled) setPlaybackRate(0.75); }}
                disabled={!globalAudioEnabled}
                className={`font-mono text-[7.5px] px-1 py-0.2 rounded-sm hover:bg-white/5 ${
                  !globalAudioEnabled 
                    ? "text-white/10 cursor-not-allowed" 
                    : playbackRate === 0.75 
                      ? "text-[#ff4a00] font-bold cursor-pointer" 
                      : "text-white/30 cursor-pointer"
                }`}
              >
                0.75x
              </button>
              <button 
                onClick={() => { if (globalAudioEnabled) setPlaybackRate(0.85); }}
                disabled={!globalAudioEnabled}
                className={`font-mono text-[7.5px] px-1 py-0.2 rounded-sm hover:bg-white/5 ${
                  !globalAudioEnabled 
                    ? "text-white/10 cursor-not-allowed" 
                    : playbackRate === 0.85 
                      ? "text-[#ff4a00] font-bold cursor-pointer" 
                      : "text-white/30 cursor-pointer"
                }`}
              >
                0.85x
              </button>
              <button 
                onClick={() => { if (globalAudioEnabled) setPlaybackRate(1.0); }}
                disabled={!globalAudioEnabled}
                className={`font-mono text-[7.5px] px-1 py-0.2 rounded-sm hover:bg-white/5 ${
                  !globalAudioEnabled 
                    ? "text-white/10 cursor-not-allowed" 
                    : playbackRate === 1.0 
                      ? "text-[#ff4a00] font-bold cursor-pointer" 
                      : "text-white/30 cursor-pointer"
                }`}
              >
                1.0x
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Subtitles text representation */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-white/5 flex gap-2 items-start"
          >
            <Activity className="w-3.5 h-3.5 text-[#ff4a00] mt-0.5 shrink-0 animate-pulse" />
            <p className="font-mono text-[8.5px] leading-relaxed text-white/80 italic text-left max-w-2xl">
              &ldquo;{narrativeText}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
