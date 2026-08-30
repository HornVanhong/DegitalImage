'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '@/types';
import { MathRenderer } from '../../MathRenderer';

interface SpatialFilterLabProps {
  language: Language;
}

export const SpatialFilterLab: React.FC<SpatialFilterLabProps> = ({ language }) => {
  const isKh = language === 'kh';

  const matrixPresets: Record<string, number[][]> = {
    ex6: [
      [85, 35, 112, 10],
      [90, 75, 185, 25],
      [120, 220, 235, 68],
      [165, 70, 89, 80]
    ],
    ex1: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ],
    custom: [
      [50, 100, 150, 200],
      [40, 80, 120, 160],
      [30, 60, 90, 120],
      [20, 40, 60, 80]
    ]
  };

  const kernelPresets: Record<string, { name: string; scale: number; scaleText: string; kernel: number[][] }> = {
    box3x3: {
      name: "Box Filter (Smoothing 3x3)",
      scale: 1/9,
      scaleText: "1/9",
      kernel: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    laplacian4: {
      name: "Laplacian 4-neighbor (Edge Detection)",
      scale: 1,
      scaleText: "1",
      kernel: [
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
      ]
    },
    laplacian8: {
      name: "Laplacian 8-neighbor",
      scale: 1,
      scaleText: "1",
      kernel: [
        [1, 1, 1],
        [1, -8, 1],
        [1, 1, 1]
      ]
    },
    gaussian3x3: {
      name: "Gaussian Smoothing 3x3",
      scale: 1/16,
      scaleText: "1/16",
      kernel: [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
      ]
    },
    sobelX: {
      name: "Sobel Horizontal (Gx)",
      scale: 1,
      scaleText: "1",
      kernel: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ]
    },
    sobelY: {
      name: "Sobel Vertical (Gy)",
      scale: 1,
      scaleText: "1",
      kernel: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ]
    }
  };

  const [inputMatrix, setInputMatrix] = useState<number[][]>(matrixPresets.ex6);
  const [currentKernelKey, setCurrentKernelKey] = useState<string>('box3x3');
  const [paddingMode, setPaddingMode] = useState<'valid' | 'zero' | 'replicate'>('valid');
  const [activeStep, setActiveStep] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeKernel = kernelPresets[currentKernelKey];

  // Convolution Computation Engine
  const computation = useMemo(() => {
    const input = inputMatrix;
    const kernel = activeKernel.kernel;
    const scale = activeKernel.scale;
    const inRows = input.length;
    const inCols = input[0].length;
    const kRows = kernel.length;
    const kCols = kernel[0].length;
    const kRadR = Math.floor(kRows / 2);
    const kRadC = Math.floor(kCols / 2);

    let outRows = inRows;
    let outCols = inCols;

    if (paddingMode === 'valid') {
      outRows = inRows - kRows + 1;
      outCols = inCols - kCols + 1;
      if (outRows <= 0 || outCols <= 0) {
        return { output: [[]], steps: [], error: 'Matrix size is smaller than kernel for Valid padding' };
      }
    }

    const output: number[][] = [];
    const stepDetails: any[] = [];

    for (let outR = 0; outR < outRows; outR++) {
      const rowArr: number[] = [];
      for (let outC = 0; outC < outCols; outC++) {
        const centerR = paddingMode === 'valid' ? outR + kRadR : outR;
        const centerC = paddingMode === 'valid' ? outC + kRadC : outC;

        let rawSum = 0;
        const subMatrix: number[][] = [];
        const multList: { val: number; kVal: number; product: number }[] = [];

        for (let kr = 0; kr < kRows; kr++) {
          const subRow: number[] = [];
          for (let kc = 0; kc < kCols; kc++) {
            const inR = centerR + kr - kRadR;
            const inC = centerC + kc - kRadC;
            let val = 0;

            if (inR >= 0 && inR < inRows && inC >= 0 && inC < inCols) {
              val = input[inR][inC];
            } else if (paddingMode === 'replicate') {
              const clampedR = Math.max(0, Math.min(inRows - 1, inR));
              const clampedC = Math.max(0, Math.min(inCols - 1, inC));
              val = input[clampedR][clampedC];
            } else {
              val = 0; // zero-padding
            }

            subRow.push(val);
            const kVal = kernel[kr][kc];
            const product = val * kVal;
            rawSum += product;
            multList.push({ val, kVal, product });
          }
          subMatrix.push(subRow);
        }

        const scaledVal = rawSum * scale;
        let clippedVal = Math.round(scaledVal);
        let wasClipped = false;
        if (clippedVal < 0) {
          clippedVal = 0;
          wasClipped = true;
        } else if (clippedVal > 255) {
          clippedVal = 255;
          wasClipped = true;
        }

        rowArr.push(clippedVal);
        stepDetails.push({
          outR,
          outC,
          centerR,
          centerC,
          subMatrix,
          rawSum,
          scaledVal: Number(scaledVal.toFixed(2)),
          clippedVal,
          wasClipped,
          multList
        });
      }
      output.push(rowArr);
    }

    return { output, steps: stepDetails, outRows, outCols, error: null };
  }, [inputMatrix, activeKernel, paddingMode]);

  // Current active step object
  const currentStepObj = useMemo(() => {
    if (!computation.steps || computation.steps.length === 0) return null;
    return computation.steps.find((s: any) => s.outR === activeStep.r && s.outC === activeStep.c) || computation.steps[0];
  }, [computation, activeStep]);

  // Step relative navigation
  const stepRelative = (delta: number) => {
    if (!computation.steps || computation.steps.length === 0) return;
    let idx = computation.steps.findIndex((s: any) => s.outR === activeStep.r && s.outC === activeStep.c);
    if (idx === -1) idx = 0;
    idx = (idx + delta + computation.steps.length) % computation.steps.length;
    setActiveStep({ r: computation.steps[idx].outR, c: computation.steps[idx].outC });
  };

  // Playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        stepRelative(1);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeStep, computation]);

  // Randomize matrix
  const handleRandomize = () => {
    const rows = inputMatrix.length;
    const cols = inputMatrix[0].length;
    const newM = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 256))
    );
    setInputMatrix(newM);
  };

  const handleCellChange = (r: number, c: number, val: number) => {
    const clamped = Math.max(0, Math.min(255, isNaN(val) ? 0 : val));
    const newM = inputMatrix.map((row, ri) =>
      row.map((colVal, ci) => (ri === r && ci === c ? clamped : colVal))
    );
    setInputMatrix(newM);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Preset:</span>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (matrixPresets[val]) {
                  setInputMatrix(JSON.parse(JSON.stringify(matrixPresets[val])));
                  setActiveStep({ r: 0, c: 0 });
                }
              }}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ex6">Exercise 6 Matrix (4x4)</option>
              <option value="ex1">Exercise 1 Matrix (3x3)</option>
              <option value="custom">Custom Matrix (4x4)</option>
            </select>
          </div>

          <button
            onClick={handleRandomize}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition font-medium"
          >
            Randomize
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Kernel:</span>
            <select
              value={currentKernelKey}
              onChange={(e) => setCurrentKernelKey(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Object.entries(kernelPresets).map(([key, obj]) => (
                <option key={key} value={key}>
                  {obj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Padding:</span>
            <select
              value={paddingMode}
              onChange={(e) => {
                setPaddingMode(e.target.value as any);
                setActiveStep({ r: 0, c: 0 });
              }}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="valid">Valid (No Padding)</option>
              <option value="zero">Zero-Padding (Boundary=0)</option>
              <option value="replicate">Replicate Border</option>
            </select>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-xl text-white font-bold transition flex items-center gap-1.5 shadow-md ${
              isPlaying ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Auto Play
              </>
            )}
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Input Matrix I ({inputMatrix.length}x{inputMatrix[0].length})
              </h4>
              <span className="text-xs text-slate-400">Click cell to edit value</span>
            </div>

            <div className="inline-block p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mx-auto w-full overflow-x-auto">
              <div
                className="grid gap-2 justify-center"
                style={{ gridTemplateColumns: `repeat(${inputMatrix[0].length}, minmax(46px, 1fr))` }}
              >
                {inputMatrix.map((row, r) =>
                  row.map((val, c) => {
                    const centerR = currentStepObj?.centerR;
                    const centerC = currentStepObj?.centerC;
                    const isCenter = r === centerR && c === centerC;
                    const isKernelNeighbor =
                      centerR !== undefined &&
                      centerC !== undefined &&
                      Math.abs(r - centerR) <= 1 &&
                      Math.abs(c - centerC) <= 1;

                    let cellClass = 'bg-slate-800 text-slate-200 border border-slate-700';
                    if (isCenter) {
                      cellClass =
                        'bg-amber-500 text-slate-950 font-black border-2 border-amber-300 ring-4 ring-amber-500/30 scale-105 z-10 shadow-lg shadow-amber-500/30';
                    } else if (isKernelNeighbor) {
                      cellClass = 'bg-indigo-900/70 text-indigo-100 border-2 border-indigo-500/70';
                    }

                    return (
                      <div key={`${r}-${c}`} className="relative group">
                        <input
                          type="number"
                          value={val}
                          min={0}
                          max={255}
                          onChange={(e) => handleCellChange(r, c, parseInt(e.target.value))}
                          className={`w-full h-12 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${cellClass}`}
                        />
                        <span className="absolute bottom-0.5 right-1 text-[8px] opacity-40 font-mono pointer-events-none">
                          {r},{c}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Active Kernel: {activeKernel.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Scale: {activeKernel.scaleText}
              </span>
            </div>
            <div className="flex justify-center p-3 bg-slate-950/60 rounded-xl">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${activeKernel.kernel[0].length}, 36px)` }}
              >
                {activeKernel.kernel.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`h-9 flex items-center justify-center font-mono text-xs font-bold rounded-lg ${
                        r === 1 && c === 1
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Step Calculation
              </h4>
              {currentStepObj && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
                  Out [{currentStepObj.outR}, {currentStepObj.outC}]
                </span>
              )}
            </div>

            {currentStepObj ? (
              <div className="space-y-4 text-xs font-mono">
                
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 mb-1.5 font-sans">Current Overlay Sub-Matrix:</div>
                  <div className="grid gap-1 justify-center py-1" style={{ gridTemplateColumns: 'repeat(3, 42px)' }}>
                    {currentStepObj.subMatrix.map((row: number[], r: number) =>
                      row.map((v: number, c: number) => (
                        <div
                          key={`${r}-${c}`}
                          className={`h-8 flex items-center justify-center text-xs font-bold rounded-lg ${
                            r === 1 && c === 1
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-indigo-900/50 text-indigo-200 border border-indigo-700/50'
                          }`}
                        >
                          {v}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto">
                  <div className="text-slate-400 mb-1 font-sans">Element-wise Multiplications:</div>
                  <div className="text-slate-300 leading-relaxed text-[11px]">
                    {currentStepObj.multList.map((m: any) => `(${m.val} × ${m.kVal})`).join(' + ')}
                  </div>
                  <div className="mt-2 text-indigo-300 font-bold border-t border-slate-800 pt-1.5">
                    Sum = {currentStepObj.rawSum}
                  </div>
                </div>

                
                <div className="p-3.5 bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-900/60">
                  <div className="text-slate-400 font-sans mb-1">Applying Scale ({activeKernel.scaleText}):</div>
                  <div className="text-amber-300 text-sm font-bold">
                    Value = {activeKernel.scaleText} × {currentStepObj.rawSum} = {currentStepObj.scaledVal}
                  </div>
                  {currentStepObj.wasClipped ? (
                    <div className="mt-2 text-rose-400 flex items-center gap-1.5 text-[11px] font-sans">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Clipped to [0, 255] →</span>
                      <strong className="font-mono text-white text-xs">{currentStepObj.clippedVal}</strong>
                    </div>
                  ) : (
                    <div className="mt-2 text-emerald-400 text-[11px] font-sans flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Result:</span>
                      <strong className="font-mono text-emerald-200 text-xs">{currentStepObj.clippedVal}</strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 p-4">No active step available.</div>
            )}
          </div>

          
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => stepRelative(-1)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Pixel {computation.steps ? computation.steps.findIndex((s: any) => s.outR === activeStep.r && s.outC === activeStep.c) + 1 : 0} / {computation.steps?.length || 0}
            </span>
            <button
              onClick={() => stepRelative(1)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        
        <div className="lg:col-span-3 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Filtered Output ({computation.output.length}x{computation.output[0]?.length || 0})
              </h4>
            </div>

            <div className="inline-block p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mx-auto w-full">
              <div
                className="grid gap-2 justify-center"
                style={{ gridTemplateColumns: `repeat(${computation.output[0]?.length || 1}, minmax(42px, 1fr))` }}
              >
                {computation.output.map((row, r) =>
                  row.map((val, c) => {
                    const isActive = r === activeStep.r && c === activeStep.c;
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => setActiveStep({ r, c })}
                        className={`h-12 flex flex-col items-center justify-center rounded-xl font-mono text-xs font-bold transition ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-105 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800/90 text-emerald-300 hover:bg-slate-700/80 border border-emerald-500/20'
                        }`}
                      >
                        <span>{val}</span>
                        <span className="text-[9px] opacity-60 font-sans">
                          [{r},{c}]
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <p className={`text-[11px] text-slate-400 mt-4 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
              {isKh ? 'ចុចលើក្រឡានីមួយៗនៃ Output Matrix ដើម្បីមើលជំហានគណនាជាក់ស្តែង។' : 'Click on any output cell to inspect its exact convolution arithmetic.'}
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 mt-4">
            <strong className="text-slate-300">Padding Mode:</strong>{' '}
            {paddingMode === 'valid'
              ? 'Valid (No Padding)'
              : paddingMode === 'zero'
              ? 'Zero-Padding (0 on border)'
              : 'Replicate (Clamp border)'}
          </div>
        </div>
      </div>
    </div>
  );
};
