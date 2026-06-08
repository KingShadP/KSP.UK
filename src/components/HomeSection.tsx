/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Radio, ShoppingBag, Compass, Users, Sparkles, Cpu, Send } from "lucide-react";
import ScrambleText from "./ScrambleText";
import Tooltip from "./Tooltip";
import SovereignDragonSentinel from "./SovereignDragonSentinel";
import BrandManifestoChronoPortal from "./BrandManifestoChronoPortal";

interface HomeSectionProps {
  onNavigate: (tab: "home" | "listen" | "vault" | "artifacts" | "lore" | "community") => void;
  paradoxMode: boolean;
}

export default function HomeSection({ onNavigate, paradoxMode }: HomeSectionProps) {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  return (
    <div id="section-home" className="w-full flex flex-col gap-16 pt-28 pb-16 text-left select-none relative">
      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase">
        01 // THE THRESHOLD / HOME
      </div>

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col lg:flex-row gap-12 items-stretch mt-10">
        <div className="flex-grow flex-1 flex flex-col justify-center">
          <div className="inline-flex max-w-max items-center gap-4 mb-6 border border-[#c6b89e]/20 bg-black/40 px-5 py-2.5 backdrop-blur-md">
            <Cpu className="w-4 h-4 text-[#c6b89e] animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[5px] text-[#c6b89e] pt-0.5 font-bold">
              <ScrambleText text="MYTHIC DIY RAP // POP EMPIRE" delay={500} duration={800} />
            </span>
          </div>

          <h2 id="hero-title" className="font-serif text-5xl sm:text-6xl md:text-8xl xl:text-9xl font-normal leading-none tracking-tighter text-white mb-6 uppercase">
            <span className="block italic text-[#c6b89e] opacity-90 leading-tight">
              K I N G
            </span>
            <span className="block ml-6 sm:ml-12 md:ml-16 leading-tight">
              SHADP
            </span>
          </h2>

          <div className="text-[12px] md:text-[14px] uppercase tracking-[6px] text-[#dcc57b] font-mono mb-4 opacity-80">
            Raw. Theatrical. Cocky. Funny. Emotional.
          </div>
          <div className="text-white/40 font-mono text-[10px] tracking-[3px] uppercase mb-8">
            "The soundtrack to a personal empire."
          </div>

          <p className="text-[14px] md:text-base text-white/50 font-light leading-relaxed font-sans text-justify selection:bg-[#93000a]/30 max-w-3xl mb-8">
            This is character-driven mythology where raw experimental compositions, unpolished mixes, and aggressive theatrical freestyles form a protective armor for the soul. We do not negotiate with the mainstream. We construct the fortress, room by room, era by era.
          </p>

          {/* CTA Buttons - 3 Primary */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch max-w-3xl">
            <button
              id="cta-listen"
              onClick={() => onNavigate("listen")}
              className="flex items-center justify-between gap-6 px-8 py-5 border border-[#c6b89e] text-black bg-[#c6b89e] font-mono text-[9.5px] tracking-[4px] uppercase hover:bg-transparent hover:text-[#c6b89e] transition-all duration-300 relative overflow-hidden group cursor-pointer focus:outline-none"
            >
              <span className="relative z-10 font-bold pt-0.5">
                [ LISTEN TO THE LATEST ]
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 relative z-10" />
            </button>

            <button
              id="cta-lore"
              onClick={() => onNavigate("lore")}
              className="px-6 py-5 border border-white/20 hover:border-[#c6b89e] text-white hover:text-[#c6b89e] font-mono text-[9.5px] uppercase tracking-[4px] flex items-center justify-center transition-colors duration-300 focus:outline-none"
            >
              [ ENTER THE MYTHOLOGY ]
            </button>

            <button
              id="cta-community"
              onClick={() => onNavigate("community")}
              className="px-6 py-5 border border-[#93000a]/50 hover:bg-[#93000a]/20 text-[#ff4a00] hover:text-white font-mono text-[9.5px] uppercase tracking-[4px] flex items-center justify-center transition-all duration-300 focus:outline-none"
            >
              [ JOIN THE BELIEVERS ]
            </button>
          </div>
        </div>
      </div>

      {/* --- LATEST RELEASE & FEATURE BLOCK --- */}
      <div className="bg-black/80 border border-[#c6b89e]/20 p-8 relative overflow-hidden flex flex-col xl:flex-row gap-10 items-stretch mt-6">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#93000a]" />
        
        {/* Release cover artwork card */}
        <div className="w-full xl:w-1/3 flex flex-col justify-between p-6 border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative min-h-[220px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-[#c6b89e] tracking-[2px]">[STATUS: FEED ACTIVE]</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4a00] animate-pulse" />
          </div>

          <div className="my-6">
            <div className="text-[20px] font-serif italic text-white leading-tight">Regal Echoes of GOD</div>
            <div className="text-[10px] font-mono tracking-[4px] text-[#ff4a00] uppercase mt-2">Latest Audio Manifest</div>
          </div>

          <div className="flex justify-between items-end border-t border-white/10 pt-4">
            <div className="text-[9px] font-mono text-white/40 tracking-[1.5px]">YEAR: 2024</div>
            <div className="text-[9px] font-mono text-white/40 tracking-[1.5px]">5.77K VIEWS</div>
          </div>
        </div>

        {/* Informational block */}
        <div className="flex-1 flex flex-col justify-between py-2 text-justify">
          <div>
            <div className="text-[9px] font-mono text-[#c6b89e] tracking-[3px] uppercase mb-2">CURRENTLY BROADCASTING</div>
            <h3 className="text-xl md:text-3xl font-serif text-white tracking-wide leading-tight mb-4 select-text">
              "The God-Complex Made Audible."
            </h3>
            <p className="font-sans text-[13.5px] text-white/50 leading-relaxed font-light mb-6">
              This track explores the high-tension border between defensive isolation and sovereign confidence. Recorded under full local shelter conditions in southern Florida, the track blends aggressive theatrical vocals with raw analogue synthesizers to forge a protective barrier.
            </p>

            <div className="p-4 border border-[#c6b89e]/15 bg-black/40 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[8px] font-mono text-white/30 block uppercase tracking-[2px]">CONNECTED ERA ARTIFACTS</span>
                <span className="text-xs font-mono text-[#c6b89e] tracking-[1px] uppercase font-bold">ARMORED LS ("Own this era")</span>
              </div>
              <button onClick={() => onNavigate("artifacts")} className="text-[#ff4a00] font-mono text-[9px] tracking-[2px] uppercase hover:underline">
                [ VIEW UNIFORM ]
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center border-t border-white/5 pt-6">
            <span className="text-[9px] font-mono text-white/40 tracking-[2px] uppercase mr-2">AVAILABILITY PLATFORMS:</span>
            {[
              { label: "SoundCloud", url: "https://soundcloud.com" },
              { label: "Audiomack", url: "https://audiomack.com" },
              { label: "Spotify", url: "https://spotify.com" },
              { label: "Apple Music", url: "https://apple.com" }
            ].map((p) => (
              <a
                key={p.label}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#c6b89e] tracking-[1.5px] uppercase border border-[#c6b89e]/20 px-3 py-1.5 hover:border-[#ff4a00] hover:text-white transition-colors"
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* --- BRAND MANIFESTO & CHROMO-PORTAL MULTIVERSE DECK --- */}
      <BrandManifestoChronoPortal onNavigate={onNavigate} paradoxMode={paradoxMode} />

      {/* --- SOVEREIGN DRAGON SENTINEL DIGITAL PORTAL --- */}
      <SovereignDragonSentinel />

      {/* --- QUICK NAVIGATION DESK (3-4 Visual Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[
          {
            title: "SOUND ARCHIVE",
            desc: "Explore every released track across unified distribution portals.",
            btn: "LISTEN TO FREQUENCIES",
            icon: Radio,
            tab: "listen" as const
          },
          {
            title: "THE LORE",
            desc: "An encrypted dossier unraveling the divine persona and Miami heritage.",
            btn: "EXPLORE MYTHOLOGY",
            icon: Compass,
            tab: "lore" as const
          },
          {
            title: "SACRED UNIFORMS",
            desc: "Secure physical replicas and heavy garments forged for believers.",
            btn: "COLLECTION SHOP",
            icon: ShoppingBag,
            tab: "artifacts" as const
          },
          {
            title: "VIP CITADEL",
            desc: "Stand alongside fellow believers. Register coordinates & FAQs.",
            btn: "JOIN COUMMUNITY",
            icon: Users,
            tab: "community" as const
          }
        ].map((card) => (
          <div
            key={card.title}
            onClick={() => onNavigate(card.tab)}
            className="border border-[#c6b89e]/20 bg-black/50 p-6 flex flex-col justify-between hover:border-[#c6b89e]/60 transition-all duration-300 min-h-[220px] group cursor-pointer relative"
          >
            <div className="absolute top-0 right-0 w-8 h-[1px] bg-[#c6b89e]/30 group-hover:w-16 transition-all duration-300" />
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <card.icon className="w-5 h-5 text-[#ff4a00]" />
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-[2px]">COORDINATE SELECT</span>
              </div>
              <h4 className="font-serif text-[18px] text-white font-medium group-hover:text-[#c6b89e] transition-colors">{card.title}</h4>
              <p className="text-[11px] text-white/40 mt-2 font-sans font-light leading-relaxed">{card.desc}</p>
            </div>

            <span className="text-[9px] font-mono text-[#ff4a00] mt-6 tracking-[2px] uppercase group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
              {card.btn} <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        ))}
      </div>

      {/* --- LIVING CONTENT RECENT ACTIVITY FEED & EMAIL SIGNUP --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
        {/* Recent Activity List (Left) */}
        <div className="lg:col-span-7 bg-black/40 border border-white/5 p-8 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="text-[9px] font-mono text-[#ff4a00] tracking-[3px] uppercase mb-4">
              LIVING RELEASES FEED // RECENT CHANNELS
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Regal Echoes of GOD (Demo)", platform: "Audiomack", date: "June 2024", metric: "5.77K Plays", active: true },
                { title: "UNFINISHED. UNEDITED. UNTITLED", platform: "Spotify", date: "September 2023", metric: "12.4K Plays", active: false },
                { title: "Maintain Velocity // southern wave", platform: "SoundCloud", date: "November 2022", metric: "8.9K Plays", active: false }
              ].map((act, index) => (
                <div key={act.title} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-white/10 bg-black/60 hover:border-white/20 transition-all select-text">
                  <div>
                    <div className="text-[13px] text-white font-sans font-medium">{act.title}</div>
                    <div className="text-[9px] font-mono text-white/40 tracking-[1.5px] uppercase mt-1">
                      {act.platform} — {act.date} — <span className="text-[#c6b89e]">{act.metric}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("listen")}
                    className="mt-3 sm:mt-0 px-4 py-1.5 border border-[#c6b89e]/30 hover:border-[#c6b89e] hover:bg-[#c6b89e] hover:text-black font-mono text-[8px] tracking-[2px] transition-all uppercase cursor-pointer"
                  >
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => onNavigate("listen")} className="text-[#c6b89e] font-mono text-[9px] tracking-[4px] uppercase hover:underline mt-6 self-start">
            [ BRUISE THE ARCHIVE FREQUENCIES ]
          </button>
        </div>

        {/* Embedded Newsletter Subscriber (Right) */}
        <div className="lg:col-span-5 bg-[#070707] border border-[#c6b89e]/20 p-8 relative flex flex-col justify-between min-h-[350px]">
          <div className="absolute top-2 right-2 text-[#c6b89e]/30 font-mono text-[7px] tracking-[2px]">[EMPIRE REGISTER]</div>
          
          <div>
            <div className="flex items-center gap-2 text-[#ff4a00] mb-3">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[9px] tracking-[3px] uppercase font-bold">JOIN THE BELIEVERS DISTRICT</span>
            </div>
            <h3 className="font-serif text-2xl text-white tracking-wide">
              "Never Miss An Alignment."
            </h3>
            <p className="font-sans text-[11.5px] text-white/40 leading-relaxed font-light mt-3 text-justify">
              Subscribing commits your secure digital coordinates to our system index. You will receive immediate encrypted dispatches regarding music drops, unreleased draft links, and priority access passes to the physical garments forge.
            </p>
          </div>

          {!isFormSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("telemetry-log", {
                  detail: { message: `CREDENTIAL REGISTERED: Believer credentials recorded correctly. Broadcast channel open.`, type: "FORGE_SYNC" }
                }));
                setIsFormSubmitted(true);
              }}
              className="space-y-3 mt-6"
            >
              <input
                type="email"
                required
                placeholder="BIOMETRIC_ID@DOMAIN.XYZ"
                className="w-full bg-[#030303] border border-white/10 px-4 py-3.5 font-mono text-[10px] text-white tracking-[2px] outline-none focus:border-[#93000a] transition-all rounded-none"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-[#93000a] text-white text-[9px] font-mono font-semibold tracking-[4px] uppercase hover:bg-red-700 transition-all hover:shadow-[0_0_15px_rgba(147,0,10,0.5)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                TRANSMIT CREDENTIALS
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 border border-[#c6b89e]/35 bg-[#c6b89e]/5 text-[#c6b89e] font-mono text-[10px] tracking-[1.5px] uppercase"
            >
              ✓ SYSTEM TRANSMISSION SECURED: Your coordinates are marked inside the private district directory archives. Standby for unreleased demo dispatches.
            </motion.div>
          )}
        </div>
      </div>

      {/* --- SELECTED RELEASES ARTIFACT PREVIEW GRIDS --- */}
      <div className="mt-8 border-t border-[#c6b89e]/15 pt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 mb-8">
          <div>
            <div className="text-[9px] font-mono text-[#c6b89e] tracking-[4px] uppercase mb-1">UNIFORM PREVIEWS</div>
            <h3 className="font-serif text-2xl md:text-4xl text-white tracking-wide uppercase">
              Current Era Relics
            </h3>
          </div>
          <button onClick={() => onNavigate("artifacts")} className="text-[#ff4a00] font-mono text-[9px] tracking-[3px] uppercase hover:underline">
            [ BROWSE ALL UNIFORMS ]
          </button>
        </div>

        {/* Quick Grid previews referencing the defaults of shopify */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: "KSD-01", title: "ARMORED LS", price: "420.00", limit: "25 Units", img: "public/ChatGPT Image May 5, 2026, 11_25_04 PM.png" },
            { id: "KSD-02", title: "CIPHER VEST", price: "580.00", limit: "Invoiced", img: "public/ChatGPT Image May 7, 2026, 09_50_46 PM (2).png" },
            { id: "KSD-04", title: "SOCIETY MASK // L9", price: "1,850.00", limit: "1-of-1 Run", img: "public/ChatGPT Image May 16, 2026, 04_28_18 AM (4).png" }
          ].map((prod) => (
            <div key={prod.title} className="border border-white/5 bg-black/40 p-4 flex flex-col justify-between hover:border-white/10 transition-all select-text">
              <div className="relative aspect-[4/3] bg-black/80 overflow-hidden mb-4 border border-white/5">
                <img
                  src={prod.img}
                  alt={prod.title}
                  className="w-full h-full object-cover opacity-60 hover:opacity-85 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 right-2 bg-red-950 border border-red-500/30 text-[7px] font-mono tracking-[1px] text-white px-2 py-0.5 uppercase">
                  LIMITED: {prod.limit}
                </span>
              </div>
              
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-serif text-[16px] text-white font-medium">{prod.title}</h4>
                <div className="font-mono text-xs text-[#c6b89e]">${prod.price}</div>
              </div>

              <button
                onClick={() => onNavigate("artifacts")}
                className="w-full mt-4 py-2 border border-white/10 bg-[#070707] text-[8px] font-mono tracking-[2px] uppercase text-white hover:border-[#c6b89e] hover:text-[#c6b89e] transition-colors cursor-pointer"
              >
                [ VIEW RELIC DETAILS ]
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
