'use client';

import React from 'react';
import { Layers, Globe, BookOpen, FlaskConical, GraduationCap, Code2, Cpu, Sparkles } from 'lucide-react';
import { Language, MainTab } from '@/types';

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

  const navTabs: { id: MainTab; labelEn: string; labelKh: string; icon: React.ReactNode }[] = [
    { id: 'beginner', labelEn: '🌱 Beginner 101', labelKh: '🌱 មូលដ្ឋានគ្រឹះ 101', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'overview', labelEn: 'Overview & Formulas', labelKh: 'ទិដ្ឋភាពទូទៅ & រូបមន្ត', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'matrix', labelEn: 'All Matrices Masterclass', labelKh: 'មេរៀន Matrix គ្រប់ប្រភេទ', icon: <Cpu className="w-4 h-4" /> },
    { id: 'exercises', labelEn: '8 Worked Exercises', labelKh: 'ដំណោះស្រាយលំហាត់ទាំង ៨', icon: <Layers className="w-4 h-4" /> },
    { id: 'labs', labelEn: 'Interactive Labs', labelKh: 'បន្ទប់ពិសោធន៍ Simulation', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'exam', labelEn: 'Exam Prep & Quiz', labelKh: 'ប្រឡងសាកល្បង & Quiz', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'python', labelEn: 'Python & OpenCV Hub', labelKh: 'មជ្ឈមណ្ឌល Python & OpenCV', icon: <Code2 className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
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
        </div>

        {/* Language Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>{isKh ? 'ភាសាខ្មែរ (Khmer)' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900/60 overflow-x-auto py-2">
        <div className="flex items-center gap-2 min-w-max">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
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
    </header>
  );
};
