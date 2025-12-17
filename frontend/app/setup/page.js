"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const GOALS = [
  { id: "placement", label: "Campus Placements", icon: "🎯", desc: "Prepare for college placements" },
  { id: "switch", label: "Job Switch", icon: "🔄", desc: "Switch to a better role" },
  { id: "upskill", label: "Upskilling", icon: "📈", desc: "Level up current skills" },
  { id: "internship", label: "Internship", icon: "💼", desc: "Land an internship" },
];

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

const TIME_AVAILABILITY = [
  { id: "1-month", label: "1 Month", icon: "⚡", desc: "Intensive crash course" },
  { id: "2-months", label: "2 Months", icon: "🔥", desc: "Fast-paced learning" },
  { id: "3-months", label: "3 Months", icon: "📅", desc: "Balanced approach" },
  { id: "6-months", label: "6 Months", icon: "📚", desc: "Thorough preparation" },
  { id: "12-months", label: "12 Months", icon: "🎯", desc: "Comprehensive mastery" },
];

const EXPERIENCE_LEVELS = [
  { id: "fresher", label: "Fresher", desc: "No prior experience", icon: "🌱" },
  { id: "beginner", label: "Beginner", desc: "Less than 1 year", icon: "📚" },
  { id: "intermediate", label: "Intermediate", desc: "1-3 years experience", icon: "⚡" },
  { id: "experienced", label: "Experienced", desc: "3+ years experience", icon: "🚀" },
];

const TOTAL_STEPS = 5;

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isSetupCompleted, setIsSetupCompleted] = useState(null);
  
  // Form states (Step 1,4,5 single select; Step 2,3 multi-select)
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [knownLanguages, setKnownLanguages] = useState([]);
  const [timeAvailability, setTimeAvailability] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${APP_URL}/api/current_user`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setIsSetupCompleted(data.is_setup_completed);
          
          // Redirect if setup already completed
          if (data.is_setup_completed) {
            router.push("/dashboard");
          }
        } else {
          setIsAuthenticated(false);
          router.push("/auth/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.push("/auth/login");
      }
    }
    checkAuth();
  }, [router]);

  const handleComplete = async () => {
    setError("");
    setIsLoading(true);
    
    const setupData = {
      goal: selectedGoal,
      skills: selectedSkills,
      languages: knownLanguages,
      time_availability: timeAvailability,
      experience_level: experienceLevel,
    };
    
    try {
      const res = await fetch(`${APP_URL}/api/setup_user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(setupData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Setup failed");
      }
      
      setIsSetupCompleted(true);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedGoal !== "";
      case 2: return selectedSkills.length > 0;
      case 3: return knownLanguages.length > 0;
      case 4: return timeAvailability !== "";
      case 5: return experienceLevel !== "";
      default: return false;
    }
  };

  // Toggle function for multi-select
  const toggleSelection = (id, selected, setSelected, maxSelections = null) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      // Check max selections limit
      if (maxSelections && selected.length >= maxSelections) {
        return; // Don't add more if limit reached
      }
      setSelected([...selected, id]);
    }
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
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
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">What&apos;s your goal?</h1>
              <p className="text-slate-400">Select your primary goal</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-4 rounded-xl border text-left transition-all group ${
                    selectedGoal === goal.id
                      ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium block">{goal.label}</span>
                      <span className="text-xs text-slate-400">{goal.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedGoal === goal.id
                        ? "border-violet-500 bg-violet-500"
                        : "border-white/20"
                    }`}>
                      {selectedGoal === goal.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">What do you want to learn?</h1>
              <p className="text-slate-400">Select up to 2 skills you want to focus on</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <span className={`text-xs font-medium ${selectedSkills.length === 2 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {selectedSkills.length}/2 selected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {SKILLS_TO_LEARN.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                const isDisabled = !isSelected && selectedSkills.length >= 2;
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSelection(skill.id, selectedSkills, setSelectedSkills, 2)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                        : isDisabled
                        ? "border-white/5 bg-white/2 opacity-50 cursor-not-allowed"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-medium flex-1">{skill.label}</span>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-white/20"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        );

      case 3:
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
                    onClick={() => toggleSelection(lang.id, knownLanguages, setKnownLanguages)}
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

      case 4:
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📆</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">How long do you have to prepare?</h1>
              <p className="text-slate-400">Timeline to complete your selected skills</p>
            </div>

            <div className="space-y-3 mb-8">
              {TIME_AVAILABILITY.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setTimeAvailability(time.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    timeAvailability === time.id
                      ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{time.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium block">{time.label}</span>
                      <span className="text-xs text-slate-400">{time.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      timeAvailability === time.id
                        ? "border-amber-500 bg-amber-500"
                        : "border-white/20"
                    }`}>
                      {timeAvailability === time.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">What&apos;s your experience level?</h1>
              <p className="text-slate-400">This helps us personalize your learning path</p>
            </div>

            <div className="space-y-3 mb-8">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setExperienceLevel(level.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    experienceLevel === level.id
                      ? "border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium block">{level.label}</span>
                      <span className="text-xs text-slate-400">{level.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      experienceLevel === level.id
                        ? "border-pink-500 bg-pink-500"
                        : "border-white/20"
                    }`}>
                      {experienceLevel === level.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getStepColor = (stepNum) => {
    const colors = {
      1: "violet",
      2: "cyan",
      3: "emerald",
      4: "amber",
      5: "pink",
    };
    return colors[stepNum] || "violet";
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
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  s <= step
                    ? s === 1 ? "bg-violet-500" :
                      s === 2 ? "bg-cyan-500" :
                      s === 3 ? "bg-emerald-500" :
                      s === 4 ? "bg-amber-500" :
                      "bg-pink-500"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8">
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
              disabled={!canProceed() || isLoading}
              className={`flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 ${
                step === 1 ? "bg-linear-to-r from-violet-600 to-purple-600 hover:shadow-lg hover:shadow-violet-500/25" :
                step === 2 ? "bg-linear-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25" :
                step === 3 ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25" :
                step === 4 ? "bg-linear-to-r from-amber-600 to-orange-600 hover:shadow-lg hover:shadow-amber-500/25" :
                "bg-linear-to-r from-pink-600 to-rose-600 hover:shadow-lg hover:shadow-pink-500/25"
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

        {/* Skip option */}
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
        >
          Skip setup and go to dashboard →
        </button>
      </div>
    </div>
  );
}
