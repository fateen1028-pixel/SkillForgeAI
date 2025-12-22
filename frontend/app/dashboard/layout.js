"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Navigation items shared between mobile and desktop
const NAV_ITEMS = [
  {
    id: "overview",
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "tasks",
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    href: "/dashboard/roadmap",
    label: "Roadmap",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    mobileOnly: true,
  },
];


export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [userProfile, setUserProfile] = useState(null);
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    async function getProfile() {
      // Use the same fetchGeneralProfile helper as dashboard
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
      async function fetchGeneralProfile() {
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
      const profile = await fetchGeneralProfile();
      setUserProfile(profile);
    }
    getProfile();
  }, []);

  // Check if current path matches nav item
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Animated Background - Reduced for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-100 h-100 md:w-150 md:h-150 bg-linear-to-br from-violet-600/15 via-purple-600/8 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-87.5 h-87.5 md:w-125 md:h-125 bg-linear-to-tr from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
      </div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#030712]/80 backdrop-blur-2xl backdrop-saturate-150">
        <div className="container-app">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-cyan-500 rounded-lg md:rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-linear-to-br from-[#7c3aed] via-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-base md:text-lg font-bold tracking-tight">
                  Skill<span className="bg-linear-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">ForgeAI</span>
                </span>
                <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">Dashboard</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.filter(item => !item.mobileOnly).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-white/8 text-white border border-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/4"
                  }`}
                >
                  <span className={isActive(item.href) ? "text-violet-400" : ""}>{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* User profile with dropdown */}
              <div className="flex items-center gap-2 md:gap-3" ref={profileRef}>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-white">{userProfile?.name || userProfile?.email || "User"}</p>
                  <p className="text-[11px] text-slate-500">Pro Member</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-linear-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs md:text-sm font-bold ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                      {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "U"}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f1629]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-white/6 bg-linear-to-br from-violet-500/10 to-cyan-500/5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                            {userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{userProfile?.name || userProfile?.email || "User"}</p>
                            <p className="text-xs text-slate-400">{userProfile?.email || "user@email.com"}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] font-medium text-violet-300">
                            Pro Member
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-medium text-emerald-300">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/dashboard/roadmap"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>My Progress</span>
                        </Link>
                        <button
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all group w-full"
                        >
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Help & Support</span>
                        </button>
                      </div>

                      {/* Logout Section */}
                      <div className="p-2 border-t border-white/6">
                        <button
                          onClick={async () => {
                            setIsProfileOpen(false);
                            await logout();
                            router.push("/");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group w-full"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav md:hidden">
        <div className="flex items-center justify-around px-2">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`mobile-nav-item flex-1 ${isActive(item.href) ? "active" : ""}`}
            >
              <span className={isActive(item.href) ? "text-violet-400" : ""}>{item.icon}</span>
              <span className="text-[10px] md:text-xs truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer Banner - Hidden on mobile */}
      <div className="hidden md:block mt-6 lg:mt-8 mb-6 lg:mb-8 container-app">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 via-purple-500/5 to-cyan-500/10" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute inset-0 rounded-2xl border border-white/6" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-linear-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Need help with your preparation?</p>
                <p className="text-xs text-slate-500 mt-0.5">Our AI is available 24/7 to assist you</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
                Back to Home
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/dashboard/chatbot" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-sm font-medium text-white hover:from-violet-500/30 hover:to-purple-500/30 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Ask AI
              </Link>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-center text-[11px] text-slate-600">
          © 2025 SkillForgeAI. Crafted with 💜 to help you succeed.
        </p>
      </div>
    </div>
  );
}
