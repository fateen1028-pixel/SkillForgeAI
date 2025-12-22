"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// Motivational quotes
const DAILY_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

// Next Action - roadmap-driven
const NEXT_ACTION = {
  title: "Complete Binary Search Implementation",
  type: "Practice Problem",
  topic: "Data Structures & Algorithms",
  subtopic: "Searching Algorithms",
  estimatedTime: "25 mins",
  priority: "high",
  reason: "Next step in your DSA roadmap",
  href: "/dashboard/roadmap",
};

// Tab configuration - Only keeping core features
const TABS = [
  { 
    id: "tasks", 
    label: "Tasks", 
    description: "Track your daily goals",
    href: "/dashboard/tasks",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  { 
    id: "roadmap", 
    label: "Roadmap", 
    description: "Your learning journey",
    href: "/dashboard/roadmap",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
];

// Current streak (only if tied to meaningful work)
const STREAK_DATA = {
  currentStreak: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
  isActiveToday: true,
};

// Helper: Fetch general user profile from backend
export async function fetchGeneralProfile() {
  try {
    const res = await fetch(`${APP_URL}/api/general_profile`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return await res.json();
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [quote] = useState(() => DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)]);
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isSetupCompleted, setIsSetupCompleted] = useState(null);

  // User profile state
  const [userProfile, setUserProfile] = useState(null);

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
          setMounted(true);
          
          // Redirect to setup if not completed
          if (!data.is_setup_completed) {
            router.push("/setup");
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

  // Fetch user profile on mount
  useEffect(() => {
    async function getProfile() {
      const profile = await fetchGeneralProfile();
      setUserProfile(profile);
    }
    if (isAuthenticated) {
      getProfile();
    }
  }, [isAuthenticated]);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container-app py-6 md:py-10 lg:py-14 max-w-5xl mx-auto">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 mb-4 md:mb-6 px-3 py-1.5 rounded-lg bg-white/3 border border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12 transition-all text-sm font-medium group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Quick Navigation - Core Features Only */}
      <div className={`mb-10 md:mb-14 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3 mb-5 md:mb-7">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">Quick Access</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {TABS.map((tab, index) => {
            const colors = [
              { border: 'border-violet-500/30 hover:border-violet-500/50', bg: 'from-violet-500/15 to-purple-500/5', icon: 'from-violet-500 to-purple-600', text: 'text-violet-400' },
              { border: 'border-cyan-500/30 hover:border-cyan-500/50', bg: 'from-cyan-500/15 to-blue-500/5', icon: 'from-cyan-500 to-blue-600', text: 'text-cyan-400' },
              { border: 'border-emerald-500/30 hover:border-emerald-500/50', bg: 'from-emerald-500/15 to-teal-500/5', icon: 'from-emerald-500 to-teal-600', text: 'text-emerald-400' },
            ];
            const color = colors[index];
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`group relative flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-2xl border ${color.border} bg-gradient-to-br ${color.bg} hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 w-full min-h-[120px] md:min-h-[140px]`}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${color.icon} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {tab.icon}
                </div>
                <div className="text-center w-full">
                  <h3 className="text-lg md:text-xl font-extrabold text-white mb-1 tracking-tight">{tab.label}</h3>
                  <p className="text-xs md:text-sm text-slate-300 font-medium">{tab.description}</p>
                </div>
                {/* Decorative dot removed for cleaner look */}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Welcome Section & Next Action */}
      <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
          
          {/* Welcome Card - Simplified */}
          <div className="lg:col-span-2 relative rounded-xl md:rounded-2xl lg:rounded-3xl border border-violet-500/20 overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/15 via-purple-500/8 to-transparent" />
            <div className="absolute -inset-0.5 bg-linear-to-r from-violet-500 to-purple-500 rounded-xl md:rounded-2xl lg:rounded-3xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-linear-to-br from-violet-500/25 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative p-4 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4 md:mb-6">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-violet-400 mb-1 italic">&ldquo;{quote.text}&rdquo; — {quote.author}</p>
                  <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight mt-3">
                    Good morning, <span className="bg-linear-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">{userProfile?.name || userProfile?.email || "User"}</span>! 👋
                  </h2>
                  <p className="text-xs md:text-sm text-slate-400 mt-2">Ready to continue your learning journey?</p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Streak - Only shown if meaningful */}
              {STREAK_DATA.currentStreak > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-400">{STREAK_DATA.currentStreak} day streak</p>
                    <p className="text-[10px] text-slate-500">Keep learning to maintain it!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Action Card - NEW */}
          <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl border border-emerald-500/20 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent" />
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl md:rounded-2xl lg:rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-wider">Next Action</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  NEXT_ACTION.priority === 'high' 
                    ? 'bg-rose-500/20 text-rose-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {NEXT_ACTION.priority}
                </span>
              </div>

              <div className="flex-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">{NEXT_ACTION.type}</span>
                <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-1 md:mb-2 mt-1">{NEXT_ACTION.title}</h3>
                <p className="text-[10px] md:text-xs text-slate-400 mb-3 md:mb-4">
                  {NEXT_ACTION.topic} → {NEXT_ACTION.subtopic}
                </p>
                
                <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-slate-400 mb-2 md:mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {NEXT_ACTION.estimatedTime}
                  </span>
                </div>

                <p className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {NEXT_ACTION.reason}
                </p>
              </div>

              <Link 
                href={NEXT_ACTION.href}
                className="w-full mt-3 md:mt-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-xs md:text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-center block"
              >
                Start Now →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/3 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm md:text-base font-bold text-white">Getting Started</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-white">Check your Roadmap</p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">See your personalized learning path</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-white">Complete your Tasks</p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Daily tasks aligned with your goals</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-white">Ask AI for help</p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Get instant answers and explanations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
