/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Send, Calendar, HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageSquare, Instagram, Globe } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS_DATABASE: FAQItem[] = [
  {
    question: "Who or what is KingShadP?",
    answer: "KingShadP is a mythic character-driven creative identity merging theatrical DIY rap, experimental electronic pop compositions, and physical armor replica designs into a protectable universe. We operate in total digital isolation, independent of commercial streaming directives."
  },
  {
    question: "How is the physical clothing connected to the music?",
    answer: "Every garment we construct is a physically wear-ready companion plate linked to a specific musical era. Believers wear the fabrics as custom shielding armor, linking their coordinates to the acoustic frequency patterns of the unreleased tape demos."
  },
  {
    question: "What is an 'Era Alignment'?",
    answer: "Eras represent historical segments in our creative vault (like Miami Heritage or Aegean Gilt). To align with an era is to secure its corresponding music streams, catalog logs, and physical uniformity relics. It is an agreement of sovereign artistic pride."
  },
  {
    question: "How do I secure an unreleased studio rough draft?",
    answer: "By registering your coordinate email below or inside the Believer's District terminal. Early unpolished vocal mixes, comedic freestyles, and audio stems are dispatched directly to active coordinate profiles ahead of public uploads."
  },
  {
    question: "Can I commission custom garments?",
    answer: "Yes. Inside the Artifacts page, the Bespoke Commission Forge is available for active believers to submit custom configuration codes, synthetic weights, and scale geometries."
  }
];

export default function CommunitySection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [contributionSubmitted, setContributionSubmitted] = useState<boolean>(false);
  const [coordinateFormEmail, setCoordinateFormEmail] = useState<string>("");
  const [coordinateSubmitted, setCoordinateSubmitted] = useState<boolean>(false);

  return (
    <div id="section-community" className="w-full flex flex-col gap-16 py-24 mb-12 text-left relative">
      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
        05 // CITADEL PORTAL / THE BELIEVERS COMMUNITY
      </div>

      {/* --- EMAIL CAPTURE DISTRICT & SOCIAL LINKS --- */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch select-none">
        
        {/* Email registration card */}
        <div className="lg:col-span-7 bg-[#050505] border border-[#ff4a00]/30 p-8 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center gap-2 text-[#ff4a00] mb-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[9px] tracking-[3px] uppercase font-bold">THE REGISTER DISTRICT</span>
            </div>
            
            <h3 className="font-serif text-2xl md:text-3.5xl text-white tracking-wide uppercase leading-tight">
              Coordinate Security Registration
            </h3>
            
            <p className="font-sans text-[13px] text-white/40 leading-relaxed font-light mt-4 text-justify">
              Incorporate your digital coordinate email directly into our system index to listen to unreleased home studio tapes, custom drill remixes, and priority invites to local physical garment drops.
            </p>
          </div>

          {!coordinateSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("telemetry-log", {
                  detail: { message: `COORDINATE UPDATE: Registered '${coordinateFormEmail}' inside Citadel database.`, type: "FORGE_SYNC" }
                }));
                setCoordinateSubmitted(true);
              }}
              className="space-y-3 mt-6"
            >
              <input
                type="email"
                required
                value={coordinateFormEmail}
                onChange={(e) => setCoordinateFormEmail(e.target.value)}
                placeholder="BIOMETRIC_ID@DOMAIN.XYZ"
                className="w-full bg-[#030303] border border-white/10 px-4 py-3.5 font-mono text-[10px] text-white tracking-[2px] outline-none focus:border-[#c6b89e] transition-all rounded-none"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-white text-black text-[9px] font-mono font-semibold tracking-[4px] uppercase hover:bg-[#c6b89e] transition-all hover:shadow-[0_0_15px_rgba(198,184,158,0.5)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                TRANSMIT COORDINATE VALUE
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 border border-[#c6b89e]/30 bg-[#c6b89e]/5 text-[#c6b89e] font-mono text-[11px] tracking-[1.5px] uppercase"
            >
              ✓ CITADEL COORDINATES SECURED: Location compiled successfully. System database updated.
            </motion.div>
          )}
        </div>

        {/* Social Link Panels */}
        <div className="lg:col-span-5 bg-black/40 border border-white/5 p-8 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="text-[9px] font-mono text-[#c6b89e] tracking-[2px] uppercase mb-4">TACTICAL LINK ROUTERS</div>
            <h3 className="font-serif text-2xl text-white tracking-wide">Live Social Feeds</h3>
            <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light mt-3 mb-6">
              Establish connections to our external broadcast outlets. Our social relays feed unreleased vocal briefs and real-time Miami beach workroom previews.
            </p>

            <div className="space-y-3">
              {[
                { name: "Discord Citadel", handle: "@KingShadP_Citadel", path: "https://discord.com", icon: MessageSquare, color: "hover:border-[#5865F2] hover:text-[#5865F2]" },
                { name: "Instagram Workroom", handle: "@kingshadp", path: "https://instagram.com", icon: Instagram, color: "hover:border-[#E1306C] hover:text-[#E1306C]" },
                { name: "SoundCloud Radio", handle: "kingshadp_official", path: "https://soundcloud.com", icon: Globe, color: "hover:border-[#FF5500] hover:text-[#FF5500]" }
              ].map((soc) => (
                <a
                  key={soc.name}
                  href={soc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 border border-white/10 bg-black/80 flex items-center justify-between transition-colors ${soc.color}`}
                >
                  <div className="flex items-center gap-3">
                    <soc.icon className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="text-[13px] font-sans font-medium text-white select-text">{soc.name}</span>
                      <span className="text-[8.5px] font-mono text-white/30 block tracking-[1px] select-text">{soc.handle}</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono tracking-[1.5px] uppercase">[ ENGAGE ]</span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* --- BELIEVER SPOTLIGHT STORIES --- */}
      <div className="border border-white/5 bg-black/40 p-8 select-text">
        <div className="flex justify-between items-baseline mb-8 select-none">
          <div>
            <div className="text-[9px] font-mono text-[#ff4a00] tracking-[3px] uppercase mb-1">BIOMETRIC CITADEL FEED</div>
            <h3 className="font-serif text-xl md:text-3.5xl text-white font-normal uppercase">Believer Spotlight Profiles</h3>
          </div>
          <span className="text-[8px] font-mono text-white/30 tracking-[1.5px] uppercase">[REGISTERED UNITS]</span>
        </div>

        {/* Showcase reviews from followers wearing garments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { tag: "UNIT_9512 // TOKYO", title: "Sovereign Alignment", quote: "Wearing the Armored LS in Tokyo corridors feels like a psychological buffer. The heavy weave and clean alignment metrics represent the physical shield KingShadP maps in his Sovereign Spatial vocals.", name: "Believer K_Aoki", date: "April 2024" },
            { tag: "UNIT_2209 // SEATTLE", title: "Acoustic Shielding", quote: "I forge custom geometry specs in the Commission Bespoke terminal. To cover myself in these garments while running Regal Echoes in public spaces feels completely unmatched. This is real theater.", name: "Believer M_Rivers", date: "February 2024" }
          ].map((story) => (
            <div key={story.tag} className="border border-white/15 bg-black/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 select-none">
                  <span className="text-[8px] font-mono tracking-[1px] text-[#c6b89e] border border-[#c6b89e]/20 px-2 py-0.5 uppercase">
                    {story.tag}
                  </span>
                  <span className="text-[8.5px] font-mono text-white/30 uppercase">{story.date}</span>
                </div>

                <h4 className="font-serif text-lg text-white font-medium mb-2">{story.title}</h4>
                <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light italic">
                  "{story.quote}"
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6 select-none font-mono text-[9px] text-[#ff4a00] uppercase tracking-[1.5px]">
                // PROFILE ID: {story.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- UPCOMING DROP CALENDAR --- */}
      <div className="border border-white/10 bg-[#050505] p-8">
        <div className="flex items-center gap-2 text-[#c6b89e] mb-6 select-none">
          <Calendar className="w-5 h-5 text-[#c6b89e] shrink-0" />
          <span className="font-mono text-[9px] tracking-[4px] uppercase font-bold">EMPIRE SYSTEM RELEASE SCHEDULE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-text text-justify">
          {[
            { date: "JULY 14", title: "ARMORED LS [Recompile]", desc: "Restocking the core Sovereign clothing relic. Limited 30 units forged.", type: "Uniform Drop" },
            { date: "AUG 22", title: "UNRELEASED DRILL DEMOS", desc: "Digital dispatch of vocal cassette tapes to coordinate subscribers.", type: "Music Tape" },
            { date: "OCT 05", title: "SANCTUM SHOWROOM MIAMI", desc: "Physical staging showroom opens for local biometric VIP owners.", type: "Showroom" }
          ].map((cal) => (
            <div key={cal.title} className="p-5 border border-white/5 bg-black/40 min-h-[180px] flex flex-col justify-between relative">
              <span className="absolute top-0 right-0 w-4 h-[1px] bg-[#c6b89e]/30 select-none" />
              
              <div>
                <div className="flex justify-between items-baseline mb-2 select-none">
                  <span className="font-mono text-lg text-[#ff4a00] font-bold">{cal.date}</span>
                  <span className="text-[7.5px] font-mono tracking-[1.5px] text-white/30 uppercase">{cal.type}</span>
                </div>
                <h4 className="font-serif text-[16px] text-white font-medium uppercase">{cal.title}</h4>
                <p className="text-[11.5px] font-sans text-white/50 leading-relaxed font-light mt-2">{cal.desc}</p>
              </div>

              <span className="text-[8px] font-mono text-[#c6b89e] tracking-[2px] uppercase select-none mt-4">// TIMELINE STATUS: LOCK</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- REUSABLE FAQ DROPDOWN --- */}
      <div className="border border-white/5 bg-black/40 p-8 select-text">
        <div className="text-[9px] font-mono tracking-[3px] text-white/30 uppercase mb-6 select-none">
          FREQUENT DISTRICT SYSTEM DIALOGUES (FAQ)
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS_DATABASE.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={item.question} className="border border-white/10 bg-black/60 transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex justify-between items-center transition-colors hover:bg-white/5 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-[15px] sm:text-[16px] text-white font-light">{item.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#ff4a00]" /> : <ChevronDown className="w-4 h-4 text-[#c6b89e]" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-white/5 text-[12.5px] font-sans leading-relaxed text-white/50 font-light text-justify bg-black/90">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- WAYS TO CONTRIBUTE --- */}
      <div className="border border-[#c6b89e]/15 bg-[#030303] p-8 select-text text-justify relative">
        <div className="absolute top-2 right-2 text-[#c6b89e]/20 font-mono text-[7px] tracking-[2px] uppercase select-none">[CONTRIBUTION BLUEPRINTS]</div>
        
        <div>
          <h3 className="font-serif text-2xl text-white tracking-wide uppercase">
            Sovereign Contribution Gateway
          </h3>
          
          <p className="font-sans text-[12.5px] text-white/40 leading-relaxed font-light mt-3 max-w-4xl">
            Our private empire grows entirely through the direct agency of its believers. Submit suggestions, custom aesthetic geometry variables, or lore-note feedback logs straight into our systems below.
          </p>

          <AnimatePresence mode="wait">
            {!contributionSubmitted ? (
              <motion.form
                key="contrib-form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setContributionSubmitted(true);
                  window.dispatchEvent(new CustomEvent("telemetry-log", {
                    detail: { message: `GATEWAY RECEIVED: Aesthetic feedback compiled into local database.`, type: "SYSTEM" }
                  }));
                }}
                className="space-y-4 mt-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[8px] font-mono text-[#c6b89e] tracking-[2px] uppercase select-none">CO-ORDINATE SECURE NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BELIEVER_WIND"
                      className="bg-black border border-white/10 px-4 py-3 font-mono text-[10px] text-white tracking-[2.5px] outline-none focus:border-[#ff4a00] rounded-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[8px] font-mono text-[#c6b89e] tracking-[2px] uppercase select-none">ALIGNMENT SECTOR VALUE</label>
                    <select className="bg-black border border-white/10 px-4 py-3 font-mono text-[10px] text-white/50 tracking-[1.5px] outline-none focus:border-[#ff4a00] rounded-none cursor-pointer">
                      <option>SOVEREIGN SPATIAL ERA [2024]</option>
                      <option>AEGEAN GILT ERA [2022]</option>
                      <option>MIAMI HERITAGE ERA [2020]</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-mono text-[#c6b89e] tracking-[2px] uppercase select-none">AESTHETIC BRIEF TRANSMISSION</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="ENTER YOUR CONTROLOG MEMORY AND DIRECTIVE SUGGESTIONS..."
                    className="w-full bg-black border border-white/10 px-4 py-3 font-mono text-[10px] text-white tracking-[2px] outline-none focus:border-[#ff4a00] resize-none rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 border border-[#ff4a00] hover:bg-[#ff4a00]/10 text-[#ff4a00] font-mono text-[9px] tracking-[3px] uppercase cursor-pointer select-none focus:outline-none"
                >
                  [ ENQUEUE TO FORTRESS DECK ]
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contrib-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 border border-green-500/30 bg-green-950/10 text-green-400 font-mono text-[11px] tracking-[1.5px] uppercase"
              >
                ✓ COMPILATION DIRECTIVE ACQUIRED: Your feedback has been enqueued to the Sovereign Database. Thank you, believer.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
