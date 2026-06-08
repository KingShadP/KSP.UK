/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Settings, 
  FolderLock, 
  Check, 
  Trash2, 
  Plus, 
  Disc, 
  BookOpen, 
  Terminal, 
  Dices, 
  Save, 
  RefreshCw 
} from "lucide-react";

interface Release {
  id: string;
  title: string;
  era: string;
  year: number;
  mood: string;
  type: string;
  plays: string;
  description: string;
  mythology: string;
  img: string;
  platformLinks: { label: string; url: string }[];
}

interface Lore {
  id: string;
  num: string;
  title: string;
  heading: string;
  category: string;
  icon: string;
  tagline: string;
  quote: string;
  copy: string;
}

interface GeneralSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroQuote: string;
  heroDescription: string;
}

interface CmsData {
  general: GeneralSettings;
  releases: Release[];
  lore: Lore[];
}

export default function AdminSection() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const [cmsData, setCmsData] = useState<CmsData | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"general" | "releases" | "lore">("general");
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [selectedLoreId, setSelectedLoreId] = useState<string | null>(null);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Load CMS Data initially
  useEffect(() => {
    fetchCmsData();
    
    // Check if passcode was already entered in current session
    const savedPass = sessionStorage.getItem("kingshadp_admin_passcode");
    if (savedPass) {
      validateStoredPasscode(savedPass);
    }
  }, []);

  const fetchCmsData = async () => {
    try {
      const response = await fetch("/api/cms");
      if (response.ok) {
        const data = await response.json();
        setCmsData(data);
      } else {
        console.error("Failed to read CMS configuration from backend api.");
      }
    } catch (err) {
      console.error("Error fetching CMS data:", err);
    }
  };

  const validateStoredPasscode = async (pass: string) => {
    try {
      const response = await fetch("/api/cms");
      const testData = await response.json();
      
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": pass
        },
        body: JSON.stringify(testData)
      });
      
      if (res.ok) {
        setPasscode(pass);
        setIsAuthenticated(true);
      }
    } catch (err) {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      // Validate the passcode by attempting a safe read or test push
      const testRes = await fetch("/api/cms");
      if (!testRes.ok) throw new Error("Could not contact CMS database service.");
      const currentVal = await testRes.json();
      
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode
        },
        body: JSON.stringify(currentVal) // sending current to prove authorization
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("kingshadp_admin_passcode", passcode);
        window.dispatchEvent(new CustomEvent("telemetry-log", {
          detail: { message: "🔑 [ACCESS_GRANTED] Administrative login validated successfully. Live database stream active.", type: "SUCCESS" }
        }));
      } else {
        const errJson = await res.json();
        setAuthError(errJson.error || "ACCESS_DENIED: Stated coordinate credential was rejected.");
        window.dispatchEvent(new CustomEvent("telemetry-log", {
          detail: { message: "⚠️ [ACCESS_DENIED] Authentication credential collision. System locked.", type: "WARNING" }
        }));
      }
    } catch (err: any) {
      setAuthError("Failed connection to administrative portal: " + err.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    sessionStorage.removeItem("kingshadp_admin_passcode");
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { message: "🔒 [LOGOUT] Securely closed administrative session portal.", type: "SYSTEM" }
    }));
  };

  const handleSaveAll = async () => {
    if (!cmsData) return;
    setSaveStatus("saving");
    setStatusMessage("Writing secure parameters to system database...");
    
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode
        },
        body: JSON.stringify(cmsData)
      });

      if (res.ok) {
        setSaveStatus("saved");
        setStatusMessage("Sovereign CMS configuration securely written in real-time.");
        
        // Dispatch refresh so client sections automatically pick up the live data
        window.dispatchEvent(new CustomEvent("cms-data-updated", { detail: cmsData }));
        window.dispatchEvent(new CustomEvent("telemetry-log", {
          detail: { message: "💾 [DATABASE_COMMITTED] Secure system files written and synchronized instantly with the workspace.", type: "SUCCESS" }
        }));
        
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        const errObj = await res.json();
        setSaveStatus("error");
        setStatusMessage(errObj.error || "Execution gateway refused write command.");
      }
    } catch (err: any) {
      setSaveStatus("error");
      setStatusMessage("Failed connection to repository server: " + err.message);
    }
  };

  // Restores standard factory defaults
  const handleFactoryReset = async () => {
    if (!window.confirm("Restore entire virtual kingdom database settings to pristine factory defaults? All manual edits will be overwritten.")) {
      return;
    }
    
    try {
      // Reload the initial file by fetching from a hardcoded payload or original JSON template
      const res = await fetch("/src/data/cmsData.json"); // default template copy
      if (!res.ok) throw new Error("Could not reload initial local template.");
      const defaultState = await res.json();
      
      setCmsData(defaultState);
      
      const pushRes = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode
        },
        body: JSON.stringify(defaultState)
      });
      
      if (pushRes.ok) {
        window.dispatchEvent(new CustomEvent("cms-data-updated", { detail: defaultState }));
        window.dispatchEvent(new CustomEvent("telemetry-log", {
          detail: { message: "🔄 [FACTORY_RESTORE] Restoration script executed cleanly. Rewritten all coordinate sectors.", type: "SYSTEM" }
        }));
        alert("System parameters successfully reverted to static default alignments.");
      }
    } catch (err: any) {
      alert("Error carrying out restoration loop: " + err.message);
    }
  };

  // Helper managers for General Settings
  const handleGeneralChange = (key: keyof GeneralSettings, val: string) => {
    if (!cmsData) return;
    setCmsData({
      ...cmsData,
      general: {
        ...cmsData.general,
        [key]: val
      }
    });
  };

  // Helper managers for Releases
  const handleReleaseChange = (index: number, key: keyof Release, val: any) => {
    if (!cmsData) return;
    const reles = [...cmsData.releases];
    reles[index] = {
      ...reles[index],
      [key]: val
    };
    setCmsData({ ...cmsData, releases: reles });
  };

  const handleAddRelease = () => {
    if (!cmsData) return;
    const newId = "rel-" + Date.now();
    const newRel: Release = {
      id: newId,
      title: "UNRELEASED SYSTEM BOOTSTRAP",
      era: "Sovereign Spatial",
      year: new Date().getFullYear(),
      mood: "Experimental",
      type: "Draft",
      plays: "0 plays",
      description: "A brand-new raw acoustic capsule generated through administrative console lines.",
      mythology: "Recorded dynamically through the CMS edit studio. A perfect testament to absolute sovereign operational autonomy.",
      img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
      platformLinks: [
        { label: "SoundCloud", url: "https://soundcloud.com" }
      ]
    };

    setCmsData({
      ...cmsData,
      releases: [newRel, ...cmsData.releases]
    });
    setSelectedReleaseId(newId);
    
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { message: `🆕 [TRACK_CREATED] Appended new track buffer '${newRel.title}' in stack.`, type: "SUCCESS" }
    }));
  };

  const handleDeleteRelease = (id: string, name: string) => {
    if (!cmsData) return;
    if (!window.confirm(`Permanently erase '${name}' from broadcast list?`)) return;
    
    const reles = cmsData.releases.filter(r => r.id !== id);
    setCmsData({ ...cmsData, releases: reles });
    if (selectedReleaseId === id) setSelectedReleaseId(null);
    
    window.dispatchEvent(new CustomEvent("telemetry-log", {
      detail: { message: `❌ [TRACK_DELETED] Removed track coordinate '${name}' from active index.`, type: "WARNING" }
    }));
  };

  // Helper managers for Lore chapters
  const handleLoreChange = (index: number, key: keyof Lore, val: string) => {
    if (!cmsData) return;
    const chaps = [...cmsData.lore];
    chaps[index] = {
      ...chaps[index],
      [key]: val
    };
    setCmsData({ ...cmsData, lore: chaps });
  };

  return (
    <div id="section-admin" className="w-full flex flex-col gap-10 py-24 mb-12 text-left relative min-h-[600px]">
      <div className="absolute top-[88px] left-0 font-mono text-[8.5px] tracking-[5px] text-[#c6b89e]/30 uppercase select-none">
        99 // SECURE KINGDOM CONSOLE / ADMIN CMS
      </div>

      {!isAuthenticated ? (
        /* LOCK SCREEN PANEL */
        <div className="max-w-md mx-auto w-full mt-12 bg-black/80 border border-[#c6b89e]/20 p-8 relative shadow-2xl">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#ff4a00]" />
          
          <div className="flex flex-col items-center text-center space-y-4 mb-8 select-none">
            <div className="w-12 h-12 rounded-full border border-dashed border-[#ff4a00]/30 bg-red-950/20 flex items-center justify-center">
              <FolderLock className="w-5 h-5 text-[#ff4a00] animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-white tracking-wide uppercase">SANCTUM LOCK</h3>
              <p className="font-mono text-[9px] tracking-[2px] text-white/40 mt-1 uppercase">
                AUTHORIZED EMPIRE ADMINISTRATORS ONLY
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="passcode-input" className="block font-mono text-[8.5px] tracking-[2.5px] text-[#c6b89e] uppercase mb-2">
                ENTER SECURE KEY CODE:
              </label>
              <input
                id="passcode-input"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="🔑 ADMINISTRATIVE_PASSCODE"
                className="w-full bg-[#030303] border border-white/10 px-4 py-3.5 font-mono text-[11px] text-white tracking-[4px] outline-none focus:border-[#ff4a00] transition-all rounded-none text-center"
              />
            </div>

            {authError && (
              <div className="p-3 border border-red-500/30 bg-red-950/10 text-red-400 font-mono text-[9.5px] tracking-[1px] uppercase leading-relaxed text-center">
                ⚠ {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#c6b89e] text-black text-[9.5px] font-mono font-bold tracking-[4px] uppercase hover:bg-[#ff4a00] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              AUTHENTICATE COGNITIVE LINK
            </button>
          </form>

          <p className="text-[10px] text-white/30 font-mono text-center leading-relaxed font-light mt-6">
            Tip: The passcode defaults to <span className="text-[#c6b89e] font-bold select-all">kingshadp_admin</span> unless you customized ADMIN_PASSCODE in the AI Studio environment variables panel.
          </p>
        </div>
      ) : (
        /* FULL CMS WORKSPACE PANEL */
        <div className="w-full border border-[#c6b89e]/20 bg-[#050505]/95 p-6 md:p-8 relative">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-6 mb-8 gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <h2 className="font-serif text-3xl text-white tracking-widest uppercase">
                  EMPIRE CONTROL DECK
                </h2>
              </div>
              <p className="font-mono text-[9px] tracking-[2.5px] text-[#c6b89e] uppercase mt-1">
                SECURE LIVE REPOSITORY ENGINE // DISK SYNC ENGAGED
              </p>
            </div>

            {/* Global Actions */}
            <div className="flex flex-wrap items-center gap-3 select-none">
              <button
                onClick={handleFactoryReset}
                className="px-4 py-2 border border-red-500/20 bg-red-950/10 hover:bg-red-950/30 text-red-400 font-mono text-[8.5px] tracking-[2px] uppercase cursor-pointer"
                title="Wipe database and restore default values"
              >
                [ RESET TO SYSTEM DEFAULTS ]
              </button>

              <button
                onClick={handleSaveAll}
                disabled={saveStatus === "saving"}
                className={`px-6 py-2.5 font-mono text-[9.5px] tracking-[3px] font-bold uppercase cursor-pointer flex items-center gap-2 transition-all ${
                  saveStatus === "saving"
                    ? "bg-white/10 text-white/40 border border-white/10"
                    : "bg-[#c6b89e] text-black hover:bg-[#ff4a00] hover:text-white"
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                {saveStatus === "saving" ? "WRITING DISK..." : "COMMIT LIVE UPDATES"}
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-white/10 hover:border-[#ff4a00] text-white/50 hover:text-white font-mono text-[8.5px] tracking-[2px] uppercase cursor-pointer"
              >
                [ LOCK ]
              </button>
            </div>
          </div>

          {/* Action telemetry readout */}
          {statusMessage && (
            <div className={`p-4 mb-6 border font-mono text-[10.5px] tracking-[1.5px] uppercase flex items-center justify-between ${
              saveStatus === "saved" 
                ? "border-emerald-500/30 bg-emerald-950/10 text-emerald-400"
                : saveStatus === "error"
                ? "border-red-500/30 bg-red-950/10 text-red-500"
                : "border-[#c6b89e]/30 bg-[#c6b89e]/5 text-[#c6b89e]"
            }`}>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage("")} className="text-white/40 hover:text-white">✕</button>
            </div>
          )}

          {/* Configuration sub-tabs selectors */}
          <div className="flex border-b border-white/15 pb-4 mb-8 gap-3 select-none">
            {[
              { id: "general", label: "01 // LANDMARK HEADINGS", icon: Settings },
              { id: "releases", label: "02 // ACQUIRED DISCOGRAPHY", icon: Disc },
              { id: "lore", label: "03 // LORE DIRECTORY", icon: BookOpen }
            ].map((subT) => {
              const Selected = activeSubTab === subT.id;
              const TIcon = subT.icon;
              return (
                <button
                  key={subT.id}
                  onClick={() => {
                    setActiveSubTab(subT.id as any);
                    setStatusMessage("");
                  }}
                  className={`px-5 py-3 border font-mono text-[9px] tracking-[2.5px] uppercase transition-all cursor-pointer flex items-center gap-2 ${
                    Selected
                      ? "border-[#c6b89e] bg-[#c6b89e]/15 text-white font-bold"
                      : "border-white/5 bg-black/40 text-white/40 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <TIcon className="w-3.5 h-3.5" />
                  {subT.label}
                </button>
              );
            })}
          </div>

          {/* SUBTAB DETAILS */}
          {cmsData ? (
            <div className="space-y-6">
              
              {/* SUBTAB A: GENERAL SYSTEM TEXTS */}
              {activeSubTab === "general" && (
                <div className="grid grid-cols-1 gap-6 bg-black/45 p-6 border border-white/5 select-text">
                  <div className="font-mono text-[9px] text-[#c6b89e] tracking-[3px] uppercase border-b border-white/10 pb-3 mb-2">
                    LANDMARK ATRIUM TEXT FIELDS
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[8px] tracking-[2px] text-white/50 mb-2 uppercase">
                        HERO EMPIRE TITLE:
                      </label>
                      <input
                        type="text"
                        value={cmsData.general.heroTitle}
                        onChange={(e) => handleGeneralChange("heroTitle", e.target.value)}
                        className="w-full bg-[#030303] border border-white/10 px-4 py-3 font-serif text-[18px] text-white outline-none focus:border-[#c6b89e]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[8px] tracking-[2px] text-white/50 mb-2 uppercase">
                        HERO SUBTITLE VIBES SLOGAN:
                      </label>
                      <input
                        type="text"
                        value={cmsData.general.heroSubtitle}
                        onChange={(e) => handleGeneralChange("heroSubtitle", e.target.value)}
                        className="w-full bg-[#030303] border border-white/10 px-4 py-3 font-sans text-xs text-white uppercase tracking-[3px] outline-none focus:border-[#c6b89e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[8px] tracking-[2px] text-white/50 mb-2 uppercase">
                      HERO PERSISTENT STATEMENT QUOTE:
                    </label>
                    <input
                      type="text"
                      value={cmsData.general.heroQuote}
                      onChange={(e) => handleGeneralChange("heroQuote", e.target.value)}
                      className="w-full bg-[#030303] border border-white/10 px-4 py-3 font-serif italic text-sm text-white outline-none focus:border-[#c6b89e]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[8px] tracking-[2px] text-white/50 mb-2 uppercase">
                      MUSEUM ATRIUM SUMMARY EXEGESIS DESCRIPTION:
                    </label>
                    <textarea
                      rows={4}
                      value={cmsData.general.heroDescription}
                      onChange={(e) => handleGeneralChange("heroDescription", e.target.value)}
                      className="w-full bg-[#030303] border border-white/10 p-4 font-sans text-xs text-white/70 leading-relaxed outline-none focus:border-[#c6b89e]"
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB B: MUSIC COLLECTION */}
              {activeSubTab === "releases" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left list panel */}
                  <div className="lg:col-span-4 space-y-2 select-none border-r border-white/10 pr-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[8px] text-[#c6b89e] tracking-[2.5px] uppercase">
                        ACTIVE STREAM STACKS:
                      </span>
                      <button
                        onClick={handleAddRelease}
                        className="px-2.5 py-1 bg-[#ff4a00]/20 hover:bg-[#ff4a00] border border-[#ff4a00]/30 text-white font-mono text-[7px] tracking-[1.5px] uppercase cursor-pointer rounded-sm flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> ADD NEW
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {cmsData.releases.map((rel, index) => {
                        const isSelected = selectedReleaseId === rel.id;
                        return (
                          <div
                            key={rel.id}
                            className={`w-full p-3 border text-left flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#ff4a00] bg-[#ff4a00]/5"
                                : "border-white/5 hover:border-white/10 bg-black/40"
                            }`}
                            onClick={() => setSelectedReleaseId(rel.id)}
                          >
                            <div className="truncate pr-2">
                              <span className="font-mono text-[7px] text-white/30 mr-1.5 uppercase tracking-wider">{rel.era}</span>
                              <div className="text-[13px] font-serif text-white truncate italic">{rel.title}</div>
                              <span className="font-mono text-[7.5px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-1 py-0.2 uppercase mt-1 inline-block">
                                {rel.mood} // {rel.type}
                              </span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRelease(rel.id, rel.title);
                              }}
                              className="p-2 border border-white/5 hover:border-red-500 hover:text-red-500 text-white/30 rounded-sm cursor-pointer shrink-0 transition-colors"
                              title="Delete track"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right edit form */}
                  <div className="lg:col-span-8 bg-black/55 p-6 border border-white/5 select-text">
                    {selectedReleaseId ? (
                      (() => {
                        const relIdx = cmsData.releases.findIndex(r => r.id === selectedReleaseId);
                        if (relIdx === -1) return null;
                        const rel = cmsData.releases[relIdx];

                        return (
                          <div className="space-y-4">
                            <div className="font-mono text-[9px] text-[#ff4a00] tracking-[4px] uppercase border-b border-white/5 pb-2 mb-4">
                              TRACK EDIT FRAME: {rel.title}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  RELEASE TITLE:
                                </label>
                                <input
                                  type="text"
                                  value={rel.title}
                                  onChange={(e) => handleReleaseChange(relIdx, "title", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-serif text-md text-white outline-none focus:border-[#ff4a00]"
                                />
                              </div>

                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  ERA TAG:
                                </label>
                                <input
                                  type="text"
                                  value={rel.era}
                                  onChange={(e) => handleReleaseChange(relIdx, "era", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#ff4a00]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  RELEASE YEAR:
                                </label>
                                <input
                                  type="number"
                                  value={rel.year}
                                  onChange={(e) => handleReleaseChange(relIdx, "year", parseInt(e.target.value) || new Date().getFullYear())}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-xs text-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  RECORD METRIC (PLAYS):
                                </label>
                                <input
                                  type="text"
                                  value={rel.plays}
                                  onChange={(e) => handleReleaseChange(relIdx, "plays", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-xs text-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  MOOD (Raw/Melodic/Experimental etc):
                                </label>
                                <input
                                  type="text"
                                  value={rel.mood}
                                  onChange={(e) => handleReleaseChange(relIdx, "mood", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-xs text-white outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  FORMAT TYPE (Official/Draft/Remix):
                                </label>
                                <select
                                  value={rel.type}
                                  onChange={(e) => handleReleaseChange(relIdx, "type", e.target.value)}
                                  className="w-full bg-[#030303] text-white border border-white/10 px-3 py-2 font-mono text-xs outline-none"
                                >
                                  <option value="Official">Official Release</option>
                                  <option value="Draft">Draft Demo</option>
                                  <option value="Remix">Remix & Cover</option>
                                </select>
                              </div>

                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  ARTWORK SOURCE COVER URL:
                                </label>
                                <input
                                  type="text"
                                  value={rel.img}
                                  onChange={(e) => handleReleaseChange(relIdx, "img", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-[10px] text-white outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                ACCOMPLISHING SYNOPSIS (BRIEF):
                              </label>
                              <input
                                type="text"
                                value={rel.description}
                                onChange={(e) => handleReleaseChange(relIdx, "description", e.target.value)}
                                className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-sans text-xs text-white/80 outline-none focus:border-[#ff4a00]"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                MYTHOLOGICAL BRIEF CONTEXT COPY:
                              </label>
                              <textarea
                                rows={4}
                                value={rel.mythology}
                                onChange={(e) => handleReleaseChange(relIdx, "mythology", e.target.value)}
                                className="w-full bg-[#030303] border border-white/10 p-3 font-sans text-xs text-white/70 leading-relaxed outline-none focus:border-[#ff4a00]"
                              />
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-white/30 font-mono text-xs select-none">
                        SELECT A SYSTEM AUDIO TRACK TO TRIGGER EDIT SEQUENCE OR HOOK IN NEW BROADCASTS.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB C: LORE MATRIX */}
              {activeSubTab === "lore" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left chapters selection list */}
                  <div className="lg:col-span-4 space-y-1.5 select-none border-r border-white/10 pr-6 max-h-[500px] overflow-y-auto">
                    <span className="font-mono text-[8px] text-[#c6b89e] tracking-[2.5px] block mb-3 uppercase">
                      SELECT LORE SECTOR:
                    </span>
                    {cmsData.lore.map((sec, index) => {
                      const isSelected = selectedLoreId === sec.id;
                      return (
                        <button
                          key={sec.id}
                          className={`w-full p-3 border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#c6b89e] bg-[#c6b89e]/10 text-white"
                              : "border-white/5 hover:border-white/10 bg-black/40 text-white/50"
                          }`}
                          onClick={() => {
                            setSelectedLoreId(sec.id);
                            setStatusMessage("");
                          }}
                        >
                          <span className="font-mono text-[7.5px] text-[#c6b89e] mr-1.5">[{sec.num}]</span>
                          <span className="font-serif text-[13px] uppercase tracking-wide">{sec.title}</span>
                          <p className="font-mono text-[7px] text-white/30 truncate uppercase mt-0.5">{sec.category}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right edit viewport form */}
                  <div className="lg:col-span-8 bg-black/55 p-6 border border-white/5 select-text">
                    {selectedLoreId ? (
                      (() => {
                        const secIdx = cmsData.lore.findIndex(l => l.id === selectedLoreId);
                        if (secIdx === -1) return null;
                        const sec = cmsData.lore[secIdx];

                        return (
                          <div className="space-y-4 animate-fadeIn">
                            <div className="font-mono text-[9px] text-[#c6b89e] tracking-[4px] uppercase border-b border-white/5 pb-2 mb-4">
                              MYTHOLOGY DIRECTORY CHAPTER EDIT: {sec.title}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  INDEX LABEL TITLE:
                                </label>
                                <input
                                  type="text"
                                  value={sec.title}
                                  onChange={(e) => handleLoreChange(secIdx, "title", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-serif text-md text-white outline-none focus:border-[#c6b89e]"
                                />
                              </div>

                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  INNER PAGE HEADING:
                                </label>
                                <input
                                  type="text"
                                  value={sec.heading}
                                  onChange={(e) => handleLoreChange(secIdx, "heading", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-serif text-md text-white outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  CATEGORY CLASSIFICATION (e.g. ACOUSTIC INTEL):
                                </label>
                                <input
                                  type="text"
                                  value={sec.category}
                                  onChange={(e) => handleLoreChange(secIdx, "category", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-xs text-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                  ATMOSPHERIC TAGLINE BAR:
                                </label>
                                <input
                                  type="text"
                                  value={sec.tagline}
                                  onChange={(e) => handleLoreChange(secIdx, "tagline", e.target.value)}
                                  className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-mono text-xs text-white outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                LEAD FEATURED DIRECTIVE QUOTE COGNITIVE:
                              </label>
                              <input
                                type="text"
                                value={sec.quote}
                                onChange={(e) => handleLoreChange(secIdx, "quote", e.target.value)}
                                className="w-full bg-[#030303] border border-white/10 px-3 py-2 font-serif italic text-sm text-white outline-none focus:border-[#c6b89e]"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[7.5px] tracking-[2px] text-white/40 mb-1.5 uppercase">
                                SAGA DIARY TEXT PASSAGE (Supports multiline paragraphs):
                              </label>
                              <textarea
                                rows={10}
                                value={sec.copy}
                                onChange={(e) => handleLoreChange(secIdx, "copy", e.target.value)}
                                className="w-full bg-[#030303] border border-white/10 p-3 font-sans text-xs text-white/70 leading-relaxed outline-none focus:border-[#c6b89e] whitespace-pre-wrap"
                              />
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-white/30 font-mono text-xs select-none">
                        SELECT A LORE CHAPTER IN THE SIDEBAR LIST TO UNPACK AND TRIGGER EDITING CRITERIA.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 font-mono text-xs text-white/30">
              <RefreshCw className="w-5 h-5 animate-spin mb-4 text-[#c6b89e]" />
              ESTABLISHING ENCRYPTED DATAFEED SYNC ROUTINE...
            </div>
          )}

          {/* Footer warning stamp */}
          <div className="mt-8 pt-6 border-t border-white/10 select-none text-[8px] font-mono flex flex-col md:flex-row justify-between text-white/20 gap-2">
            <span>DATABASE_ENGINE_STATUS: SYNCHRONIZED nominal lines // 100% SECURE</span>
            <span>PROTECTED DIRECTIVE 98 // KINGSHADP DIGITAL RECONNAISSANCE GRP</span>
          </div>

        </div>
      )}
    </div>
  );
}
