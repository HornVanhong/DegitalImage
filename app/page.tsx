'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { ExercisesTab } from '@/components/tabs/ExercisesTab';
import { LabsTab } from '@/components/tabs/LabsTab';
import { MatrixTab } from '@/components/tabs/MatrixTab';
import { ExamQuizTab } from '@/components/tabs/ExamQuizTab';
import { PythonHubTab } from '@/components/tabs/PythonHubTab';
import { Language, MainTab } from '@/types';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<MainTab>('matrix');
  const [language, setLanguage] = useState<Language>('kh');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'kh' ? 'en' : 'kh'));
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'overview' && (
          <OverviewTab language={language} onNavigateTab={setCurrentTab} />
        )}
        {currentTab === 'matrix' && (
          <MatrixTab language={language} />
        )}
        {currentTab === 'exercises' && (
          <ExercisesTab language={language} onNavigateTab={setCurrentTab} />
        )}
        {currentTab === 'labs' && (
          <LabsTab language={language} />
        )}
        {currentTab === 'exam' && (
          <ExamQuizTab language={language} />
        )}
        {currentTab === 'python' && (
          <PythonHubTab language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span>Digital Image Processing Master Course</span>
            <span>•</span>
            <span>Next.js 14 App</span>
          </div>
          <div className="khmer-font text-slate-400">
            រៀបចំសម្រាប់ជំនួយស្មារតីក្នុងការរៀន និងត្រៀមប្រឡងប្រព័ន្ធដំណើរការរូបភាពឌីជីថល
          </div>
        </div>
      </footer>
    </div>
  );
}
