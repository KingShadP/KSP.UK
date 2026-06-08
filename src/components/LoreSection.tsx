/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  Map, 
  Sparkles, 
  Compass, 
  Eye, 
  LayoutGrid, 
  Award,
  Crown,
  ChevronDown,
  BookOpen,
  Fingerprint,
  Radio,
  FileText,
  Volume2,
  Bookmark,
  Share2,
  Compass as CompassIcon,
  Flame,
  Binary,
  HelpCircle
} from "lucide-react";

// Icon registry resolver map for dynamic DB string mappings
const ICON_MAP: Record<string, any> = {
  Fingerprint,
  Radio,
  BookOpen,
  Eye,
  ShieldAlert,
  Map,
  Crown,
  Flame,
  Award,
  Binary
};

function getIconComponent(iconName: string) {
  return ICON_MAP[iconName] || HelpCircle;
}

interface LoreSectionProps {
  paradoxMode?: boolean;
}

interface LoreSectionData {
  id: string;
  num: string;
  title: string;
  heading: string;
  category: string;
  icon: any;
  quote: string;
  copy: string;
  tagline: string;
}

const LORE_SECTIONS: LoreSectionData[] = [
  {
    id: "character",
    num: "01",
    title: "WHO IS KINGSHADP?",
    heading: "WHO IS KINGSHADP?",
    category: "IDENTITY BRIEF",
    icon: Fingerprint,
    tagline: "A character that became real. A persona that decided to build an empire.",
    quote: "He is the king of a kingdom that doesn't exist yet. He is the narrator of a universe expanding in real-time.",
    copy: `KingShadP is not a person.

KingShadP is a character that became real.
A persona that decided to build an empire.
A mythology made audible.

He is the king of a kingdom that doesn't exist yet.
He is the god of a religion built on honest chaos.
He is the villain in a story only he understands.
He is the narrator of a universe expanding in real-time.

At his core: Miami roots. Larger-than-life energy. 
Humor that masks philosophy. 
Ego that hides vulnerability.
Grandiosity that refuses to apologize.

KingShadP doesn't ask for permission.
He doesn't make music for playlists or charts or approval.
He makes music like he's building a fortress—
raw, experimental, theatrical, funny, emotional—
because the only audience that matters is the one who understands.

The god-complex isn't about arrogance.
It's about believing you can create a world.
Believing you can invent a mythology.
Believing you can turn a character into an empire.

So that's who KingShadP is:
Someone building something that shouldn't exist,
in a way that's impossible to ignore,
for people who are tired of everything else.`
  },
  {
    id: "sound",
    num: "02",
    title: "WHY THIS SOUND?",
    heading: "WHY THIS SOUND? WHY RAW? WHY EXPERIMENTAL? WHY THEATRICAL?",
    category: "ACOUSTIC INTEL",
    icon: Radio,
    tagline: "Most artists make music to fit into the world. KingShadP makes music to build his own.",
    quote: "You're not listening to finished songs. You're listening to the living diary of someone building mythology.",
    copy: `Most artists make music to fit into the world.
KingShadP makes music to build his own.

The music isn't polished because perfection is a lie.
The music isn't clean because real things are messy.
The music isn't commercial because commerce is a compromise.

Instead:

ROUGH DEMOS AND FREESTYLES
Because the first thought is often the most honest.
Because a perfect recording of a mediocre idea is still mediocre.
Because the process matters as much as the product.
You're not listening to finished songs.
You're listening to the living diary of someone building mythology.

REMIXES AND COVERS
Because KingShadP doesn't just make music—he absorbs, transforms, owns.
Taking someone else's creation and turning it into a statement.
"God is a Woman"—not just a song, a declaration of presence.
Not replicating. Reimagining. Reframing. Resurrecting.

MELODIC CHAOS
Trap beats that suddenly become emotional ballads.
Pop hooks wrapped in experimental production.
Rap verses that break into singing, laughter, spoken word.
No lane. No rules. Just feeling expressed however it wants to be.

COMEDY AND EGO
Because grandiosity without humor is just arrogance.
Because the god-complex is funniest when you're laughing at yourself.
Because KingShadP is cocky AND vulnerable, theatrical AND real.
The humor disarms you. Then the emotion hits.

WHY NOT POLISHED?
Because polished means watered down.
Because perfection means you've stopped taking risks.
Because the world doesn't need another clean artist.
It needs someone willing to sound unfinished,
to feel unfiltered,
to be uncomfortably, authentically themselves.

This is music made in studios, bedrooms, cars, freestyles in the booth.
This is music made for nobody and everybody.
This is music made because if KingShadP doesn't make it,
the empire stays imaginary.

And KingShadP doesn't believe in imaginary anymore.`
  },
  {
    id: "philosophy",
    num: "03",
    title: "THE PHILOSOPHY",
    heading: "WHAT DOES KINGSHADP REPRESENT?",
    category: "SOCIETAL ORDER",
    icon: BookOpen,
    tagline: "In a world that demands you pick a lane, KingShadP is all the lanes.",
    quote: "KingShadP is contradictory: Cocky and vulnerable, serious and hilarious, experimental and pop-accessible.",
    copy: `In a world that demands you pick a lane,
KingShadP is all the lanes.

In a world that demands you be consistent,
KingShadP is contradictory.
Cocky and vulnerable.
Serious and hilarious.
Experimental and pop-accessible.
Raw and theatrical.
A real person playing a character who might be more real than the person.

KingShadP represents:

AUTHENTICITY OVER POLISH
Your rough draft is more interesting than someone else's masterpiece.
Your truth is scarier than their fiction.
Your chaos is more beautiful than their order.

MYTHOLOGY OVER MARKETING
This isn't about building a brand.
It's about building a world.
A universe where the music, the visuals, the clothing, the energy—
they all exist in service of something larger.
A mythology that people believe in because it's so unapologetically itself.

EGO AS PHILOSOPHY
The god-complex isn't delusion.
It's the only way to build something that matters.
You have to believe you're building an empire before you build one.
You have to act like a king before the crown fits.
You have to speak like a god before anyone listens.

COMMUNITY OVER CELEBRITY
KingShadP doesn't want fans.
He wants believers.
People who don't just listen to the music—
they understand the mythology.
They wear the artifacts.
They show up.
They're building the empire together.

MIAMI ROOTS
Raw energy.
Humidity and hustle.
The ocean and the streets.
A place that makes you larger than life because you have to be.
Where people speak in superlatives because understatement is a waste.
KingShadP is Miami made into sound.

THE PERSONAL EMPIRE
Not trying to be the biggest.
Trying to be the only.
Not trying to win.
Trying to create something that has never existed before.
An empire of one that becomes an empire of thousands.
Built by someone who refused to follow the rules.`
  },
  {
    id: "vision",
    num: "04",
    title: "THE EMPIRE VISION",
    heading: "WHERE IS THIS GOING? WHAT IS THE VISION?",
    category: "TEMPORAL PATHWAYS",
    icon: Eye,
    tagline: "KingShadP isn't trying to be an influencer. He is trying to be a universe.",
    quote: "Success is not measured in streams or sales. It is measured in believers who understand, and artifacts that matter.",
    copy: `KingShadP isn't trying to be a rapper.
KingShadP isn't trying to be a fashion brand.
KingShadP isn't trying to be an influencer.

KingShadP is trying to be a universe.

A universe where:

MUSIC IS THE CENTER
Everything orbits the sound.
New releases don't just drop—they expand the mythology.
Each track is a world-building moment.
The archive grows like a living bible.
Rough demos and remixes matter as much as finished tracks.
Freestyles are as important as studio records.
It's all one conversation, one long monologue to the believers.

ARTIFACTS ARE EXTENSIONS
Clothing isn't merch.
It's the uniform of someone who gets it.
Each piece exists in relation to an era of music.
You're not wearing a brand—you're wearing a story.
The ARMORED LS from the SOVEREIGN SPATIAL era.
The CIPHER VEST from the AEGEAN VAULT mythology.
These are collectibles. Relics. Costumes for the character.
When you wear KingShadP, you're not advertising.
You're declaring allegiance to the mythology.

VISUALS ARE THE LANGUAGE
The cyberpunk aesthetic. The system telemetry. The neon cyan.
These aren't design choices.
They're the visual representation of someone building a system.
Encrypted. Precise. Grandiose. Theatrical.
The entire world looks and feels like KingShadP.
Every image, every design, every frame reinforces the mythology.

COMMUNITY IS THE FUEL
The believers matter more than the celebrity.
The people who show up in Discord, in comments, in emails, at drops—
they're not an audience.
They're architects.
They're helping build the empire.
They're the mythology made manifest.

WHERE WE ARE RIGHT NOW
This is the beginning.
The empire is being sketched.
The mythology is still being written.
The archive is still growing.
The believers are still arriving.

KingShadP could go quiet for months, then drop 10 tracks.
Could release clothing, then disappear from social media.
Could shift aesthetics, change directions, remix the entire identity.
Because KingShadP isn't bound by consistency.
He's bound by truth.

THE FIVE-YEAR VISION
Year 1: Consolidation. Music + artifacts + believers. Build the core mythology.
Year 2: Expansion. New eras. New collections. Grow the universe.
Year 3: Evolution. Collaborations. Video/visual content. Deepen the world.
Year 4: Manifestation. Larger-than-life moments. Bigger shows, bigger drops, bigger mythology.
Year 5: Empire. A self-sustaining universe where thousands of believers create meaning around KingShadP.

Not success measured in streams or sales.
Success measured in believers who understand.
Success measured in artifacts that matter.
Success measured in mythology that lasts.

THIS IS JUST THE BEGINNING.`
  },
  {
    id: "clothing",
    num: "05",
    title: "WHY THE CLOTHING?",
    heading: "ARTIFACTS AREN'T MERCH. WHAT DOES IT MEAN TO WEAR KINGSHADP?",
    category: "ARTIFACT DESIGN",
    icon: ShieldAlert,
    tagline: "Most fashion is about looking good. KingShadP artifacts are physical extensions of the mythology.",
    quote: "When you buy an artifact, you are buying something made with care by someone who refused to compromise.",
    copy: `Most fashion is about looking good.
Most merch is about advertising.

KingShadP artifacts are neither.

They are collectibles.
They are costumes.
They are physical extensions of the mythology.
They are relics from an era.

ARTIFACTS ARE ARTIFACTS BECAUSE:

They exist in relation to music.
Each collection is tied to an era, a release, a mythology phase.
SOVEREIGN SPATIAL artifacts come from that era of the music.
AEGEAN VAULT artifacts are from a previous mythology.
When you wear them, you're wearing a song.
You're embodying a piece of KingShadP.

They are limited.
Not 1000s produced.
Small runs. Limited quantities. Precious.
This isn't fast fashion.
This isn't "restock whenever."
When an artifact is gone, it's gone.
It becomes a relic.
A collectible.
A moment in KingShadP mythology you own forever.

They tell a story.
The ARMORED LS isn't just a shirt.
It's the uniform of someone building a fortress.
The material is Japanese selvedge—precise, intentional, expensive.
The construction is hand-stitched—each stitch is a choice.
The design is protective—reinforced seams, armored layers.
When you wear it, you're not just wearing clothing.
You're wearing intention.
You're wearing philosophy made physical.

They're made with respect.
Not sweatshop production.
Not cheap materials masked with branding.
Materials sourced carefully.
Construction done with precision.
Limited runs so quality stays consistent.
Price point that reflects actual value, not artificial scarcity.
When you buy an artifact, you're buying something that was made with care.
By someone who refused to compromise.

They are wearable art.
Not trying to be trendy.
Not trying to be streetwear or haute couture.
Just... real.
Weird. Functional. Beautiful. Experimental.
The kind of piece you wear because it feels true.
Not because it fits a trend.

WHAT DOES IT MEAN TO WEAR KINGSHADP?

When you wear an artifact, you're saying:

"I understand the mythology."
"I'm not buying a brand. I'm joining a universe."
"I believe in this character."
"I'm part of the empire."
"I get it."

You're showing up.
In a world of infinite choices, you chose to wear the king's uniform.
You chose to be visibly aligned.
You chose to be a believer.

When you wear KINGSHADP, you're not advertising.
You're declaring.

And that matters.
Because the mythology only grows if people believe.
And people believe when they see believers showing up.
Walking around.
Wearing the armor.
Living the character.

COLLECTORS
Some people buy artifacts and keep them.
Collectors. Archivists.
They own every era.
They have the complete set.
They're building a KingShadP museum in their closet.
That's valid.
That's beautiful.
That's how you preserve mythology.

WEARERS
Some people buy artifacts and actually wear them.
Into the world.
To shows.
On the street.
In photos.
In everyday life.
Making the mythology visible.
Making the character real.
That's also valid.
That's also beautiful.
That's how you spread the empire.

Both are believers.
Both are part of the mythology.`
  },
  {
    id: "miami",
    num: "06",
    title: "THE MIAMI ROOTS",
    heading: "WHERE THIS COMES FROM: MIAMI",
    category: "SECTOR ZERO",
    icon: Map,
    tagline: "Miami made KingShadP spiritually, energetically, culturally.",
    quote: "Miami is a city that refuses to be subtle. You can't survive by being small. You have to be louder, bigger, yourself times ten.",
    copy: `Miami made KingShadP.

Not literally.
But spiritually. Energetically. Culturally.

Miami is a city that refuses to be subtle.
Everything is larger than life.
Everything is stated in superlatives.
You can't survive in Miami by being small.
You have to be LOUD.
You have to be BIGGER.
You have to be YOURSELF TIMES TEN.

That's KingShadP.

Miami is:
Humidity and hustle.
Ocean breeze and street energy.
Hip-hop and reggaeton and everything in between.
Immigrants and dreamers and people who came with nothing.
A place where you fake it till you make it,
then you become it so hard nobody questions if you were faking.

That's the god-complex.
That's the king energy.
That's why it sounds like Miami rap,
but also pop, but also experimental,
but also melodic, but also trap.
Because Miami doesn't stay in one lane.
Miami is everything at once.

KingShadP is Miami made into sound.
Miami's grandiosity.
Miami's sense of humor.
Miami's refusal to apologize.
Miami's belief that you can make something from nothing.
Miami's understanding that mythology is just confidence made visible.

This is what Miami taught KingShadP:
You can be cocky and vulnerable.
You can be funny and serious.
You can be theatrical and real.
You can be raw and ambitious.
You can be experimental and pop-accessible.

Because Miami doesn't choose.
Miami is all of it.
And KingShadP inherited that.`
  },
  {
    id: "godcomplex",
    num: "07",
    title: "THE GOD-COMPLEX EXPLAINED",
    heading: "ON THE GOD-COMPLEX: CONFIDENCE AS PHILOSOPHY",
    category: "PSYCHE ANALYSIS",
    icon: Crown,
    tagline: "The god-complex isn't about arrogance—it's about advanced belief.",
    quote: "You have to believe you're building an empire. You have to act like a king before the crown fits.",
    copy: `People confuse confidence with arrogance.
KingShadP understands the difference.

The god-complex isn't about believing you're better than everyone.
It's about believing you're building something that matters.

It's not "I'm the greatest."
It's "I'm the only one making this exact thing,
and the world needs it whether it knows it or not."

CONFIDENCE AS MAGIC
The most powerful thing you can do is believe.
Believe the idea.
Believe the character.
Believe the empire is real before it's real.

You build the mythology first in your head.
You speak it into existence.
You act like it's already there.
And then—slowly, piece by piece—it becomes real.

The god-complex is just advanced belief.

VULNERABILITY INSIDE THE ARMOR
But here's what people miss:
The god-complex doesn't mean you're not scared.
The king can be vulnerable.
The god can have doubts.
The character can break sometimes.

KingShadP is cocky AND honest.
Grandiose AND humble.
Arrogant AND aware of the arrogance.

The humor disarms the ego.
The emotion cuts through the theater.
The vulnerability makes the grandiosity real.

It's all true.
It's all fake.
It's all real.

EARNING THE CROWN
The god-complex is only acceptable if you're actually building something.
If you're just talking, you're just bragging.
But if you're backing it up with music, with artifacts, with mythology, with community—
then you've earned the right to speak like a king.

KingShadP isn't claiming the crown.
He's building it.
Piece by piece.
Track by track.
Artifact by artifact.
Believer by believer.

The confidence is justified because the work is real.`
  },
  {
    id: "rawvspolished",
    num: "08",
    title: "RAW VS. POLISHED",
    heading: "ON UNFINISHED MUSIC: WHY ROUGH DEMOS ARE MORE HONEST",
    category: "CREATIVE STRATEGY",
    icon: Flame,
    tagline: "In a world obsessed with perfection, rough is radical.",
    quote: "A rough freestyle is more authentic than a perfect recording. It came straight from the brain, with no compromises.",
    copy: `In a world obsessed with perfection,
rough is radical.

Most artists hide the demos.
Bury them in hard drives.
Release only the polished, perfect versions.
The ones that cost $50k in studio time.
The ones that took 6 months to finalize.
The ones where every decibel is optimized.

KingShadP does the opposite.
Because the rough version is more honest.

ROUGH = HUMAN
When you listen to a polished track,
you're hearing what the artist wants you to hear.
Calculated. Crafted. Controlled.

When you listen to a rough demo,
you're hearing what the artist thought.
Unfiltered. Unguarded. Real.

A rough freestyle is more authentic than a perfect recording.
An unmastered demo is truer than a mastered single.
Because rough means it came straight from the brain.
No mediators. No perfectionists. No compromises.

PERFECTION IS COMPROMISE
The pursuit of perfection is the death of honesty.
By the time a track is "perfect,"
it's been workshopped into safety.
The weird parts have been smoothed.
The risky moments have been refined.
The character has been flattened.

KingShadP keeps the weird.
The rough demos have personality that the perfected versions lose.
The unmastered tracks have energy that polish kills.

EVOLUTION IS VISIBLE
When you release rough versions,
people see the process.
They understand how ideas become songs.
They see multiple versions and versions and versions.
They watch the mythology evolve in real-time.

That's more interesting than a perfect finished product.
That's a living archive.
That's mythology being built.

ACCESSIBLE EXCELLENCE
Rough doesn't mean low-quality.
It means unfiltered.
A rough demo from KingShadP is still thoughtful.
Still intentional.
Still excellent.
Just not obsessed with perfection.

The production might not be clean.
But the song is real.
The idea is strong.
The character is present.

That's what matters.`
  },
  {
    id: "believers",
    num: "09",
    title: "WHAT BELIEVERS BELIEVE",
    heading: "WHO ARE THE BELIEVERS? WHAT DO THEY BELIEVE?",
    category: "EMPIRE ARCHITECTS",
    icon: Award,
    tagline: "A believer isn't a fan. A fan is passive. A believer is active.",
    quote: "Believers don't just listen to the music—they understand the mythology. They are building the empire together.",
    copy: `A believer isn't a fan.
A fan is passive.
A believer is active.

A believer listens to understand.
A believer wears the artifacts.
A believer shows up.
A believer tells others.
A believer participates in building the mythology.

BELIEVERS BELIEVE THAT:

Authenticity matters more than polish.
Real is better than perfect.
Character matters more than celebrity.
Mythology is stronger than marketing.
Community is more powerful than celebrity.

Rough demos can be more interesting than finished tracks.
A god-complex is justified if you're building something.
Confidence is a philosophy, not arrogance.
King energy isn't about kingship—it's about sovereignty.
You can be cocky and vulnerable at the same time.

The empire is more important than the individual.
The music is more important than the streams.
The community is more important than the followers.
The mythology is more important than the brand.

Believers believe that KingShadP is worth paying attention to.
Not because of how many followers he has.
Not because of how many streams.
But because what he's building hasn't been built before.

And they want to be part of that.

TYPES OF BELIEVERS:

THE MUSIC FANS
Listen to everything.
Follow the discography.
Understand every reference and every remix.
Have favorite tracks and favorite eras.
Show up for new releases.

THE PHILOSOPHERS
Get the mythology.
Understand the character.
See the larger vision.
Believe in the empire-building.
Think about what KingShadP represents.

THE COLLECTORS
Buy the artifacts.
Own the pieces from each era.
Understand the limited quantities.
See each collection as a relic.
Build a KingShadP archive.

THE ADVOCATES
Tell others.
Share the music.
Introduce friends.
Grow the community.
Spread the empire.

THE CREATORS
Make art inspired by KingShadP.
Remix the music.
Create fan art.
Write about the mythology.
Participate actively in the universe.

They're all believers.
They're all building the empire together.`
  },
  {
    id: "nextsteps",
    num: "10",
    title: "NEXT STEPS & WHERE WE ARE",
    heading: "THE EMPIRE ISN'T FINISHED. IT'S JUST BEGINNING.",
    category: "FUTURE MATRIX",
    icon: Binary,
    tagline: "The mythology is being written in real-time. The empire is being built.",
    quote: "The empire is being built by thousands of small choices. Thousands of people believing.",
    copy: `If you're reading this, you're at the beginning.

The mythology is being written in real-time.
The empire is being built.
The believers are still arriving.

What's next?

NEW MUSIC
Every few weeks, a new release.
Could be a finished track.
Could be a freestyle.
Could be a remix.
Could be something that doesn't fit any category.
The archive grows.

NEW ARTIFACTS
With each era of music, corresponding pieces.
New materials. New stories. New mythology.
Limited quantities. Meant to be collected.
Each drop is an event.

DEEPER COMMUNITY
Discord channels.
Email connections.
Believer spotlights.
Stories from people building the empire.
A universe that extends beyond the individual.

EXPANSION
Visuals. Videos. Performances.
Collaboration with artists who get it.
Expansion of what "KingShadP" means.
New dimensions of the mythology.

EVOLUTION
The character will evolve.
The sound will shift.
The mythology will deepen.
What's true about KingShadP right now might not be true in 2 years.
And that's okay.
The empire is alive.
It grows.
It changes.
It becomes.

YOUR ROLE
You can be a listener.
You can be a believer.
You can be a collector.
You can be an advocate.
You can be a creator.
You can be an architect of the mythology.

The empire is being built by thousands of small choices.
Thousands of people showing up.
Thousands of people understanding.
Thousands of people believing.

You can be one of them.

BELIEVE OR DON'T
KingShadP doesn't need everyone.
He needs believers.
People who get it.
People who see the vision.
People who understand that this is something new.
Something worth building.
Something worth believing in.

If that's you, welcome.
You're already part of the empire.

If it's not you, that's okay too.
KingShadP's universe isn't for everyone.
It's for people who are tired of everything else.
People who want something raw and theatrical and real.
People who understand that mythology matters.

Come in or stay out.
But know that while you're deciding,
the empire is being built.`
  }
];

export default function LoreSection({ paradoxMode = false }: LoreSectionProps) {
  const [readingMode, setReadingMode] = useState<"accordion" | "scroll">("accordion");
  const [activeSectionId, setActiveSectionId] = useState<string>("character");
  const [selectedLanguage, setSelectedLanguage] = useState<"alpha_core" | "omega_frequency">("alpha_core");
  const [unlockedSections, setUnlockedSections] = useState<string[]>(["character"]);

  const [lore, setLore] = useState<any[]>(LORE_SECTIONS);

  // Synchronize dynamic lore chapters from administrative portal data stream
  useEffect(() => {
    fetch("/api/cms")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("File repository read fallback.");
      })
      .then((data) => {
        if (data && Array.isArray(data.lore)) {
          // Map backend string representation back to component fallbacks if icon matches
          const mappedCmsLore = data.lore.map((item: any) => ({
            ...item,
            icon: typeof item.icon === "string" ? getIconComponent(item.icon) : item.icon
          }));
          setLore(mappedCmsLore);
        }
      })
      .catch((err) => console.log("Lore DB fallback active: ", err));

    const handleLoreUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && Array.isArray(customEvent.detail.lore)) {
        const mappedCmsLore = customEvent.detail.lore.map((item: any) => ({
          ...item,
          icon: typeof item.icon === "string" ? getIconComponent(item.icon) : item.icon
        }));
        setLore(mappedCmsLore);
      }
    };

    window.addEventListener("cms-data-updated", handleLoreUpdate);
    return () => {
      window.removeEventListener("cms-data-updated", handleLoreUpdate);
    };
  }, []);
  
  const handleToggleSection = (id: string) => {
    setActiveSectionId((prev) => (prev === id ? "" : id));
    if (!unlockedSections.includes(id)) {
      setUnlockedSections((prev) => [...prev, id]);
      window.dispatchEvent(
        new CustomEvent("telemetry-log", {
          detail: { 
            message: `LORE_UNLOCKED: Accessed temporal archive coordinate #${id.toUpperCase()}. Decrypting sequence...`, 
            type: paradoxMode ? "WARNING" : "SUCCESS" 
          }
        })
      );
    }
  };

  const handleToggleWholeSaga = (mode: "accordion" | "scroll") => {
    setReadingMode(mode);
    window.dispatchEvent(
      new CustomEvent("telemetry-log", {
        detail: { 
          message: `LORE_UI_TRANSITION: Shifted to ${mode.toUpperCase()} view index. Re-indexing telemetry tags.`, 
          type: "SYSTEM" 
        }
      })
    );
  };

  return (
    <motion.div
      id="section-lore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col gap-10 py-16 text-left relative"
    >
      {/* Decorative timeline boundary */}
      <div className="absolute top-[80px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
        05 // THE MYTHOLOGY SECURE ARCHIVE / DIRECT COPIES
      </div>

      {/* Atmospheric Headline */}
      <div className="mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-6 gap-6">
        <div>
          <span className={`font-mono text-[8px] tracking-[4px] uppercase block mb-1.5 ${paradoxMode ? "text-[#8bb9dc]" : "text-[#93000a]"}`}>
            {paradoxMode ? "Ω OMEGA FREQUENCY PARADOX DISK" : "α ALPHA SOVEREIGN REALM COREDOC"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4.5xl text-white font-light tracking-wider uppercase leading-tight select-none">
            THE MYTHOLOGY // WHO IS KINGSHADP?
          </h2>
          <p className="font-mono text-[10px] text-white/40 tracking-[1.5px] uppercase mt-2 italic select-none">
            &ldquo;The character. The persona. The empire. Not a stage name. A living universe.&rdquo;
          </p>
        </div>

        {/* Navigation Switchers and UI Controllers */}
        <div className="flex flex-wrap items-center gap-3 select-none">
          <div className="flex items-center gap-1 border border-white/10 px-2 py-1 bg-black/55 backdrop-blur-md rounded-sm">
            <button
              onClick={() => handleToggleWholeSaga("accordion")}
              className={`font-mono text-[8px] tracking-[1.5px] px-2.5 py-1 uppercase cursor-pointer rounded-sm ${
                readingMode === "accordion"
                  ? paradoxMode
                    ? "bg-[#8bb9dc]/15 text-[#8bb9dc] font-bold"
                    : "bg-[#c6b89e]/15 text-[#c6b89e] font-bold"
                  : "text-white/40 hover:text-white"
              }`}
            >
              ACCORDION REVELATION
            </button>
            <span className="text-white/10 text-[9px]">|</span>
            <button
              onClick={() => handleToggleWholeSaga("scroll")}
              className={`font-mono text-[8px] tracking-[1.5px] px-2.5 py-1 uppercase cursor-pointer rounded-sm ${
                readingMode === "scroll"
                  ? paradoxMode
                    ? "bg-[#8bb9dc]/20 text-[#8bb9dc] font-bold shadow-[0_0_8px_rgba(139,185,220,0.15)]"
                    : "bg-[#c6b89e]/20 text-[#c6b89e] font-bold shadow-[0_0_8px_rgba(198,184,158,0.15)]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              EDITORIAL SAGA SCROLL
            </button>
          </div>
        </div>
      </div>

      {/* Atmospheric context warning banner */}
      <div className={`p-4 border text-[11px] font-mono leading-relaxed select-none ${
        paradoxMode 
          ? "border-[#8bb9dc]/20 bg-gradient-to-r from-purple-950/10 to-indigo-950/5 text-[#8bb9dc]" 
          : "border-[#c6b89e]/20 bg-gradient-to-r from-[#c6b89e]/5 to-transparent text-[#c6b89e]"
      }`}>
        <div className="flex gap-2.5 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
          <span className="font-bold">METADATA STATUS: COMPLETE REPLICA DOSSIER GRANTED.</span>
        </div>
        <p className="text-white/50 mt-1 select-text">
          Our records are encrypted directly using Japanese selvedge fibers and Miami Beach atmospheric pressures. Click on each terminal block below to extract individual telemetry files, or shift to the Editorial Scroll above to read the continuous mythos.
        </p>
      </div>

      {/* ================= OPTION A: INTERACTIVE ACCORDION REVELATION ================= */}
      {readingMode === "accordion" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INDEX: Small 10x grid list of contents */}
          <div className="lg:col-span-4 space-y-2 select-none">
            <span className="font-mono text-[7px] text-white/30 tracking-[3px] block mb-2 uppercase">LORE SEC REGISTER:</span>
            {lore.map((sec) => {
              const isCurrent = activeSectionId === sec.id;
              const hasRead = unlockedSections.includes(sec.id);
              const SIcon = sec.icon;

              return (
                <button
                  key={sec.id}
                  onClick={() => handleToggleSection(sec.id)}
                  className={`w-full p-3 border text-left transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none ${
                    isCurrent
                      ? paradoxMode
                        ? "border-[#8bb9dc] bg-[#8bb9dc]/10 text-white"
                        : "border-[#c6b89e] bg-[#c6b89e]/10 text-white"
                      : "border-white/5 bg-black/45 text-white/55 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className={`font-mono text-[8px] px-1.5 py-0.5 border rounded-sm font-semibold ${
                      isCurrent
                        ? paradoxMode ? "border-[#8bb9dc]/40 bg-[#8bb9dc]/10 text-[#8bb9dc]" : "border-[#c6b89e]/40 bg-[#c6b89e]/10 text-[#c6b89e]"
                        : "border-white/10 text-white/30"
                    }`}>
                      {sec.num}
                    </span>
                    <SIcon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? (paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]") : "text-white/35"}`} />
                    <span className="font-serif text-[12.5px] uppercase tracking-wide truncate">{sec.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasRead && <span className="font-mono text-[6px] text-emerald-400/70 border border-emerald-400/20 px-1 rounded-[1px] tracking-[1px] uppercase">READ</span>}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCurrent ? "rotate-180" : ""}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT VIEWPORT: Focused content container with robust typewriter & micro telemetry elements */}
          <div className="lg:col-span-8 flex flex-col justify-between border border-white/10 p-6 md:p-8 bg-black/75 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeSectionId ? (
                (() => {
                  const currentSection = lore.find((s) => s.id === activeSectionId) || lore[0];
                  const IconComp = currentSection.icon;
                  return (
                    <motion.div
                      key={currentSection.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-6"
                    >
                      {/* Section meta top header */}
                      <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                          <IconComp className={`w-4 h-4 ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`} />
                          <span className="font-mono text-[8px] text-white/30 tracking-[2px] uppercase">
                            INDEX: SECTION_0{currentSection.num} // {currentSection.category}
                          </span>
                        </div>
                        <span className={`font-mono text-[7px] border border-white/10 px-1.5 py-0.5 rounded-[2px] ${paradoxMode ? "text-purple-400" : "text-amber-400"}`}>
                          DECRYPTION_LEVEL_9 // SAFE
                        </span>
                      </div>

                      {/* Heading */}
                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal uppercase tracking-wider">
                          {currentSection.heading}
                        </h3>
                        <p className={`font-mono text-[10px] tracking-[1.5px] uppercase mt-1 italic ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`}>
                          {currentSection.tagline}
                        </p>
                      </div>

                      {/* Pull Quote Panel */}
                      <div className={`p-4 border border-dashed text-justify ${paradoxMode ? "border-[#8bb9dc]/30 bg-[#8bb9dc]/5" : "border-[#c6b89e]/20 bg-[#c6b89e]/5"}`}>
                        <span className="text-[7.5px] font-mono text-white/40 block tracking-[2px] uppercase mb-1">REALM DIRECTIVE QUOTE</span>
                        <p className="font-serif text-[14.5px] text-white font-light leading-relaxed italic">
                          &ldquo;{currentSection.quote}&rdquo;
                        </p>
                      </div>

                      {/* Main Paragraph copy parsing splits cleanly to avoid block chunkiness */}
                      <div className="space-y-4 pt-1 select-text">
                        {currentSection.copy.split("\n\n").map((para, pIdx) => {
                          const isUppercaseLabel = para === para.toUpperCase() && para.length < 50;
                          return isUppercaseLabel ? (
                            <h4 key={pIdx} className={`font-mono text-[11px] tracking-[2.5px] uppercase pt-4 block font-bold ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`}>
                              ► {para}
                            </h4>
                          ) : (
                            <p key={pIdx} className="text-[13.5px] font-sans font-normal text-white/65 leading-relaxed font-light text-justify whitespace-pre-wrap">
                              {para}
                            </p>
                          );
                        })}
                      </div>

                    </motion.div>
                  );
                })()
              ) : (
                <div className="flex flex-col justify-center items-center text-center py-20 text-white/40 max-w-sm mx-auto space-y-4 select-none">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center animate-spin" style={{ animationDuration: "20s" }}>
                    <BookOpen className="w-5 h-5 text-white/30" />
                  </div>
                  <span className="font-mono text-[9px] tracking-[3px] uppercase block">ARCHIVE VIEWPORT EMPTY</span>
                  <p className="font-sans text-[11px] text-white/30 leading-relaxed font-light">
                    Select any of the 10 thematic coordinate files from the Left Register to extract and display the holographic brand dossiers.
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* Bottom telemetry indicators */}
            <div className="mt-8 pt-4 border-t border-white/5 select-none text-[8.5px] font-mono flex justify-between items-center text-white/30">
              <span>SECURITY_VAULT_DECRYPT: LORE_INDEX_SUCCESS</span>
              <span>MUTATION_FLUX: 0.00%</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= OPTION B: CONTINUOUS STUNNING EDITORIAL SCROLL ================= */}
      {readingMode === "scroll" && (
        <div className="space-y-16 mt-6">
          <div className="text-[9px] font-mono tracking-[4px] text-white/30 uppercase text-center select-none">
            — BEGINNING OF CONTINUOUS SAGA CHRONICLE —
          </div>

          <div className="max-w-3xl mx-auto space-y-16">
            {lore.map((sec, sIdx) => {
              const SIcon = sec.icon;
              return (
                <motion.article
                  key={sec.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className={`p-6 md:p-10 border relative text-justify ${
                    paradoxMode 
                      ? "border-[#8bb9dc]/15 bg-black/60 shadow-[0_0_25px_rgba(139,185,220,0.03)]" 
                      : "border-white/5 bg-black/40"
                  }`}
                >
                  {/* Absolute subtle background index text */}
                  <span className="absolute top-2 right-4 font-mono text-[30px] font-bold text-white/[0.02] tracking-[1px] select-none pointer-events-none">
                    SECTION_0{sec.num}
                  </span>

                  {/* Section Top Header bar */}
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6 select-none">
                    <span className={`font-mono text-[8px] px-2 py-0.5 border font-semibold ${
                      paradoxMode ? "border-[#8bb9dc]/30 bg-[#8bb9dc]/10 text--[#8bb9dc]" : "border-[#c6b89e]/30 bg-[#c6b89e]/10 text-[#c6b89e]"
                    }`}>
                      CO-ORDINATE: 0{sec.num} // {sec.category}
                    </span>
                    <span className="text-white/20 text-[8px] font-mono tracking-wider">• TRANSCRIPTION LIVE</span>
                  </div>

                  {/* Icon & Heading Row */}
                  <div className="flex gap-4 items-start pb-2">
                    <div className={`p-3 border rounded-sm ${paradoxMode ? "border-[#8bb9dc]/20 bg-[#8bb9dc]/5" : "border-[#c6b89e]/10 bg-[#c6b89e]/5"} select-none`}>
                      <SIcon className={`w-5 h-5 ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3.5xl text-white font-normal uppercase tracking-wider leading-tight">
                        {sec.heading}
                      </h3>
                      <p className={`font-mono text-[9.5px] mt-1 tracking-[1.5px] uppercase ${paradoxMode ? "text-[#8bb9dc]/70" : "text-[#c6b89e]/70"} select-none`}>
                        {sec.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Beautiful customized editorial styling block quotes */}
                  <div className="my-6 border-l-2 pl-4 border-[#c6b89e]/20 italic text-white/70 select-text font-serif text-[13.5px] leading-relaxed bg-white/[0.01] py-3 pr-2">
                    &ldquo;{sec.quote}&rdquo;
                  </div>

                  {/* Splitting block text into paragraphs and nested headers */}
                  <div className="space-y-4 pt-2 select-text">
                    {sec.copy.split("\n\n").map((para, pIdx) => {
                      const isUppercaseLabel = para === para.toUpperCase() && para.length < 50;
                      return isUppercaseLabel ? (
                        <h4 key={pIdx} className={`font-mono text-[11px] tracking-[2.5px] uppercase pt-4 block font-bold ${paradoxMode ? "text-[#8bb9dc]" : "text-[#c6b89e]"}`}>
                          ✦ {para}
                        </h4>
                      ) : (
                        <p key={pIdx} className="text-[13.5px] font-sans font-normal text-white/55 leading-relaxed font-light text-justify whitespace-pre-wrap">
                          {para}
                        </p>
                      );
                    })}
                  </div>

                  {/* Bottom divider bar */}
                  <div className="border-t border-white/5 pt-4 mt-8 flex justify-between items-center text-[7px] font-mono text-white/30 select-none">
                    <span>CHRONICLE_0{sec.num}_PLATE // VERIFIED_REP</span>
                    <span>COSMOS: {paradoxMode ? "OMEGA_RECAST" : "ALPHA_REALM_STABLE"}</span>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="text-[9px] font-mono tracking-[4px] text-white/20 uppercase text-center select-none pt-8">
            — END OF RECORDEE DOSSIER —
          </div>
        </div>
      )}

      {/* ================= CLOSING STATEMENT BOTTOM PANEL ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`border p-8 mt-12 relative text-center flex flex-col items-center justify-center space-y-6 ${
          paradoxMode 
            ? "border-[#8bb9dc]/30 bg-black/80 shadow-[0_0_35px_rgba(139,185,220,0.1)]" 
            : "border-[#c6b89e]/20 bg-[#060606]/85"
        }`}
      >
        <span className={`absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l ${paradoxMode ? "border-[#8bb9dc]" : "border-[#c6b89e]"}`} />
        <span className={`absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r ${paradoxMode ? "border-[#8bb9dc]" : "border-[#c6b89e]"}`} />
        
        <Crown className={`w-8 h-8 ${paradoxMode ? "text-[#8bb9dc] animate-bounce" : "text-[#c6b89e] animate-pulse"}`} style={{ animationDuration: "4s" }} />

        <div className="max-w-xl mx-auto space-y-4">
          <span className="font-mono text-[8px] tracking-[4px] text-white/30 uppercase block">UNIFYING EMPIREAL COVENANT</span>
          <h3 className="font-serif text-2xl text-white tracking-widest uppercase leading-snug select-none">
            CLOSING STANDARD STATUS STATEMENT
          </h3>
          
          <div className="space-y-3 pt-2 text-justify select-text">
            <p className="font-serif text-[15px] italic font-light text-white/95 leading-relaxed text-center">
              &ldquo;KingShadP is a living mythology. A character that became real. An empire being built. Not by one person. By thousands of believers. All adding to the mythology. All making it real. This is just the beginning.&rdquo;
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4 justify-center items-center select-none">
          <div className="text-[8.5px] font-mono text-white/35 uppercase tracking-[1px]">
            TRANSCRIPTION REPLICA APPROVED BY KINGSHADP // SECURE CABINET L8
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
