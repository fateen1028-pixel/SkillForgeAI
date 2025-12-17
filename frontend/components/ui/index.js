"use client";

import { forwardRef } from "react";

// ========================================
// BUTTON COMPONENT
// ========================================
export const Button = forwardRef(function Button(
  { 
    children, 
    variant = "primary", 
    size = "md", 
    className = "", 
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props 
  }, 
  ref
) {
  const variants = {
    primary: "bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 text-white hover:from-violet-500 hover:via-purple-500 hover:to-violet-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5",
    secondary: "bg-white/4 text-slate-300 border border-white/10 hover:bg-white/8 hover:text-white hover:border-white/15",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/6",
    danger: "bg-linear-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/25",
    success: "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs min-h-[32px] rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm min-h-[40px] rounded-xl gap-2",
    lg: "px-6 py-3 text-base min-h-[48px] rounded-xl gap-2.5",
    xl: "px-8 py-4 text-lg min-h-[56px] rounded-2xl gap-3",
  };

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

// ========================================
// CARD COMPONENT
// ========================================
export function Card({ 
  children, 
  className = "", 
  hover = false, 
  gradient,
  padding = "md",
  ...props 
}) {
  const paddings = {
    none: "",
    sm: "p-3 md:p-4",
    md: "p-4 md:p-5 lg:p-6",
    lg: "p-5 md:p-6 lg:p-8",
  };

  const gradients = {
    violet: "from-violet-500/10 via-purple-500/5 to-transparent",
    cyan: "from-cyan-500/10 via-teal-500/5 to-transparent",
    amber: "from-amber-500/10 via-orange-500/5 to-transparent",
    emerald: "from-emerald-500/10 via-teal-500/5 to-transparent",
  };

  return (
    <div
      className={`
        relative rounded-2xl md:rounded-3xl
        bg-white/2 border border-white/6
        backdrop-blur-sm overflow-hidden
        ${hover ? "transition-all duration-300 hover:bg-white/4 hover:border-white/10 hover:-translate-y-1" : ""}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {gradient && (
        <div className={`absolute inset-0 bg-linear-to-br ${gradients[gradient]} pointer-events-none`} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

// ========================================
// INPUT COMPONENT
// ========================================
export const Input = forwardRef(function Input(
  { 
    className = "", 
    size = "md",
    error,
    leftIcon,
    rightIcon,
    ...props 
  }, 
  ref
) {
  const sizes = {
    sm: "px-3 py-2 text-xs min-h-[36px] rounded-lg",
    md: "px-4 py-2.5 text-sm min-h-[44px] rounded-xl",
    lg: "px-5 py-3.5 text-base min-h-[52px] rounded-2xl",
  };

  return (
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={`
          w-full bg-white/3 border text-white
          placeholder:text-slate-500
          transition-all duration-200
          focus:outline-none focus:bg-white/6
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error 
            ? "border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20" 
            : "border-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          }
          ${leftIcon ? "pl-10" : ""}
          ${rightIcon ? "pr-10" : ""}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          {rightIcon}
        </span>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
});

// ========================================
// BADGE COMPONENT
// ========================================
export function Badge({ 
  children, 
  variant = "default", 
  size = "md",
  dot = false,
  className = "", 
  ...props 
}) {
  const variants = {
    default: "bg-white/6 text-slate-300 border-white/10",
    primary: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    info: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };

  const dotColors = {
    default: "bg-slate-400",
    primary: "bg-violet-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-rose-400",
    info: "bg-blue-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold
        border rounded-full uppercase tracking-wider
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

// ========================================
// SKELETON LOADER COMPONENT
// ========================================
export function Skeleton({ 
  className = "", 
  variant = "text",
  width,
  height,
  ...props 
}) {
  const variants = {
    text: "h-4 rounded",
    title: "h-6 rounded",
    avatar: "w-10 h-10 rounded-full",
    card: "h-32 rounded-2xl",
    thumbnail: "aspect-video rounded-xl",
  };

  return (
    <div
      className={`
        skeleton bg-white/4
        ${variants[variant]}
        ${className}
      `}
      style={{ width, height }}
      {...props}
    />
  );
}

// ========================================
// PROGRESS BAR COMPONENT
// ========================================
export function ProgressBar({ 
  value = 0, 
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = false,
  className = "", 
  ...props 
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  const variants = {
    primary: "from-violet-500 via-purple-500 to-violet-600",
    success: "from-emerald-500 via-teal-500 to-emerald-600",
    warning: "from-amber-500 via-orange-500 to-amber-600",
    danger: "from-rose-500 via-red-500 to-rose-600",
    gradient: "from-violet-500 via-purple-500 to-cyan-500",
  };

  return (
    <div className={className} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-white">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-white/6 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full bg-linear-to-r ${variants[variant]} rounded-full transition-all duration-500 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ========================================
// AVATAR COMPONENT
// ========================================
export function Avatar({ 
  src, 
  alt = "", 
  fallback,
  size = "md",
  status,
  className = "", 
  ...props 
}) {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-500",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  };

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      <div className={`
        ${sizes[size]} rounded-full overflow-hidden
        bg-linear-to-br from-violet-500 to-cyan-500
        flex items-center justify-center font-bold text-white
        ring-2 ring-white/10
      `}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          fallback || alt.charAt(0).toUpperCase()
        )}
      </div>
      {status && (
        <span className={`
          absolute bottom-0 right-0 w-3 h-3 rounded-full
          ${statusColors[status]}
          ring-2 ring-[#030712]
        `} />
      )}
    </div>
  );
}

// ========================================
// ICON BUTTON COMPONENT
// ========================================
export const IconButton = forwardRef(function IconButton(
  { 
    children, 
    variant = "ghost", 
    size = "md",
    className = "", 
    ...props 
  }, 
  ref
) {
  const variants = {
    ghost: "text-slate-400 hover:text-white hover:bg-white/8",
    filled: "bg-white/4 text-slate-400 hover:text-white hover:bg-white/10 border border-white/6",
    primary: "bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 border border-violet-500/30",
  };

  const sizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-xl",
  };

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
        active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

// ========================================
// EMPTY STATE COMPONENT
// ========================================
export function EmptyState({ 
  icon, 
  title, 
  description,
  action,
  className = "", 
  ...props 
}) {
  return (
    <div className={`text-center py-12 md:py-16 ${className}`} {...props}>
      {icon && (
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl bg-linear-to-br from-violet-500/20 to-purple-500/10 border border-white/6 flex items-center justify-center text-violet-400">
          {icon}
        </div>
      )}
      <h3 className="text-base md:text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

// ========================================
// TOOLTIP COMPONENT (Simple)
// ========================================
export function Tooltip({ children, content, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}
