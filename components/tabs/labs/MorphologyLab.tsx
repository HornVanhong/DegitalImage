'use client';

import React, { useState, useMemo } from 'react';
import { Binary, Layers } from 'lucide-react';
import { Language } from '@/types';
import { MathRenderer } from '../../MathRenderer';

interface MorphologyLabProps {
  language: Language;
}

export const MorphologyLab: React.FC<MorphologyLabProps> = ({ language }) => {
  const isKh = language === 'kh';

  const matrixPresets: Record<string, number[][]> = {
    ex7: [
      [0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0]
    ],
    ex8: [
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1]
    ],
    custom: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  };

  const sePresets: Record<string, { name: string; matrix: number[][]; origin: { r: number; c: number } }> = {
    cross3x3: {
      name: '3x3 Cross (Ex 7, Center Origin)',
      matrix: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      origin: { r: 1, c: 1 }
    },
    asym2x2: {
      name: '2x2 Asymmetric (Ex 8, Top-Left Origin)',
      matrix: [
        [1, 1],
        [0, 1]
      ],
      origin: { r: 0, c: 0 }
    },
    box3x3: {
      name: '3x3 Square Box',
      matrix: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ],
      origin: { r: 1, c: 1 }
    },
    horizontal3: {
      name: '1x3 Horizontal Line',
      matrix: [[1, 1, 1]],
      origin: { r: 0, c: 1 }
    }
  };

  const [inputMatrixA, setInputMatrixA] = useState<number[][]>(matrixPresets.ex7);
  const [currentSeKey, setCurrentSeKey] = useState<string>('cross3x3');
  const [activeOperation, setActiveOperation] = useState<'dilation' | 'erosion' | 'internal' | 'external' | 'gradient'>('dilation');

  const activeSE = sePresets[currentSeKey] || sePresets.cross3x3;

  // Morphology engine
  const results = useMemo(() => {
    const A = inputMatrixA;
    const { matrix: B, origin } = activeSE;
    const rows = A.length;
    const cols = A[0].length;
    const seRows = B.length;
    const seCols = B[0].length;

    // Dilation
    const dilation = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (A[r][c] === 1) {
          for (let br = 0; br < seRows; br++) {
            for (let bc = 0; bc < seCols; bc++) {
              if (B[br][bc] === 1) {
                const targetR = r + (br - origin.r);
                const targetC = c + (bc - origin.c);
                if (targetR >= 0 && targetR < rows && targetC >= 0 && targetC < cols) {
                  dilation[targetR][targetC] = 1;
                }
              }
            }
          }
        }
      }
    }

    // Erosion
    const erosion = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let fits = true;
        for (let br = 0; br < seRows; br++) {
          for (let bc = 0; bc < seCols; bc++) {
            if (B[br][bc] === 1) {
              const testR = r + (br - origin.r);
              const testC = c + (bc - origin.c);
              if (testR < 0 || testR >= rows || testC < 0 || testC >= cols || A[testR][testC] !== 1) {
                fits = false;
                break;
              }
            }
          }
          if (!fits) break;
        }
        if (fits) erosion[r][c] = 1;
      }
    }

    // Internal Boundary
    const betaInt = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        betaInt[r][c] = A[r][c] === 1 && erosion[r][c] === 0 ? 1 : 0;
      }
    }

    // External Boundary
    const betaExt = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        betaExt[r][c] = dilation[r][c] === 1 && A[r][c] === 0 ? 1 : 0;
      }
    }

    // Morphological Gradient
    const gradient = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        gradient[r][c] = dilation[r][c] === 1 && erosion[r][c] === 0 ? 1 : 0;
      }
    }

    return { dilation, erosion, betaInt, betaExt, gradient };
  }, [inputMatrixA, activeSE]);

  const toggleCell = (r: number, c: number) => {
    const newM = inputMatrixA.map((row, ri) =>
      row.map((val, ci) => (ri === r && ci === c ? (val === 1 ? 0 : 1) : val))
    );
    setInputMatrixA(newM);
  };

  let activeMatrix = results.dilation;
  let opTitle = 'Dilation (A ⊕ B)';
  let opFormula = 'A \\oplus B';
  let opDescription = isKh
    ? 'ពង្រីកតំបន់លេខ 1 ដោយបន្ថែមធាតុជុំវិញតាមរូបរាងរបស់ Structuring Element។'
    : 'Expands binary 1s outward using the structuring element.';

  if (activeOperation === 'erosion') {
    activeMatrix = results.erosion;
    opTitle = 'Erosion (A ⊖ B)';
    opFormula = 'A \\ominus B';
    opDescription = isKh
      ? 'បង្រួញតំបន់លេខ 1 ដោយរក្សាទុកតែទីតាំងណាដែល SE អាច Fit ពេញលេញលើលេខ 1។'
      : 'Shrinks binary 1s, keeping only locations where the SE fully fits on 1s.';
  } else if (activeOperation === 'internal') {
    activeMatrix = results.betaInt;
    opTitle = 'Internal Boundary (βint)';
    opFormula = '\\beta_{\\text{int}}(A) = A - (A \\ominus B)';
    opDescription = isKh
      ? 'ខ្សែបន្ទាត់ព្រំដែនខាងក្នុងវត្ថុ៖ យក Matrix A ដកនឹង Erosion។'
      : 'Extracts boundary from inside the original object shape.';
  } else if (activeOperation === 'external') {
    activeMatrix = results.betaExt;
    opTitle = 'External Boundary (βext)';
    opFormula = '\\beta_{\\text{ext}}(A) = (A \\oplus B) - A';
    opDescription = isKh
      ? 'ខ្សែបន្ទាត់ព្រំដែនខាងក្រៅវត្ថុ៖ យក Dilation ដកនឹង Matrix A។'
      : 'Extracts outer shell surrounding the original object.';
  } else if (activeOperation === 'gradient') {
    activeMatrix = results.gradient;
    opTitle = 'Morphological Gradient (G)';
    opFormula = 'G = (A \\oplus B) - (A \\ominus B)';
    opDescription = isKh
      ? 'កម្រាស់ព្រំដែនសរុប៖ យក Dilation ដកនឹង Erosion (គម្លាតរវាងការរីក និងការរួម)។'
      : 'Combines inner and outer borders by taking difference of dilation and erosion.';
  }

  const rows = inputMatrixA.length;
  const cols = inputMatrixA[0].length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Preset Image A:</span>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (matrixPresets[val]) {
                setInputMatrixA(JSON.parse(JSON.stringify(matrixPresets[val])));
                if (val === 'ex8') setCurrentSeKey('asym2x2');
                else if (val === 'ex7') setCurrentSeKey('cross3x3');
              }
            }}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ex7">Exercise 7 Binary Image (5x5)</option>
            <option value="ex8">Exercise 8 Binary Image (4x5)</option>
            <option value="custom">Custom Plus Shape (5x5)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Structuring Element (SE):</span>
          <select
            value={currentSeKey}
            onChange={(e) => setCurrentSeKey(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {Object.entries(sePresets).map(([key, obj]) => (
              <option key={key} value={key}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Binary Image A ({rows}x{cols})
              </h4>
              <span className="text-xs text-slate-400">Click to toggle 0 / 1</span>
            </div>

            <div className="inline-block p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mx-auto w-full">
              <div className="grid gap-2 justify-center" style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}>
                {inputMatrixA.map((row, r) =>
                  row.map((val, c) => (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => toggleCell(r, c)}
                      className={`h-11 flex items-center justify-center font-mono text-sm font-bold rounded-xl transition ${
                        val === 1
                          ? 'binary-cell-1 border border-blue-400/50 shadow-md shadow-blue-500/20'
                          : 'binary-cell-0 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">SE: {activeSE.name}</span>
              <span className="text-[11px] font-mono text-amber-300">
                ★ Origin [{activeSE.origin.r}, {activeSE.origin.c}]
              </span>
            </div>
            <div className="flex justify-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${activeSE.matrix[0].length}, 38px)` }}
              >
                {activeSE.matrix.map((row, r) =>
                  row.map((val, c) => {
                    const isOrigin = r === activeSE.origin.r && c === activeSE.origin.c;
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`h-9 flex items-center justify-center font-mono text-xs font-bold rounded-lg relative ${
                          val === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800/60 text-slate-500'
                        }`}
                      >
                        {val}
                        {isOrigin && <span className="absolute top-0 right-1 text-[10px] text-amber-400 font-bold">★</span>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {opTitle}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['dilation', 'erosion', 'internal', 'external', 'gradient'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => setActiveOperation(op)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                      activeOperation === op
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {op === 'dilation'
                      ? 'Dilation'
                      : op === 'erosion'
                      ? 'Erosion'
                      : op === 'internal'
                      ? 'β-Int'
                      : op === 'external'
                      ? 'β-Ext'
                      : 'Gradient'}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs mb-4">
              <div className={`text-slate-400 font-sans mb-1 ${isKh ? 'khmer-font' : ''}`}>{opDescription}</div>
              <MathRenderer content={`$$${opFormula}$$`} />
            </div>

            
            <div className="inline-block p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mx-auto w-full">
              <div className="grid gap-2 justify-center" style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}>
                {activeMatrix.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`h-11 flex items-center justify-center font-mono text-sm font-bold rounded-xl ${
                        val === 1
                          ? 'binary-cell-diff border border-emerald-400/50 shadow-md shadow-emerald-500/20'
                          : 'binary-cell-0 border border-slate-800'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-slate-400">Original $A$ Ones:</div>
              <div className="font-mono text-base font-bold text-blue-400 mt-1">
                {inputMatrixA.flat().filter((v) => v === 1).length}
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-slate-400">Dilation Ones:</div>
              <div className="font-mono text-base font-bold text-indigo-400 mt-1">
                {results.dilation.flat().filter((v) => v === 1).length}
              </div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-slate-400">Erosion Ones:</div>
              <div className="font-mono text-base font-bold text-rose-400 mt-1">
                {results.erosion.flat().filter((v) => v === 1).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
