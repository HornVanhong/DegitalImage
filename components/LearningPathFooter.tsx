'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Milestone } from 'lucide-react';
import { Language, MainTab } from '@/types';
import { NAV_TABS } from '@/data/navTabs';

interface LearningPathFooterProps {
  currentTab: MainTab;
  language: Language;
  onNavigateTab: (tab: MainTab) => void;
}

/**
 * Shown at the bottom of every section. Self-learners on a multi-section
 * course often don't know what to study next; this makes the recommended
 * order explicit and lets them move through it with one click.
 */
export const LearningPathFooter: React.FC<LearningPathFooterProps> = ({ currentTab, language, onNavigateTab }) => {
  const isKh = language === 'kh';
  const index = NAV_TABS.findIndex((t) => t.id === currentTab);
  const prevTab = index > 0 ? NAV_TABS[index - 1] : null;
  const nextTab = index >= 0 && index < NAV_TABS.length - 1 ? NAV_TABS[index + 1] : null;

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
      <div className="flex items-center justify-center gap-2 mb-3 text-[11px] font-mono text-slate-500">
        <Milestone className="w-3.5 h-3.5" />
        <span>
          {isKh ? 'ជំហានទី' : 'Step'} {index + 1} / {NAV_TABS.length}
        </span>
      </div>

      <div className="flex items-stretch justify-between gap-3">
        {prevTab ? (
          <button
            onClick={() => onNavigateTab(prevTab.id)}
            className="flex-1 min-w-0 text-left px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 text-slate-500" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                {isKh ? 'មុន' : 'Previous'}
              </div>
              <div className="text-xs font-bold truncate">{isKh ? prevTab.labelKh : prevTab.labelEn}</div>
            </div>
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {nextTab ? (
          <button
            onClick={() => onNavigateTab(nextTab.id)}
            className="flex-1 min-w-0 text-right px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition flex items-center justify-end gap-2"
          >
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-indigo-200 font-bold">
                {isKh ? 'បន្ទាប់' : 'Next'}
              </div>
              <div className="text-xs font-bold truncate">{isKh ? nextTab.labelKh : nextTab.labelEn}</div>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-end px-4 py-3 text-xs font-bold text-emerald-400">
            🎉 {isKh ? 'អ្នកបានដល់ចុងក្រោយ!' : "You've reached the end!"}
          </div>
        )}
      </div>
    </div>
  );
};
