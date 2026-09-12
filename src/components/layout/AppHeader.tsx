import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  User,
  Clock,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  Palette,
  Check,
  Play,
  Pause
} from 'lucide-react';
import {
  getNetworkStatus,
  setNetworkStatus,
  resetAllDataToDefault,
  subscribeToStorage,
  getThemePreset,
  setThemePreset,
  getAnimationsEnabled,
  setAnimationsEnabled,
  ThemePreset
} from '../../services/storage';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const [networkStatus, setNetStatus] = useState(getNetworkStatus());
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(getThemePreset());
  const [animationsEnabled, setAnimations] = useState<boolean>(getAnimationsEnabled());
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeToStorage(() => {
      setNetStatus(getNetworkStatus());
      setCurrentTheme(getThemePreset());
      setAnimations(getAnimationsEnabled());
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    if (showThemeMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showThemeMenu]);

  const toggleNetwork = () => {
    const next = networkStatus === 'online' ? 'unstable' : 'online';
    setNetworkStatus(next);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to initial state?')) {
      resetAllDataToDefault();
      window.location.reload();
    }
  };

  const themeOptions: { id: ThemePreset; name: string; desc: string; colors: string[] }[] = [
    {
      id: 'mint',
      name: 'Calm Mint',
      desc: 'Teal & Emerald',
      colors: ['bg-teal-400', 'bg-emerald-300'],
    },
    {
      id: 'azure',
      name: 'Sky Azure',
      desc: 'Sky & Indigo',
      colors: ['bg-sky-400', 'bg-indigo-300'],
    },
    {
      id: 'lavender',
      name: 'Lavender Aurora',
      desc: 'Purple & Rose',
      colors: ['bg-purple-400', 'bg-rose-300'],
    },
    {
      id: 'sunlight',
      name: 'Warm Sunlight',
      desc: 'Amber & Peach',
      colors: ['bg-amber-400', 'bg-orange-300'],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs print:hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-sm group-hover:bg-navy-800 transition-colors">
                <FileText className="w-5 h-5 text-teal-400" aria-hidden="true" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                  Session Notes
                </span>
                <span className="text-[11px] font-medium text-teal-700 block leading-none mt-0.5">
                  Lincoln Elementary · SLP
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-100/90 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/sessions"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/sessions'
                  ? 'bg-slate-100/90 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Choose Session
            </Link>
            <Link
              to="/bulk"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                location.pathname === '/bulk'
                  ? 'bg-slate-100/90 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Bulk Entry
            </Link>
          </nav>

          {/* Provider Persona & Context */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme & Animated Background Customizer */}
            <div className="relative" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Theme & Animated Background"
                aria-label="Theme settings"
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 bg-white/70 backdrop-blur-xs transition-colors"
              >
                <Palette className="w-4 h-4 text-teal-600" />
                <span className="hidden sm:inline">Theme</span>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              </button>

              {/* Theme Dropdown Popover */}
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-modal p-3 space-y-3 z-50 animate-fadeIn">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      Light Color Themes
                    </span>
                    <div className="mt-1.5 space-y-1">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setThemePreset(opt.id);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                            currentTheme === opt.id
                              ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex -space-x-1">
                              {opt.colors.map((c, i) => (
                                <div key={i} className={`w-3.5 h-3.5 rounded-full ${c} ring-1 ring-white`} />
                              ))}
                            </div>
                            <div className="text-left">
                              <span className="font-bold block">{opt.name}</span>
                              <span className="text-[10px] text-slate-400 block">{opt.desc}</span>
                            </div>
                          </div>
                          {currentTheme === opt.id && <Check className="w-4 h-4 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Motion toggle */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-slate-600">Background Motion</span>
                    <button
                      type="button"
                      onClick={() => setAnimationsEnabled(!animationsEnabled)}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md border transition-colors ${
                        animationsEnabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {animationsEnabled ? (
                        <>
                          <Play className="w-3 h-3 text-emerald-600 fill-current" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3 text-slate-500 fill-current" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Network simulator toggle button */}
            <button
              type="button"
              onClick={toggleNetwork}
              title={`Network mode: ${networkStatus === 'online' ? 'Online' : 'Connection unstable (tap to switch)'}`}
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                networkStatus === 'online'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
              }`}
            >
              {networkStatus === 'online' ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span className="font-medium">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  <span className="font-medium">Unstable Conn.</span>
                </>
              )}
            </button>

            {/* Time indicator - 2:10 PM Scenario */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>2:10 PM</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">Aug 18, 2026</span>
            </div>

            {/* Provider info pill */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 border border-teal-300 flex items-center justify-center font-bold text-xs">
                JC
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Jamie Chen</div>
                <div className="text-[10px] font-medium text-slate-500 leading-tight">CCC-SLP · Provider</div>
              </div>
            </div>

            {/* Reset / Demo tools button */}
            <button
              type="button"
              onClick={handleReset}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Reset test data"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
