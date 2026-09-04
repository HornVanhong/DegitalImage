'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Smile, 
  Grid, 
  Layers, 
  BookOpen, 
  Sliders, 
  RotateCcw,
  Palette,
  XCircle
} from 'lucide-react';
import { Language, MainTab } from '@/types';
import { MathRenderer } from '../MathRenderer';
import { LearningPathFooter } from '../LearningPathFooter';

interface BeginnerTabProps {
  language: Language;
  onNavigateTab: (tab: MainTab) => void;
}

type BeginnerSubTopic = 'addition_101' | 'matrix_basics' | 'mult_101' | 'pixels_101' | 'jargon_buster' | 'quick_quiz';

export const BeginnerTab: React.FC<BeginnerTabProps> = ({ language, onNavigateTab }) => {
  const isKh = language === 'kh';

  const [activeTopic, setActiveTopic] = useState<BeginnerSubTopic>('addition_101');

  /* ------------------------------------------------------------------------- */
  /* 1. MATRIX ADDITION 101 STATE (INTERACTIVE 2x2 SPOTS)                      */
  /* ------------------------------------------------------------------------- */
  const [activeSpot, setActiveSpot] = useState<'tl' | 'tr' | 'bl' | 'br'>('tl');

  // Custom 2x2 sandbox
  const [userA, setUserA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [userB, setUserB] = useState<number[][]>([[5, 1], [2, 0]]);

  const handleUpdateUserCell = (isA: boolean, r: number, c: number, val: number) => {
    const num = isNaN(val) ? 0 : val;
    if (isA) {
      const copy = userA.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
      setUserA(copy);
    } else {
      const copy = userB.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
      setUserB(copy);
    }
  };

  /* ------------------------------------------------------------------------- */
  /* 2. PIXEL DRAWING PAD (4x4 INTERACTIVE GRID)                               */
  /* ------------------------------------------------------------------------- */
  const [pixelSliderVal, setPixelSliderVal] = useState<number>(180);
  const [drawGrid, setDrawGrid] = useState<number[][]>([
    [0, 255, 255, 0],
    [255, 0, 0, 255],
    [255, 255, 255, 255],
    [255, 0, 0, 255]
  ]); // Smiley or heart

  const togglePixel = (r: number, c: number) => {
    setDrawGrid((prev) =>
      prev.map((row, ri) =>
        row.map((val, ci) => (ri === r && ci === c ? (val === 0 ? 255 : 0) : val))
      )
    );
  };

  /* ------------------------------------------------------------------------- */
  /* 3. MULTIPLICATION 101 INTERACTIVE CELL STATE                              */
  /* ------------------------------------------------------------------------- */
  const [multCell, setMultCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });

  /* ------------------------------------------------------------------------- */
  /* 4. BEGINNER PRACTICE QUIZ STATE                                           */
  /* ------------------------------------------------------------------------- */
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = useState<Record<number, boolean>>({});

  const quizQuestions = [
    {
      id: 1,
      qEn: "Can you add a 2×2 matrix with a 3×3 matrix?",
      qKh: "តើអ្នកអាចបូក Matrix 2×2 ជាមួយ Matrix 3×3 បានដែរឬទេ?",
      optionsEn: ["Yes, absolutely", "No, not possible (sizes are different)", "Only if numbers are small"],
      optionsKh: ["បាន, បូកបានធម្មតា", "ទេ, មិនអាចបូកបានទេ (ពីព្រោះទំហំខុសគ្នា)", "បាន លុះត្រាតែលេខតូចៗ"],
      correct: 1,
      explanationEn: "The Golden Rule: Both boxes must be the exact same size to add them. If sizes are different, addition is not possible.",
      explanationKh: "វិធានមាស៖ ម៉ាទ្រីសទាំងពីរត្រូវតែមានទំហំស្មើគ្នាបេះបិទ។ បើទំហំខុសគ្នា ការបូកគឺមិនអាចធ្វើទៅរួចឡើយ។"
    },
    {
      id: 2,
      qEn: "In digital image processing, what does pixel value 0 represent?",
      qKh: "ក្នុងរូបភាពឌីជីថល តើតម្លៃ Pixel 0 តំណាងឱ្យពណ៌អ្វី?",
      optionsEn: ["Pure Bright White", "Pitch Black (Darkness)", "Bright Red"],
      optionsKh: ["ពណ៌សភ្លឺច្បាស់", "ពណ៌ខ្មៅសុទ្ធ (ងងឹត)", "ពណ៌ក្រហម"],
      correct: 1,
      explanationEn: "In grayscale images, 0 is total darkness (pitch black), and 255 is pure bright white.",
      explanationKh: "ក្នុងរូបភាពសខ្មៅ លេខ 0 គឺពណ៌ខ្មៅងងឹតសុទ្ធ ហើយលេខ 255 គឺពណ៌សភ្លឺច្បាស់។"
    },
    {
      id: 3,
      qEn: "If Matrix A has 2 rows and 3 columns, what is its size (dimension)?",
      qKh: "បើ Matrix A មាន ២ ជួរដេក និង ៣ ជួរឈរ តើវាមានទំហំប៉ុន្មាន?",
      optionsEn: ["3 × 2", "2 × 3", "6 × 1"],
      optionsKh: ["3 × 2", "2 × 3", "6 × 1"],
      correct: 1,
      explanationEn: "We always say Row first, then Column: (Rows × Columns) = 2 × 3.",
      explanationKh: "យើងតែងតែហៅជួរដេកមុន ជួរឈរក្រោយ៖ (ជួរដេក × ជួរឈរ) = 2 × 3។"
    }
  ];

  const handleSelectQuizOption = (qId: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setShowQuizFeedback(prev => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {isKh ? '🌱 មូលដ្ឋានគ្រឹះ 101 (សម្រាប់អ្នកទើបចាប់ផ្តើម)' : '🌱 Beginner 101: Zero-Math-Background Guide'}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {isKh ? 'រៀន Matrix & រូបភាពឌីជីថល ងាយយល់ បំផុត គ្មានពាក្យបច្ចេកទេសពិបាកៗ' : 'Learn Matrices & Digital Images with Zero Prior Math Background'}
          </h2>

          <p className={'text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl ' + (isKh ? 'khmer-font' : '')}>
            {isKh
              ? 'មេរៀនសង្ខេប ខ្លីៗ ងាយៗ ប្រើភាសាសាមញ្ញ គ្មានរូបមន្តវែងអន្លាយ! ចុចមើលជំហាននីមួយៗ និងសាកល្បងចុចផ្ទាល់ភ្នែក ដើម្បីយល់ច្បាស់ពីរបៀបបូក គុណ និងការបង្កើតរូបភាពឌីជីថល។'
              : 'Super simple, plain-language explanations with short sentences and zero confusing math jargon. Built specifically so anyone can understand matrix addition, multiplication, and digital pixels in minutes.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => onNavigateTab('matrix')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{isKh ? 'ទៅកាន់ Matrix Masterclass កម្រិតខ្ពស់' : 'Switch to In-Depth Masterclass'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Topic Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTopic('addition_101')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeTopic === 'addition_101'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <span>{isKh ? '១. របៀបបូក Matrix (Addition 101)' : '1. Matrix Addition 101'}</span>
        </button>

        <button
          onClick={() => setActiveTopic('matrix_basics')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeTopic === 'matrix_basics'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Grid className="w-4 h-4 text-cyan-400" />
          <span>{isKh ? '២. អ្វីជា Matrix? (What is a Matrix?)' : '2. What is a Matrix?'}</span>
        </button>

        <button
          onClick={() => setActiveTopic('mult_101')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeTopic === 'mult_101'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{isKh ? '៣. របៀបគុណ Matrix (Multiplication 101)' : '3. Matrix Multiplication 101'}</span>
        </button>

        <button
          onClick={() => setActiveTopic('pixels_101')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeTopic === 'pixels_101'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Palette className="w-4 h-4 text-purple-400" />
          <span>{isKh ? '៤. រូបភាពឌីជីថល & Pixels' : '4. Digital Pixels & Images'}</span>
        </button>

        <button
          onClick={() => setActiveTopic('jargon_buster')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeTopic === 'jargon_buster'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>{isKh ? '៥. វចនានុក្រមបកស្រាយពាក្យ' : '5. Jargon Buster'}</span>
        </button>

        <button
          onClick={() => setActiveTopic('quick_quiz')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeTopic === 'quick_quiz'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Smile className="w-4 h-4 text-pink-400" />
          <span>{isKh ? '៦. សាកល្បងសមត្ថភាព (Quiz)' : '6. Quick Quiz'}</span>
        </button>
      </div>

      {/* TOPIC 1: MATRIX ADDITION 101 (THE EXACT USER PROMPT REQUIREMENTS) */}
      {activeTopic === 'addition_101' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            {/* Header & 2-3 sentence explanation */}
            <div className="border-b border-slate-800/80 pb-5 space-y-2">
              <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                {isKh ? 'សេចក្តីពន្យល់ងាយយល់បំផុត • No Math Background Needed' : 'Beginner Friendly • Plain Words'}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white">
                {isKh ? 'តើអ្វីទៅជាការបូកម៉ាទ្រីស? (What is Matrix Addition?)' : 'What is Matrix Addition?'}
              </h3>
              <p className={'text-sm md:text-base text-slate-200 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                {isKh
                  ? 'គិតថា Matrix គ្រាន់តែជាប្រអប់ក្រឡាផ្ទុកលេខដែលមានជួរដេក និងជួរឈរ។ ការបូក Matrix ពីរគឺគ្រាន់តែយកលេខដែលស្ថិតនៅទីតាំងដូចគ្នាបេះបិទមកបូកបញ្ចូលគ្នា។ អ្នកគ្រាន់តែផ្គូផ្គងលេខនីមួយៗជាមួយដៃគូរបស់វា រួចកត់ត្រាផលបូកចូលក្នុងប្រអប់ថ្មី។'
                  : 'Think of a matrix as a simple box of numbers arranged in rows and columns. Adding two matrices just means adding the numbers that sit in the exact same spots. You pair each number with its partner and write down the total.'}
              </p>
            </div>

            {/* The One Golden Rule Box */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="text-xs md:text-sm space-y-1">
                <strong className="text-amber-300 font-bold block">
                  {isKh ? 'វិធានមាសតែមួយគត់ (The Golden Rule):' : 'The Golden Rule:'}
                </strong>
                <p className={'text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                  {isKh
                    ? 'ប្រអប់ទាំងពីរត្រូវតែមានទំហំស្មើគ្នាបេះបិទ។ ប្រសិនបើទំហំខុសគ្នា ការបូកគឺមិនអាចធ្វើទៅរួចឡើយ (Not possible)។'
                    : 'Both boxes must be the exact same size. If the sizes are different, addition is not possible.'}
                </p>
              </div>
            </div>

            {/* ONE Simple Example (2x2 Matrix with 1, 2, 3, 4) */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isKh ? 'ឧទាហរណ៍សាមញ្ញមួយគត់ (A Simple Example):' : 'A Simple Example:'}
                </h4>
                <span className="text-xs text-slate-400">
                  {isKh ? 'ចុចលើក្រឡា ឬប៊ូតុងខាងក្រោមដើម្បីមើលការផ្គូផ្គងដៃគូ' : 'Click a spot below to see matching partners'}
                </span>
              </div>

              {/* Spot Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveSpot('tl')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition ' + (
                    activeSpot === 'tl'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {isKh ? '១. ជ្រុងលើឆ្វេង (Top-left)' : '1. Top-left'}
                </button>
                <button
                  onClick={() => setActiveSpot('tr')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition ' + (
                    activeSpot === 'tr'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {isKh ? '២. ជ្រុងលើស្តាំ (Top-right)' : '2. Top-right'}
                </button>
                <button
                  onClick={() => setActiveSpot('bl')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition ' + (
                    activeSpot === 'bl'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {isKh ? '៣. ជ្រុងក្រោមកឆ្វេង (Bottom-left)' : '3. Bottom-left'}
                </button>
                <button
                  onClick={() => setActiveSpot('br')}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition ' + (
                    activeSpot === 'br'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {isKh ? '៤. ជ្រុងក្រោមកស្តាំ (Bottom-right)' : '4. Bottom-right'}
                </button>
              </div>

              {/* Visual Boxes: Box A + Box B = Result C */}
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-center gap-4 md:gap-8 py-8">
                {/* Box A */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-mono font-bold text-amber-400 mb-2">Box A (2×2)</span>
                  <div className="matrix-bracket">
                    <div className="grid grid-cols-2 gap-2">
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'tl' ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>1</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'tr' ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>2</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'bl' ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>3</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'br' ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>4</div>
                    </div>
                  </div>
                </div>

                <span className="text-3xl font-black text-slate-400">+</span>

                {/* Box B */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-mono font-bold text-cyan-400 mb-2">Box B (2×2)</span>
                  <div className="matrix-bracket">
                    <div className="grid grid-cols-2 gap-2">
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'tl' ? 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>5</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'tr' ? 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>1</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'bl' ? 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>2</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'br' ? 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-400 scale-110 shadow-lg' : 'bg-slate-800 text-slate-200'
                      )}>0</div>
                    </div>
                  </div>
                </div>

                <span className="text-3xl font-black text-slate-400">=</span>

                {/* Result Box */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-mono font-bold text-emerald-400 mb-2">Result (2×2)</span>
                  <div className="matrix-bracket">
                    <div className="grid grid-cols-2 gap-2">
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'tl' ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-400 scale-110 shadow-xl' : 'bg-slate-800 text-emerald-300'
                      )}>6</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'tr' ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-400 scale-110 shadow-xl' : 'bg-slate-800 text-emerald-300'
                      )}>3</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'bl' ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-400 scale-110 shadow-xl' : 'bg-slate-800 text-emerald-300'
                      )}>5</div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold transition-all duration-300 ' + (
                        activeSpot === 'br' ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-400 scale-110 shadow-xl' : 'bg-slate-800 text-emerald-300'
                      )}>4</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Numbered Step-by-Step Breakdown */}
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase">
                  {isKh ? 'ជំហាននីមួយៗ (Step-by-step):' : 'Step-by-step:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className={'p-3 rounded-xl border flex items-center justify-between ' + (
                    activeSpot === 'tl' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  )}>
                    <span>1. Top-left:</span>
                    <span className="text-emerald-400 font-black">1 + 5 = 6</span>
                  </div>
                  <div className={'p-3 rounded-xl border flex items-center justify-between ' + (
                    activeSpot === 'tr' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  )}>
                    <span>2. Top-right:</span>
                    <span className="text-emerald-400 font-black">2 + 1 = 3</span>
                  </div>
                  <div className={'p-3 rounded-xl border flex items-center justify-between ' + (
                    activeSpot === 'bl' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  )}>
                    <span>3. Bottom-left:</span>
                    <span className="text-emerald-400 font-black">3 + 2 = 5</span>
                  </div>
                  <div className={'p-3 rounded-xl border flex items-center justify-between ' + (
                    activeSpot === 'br' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  )}>
                    <span>4. Bottom-right:</span>
                    <span className="text-emerald-400 font-black">4 + 0 = 4</span>
                  </div>
                </div>
              </div>

              {/* Friendly Summary Sentence */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center text-xs md:text-sm text-emerald-300 font-semibold leading-relaxed">
                🎉 {isKh
                  ? 'ប៉ុណ្ណឹងឯង! គ្រាន់តែផ្គូផ្គងលេខតាមទីតាំងដូចគ្នា បូកវាចូលគ្នា រួចជាការស្រេច!'
                  : 'That is all there is to it: just match the matching spots, add the numbers, and you are done!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 2: WHAT IS A MATRIX? */}
      {activeTopic === 'matrix_basics' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {isKh ? 'តើអ្វីទៅជា Matrix? (What is a Matrix?)' : 'What is a Matrix?'}
            </h3>
            <p className={'text-xs md:text-sm text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'Matrix (ម៉ាទ្រីស) គ្រាន់តែជាតារាង ឬប្រអប់លេខដែលរៀបចំជាជួរដេក (Rows) និងជួរឈរ (Columns)។ គ្មានអ្វីអាថ៌កំបាំងឡើយ!'
                : 'A matrix is simply a spreadsheet or grid of numbers neatly organized in rows and columns.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">
                1. ជួរដេក (Rows) = បន្ទាត់ផ្ដេក (Horizontal)
              </span>
              <p className="text-xs text-slate-300">
                ដូចបន្ទាត់សរសេរលើសៀវភៅ ឬជួរកៅអីក្នុងរោងកុន (រាប់ពីលើចុះក្រោម៖ ជួរ ១, ជួរ ២, ជួរ ៣...)។
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 font-mono text-xs font-bold text-amber-300">
                <span>[ ជួរដេក ១ ផ្ដេក ──────► ]</span>
              </div>
            </div>

            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 font-mono uppercase">
                2. ជួរឈរ (Columns) = បន្ទាត់បញ្ឈរ (Vertical)
              </span>
              <p className="text-xs text-slate-300">
                ដូចសសរផ្ទះ ឬសសរអាគារ (រាប់ពីឆ្វេងទៅស្តាំ៖ ជួរឈរ ១, ជួរឈរ ២...)។
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-cyan-500/30 flex items-center justify-center gap-2 font-mono text-xs font-bold text-cyan-300">
                <span>[ ជួរឈរ ១ បញ្ឈរ ▼ ]</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-indigo-950/30 rounded-2xl border border-indigo-800/40 space-y-2 text-xs">
            <strong className="text-indigo-300 font-bold block">
              💡 របៀបហៅទំហំ (Dimension) M × N:
            </strong>
            <p className="text-slate-300">
              គេតែងតែហៅ <strong>ជួរដេក (Rows) មុន</strong> រួចចាំហៅ <strong>ជួរឈរ (Columns) តាមក្រោយ</strong>។ ឧទាហរណ៍ Matrix $3 	imes 4$ មានន័យថា មាន ៣ ជួរដេក និង ៤ ជួរឈរ (សរុប ១២ លេខ)។
            </p>
          </div>
        </div>
      )}

      {/* TOPIC 3: MULTIPLICATION 101 */}
      {activeTopic === 'mult_101' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {isKh ? 'របៀបគុណ Matrix ដោយងាយយល់ (Multiplication 101)' : 'Matrix Multiplication in Plain Words'}
            </h3>
            <p className={'text-xs md:text-sm text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'ការគុណ Matrix មិនដូចការគុណលេខធម្មតាទេ។ វាដូចជាការរំកិលដៃ៖ ជួរដេក (ផ្ដេក) ជួបគ្នាជាមួយ ជួរឈរ (បញ្ឈរ)។ លេខនីមួយៗចាប់ដៃគុណគ្នា រួចបូកសរុបជាចម្លើយតែមួយ!'
                : 'Matrix multiplication is NOT multiplying matching spots. Instead, a Row (horizontal) slides across a Column (vertical). Partners multiply together, and you add their results into one spot.'}
            </p>
          </div>

          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center space-y-4">
            <span className="text-xs font-mono text-slate-400 font-bold">
              ឧទាហរណ៍សាមញ្ញ (2×2) × (2×2) → (2×2):
            </span>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
              <MathRenderer content={"$$\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} \\times \\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix} = \\begin{bmatrix} (1\\times5 + 2\\times7) & (1\\times6 + 2\\times8) \\\\ (3\\times5 + 4\\times7) & (3\\times6 + 4\\times8) \\end{bmatrix} = \\begin{bmatrix} 19 & 22 \\\\ 43 & 50 \\end{bmatrix}$$"} />
            </div>
            <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-800/40 text-xs text-amber-300 font-mono text-center">
              Top-Left = (1 × 5) + (2 × 7) = 5 + 14 = 19
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 4: PIXELS & DIGITAL IMAGES */}
      {activeTopic === 'pixels_101' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {isKh ? 'តើរូបភាពឌីជីថលជាអ្វី? (Digital Image as Pixels)' : 'What is a Digital Image?'}
            </h3>
            <p className={'text-xs md:text-sm text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'រូបថតទាំងអស់នៅលើទូរសព្ទរបស់អ្នក ការពិតគឺជា Matrix ផ្ទុកលេខសុទ្ធសាធ! ក្នុងរូបភាពសខ្មៅ (Grayscale) លេខ 0 គឺខ្មៅងងឹត លេខ 255 គឺសភ្លឺ ហើយលេខនៅចន្លោះនោះគឺជាពណ៌ប្រផេះ។'
                : 'Every photo on your smartphone is actually just a big matrix of numbers! In black-and-white images, 0 is pitch black, 255 is bright white, and numbers in between are shades of gray.'}
            </p>
          </div>

          {/* Interactive Pixel Brightness Slider */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-purple-300 font-bold">
                {isKh ? 'ទាញ Slider ដើម្បីមើលលេខប្រែទៅជាពណ៌ពិត៖' : 'Interactive Pixel Brightness:'}
              </span>
              <span className="text-white font-black px-2 py-0.5 bg-slate-800 rounded">
                Value: {pixelSliderVal}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={255}
              value={pixelSliderVal}
              onChange={(e) => setPixelSliderVal(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-slate-800 h-2.5 rounded-lg"
            />

            <div className="flex items-center justify-center py-4">
              <div
                style={{ backgroundColor: 'rgb(' + pixelSliderVal + ',' + pixelSliderVal + ',' + pixelSliderVal + ')' }}
                className={'w-28 h-28 rounded-3xl border-2 border-slate-600 flex flex-col items-center justify-center font-mono text-sm font-black shadow-2xl transition-all ' + (
                  pixelSliderVal > 128 ? 'text-slate-950' : 'text-white'
                )}
              >
                <span>{pixelSliderVal}</span>
                <span className="text-[10px] opacity-70">
                  {pixelSliderVal === 0 ? 'Black' : pixelSliderVal === 255 ? 'White' : 'Gray'}
                </span>
              </div>
            </div>
          </div>

          {/* 4x4 Mini Pixel Pad */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono">
                {isKh ? 'សាកល្បងគូររូបភាព 4×4 (ចុចលើក្រឡាដើម្បីប្តូរខ្មៅ/ស)៖' : 'Draw Your Own 4×4 Image Matrix (Click to toggle):'}
              </span>
              <button
                onClick={() => setDrawGrid([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 py-2">
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400 mb-2 font-mono">Matrix Values (Numbers)</span>
                <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-900 rounded-2xl border border-slate-800">
                  {drawGrid.map((row, r) =>
                    row.map((val, c) => (
                      <button
                        key={'dg-' + r + '-' + c}
                        onClick={() => togglePixel(r, c)}
                        className={'w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition ' + (
                          val === 255 ? 'bg-white text-slate-950 ring-2 ring-emerald-400' : 'bg-slate-950 text-slate-500 border border-slate-800'
                        )}
                      >
                        {val}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="text-2xl font-bold text-slate-400">➔</div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400 mb-2 font-mono">Screen Output (Real Pixels)</span>
                <div className="grid grid-cols-4 gap-0.5 p-1 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                  {drawGrid.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={'pout-' + r + '-' + c}
                        style={{ backgroundColor: 'rgb(' + val + ',' + val + ',' + val + ')' }}
                        className="w-12 h-12"
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 5: JARGON BUSTER */}
      {activeTopic === 'jargon_buster' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {isKh ? 'វចនានុក្រមសង្ខេប (Jargon Buster)' : 'Jargon Buster: Plain Definitions'}
            </h3>
            <p className={'text-xs md:text-sm text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'ពន្យល់ពាក្យបច្ចេកទេសពិបាកៗត្រឹមតែ ១ ប្រយោគខ្លីៗ ស្រួលយល់បំផុត!'
                : 'Every confusing technical term explained in exactly 1 simple sentence.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                termEn: "Matrix",
                termKh: "ម៉ាទ្រីស (Matrix)",
                descEn: "A simple box or table of numbers arranged in rows and columns.",
                descKh: "ប្រអប់ ឬតារាងលេខដែលរៀបចំជាជួរដេក និងជួរឈរ។"
              },
              {
                termEn: "Dimension (Size)",
                termKh: "ទំហំ ឬ វិមាត្រ (Dimension)",
                descEn: "How tall and how wide the box is, measured as Rows × Columns.",
                descKh: "កម្ពស់ និងទទឹងរបស់ប្រអប់ វាស់ជា (ចំនួនជួរដេក × ចំនួនជួរឈរ)។"
              },
              {
                termEn: "Element / Entry",
                termKh: "ធាតុ (Element)",
                descEn: "A single number sitting inside one specific spot of the matrix.",
                descKh: "លេខមួយគ្រាប់ដែលស្ថិតនៅក្នុងក្រឡាណាមួយនៃម៉ាទ្រីស។"
              },
              {
                termEn: "Pixel",
                termKh: "ភីកសែល (Pixel)",
                descEn: "One single colored dot on a digital screen, stored as a number.",
                descKh: "ចំណុចពណ៌តូចមួយនៅលើអេក្រង់ ដែលកុំព្យូទ័ររក្សាទុកជាលេខ។"
              },
              {
                termEn: "Kernel / Filter",
                termKh: "កឺណែល ឬ ហ្វីលធ័រ (Kernel)",
                descEn: "A tiny 3×3 matrix used like a magnifying glass to blur or sharpen images.",
                descKh: "ម៉ាទ្រីសទំហំតូច (ដូចជា 3×3) ប្រើសម្រាប់បន្ទន់ ឬធ្វើឱ្យរូបភាពកាន់តែច្បាស់។"
              },
              {
                termEn: "Transpose",
                termKh: "ការត្រឡប់ (Transpose)",
                descEn: "Flipping a matrix sideways so that rows turn into columns.",
                descKh: "ការបង្វិលម៉ាទ្រីសផ្អៀង ដោយប្តូរជួរដេកទៅជាជួរឈរ។"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 shadow-sm">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isKh ? item.termKh : item.termEn}
                </span>
                <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                  {isKh ? item.descKh : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPIC 6: BEGINNER QUICK QUIZ */}
      {activeTopic === 'quick_quiz' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Smile className="w-6 h-6 text-pink-400" />
              {isKh ? 'សាកល្បងសមត្ថភាព (Beginner Quick Quiz)' : 'Beginner Quick Practice'}
            </h3>
            <p className={'text-xs md:text-sm text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'សំណួរងាយៗ ៣ សាកល្បងការយល់ដឹងរបស់អ្នក ឆ្លើយត្រូវមានការអបអរសាទរភ្លាមៗ!'
                : '3 simple, friendly questions to test your understanding with instant feedback.'}
            </p>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => {
              const selectedIdx = quizAnswers[q.id];
              const isSubmitted = showQuizFeedback[q.id];
              const isCorrect = selectedIdx === q.correct;

              return (
                <div key={q.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    Question {qIndex + 1}:
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {isKh ? q.qKh : q.qEn}
                  </h4>

                  <div className="space-y-2 pt-1">
                    {(isKh ? q.optionsKh : q.optionsEn).map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={'w-full text-left p-3 rounded-xl text-xs font-medium transition flex items-center justify-between border ' + (
                            isChosen
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                                : 'bg-rose-500/20 border-rose-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          )}
                        >
                          <span>{opt}</span>
                          {isChosen && (
                            <span>{isCorrect ? '✅ ត្រឹមត្រូវ!' : '❌ សាកល្បងម្តងទៀត'}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className={'p-3 rounded-xl text-xs leading-relaxed ' + (
                      isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                    )}>
                      {isKh ? q.explanationKh : q.explanationEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <LearningPathFooter currentTab="beginner" language={language} onNavigateTab={onNavigateTab} />
    </div>
  );
};
