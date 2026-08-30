'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Grid, 
  Layers, 
  Eye, 
  Move, 
  Cpu, 
  CheckCircle2, 
  Sliders, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen
} from 'lucide-react';
import { Language } from '@/types';
import { MathRenderer } from '../MathRenderer';

export type MatrixCategory = 
  | 'non_equal_calc' 
  | 'unequal_theory' 
  | 'spatial_kernels' 
  | 'representation' 
  | 'morphology_se' 
  | 'affine_geom';

interface MatrixTabProps {
  language: Language;
}

export const MatrixTab: React.FC<MatrixTabProps> = ({ language }) => {
  const isKh = language === 'kh';

  const [activeCategory, setActiveCategory] = useState<MatrixCategory>('non_equal_calc');

  // 1. Non-Equal Matrix Multiplication State
  const [dimM, setDimM] = useState<number>(2);
  const [dimK, setDimK] = useState<number>(3);
  const [dimN, setDimN] = useState<number>(2);

  const [nonEqualA, setNonEqualA] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6]
  ]);

  const [nonEqualB, setNonEqualB] = useState<number[][]>([
    [7, 8],
    [9, 1],
    [2, 3]
  ]);

  const [activeNonEqualCell, setActiveNonEqualCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });

  const handleResizeNonEqual = (newM: number, newK: number, newN: number) => {
    setDimM(newM);
    setDimK(newK);
    setDimN(newN);

    const nextA = Array.from({ length: newM }, (_, r) =>
      Array.from({ length: newK }, (_, c) => (r * newK + c + 1))
    );
    const nextB = Array.from({ length: newK }, (_, r) =>
      Array.from({ length: newN }, (_, c) => (r * newN + c + 2) * 2)
    );

    setNonEqualA(nextA);
    setNonEqualB(nextB);
    setActiveNonEqualCell({ r: 0, c: 0 });
  };

  const nonEqualResult = useMemo(() => {
    const res: number[][] = Array.from({ length: dimM }, () => Array(dimN).fill(0));
    const stepDetails: Record<string, { 
      terms: { a: number; b: number; prod: number }[]; 
      sum: number; 
      formula: string; 
      explanationKh: string; 
      explanationEn: string 
    }> = {};

    for (let r = 0; r < dimM; r++) {
      for (let c = 0; c < dimN; c++) {
        let sum = 0;
        const terms: { a: number; b: number; prod: number }[] = [];
        const termStrings: string[] = [];

        for (let k = 0; k < dimK; k++) {
          const a = nonEqualA[r]?.[k] ?? 0;
          const b = nonEqualB[k]?.[c] ?? 0;
          const prod = a * b;
          sum += prod;
          terms.push({ a, b, prod });
          termStrings.push('(' + a + ' \\times ' + b + ')');
        }

        res[r][c] = sum;
        stepDetails[r + '-' + c] = {
          terms,
          sum,
          formula: 'C_{' + (r+1) + (c+1) + '} = \\sum_{k=1}^{' + dimK + '} A_{' + (r+1) + 'k} \\cdot B_{k' + (c+1) + '} = ' + termStrings.join(' + ') + ' = ' + sum,
          explanationKh: 'យកជួរដេកទី ' + (r+1) + ' នៃ Matrix A គុណនឹងជួរឈរទី ' + (c+1) + ' នៃ Matrix B (Dot Product) ទទួលបានផលបូក = ' + sum + '។',
          explanationEn: 'Multiply Row ' + (r+1) + ' of Matrix A with Column ' + (c+1) + ' of Matrix B (Dot Product) = ' + sum + '.'
        };
      }
    }

    return { res, stepDetails };
  }, [nonEqualA, nonEqualB, dimM, dimK, dimN]);

  const handleUpdateNonEqualCell = (isA: boolean, r: number, c: number, val: number) => {
    const num = isNaN(val) ? 0 : val;
    if (isA) {
      const copy = nonEqualA.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
      setNonEqualA(copy);
    } else {
      const copy = nonEqualB.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
      setNonEqualB(copy);
    }
  };

  const stepRelativeNonEqual = (delta: number) => {
    const totalCells = dimM * dimN;
    const currentIdx = activeNonEqualCell.r * dimN + activeNonEqualCell.c;
    const nextIdx = (currentIdx + delta + totalCells) % totalCells;
    const nextR = Math.floor(nextIdx / dimN);
    const nextC = nextIdx % dimN;
    setActiveNonEqualCell({ r: nextR, c: nextC });
  };

  // 2. Spatial Kernels Catalog
  const [selectedKernelKey, setSelectedKernelKey] = useState<string>('box3x3');

  const kernelCatalog: Record<string, {
    name: string;
    category: 'smoothing' | 'edge' | 'sharpening';
    matrix: (string | number)[][];
    factor?: string;
    purposeEn: string;
    purposeKh: string;
    mathFormula: string;
  }> = {
    box3x3: {
      name: 'Box Filter (3x3 Mean / Averaging)',
      category: 'smoothing',
      factor: '1/9',
      matrix: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ],
      purposeEn: 'Low-pass spatial smoothing, blurs noise, averages local neighborhood.',
      purposeKh: 'បន្ទន់កម្រិតពណ៌ (Smoothing), កាត់បន្ថយ Noise, គណនាមធ្យមភាគនៃកោសិកាជុំវិញ។',
      mathFormula: 'g(x,y) = \\frac{1}{9}\\sum_{s=-1}^1 \\sum_{t=-1}^1 f(x+s, y+t)'
    },
    laplacian4: {
      name: 'Laplacian Filter (4-neighbor 2nd Derivative)',
      category: 'edge',
      factor: '1',
      matrix: [
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
      ],
      purposeEn: 'Second-order derivative edge detection in all directions.',
      purposeKh: 'ចាប់យកខ្សែបន្ទាត់គែមដោយប្រើដេរីវេទី២ នៃកម្រិតពន្លឺ (ចាប់បានគែមគ្រប់ទិសដៅ)។',
      mathFormula: '\\nabla^2 f = f(x+1,y) + f(x-1,y) + f(x,y+1) + f(x,y-1) - 4f(x,y)'
    },
    sobelX: {
      name: 'Sobel Horizontal Gradient (Gx / Vertical Edges)',
      category: 'edge',
      factor: '1',
      matrix: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ],
      purposeEn: 'First-order derivative gradient filter; detects VERTICAL edges.',
      purposeKh: 'ដេរីវេទី១ សម្រាប់ចាប់យកខ្សែបន្ទាត់គែមបញ្ឈរ។',
      mathFormula: 'G_x = [f(x+1,y-1)+2f(x+1,y)+f(x+1,y+1)] - [f(x-1,y-1)+2f(x-1,y)+f(x-1,y+1)]'
    }
  };

  const selectedKernel = kernelCatalog[selectedKernelKey] || kernelCatalog.box3x3;

  // 3. Affine state
  const [affineAngle, setAffineAngle] = useState<number>(30);
  const [affineScaleX, setAffineScaleX] = useState<number>(1.2);
  const [affineScaleY, setAffineScaleY] = useState<number>(1.2);
  const [affineTx, setAffineTx] = useState<number>(20);
  const [affineTy, setAffineTy] = useState<number>(15);

  const rad = (affineAngle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);
  const m00 = (affineScaleX * cosA).toFixed(3);
  const m01 = (-affineScaleY * sinA).toFixed(3);
  const m02 = affineTx.toFixed(1);
  const m10 = (affineScaleX * sinA).toFixed(3);
  const m11 = (affineScaleY * cosA).toFixed(3);
  const m12 = affineTy.toFixed(1);

  const activeKey = activeNonEqualCell.r + '-' + activeNonEqualCell.c;
  const activeNonEqualInfo = nonEqualResult.stepDetails[activeKey];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Calculator className="w-3.5 h-3.5" /> Interactive Matrix Masterclass & Step-by-Step Solver
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          {isKh ? 'មជ្ឈមណ្ឌលប្រមាណវិធី និងមេរៀន Matrix គ្រប់ប្រភេទ (Step-by-Step)' : 'Matrix Masterclass & Visual Step-by-Step Solver'}
        </h2>
        <p className={'text-xs md:text-sm text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
          {isKh
            ? 'សិក្សា និងអនុវត្តការគណនា Matrix មិនស្មើគ្នា (M×K គុណ K×N), Convolution លើរូបភាពទំហំធំជាមួយ Kernel តូច, Morphology លើទំហំមិនស៊ីមេទ្រី ព្រមទាំងរូបមន្តលម្អិត KaTeX ងាយយល់ និងងាយមើលបំផុត។'
            : 'Interactive step-by-step solver for non-equal dimension matrix multiplication, spatial convolution boundary reductions, asymmetric morphology, and affine transformations.'}
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveCategory('non_equal_calc')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeCategory === 'non_equal_calc'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>{isKh ? '១. កម្មវិធីគណនា Matrix មិនស្មើគ្នា' : '1. Non-Equal Matrix Multiplier'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('unequal_theory')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeCategory === 'unequal_theory'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{isKh ? '២. មេរៀន Matrix មិនស្មើគ្នា (ងាយមើល)' : '2. Unequal Matrices Guide'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('spatial_kernels')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeCategory === 'spatial_kernels'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Cpu className="w-4 h-4" />
          <span>{isKh ? '៣. តារាង Spatial Filter Kernels' : '3. Spatial Kernels'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('representation')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeCategory === 'representation'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Eye className="w-4 h-4" />
          <span>{isKh ? '៤. រូបភាពជា Matrix' : '4. Image as a Matrix'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('morphology_se')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeCategory === 'morphology_se'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>{isKh ? '៥. Morphology Structuring Elements' : '5. Morphology Elements'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('affine_geom')}
          className={'px-4 py-2.5 rounded-xl transition flex items-center gap-2 ' + (
            activeCategory === 'affine_geom'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Move className="w-4 h-4" />
          <span>{isKh ? '៦. ម៉ាទ្រីស Affine & Geometric' : '6. Affine Transformations'}</span>
        </button>
      </div>

      {/* 1. NON-EQUAL MATRIX MULTIPLICATION CALCULATOR */}
      {activeCategory === 'non_equal_calc' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>{isKh ? 'ម៉ាស៊ីនគណនា Matrix វិមាត្រមិនស្មើគ្នា (M×K គុណនឹង K×N)' : 'Interactive Non-Equal Matrix Multiplier (M×K by K×N)'}</span>
                </h3>
                <p className={'text-xs text-slate-400 mt-1 ' + (isKh ? 'khmer-font' : '')}>
                  {isKh
                    ? 'វិធានគ្រឹះ៖ ជួរឈរនៃ Matrix A ត្រូវតែស្មើនឹង ជួរដេកនៃ Matrix B (K = K)។ លទ្ធផល C នឹងមានទំហំ M × N។'
                    : 'Golden Rule: Columns of Matrix A must equal Rows of Matrix B (K = K). Result C has dimension M × N.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">{isKh ? 'គំរូទំហំ៖' : 'Presets:'}</span>
                <button
                  onClick={() => handleResizeNonEqual(2, 3, 2)}
                  className={'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ' + (
                    dimM === 2 && dimK === 3 && dimN === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  (2×3) × (3×2) → 2×2
                </button>
                <button
                  onClick={() => handleResizeNonEqual(3, 2, 3)}
                  className={'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ' + (
                    dimM === 3 && dimK === 2 && dimN === 3 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  (3×2) × (2×3) → 3×3
                </button>
                <button
                  onClick={() => handleResizeNonEqual(3, 3, 1)}
                  className={'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ' + (
                    dimM === 3 && dimK === 3 && dimN === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  (3×3) × (3×1) → 3×1 (Affine)
                </button>
                <button
                  onClick={() => handleResizeNonEqual(4, 2, 2)}
                  className={'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ' + (
                    dimM === 4 && dimK === 2 && dimN === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  )}
                >
                  (4×2) × (2×2) → 4×2
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                Matrix A: {dimM} × <span className="text-amber-300 underline font-black">{dimK}</span>
              </span>
              <span className="text-slate-500 font-bold">×</span>
              <span className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                Matrix B: <span className="text-amber-300 underline font-black">{dimK}</span> × {dimN}
              </span>
              <span className="text-slate-500 font-bold">=</span>
              <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shadow-md shadow-emerald-500/10">
                Result C: {dimM} × {dimN}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-indigo-300 font-bold mb-1">
                  <span>M (Rows of A): {dimM}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={dimM}
                  onChange={(e) => handleResizeNonEqual(parseInt(e.target.value), dimK, dimN)}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>

              <div className="p-3 bg-amber-950/30 rounded-2xl border border-amber-800/60">
                <div className="flex justify-between text-amber-300 font-bold mb-1">
                  <span>K (Inner Match Dimension): {dimK}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={dimK}
                  onChange={(e) => handleResizeNonEqual(dimM, parseInt(e.target.value), dimN)}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-cyan-300 font-bold mb-1">
                  <span>N (Cols of B): {dimN}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={dimN}
                  onChange={(e) => handleResizeNonEqual(dimM, dimK, parseInt(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 overflow-x-auto py-4">
              {/* Matrix A */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                  Matrix A ({dimM}×{dimK})
                </span>
                <div className="matrix-bracket">
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: 'repeat(' + dimK + ', minmax(42px, 52px))' }}
                  >
                    {nonEqualA.map((row, r) =>
                      row.map((val, c) => {
                        const isRowActive = activeNonEqualCell.r === r;
                        return (
                          <input
                            key={'nea-' + r + '-' + c}
                            type="number"
                            value={val}
                            onChange={(e) => handleUpdateNonEqualCell(true, r, c, parseInt(e.target.value))}
                            className={'h-11 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ' + (
                              isRowActive
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 font-black shadow-md shadow-amber-500/30'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                            )}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="text-2xl font-extrabold text-slate-400 flex items-center justify-center pt-6">
                <X className="w-6 h-6 text-indigo-400" />
              </div>

              {/* Matrix B */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  Matrix B ({dimK}×{dimN})
                </span>
                <div className="matrix-bracket">
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: 'repeat(' + dimN + ', minmax(42px, 52px))' }}
                  >
                    {nonEqualB.map((row, r) =>
                      row.map((val, c) => {
                        const isColActive = activeNonEqualCell.c === c;
                        return (
                          <input
                            key={'neb-' + r + '-' + c}
                            type="number"
                            value={val}
                            onChange={(e) => handleUpdateNonEqualCell(false, r, c, parseInt(e.target.value))}
                            className={'h-11 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ' + (
                              isColActive
                                ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-black shadow-md shadow-cyan-500/30'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                            )}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="text-2xl font-extrabold text-slate-400 flex items-center justify-center pt-6">
                =
              </div>

              {/* Result Matrix C */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Result Matrix C ({dimM}×{dimN})
                </span>
                <div className="matrix-bracket">
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: 'repeat(' + dimN + ', minmax(44px, 54px))' }}
                  >
                    {nonEqualResult.res.map((row, r) =>
                      row.map((val, c) => {
                        const isActive = activeNonEqualCell.r === r && activeNonEqualCell.c === c;
                        return (
                          <button
                            key={'nec-' + r + '-' + c}
                            onClick={() => setActiveNonEqualCell({ r, c })}
                            className={'h-11 flex flex-col items-center justify-center rounded-xl font-mono text-xs font-bold transition ' + (
                              isActive
                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 scale-105 shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800/90 text-emerald-300 border border-emerald-500/20 hover:bg-slate-700/80'
                            )}
                          >
                            <span>{val}</span>
                            <span className="text-[8px] opacity-60 font-sans">
                              [{r+1},{c+1}]
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step Breakdown Card */}
            {activeNonEqualInfo && (
              <div className="p-6 bg-slate-950/90 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> ជំហានគណនាត្រង់ធាតុ C[{activeNonEqualCell.r+1}, {activeNonEqualCell.c+1}] (Row {activeNonEqualCell.r+1} នៃ A · Column {activeNonEqualCell.c+1} នៃ B):
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => stepRelativeNonEqual(-1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> ថយក្រោយ
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      ក្រឡា {activeNonEqualCell.r * dimN + activeNonEqualCell.c + 1} / {dimM * dimN}
                    </span>
                    <button
                      onClick={() => stepRelativeNonEqual(1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
                    >
                      បន្ទាប់ <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                  <MathRenderer content={'$$' + activeNonEqualInfo.formula + '$$'} />
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {activeNonEqualInfo.terms.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <span className="text-amber-300 font-bold">A[{activeNonEqualCell.r+1},{idx+1}]={t.a}</span>
                      <span className="text-slate-500">×</span>
                      <span className="text-cyan-300 font-bold">B[{idx+1},{activeNonEqualCell.c+1}]={t.b}</span>
                      <span className="text-slate-500">=</span>
                      <span className="text-emerald-300 font-bold">{t.prod}</span>
                    </div>
                  ))}
                </div>

                <p className={'text-slate-300 text-xs leading-relaxed font-sans ' + (isKh ? 'khmer-font' : '')}>
                  {isKh ? activeNonEqualInfo.explanationKh : activeNonEqualInfo.explanationEn}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. UNEQUAL MATRICES COMPREHENSIVE GUIDE */}
      {activeCategory === 'unequal_theory' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                ករណីទី ១៖ ការគុណ Matrix ខុសវិមាត្រ
              </div>
              <h3 className="text-base font-bold text-white">Multiplication: (M × K) × (K × N) = M × N</h3>
              <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                {isKh
                  ? 'ចំនួនជួរឈរនៃ A ត្រូវតែស្មើនឹងចំនួនជួរដេកនៃ B (K = K)។ គុណដោយយកជួរដេកគុណនឹងជួរឈរ (Dot Product)។'
                  : 'Columns of A must strictly match Rows of B (K = K). Calculated using row-by-column dot products.'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <MathRenderer content="$$egin{bmatrix} 1 & 2 & 3 \ 4 & 5 & 6 end{bmatrix}_{2	imes3} egin{bmatrix} 7 & 8 \ 9 & 1 \ 2 & 3 end{bmatrix}_{3	imes2} = egin{bmatrix} 31 & 19 \ 85 & 55 end{bmatrix}_{2	imes2}$$" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                ករណីទី ២៖ Spatial 2D Convolution (រូបភាពធំ + Kernel តូច)
              </div>
              <h3 className="text-base font-bold text-white">Convolution: I(M×N) ជាមួយ Kernel H(Kr×Kc)</h3>
              <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                {isKh
                  ? 'ពេលប្រើ Valid Padding (No Padding) Output នឹងរួញតូច៖ (M - Kr + 1) × (N - Kc + 1) ដូចក្នុងលំហាត់ទី ៦ (4×4 → 2×2)។'
                  : 'Valid padding shrinks dimensions: (M - Kr + 1) × (N - Kc + 1), e.g., 4×4 → 2×2 in Exercise 6.'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <MathRenderer content="$$	ext{Output Size} = (4-3+1) 	imes (4-3+1) = mathbf{2 	imes 2}$$" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                ករណីទី ៣៖ Morphology លើរូបភាព Binary & SE មិនស្មើគ្នា
              </div>
              <h3 className="text-base font-bold text-white">Binary Morphology: A(4×5) និង S(2×2)</h3>
              <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                {isKh
                  ? 'ដូចក្នុងលំហាត់ទី ៨៖ SE មានទំហំ 2×2 និង Origin នៅជ្រុងលើឆ្វេង ★(0,0) ធ្វើឱ្យ Dilation រីកសាយទៅខាងស្តាំ និងក្រោមស្តាំ។'
                  : 'As in Exercise 8: 2×2 SE with top-left origin ★(0,0) creates a directional expansion towards right and bottom.'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <MathRenderer content="$$A_{4	imes5} oplus S_{2	imes2} = 	ext{Expanded } 4	imes5 	ext{ Matrix}$$" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                ករណីទី ៤៖ ការបូក (+) ឬ ដក (-) Matrix ខុសទំហំគ្នា
              </div>
              <h3 className="text-base font-bold text-white">Addition / Subtraction: A ± B</h3>
              <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
                {isKh
                  ? 'មិនអាចបូកដកដោយផ្ទាល់បានទេ! ក្នុង DIP ត្រូវប្រើ Zero-Padding (ថែមលេខ ០), Crop (កាត់តម្រឹម), ឬ Resize (Bilinear Interpolation) មុននឹងបូកដក។'
                  : 'Cannot add/subtract directly. Must use Zero-Padding, Cropping, or Bilinear Resizing to align dimensions first.'}
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <MathRenderer content="$$	ext{Zero-Pad } A_{2	imes2} 	o A_{3	imes3} implies A_{3	imes3} + B_{3	imes3}$$" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SPATIAL FILTER KERNELS */}
      {activeCategory === 'spatial_kernels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-3">
              <div className="glass-panel p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Select Filter Kernel:
                </h4>
                <div className="space-y-2">
                  {Object.entries(kernelCatalog).map(([key, k]) => {
                    const isSelected = key === selectedKernelKey;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedKernelKey(key)}
                        className={'w-full text-left p-3 rounded-xl transition flex items-start gap-3 border ' + (
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80'
                        )}
                      >
                        <span
                          className={'w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ' + (
                            k.category === 'smoothing'
                              ? 'bg-emerald-400'
                              : 'bg-indigo-400'
                          )}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{k.name}</div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{k.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded-full border bg-indigo-950 text-indigo-300 border-indigo-800">
                    {selectedKernel.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{selectedKernel.name}</h3>
                </div>
                {selectedKernel.factor && (
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 font-bold">
                    Scale: {selectedKernel.factor}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-950/80 rounded-2xl border border-slate-800 items-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-400 mb-2 font-mono">Kernel Matrix H:</span>
                  <div className="matrix-bracket">
                    <div
                      className="grid gap-2"
                      style={{ gridTemplateColumns: 'repeat(' + selectedKernel.matrix[0].length + ', 44px)' }}
                    >
                      {selectedKernel.matrix.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={'k-' + r + '-' + c}
                            className="h-11 flex items-center justify-center font-mono text-xs font-bold rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-slate-400 font-bold block">Formula:</span>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <MathRenderer content={'$$' + selectedKernel.mathFormula + '$$'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. IMAGE AS A MATRIX */}
      {activeCategory === 'representation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">2D Grayscale Matrix</h3>
            <p className={'text-xs text-slate-400 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'រូបភាពសខ្មៅ (Grayscale) ត្រូវបានតំណាងដោយ Matrix 2D ទំហំ M × N ដែលធាតុ f(r,c) ស្ថិតក្នុង [0, 255]។'
                : 'A 2D array of intensity samples I(r,c) in [0, 255] for standard 8-bit unsigned integer pixel depth.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content="$$I = egin{bmatrix} f(0,0) & dots & f(0, N-1) \ dots & ddots & dots \ f(M-1,0) & dots & f(M-1, N-1) end{bmatrix}$$" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">3D Color Tensor (RGB/HSV)</h3>
            <p className={'text-xs text-slate-400 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'រូបភាពពណ៌មាន 3 ស្រទាប់ Matrix 2D ផ្គុំគ្នា (Tensor M × N × 3)។'
                : 'A 3D tensor M × N × 3 stacking 3 independent color matrices.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content="$$I(r,c) = egin{bmatrix} R(r,c) \ G(r,c) \ B(r,c) end{bmatrix}$$" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Binary Image Matrix</h3>
            <p className={'text-xs text-slate-400 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh
                ? 'រូបភាព Binary មានតម្លៃតែ 0 (ផ្ទៃខាងក្រោយ) និង 1 (វត្ថុ) ប្រើសម្រាប់ Morphology។'
                : 'A Boolean matrix with values in {0, 1} for morphological set operations.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content="$$A(r,c) in {0, 1}$$" />
            </div>
          </div>
        </div>
      )}

      {/* 5. MORPHOLOGY STRUCTURING ELEMENTS */}
      {activeCategory === 'morphology_se' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Exercise 7 Structure</span>
            <h3 className="text-lg font-bold text-white">Symmetric Cross Structuring Element</h3>
            <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh ? 'Origin ស្ថិតនៅចំកណ្តាល (1,1)។ រីកសាយស្មើគ្នាទៅលើ ក្រោម ឆ្វេង ស្តាំ។' : 'Origin at center (1,1). Symmetrical expansion.'}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Exercise 8 Structure</span>
            <h3 className="text-lg font-bold text-white">Non-Symmetric Top-Left Origin Element (2x2)</h3>
            <p className={'text-xs text-slate-300 leading-relaxed ' + (isKh ? 'khmer-font' : '')}>
              {isKh ? 'Origin ស្ថិតនៅជ្រុងលើឆ្វេង (0,0)។ រីកសាយលម្អៀងទៅស្តាំ និងក្រោមស្តាំ។' : 'Origin at top-left (0,0). Biased expansion.'}
            </p>
          </div>
        </div>
      )}

      {/* 6. AFFINE TRANSFORMATION */}
      {activeCategory === 'affine_geom' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" /> Affine 2D Controls
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between text-indigo-300 font-bold mb-1">
                  <span>Angle (θ): {affineAngle}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={affineAngle}
                  onChange={(e) => setAffineAngle(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-emerald-300 font-bold mb-1">
                  <span>Scale: {affineScaleX.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={affineScaleX}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setAffineScaleX(v);
                    setAffineScaleY(v);
                  }}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Computed Homogeneous Affine Matrix</h3>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              <MathRenderer
                content={'$$M = \\begin{bmatrix} ' + m00 + ' & ' + m01 + ' & ' + m02 + ' \\\\ ' + m10 + ' & ' + m11 + ' & ' + m12 + ' \\\\ 0 & 0 & 1 \\end{bmatrix}$$'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
