"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [profile, setProfile] = useState({
    fullName: "Demo User",
    email: "demo@skillforgeai.com",
    username: "demouser",
    bio: "Passionate about coding and learning new technologies. Currently preparing for software engineering roles.",
    location: "San Francisco, CA",
    website: "https://github.com/demouser",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyProgress: true,
    newFeatures: false,
    marketingEmails: false,
    pushNotifications: true,
    soundAlerts: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    codeEditorTheme: "vs-dark",
    fontSize: "14",
    autoSave: true,
    showLineNumbers: true,
    tabSize: "2",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: "account", label: "Account", icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: "notifications", label: "Notifications", icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
    { id: "preferences", label: "Preferences", icon: <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> },
  ];

  // Toggle component
  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? "bg-violet-500" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  // Input component
  const Input = ({ label, value, onChange, type = "text", placeholder }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
      />
    </div>
  );

  // Select component
  const Select = ({ label, value, onChange, options }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f1629]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/6">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold">
            DU
          </div>
          <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-semibold text-white">Profile Photo</h4>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-xs font-medium text-violet-300 hover:bg-violet-500/30 transition-colors">
              Upload
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={profile.fullName}
          onChange={(v) => setProfile({ ...profile, fullName: v })}
          placeholder="Your full name"
        />
        <Input
          label="Username"
          value={profile.username}
          onChange={(v) => setProfile({ ...profile, username: v })}
          placeholder="Your username"
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={profile.email}
        onChange={(v) => setProfile({ ...profile, email: v })}
        placeholder="your@email.com"
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-300">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
          placeholder="Tell us about yourself..."
        />
        <p className="text-xs text-slate-500">{profile.bio.length}/200 characters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location"
          value={profile.location}
          onChange={(v) => setProfile({ ...profile, location: v })}
          placeholder="City, Country"
        />
        <Input
          label="Website"
          value={profile.website}
          onChange={(v) => setProfile({ ...profile, website: v })}
          placeholder="https://your-website.com"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-white/6">
        <button className="px-6 py-2.5 rounded-xl bg-linear-to-r from-violet-500 to-purple-500 text-sm font-semibold text-white hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Account Status */}
      <div className="p-4 rounded-xl bg-linear-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-white">Pro Member</h4>
              <p className="text-xs text-slate-400">Your subscription is active</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Manage Plan
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Password & Security
        </h4>
        <div className="p-4 rounded-xl bg-white/3 border border-white/6 space-y-4">
          <Input label="Current Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="New Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
            <Input label="Confirm Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
          </div>
          <button className="px-4 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-sm font-medium text-violet-300 hover:bg-violet-500/30 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Connected Accounts
        </h4>
        <div className="space-y-3">
          {[
            { name: "Google", icon: "🔵", connected: true },
            { name: "GitHub", icon: "⚫", connected: true },
            { name: "LinkedIn", icon: "🔷", connected: false },
          ].map((account) => (
            <div key={account.name} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6">
              <div className="flex items-center gap-3">
                <span className="text-xl">{account.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{account.name}</p>
                  <p className="text-xs text-slate-400">{account.connected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                account.connected
                  ? "bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
                  : "bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30"
              }`}>
                {account.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h4 className="font-semibold text-rose-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Danger Zone
        </h4>
        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete Account</p>
              <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-sm font-medium text-rose-400 hover:bg-rose-500/30 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="space-y-1">
        <h4 className="font-semibold text-white flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Notifications
        </h4>
        <div className="p-4 rounded-xl bg-white/3 border border-white/6 divide-y divide-white/6">
          <Toggle
            enabled={notifications.emailNotifications}
            onChange={(v) => setNotifications({ ...notifications, emailNotifications: v })}
            label="Email Notifications"
            description="Receive important updates via email"
          />
          <Toggle
            enabled={notifications.taskReminders}
            onChange={(v) => setNotifications({ ...notifications, taskReminders: v })}
            label="Task Reminders"
            description="Get reminded about pending tasks"
          />
          <Toggle
            enabled={notifications.weeklyProgress}
            onChange={(v) => setNotifications({ ...notifications, weeklyProgress: v })}
            label="Weekly Progress Report"
            description="Receive a summary of your weekly progress"
          />
          <Toggle
            enabled={notifications.newFeatures}
            onChange={(v) => setNotifications({ ...notifications, newFeatures: v })}
            label="New Features"
            description="Be the first to know about new features"
          />
          <Toggle
            enabled={notifications.marketingEmails}
            onChange={(v) => setNotifications({ ...notifications, marketingEmails: v })}
            label="Marketing Emails"
            description="Receive promotional content and offers"
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="space-y-1">
        <h4 className="font-semibold text-white flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          Push Notifications
        </h4>
        <div className="p-4 rounded-xl bg-white/3 border border-white/6 divide-y divide-white/6">
          <Toggle
            enabled={notifications.pushNotifications}
            onChange={(v) => setNotifications({ ...notifications, pushNotifications: v })}
            label="Push Notifications"
            description="Receive browser push notifications"
          />
          <Toggle
            enabled={notifications.soundAlerts}
            onChange={(v) => setNotifications({ ...notifications, soundAlerts: v })}
            label="Sound Alerts"
            description="Play sound for notifications"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-white/6">
        <button className="px-6 py-2.5 rounded-xl bg-linear-to-r from-violet-500 to-purple-500 text-sm font-semibold text-white hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25">
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Appearance */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Appearance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Theme"
            value={preferences.theme}
            onChange={(v) => setPreferences({ ...preferences, theme: v })}
            options={[
              { value: "dark", label: "Dark Mode" },
              { value: "light", label: "Light Mode" },
              { value: "system", label: "System Default" },
            ]}
          />
          <Select
            label="Language"
            value={preferences.language}
            onChange={(v) => setPreferences({ ...preferences, language: v })}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
              { value: "fr", label: "Français" },
              { value: "de", label: "Deutsch" },
              { value: "hi", label: "हिंदी" },
            ]}
          />
        </div>
      </div>

      {/* Code Editor Settings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code Editor
        </h4>
        <div className="p-4 rounded-xl bg-white/3 border border-white/6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Editor Theme"
              value={preferences.codeEditorTheme}
              onChange={(v) => setPreferences({ ...preferences, codeEditorTheme: v })}
              options={[
                { value: "vs-dark", label: "VS Code Dark" },
                { value: "monokai", label: "Monokai" },
                { value: "github-dark", label: "GitHub Dark" },
                { value: "dracula", label: "Dracula" },
              ]}
            />
            <Select
              label="Font Size"
              value={preferences.fontSize}
              onChange={(v) => setPreferences({ ...preferences, fontSize: v })}
              options={[
                { value: "12", label: "12px" },
                { value: "14", label: "14px" },
                { value: "16", label: "16px" },
                { value: "18", label: "18px" },
              ]}
            />
          </div>
          <Select
            label="Tab Size"
            value={preferences.tabSize}
            onChange={(v) => setPreferences({ ...preferences, tabSize: v })}
            options={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
            ]}
          />
          <div className="divide-y divide-white/6 border-t border-white/6 pt-4 -mx-4 px-4">
            <Toggle
              enabled={preferences.autoSave}
              onChange={(v) => setPreferences({ ...preferences, autoSave: v })}
              label="Auto Save"
              description="Automatically save your code"
            />
            <Toggle
              enabled={preferences.showLineNumbers}
              onChange={(v) => setPreferences({ ...preferences, showLineNumbers: v })}
              label="Show Line Numbers"
              description="Display line numbers in the editor"
            />
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="space-y-4">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Data & Privacy
        </h4>
        <div className="p-4 rounded-xl bg-white/3 border border-white/6 space-y-3">
          <button className="flex items-center justify-between w-full p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Export Data</p>
                <p className="text-xs text-slate-400">Download all your data</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="flex items-center justify-between w-full p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Privacy Policy</p>
                <p className="text-xs text-slate-400">View our privacy policy</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-white/6">
        <button className="px-6 py-2.5 rounded-xl bg-linear-to-r from-violet-500 to-purple-500 text-sm font-semibold text-white hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/25">
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "account":
        return renderAccountTab();
      case "notifications":
        return renderNotificationsTab();
      case "preferences":
        return renderPreferencesTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="container-app py-4 md:py-6 lg:py-8">
      <div className="rounded-xl md:rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8 xl:p-10">
          {/* Header */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8">
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/3 border border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12 transition-all group"
              title="Back to Dashboard"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="relative">
              <div className="absolute -inset-1 md:-inset-1.5 bg-linear-to-r from-violet-500 to-purple-600 rounded-lg md:rounded-xl blur opacity-40" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg md:rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Settings</h3>
              <p className="text-xs md:text-sm lg:text-base text-slate-400 font-medium">Manage your account and preferences</p>
            </div>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="flex gap-1.5 md:gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-violet-500/20 to-purple-500/10 border border-violet-500/30 text-white"
                    : "bg-white/2 border border-white/6 text-slate-400 hover:text-white hover:bg-white/4"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === "notifications" ? "Alerts" : tab.id === "preferences" ? "Prefs" : tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-100">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
