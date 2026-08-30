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
  BookOpen,
  Maximize2,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  HelpCircle
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

  // Sub-Navigation category
  const [activeCategory, setActiveCategory] = useState<MatrixCategory>('non_equal_calc');

  /* ------------------------------------------------------------------------- */
  /* 1. NON-EQUAL MATRIX MULTIPLICATION STATE (M x K by K x N)                */
  /* ------------------------------------------------------------------------- */
  const [dimM, setDimM] = useState<number>(2); // Rows of A
  const [dimK, setDimK] = useState<number>(3); // Cols of A & Rows of B
  const [dimN, setDimN] = useState<number>(2); // Cols of B

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

  // Resize Non-Equal Matrices
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

  // Compute Non-Equal Multiplication
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
          termStrings.push(`(${a} \\times ${b})`);
        }

        res[r][c] = sum;
        stepDetails[`${r}-${c}`] = {
          terms,
          sum,
          formula: `C_{${r+1}${c+1}} = \\sum_{k=1}^{${dimK}} A_{${r+1}k} \\cdot B_{k${c+1}} = ${termStrings.join(' + ')} = ${terms.map(t => t.prod).join(' + ')} = ${sum}`,
          explanationKh: `យកជួរដេកទី ${r+1} នៃ Matrix A [${nonEqualA[r]?.join(', ')}] គុណនឹងជួរឈរទី ${c+1} នៃ Matrix B [${nonEqualB.map(row => row[c]).join(', ')}] (Dot Product) ទទួលបានផលបូក = ${sum}។`,
          explanationEn: `Multiply Row ${r+1} of Matrix A with Column ${c+1} of Matrix B (Dot Product): Sum of all ${dimK} element-wise products = ${sum}.`
        };
      }
    }

    return { res, stepDetails };
  }, [nonEqualA, nonEqualB, dimM, dimK, dimN]);

  // Edit non-equal cell
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

  /* ------------------------------------------------------------------------- */
  /* 2. UNEQUAL MATRICES THEORY INTERACTIVE STATE                              */
  /* ------------------------------------------------------------------------- */
  const [selectedTheoryCase, setSelectedTheoryCase] = useState<'mult' | 'conv' | 'morph' | 'add'>('mult');

  // Case 2: Convolution interactive position
  const [convPos, setConvPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const sampleConvImage = [
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120],
    [130, 140, 150, 160]
  ];
  const sampleConvKernel = [
    [1, 1, 1],
    [1, 2, 1],
    [1, 1, 1]
  ]; // factor 1/10
  
  // Calculate value at convPos
  const activeConvWindow = useMemo(() => {
    const win: number[][] = [];
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      const row: number[] = [];
      for (let j = 0; j < 3; j++) {
        const pixel = sampleConvImage[convPos.r + i][convPos.c + j];
        const weight = sampleConvKernel[i][j];
        row.push(pixel);
        sum += pixel * weight;
      }
      win.push(row);
    }
    return { win, sum, avg: (sum / 10).toFixed(1) };
  }, [convPos]);

  // Case 3: Morphology interactive toggle
  const [morphMode, setMorphMode] = useState<'dilation' | 'erosion'>('dilation');
  const sampleBinaryImage = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ];
  // 2x2 SE with origin at (0,0)
  const sampleDilationResult = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ];
  const sampleErosionResult = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];

  // Case 4: Zero padding addition step
  const [paddingStep, setPaddingStep] = useState<'unpadded' | 'padded' | 'added'>('padded');

  /* ------------------------------------------------------------------------- */
  /* 3. SPATIAL KERNELS CATALOG DATA                                           */
  /* ------------------------------------------------------------------------- */
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

  /* ------------------------------------------------------------------------- */
  /* 4. AFFINE TRANSFORMATION STATE                                            */
  /* ------------------------------------------------------------------------- */
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

  const activeKey = `${activeNonEqualCell.r}-${activeNonEqualCell.c}`;
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
        <p className={`text-xs md:text-sm text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
          {isKh
            ? 'សិក្សា និងអនុវត្តការគណនា Matrix មិនស្មើគ្នា (M×K គុណ K×N), Convolution លើរូបភាពទំហំធំជាមួយ Kernel តូច, Morphology លើទំហំមិនស៊ីមេទ្រី ព្រមទាំងរូបមន្តលម្អិត KaTeX ងាយយល់ និងងាយមើលបំផុត។'
            : 'Interactive step-by-step solver for non-equal dimension matrix multiplication, spatial convolution boundary reductions, asymmetric morphology, and affine transformations.'}
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveCategory('non_equal_calc')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'non_equal_calc'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>{isKh ? '១. កម្មវិធីគណនា Matrix មិនស្មើគ្នា' : '1. Non-Equal Matrix Multiplier'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('unequal_theory')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'unequal_theory'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{isKh ? '២. មេរៀន Matrix មិនស្មើគ្នា (ងាយមើល)' : '2. Unequal Matrices Guide'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('spatial_kernels')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'spatial_kernels'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{isKh ? '៣. តារាង Spatial Filter Kernels' : '3. Spatial Kernels'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('representation')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'representation'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isKh ? '៤. រូបភាពជា Matrix' : '4. Image as a Matrix'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('morphology_se')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'morphology_se'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isKh ? '៥. Morphology Structuring Elements' : '5. Morphology Elements'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('affine_geom')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'affine_geom'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
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
                <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
                  {isKh
                    ? 'វិធានគ្រឹះ៖ ជួរឈរនៃ Matrix A ត្រូវតែស្មើនឹង ជួរដេកនៃ Matrix B (K = K)។ លទ្ធផល C នឹងមានទំហំ M × N។'
                    : 'Golden Rule: Columns of Matrix A must equal Rows of Matrix B (K = K). Result C has dimension M × N.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">{isKh ? 'គំរូទំហំ៖' : 'Presets:'}</span>
                <button
                  onClick={() => handleResizeNonEqual(2, 3, 2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 2 && dimK === 3 && dimN === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (2×3) × (3×2) → 2×2
                </button>
                <button
                  onClick={() => handleResizeNonEqual(3, 2, 3)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 3 && dimK === 2 && dimN === 3 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (3×2) × (2×3) → 3×3
                </button>
                <button
                  onClick={() => handleResizeNonEqual(3, 3, 1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 3 && dimK === 3 && dimN === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (3×3) × (3×1) → 3×1 (Affine)
                </button>
                <button
                  onClick={() => handleResizeNonEqual(4, 2, 2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 4 && dimK === 2 && dimN === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (4×2) × (2×2) → 4×2
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-700 font-bold">
                Matrix A: {dimM} × <span className="text-white underline font-black">{dimK}</span>
              </span>
              <span className="text-slate-500 font-bold">×</span>
              <span className="px-3 py-1 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-700 font-bold">
                Matrix B: <span className="text-white underline font-black">{dimK}</span> × {dimN}
              </span>
              <span className="text-slate-500 font-bold">=</span>
              <span className="px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-700 font-bold shadow-md shadow-emerald-500/10">
                Result C: {dimM} × {dimN}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-amber-300 font-bold mb-1">
                  <span>M (Rows of A): {dimM}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={dimM}
                  onChange={(e) => handleResizeNonEqual(parseInt(e.target.value), dimK, dimN)}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg"
                />
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-2xl border border-indigo-800/60">
                <div className="flex justify-between text-indigo-300 font-bold mb-1">
                  <span>K (Inner Match Dimension): {dimK}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={dimK}
                  onChange={(e) => handleResizeNonEqual(dimM, parseInt(e.target.value), dimN)}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg"
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
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Matrix A ({dimM}×{dimK})
                </span>
                <div className="matrix-bracket">
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${dimK}, minmax(42px, 52px))` }}
                  >
                    {nonEqualA.map((row, r) =>
                      row.map((val, c) => {
                        const isRowActive = activeNonEqualCell.r === r;
                        return (
                          <input
                            key={`nea-${r}-${c}`}
                            type="number"
                            value={val}
                            onChange={(e) => handleUpdateNonEqualCell(true, r, c, parseInt(e.target.value))}
                            className={`h-11 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                              isRowActive
                                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 font-black shadow-md shadow-amber-500/30'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                            }`}
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
                    style={{ gridTemplateColumns: `repeat(${dimN}, minmax(42px, 52px))` }}
                  >
                    {nonEqualB.map((row, r) =>
                      row.map((val, c) => {
                        const isColActive = activeNonEqualCell.c === c;
                        return (
                          <input
                            key={`neb-${r}-${c}`}
                            type="number"
                            value={val}
                            onChange={(e) => handleUpdateNonEqualCell(false, r, c, parseInt(e.target.value))}
                            className={`h-11 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${
                              isColActive
                                ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-black shadow-md shadow-cyan-500/30'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                            }`}
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
                    style={{ gridTemplateColumns: `repeat(${dimN}, minmax(44px, 54px))` }}
                  >
                    {nonEqualResult.res.map((row, r) =>
                      row.map((val, c) => {
                        const isActive = activeNonEqualCell.r === r && activeNonEqualCell.c === c;
                        return (
                          <button
                            key={`nec-${r}-${c}`}
                            onClick={() => setActiveNonEqualCell({ r, c })}
                            className={`h-11 flex flex-col items-center justify-center rounded-xl font-mono text-xs font-bold transition ${
                              isActive
                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 scale-105 shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800/90 text-emerald-300 border border-emerald-500/20 hover:bg-slate-700/80'
                            }`}
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

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
                  <MathRenderer content={`$$${activeNonEqualInfo.formula}$$`} />
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

                <p className={`text-slate-300 text-xs leading-relaxed font-sans ${isKh ? 'khmer-font' : ''}`}>
                  {isKh ? activeNonEqualInfo.explanationKh : activeNonEqualInfo.explanationEn}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. UNEQUAL MATRICES COMPREHENSIVE VISUAL GUIDE (SUPER EASY TO READ) */}
      {activeCategory === 'unequal_theory' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub Tab Switcher for 4 Cases */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSelectedTheoryCase('mult')}
              className={`p-3 rounded-xl text-left transition flex flex-col gap-1 ${
                selectedTheoryCase === 'mult'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/20 border border-amber-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 font-mono">ករណីទី ១</span>
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold leading-tight">
                {isKh ? 'ការគុណ Matrix ខុសវិមាត្រ' : 'Multiplication (M×K × K×N)'}
              </span>
            </button>

            <button
              onClick={() => setSelectedTheoryCase('conv')}
              className={`p-3 rounded-xl text-left transition flex flex-col gap-1 ${
                selectedTheoryCase === 'conv'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 font-mono">ករណីទី ២</span>
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold leading-tight">
                {isKh ? 'Spatial 2D Convolution (4×4 → 2×2)' : '2D Convolution Reduction'}
              </span>
            </button>

            <button
              onClick={() => setSelectedTheoryCase('morph')}
              className={`p-3 rounded-xl text-left transition flex flex-col gap-1 ${
                selectedTheoryCase === 'morph'
                  ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/20 border border-pink-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 font-mono">ករណីទី ៣</span>
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold leading-tight">
                {isKh ? 'Morphology Binary (4×5 + SE 2×2)' : 'Binary Morphology SE'}
              </span>
            </button>

            <button
              onClick={() => setSelectedTheoryCase('add')}
              className={`p-3 rounded-xl text-left transition flex flex-col gap-1 ${
                selectedTheoryCase === 'add'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 font-mono">ករណីទី ៤</span>
                <Grid className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold leading-tight">
                {isKh ? 'ការបូកដក Zero-Padding (A ± B)' : 'Addition & Zero-Padding'}
              </span>
            </button>
          </div>

          {/* CASE 1: MULTIPLICATION */}
          {selectedTheoryCase === 'mult' && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ករណីទី ១៖ ការគុណ Matrix វិមាត្រមិនស្មើគ្នា (Row × Column)
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {isKh ? 'វិធានគ្រឹះ៖ ជួរឈរ A = ជួរដេក B (K = K) ទើបអាចគុណបាន' : 'Matrix Multiplication: Columns of A must equal Rows of B'}
                  </h3>
                </div>
                <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs font-bold text-amber-300">
                  (M × K) · (K × N) = (M × N)
                </div>
              </div>

              {/* Visual Diagram Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <p className={`text-xs md:text-sm text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
                    {isKh
                      ? 'ក្នុងការគុណ Matrix មិនស្មើគ្នា យើងមិនគុណតាមក្រឡាស្របគ្នាទេ ប៉ុន្តែយើងប្រើប្រមាណវិធី Dot Product ដោយយក រាល់ធាតុនៃជួរដេកទី i នៃ Matrix A គុណនឹងរាល់ធាតុនៃជួរឈរទី j នៃ Matrix B ហើយបូកបញ្ចូលគ្នា។'
                      : 'Matrix multiplication calculates the inner dot product of row i from Matrix A with column j from Matrix B.'}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
                      <span className="text-slate-300">
                        <strong className="text-amber-300">Inner Dimension Match (K = K):</strong> ចំនួនជួរឈរនៃ A ត្រូវតែស្មើនឹងចំនួនជួរដេកនៃ B។
                      </span>
                    </div>
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                      <span className="text-slate-300">
                        <strong className="text-emerald-300">Output Size (M × N):</strong> Matrix លទ្ធផលទទួលបានចំនួនជួរដេកពី A (M) និងចំនួនជួរឈរពី B (N)។
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    ឧទាហរណ៍គំរូ KaTeX Formula:
                  </span>
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs overflow-x-auto">
                    <MathRenderer content={"$$\\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix}_{2\\times3} \\begin{bmatrix} 7 & 8 \\\\ 9 & 1 \\\\ 2 & 3 \\end{bmatrix}_{3\\times2} = \\begin{bmatrix} 31 & 19 \\\\ 85 & 55 \\end{bmatrix}_{2\\times2}$$"} />
                  </div>
                  <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-800/40 text-[11px] text-indigo-300 font-mono">
                    C[1,1] = (1×7) + (2×9) + (3×2) = 7 + 18 + 6 = 31
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASE 2: CONVOLUTION */}
          {selectedTheoryCase === 'conv' && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-2">
                    <Cpu className="w-3.5 h-3.5" /> ករណីទី ២៖ 2D Spatial Convolution (រូបភាពធំ + Kernel តូច)
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {isKh ? 'ការរួញទំហំដោយគ្មាន Padding: Output = (M - Kr + 1) × (N - Kc + 1)' : 'Valid Convolution: Output Dimension Reduction'}
                  </h3>
                </div>
                <div className="px-4 py-2 bg-cyan-950/60 text-cyan-300 rounded-xl border border-cyan-800 font-mono text-xs font-bold">
                  Image (4×4) ★ Kernel (3×3) → Output (2×2)
                </div>
              </div>

              {/* Interactive Convolution Window Viewer */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-300">
                    {isKh ? 'ជ្រើសរើសទីតាំង Kernel Scan (ចុចដើម្បីមើលការគណនា):' : 'Select Kernel Sliding Position:'}
                  </span>
                  <div className="flex items-center gap-2">
                    {[
                      { r: 0, c: 0, label: 'Output [1,1] (Top-Left)' },
                      { r: 0, c: 1, label: 'Output [1,2] (Top-Right)' },
                      { r: 1, c: 0, label: 'Output [2,1] (Bottom-Left)' },
                      { r: 1, c: 1, label: 'Output [2,2] (Bottom-Right)' }
                    ].map((pos) => (
                      <button
                        key={`${pos.r}-${pos.c}`}
                        onClick={() => setConvPos({ r: pos.r, c: pos.c })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                          convPos.r === pos.r && convPos.c === pos.c
                            ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-black shadow-md shadow-cyan-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        [{pos.r+1},{pos.c+1}]
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 bg-slate-950 rounded-3xl border border-slate-800">
                  {/* 4x4 Image with Highlight */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <span className="text-xs font-bold text-cyan-400 mb-2 font-mono">
                      Input Image (4×4)
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-900 rounded-2xl border border-slate-800">
                      {sampleConvImage.map((row, r) =>
                        row.map((val, c) => {
                          const isInKernel =
                            r >= convPos.r && r < convPos.r + 3 &&
                            c >= convPos.c && c < convPos.c + 3;
                          return (
                            <div
                              key={`cimg-${r}-${c}`}
                              className={`w-12 h-12 flex items-center justify-center font-mono text-xs font-bold rounded-xl transition ${
                                isInKernel
                                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-black scale-105 shadow-md shadow-cyan-500/30'
                                  : 'bg-slate-800/80 text-slate-400'
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Operation Symbol */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-2xl font-black text-cyan-400">★</span>
                    <span className="text-[10px] font-mono text-slate-400">3×3 Kernel</span>
                  </div>

                  {/* 2x2 Output Grid */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <span className="text-xs font-bold text-emerald-400 mb-2 font-mono">
                      Output Feature Map (2×2)
                    </span>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800">
                      {[0, 1].map((r) =>
                        [0, 1].map((c) => {
                          const isActive = convPos.r === r && convPos.c === c;
                          return (
                            <div
                              key={`cout-${r}-${c}`}
                              className={`w-16 h-16 flex flex-col items-center justify-center font-mono text-sm font-bold rounded-xl transition ${
                                isActive
                                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 scale-105 shadow-lg shadow-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              <span>{isActive ? activeConvWindow.avg : '...'}</span>
                              <span className="text-[9px] opacity-70">[{r+1},{c+1}]</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                  <MathRenderer content={"$$\\text{Output Size} = (4 - 3 + 1) \\times (4 - 3 + 1) = \\mathbf{2 \\times 2}$$"} />
                </div>
              </div>
            </div>
          )}

          {/* CASE 3: MORPHOLOGY */}
          {selectedTheoryCase === 'morph' && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20 mb-2">
                    <Layers className="w-3.5 h-3.5" /> ករណីទី ៣៖ Morphology លើរូបភាព Binary $4\times5$ និង SE $2\times2$
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {isKh ? 'Dilation (រីកធំតាម SE) vs Erosion (រួមតូចតាម SE)' : 'Morphological Operations with Asymmetric SE'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMorphMode('dilation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      morphMode === 'dilation'
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Dilation (A ⊕ S)
                  </button>
                  <button
                    onClick={() => setMorphMode('erosion')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      morphMode === 'erosion'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Erosion (A ⊖ S)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 bg-slate-950 rounded-3xl border border-slate-800">
                {/* Original Binary Image */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 mb-2 font-mono">
                    Original Image A (4×5)
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    {sampleBinaryImage.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`bimg-${r}-${c}`}
                          className={`w-10 h-10 flex items-center justify-center font-mono text-xs font-bold rounded-lg ${
                            val === 1
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-800/80 text-slate-500'
                          }`}
                        >
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Structuring Element */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center text-center space-y-2">
                  <span className="text-xs font-mono text-pink-400 font-bold">SE S (2×2)</span>
                  <div className="grid grid-cols-2 gap-1 p-1.5 bg-slate-900 rounded-xl border border-pink-500/30">
                    <div className="w-8 h-8 flex items-center justify-center bg-pink-500 text-slate-950 font-bold font-mono text-xs rounded ring-2 ring-red-400">
                      ★1
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-pink-500/80 text-white font-bold font-mono text-xs rounded">
                      1
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-pink-500/80 text-white font-bold font-mono text-xs rounded">
                      1
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-pink-500/80 text-white font-bold font-mono text-xs rounded">
                      1
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">★ Origin at (0,0)</span>
                </div>

                {/* Result Image */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <span className="text-xs font-bold text-pink-400 mb-2 font-mono">
                    {morphMode === 'dilation' ? 'Dilation Result A ⊕ S' : 'Erosion Result A ⊖ S'}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-900 rounded-2xl border border-slate-800">
                    {(morphMode === 'dilation' ? sampleDilationResult : sampleErosionResult).map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`mres-${r}-${c}`}
                          className={`w-10 h-10 flex items-center justify-center font-mono text-xs font-bold rounded-lg transition ${
                            val === 1
                              ? morphMode === 'dilation'
                                ? 'bg-pink-500 text-slate-950 font-black shadow-md shadow-pink-500/20'
                                : 'bg-indigo-500 text-white font-black shadow-md shadow-indigo-500/20'
                              : 'bg-slate-800/80 text-slate-500'
                          }`}
                        >
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                <MathRenderer
                  content={
                    morphMode === 'dilation'
                      ? '$$A \\oplus S = \\{ z \\mid (\\hat{S})_z \\cap A \\neq \\emptyset \\} \\implies \\text{Expanded Binary Matrix}$$'
                      : '$$A \\ominus S = \\{ z \\mid (S)_z \\subseteq A \\} \\implies \\text{Shrunk Binary Matrix}$$'
                  }
                />
              </div>
            </div>
          )}

          {/* CASE 4: ADDITION & ZERO PADDING */}
          {selectedTheoryCase === 'add' && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
                    <Grid className="w-3.5 h-3.5" /> ករណីទី ៤៖ ការបូក (+) ឬ ដក (-) Matrix ខុសទំហំគ្នា
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {isKh ? 'ដំណោះស្រាយ៖ ប្រើ Zero-Padding (ថែមលេខ ០) ឱ្យស្មើទំហំគ្នាជាមុនសិន' : 'Zero-Padding Alignment for Matrix Addition / Subtraction'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPaddingStep('unpadded')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      paddingStep === 'unpadded'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    1. មិនទាន់ Pad (Error!)
                  </button>
                  <button
                    onClick={() => setPaddingStep('padded')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      paddingStep === 'padded'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    2. Zero-Padded (3×3)
                  </button>
                  <button
                    onClick={() => setPaddingStep('added')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      paddingStep === 'added'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    3. ផលបូក A + B
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                  {/* Matrix A */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-amber-400 mb-2 font-mono">
                      Matrix A ({paddingStep === 'unpadded' ? '2×2' : '3×3 Padded'})
                    </span>
                    <div className="matrix-bracket">
                      <div
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${paddingStep === 'unpadded' ? 2 : 3}, 44px)` }}
                      >
                        {paddingStep === 'unpadded' ? (
                          [
                            [5, 2],
                            [1, 4]
                          ].map((row, r) =>
                            row.map((val, c) => (
                              <div key={`pau-${r}-${c}`} className="h-11 flex items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-mono text-xs">
                                {val}
                              </div>
                            ))
                          )
                        ) : (
                          [
                            [5, 2, 0],
                            [1, 4, 0],
                            [0, 0, 0]
                          ].map((row, r) =>
                            row.map((val, c) => {
                              const isPadding = r === 2 || c === 2;
                              return (
                                <div
                                  key={`pap-${r}-${c}`}
                                  className={`h-11 flex items-center justify-center rounded-xl font-bold font-mono text-xs transition ${
                                    isPadding
                                      ? 'bg-emerald-500/20 border-2 border-dashed border-emerald-400 text-emerald-300'
                                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                                  }`}
                                >
                                  {val}
                                </div>
                              );
                            })
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-2xl font-bold text-slate-400">+</span>

                  {/* Matrix B */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-cyan-400 mb-2 font-mono">
                      Matrix B (3×3)
                    </span>
                    <div className="matrix-bracket">
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          [1, 3, 2],
                          [2, 0, 1],
                          [4, 1, 3]
                        ].map((row, r) =>
                          row.map((val, c) => (
                            <div key={`pb-${r}-${c}`} className="w-11 h-11 flex items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold font-mono text-xs">
                              {val}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-2xl font-bold text-slate-400">=</span>

                  {/* Result */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-emerald-400 mb-2 font-mono">
                      {paddingStep === 'added' ? 'Result C (3×3)' : 'Status'}
                    </span>
                    {paddingStep === 'unpadded' ? (
                      <div className="h-28 w-36 flex flex-col items-center justify-center rounded-2xl bg-rose-950/40 border border-rose-800/60 p-3 text-center">
                        <span className="text-rose-400 text-xs font-bold">Dimension Mismatch!</span>
                        <span className="text-[10px] text-slate-400 mt-1">2×2 cannot add 3×3</span>
                      </div>
                    ) : (
                      <div className="matrix-bracket">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            [6, 5, 2],
                            [3, 4, 1],
                            [4, 1, 3]
                          ].map((row, r) =>
                            row.map((val, c) => (
                              <div key={`pc-${r}-${c}`} className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black font-mono text-xs shadow-md shadow-emerald-500/20">
                                {val}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                  <MathRenderer content={"$$\\text{Zero-Pad } A_{2\\times2} \\to \\begin{bmatrix} 5 & 2 & 0 \\\\ 1 & 4 & 0 \\\\ 0 & 0 & 0 \\end{bmatrix}_{3\\times3} \\implies A_{3\\times3} + B_{3\\times3} = \\begin{bmatrix} 6 & 5 & 2 \\\\ 3 & 4 & 1 \\\\ 4 & 1 & 3 \\end{bmatrix}$$"} />
                </div>
              </div>
            </div>
          )}
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
                        className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 border ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            k.category === 'smoothing'
                              ? 'bg-emerald-400'
                              : 'bg-indigo-400'
                          }`}
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
                      style={{ gridTemplateColumns: `repeat(${selectedKernel.matrix[0].length}, 44px)` }}
                    >
                      {selectedKernel.matrix.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`k-${r}-${c}`}
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
                    <MathRenderer content={`$$${selectedKernel.mathFormula}$$`} />
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
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'រូបភាពសខ្មៅ (Grayscale) ត្រូវបានតំណាងដោយ Matrix 2D ទំហំ M × N ដែលធាតុ f(r,c) ស្ថិតក្នុង [0, 255]។'
                : 'A 2D array of intensity samples I(r,c) in [0, 255] for standard 8-bit unsigned integer pixel depth.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content={"$$I = \\begin{bmatrix} f(0,0) & \\dots & f(0, N-1) \\\\ \\vdots & \\ddots & \\vdots \\\\ f(M-1,0) & \\dots & f(M-1, N-1) \\end{bmatrix}$$"} />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">3D Color Tensor (RGB/HSV)</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'រូបភាពពណ៌មាន 3 ស្រទាប់ Matrix 2D ផ្គុំគ្នា (Tensor M × N × 3)។'
                : 'A 3D tensor M × N × 3 stacking 3 independent color matrices.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content={"$$I(r,c) = \\begin{bmatrix} R(r,c) \\\\ G(r,c) \\\\ B(r,c) \\end{bmatrix}$$"} />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Binary Image Matrix</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'រូបភាព Binary មានតម្លៃតែ 0 (ផ្ទៃខាងក្រោយ) និង 1 (វត្ថុ) ប្រើសម្រាប់ Morphology។'
                : 'A Boolean matrix with values in {0, 1} for morphological set operations.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content={"$$A(r,c) \\in \\{0, 1\\}$$"} />
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
            <p className={`text-xs text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'Origin ស្ថិតនៅចំកណ្តាល (1,1)។ រីកសាយស្មើគ្នាទៅលើ ក្រោម ឆ្វេង ស្តាំ។' : 'Origin at center (1,1). Symmetrical expansion.'}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Exercise 8 Structure</span>
            <h3 className="text-lg font-bold text-white">Non-Symmetric Top-Left Origin Element (2x2)</h3>
            <p className={`text-xs text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
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
                content={`$$M = \\begin{bmatrix} ${m00} & ${m01} & ${m02} \\\\ ${m10} & ${m11} & ${m12} \\\\ 0 & 0 & 1 \\end{bmatrix}$$`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
