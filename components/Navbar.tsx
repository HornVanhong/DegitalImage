'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Globe, Menu, X } from 'lucide-react';
import { Language, MainTab } from '@/types';
import { NAV_TABS } from '@/data/navTabs';

interface NavbarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage
}) => {
  const isKh = language === 'kh';
  const [mobileOpen, setMobileOpen] = useState(false);

  const navTabs = NAV_TABS;

  const activeIndex = navTabs.findIndex((t) => t.id === currentTab);

  // Close the mobile drawer whenever the route/tab changes, and lock body scroll while open.
  useEffect(() => {
    setMobileOpen(false);
  }, [currentTab]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          className="flex items-center gap-3 text-left shrink-0 rounded-xl"
          onClick={() => onSelectTab('overview')}
          aria-label="Go to Overview"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>DIP Interactive</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Next.js
              </span>
            </div>
            <p className="text-[11px] text-slate-400 khmer-font">
              {isKh ? 'លំហាត់ និងដំណោះស្រាយ Digital Image Processing' : 'Digital Image Processing Course & Lab'}
            </p>
          </div>
        </button>

        {/* Progress indicator (which of the 7 sections the learner is on) */}
        <div className="hidden lg:flex items-center gap-1.5 mx-auto" aria-hidden="true">
          {navTabs.map((t, i) => (
            <span
              key={t.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-indigo-500' : i < activeIndex ? 'w-1.5 bg-indigo-800' : 'w-1.5 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">{isKh ? 'ភាសាខ្មែរ (Khmer)' : 'English'}</span>
            <span className="sm:hidden">{isKh ? 'ខ្មែរ' : 'EN'}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center transition"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop / tablet navigation tabs */}
      <div className="hidden md:block relative border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto py-2 [scrollbar-width:thin]">
          <div className="flex items-center gap-2 min-w-max">
            {navTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`tab-btn px-4 py-2 rounded-xl font-medium text-xs md:text-sm flex items-center gap-2 border transition-all duration-200 ${
                    isActive
                      ? 'active bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {tab.icon}
                  <span>{isKh ? tab.labelKh : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Edge fade hints so the scrollable row reads as scrollable on tablets */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-slate-950 to-transparent" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-900/60 bg-slate-950/98 animate-fadeIn">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1.5">
            {navTabs.map((tab, i) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 border transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'border-transparent text-slate-300 bg-slate-900/40 hover:bg-slate-900/70'
                  }`}
                >
                  <span className="text-[11px] font-mono text-slate-500 w-4">{i + 1}</span>
                  {tab.icon}
                  <span>{isKh ? tab.labelKh : tab.labelEn}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
