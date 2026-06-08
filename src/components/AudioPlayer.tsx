/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw, RotateCw, Radio, SkipBack, SkipForward } from "lucide-react";
import ScrambleText from "./ScrambleText";

const AUDIO_TRACKS = [
  {
    id: "regal_echoes",
    title: "REGAL ECHOES OF GOD (DEMO)",
    channel: '"CHANNEL 01"',
    location: "MIAMI BEACH, FL [HQ]",
    codec: ".WAV",
    kbps: "1411 KBPS",
    url: "public/LLC (Visualizer).mp3"
  },
  {
    id: "unfinished_untitled",
    title: "UNFINISHED. UNEDITED. UNTITLED",
    channel: '"CHANNEL 02"',
    location: "AEGEAN CROWN, GR [VAULT]",
    codec: ".FLAC",
    kbps: "4608 KBPS",
    url: "public/Dancing With The Dealer (Visualizer).mp3"
  },
  {
    id: "god_is_woman",
    title: "GOD IS A WOMAN (REMIX) // THE ROYAL manifesto",
    channel: '"CHANNEL 03"',
    location: "VAULT STUDIO ARCHIVE",
    codec: ".AIFF",
    kbps: "2304 KBPS",
    url: "public/K. I. N. G SHAD SHIT! (Visualizer).mp3"
  },
  {
    id: "pope_religiously_high",
    title: "THE POPE AND I RELIGIOUSLY HIGH (VISUALIZER)",
    channel: '"CHANNEL 04"',
    location: "ROMAN VATICAN // PARADOX VOID",
    codec: ".MP3",
    kbps: "320 KBPS",
    url: "/The Pope and I Religiously High (Visualizer).mp3"
  },
  {
    id: "liturgy_shad_p",
    title: "THE LITURGY OF SHÁD P I",
    channel: '"CHANNEL 05"',
    location: "TEMPLE OF SACRIFICE // OMEGA RECTIFIER",
    codec: ".WAV",
    kbps: "1411 KBPS",
    url: "/The Liturgy of Shád P I.wav"
  }
];

// Create a globally persistent audio element so it keeps playing when shifting tabs
let globalTrackIndex = 0;
const globalAudio = typeof Audio !== "undefined" ? new Audio(AUDIO_TRACKS[globalTrackIndex].url) : null;
if (globalAudio) {
  globalAudio.loop = true;
}

export default function AudioPlayer() {
  const [trackIndex, setTrackIndex] = useState(globalTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationRef = useRef<number | null>(null);

  const currentTrack = AUDIO_TRACKS[trackIndex];

  useEffect(() => {
    if (!globalAudio) return;

    const updatePlayState = () => {
      setIsPlaying(!globalAudio.paused);
    };

    const updateTimeline = () => {
      if (globalAudio) {
        setCurrentTime(globalAudio.currentTime);
        setDuration(globalAudio.duration || 100); // Guard against NaN
        animationRef.current = requestAnimationFrame(updateTimeline);
      }
    };

    const onPlay = () => {
      updatePlayState();
      updateTimeline();
    };

    const onPause = () => {
      updatePlayState();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const onSeeked = () => {
      if (globalAudio) {
        setCurrentTime(globalAudio.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      if (globalAudio) {
        setDuration(globalAudio.duration);
      }
    };

    globalAudio.addEventListener("play", onPlay);
    globalAudio.addEventListener("pause", onPause);
    globalAudio.addEventListener("seeked", onSeeked);
    globalAudio.addEventListener("loadedmetadata", onLoadedMetadata);

    const handleRemotePlayTrack = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === "number") {
        const targetIdx = customEvent.detail.index;
        if (targetIdx >= 0 && targetIdx < AUDIO_TRACKS.length) {
          globalTrackIndex = targetIdx;
          setTrackIndex(targetIdx);
          if (globalAudio) {
            globalAudio.src = AUDIO_TRACKS[targetIdx].url;
            globalAudio.play().catch(err => console.error("Audio remote playback error:", err));
          }
        }
      }
    };
    window.addEventListener("play-track-index", handleRemotePlayTrack);

    // Read initial values & sync track index in case changed in other routes/re-mounts
    setTrackIndex(globalTrackIndex);
    updatePlayState();
    if (globalAudio && !globalAudio.paused) {
      updateTimeline();
    } else if (globalAudio) {
      setCurrentTime(globalAudio.currentTime);
      setDuration(globalAudio.duration || 100);
    }

    return () => {
      globalAudio.removeEventListener("play", onPlay);
      globalAudio.removeEventListener("pause", onPause);
      globalAudio.removeEventListener("seeked", onSeeked);
      globalAudio.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("play-track-index", handleRemotePlayTrack);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [trackIndex]);

  const togglePlay = () => {
    if (!globalAudio) return;
    if (globalAudio.paused) {
      globalAudio.play().catch(err => console.error("Audio playback error:", err));
    } else {
      globalAudio.pause();
    }
  };

  const skipTime = (direction: "forward" | "backward") => {
    if (!globalAudio) return;
    const delta = direction === "forward" ? 10 : -10;
    const target = globalAudio.currentTime + delta;
    globalAudio.currentTime = Math.max(0, Math.min(target, globalAudio.duration || 0));
  };

  const changeTrack = (direction: "next" | "prev") => {
    if (!globalAudio) return;
    const wasPlaying = !globalAudio.paused;
    let nextIdx = trackIndex;

    if (direction === "next") {
      nextIdx = (trackIndex + 1) % AUDIO_TRACKS.length;
    } else {
      nextIdx = (trackIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    }

    globalTrackIndex = nextIdx;
    setTrackIndex(nextIdx);
    
    globalAudio.src = AUDIO_TRACKS[nextIdx].url;
    if (wasPlaying) {
      globalAudio.play().catch(err => console.error("Audio playback error:", err));
    } else {
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!globalAudio || !globalAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    globalAudio.currentTime = percentage * globalAudio.duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // Generate mock heights for wave rendering
  const elementsCount = 64;

  return (
    <div className="p-8 flex flex-col justify-between h-full relative overflow-hidden group/player select-none">
      {/* Spinning holographic grid gear */}
      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -top-20 opacity-[0.03] text-[#c6b89e] pointer-events-none mix-blend-screen"
      >
        <Radio strokeWidth={0.5} className="w-[300px] h-[300px]" />
      </motion.div>

      <div className="relative z-10 flex-grow flex flex-col justify-between">
        {/* Top title bar */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[9px] uppercase tracking-[4px] text-[#ff4a00] font-mono mb-2 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 bg-[#ff4a00] rounded-full ${isPlaying ? "opacity-100 shadow-[0_0_8px_#ff4a00]" : "opacity-30"}`} />
              <ScrambleText text={currentTrack.channel} />
            </div>
            <div className="text-[18px] font-serif tracking-widest text-[#c6b89e] drop-shadow-md">
              <ScrambleText text={currentTrack.title} triggerOnHover duration={800} />
            </div>
            {/* Geographic Node and Tracking Badge */}
            <div className="text-[8px] uppercase tracking-[3px] text-white/50 font-mono mt-2 flex items-center gap-1.5 selection:bg-[#ff4a00]/30 selection:text-white">
              <span className="w-1 h-1 bg-[#ff4a00] rounded-full animate-pulse shadow-[0_0_6px_#ff4a00]" />
              <span>NODE: {currentTrack.location}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-[8px] uppercase tracking-[3px] text-[#ff4a00]/70 font-mono">
              "CODEC"
            </div>
            <div className="flex gap-2 items-center border border-[#ff4a00]/20 bg-[#ff4a00]/5 px-2 py-1 backdrop-blur-md">
              <span className="text-[9px] text-white/70 font-mono font-bold">
                {currentTrack.codec}
              </span>
            </div>
          </div>
        </div>

        {/* Track info telemetry stats bar */}
        <div className="flex justify-between items-center font-mono text-[8px] text-white/30 tracking-[1.5px] border-b border-white/5 pb-2 mb-2">
          <span>DECRYPTING FEED_SEGMENT_0{trackIndex + 1}</span>
          <span>{currentTrack.kbps} / STREAM_GOOD</span>
        </div>

        {/* Live bouncing waveform */}
        <div className="flex items-end gap-[2px] h-[35px] opacity-30 mt-auto overflow-hidden">
          {Array.from({ length: elementsCount }).map((_, idx) => (
            <motion.div
              key={`${trackIndex}-${idx}`}
              initial={{ height: "1px" }}
              animate={isPlaying ? { height: ["1px", `${Math.random() * 30 + 3}px`, "1px"] } : { height: "1px" }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.02,
              }}
              className="flex-grow bg-[#c6b89e] min-w-[2px]"
            />
          ))}
        </div>
      </div>

      {/* Control buttons & Timeline */}
      <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Prev track */}
            <motion.button
              onClick={() => changeTrack("prev")}
              aria-label="Previous Track"
              whileTap={{ scale: 0.85 }}
              className="p-2 border border-white/15 text-white/50 hover:text-[#c6b89e] hover:border-[#c6b89e]/40 transition-colors cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </motion.button>

            {/* Play Button */}
            <motion.button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-none border border-[#c6b89e]/30 text-[#c6b89e] flex items-center justify-center hover:bg-[#c6b89e] hover:text-black hover:shadow-[0_0_20px_rgba(198,184,158,0.4)] transition-all duration-300 cursor-pointer relative overflow-hidden group/btn focus:outline-none focus:ring-2 focus:ring-[#c6b89e] focus:ring-offset-2 focus:ring-offset-black"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#c6b89e]/20 to-transparent translate-y-full group-hover/btn:translate-y-0 transition-transform" />
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current relative z-10" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5 relative z-10" />
              )}
            </motion.button>

            {/* Next track */}
            <motion.button
              onClick={() => changeTrack("next")}
              aria-label="Next Track"
              whileTap={{ scale: 0.85 }}
              className="p-2 border border-white/15 text-white/50 hover:text-[#c6b89e] hover:border-[#c6b89e]/40 transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </motion.button>

            {/* Skip Buttons */}
            <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
              <motion.button
                onClick={() => skipTime("backward")}
                aria-label="Rewind 10 seconds"
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                className="text-white/25 hover:text-[#c6b89e] transition-colors cursor-pointer p-1.5 focus:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                onClick={() => skipTime("forward")}
                aria-label="Fast forward 10 seconds"
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                className="text-white/25 hover:text-[#c6b89e] transition-colors cursor-pointer p-1.5 focus:outline-none"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Timeline slider */}
          <div className="flex items-center gap-3 flex-1 ml-6">
            <div className="text-[9px] font-mono tracking-widest text-[#c6b89e]/80 w-8">
              {formatTime(currentTime)}
            </div>
            
            <div
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration || 100}
              aria-valuenow={currentTime}
              aria-label="Audio progress"
              onClick={handleSliderClick}
              className="h-[1px] flex-grow bg-white/10 overflow-hidden cursor-pointer relative hover:h-[3px] transition-all"
            >
              <div
                className="h-full bg-[#c6b89e]"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <div className="text-[9px] font-mono tracking-widest text-[#c6b89e]/40 w-8 text-right">
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { globalAudio };
