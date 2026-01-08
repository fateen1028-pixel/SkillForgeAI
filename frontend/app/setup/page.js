"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!APP_URL) {
  console.error("NEXT_PUBLIC_APP_URL is not defined");
}

// const GOALS = [
//   { id: "placement", label: "Campus Placements", icon: "🎯", desc: "Prepare for college placements" },
//   { id: "switch", label: "Job Switch", icon: "🔄", desc: "Switch to a better role" },
//   { id: "upskill", label: "Upskilling", icon: "📈", desc: "Level up current skills" },
//   { id: "internship", label: "Internship", icon: "💼", desc: "Land an internship" },
// ];

const SKILLS_TO_LEARN = [
  { id: "dsa", label: "Data Structures & Algorithms", icon: "🔢" },
  { id: "webdev", label: "Web Development", icon: "🌐" },
  { id: "system-design", label: "System Design", icon: "🏗️" },
  { id: "databases", label: "Databases & SQL", icon: "🗄️" },
  { id: "os", label: "Operating Systems", icon: "💻" },
  { id: "networking", label: "Computer Networks", icon: "🌍" },
  { id: "oops", label: "OOPs Concepts", icon: "🧱" },
  { id: "aptitude", label: "Aptitude & Reasoning", icon: "🧠" },
];

const KNOWN_LANGUAGES = [
  { id: "python", label: "Python", icon: "🐍" },
  { id: "javascript", label: "JavaScript", icon: "⚡" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "cpp", label: "C++", icon: "⚙️" },
  { id: "c", label: "C", icon: "🔷" },
  { id: "typescript", label: "TypeScript", icon: "📘" },
  { id: "go", label: "Go", icon: "🐹" },
  { id: "rust", label: "Rust", icon: "🦀" },
  { id: "csharp", label: "C#", icon: "🟣" },
  { id: "kotlin", label: "Kotlin", icon: "🟠" },
  { id: "swift", label: "Swift", icon: "🍎" },
  { id: "php", label: "PHP", icon: "🐘" },
  { id: "ruby", label: "Ruby", icon: "💎" },
  { id: "sql", label: "SQL", icon: "🗃️" },
  { id: "scala", label: "Scala", icon: "🔴" },
  { id: "dart", label: "Dart", icon: "🎯" },
];

// const TIME_AVAILABILITY = [
//   { id: "1-month", label: "1 Month", icon: "⚡", desc: "Intensive crash course" },
//   { id: "2-months", label: "2 Months", icon: "🔥", desc: "Fast-paced learning" },
//   { id: "3-months", label: "3 Months", icon: "📅", desc: "Balanced approach" },
//   { id: "6-months", label: "6 Months", icon: "📚", desc: "Thorough preparation" },
//   { id: "12-months", label: "12 Months", icon: "🎯", desc: "Comprehensive mastery" },
// ];

// const EXPERIENCE_LEVELS = [
//   { id: "fresher", label: "Fresher", desc: "No prior experience", icon: "🌱" },
//   { id: "beginner", label: "Beginner", desc: "Less than 1 year", icon: "📚" },
//   { id: "intermediate", label: "Intermediate", desc: "1-3 years experience", icon: "⚡" },
//   { id: "experienced", label: "Experienced", desc: "3+ years experience", icon: "🚀" },
// ];

const TOTAL_STEPS = 2;

export default function SetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  
  // Form states
  // Honest defaults - no fake data
  // V1 is single-track (DSA), so we model it as a single string, not an array
  const [selectedTrack, setSelectedTrack] = useState(""); 
  const [knownLanguages, setKnownLanguages] = useState([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check authentication on mount
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user && user.is_setup_completed) {
        router.push("/dashboard");
      }
    }
  }, [user, isAuthenticated, loading, router]);

  const submitSetup = async (data) => {
    try {
      const res = await fetch(`${APP_URL}/api/setup_user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Setup failed");
      }

      // Initialize roadmap
      const roadmapRes = await fetch(`${APP_URL}/roadmap/init`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!roadmapRes.ok) {
        const errorData = await roadmapRes.json();
        throw new Error(errorData.detail || "Roadmap initialization failed");
      }
      
      // Update user state to reflect setup completion before redirection
      if (refreshUser) {
        await refreshUser();
      }

      // Force a router refresh or push to ensure auth state updates
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setError("");
    setIsLoading(true);
    
    const setupData = {
      // Map single track to backend expected array format
      goals: selectedTrack ? [selectedTrack] : [],
      prior_exposure_languages: knownLanguages,
    };
    
    await submitSetup(setupData);
  };

  const handleDefaultSetup = async () => {
    setError("");
    setIsLoading(true);

    const defaultData = {
      goals: ["dsa"],
      prior_exposure_languages: ["python"],
    };

    await submitSetup(defaultData);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedTrack !== "";
      case 2: return true; // Allow empty languages for complete beginners
      default: return false;
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">What do you want to learn?</h1>
              <p className="text-slate-400">Select a skill to focus on</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {SKILLS_TO_LEARN.map((skill) => {
                const isSelected = selectedTrack === skill.id;
                const isDisabled = skill.id !== 'dsa'; // Only DSA is enabled for v1
                
                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedTrack(skill.id)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                        : isDisabled
                        ? "border-white/5 bg-white/2 opacity-60 cursor-not-allowed"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium block">{skill.label}</span>
                        {isDisabled && (
                          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">Coming Soon</span>
                        )}
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-white/20"
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💻</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Known Languages</h1>
              <p className="text-slate-400">Select all programming languages you know</p>
              {knownLanguages.length > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs text-emerald-400 font-medium">{knownLanguages.length} selected</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {KNOWN_LANGUAGES.map((lang) => {
                const isSelected = knownLanguages.includes(lang.id);
                return (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setKnownLanguages(prev => 
                        prev.includes(lang.id) 
                          ? prev.filter(l => l !== lang.id) 
                          : [...prev, lang.id]
                      );
                    }}
                    className={`p-4 rounded-xl border text-center transition-all relative ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <span className="text-2xl block mb-2">{lang.icon}</span>
                    <span className="font-medium text-sm">{lang.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-slate-500 mb-4">
              Don&apos;t worry if you&apos;re new — we&apos;ll help you learn!
            </p>
          </>
        );

      default:
        return null;
    }
  };

  const getStepColor = (stepNum) => {
    const colors = {
      1: "cyan",
      2: "emerald",
    };
    return colors[stepNum] || "cyan";
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-8 text-white relative overflow-hidden">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </Link>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[50%] w-150 h-150 bg-[#6366f1]/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[20%] w-100 h-100 bg-[#06b6d4]/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-sm text-slate-400">{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
          
          {/* Step indicators */}
          <div className="flex gap-2 mb-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  s <= step
                    ? s === 1 ? "bg-cyan-500" :
                      "bg-emerald-500"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8">
          {!APP_URL && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              Configuration Error: NEXT_PUBLIC_APP_URL is missing.
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl border border-white/10 font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            <button
              onClick={() => step === TOTAL_STEPS ? handleComplete() : setStep(step + 1)}
              disabled={!canProceed() || isLoading || !APP_URL}
              className={`flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${
                step === 1 ? "bg-linear-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25" :
                "bg-linear-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : step === TOTAL_STEPS ? (
                <>
                  Get Started
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Default Setup option */}
        {/* <button
          onClick={handleDefaultSetup}
          disabled={isLoading || !APP_URL}
          className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
        >
          Skip setup and start with defaults (DSA + Python) →
        </button> */}
      </div>
    </div>
  );
}
