'use client';

import React, { useState } from 'react';
import { FlaskConical, Grid, Palette, Binary } from 'lucide-react';
import { Language } from '@/types';
import { SpatialFilterLab } from './labs/SpatialFilterLab';
import { ColorLab } from './labs/ColorLab';
import { MorphologyLab } from './labs/MorphologyLab';

interface LabsTabProps {
  language: Language;
}

export const LabsTab: React.FC<LabsTabProps> = ({ language }) => {
  const isKh = language === 'kh';
  const [activeLab, setActiveLab] = useState<'spatial' | 'color' | 'morphology'>('spatial');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
            <span>{isKh ? 'បន្ទប់ពិសោធន៍ Simulation អន្តរកម្ម' : 'Interactive Image Processing Simulation Lab'}</span>
          </h2>
          <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
            {isKh
              ? 'ជ្រើសរើសផ្នែកពិសោធន៍ដើម្បីតេស្តម៉ាទ្រីស កម្រិតពណ៌ និងទម្រង់ Morphology ដោយផ្ទាល់។'
              : 'Select a simulation module to experiment with spatial filtering, color models, and morphology.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveLab('spatial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeLab === 'spatial'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Spatial Filter Lab</span>
          </button>
          <button
            onClick={() => setActiveLab('color')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeLab === 'color'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Color & Slicing Lab</span>
          </button>
          <button
            onClick={() => setActiveLab('morphology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeLab === 'morphology'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>Morphology Lab</span>
          </button>
        </div>
      </div>

      
      {activeLab === 'spatial' && <SpatialFilterLab language={language} />}
      {activeLab === 'color' && <ColorLab language={language} />}
      {activeLab === 'morphology' && <MorphologyLab language={language} />}
    </div>
  );
};
