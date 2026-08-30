'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Scan, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';
import { Language } from '@/types';
import { MathRenderer } from '../../MathRenderer';

interface ColorLabProps {
  language: Language;
}

export const ColorLab: React.FC<ColorLabProps> = ({ language }) => {
  const isKh = language === 'kh';
  const [activeSubTab, setActiveSubTab] = useState<'hsi' | 'cmyk' | 'slicing' | 'equalization'>('hsi');

  // HSI state (Default: Exercise 2 R=100, G=150, B=200)
  const [rgbHsi, setRgbHsi] = useState<{ r: number; g: number; b: number }>({ r: 100, g: 150, b: 200 });

  // CMYK state (Default: Exercise 3 R=51, G=255, B=102)
  const [rgbCmyk, setRgbCmyk] = useState<{ r: number; g: number; b: number }>({ r: 51, g: 255, b: 102 });

  // Slicing thresholds (Default: Exercise 5 T1=60, T2=170)
  const [sliceT1, setSliceT1] = useState<number>(60);
  const [sliceT2, setSliceT2] = useState<number>(170);

  // Canvases refs
  const grayScanRef = useRef<HTMLCanvasElement | null>(null);
  const slicedScanRef = useRef<HTMLCanvasElement | null>(null);
  const origEqRef = useRef<HTMLCanvasElement | null>(null);
  const rgbEqRef = useRef<HTMLCanvasElement | null>(null);
  const hsvEqRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Draw Baggage Scanner Simulation
  useEffect(() => {
    if (activeSubTab !== 'slicing') return;
    const grayCanvas = grayScanRef.current;
    const sliceCanvas = slicedScanRef.current;
    if (!grayCanvas || !sliceCanvas) return;

    const gCtx = grayCanvas.getContext('2d');
    const sCtx = sliceCanvas.getContext('2d');
    if (!gCtx || !sCtx) return;

    const w = grayCanvas.width;
    const h = grayCanvas.height;

    // Draw luggage body & items
    gCtx.fillStyle = '#1e293b';
    gCtx.fillRect(0, 0, w, h);

    // Border
    gCtx.strokeStyle = '#475569';
    gCtx.lineWidth = 10;
    gCtx.strokeRect(10, 10, w - 20, h - 20);

    // Organic clothes / shampoo bottles (mid density ~100-150)
    gCtx.fillStyle = '#64748b';
    gCtx.beginPath();
    gCtx.arc(80, 80, 45, 0, Math.PI * 2);
    gCtx.fill();

    gCtx.fillStyle = '#94a3b8';
    gCtx.fillRect(50, 120, 90, 50);

    // High-density metal object (knife blade ~225)
    gCtx.fillStyle = '#e2e8f0';
    gCtx.beginPath();
    gCtx.moveTo(170, 60);
    gCtx.lineTo(240, 130);
    gCtx.lineTo(230, 150);
    gCtx.lineTo(160, 80);
    gCtx.closePath();
    gCtx.fill();

    // Metal shield rectangle (~250)
    gCtx.fillStyle = '#f8fafc';
    gCtx.fillRect(180, 130, 70, 40);

    // Slicing logic
    const imgData = gCtx.getImageData(0, 0, w, h);
    const slicedData = sCtx.createImageData(w, h);
    const src = imgData.data;
    const dst = slicedData.data;

    for (let i = 0; i < src.length; i += 4) {
      const grayVal = src[i];
      let r = 0, g = 0, b = 0;

      if (grayVal <= sliceT1) {
        // Pure Blue
        r = 0; g = 0; b = 255;
      } else if (grayVal <= sliceT2) {
        // Pure Green
        r = 0; g = 255; b = 0;
      } else {
        // Pure Red
        r = 255; g = 0; b = 0;
      }

      dst[i] = r;
      dst[i + 1] = g;
      dst[i + 2] = b;
      dst[i + 3] = 255;
    }

    sCtx.putImageData(slicedData, 0, 0);
  }, [activeSubTab, sliceT1, sliceT2]);

  // 2. Draw Histogram Equalization Comparison
  useEffect(() => {
    if (activeSubTab !== 'equalization') return;
    const cOrig = origEqRef.current;
    const cRgb = rgbEqRef.current;
    const cHsv = hsvEqRef.current;
    if (!cOrig || !cRgb || !cHsv) return;

    const ctxOrig = cOrig.getContext('2d');
    const ctxRgb = cRgb.getContext('2d');
    const ctxHsv = cHsv.getContext('2d');
    if (!ctxOrig || !ctxRgb || !ctxHsv) return;

    const w = cOrig.width, h = cOrig.height;

    // Draw hazy dusk landscape
    const skyGrad = ctxOrig.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, 'rgb(180, 140, 130)');
    skyGrad.addColorStop(1, 'rgb(140, 130, 150)');
    ctxOrig.fillStyle = skyGrad;
    ctxOrig.fillRect(0, 0, w, h);

    // Mountains
    ctxOrig.fillStyle = 'rgb(100, 90, 110)';
    ctxOrig.beginPath();
    ctxOrig.moveTo(0, h * 0.7);
    ctxOrig.lineTo(w * 0.35, h * 0.45);
    ctxOrig.lineTo(w * 0.7, h * 0.65);
    ctxOrig.lineTo(w, h * 0.4);
    ctxOrig.lineTo(w, h);
    ctxOrig.lineTo(0, h);
    ctxOrig.closePath();
    ctxOrig.fill();

    // Grass hill
    ctxOrig.fillStyle = 'rgb(90, 110, 85)';
    ctxOrig.beginPath();
    ctxOrig.ellipse(w * 0.4, h * 0.95, w * 0.6, h * 0.25, 0, 0, Math.PI * 2);
    ctxOrig.fill();

    const origData = ctxOrig.getImageData(0, 0, w, h);
    const rgbData = ctxRgb.createImageData(w, h);
    const hsvData = ctxHsv.createImageData(w, h);

    for (let i = 0; i < origData.data.length; i += 4) {
      let r = origData.data[i];
      let g = origData.data[i + 1];
      let b = origData.data[i + 2];

      // Distorted RGB version
      rgbData.data[i] = Math.min(255, Math.pow(r / 180, 2.2) * 255);
      rgbData.data[i + 1] = Math.min(255, Math.pow(g / 150, 1.2) * 230);
      rgbData.data[i + 2] = Math.min(255, Math.pow(b / 200, 3.0) * 255);
      rgbData.data[i + 3] = 255;

      // Proper HSV V-Equalization (Preserves hue ratio)
      const maxC = Math.max(r, g, b);
      const factor = maxC === 0 ? 1 : Math.min(255, (maxC - 60) * 2.2) / maxC;
      hsvData.data[i] = Math.min(255, Math.max(0, r * factor));
      hsvData.data[i + 1] = Math.min(255, Math.max(0, g * factor));
      hsvData.data[i + 2] = Math.min(255, Math.max(0, b * factor));
      hsvData.data[i + 3] = 255;
    }

    ctxRgb.putImageData(rgbData, 0, 0);
    ctxHsv.putImageData(hsvData, 0, 0);
  }, [activeSubTab]);

  // HSI Math Computations
  const rNorm = rgbHsi.r / 255;
  const gNorm = rgbHsi.g / 255;
  const bNorm = rgbHsi.b / 255;
  const minNorm = Math.min(rNorm, gNorm, bNorm);
  const sumNorm = rNorm + gNorm + bNorm;
  const intensity8Bit = Math.round((rgbHsi.r + rgbHsi.g + rgbHsi.b) / 3);
  let satHsi = sumNorm > 0 ? 1 - (3 / sumNorm) * minNorm : 0;
  satHsi = Math.max(0, Math.min(1, satHsi));

  // CMYK Math Computations
  const rP = rgbCmyk.r / 255;
  const gP = rgbCmyk.g / 255;
  const bP = rgbCmyk.b / 255;
  const maxP = Math.max(rP, gP, bP);
  const kVal = 1 - maxP;
  const cVal = kVal < 1 ? (1 - rP - kVal) / (1 - kVal) : 0;
  const mVal = kVal < 1 ? (1 - gP - kVal) / (1 - kVal) : 0;
  const yVal = kVal < 1 ? (1 - bP - kVal) / (1 - kVal) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('hsi')}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === 'hsi'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          1. RGB ↔ HSI / HSV Calculator
        </button>
        <button
          onClick={() => setActiveSubTab('cmyk')}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === 'cmyk'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          2. RGB ↔ CMYK Subtractive Inks
        </button>
        <button
          onClick={() => setActiveSubTab('slicing')}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === 'slicing'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          3. Airport Baggage Scanner Slicing
        </button>
        <button
          onClick={() => setActiveSubTab('equalization')}
          className={`px-4 py-2 rounded-xl transition ${
            activeSubTab === 'equalization'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          4. HSV V-Equalization vs RGB Distortion
        </button>
      </div>

      
      {activeSubTab === 'hsi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> RGB Controls
                </h4>
                <button
                  onClick={() => setRgbHsi({ r: 100, g: 150, b: 200 })}
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition"
                >
                  Load Ex 2 (100, 150, 200)
                </button>
              </div>

              
              <div
                className="p-4 rounded-2xl border border-slate-700/80 mb-5 flex items-center gap-4 shadow-inner"
                style={{ background: `rgb(${rgbHsi.r}, ${rgbHsi.g}, ${rgbHsi.b})` }}
              >
                <div className="bg-slate-950/80 backdrop-blur px-3 py-2 rounded-xl border border-white/20 text-white font-mono text-xs shadow">
                  RGB({rgbHsi.r}, {rgbHsi.g}, {rgbHsi.b}) <br />
                  HEX: #{((1 << 24) + (rgbHsi.r << 16) + (rgbHsi.g << 8) + rgbHsi.b).toString(16).slice(1).toUpperCase()}
                </div>
              </div>

              
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-rose-400 font-bold mb-1">
                    <span>Red (R): {rgbHsi.r}</span>
                    <span className="text-slate-400 font-normal">Norm: {rNorm.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgbHsi.r}
                    onChange={(e) => setRgbHsi({ ...rgbHsi, r: parseInt(e.target.value) })}
                    className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-emerald-400 font-bold mb-1">
                    <span>Green (G): {rgbHsi.g}</span>
                    <span className="text-slate-400 font-normal">Norm: {gNorm.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgbHsi.g}
                    onChange={(e) => setRgbHsi({ ...rgbHsi, g: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sky-400 font-bold mb-1">
                    <span>Blue (B): {rgbHsi.b}</span>
                    <span className="text-slate-400 font-normal">Norm: {bNorm.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgbHsi.b}
                    onChange={(e) => setRgbHsi({ ...rgbHsi, b: parseInt(e.target.value) })}
                    className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'រូបមន្តគណនា Intensity និង Saturation ត្រូវអនុវត្តលើតម្លៃ Normalized ក្នុងចន្លោះ [0, 1]។'
                : 'Formulas operate on normalized RGB in range [0, 1] for mathematical accuracy.'}
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> HSI Mathematical Step Breakdown
            </h4>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
              <div className="text-slate-300 font-bold mb-1">1. Normalization to Range [0, 1]:</div>
              <MathRenderer
                content={`$$R_{\\text{norm}} = \\frac{${rgbHsi.r}}{255} \\approx ${rNorm.toFixed(4)}, \\quad G_{\\text{norm}} = \\frac{${rgbHsi.g}}{255} \\approx ${gNorm.toFixed(4)}, \\quad B_{\\text{norm}} = \\frac{${rgbHsi.b}}{255} \\approx ${bNorm.toFixed(4)}$$`}
              />
              <div className="mt-1 text-slate-300 font-mono">
                Sum = <span className="font-bold text-amber-300">{sumNorm.toFixed(4)}</span>, min ={' '}
                <span className="font-bold text-sky-300">{minNorm.toFixed(4)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-bold">2. Intensity Component (I):</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">I = {intensity8Bit} (8-bit)</span>
              </div>
              <MathRenderer
                content={`$$I = \\frac{${rgbHsi.r} + ${rgbHsi.g} + ${rgbHsi.b}}{3} = \\frac{${rgbHsi.r + rgbHsi.g + rgbHsi.b}}{3} = ${intensity8Bit}$$`}
              />
            </div>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-bold">3. Saturation Component (S):</span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  S = {satHsi.toFixed(4)} ({(satHsi * 100).toFixed(2)}%)
                </span>
              </div>
              <MathRenderer
                content={`$$S = 1 - \\frac{3}{${sumNorm.toFixed(4)}} \\times ${minNorm.toFixed(4)} = ${satHsi.toFixed(4)}$$`}
              />
            </div>
          </div>
        </div>
      )}

      
      {activeSubTab === 'cmyk' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> RGB Printing Input
                </h4>
                <button
                  onClick={() => setRgbCmyk({ r: 51, g: 255, b: 102 })}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 transition"
                >
                  Load Ex 3 (51, 255, 102)
                </button>
              </div>

              <div
                className="p-4 rounded-2xl border border-slate-700/80 mb-5 flex items-center justify-between shadow-inner"
                style={{ background: `rgb(${rgbCmyk.r}, ${rgbCmyk.g}, ${rgbCmyk.b})` }}
              >
                <div className="bg-slate-950/80 backdrop-blur px-3 py-2 rounded-xl border border-white/20 text-white font-mono text-xs">
                  RGB({rgbCmyk.r}, {rgbCmyk.g}, {rgbCmyk.b}) <br />
                  Normalized: ({rP.toFixed(2)}, {gP.toFixed(2)}, {bP.toFixed(2)})
                </div>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-rose-400 font-bold mb-1">
                    <span>Red (R): {rgbCmyk.r}</span>
                    <span className="text-slate-400">R\' = {rP.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgbCmyk.r}
                    onChange={(e) => setRgbCmyk({ ...rgbCmyk, r: parseInt(e.target.value) })}
                    className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-emerald-400 font-bold mb-1">
                    <span>Green (G): {rgbCmyk.g}</span>
                    <span className="text-slate-400">G\' = {gP.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgbCmyk.g}
                    onChange={(e) => setRgbCmyk({ ...rgbCmyk, g: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sky-400 font-bold mb-1">
                    <span>Blue (B): {rgbCmyk.r}</span>
                    <span className="text-slate-400">B\' = {bP.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgbCmyk.b}
                    onChange={(e) => setRgbCmyk({ ...rgbCmyk, b: parseInt(e.target.value) })}
                    className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'CMYK គឺជា Subtractive Color Model ប្រើប្រាស់សម្រាប់បច្ចេកវិទ្យាបោះពុម្ព (Printing)។'
                : 'CMYK is a subtractive color model used in color printing.'}
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> CMYK Subtractive Calculation & Inks
            </h4>

            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-bold">Step 1: Calculate Key (Black, K)</span>
                <span className="font-mono text-slate-200 font-bold">
                  K = {(kVal * 100).toFixed(1)}% ({kVal.toFixed(2)})
                </span>
              </div>
              <MathRenderer
                content={`$$K = 1 - \\max(R', G', B') = 1 - \\max(${rP.toFixed(2)}, ${gP.toFixed(2)}, ${bP.toFixed(2)}) = ${kVal.toFixed(2)}$$`}
              />
            </div>

            
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-cyan-400 mb-1">
                  <span>Cyan (C)</span>
                  <span>{(cVal * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all duration-300" style={{ width: `${cVal * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-fuchsia-400 mb-1">
                  <span>Magenta (M)</span>
                  <span>{(mVal * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-fuchsia-500 h-full rounded-full transition-all duration-300" style={{ width: `${mVal * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-yellow-400 mb-1">
                  <span>Yellow (Y)</span>
                  <span>{(yVal * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full rounded-full transition-all duration-300" style={{ width: `${yVal * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Key / Black (K)</span>
                  <span>{(kVal * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full transition-all duration-300" style={{ width: `${kVal * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activeSubTab === 'slicing' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Airport Baggage Scanner Simulator (Exercise 5)
              </h4>
              <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
                {isKh
                  ? 'កាត់កម្រិតដង់ស៊ីតេប្រផេះជា ៣ តំបន់ពណ៌៖ ខៀវ (ដង់ស៊ីតេទាប) | បៃតង (សរីរាង្គ) | ក្រហម (លោហៈ/អាវុធ)'
                  : 'Map grayscale density to 3 pseudo-colors: Blue (Low) | Green (Organics) | Red (Metals/Weapons)'}
              </p>
            </div>
            <button
              onClick={() => {
                setSliceT1(60);
                setSliceT2(170);
              }}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition"
            >
              Reset ($T_1=60, T_2=170$)
            </button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-mono">
            <div>
              <div className="flex justify-between text-cyan-400 font-bold mb-1">
                <span>Threshold 1 (T1: Blue ↔ Green): {sliceT1}</span>
                <span>0 to {sliceT1} = Pure Blue</span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                value={sliceT1}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setSliceT1(v >= sliceT2 ? sliceT2 - 5 : v);
                }}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-rose-400 font-bold mb-1">
                <span>Threshold 2 (T2: Green ↔ Red): {sliceT2}</span>
                <span>{sliceT2} to 255 = Pure Red</span>
              </div>
              <input
                type="range"
                min={151}
                max={240}
                value={sliceT2}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setSliceT2(v <= sliceT1 ? sliceT1 + 5 : v);
                }}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Scan className="w-4 h-4 text-slate-400" /> Original X-Ray Grayscale Scanner
              </span>
              <canvas ref={grayScanRef} width={280} height={200} className="rounded-xl shadow-inner border border-slate-700 bg-black" />
              <span className="text-[11px] text-slate-400 mt-2 font-mono">8-bit Grayscale Density $f(x,y)$</span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" /> Pseudo-Color Sliced Output
              </span>
              <canvas ref={slicedScanRef} width={280} height={200} className="rounded-xl shadow-inner border border-slate-700 bg-black" />
              <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" /> Low (0-{sliceT1})
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded bg-green-500 inline-block" /> Mid ({sliceT1 + 1}-{sliceT2})
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded bg-red-600 inline-block" /> High ({sliceT2 + 1}-255)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activeSubTab === 'equalization' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> HSV Value Equalization vs Naive RGB Distortion (Exercise 4)
            </h4>
            <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'ការប្រៀបធៀបជាក់ស្តែង៖ ហេតុអ្វីបានជាការធ្វើ Histogram Equalization លើឆានែល R, G, B ដាច់ដោយឡែក បណ្តាលឱ្យខូចទ្រង់ទ្រាយពណ៌ (Color Distortion)?'
                : 'Why independent RGB equalization distorts color harmony, and why HSV V-channel equalization is the industry standard.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300 mb-2">1. Low Contrast Input</span>
              <canvas ref={origEqRef} width={220} height={150} className="rounded-xl border border-slate-700 bg-black" />
              <span className={`text-[10px] text-slate-400 mt-2 text-center ${isKh ? 'khmer-font' : ''}`}>
                {isKh ? 'រូបភាពដើមស្រអាប់ មាន Contrast ទាប' : 'Original low contrast image'}
              </span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-rose-900/50 bg-rose-950/10 flex flex-col items-center">
              <span className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 2. Naive RGB Equalized
              </span>
              <canvas ref={rgbEqRef} width={220} height={150} className="rounded-xl border border-rose-800 bg-black" />
              <span className={`text-[10px] text-rose-300 mt-2 text-center ${isKh ? 'khmer-font' : ''}`}>
                {isKh ? '❌ ខូចជាតិពណ៌ដើម ដោយសារ R,G,B រីកដោយឯករាជ្យ' : 'Severe color distortion'}
              </span>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-900/50 bg-emerald-950/10 flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3. HSV V-Equalized
              </span>
              <canvas ref={hsvEqRef} width={220} height={150} className="rounded-xl border border-emerald-800 bg-black" />
              <span className={`text-[10px] text-emerald-300 mt-2 text-center ${isKh ? 'khmer-font' : ''}`}>
                {isKh ? '✅ រក្សាជាតិពណ៌ដើម (Hue & Saturation) 100%' : 'Contrast enhanced, exact hues preserved'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
