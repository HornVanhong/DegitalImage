/**
 * Spatial Filter & Edge Detection Interactive Lab Engine
 */

class SpatialFilterLab {
  constructor() {
    this.matrixPresets = {
      ex1: [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90]
      ],
      ex6: [
        [85, 35, 112, 10],
        [90, 75, 185, 25],
        [120, 220, 235, 68],
        [165, 70, 89, 80]
      ],
      custom: [
        [50, 100, 150, 200],
        [40, 80, 120, 160],
        [30, 60, 90, 120],
        [20, 40, 60, 80]
      ]
    };

    this.kernelPresets = {
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

    this.currentInput = JSON.parse(JSON.stringify(this.matrixPresets.ex6));
    this.currentKernelKey = "box3x3";
    this.currentPadding = "valid"; // 'valid', 'zero', 'replicate'
    this.activeStep = { r: 0, c: 0 };
    this.animating = false;
    this.animInterval = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const presetSelect = document.getElementById("spatial-preset-select");
    const kernelSelect = document.getElementById("spatial-kernel-select");
    const paddingSelect = document.getElementById("spatial-padding-select");
    const stepPrevBtn = document.getElementById("spatial-step-prev");
    const stepNextBtn = document.getElementById("spatial-step-next");
    const playBtn = document.getElementById("spatial-play-btn");
    const randomBtn = document.getElementById("spatial-random-btn");

    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (this.matrixPresets[val]) {
          this.currentInput = JSON.parse(JSON.stringify(this.matrixPresets[val]));
          this.activeStep = { r: 0, c: 0 };
          this.render();
        }
      });
    }

    if (kernelSelect) {
      kernelSelect.addEventListener("change", (e) => {
        this.currentKernelKey = e.target.value;
        this.render();
      });
    }

    if (paddingSelect) {
      paddingSelect.addEventListener("change", (e) => {
        this.currentPadding = e.target.value;
        this.activeStep = { r: 0, c: 0 };
        this.render();
      });
    }

    if (stepPrevBtn) {
      stepPrevBtn.addEventListener("click", () => this.stepRelative(-1));
    }
    if (stepNextBtn) {
      stepNextBtn.addEventListener("click", () => this.stepRelative(1));
    }
    if (playBtn) {
      playBtn.addEventListener("click", () => this.togglePlay());
    }
    if (randomBtn) {
      randomBtn.addEventListener("click", () => {
        this.randomizeInput();
      });
    }
  }

  randomizeInput() {
    const rows = this.currentInput.length;
    const cols = this.currentInput[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.currentInput[r][c] = Math.floor(Math.random() * 256);
      }
    }
    this.render();
  }

  getKernelObj() {
    return this.kernelPresets[this.currentKernelKey] || this.kernelPresets.box3x3;
  }

  computeConvolution() {
    const input = this.currentInput;
    const kernelObj = this.getKernelObj();
    const kernel = kernelObj.kernel;
    const scale = kernelObj.scale;
    const padMode = this.currentPadding;

    const inRows = input.length;
    const inCols = input[0].length;
    const kRows = kernel.length;
    const kCols = kernel[0].length;
    const kRadR = Math.floor(kRows / 2);
    const kRadC = Math.floor(kCols / 2);

    let outRows = inRows;
    let outCols = inCols;
    let startR = 0, startC = 0;

    if (padMode === 'valid') {
      outRows = inRows - kRows + 1;
      outCols = inCols - kCols + 1;
      if (outRows <= 0 || outCols <= 0) {
        return { output: [[]], steps: [], error: "Input is smaller than kernel in Valid padding mode" };
      }
      startR = kRadR;
      startC = kRadC;
    }

    const output = [];
    const stepDetails = [];

    for (let outR = 0; outR < outRows; outR++) {
      const rowArr = [];
      for (let outC = 0; outC < outCols; outC++) {
        // center in original input
        const centerR = padMode === 'valid' ? outR + kRadR : outR;
        const centerC = padMode === 'valid' ? outC + kRadC : outC;

        let rawSum = 0;
        const subMatrix = [];
        const multList = [];

        for (let kr = 0; kr < kRows; kr++) {
          const subRow = [];
          for (let kc = 0; kc < kCols; kc++) {
            const inR = centerR + kr - kRadR;
            const inC = centerC + kc - kRadC;
            let val = 0;

            if (inR >= 0 && inR < inRows && inC >= 0 && inC < inCols) {
              val = input[inR][inC];
            } else if (padMode === 'replicate') {
              const clampedR = Math.max(0, Math.min(inRows - 1, inR));
              const clampedC = Math.max(0, Math.min(inCols - 1, inC));
              val = input[clampedR][clampedC];
            } else {
              // zero padding
              val = 0;
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
        // Clipping to [0, 255]
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

    return { output, steps: stepDetails, outRows, outCols };
  }

  stepRelative(delta) {
    const { steps } = this.computeConvolution();
    if (!steps || steps.length === 0) return;
    let idx = steps.findIndex(s => s.outR === this.activeStep.r && s.outC === this.activeStep.c);
    if (idx === -1) idx = 0;
    idx = (idx + delta + steps.length) % steps.length;
    this.activeStep = { r: steps[idx].outR, c: steps[idx].outC };
    this.render();
  }

  togglePlay() {
    this.animating = !this.animating;
    const playBtn = document.getElementById("spatial-play-btn");
    if (this.animating) {
      if (playBtn) playBtn.innerHTML = `<i data-lucide="pause" class="w-4 h-4 mr-1 inline"></i> Pause`;
      this.animInterval = setInterval(() => {
        this.stepRelative(1);
      }, 900);
    } else {
      if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-4 h-4 mr-1 inline"></i> Auto Play`;
      clearInterval(this.animInterval);
    }
    if (window.lucide) lucide.createIcons();
  }

  render() {
    const { output, steps, error } = this.computeConvolution();
    const container = document.getElementById("spatial-lab-content");
    if (!container) return;

    if (error) {
      container.innerHTML = `<div class="p-6 text-rose-400 bg-rose-950/40 rounded-xl border border-rose-800">${error}</div>`;
      return;
    }

    // Ensure activeStep is within range
    const currentStep = steps.find(s => s.outR === this.activeStep.r && s.outC === this.activeStep.c) || steps[0];
    if (currentStep) {
      this.activeStep = { r: currentStep.outR, c: currentStep.outC };
    }

    const kernelObj = this.getKernelObj();
    const kernel = kernelObj.kernel;
    const inRows = this.currentInput.length;
    const inCols = this.currentInput[0].length;

    // Render HTML
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Input Matrix View & Editor -->
        <div class="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Input Image Matrix $I$ (${inRows}x${inCols})
              </h4>
              <span class="text-xs text-slate-400">Click any cell to edit</span>
            </div>
            
            <div class="inline-block p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 mx-auto w-full overflow-x-auto">
              <div class="grid gap-2 justify-center" style="grid-template-columns: repeat(${inCols}, minmax(48px, 1fr));">
                ${this.renderInputGrid(currentStep)}
              </div>
            </div>
          </div>

          <!-- Kernel Visualizer Card -->
          <div class="mt-6 pt-4 border-t border-slate-800/80">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-300">Active Kernel: ${kernelObj.name}</span>
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">Scale: ${kernelObj.scaleText}</span>
            </div>
            <div class="flex justify-center p-3 bg-slate-950/60 rounded-lg">
              <div class="grid gap-1.5" style="grid-template-columns: repeat(${kernel[0].length}, 36px);">
                ${kernel.map((row, r) => row.map((val, c) => `
                  <div class="h-9 flex items-center justify-center font-mono text-xs font-bold rounded ${r===1&&c===1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'}">
                    ${val}
                  </div>
                `).join('')).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Live Step Arithmetic Breakdown -->
        <div class="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Step Calculation Breakdown
              </h4>
              <span class="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                Out [${currentStep.outR}, ${currentStep.outC}]
              </span>
            </div>

            <div class="space-y-4 text-xs font-mono">
              <!-- Submatrix overlay -->
              <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div class="text-slate-400 mb-1.5 font-sans">Current Overlay Sub-Matrix:</div>
                <div class="grid gap-1 justify-center py-1" style="grid-template-columns: repeat(3, 44px);">
                  ${currentStep.subMatrix.map((row, r) => row.map((v, c) => `
                    <div class="h-8 flex items-center justify-center text-xs font-bold rounded ${r===1&&c===1?'bg-amber-500 text-slate-950':'bg-indigo-900/50 text-indigo-200 border border-indigo-700/50'}">
                      ${v}
                    </div>
                  `).join('')).join('')}
                </div>
              </div>

              <!-- Product terms -->
              <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
                <div class="text-slate-400 mb-1 font-sans">Element-wise Multiplications:</div>
                <div class="text-slate-300 leading-relaxed text-[11px]">
                  ${currentStep.multList.map(m => `(${m.val} × ${m.kVal})`).join(' + ')}
                </div>
                <div class="mt-2 text-indigo-300 font-bold border-t border-slate-800 pt-1.5">
                  Sum = ${currentStep.rawSum}
                </div>
              </div>

              <!-- Scaled & Clipped Final -->
              <div class="p-3.5 bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-xl border border-indigo-900/60">
                <div class="text-slate-400 font-sans mb-1">Applying Kernel Scale (${kernelObj.scaleText}):</div>
                <div class="text-amber-300 text-sm font-bold">
                  Value = ${kernelObj.scaleText} × ${currentStep.rawSum} = ${currentStep.scaledVal}
                </div>
                ${currentStep.wasClipped ? `
                  <div class="mt-2 text-rose-400 flex items-center gap-1.5 text-[11px] font-sans">
                    <span>⚠️ Clipped to range [0, 255] $\\rightarrow$</span>
                    <strong class="font-mono text-white text-xs">${currentStep.clippedVal}</strong>
                  </div>
                ` : `
                  <div class="mt-2 text-emerald-400 text-[11px] font-sans">
                    ✅ Result: <strong class="font-mono text-emerald-200 text-xs">${currentStep.clippedVal}</strong>
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Stepper Controls -->
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <button id="spatial-step-prev-inline" class="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
              ← Prev
            </button>
            <span class="text-[11px] text-slate-400 font-mono">
              Pixel ${steps.findIndex(s=>s.outR===currentStep.outR&&s.outC===currentStep.outC)+1} / ${steps.length}
            </span>
            <button id="spatial-step-next-inline" class="px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition">
              Next →
            </button>
          </div>
        </div>

        <!-- Output Matrix View -->
        <div class="lg:col-span-3 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Filtered Output (${output.length}x${output[0].length})
              </h4>
            </div>

            <div class="inline-block p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 mx-auto w-full">
              <div class="grid gap-2 justify-center" style="grid-template-columns: repeat(${output[0].length}, minmax(44px, 1fr));">
                ${output.map((row, r) => row.map((val, c) => {
                  const isActive = r === currentStep.outR && c === currentStep.outC;
                  return `
                    <button data-out-r="${r}" data-out-c="${c}" class="output-cell h-12 flex flex-col items-center justify-center rounded-xl font-mono text-xs font-bold transition ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-105 shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-800/90 text-emerald-300 hover:bg-slate-700/80 border border-emerald-500/20'
                    }">
                      <span>${val}</span>
                      <span class="text-[9px] opacity-60 font-sans">[${r},${c}]</span>
                    </button>
                  `;
                }).join('')).join('')}
              </div>
            </div>

            <p class="text-[11px] text-slate-400 mt-4 leading-relaxed khmer-font">
              ចុចលើក្រឡានីមួយៗនៃ Output Matrix ដើម្បីមើលជំហានគណនាជាក់ស្តែង។
            </p>
          </div>

          <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 mt-4">
            <strong class="text-slate-300">Padding Mode:</strong> 
            ${this.currentPadding === 'valid' ? 'Valid (គ្មាន Padding, Output ទំហំតូចជាងមុន)' : this.currentPadding === 'zero' ? 'Zero-Padding (ថែម 0 ជុំវិញ)' : 'Replicate (ថែមតម្លៃគែមជិតបំផុត)'}
          </div>
        </div>
      </div>
    `;

    this.bindDynamicGridEvents();
    if (window.renderMathInElement) {
      renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }
  }

  renderInputGrid(currentStep) {
    const input = this.currentInput;
    const inRows = input.length;
    const inCols = input[0].length;
    const centerR = currentStep.centerR;
    const centerC = currentStep.centerC;
    const padMode = this.currentPadding;

    const cells = [];
    for (let r = 0; r < inRows; r++) {
      for (let c = 0; c < inCols; c++) {
        const val = input[r][c];
        const isCenter = r === centerR && c === centerC;
        const isKernelNeighbor = Math.abs(r - centerR) <= 1 && Math.abs(c - centerC) <= 1;

        let cellClass = "bg-slate-800 text-slate-200 border border-slate-700";
        if (isCenter) {
          cellClass = "bg-amber-500 text-slate-950 font-black border-2 border-amber-300 ring-4 ring-amber-500/30 scale-105 z-10 shadow-lg shadow-amber-500/30";
        } else if (isKernelNeighbor) {
          cellClass = "bg-indigo-900/70 text-indigo-100 border-2 border-indigo-500/70";
        }

        cells.push(`
          <div class="relative group">
            <input 
              type="number" 
              data-in-r="${r}" 
              data-in-c="${c}" 
              value="${val}" 
              min="0" 
              max="255" 
              class="input-matrix-cell w-full h-12 text-center text-xs font-mono font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${cellClass}"
            />
            <span class="absolute bottom-0.5 right-1 text-[8px] opacity-40 font-mono pointer-events-none">${r},${c}</span>
          </div>
        `);
      }
    }
    return cells.join('');
  }

  bindDynamicGridEvents() {
    // Output cell selection
    document.querySelectorAll(".output-cell").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget;
        const r = parseInt(target.getAttribute("data-out-r"));
        const c = parseInt(target.getAttribute("data-out-c"));
        this.activeStep = { r, c };
        this.render();
      });
    });

    // Input cell editing
    document.querySelectorAll(".input-matrix-cell").forEach(input => {
      input.addEventListener("change", (e) => {
        const target = e.target;
        const r = parseInt(target.getAttribute("data-in-r"));
        const c = parseInt(target.getAttribute("data-in-c"));
        let val = parseInt(target.value);
        if (isNaN(val)) val = 0;
        val = Math.max(0, Math.min(255, val));
        this.currentInput[r][c] = val;
        this.render();
      });
    });

    // Inline stepper buttons
    const prevInline = document.getElementById("spatial-step-prev-inline");
    const nextInline = document.getElementById("spatial-step-next-inline");
    if (prevInline) prevInline.addEventListener("click", () => this.stepRelative(-1));
    if (nextInline) nextInline.addEventListener("click", () => this.stepRelative(1));
  }
}

window.SpatialFilterLab = SpatialFilterLab;
