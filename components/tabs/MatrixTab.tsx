'use client';

import React, { useState, useMemo } from 'react';
import { Grid, Eye, Move, Layers, Cpu, CheckCircle2, Sliders, Calculator, Plus, Minus, X, Asterisk, Sparkles, ChevronRight, ChevronLeft, Play, Pause, AlertTriangle } from 'lucide-react';
import { Language } from '@/types';
import { MathRenderer } from '../MathRenderer';

interface MatrixTabProps {
  language: Language;
}

export const MatrixTab: React.FC<MatrixTabProps> = ({ language }) => {
  const isKh = language === 'kh';

  // Active Category inside Masterclass
  const [activeCategory, setActiveCategory] = useState<'matrix_operations' | 'non_equal_calc' | 'spatial_kernels' | 'representation' | 'morphology_se' | 'affine_geom'>('non_equal_calc');

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
  const [isNonEqualPlaying, setIsNonEqualPlaying] = useState<boolean>(false);

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
    const stepDetails: Record<string, { terms: { a: number; b: number; prod: number }[]; sum: number; formula: string; explanationKh: string; explanationEn: string }> = {};

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
          explanationKh: `គុណជួរដេកទី ${r+1} នៃ Matrix A ជាមួយជួរឈរទី ${c+1} នៃ Matrix B (Dot Product)៖ បូកផលគុណធាតុផ្គូផ្គងទាំង ${dimK} បញ្ចូលគ្នា។`,
          explanationEn: `Multiply Row ${r+1} of Matrix A with Column ${c+1} of Matrix B (Dot Product): Sum of all ${dimK} element-wise products.`
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

  // Step relative navigation
  const stepRelativeNonEqual = (delta: number) => {
    const totalCells = dimM * dimN;
    const currentIdx = activeNonEqualCell.r * dimN + activeNonEqualCell.c;
    const nextIdx = (currentIdx + delta + totalCells) % totalCells;
    const nextR = Math.floor(nextIdx / dimN);
    const nextC = nextIdx % dimN;
    setActiveNonEqualCell({ r: nextR, c: nextC });
  };

  /* ------------------------------------------------------------------------- */
  /* 2. STANDARD MATRIX OPERATIONS CALCULATOR STATE                            */
  /* ------------------------------------------------------------------------- */
  const [opType, setOpType] = useState<'add' | 'subtract' | 'hadamard' | 'scalar' | 'matmul'>('add');
  const [matrixSize, setMatrixSize] = useState<number>(3);
  const [scalarK, setScalarK] = useState<number>(0.5);

  const [matrixA, setMatrixA] = useState<number[][]>([
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
  ]);

  const [matrixB, setMatrixB] = useState<number[][]>([
    [5, 10, 15],
    [20, 25, 30],
    [35, 40, 45]
  ]);

  const [activeCalcCell, setActiveCalcCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });

  const handleResize = (size: number) => {
    setMatrixSize(size);
    const newA = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => (r * size + c + 1) * 10)
    );
    const newB = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => (r * size + c + 1) * 5)
    );
    setMatrixA(newA);
    setMatrixB(newB);
    setActiveCalcCell({ r: 0, c: 0 });
  };

  const opResult = useMemo(() => {
    const size = matrixSize;
    const result: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
    const stepBreakdowns: Record<string, { formula: string; explanationKh: string; explanationEn: string }> = {};

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const aVal = matrixA[r]?.[c] ?? 0;
        const bVal = matrixB[r]?.[c] ?? 0;

        if (opType === 'add') {
          const sum = aVal + bVal;
          result[r][c] = sum;
          stepBreakdowns[`${r}-${c}`] = {
            formula: `C_{${r+1}${c+1}} = A_{${r+1}${c+1}} + B_{${r+1}${c+1}} = ${aVal} + ${bVal} = ${sum}`,
            explanationKh: `យកធាតុត្រង់ទីតាំង [${r+1},${c+1}] នៃ Matrix A គឺ ${aVal} បូកនឹងធាតុនៃ Matrix B គឺ ${bVal}។`,
            explanationEn: `Add corresponding element at [${r+1},${c+1}]: ${aVal} + ${bVal} = ${sum}.`
          };
        } else if (opType === 'subtract') {
          const diff = aVal - bVal;
          result[r][c] = diff;
          stepBreakdowns[`${r}-${c}`] = {
            formula: `C_{${r+1}${c+1}} = A_{${r+1}${c+1}} - B_{${r+1}${c+1}} = ${aVal} - ${bVal} = ${diff}`,
            explanationKh: `យកធាតុត្រង់ទីតាំង [${r+1},${c+1}] នៃ Matrix A គឺ ${aVal} ដកនឹងធាតុនៃ Matrix B គឺ ${bVal}។`,
            explanationEn: `Subtract corresponding element at [${r+1},${c+1}]: ${aVal} - ${bVal} = ${diff}.`
          };
        } else if (opType === 'hadamard') {
          const prod = aVal * bVal;
          result[r][c] = prod;
          stepBreakdowns[`${r}-${c}`] = {
            formula: `C_{${r+1}${c+1}} = A_{${r+1}${c+1}} \\times B_{${r+1}${c+1}} = ${aVal} \\times ${bVal} = ${prod}`,
            explanationKh: `យកធាតុត្រូវគ្នាតាមទីតាំងគុណគ្នា (Element-wise / Hadamard)។`,
            explanationEn: `Element-wise product (Hadamard): ${aVal} × ${bVal} = ${prod}.`
          };
        } else if (opType === 'scalar') {
          const scaled = Number((aVal * scalarK).toFixed(2));
          result[r][c] = scaled;
          stepBreakdowns[`${r}-${c}`] = {
            formula: `C_{${r+1}${c+1}} = k \\cdot A_{${r+1}${c+1}} = ${scalarK} \\times ${aVal} = ${scaled}`,
            explanationKh: `គុណចំនួនថេរ k = ${scalarK} ទៅលើធាតុ ${aVal} នៃ Matrix A។`,
            explanationEn: `Multiply scalar k = ${scalarK} with element ${aVal} = ${scaled}.`
          };
        } else if (opType === 'matmul') {
          let sum = 0;
          const terms: string[] = [];
          for (let k = 0; k < size; k++) {
            const ak = matrixA[r][k];
            const bk = matrixB[k][c];
            sum += ak * bk;
            terms.push(`(${ak} \\times ${bk})`);
          }
          result[r][c] = sum;
          stepBreakdowns[`${r}-${c}`] = {
            formula: `C_{${r+1}${c+1}} = \\sum_{k=1}^{${size}} A_{${r+1}k} \\cdot B_{k${c+1}} = ${terms.join(' + ')} = ${sum}`,
            explanationKh: `យកជួរដេកទី ${r+1} នៃ Matrix A គុណនឹងជួរឈរទី ${c+1} នៃ Matrix B (Dot Product)។`,
            explanationEn: `Row ${r+1} of A dot-product with Column ${c+1} of B = ${sum}.`
          };
        }
      }
    }

    return { result, stepBreakdowns };
  }, [matrixA, matrixB, opType, matrixSize, scalarK]);

  const handleUpdateCell = (isA: boolean, r: number, c: number, val: number) => {
    const num = isNaN(val) ? 0 : val;
    if (isA) {
      const copy = matrixA.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
      setMatrixA(copy);
    } else {
      const copy = matrixB.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
      setMatrixB(copy);
    }
  };

  /* ------------------------------------------------------------------------- */
  /* SPATIAL KERNELS CATALOG DATA                                              */
  /* ------------------------------------------------------------------------- */
  const [selectedKernelKey, setSelectedKernelKey] = useState<string>('box3x3');

  const kernelCatalog: Record<string, {
    name: string;
    category: 'smoothing' | 'edge' | 'sharpening';
    matrix: (string | number)[][];
    factor?: string;
    purposeEn: string;
    purposeKh: string;
    propertiesEn: string[];
    propertiesKh: string[];
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
      propertiesEn: ['All weights equal (1/9)', 'Sum of elements = 1', 'Isotropic (direction-independent)'],
      propertiesKh: ['ទម្ងន់ស្មើគ្នាទាំងអស់ (1/9)', 'ផលបូកធាតុស្មើ 1', 'មានលក្ខណៈ Isotropic (មិនលម្អៀងតាមទិសដៅ)'],
      mathFormula: 'g(x,y) = \\frac{1}{9}\\sum_{s=-1}^1 \\sum_{t=-1}^1 f(x+s, y+t)'
    },
    gaussian3x3: {
      name: 'Gaussian Smoothing Filter (3x3 Approximation)',
      category: 'smoothing',
      factor: '1/16',
      matrix: [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
      ],
      purposeEn: 'Weighted spatial smoothing; gives higher importance to center pixel.',
      purposeKh: 'បន្ទន់កម្រិតពណ៌តាមអនុគមន៍ Gaussian ដោយឱ្យតម្លៃទម្ងន់ខ្ពស់នៅចំកណ្តាល។',
      propertiesEn: ['Center weight is highest (4/16)', 'Corner weights are lowest (1/16)', 'Sum of elements = 1'],
      propertiesKh: ['ទម្ងន់ចំកណ្តាលខ្ពស់ជាងគេ (4/16)', 'ជ្រុងទាំងបួនទាបជាងគេ (1/16)', 'ផលបូកធាតុទាំងអស់ស្មើ 1'],
      mathFormula: 'G(x,y) = \\frac{1}{2\\pi\\sigma^2} e^{-\\frac{x^2+y^2}{2\\sigma^2}}'
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
      purposeKh: 'ចាប់យកខ្សែបន្ទាត់គែមដោយប្រើដេរីវេទី២ នៃកម្រិតពន្លឺ។',
      propertiesEn: ['Sum of elements = 0', 'Center is -4, 4-neighbors are +1', 'Requires clipping [0, 255]'],
      propertiesKh: ['ផលបូកធាតុស្មើ 0', 'ចំកណ្តាលគឺ -4 និងធាតុជុំវិញ 4 ទិសគឺ +1', 'ទាមទារការកាត់តម្លៃ [0, 255]'],
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
      propertiesEn: ['Smooths in orthogonal direction', 'Differentiates in horizontal direction', 'High noise suppression'],
      propertiesKh: ['ធ្វើ Smoothing តាមទិសដៅបញ្ឈរ', 'ធ្វើដេរីវេតាមទិសដៅផ្តេក', 'ធន់នឹង Noise ខ្ពស់'],
      mathFormula: 'G_x = [f(x+1,y-1)+2f(x+1,y)+f(x+1,y+1)] - [f(x-1,y-1)+2f(x-1,y)+f(x-1,y+1)]'
    }
  };

  const selectedKernel = kernelCatalog[selectedKernelKey] || kernelCatalog.box3x3;

  /* ------------------------------------------------------------------------- */
  /* AFFINE TRANSFORMATION STATE                                               */
  /* ------------------------------------------------------------------------- */
  const [affineAngle, setAffineAngle] = useState<number>(30);
  const [affineScaleX, setAffineScaleX] = useState<number>(1.2);
  const [affineScaleY, setAffineScaleY] = useState<number>(1.2);
  const [affineTx, setAffineTx] = useState<number>(20);
  const [affineTy, setAffineTy] = useState<number>(15);
  const [affineShearX, setAffineShearX] = useState<number>(0.2);

  const rad = (affineAngle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);
  const m00 = (affineScaleX * cosA).toFixed(3);
  const m01 = (-affineScaleY * sinA + affineShearX).toFixed(3);
  const m02 = affineTx.toFixed(1);
  const m10 = (affineScaleX * sinA).toFixed(3);
  const m11 = (affineScaleY * cosA).toFixed(3);
  const m12 = affineTy.toFixed(1);

  const activeNonEqualInfo = nonEqualResult.stepDetails[`${activeNonEqualCell.r}-${activeNonEqualCell.c}`];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Calculator className="w-3.5 h-3.5" /> Interactive Matrix Engine & Masterclass
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          {isKh ? 'មជ្ឈមណ្ឌលប្រមាណវិធី និងមេរៀន Matrix គ្រប់ប្រភេទ' : 'Interactive Matrix Operations & DIP Masterclass'}
        </h2>
        <p className={`text-xs md:text-sm text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
          {isKh
            ? 'អនុវត្តប្រមាណវិធីលើ Matrix មិនស្មើគ្នា (Non-equal Dimensions) និង Matrix ស្មើគ្នា (បូក, ដក, គុណ Hadamard, គុណ Scalar, គុណ Matrix) រួមជាមួយការពន្យល់មួយជំហានៗ (Step-by-Step)។'
            : 'Interactive step-by-step solver for non-equal dimension matrix multiplication, convolution, Hadamard products, and affine transformations.'}
        </p>
      </div>

      {/* Main Category Tabs */}
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
          <span>{isKh ? '១. គណនា Matrix មិនស្មើគ្នា (Step-by-Step)' : '1. Non-Equal Matrix Calculator'}</span>
        </button>

        <button
          onClick={() => setActiveCategory('matrix_operations')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeCategory === 'matrix_operations'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{isKh ? '២. ប្រមាណវិធី Matrix ស្មើគ្នា (+, -, ⊙, k·A)' : '2. Standard Operations (+, -, ⊙, k·A)'}</span>
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
          <span>{isKh ? '៣. តារាង Spatial Filter Kernels' : '3. Spatial Filter Kernels'}</span>
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
          <span>{isKh ? '៥. Morphology Structuring Elements' : '5. Morphology Structuring Elements'}</span>
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
          <span>{isKh ? '៦. ម៉ាទ្រីស Affine & Geometric' : '6. Affine & Geometric Matrices'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. NON-EQUAL MATRIX MULTIPLICATION CALCULATOR (STEP-BY-STEP)              */}
      {/* ========================================================================= */}
      {activeCategory === 'non_equal_calc' && (
        <div className="space-y-6">
          {/* Dimension Presets & Controls Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>{isKh ? 'កម្មវិធីគណនា Matrix វិមាត្រមិនស្មើគ្នា (M×K គុណនឹង K×N)' : 'Non-Equal Matrix Multiplier (M×K by K×N)'}</span>
                </h3>
                <p className={`text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}`}>
                  {isKh
                    ? 'លក្ខខណ្ឌគុណបាន៖ ចំនួនជួរឈរនៃ Matrix A ត្រូវតែស្មើនឹងចំនួនជួរដេកនៃ Matrix B (K = K)។'
                    : 'Fundamental Rule: Columns of Matrix A must strictly equal Rows of Matrix B (K = K).'}
                </p>
              </div>

              {/* Dimension Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">{isKh ? 'គំរូទំហំ៖' : 'Presets:'}</span>
                <button
                  onClick={() => handleResizeNonEqual(2, 3, 2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 2 && dimK === 3 && dimN === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (2×3) × (3×2) → 2×2
                </button>
                <button
                  onClick={() => handleResizeNonEqual(3, 2, 3)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 3 && dimK === 2 && dimN === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (3×2) × (2×3) → 3×3
                </button>
                <button
                  onClick={() => handleResizeNonEqual(3, 3, 1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 3 && dimK === 3 && dimN === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (3×3) × (3×1) → 3×1 (Affine)
                </button>
                <button
                  onClick={() => handleResizeNonEqual(4, 2, 2)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    dimM === 4 && dimK === 2 && dimN === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  (4×2) × (2×2) → 4×2
                </button>
              </div>
            </div>

            {/* Custom Dimension Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-xs font-mono">
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
                  <span>K (Cols A & Rows B - Match!): {dimK}</span>
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

          {/* Interactive Calculation Area */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 overflow-x-auto py-4">
              {/* Matrix A (M x K) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
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

              {/* Operator */}
              <div className="text-2xl font-extrabold text-slate-400 flex items-center justify-center pt-6">
                <X className="w-6 h-6 text-indigo-400" />
              </div>

              {/* Matrix B (K x N) */}
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

              {/* Equals */}
              <div className="text-2xl font-extrabold text-slate-400 flex items-center justify-center pt-6">
                =
              </div>

              {/* Result Matrix C (M x N) */}
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
                    <CheckCircle2 className="w-4 h-4" /> Dot Product Step for Element C[{activeNonEqualCell.r+1}, {activeNonEqualCell.c+1}]:
                  </span>

                  {/* Stepper Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => stepRelativeNonEqual(-1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      Cell {activeNonEqualCell.r * dimN + activeNonEqualCell.c + 1} / {dimM * dimN}
                    </span>
                    <button
                      onClick={() => stepRelativeNonEqual(1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mathematical Equation */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                  <MathRenderer content={`$$${activeNonEqualInfo.formula}$$`} />
                </div>

                {/* Arithmetic Breakdown Pills */}
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

      {/* ========================================================================= */}
      {/* 2. STANDARD MATRIX OPERATIONS CALCULATOR                                   */}
      {/* ========================================================================= */}
      {activeCategory === 'matrix_operations' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider">{isKh ? 'ប្រមាណវិធី៖' : 'Operation:'}</span>
              
              <button
                onClick={() => setOpType('add')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  opType === 'add' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Addition (A + B)</span>
              </button>

              <button
                onClick={() => setOpType('subtract')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  opType === 'subtract' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Subtraction (A - B)</span>
              </button>

              <button
                onClick={() => setOpType('hadamard')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  opType === 'hadamard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Asterisk className="w-3.5 h-3.5" />
                <span>Hadamard (A ⊙ B)</span>
              </button>

              <button
                onClick={() => setOpType('scalar')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                  opType === 'scalar' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scalar (k · A)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold">{isKh ? 'ទំហំ Matrix:' : 'Size:'}</span>
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
                <button
                  onClick={() => handleResize(2)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                    matrixSize === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2x2
                </button>
                <button
                  onClick={() => handleResize(3)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                    matrixSize === 3 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3x3
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 overflow-x-auto py-4">
              {/* Matrix A */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Matrix A</span>
                <div className="matrix-bracket">
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(44px, 56px))` }}
                  >
                    {matrixA.map((row, r) =>
                      row.map((val, c) => {
                        const isFocus = activeCalcCell.r === r && activeCalcCell.c === c;
                        return (
                          <input
                            key={`a-${r}-${c}`}
                            type="number"
                            value={val}
                            onClick={() => setActiveCalcCell({ r, c })}
                            onChange={(e) => handleUpdateCell(true, r, c, parseInt(e.target.value))}
                            className={`h-12 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                              isFocus
                                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 scale-105 z-10 shadow-lg'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                            }`}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Operator Symbol */}
              <div className="text-2xl font-extrabold text-slate-400 flex items-center justify-center pt-6">
                {opType === 'add' && <Plus className="w-6 h-6 text-indigo-400" />}
                {opType === 'subtract' && <Minus className="w-6 h-6 text-indigo-400" />}
                {opType === 'hadamard' && <span className="font-mono text-indigo-400">⊙</span>}
                {opType === 'scalar' && <span className="font-mono text-indigo-400 text-sm">× k({scalarK})</span>}
              </div>

              {/* Matrix B */}
              {opType !== 'scalar' ? (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Matrix B</span>
                  <div className="matrix-bracket">
                    <div
                      className="grid gap-2"
                      style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(44px, 56px))` }}
                    >
                      {matrixB.map((row, r) =>
                        row.map((val, c) => {
                          const isFocus = activeCalcCell.r === r && activeCalcCell.c === c;
                          return (
                            <input
                              key={`b-${r}-${c}`}
                              type="number"
                              value={val}
                              onClick={() => setActiveCalcCell({ r, c })}
                              onChange={(e) => handleUpdateCell(false, r, c, parseInt(e.target.value))}
                              className={`h-12 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${
                                isFocus
                                  ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 scale-105 z-10 shadow-lg'
                                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
                              }`}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-amber-400">Scalar k:</span>
                  <input
                    type="number"
                    step="0.1"
                    value={scalarK}
                    onChange={(e) => setScalarK(parseFloat(e.target.value) || 0)}
                    className="w-24 h-10 text-center font-mono font-bold bg-slate-800 text-white rounded-xl border border-slate-600 focus:outline-none"
                  />
                </div>
              )}

              <div className="text-2xl font-extrabold text-slate-400 flex items-center justify-center pt-6">
                =
              </div>

              {/* Result Matrix C */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Result C</span>
                <div className="matrix-bracket">
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(44px, 56px))` }}
                  >
                    {opResult.result.map((row, r) =>
                      row.map((val, c) => {
                        const isFocus = activeCalcCell.r === r && activeCalcCell.c === c;
                        return (
                          <button
                            key={`c-${r}-${c}`}
                            onClick={() => setActiveCalcCell({ r, c })}
                            className={`h-12 flex flex-col items-center justify-center rounded-xl font-mono text-xs font-bold transition ${
                              isFocus
                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-105 shadow-lg shadow-emerald-500/20'
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
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SPATIAL FILTER KERNELS CATALOG                                         */}
      {/* ========================================================================= */}
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
                  <div className="flex items-center gap-2">
                    {selectedKernel.factor && (
                      <span className="text-base font-mono font-bold text-indigo-400">{selectedKernel.factor}</span>
                    )}
                    <div className="matrix-bracket">
                      <div
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${selectedKernel.matrix[0].length}, 44px)` }}
                      >
                        {selectedKernel.matrix.map((row, r) =>
                          row.map((val, c) => (
                            <div
                              key={`${r}-${c}`}
                              className="h-11 flex items-center justify-center font-mono text-xs font-bold rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
                            >
                              {val}
                            </div>
                          ))
                        )}
                      </div>
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

      {/* ========================================================================= */}
      {/* 4. IMAGE AS A MATRIX                                                      */}
      {/* ========================================================================= */}
      {activeCategory === 'representation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">2D Grayscale Image Matrix</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'រូបភាពសខ្មៅ (Grayscale) ត្រូវបានតំណាងដោយ Matrix 2D ទំហំ $M \\times N$ ដែលធាតុ $f(r,c) \\in [0, 255]$។'
                : 'A 2D array of intensity samples $I(r,c) \\in [0, 255]$ for standard 8-bit unsigned integer pixel depth.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content="$$I = \begin{bmatrix} f(0,0) & \dots & f(0, N-1) \\ \vdots & \ddots & \vdots \\ f(M-1,0) & \dots & f(M-1, N-1) \end{bmatrix}$$" />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">3D Color Tensor (RGB/HSV)</h3>
            <p className={`text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh
                ? 'រូបភាពពណ៌មាន 3 ស្រទាប់ Matrix 2D ផ្គុំគ្នា (Tensor $M \\times N \\times 3$)។'
                : 'A 3D tensor $M \\times N \\times 3$ stacking 3 independent color matrices.'}
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MathRenderer content="$$I(r,c) = \begin{bmatrix} R(r,c) \\ G(r,c) \\ B(r,c) \end{bmatrix}$$" />
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
              <MathRenderer content="$$A(r,c) \in \{0, 1\}$$" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MORPHOLOGY STRUCTURING ELEMENTS                                        */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* 6. AFFINE TRANSFORMATION                                                  */}
      {/* ========================================================================= */}
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
