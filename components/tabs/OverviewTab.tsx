'use client';

import React from 'react';
import { BookOpen, FlaskConical, GraduationCap, Grid, Palette, Sliders, Binary, Sigma, Sparkles } from 'lucide-react';
import { Language, MainTab } from '@/types';
import { MathRenderer } from '../MathRenderer';

interface OverviewTabProps {
  language: Language;
  onNavigateTab: (tab: MainTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ language, onNavigateTab }) => {
  const isKh = language === 'kh';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="relative overflow-hidden glass-panel p-8 md:p-10 rounded-3xl border border-indigo-900/50 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Digital Image Processing Course & Exam Prep Hub
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {isKh ? 'មជ្ឈមណ្ឌលសិក្សា & អនុវត្ត Digital Image Processing' : 'Master Digital Image Processing with Interactive Labs'}
          </h1>

          <p className={`text-sm md:text-base text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
            {isKh
              ? 'វេទិកាអន្តរកម្មពេញលេញសម្រាប់សិក្សាលំហាត់ និងដំណោះស្រាយកម្រិតខ្ពស់ (Spatial Filtering, HSI/HSV/CMYK Models, Pseudo-color Density Slicing, Edge Detection និង Mathematical Morphology) ស្របតាមឯកសារមេរៀន និងត្រៀមប្រឡង។'
              : 'A comprehensive interactive platform covering step-by-step worked solutions, real-time matrix sandboxes, formula derivations, and self-assessment quizzes based on the Digital Image Processing curriculum.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('beginner')}
              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 ring-1 ring-emerald-400"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isKh ? '🌱 មូលដ្ឋានគ្រឹះ 101 (ងាយយល់)' : '🌱 Beginner 101 (Start Here)'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('exercises')}
              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isKh ? 'មើលដំណោះស្រាយទាំង ៨ លំហាត់' : 'Explore 8 Worked Exercises'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('labs')}
              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{isKh ? 'បើកបន្ទប់ពិសោធន៍ Simulation' : 'Launch Interactive Labs'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('exam')}
              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isKh ? 'ប្រឡងសាកល្បង Quiz' : 'Take Practice Exam'}</span>
            </button>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div
          onClick={() => onNavigateTab('exercises')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between cursor-pointer transition"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Grid className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Spatial Filtering</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'Box filter smoothing, Valid padding vs Zero-padding, និង 2D matrix convolution។'
                : 'Box filter smoothing, Valid vs Zero padding boundary handling, and 2D convolution.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-indigo-400 font-medium">
            Exercises 1 & 6 →
          </div>
        </div>

        
        <div
          onClick={() => onNavigateTab('exercises')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between cursor-pointer transition"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Color Spaces & CMYK</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'ការគណនា HSI Intensity & Saturation, និងការបំប្លែង RGB ទៅជា CMYK Subtractive model។'
                : 'HSI intensity & saturation normalization, and RGB to CMYK subtractive conversion formulas.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-emerald-400 font-medium">
            Exercises 2 & 3 →
          </div>
        </div>

        
        <div
          onClick={() => onNavigateTab('exercises')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between cursor-pointer transition"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Enhancement & Slicing</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'HSV V-channel equalization (cv2.equalizeHist) និង Pseudo-color density slicing ដោយប្រើ NumPy masks។'
                : 'HSV V-channel histogram equalization & Pseudo-color density slicing with NumPy masks.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-rose-400 font-medium">
            Exercises 4 & 5 →
          </div>
        </div>

        
        <div
          onClick={() => onNavigateTab('exercises')}
          className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between cursor-pointer transition"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Mathematical Morphology</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'Dilation (⊕), Erosion (⊖), Internal/External boundaries (βint, βext) និង Morphological Gradient។'
                : 'Dilation (⊕), Erosion (⊖), Internal/External boundaries, and morphological gradient.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-cyan-400 font-medium">
            Exercises 7 & 8 →
          </div>
        </div>
      </div>

      
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sigma className="w-5 h-5 text-indigo-400" />
              <span>{isKh ? 'តារាងសង្ខេបរូបមន្តសំខាន់ៗសម្រាប់ប្រឡង (Formula Cheatsheet)' : 'Essential Exam Formulas Cheatsheet'}</span>
            </h2>
            <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'រូបមន្តគន្លឹះទាំងអស់ដែលត្រូវបានប្រើប្រាស់ក្នុងលំហាត់ទាំង ៨' : 'Quick reference of all core mathematical formulas across the 8 exercises.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 block">1. HSI Color Model</span>
            <MathRenderer content="$$I = \frac{R + G + B}{3}$$" />
            <MathRenderer content="$$S = 1 - \frac{3}{R + G + B}[\min(R, G, B)]$$" />
            <p className={`text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'ចំណាំ៖ ត្រូវ Normalize R, G, B ទៅក្នុងចន្លោះ [0, 1] ដោយចែកនឹង 255 ជាមុនសិន។' : 'Note: Values must be normalized to [0, 1] by dividing by 255.'}
            </p>
          </div>

          
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 block">2. CMYK Subtractive Model</span>
            <MathRenderer content="$$K = 1 - \max(R', G', B')$$ $$C = \frac{1 - R' - K}{1 - K}, \quad M = \frac{1 - G' - K}{1 - K}$$ $$Y = \frac{1 - B' - K}{1 - K}$$" />
            <p className={`text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'R\', G\', B\' គឺជាតម្លៃ Normalized ក្នុងចន្លោះ [0, 1]។' : 'R\', G\', B\' are RGB components in the normalized range [0, 1].'}
            </p>
          </div>

          
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 block">3. Laplacian Filter (2nd Derivative)</span>
            <MathRenderer content="$$H = \begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$ $$\nabla^2 f = (N + S + W + E) - 4 \times C$$" />
            <p className={`text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'ប្រសិនបើតម្លៃចេញមកអវិជ្ជមាន (< 0) ត្រូវកាត់ស្មើ 0 (Clipping [0, 255])។' : 'Negative values must be clipped to 0 (Range [0, 255]).'}
            </p>
          </div>

          
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 block">4. Internal & External Boundaries</span>
            <MathRenderer content="$$\beta_{\text{int}}(A) = A - (A \ominus B)$$ $$\beta_{\text{ext}}(A) = (A \oplus B) - A$$" />
            <p className={`text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'Internal: យក A ដក Erosion | External: យក Dilation ដក A។' : 'Internal takes boundary from inside object; External from outside shell.'}
            </p>
          </div>

          
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 block">5. Morphological Gradient</span>
            <MathRenderer content="$$G(A) = (A \oplus B) - (A \ominus B)$$" />
            <p className={`text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'វាស់វែងគម្លាតរវាងការរីក និងការរួម ដើម្បីទាញយកខ្សែបន្ទាត់គែមរួម។' : 'Measures difference between dilation and erosion.'}
            </p>
          </div>

          
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-rose-400 block">6. Box Filter Smoothing (3x3)</span>
            <MathRenderer content="$$H = \frac{1}{9}\begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}$$ $$g(x,y) = \frac{1}{9}\sum_{s=-1}^1 \sum_{t=-1}^1 f(x+s, y+t)$$" />
            <p className={`text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'បូកតម្លៃជុំវិញទាំង 9 រួចចែកនឹង 9 ដើម្បីបន្ទន់កម្រិតពណ៌។' : 'Sums 9 neighboring pixel values and divides by 9.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
