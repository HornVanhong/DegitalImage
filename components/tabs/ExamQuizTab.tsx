'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GraduationCap, Play, RotateCcw, Award, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Lightbulb, CheckSquare } from 'lucide-react';
import { Language, QuizQuestion } from '@/types';
import { MathRenderer } from '../MathRenderer';

interface ExamQuizTabProps {
  language: Language;
}

export const ExamQuizTab: React.FC<ExamQuizTabProps> = ({ language }) => {
  const isKh = language === 'kh';

  const [topicFilter, setTopicFilter] = useState<'all' | 'spatial' | 'color' | 'morphology'>('all');
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Question Generators
  const generateSpatialBoxQ = (): QuizQuestion => {
    const m = [
      [Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10],
      [Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10],
      [Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10, Math.floor(Math.random() * 50) + 10]
    ];
    const sum = m.flat().reduce((a, b) => a + b, 0);
    const correctVal = Number((sum / 9).toFixed(2));

    const options = [
      correctVal.toString(),
      (correctVal + 12.5).toFixed(2),
      Math.max(1, correctVal - 8.33).toFixed(2),
      (sum / 8).toFixed(2)
    ].sort(() => Math.random() - 0.5);

    return {
      type: 'spatial',
      titleEn: 'Spatial Box Filter Calculation (Valid Padding)',
      titleKh: 'ការគណនា Box Filter (Valid Padding)',
      promptEn: `Given the $3\\times 3$ image segment:
$$I = \\begin{bmatrix} ${m[0][0]} & ${m[0][1]} & ${m[0][2]} \\\\ ${m[1][0]} & ${m[1][1]} & ${m[1][2]} \\\\ ${m[2][0]} & ${m[2][1]} & ${m[2][2]} \\end{bmatrix}$$
Calculate the filtered pixel value at the center position using a $3\\times 3$ Box Filter $H = \\frac{1}{9}\\begin{bmatrix} 1&1&1\\\\1&1&1\\\\1&1&1 \\end{bmatrix}$.`,
      promptKh: `គេឱ្យផ្ទាំង Matrix $3\\times 3$ ដូចខាងលើ។ ចូរគណនាតម្លៃ Pixel ថ្មីនៅចំកណ្តាលដោយប្រើ Box Filter $3\\times 3$ $H = \\frac{1}{9}[1]_{3\\times 3}$។`,
      options,
      correctAnswer: correctVal.toString(),
      solutionEn: `$$\\text{Sum} = ${m[0].join('+')} + ${m[1].join('+')} + ${m[2].join('+')} = ${sum}$$
$$\\text{Result} = \\frac{1}{9} \\times ${sum} = ${correctVal}$$`,
      solutionKh: `បូកធាតុទាំង 9 បញ្ចូលគ្នា៖ $\\text{Sum} = ${sum}$ រួចគុណនឹង $\\frac{1}{9} = ${correctVal}$។`
    };
  };

  const generateHsiQ = (): QuizQuestion => {
    const r = (Math.floor(Math.random() * 5) + 1) * 30;
    const g = (Math.floor(Math.random() * 5) + 1) * 40;
    const b = (Math.floor(Math.random() * 4) + 1) * 50;
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const sumN = rN + gN + bN;
    const minN = Math.min(rN, gN, bN);
    const sat = Number((1 - (3 / sumN) * minN).toFixed(4));
    const intensity = Math.round((r + g + b) / 3);

    const isSat = Math.random() > 0.5;

    if (isSat) {
      const correct = sat.toString();
      const options = [
        correct,
        Math.max(0.05, sat - 0.15).toFixed(4),
        Math.min(0.95, sat + 0.12).toFixed(4),
        minN.toFixed(4)
      ].sort(() => Math.random() - 0.5);

      return {
        type: 'color',
        titleEn: 'HSI Saturation Calculation',
        titleKh: 'ការគណនា Saturation ($S$) ក្នុងប្រព័ន្ធ HSI',
        promptEn: `For an RGB pixel with values $R = ${r}, G = ${g}, B = ${b}$, compute the normalized **Saturation component ($S$)** using the standard HSI formula:
$$S = 1 - \\frac{3}{R_{\\text{norm}} + G_{\\text{norm}} + B_{\\text{norm}}}[\\min(R_{\\text{norm}}, G_{\\text{norm}}, B_{\\text{norm}})]$$`,
        promptKh: `សម្រាប់ Pixel ពណ៌ដែលមាន $R = ${r}, G = ${g}, B = ${b}$ ចូរគណនាតម្លៃ Saturation ($S$) ក្នុងប្រព័ន្ធ HSI។`,
        options,
        correctAnswer: correct,
        solutionEn: `1. $R' = \\frac{${r}}{255} \\approx ${rN.toFixed(4)}, G' = \\frac{${g}}{255} \\approx ${gN.toFixed(4)}, B' = \\frac{${b}}{255} \\approx ${bN.toFixed(4)}$
2. $\\min(R',G',B') = ${minN.toFixed(4)}$, $\\text{Sum} = ${sumN.toFixed(4)}$
3. $S = 1 - \\frac{3}{${sumN.toFixed(4)}} \\times ${minN.toFixed(4)} = ${sat}$`,
        solutionKh: `ធ្វើ Normalization លើ R, G, B រួចជំនួសចូលរូបមន្តទទួលបាន $S = ${sat}$ (${(sat * 100).toFixed(2)}%)។`
      };
    } else {
      const correct = intensity.toString();
      const options = [
        correct,
        (intensity + 25).toString(),
        Math.max(10, intensity - 30).toString(),
        Math.round((r + b) / 2).toString()
      ].sort(() => Math.random() - 0.5);

      return {
        type: 'color',
        titleEn: 'HSI Intensity Component (I)',
        titleKh: 'ការគណនា Intensity ($I$) ក្នុងប្រព័ន្ធ HSI',
        promptEn: `For an RGB pixel with values $R = ${r}, G = ${g}, B = ${b}$, calculate the **Intensity component ($I$)** on the 8-bit scale:`,
        promptKh: `សម្រាប់ Pixel ពណ៌ដែលមាន $R = ${r}, G = ${g}, B = ${b}$ ចូរគណនាតម្លៃ Intensity ($I$) លើកម្រិត 8-bit៖`,
        options,
        correctAnswer: correct,
        solutionEn: `$$I = \\frac{R + G + B}{3} = \\frac{${r} + ${g} + ${b}}{3} = \\frac{${r + g + b}}{3} = ${intensity}$$`,
        solutionKh: `$$I = \\frac{R + G + B}{3} = \\frac{${r + g + b}}{3} = ${intensity}$$`
      };
    }
  };

  const generateCmykQ = (): QuizQuestion => ({
    type: 'color',
    titleEn: 'RGB to CMYK Subtractive Color Conversion',
    titleKh: 'ការបំប្លែងពណ៌ពី RGB ទៅ CMYK',
    promptEn: `A pixel has $R = 51, G = 255, B = 102$. What are the resulting $(C, M, Y, K)$ values for printing?`,
    promptKh: `Pixel មួយមានតម្លៃ $R = 51, G = 255, B = 102$។ តើតម្លៃ $(C, M, Y, K)$ សម្រាប់បោះពុម្ពស្មើនឹងប៉ុន្មាន?`,
    options: [
      'C = 80%, M = 0%, Y = 60%, K = 0%',
      'C = 20%, M = 100%, Y = 40%, K = 0%',
      'C = 60%, M = 0%, Y = 80%, K = 20%',
      'C = 0%, M = 80%, Y = 20%, K = 40%'
    ],
    correctAnswer: 'C = 80%, M = 0%, Y = 60%, K = 0%',
    solutionEn: `1. Normalized: $R' = 0.2, G' = 1.0, B' = 0.4$
2. $K = 1 - \\max(0.2, 1.0, 0.4) = 0$
3. $C = \\frac{1 - 0.2 - 0}{1 - 0} = 0.8$ ($80\\%$)
4. $M = \\frac{1 - 1.0 - 0}{1} = 0.0$ ($0\\%$)
5. $Y = \\frac{1 - 0.4 - 0}{1} = 0.6$ ($60\\%$)`,
    solutionKh: `បំប្លែងទៅជា [0,1] រួចគណនា K=0, C=0.8 (80%), M=0.0 (0%), Y=0.6 (60%)។`
  });

  const generateLaplacianQ = (): QuizQuestion => ({
    type: 'spatial',
    titleEn: 'Laplacian Edge Detection Calculation & Clipping',
    titleKh: 'ការគណនា Laplacian Edge Filter',
    promptEn: `For a pixel with center value $75$ and 4-neighbors: $\\text{Top}=35, \\text{Bottom}=220, \\text{Left}=90, \\text{Right}=185$, what is the output value after applying the standard Laplacian mask $\\begin{bmatrix} 0&1&0\\\\1&-4&1\\\\0&1&0 \\end{bmatrix}$?`,
    promptKh: `សម្រាប់ Pixel ដែលមានតម្លៃកណ្តាល 75 និងធាតុជុំវិញ លើ=35, ក្រោម=220, ឆ្វេង=90, ស្តាំ=185 តើតម្លៃក្រោយចម្រោះ Laplacian ស្មើប៉ុន្មាន?`,
    options: ['230', '0 (Clipped)', '129', '300'],
    correctAnswer: '230',
    solutionEn: `$$\\text{Value} = (35 + 220 + 90 + 185) - 4(75) = 530 - 300 = 230$$`,
    solutionKh: `$$\\text{Value} = (35 + 220 + 90 + 185) - 4(75) = 530 - 300 = 230$$`
  });

  const generateDensitySlicingQ = (): QuizQuestion => ({
    type: 'color',
    titleEn: 'Pseudo-Color Baggage Scanner Density Mapping',
    titleKh: 'ការចាត់ចែងពណ៌ក្នុង Pseudo-Color Density Slicing',
    promptEn: `In the airport baggage scanner exercise (Exercise 5), what is the correct color assignment for density slicing?`,
    promptKh: `ក្នុងលំហាត់ស្កេនឥវ៉ាន់ព្រលានយន្តហោះ (លំហាត់ទី ៥) តើការបែងចែកពណ៌តាមដង់ស៊ីតេមួយណាត្រឹមត្រូវ?`,
    options: [
      'Low (0-60) -> Blue, Mid (61-170) -> Green, High (171-255) -> Red',
      'Low (0-60) -> Red, Mid (61-170) -> Green, High (171-255) -> Blue',
      'Low (0-60) -> Green, Mid (61-170) -> Blue, High (171-255) -> Red',
      'All pixels are mapped to Grayscale inverted values'
    ],
    correctAnswer: 'Low (0-60) -> Blue, Mid (61-170) -> Green, High (171-255) -> Red',
    solutionEn: `● Low density (0-60) = Pure Blue (BGR: [255, 0, 0])\n● Mid density (61-170) = Pure Green (BGR: [0, 255, 0])\n● High density (171-255) = Pure Red (BGR: [0, 0, 255])`,
    solutionKh: `ដង់ស៊ីតេទាប $\\rightarrow$ ខៀវ, សរីរាង្គមធ្យម $\\rightarrow$ បៃតង, លោហៈដង់ស៊ីតេខ្ពស់ $\\rightarrow$ ក្រហម។`
  });

  const generateOpenCvHsvQ = (): QuizQuestion => ({
    type: 'color',
    titleEn: 'Contrast Enhancement without Color Distortion',
    titleKh: 'ការពង្រឹង Contrast ដោយមិនឱ្យខូចជាតិពណ៌ដើម',
    promptEn: `Why is histogram equalization applied specifically to the **V (Value) channel** in HSV space rather than RGB channels independently?`,
    promptKh: `ហេតុអ្វីបានជាគេត្រូវធ្វើ Histogram Equalization តែលើឆានែល V (Value) ក្នុង HSV ជាជាងធ្វើលើ R, G, B ដាច់ដោយឡែកពីគ្នា?`,
    options: [
      'Equalize ONLY the V (Value) channel after converting to HSV, then convert back',
      'Equalize R, G, and B channels independently using cv2.equalizeHist()',
      'Convert to Grayscale, equalize, and discard color information',
      'Equalize both H and S channels while leaving V untouched'
    ],
    correctAnswer: 'Equalize ONLY the V (Value) channel after converting to HSV, then convert back',
    solutionEn: `Independent equalization of R, G, and B alters the relative ratios between channels, causing severe color shifts (Color Distortion). Equalizing only V boosts intensity while preserving Hue ($H$) and Saturation ($S$).`,
    solutionKh: `ការធ្វើលើ R, G, B ដោយឯករាជ្យធ្វើឱ្យខូចសមាមាត្រពណ៌ដើម។ ធ្វើតែលើ V channel ជួយបង្កើន Contrast ដោយរក្សាជាតិពណ៌ឱ្យនៅដដែល។`
  });

  const generateMorphologyBoundaryQ = (): QuizQuestion => ({
    type: 'morphology',
    titleEn: 'Morphological Boundary & Gradient Formulas',
    titleKh: 'រូបមន្ត Morphological Boundary & Gradient',
    promptEn: `Which set of mathematical morphology formulas correctly defines Internal Boundary, External Boundary, and Morphological Gradient?`,
    promptKh: `តើរូបមន្តមួយណាត្រឹមត្រូវសម្រាប់ Internal Boundary, External Boundary, និង Morphological Gradient?`,
    options: [
      'Internal: A - (A ⊖ B) | External: (A ⊕ B) - A | Gradient: (A ⊕ B) - (A ⊖ B)',
      'Internal: (A ⊕ B) - A | External: A - (A ⊖ B) | Gradient: A ⊕ B',
      'Internal: A ⊖ B | External: A ⊕ B | Gradient: A ∩ B',
      'Internal: A + (A ⊖ B) | External: A - (A ⊕ B) | Gradient: A - B'
    ],
    correctAnswer: 'Internal: A - (A ⊖ B) | External: (A ⊕ B) - A | Gradient: (A ⊕ B) - (A ⊖ B)',
    solutionEn: `● Internal Boundary: $\\beta_{\\text{int}}(A) = A - (A \\ominus B)$\n● External Boundary: $\\beta_{\\text{ext}}(A) = (A \\oplus B) - A$\n● Morphological Gradient: $G(A) = (A \\oplus B) - (A \\ominus B)$`,
    solutionKh: `រូបមន្តស្តង់ដារ៖ $\\beta_{\\text{int}} = A - (A \\ominus B)$, $\\beta_{\\text{ext}} = (A \\oplus B) - A$, $G = (A \\oplus B) - (A \\ominus B)$។`
  });

  const handleStartQuiz = () => {
    const allGenerators = [
      generateSpatialBoxQ,
      generateHsiQ,
      generateCmykQ,
      generateLaplacianQ,
      generateDensitySlicingQ,
      generateOpenCvHsvQ,
      generateMorphologyBoundaryQ
    ];

    let filtered = allGenerators;
    if (topicFilter === 'spatial') filtered = [generateSpatialBoxQ, generateLaplacianQ];
    else if (topicFilter === 'color') filtered = [generateHsiQ, generateCmykQ, generateDensitySlicingQ, generateOpenCvHsvQ];
    else if (topicFilter === 'morphology') filtered = [generateMorphologyBoundaryQ];

    const generated: QuizQuestion[] = [];
    for (let i = 0; i < questionCount; i++) {
      const fn = filtered[i % filtered.length];
      generated.push(fn());
    }

    setQuestions(generated.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Grade calculation
  const correctCount = questions.reduce((acc, q, i) => (userAnswers[i] === q.correctAnswer ? acc + 1 : acc), 0);
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  let gradeBadge = { text: 'Mastery Level: Excellent!', color: 'emerald', icon: <Award className="w-4 h-4" /> };
  if (percentage < 50) gradeBadge = { text: 'Needs Review - Keep Practicing!', color: 'rose', icon: <AlertCircle className="w-4 h-4" /> };
  else if (percentage < 80) gradeBadge = { text: 'Good Job - Almost Perfect!', color: 'amber', icon: <CheckCircle2 className="w-4 h-4" /> };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Self-Assessment & Exam Simulator
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {isKh ? 'ប្រឡងសាកល្បង & លំហាត់អនុវត្ត (Exam Practice)' : 'Interactive Digital Image Processing Practice Exam'}
            </h2>
            <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'បង្កើតសំណួរប្រឡងចៃដន្យដោយផ្អែកលើមេរៀនទាំង ៨ ជាមួយនឹងការកែពិន្ទុភ្លាមៗ និងបង្ហាញដំណោះស្រាយលម្អិត។'
                : 'Generate randomized exam problems based on all 8 exercise templates with auto-grading.'}
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            <span>{isKh ? 'ចាប់ផ្តើមប្រឡងថ្មី' : 'Start Practice Exam'}</span>
          </button>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1.5">Topic Focus:</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value as any)}
              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Topics (Comprehensive Full Exam)</option>
              <option value="spatial">Spatial Filtering & Edge Detection Only</option>
              <option value="color">Color Models (HSI/HSV/CMYK) & Slicing Only</option>
              <option value="morphology">Mathematical Morphology Only</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1.5">Number of Questions:</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value={6}>6 Questions (Quick Quiz - ~8 mins)</option>
              <option value={8}>8 Questions (Standard Exam - ~12 mins)</option>
              <option value={12}>12 Questions (Deep Mastery - ~18 mins)</option>
            </select>
          </div>
        </div>
      </div>

      
      {questions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Ready to test your Image Processing skills?</h3>
          <p className={`text-xs text-slate-400 max-w-md mx-auto ${isKh ? 'khmer-font' : ''}`}>
            {isKh ? 'ចុចប៊ូតុង "ចាប់ផ្តើមប្រឡងថ្មី" ខាងលើ ដើម្បីបង្កើតសំណួរប្រឡងចៃដន្យ។' : 'Click "Start Practice Exam" above to generate a new custom test set.'}
          </p>
        </div>
      ) : isSubmitted ? (
        
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                gradeBadge.color === 'emerald'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : gradeBadge.color === 'rose'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {gradeBadge.icon}
              <span>{gradeBadge.text}</span>
            </span>

            <h2 className="text-4xl font-extrabold text-white mb-2">
              {correctCount} / {total} Correct ({percentage}%)
            </h2>
            <p className={`text-sm text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'សូមពិនិត្យមើលដំណោះស្រាយលម្អិតមួយជំហានៗនៅខាងក្រោម ដើម្បីពង្រឹងចំណេះដឹងរបស់អ្នក។'
                : 'Review the step-by-step solutions below to reinforce your understanding.'}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleStartQuiz}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Generate New Exam
              </button>
            </div>
          </div>

          
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Step-by-Step Question Review & Solutions
            </h3>

            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`glass-panel p-5 rounded-3xl border ${
                    isCorrect ? 'border-emerald-800/80 bg-emerald-950/10' : 'border-rose-800/80 bg-rose-950/10'
                  } space-y-4 shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg ${
                        isCorrect ? 'bg-emerald-900/80 text-emerald-200' : 'bg-rose-900/80 text-rose-200'
                      }`}
                    >
                      Q{idx + 1}: {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold uppercase">{q.type}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{q.titleEn}</h4>
                    <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 mt-2">
                      <MathRenderer content={q.promptEn} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div
                      className={`p-3 rounded-xl border ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-800 text-rose-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-sans">Your Answer:</span>
                      <strong>{userAns || 'No Answer Selected'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
                      <span className="text-[10px] text-slate-400 block font-sans">Correct Answer:</span>
                      <strong>{q.correctAnswer}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="text-amber-400 font-bold font-sans flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Worked Solution & Explanation:
                    </div>
                    <MathRenderer content={q.solutionEn} />
                    <div className={`text-slate-400 border-t border-slate-800 pt-2 text-[11px] ${isKh ? 'khmer-font' : ''}`}>
                      <MathRenderer content={q.solutionKh} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono font-bold">
                Question {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {questions[currentIndex].type}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                    i === currentIndex
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md shadow-indigo-500/20'
                      : userAnswers[i] !== undefined
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-100">{questions[currentIndex].titleEn}</h3>
            <p className="text-xs text-indigo-300 khmer-font font-medium">{questions[currentIndex].titleKh}</p>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans space-y-2">
              <MathRenderer content={questions[currentIndex].promptEn} />
              <div className="text-xs text-slate-400 khmer-font border-t border-slate-800/80 pt-2">
                <MathRenderer content={questions[currentIndex].promptKh} />
              </div>
            </div>
          </div>

          
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select the correct answer:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questions[currentIndex].options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIndex] === opt;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setUserAnswers({ ...userAnswers, [currentIndex]: opt })}
                    className={`p-4 rounded-2xl text-left text-xs font-mono transition flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/90'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="break-words leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className={`px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 ${
                currentIndex === 0 ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" /> Submit Exam & View Solutions
              </button>
            ) : (
              <button
                onClick={() => currentIndex < questions.length - 1 && setCurrentIndex(currentIndex + 1)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
