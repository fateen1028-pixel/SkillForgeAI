"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";


const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// Smooth scroll function
const smoothScrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    const navHeight = 100; // Account for fixed nav
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Custom Logo Component
function Logo({ size = "default", animate = true }) {
  const sizes = {
    small: { container: "w-9 h-9", icon: "w-4 h-4" },
    default: { container: "w-11 h-11", icon: "w-6 h-6" },
    large: { container: "w-14 h-14", icon: "w-7 h-7" },
    hero: { container: "w-20 h-20", icon: "w-10 h-10" },
  };

  return (
    <div
      className={`${
        sizes[size].container
      } rounded-2xl bg-linear-to-br from-[#7c3aed] via-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-xl shadow-[#7c3aed]/40 ${
        animate
          ? "hover:scale-110 hover:rotate-3 transition-all duration-300"
          : ""
      }`}
    >
      <svg
        className={`${sizes[size].icon} text-white`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </div>
  );
}

// Brand Name Component
function BrandName({ size = "default" }) {
  const sizes = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
    hero: "text-3xl sm:text-4xl",
  };

  return (
    <span className={`${sizes[size]} font-bold tracking-tight`}>
      Skill
      <span className="bg-linear-to-r from-[#a78bfa] via-[#818cf8] to-[#22d3ee] bg-clip-text text-transparent">
        ForgeAI
      </span>
    </span>
  );
}

export default function Home() {
  const router = useRouter();
  const observerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSetupCompleted, setIsSetupCompleted] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  // Handle Get Started button click
  const handleClick = async () => {
    if (isAuthenticated === null) return; // Still loading
    
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (isSetupCompleted) {
      router.push("/dashboard");
    } else {
      router.push("/setup");
    }
  };

  // Fetch user authentication status
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${APP_URL}/api/current_user`, {
          credentials: "include",
        });
        
        if (res.status === 401) {
          setIsAuthenticated(false);
          setIsSetupCompleted(null);
          return;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        
        const data = await res.json();
        setIsAuthenticated(true);
        setIsSetupCompleted(data.is_setup_completed);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setIsSetupCompleted(null);
      }
    }

    fetchUser();
  }, []);

  // Handle scroll progress and back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for nav highlighting
  useEffect(() => {
    const sections = ['features', 'how-it-works', 'testimonials'];
    
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, {
      threshold: [0.3, 0.5],
      rootMargin: '-100px 0px -40% 0px'
    });

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) sectionObserver.observe(element);
    });

    return () => sectionObserver.disconnect();
  }, []);

  // Scroll reveal animations with stagger effect
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered delay based on element position
            setTimeout(() => {
              entry.target.classList.add("scroll-visible");
              entry.target.classList.remove("scroll-hidden");
            }, index * 50);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    document.querySelectorAll(".scroll-hidden").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle nav link click with smooth scroll
  const handleNavClick = useCallback((e, sectionId) => {
    e.preventDefault();
    smoothScrollTo(sectionId);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden scroll-smooth">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
        <div 
          className="h-full bg-linear-to-r from-[#7c3aed] via-[#6366f1] to-[#06b6d4] transition-all duration-150 ease-out shadow-lg shadow-[#7c3aed]/50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-linear-to-br from-[#7c3aed] to-[#06b6d4] text-white shadow-lg shadow-[#7c3aed]/30 flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-[#7c3aed]/40 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Mouse follower gradient */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[150px] transition-all duration-1000 ease-out"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
          }}
        />

        {/* Static gradient orbs */}
        <div className="absolute top-[-15%] left-[-8%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-[#7c3aed]/25 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-[40%] right-[-12%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#06b6d4]/20 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute bottom-[-15%] left-[25%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-[#ec4899]/15 rounded-full blur-[100px] animate-float" />

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />

        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? 'pt-2' : 'pt-4'}`}>
        <div className="mx-4 sm:mx-6 lg:mx-8">
          <div className={`max-w-7xl mx-auto rounded-2xl border backdrop-blur-xl px-4 sm:px-6 py-3 transition-all duration-500 ${navScrolled ? 'border-white/20 bg-[#030712]/95 shadow-xl shadow-black/20' : 'border-white/10 bg-[#030712]/80'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size="small" />
                <BrandName size="small" />
              </div>

              <div className="hidden md:flex items-center gap-8">
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, 'features')}
                  className={`text-sm transition-all duration-300 relative group cursor-pointer ${
                    activeSection === 'features' ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Features
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-300 ${
                    activeSection === 'features' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavClick(e, 'how-it-works')}
                  className={`text-sm transition-all duration-300 relative group cursor-pointer ${
                    activeSection === 'how-it-works' ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  How It Works
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-300 ${
                    activeSection === 'how-it-works' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
                <a
                  href="#testimonials"
                  onClick={(e) => handleNavClick(e, 'testimonials')}
                  className={`text-sm transition-all duration-300 relative group cursor-pointer ${
                    activeSection === 'testimonials' ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Success Stories
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-300 ${
                    activeSection === 'testimonials' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleClick}
                  className="group relative inline-flex items-center gap-2 text-white text-sm font-semibold px-4 sm:px-6 py-2.5 rounded-xl overflow-hidden"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-[#7c3aed] via-[#6366f1] to-[#06b6d4]" />
                  <span className="absolute inset-0 bg-linear-to-r from-[#9333ea] via-[#818cf8] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative hidden sm:inline">Get Started</span>
                  <span className="relative sm:hidden">Start</span>
                  <svg
                    className="relative w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  aria-label="Toggle menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64 mt-4 pt-4 border-t border-white/10' : 'max-h-0'}`}>
              <div className="flex flex-col gap-3 pb-2">
                <a
                  href="#features"
                  onClick={(e) => { handleNavClick(e, 'features'); setMobileMenuOpen(false); }}
                  className={`text-sm py-2 px-3 rounded-lg transition-all ${
                    activeSection === 'features' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => { handleNavClick(e, 'how-it-works'); setMobileMenuOpen(false); }}
                  className={`text-sm py-2 px-3 rounded-lg transition-all ${
                    activeSection === 'how-it-works' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  onClick={(e) => { handleNavClick(e, 'testimonials'); setMobileMenuOpen(false); }}
                  className={`text-sm py-2 px-3 rounded-lg transition-all ${
                    activeSection === 'testimonials' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Success Stories
                </a>
                <Link
                  href="/login"
                  className="text-sm py-2 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/30 text-sm font-medium mb-6 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></span>
              </span>
              <span className="bg-linear-to-r from-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
                AI-Powered Career Acceleration
              </span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] animate-fade-in-up delay-100">
            <span className="block">Forge Your</span>
            <span className="block mt-2 bg-linear-to-r from-[#a78bfa] via-[#818cf8] to-[#22d3ee] bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200 px-4">
            Master DSA, ace technical interviews, and accelerate your career
            with
            <span className="text-white font-medium">
              {" "}
              personalized AI coaching
            </span>
            , intelligent practice plans, and real-time feedback.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300 px-4">
            <button
              onClick={handleClick}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl overflow-hidden text-base sm:text-lg cursor-pointer"
            >
              <span className="absolute inset-0 bg-linear-to-r from-[#7c3aed] via-[#6366f1] to-[#06b6d4]" />
              <span className="absolute inset-0 bg-linear-to-r from-[#9333ea] via-[#818cf8] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at center, white 0%, transparent 70%)",
                }}
              />
              <span className="relative">Start Free Trial</span>
              <svg
                className="relative w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-medium px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-base sm:text-lg backdrop-blur-sm cursor-pointer"
            >
              <span className="w-10 h-10 rounded-xl bg-linear-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-[#22d3ee]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch Demo
            </a>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 sm:mt-20 lg:mt-24 relative animate-scale-in delay-400 px-4">
            <div className="relative mx-auto max-w-5xl">
              {/* Glow effect behind the card */}
              <div className="absolute -inset-4 bg-linear-to-r from-[#7c3aed]/20 via-[#6366f1]/20 to-[#06b6d4]/20 rounded-3xl blur-2xl" />

              {/* Main dashboard preview */}
              <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0a0a1a]/90 p-1.5 sm:p-2 shadow-2xl backdrop-blur-sm">
                <div className="bg-linear-to-br from-[#0f0f23] to-[#0a0a1a] rounded-xl sm:rounded-2xl overflow-hidden">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0a0a1a] border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 mx-2 sm:mx-4">
                      <div className="bg-[#1a1a2e] rounded-lg px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                        <svg
                          className="w-3 h-3 text-emerald-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="hidden sm:inline">
                          app.skillforgeai.com/dashboard
                        </span>
                        <span className="sm:hidden">skillforgeai.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content preview */}
                  <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="h-5 sm:h-6 w-28 sm:w-36 bg-gradient-to-r from-white/10 to-white/5 rounded-lg" />
                        <div className="h-3 sm:h-4 w-40 sm:w-52 bg-white/5 rounded mt-2" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gradient-to-r from-[#7c3aed]/30 to-[#7c3aed]/10 rounded-xl border border-[#7c3aed]/20" />
                        <div className="h-8 sm:h-10 w-20 sm:w-24 bg-white/5 rounded-xl border border-white/5" />
                        <div className="hidden sm:block h-10 w-24 bg-white/5 rounded-xl border border-white/5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                      <div className="bg-linear-to-br from-[#7c3aed]/20 to-[#7c3aed]/5 rounded-xl p-3 sm:p-4 border border-[#7c3aed]/20">
                        <div className="text-xl sm:text-2xl font-bold text-white">
                          247
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400">
                          Problems Solved
                        </div>
                      </div>
                      <div className="bg-linear-to-br from-[#06b6d4]/20 to-[#06b6d4]/5 rounded-xl p-3 sm:p-4 border border-[#06b6d4]/20">
                        <div className="text-xl sm:text-2xl font-bold text-white">
                          89%
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400">
                          Success Rate
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1 bg-linear-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
                        <div className="text-xl sm:text-2xl font-bold text-white">
                          12
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400">
                          Days Streak 🔥
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-r from-[#1a1a2e] to-[#0f0f23] rounded-xl p-3 sm:p-4 border border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm text-slate-300">
                            Today&apos;s AI recommendation: Focus on Graph
                            algorithms. Try these 3 problems...
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-[#7c3aed]/20 rounded-lg text-[10px] sm:text-xs text-[#a78bfa]">
                              BFS/DFS
                            </span>
                            <span className="px-2 py-1 bg-[#06b6d4]/20 rounded-lg text-[10px] sm:text-xs text-[#22d3ee]">
                              Medium
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements - Hidden on mobile */}
              <div className="hidden lg:block absolute -left-16 xl:-left-24 top-24 animate-float">
                <div className="rounded-2xl border border-white/10 bg-[#0a0a1a]/90 backdrop-blur-sm p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Problem Solved!</div>
                      <div className="text-xs text-slate-400">
                        Two Sum - Easy
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -right-12 xl:-right-20 bottom-32 animate-float-delayed">
                <div className="rounded-2xl border border-white/10 bg-[#0a0a1a]/90 backdrop-blur-sm p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#a78bfa]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Level Up!</div>
                      <div className="text-xs text-slate-400">
                        +150 XP earned
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden xl:block absolute -right-8 top-16 animate-float">
                <div className="rounded-2xl border border-white/10 bg-[#0a0a1a]/90 backdrop-blur-sm p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <span className="text-lg">🏆</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Achievement!</div>
                      <div className="text-xs text-slate-400">7-day streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-linear-to-b from-[#7c3aed] to-[#06b6d4] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#7c3aed]/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "50K+", label: "Active Users", icon: "👥" },
              { number: "1M+", label: "Problems Solved", icon: "✅" },
              { number: "95%", label: "Success Rate", icon: "📈" },
              { number: "24/7", label: "AI Support", icon: "🤖" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative text-center p-6 sm:p-8 rounded-2xl bg-linear-to-br from-white/3 to-transparent border border-white/6 hover:border-[#7c3aed]/30 transition-all duration-500 hover:scale-105"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#7c3aed]/10 to-[#06b6d4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <span className="text-2xl sm:text-3xl mb-2 block">{stat.icon}</span>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick CTA Banner */}
      <section className="py-8 sm:py-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-r from-[#7c3aed]/20 via-[#6366f1]/20 to-[#06b6d4]/20" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            {/* Border */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/10" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 p-6 sm:p-8">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-linear-to-br from-[#7c3aed] to-[#06b6d4] items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Ready to ace your next interview?</h3>
                  <p className="text-sm text-slate-400 mt-1">Join thousands of successful candidates today</p>
                </div>
              </div>
              <button
                onClick={handleClick}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#6366f1] text-white font-semibold text-sm hover:opacity-90 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#7c3aed]/25"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 sm:py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 tracking-wider">
            TRUSTED BY 50,000+ STUDENTS FROM TOP INSTITUTIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
            {[
              "IIT Delhi",
              "NIT Trichy",
              "BITS Pilani",
              "VIT",
              "DTU",
              "IIIT Hyderabad",
            ].map((name) => (
              <div
                key={name}
                className="text-base sm:text-lg md:text-xl font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-default"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 scroll-hidden">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#06b6d4]/20 to-[#7c3aed]/20 border border-[#06b6d4]/30 text-sm font-medium mb-4">
              <span className="bg-linear-to-r from-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">
                Powerful Features
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Everything You Need to
              <br />
              <span className="bg-linear-to-r from-[#a78bfa] via-[#818cf8] to-[#22d3ee] bg-clip-text text-transparent">
                Crack Any Interview
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Our AI adapts to your learning style, identifies weak areas, and
              creates personalized paths to help you prepare smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "AI Chatbot Assistant",
                description:
                  "Get instant help with DSA problems, interview tips, and personalized study recommendations 24/7.",
                gradient: "from-[#7c3aed] to-[#6366f1]",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                ),
                title: "Smart Todo Lists",
                description:
                  "AI-generated daily tasks based on your progress, weak areas, and upcoming interview schedules.",
                gradient: "from-[#06b6d4] to-[#0891b2]",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                title: "Personalized Roadmap",
                description:
                  "Custom learning paths that adapt to your goals, timeline, and the companies you're targeting.",
                gradient: "from-emerald-500 to-emerald-600",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Practice Problems",
                description:
                  "Curated problem sets from top companies with detailed solutions and time complexity analysis.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                ),
                title: "Mock Interviews",
                description:
                  "AI-powered mock interviews with real-time feedback on communication and problem-solving.",
                gradient: "from-rose-500 to-pink-500",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
                title: "Progress Analytics",
                description:
                  "Detailed analytics dashboard showing your strengths, weaknesses, and improvement over time.",
                gradient: "from-violet-500 to-purple-500",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="scroll-hidden group relative rounded-2xl sm:rounded-3xl border border-white/5 bg-linear-to-br from-white/3 to-transparent p-5 sm:p-6 lg:p-8 hover:border-white/10 transition-all duration-500"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Hover glow effect */}
                <div
                  className={`absolute -inset-px rounded-2xl sm:rounded-3xl bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                />

                <div
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="relative text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 lg:py-32 px-4 relative"
      >
        {/* Background accent */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#7c3aed]/5 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 scroll-hidden">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/30 text-sm font-medium mb-4">
              <span className="bg-linear-to-r from-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
                Simple Process
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Three Steps to
              <br />
              <span className="bg-linear-to-r from-[#a78bfa] via-[#818cf8] to-[#22d3ee] bg-clip-text text-transparent">
                Career Success
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                title: "Set Your Goals",
                description:
                  "Tell us about your target companies, timeline, and current skill level. Our AI creates a personalized roadmap just for you.",
                emoji: "🎯",
              },
              {
                step: "02",
                title: "Practice Daily",
                description:
                  "Follow AI-curated daily tasks, solve problems, and get instant feedback. Track your progress with detailed analytics.",
                emoji: "📚",
              },
              {
                step: "03",
                title: "Ace Interviews",
                description:
                  "Practice mock interviews, review company-specific questions, and walk into your interviews with unshakeable confidence.",
                emoji: "🏆",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="scroll-hidden relative"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="group rounded-2xl sm:rounded-3xl border border-white/5 bg-linear-to-br from-white/3 to-transparent p-6 sm:p-8 text-center hover:border-white/10 transition-all duration-500">
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-[#7c3aed] to-[#06b6d4] text-white font-bold text-sm mb-3 sm:mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {/* Arrow - hidden on mobile */}
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-4 transform -translate-y-1/2 text-slate-600 z-10">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="scroll-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-linear-to-br from-[#7c3aed]/10 via-[#0a0a1a] to-[#06b6d4]/10 p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {[
                { value: "50K+", label: "Active Users" },
                { value: "10K+", label: "Problems Solved Daily" },
                { value: "92%", label: "Placement Rate" },
                { value: "500+", label: "Partner Companies" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center scroll-hidden"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold">Success Stories</h3>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Join thousands who&apos;ve transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                quote:
                  "SkillForgeAI helped me crack Google! The AI recommendations were incredibly accurate for my preparation style.",
                name: "Priya Sharma",
                role: "SDE @ Google",
                avatar: "PS",
              },
              {
                quote:
                  "The personalized roadmap saved me months of planning. I knew exactly what to study each day and saw constant improvement.",
                name: "Rahul Verma",
                role: "SDE @ Microsoft",
                avatar: "RV",
              },
              {
                quote:
                  "Mock interviews with AI feedback gave me the confidence I needed. The instant feedback loop was a game-changer!",
                name: "Ananya Patel",
                role: "SDE @ Amazon",
                avatar: "AP",
              },
            ].map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="scroll-hidden group rounded-2xl border border-white/5 bg-linear-to-br from-white/3 to-transparent p-5 sm:p-6 hover:border-white/10 transition-all duration-500"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 sm:mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4">
        <div className="max-w-4xl mx-auto scroll-hidden">
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-linear-to-br from-[#7c3aed]/20 via-[#0a0a1a] to-[#06b6d4]/20" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#7c3aed]/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#06b6d4]/30 rounded-full blur-[100px]" />

            <div className="relative p-6 sm:p-8 lg:p-12 xl:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Ready to Forge Your
                <br />
                <span className="bg-linear-to-r from-[#a78bfa] via-[#818cf8] to-[#22d3ee] bg-clip-text text-transparent">
                  Dream Career?
                </span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
                Join 50,000+ students who have already transformed their careers
                with SkillForgeAI. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleClick}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl overflow-hidden text-base sm:text-lg"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-[#7c3aed] via-[#6366f1] to-[#06b6d4]" />
                  <span className="absolute inset-0 bg-linear-to-r from-[#9333ea] via-[#818cf8] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative">Get Started Free</span>
                  <svg
                    className="relative w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white font-medium transition-colors text-sm sm:text-base"
                >
                  Already have an account? Sign in →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 sm:py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="small" animate={false} />
                <BrandName size="small" />
              </div>
              <p className="text-sm text-slate-400 mb-4">
                AI-powered career acceleration platform for aspiring software
                engineers.
              </p>
              <div className="flex gap-3">
                {[
                  {
                    name: "twitter",
                    path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                  },
                  {
                    name: "linkedin",
                    path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M2 4a2 2 0 114 0 2 2 0 01-4 0z",
                  },
                  {
                    name: "github",
                    path: "M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z",
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Roadmap", "Changelog"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Blog", "Community", "Support"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Privacy", "Terms"],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">
                  {column.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-sm text-slate-400">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <p>© 2025 SkillForgeAI. All rights reserved.</p>
            <p>Forging careers with AI ⚡</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
