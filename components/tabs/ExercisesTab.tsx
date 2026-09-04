'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, FlaskConical, Code2, Copy, Check, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, MainTab, Exercise } from '@/types';
import { EXERCISES_DATA } from '@/data/exercisesData';
import { MathRenderer } from '../MathRenderer';
import { LearningPathFooter } from '../LearningPathFooter';

interface ExercisesTabProps {
  language: Language;
  onNavigateTab: (tab: MainTab) => void;
}

const PROGRESS_KEY = 'dip_completed_exercises';

export const ExercisesTab: React.FC<ExercisesTabProps> = ({ language, onNavigateTab }) => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const isKh = language === 'kh';
  const activeEx: Exercise = EXERCISES_DATA.find((e) => e.id === selectedId) || EXERCISES_DATA[0];
  const activeIndex = EXERCISES_DATA.findIndex((e) => e.id === activeEx.id);
  const isCompleted = completedIds.includes(activeEx.id);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PROGRESS_KEY);
      if (saved) setCompletedIds(JSON.parse(saved));
    } catch {
      /* localStorage unavailable, progress just won't persist */
    }
  }, []);

  const persist = (ids: number[]) => {
    setCompletedIds(ids);
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
    } catch {
      /* ignore write failures (e.g. private browsing) */
    }
  };

  const toggleCompleted = (id: number) => {
    persist(completedIds.includes(id) ? completedIds.filter((c) => c !== id) : [...completedIds, id]);
  };

  const goToOffset = (offset: number) => {
    const nextIdx = activeIndex + offset;
    if (nextIdx >= 0 && nextIdx < EXERCISES_DATA.length) {
      setSelectedId(EXERCISES_DATA[nextIdx].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyCode = () => {
    if (activeEx.codeSnippet) {
      navigator.clipboard.writeText(activeEx.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      <div className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isKh ? 'បញ្ជីលំហាត់ទាំង ៨ (Exercises List)' : 'Course Exercises (1 to 8)'}
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
              {completedIds.length}/{EXERCISES_DATA.length}
            </span>
          </div>

          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${(completedIds.length / EXERCISES_DATA.length) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {EXERCISES_DATA.map((ex) => {
              const isSelected = ex.id === activeEx.id;
              const isDone = completedIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => setSelectedId(ex.id)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ex.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{isKh ? ex.titleKh : ex.titleEn}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{ex.topic}</span>
                  </div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs space-y-2">
          <span className="text-slate-400 font-bold block">{isKh ? 'សកម្មភាពរហ័ស' : 'Interactive Playground'}</span>
          <button
            onClick={() => onNavigateTab('labs')}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition flex items-center justify-center gap-2"
          >
            <FlaskConical className="w-4 h-4" />
            <span>{isKh ? 'បើកពិសោធន៍ក្នុង Lab' : 'Open in Interactive Lab'}</span>
          </button>
        </div>
      </div>

      
      <div className="lg:col-span-8 space-y-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                {activeEx.topic}
              </span>
              <span className="text-xs font-mono text-slate-400">Difficulty: {activeEx.difficulty}</span>
            </div>
            <button
              onClick={() => toggleCompleted(activeEx.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                isCompleted
                  ? 'bg-emerald-600/20 border-emerald-600 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              <span>
                {isCompleted
                  ? isKh ? 'បានបញ្ចប់ ✓' : 'Completed'
                  : isKh ? 'សម្គាល់ថាបានធ្វើរួច' : 'Mark as done'}
              </span>
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            {isKh ? activeEx.titleKh : activeEx.titleEn}
          </h2>

          
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed space-y-3">
            <div className="font-bold text-amber-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Problem Statement (ប្រធានលំហាត់):
            </div>
            <MathRenderer content={isKh ? activeEx.problemKh : activeEx.problemEn} />
          </div>
        </div>

        
        {activeEx.questions?.map((q) => (
          <div key={q.qNum} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                {q.qNum}
              </span>
              <h3 className="text-base font-bold text-slate-100">{isKh ? q.titleKh : q.titleEn}</h3>
            </div>

            {q.explanationKh && (
              <div className={`p-4 bg-indigo-950/30 rounded-2xl border border-indigo-900/50 text-xs text-indigo-200 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
                {q.explanationKh}
              </div>
            )}

            
            {q.steps && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isKh ? 'ដំណាក់កាលគណនាលម្អិត៖' : 'Step-by-step Arithmetic:'}
                </div>
                {q.steps.map((s, sIdx) => (
                  <div key={sIdx} className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className={`text-slate-300 font-bold ${isKh ? 'khmer-font' : ''}`}>
                      {isKh ? s.stepKh : s.stepEn}
                    </div>
                    <MathRenderer content={`$$${s.math}$$`} />
                  </div>
                ))}
              </div>
            )}

            
            <div className={`p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/80 text-xs text-emerald-300 font-medium ${isKh ? 'khmer-font' : ''}`}>
              <MathRenderer content={isKh ? q.finalAnswerKh : q.finalAnswerEn} />
            </div>
          </div>
        ))}

        
        {activeEx.codeSnippet && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                <span>{isKh ? 'កូដ Python & OpenCV ពេញលេញ' : 'Complete Python & OpenCV Solution'}</span>
              </h3>
              <button
                onClick={handleCopyCode}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 font-mono"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Script
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{activeEx.codeSnippet}</code>
            </pre>

            {activeEx.keyConceptsKh && (
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <span className={`text-amber-400 font-bold block ${isKh ? 'khmer-font' : ''}`}>
                  {isKh ? 'ការពន្យល់ពីបច្ចេកទេសក្នុងកូដ៖' : 'Key Code Concepts:'}
                </span>
                <ul className={`list-disc list-inside space-y-1.5 text-slate-300 ${isKh ? 'khmer-font' : ''}`}>
                  {activeEx.keyConceptsKh.map((c, cIdx) => (
                    <li key={cIdx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}


        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => goToOffset(-1)}
            disabled={activeIndex === 0}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 ${
              activeIndex === 0 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isKh ? 'លំហាត់មុន' : 'Previous Exercise'}</span>
          </button>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            {activeIndex + 1} / {EXERCISES_DATA.length}
          </span>

          <button
            onClick={() => goToOffset(1)}
            disabled={activeIndex === EXERCISES_DATA.length - 1}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition flex items-center gap-1.5 ${
              activeIndex === EXERCISES_DATA.length - 1 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <span>{isKh ? 'លំហាត់បន្ទាប់' : 'Next Exercise'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>

      <LearningPathFooter currentTab="exercises" language={language} onNavigateTab={onNavigateTab} />
    </div>
  );
};
