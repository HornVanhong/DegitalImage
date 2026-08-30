/**
 * Mathematical Morphology Interactive Lab Engine
 * Covers: Dilation, Erosion, Internal/External Boundary, Gradient, Opening, Closing
 * Arbitrary Structuring Elements and configurable Origin coordinates
 */

class MorphologyLab {
  constructor() {
    this.matrixPresets = {
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

    this.sePresets = {
      cross3x3: {
        name: "3x3 Cross (Ex 7)",
        matrix: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 1, 0]
        ],
        origin: { r: 1, c: 1 }
      },
      asym2x2: {
        name: "2x2 Asymmetric Top-Left (Ex 8)",
        matrix: [
          [1, 1],
          [0, 1]
        ],
        origin: { r: 0, c: 0 }
      },
      box3x3: {
        name: "3x3 Square Box",
        matrix: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1]
        ],
        origin: { r: 1, c: 1 }
      },
      horizontal3: {
        name: "1x3 Horizontal Line",
        matrix: [
          [1, 1, 1]
        ],
        origin: { r: 0, c: 1 }
      }
    };

    this.currentInput = JSON.parse(JSON.stringify(this.matrixPresets.ex7));
    this.currentSeKey = "cross3x3";
    this.activeOperation = "dilation"; // 'dilation', 'erosion', 'internal', 'external', 'gradient'
    this.probePos = { r: 2, c: 2 };
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const presetSelect = document.getElementById("morph-preset-select");
    const seSelect = document.getElementById("morph-se-select");
    const opSelect = document.getElementById("morph-op-select");

    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (this.matrixPresets[val]) {
          this.currentInput = JSON.parse(JSON.stringify(this.matrixPresets[val]));
          if (val === 'ex8') {
            this.currentSeKey = 'asym2x2';
            if (seSelect) seSelect.value = 'asym2x2';
          } else if (val === 'ex7') {
            this.currentSeKey = 'cross3x3';
            if (seSelect) seSelect.value = 'cross3x3';
          }
          this.render();
        }
      });
    }

    if (seSelect) {
      seSelect.addEventListener("change", (e) => {
        this.currentSeKey = e.target.value;
        this.render();
      });
    }

    if (opSelect) {
      opSelect.addEventListener("change", (e) => {
        this.activeOperation = e.target.value;
        this.render();
      });
    }
  }

  getSE() {
    return this.sePresets[this.currentSeKey] || this.sePresets.cross3x3;
  }

  // Pure binary matrix operations
  computeMorphology() {
    const A = this.currentInput;
    const { matrix: B, origin } = this.getSE();
    const rows = A.length;
    const cols = A[0].length;
    const seRows = B.length;
    const seCols = B[0].length;

    // 1. Dilation: A ⊕ B
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

    // 2. Erosion: A ⊖ B
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
        if (fits) {
          erosion[r][c] = 1;
        }
      }
    }

    // 3. Internal Boundary: βint = A - (A ⊖ B)
    const betaInt = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        betaInt[r][c] = (A[r][c] === 1 && erosion[r][c] === 0) ? 1 : 0;
      }
    }

    // 4. External Boundary: βext = (A ⊕ B) - A
    const betaExt = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        betaExt[r][c] = (dilation[r][c] === 1 && A[r][c] === 0) ? 1 : 0;
      }
    }

    // 5. Morphological Gradient: G = (A ⊕ B) - (A ⊖ B)
    const gradient = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        gradient[r][c] = (dilation[r][c] === 1 && erosion[r][c] === 0) ? 1 : 0;
      }
    }

    return { dilation, erosion, betaInt, betaExt, gradient };
  }

  render() {
    const container = document.getElementById("morphology-lab-content");
    if (!container) return;

    const { dilation, erosion, betaInt, betaExt, gradient } = this.computeMorphology();
    const seObj = this.getSE();
    const A = this.currentInput;
    const rows = A.length;
    const cols = A[0].length;

    let activeMatrix = dilation;
    let opTitle = "Dilation (A ⊕ B)";
    let opFormula = "A \\oplus B";
    let opDescription = "ពង្រីកតំបន់លេខ 1 ដោយបន្ថែមធាតុជុំវិញតាមរូបរាងរបស់ Structuring Element។";

    if (this.activeOperation === "erosion") {
      activeMatrix = erosion;
      opTitle = "Erosion (A ⊖ B)";
      opFormula = "A \\ominus B";
      opDescription = "បង្រួញតំបន់លេខ 1 ដោយរក្សាទុកតែទីតាំងណាដែល SE អាចគ្របដណ្តប់ (Fit) បានពេញលេញលើលេខ 1។";
    } else if (this.activeOperation === "internal") {
      activeMatrix = betaInt;
      opTitle = "Internal Boundary (βint)";
      opFormula = "\\beta_{\\text{int}}(A) = A - (A \\ominus B)";
      opDescription = "ខ្សែបន្ទាត់ព្រំដែនខាងក្នុងវត្ថុ៖ យក Matrix A ដកនឹង Erosion។";
    } else if (this.activeOperation === "external") {
      activeMatrix = betaExt;
      opTitle = "External Boundary (βext)";
      opFormula = "\\beta_{\\text{ext}}(A) = (A \\oplus B) - A";
      opDescription = "ខ្សែបន្ទាត់ព្រំដែនខាងក្រៅវត្ថុ៖ យក Dilation ដកនឹង Matrix A។";
    } else if (this.activeOperation === "gradient") {
      activeMatrix = gradient;
      opTitle = "Morphological Gradient (G)";
      opFormula = "G = (A \\oplus B) - (A \\ominus B)";
      opDescription = "កម្រាស់ព្រំដែនសរុប៖ យក Dilation ដកនឹង Erosion (គម្លាតរវាងការរីក និងការរួម)។";
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Input Matrix A & SE Controls -->
        <div class="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Binary Matrix $A$ (${rows}x${cols})
              </h4>
              <span class="text-xs text-slate-400">Click to toggle 0 / 1</span>
            </div>

            <!-- Matrix A Grid -->
            <div class="inline-block p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 mx-auto w-full">
              <div class="grid gap-2 justify-center" style="grid-template-columns: repeat(${cols}, minmax(42px, 1fr));">
                ${A.map((row, r) => row.map((val, c) => `
                  <button data-morph-r="${r}" data-morph-c="${c}" class="binary-toggle-cell h-11 flex items-center justify-center font-mono text-sm font-bold rounded-xl transition ${
                    val === 1 
                      ? 'binary-cell-1 border border-blue-400/50 shadow-md shadow-blue-500/20' 
                      : 'binary-cell-0 border border-slate-800 hover:border-slate-700'
                  }">
                    ${val}
                  </button>
                `).join('')).join('')}
              </div>
            </div>
          </div>

          <!-- Structuring Element Card -->
          <div class="mt-6 pt-4 border-t border-slate-800">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-300">Structuring Element: ${seObj.name}</span>
              <span class="text-[11px] font-mono text-amber-300">★ = Origin [${seObj.origin.r}, ${seObj.origin.c}]</span>
            </div>
            <div class="flex justify-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div class="grid gap-1.5" style="grid-template-columns: repeat(${seObj.matrix[0].length}, 38px);">
                ${seObj.matrix.map((row, r) => row.map((val, c) => {
                  const isOrigin = r === seObj.origin.r && c === seObj.origin.c;
                  return `
                    <div class="h-9 flex items-center justify-center font-mono text-xs font-bold rounded-lg relative ${
                      val === 1 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : 'bg-slate-800/60 text-slate-500'
                    }">
                      ${val}
                      ${isOrigin ? `<span class="absolute top-0 right-1 text-[10px] text-amber-400 font-bold">★</span>` : ''}
                    </div>
                  `;
                }).join('')).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Output Result & Operation View -->
        <div class="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h4 class="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ${opTitle}
              </h4>
              <div class="flex items-center gap-1.5">
                <button data-op="dilation" class="op-tab-btn text-xs px-2.5 py-1 rounded-lg transition ${this.activeOperation==='dilation'?'bg-indigo-600 text-white font-bold':'bg-slate-800 text-slate-300 hover:bg-slate-700'}">Dilation</button>
                <button data-op="erosion" class="op-tab-btn text-xs px-2.5 py-1 rounded-lg transition ${this.activeOperation==='erosion'?'bg-indigo-600 text-white font-bold':'bg-slate-800 text-slate-300 hover:bg-slate-700'}">Erosion</button>
                <button data-op="internal" class="op-tab-btn text-xs px-2.5 py-1 rounded-lg transition ${this.activeOperation==='internal'?'bg-indigo-600 text-white font-bold':'bg-slate-800 text-slate-300 hover:bg-slate-700'}">β-Int</button>
                <button data-op="external" class="op-tab-btn text-xs px-2.5 py-1 rounded-lg transition ${this.activeOperation==='external'?'bg-indigo-600 text-white font-bold':'bg-slate-800 text-slate-300 hover:bg-slate-700'}">β-Ext</button>
                <button data-op="gradient" class="op-tab-btn text-xs px-2.5 py-1 rounded-lg transition ${this.activeOperation==='gradient'?'bg-indigo-600 text-white font-bold':'bg-slate-800 text-slate-300 hover:bg-slate-700'}">Gradient</button>
              </div>
            </div>

            <!-- Formula Header -->
            <div class="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs mb-4">
              <div class="text-slate-400 font-sans mb-1">${opDescription}</div>
              <div class="font-mono text-indigo-300 text-sm">
                $$${opFormula}$$
              </div>
            </div>

            <!-- Output Result Grid -->
            <div class="inline-block p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 mx-auto w-full">
              <div class="grid gap-2 justify-center" style="grid-template-columns: repeat(${cols}, minmax(42px, 1fr));">
                ${activeMatrix.map((row, r) => row.map((val, c) => `
                  <div class="h-11 flex items-center justify-center font-mono text-sm font-bold rounded-xl ${
                    val === 1 
                      ? 'binary-cell-diff border border-emerald-400/50 shadow-md shadow-emerald-500/20' 
                      : 'binary-cell-0 border border-slate-800'
                  }">
                    ${val}
                  </div>
                `).join('')).join('')}
              </div>
            </div>
          </div>

          <!-- Comparison Summary -->
          <div class="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center text-xs">
            <div class="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div class="text-slate-400">Original $A$ Ones:</div>
              <div class="font-mono text-base font-bold text-blue-400">${A.flat().filter(v=>v===1).length}</div>
            </div>
            <div class="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div class="text-slate-400">Dilation $A \\oplus B$:</div>
              <div class="font-mono text-base font-bold text-indigo-400">${dilation.flat().filter(v=>v===1).length}</div>
            </div>
            <div class="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
              <div class="text-slate-400">Erosion $A \\ominus B$:</div>
              <div class="font-mono text-base font-bold text-rose-400">${erosion.flat().filter(v=>v===1).length}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindCellToggles();

    if (window.renderMathInElement) {
      renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }
  }

  bindCellToggles() {
    document.querySelectorAll(".binary-toggle-cell").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const r = parseInt(e.currentTarget.getAttribute("data-morph-r"));
        const c = parseInt(e.currentTarget.getAttribute("data-morph-c"));
        this.currentInput[r][c] = this.currentInput[r][c] === 1 ? 0 : 1;
        this.render();
      });
    });

    document.querySelectorAll(".op-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeOperation = e.currentTarget.getAttribute("data-op");
        this.render();
      });
    });
  }
}

window.MorphologyLab = MorphologyLab;
