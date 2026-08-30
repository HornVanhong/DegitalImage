/**
 * Color Models & Density Slicing Interactive Lab Engine
 */

class ColorLab {
  constructor() {
    this.rgb = { r: 100, g: 150, b: 200 }; // Default from Exercise 2
    this.cmykRgb = { r: 51, g: 255, b: 102 }; // Default from Exercise 3
    this.sliceT1 = 60;
    this.sliceT2 = 170;
    this.activeColorSubTab = "hsi"; // 'hsi', 'cmyk', 'slicing', 'equalization'
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Tab switching inside color lab
    document.querySelectorAll(".color-subtab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-color-tab");
        this.activeColorSubTab = tab;
        document.querySelectorAll(".color-subtab-btn").forEach(b => b.classList.remove("active", "bg-indigo-600", "text-white"));
        e.currentTarget.classList.add("active", "bg-indigo-600", "text-white");
        this.render();
      });
    });
  }

  render() {
    const container = document.getElementById("color-lab-content");
    if (!container) return;

    if (this.activeColorSubTab === "hsi") {
      this.renderHsiTab(container);
    } else if (this.activeColorSubTab === "cmyk") {
      this.renderCmykTab(container);
    } else if (this.activeColorSubTab === "slicing") {
      this.renderSlicingTab(container);
    } else if (this.activeColorSubTab === "equalization") {
      this.renderEqualizationTab(container);
    }

    if (window.renderMathInElement) {
      renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  /* ------------------- 1. RGB to HSI / HSV Calculator ------------------- */
  renderHsiTab(container) {
    const { r, g, b } = this.rgb;
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const minVal = Math.min(rNorm, gNorm, bNorm);
    const sumNorm = rNorm + gNorm + bNorm;

    // Intensity
    const intensity8Bit = Math.round((r + g + b) / 3);
    const intensityNorm = sumNorm / 3;

    // Saturation HSI
    let satHsi = 0;
    if (sumNorm > 0) {
      satHsi = 1 - (3 / sumNorm) * minVal;
    }
    satHsi = Math.max(0, Math.min(1, satHsi));

    // Hue Calculation
    const num = 0.5 * ((rNorm - gNorm) + (rNorm - bNorm));
    const den = Math.sqrt((rNorm - gNorm) * (rNorm - gNorm) + (rNorm - bNorm) * (gNorm - bNorm));
    let theta = 0;
    if (den !== 0) {
      theta = Math.acos(Math.max(-1, Math.min(1, num / den))) * (180 / Math.PI);
    }
    let hue = bNorm <= gNorm ? theta : 360 - theta;
    if (isNaN(hue)) hue = 0;

    // HSV Saturation & Value
    const maxVal = Math.max(rNorm, gNorm, bNorm);
    const valHsv = maxVal;
    const satHsv = maxVal === 0 ? 0 : (maxVal - minVal) / maxVal;

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Controls & Color Swatch -->
        <div class="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> RGB Input Controls
              </h4>
              <button id="hsi-reset-ex2" class="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition">
                Load Exercise 2 (100, 150, 200)
              </button>
            </div>

            <!-- Color Swatch & Live Hex -->
            <div class="p-4 rounded-xl border border-slate-700/80 mb-5 flex items-center gap-4" style="background: rgb(${r}, ${g}, ${b});">
              <div class="bg-slate-950/80 backdrop-blur px-3 py-2 rounded-lg border border-white/20 text-white font-mono text-xs">
                RGB(${r}, ${g}, ${b}) <br/>
                HEX: #${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}
              </div>
            </div>

            <!-- Sliders -->
            <div class="space-y-4 text-xs font-mono">
              <div>
                <div class="flex justify-between text-rose-400 font-bold mb-1">
                  <span>Red (R): ${r}</span>
                  <span class="text-slate-400 font-normal">Norm: ${rNorm.toFixed(4)}</span>
                </div>
                <input type="range" id="slider-r" min="0" max="255" value="${r}" class="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg" />
              </div>

              <div>
                <div class="flex justify-between text-emerald-400 font-bold mb-1">
                  <span>Green (G): ${g}</span>
                  <span class="text-slate-400 font-normal">Norm: ${gNorm.toFixed(4)}</span>
                </div>
                <input type="range" id="slider-g" min="0" max="255" value="${g}" class="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg" />
              </div>

              <div>
                <div class="flex justify-between text-sky-400 font-bold mb-1">
                  <span>Blue (B): ${b}</span>
                  <span class="text-slate-400 font-normal">Norm: ${bNorm.toFixed(4)}</span>
                </div>
                <input type="range" id="slider-b" min="0" max="255" value="${b}" class="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg" />
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 khmer-font">
            រូបមន្តគណនា Intensity និង Saturation ត្រូវអនុវត្តលើតម្លៃ Normalized ក្នុងចន្លោះ $[0, 1]$។
          </div>
        </div>

        <!-- Math & Results View -->
        <div class="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 class="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> HSI / HSV Mathematical Step Breakdown
          </h4>

          <!-- 1. Normalization -->
          <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <div class="text-slate-300 font-bold mb-1">1. Normalization to Range [0, 1]:</div>
            <div class="font-mono text-slate-400">
              $$R_{\\text{norm}} = \\frac{${r}}{255} \\approx ${rNorm.toFixed(4)}, \\quad G_{\\text{norm}} = \\frac{${g}}{255} \\approx ${gNorm.toFixed(4)}, \\quad B_{\\text{norm}} = \\frac{${b}}{255} \\approx ${bNorm.toFixed(4)}$$
            </div>
            <div class="mt-1 text-slate-300">
              Sum = <span class="font-mono font-bold text-amber-300">${sumNorm.toFixed(4)}</span>, 
              $\\min(R,G,B) = $ <span class="font-mono font-bold text-sky-300">${minVal.toFixed(4)}</span>
            </div>
          </div>

          <!-- 2. Intensity (I) -->
          <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <div class="flex justify-between items-center mb-1">
              <span class="text-slate-300 font-bold">2. Intensity Component ($I$):</span>
              <span class="font-mono text-emerald-400 font-bold text-sm">I = ${intensity8Bit} (8-bit) / ${intensityNorm.toFixed(4)} ([0,1])</span>
            </div>
            <div class="font-mono text-slate-400">
              $$I = \\frac{R + G + B}{3} = \\frac{${r} + ${g} + ${b}}{3} = \\frac{${r+g+b}}{3} = ${intensity8Bit}$$
            </div>
          </div>

          <!-- 3. Saturation (S) -->
          <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <div class="flex justify-between items-center mb-1">
              <span class="text-slate-300 font-bold">3. Saturation Component ($S$):</span>
              <span class="font-mono text-amber-400 font-bold text-sm">S = ${satHsi.toFixed(4)} (${(satHsi*100).toFixed(2)}%)</span>
            </div>
            <div class="font-mono text-slate-400">
              $$S = 1 - \\frac{3}{${sumNorm.toFixed(4)}} \\times ${minVal.toFixed(4)} = 1 - ${(sumNorm > 0 ? (3/sumNorm * minVal).toFixed(4) : 0)} = ${satHsi.toFixed(4)}$$
            </div>
          </div>

          <!-- 4. Hue (H) & Comparison -->
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div class="text-slate-400">Hue Angle ($H$):</div>
              <div class="text-lg font-mono font-bold text-indigo-300 mt-1">${hue.toFixed(1)}°</div>
            </div>
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div class="text-slate-400">HSV Value ($V$):</div>
              <div class="text-lg font-mono font-bold text-cyan-300 mt-1">${(valHsv * 100).toFixed(1)}% (${(valHsv * 255).toFixed(0)})</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind sliders
    const sliderR = document.getElementById("slider-r");
    const sliderG = document.getElementById("slider-g");
    const sliderB = document.getElementById("slider-b");
    const resetEx2 = document.getElementById("hsi-reset-ex2");

    if (sliderR) sliderR.addEventListener("input", (e) => { this.rgb.r = parseInt(e.target.value); this.render(); });
    if (sliderG) sliderG.addEventListener("input", (e) => { this.rgb.g = parseInt(e.target.value); this.render(); });
    if (sliderB) sliderB.addEventListener("input", (e) => { this.rgb.b = parseInt(e.target.value); this.render(); });
    if (resetEx2) resetEx2.addEventListener("click", () => { this.rgb = { r: 100, g: 150, b: 200 }; this.render(); });
  }

  /* ------------------- 2. RGB to CMYK Converter ------------------- */
  renderCmykTab(container) {
    const { r, g, b } = this.cmykRgb;
    const rPrime = r / 255;
    const gPrime = g / 255;
    const bPrime = b / 255;
    const maxPrime = Math.max(rPrime, gPrime, bPrime);

    const k = 1 - maxPrime;
    let c = 0, m = 0, y = 0;
    if (k < 1) {
      c = (1 - rPrime - k) / (1 - k);
      m = (1 - gPrime - k) / (1 - k);
      y = (1 - bPrime - k) / (1 - k);
    } else {
      c = 0; m = 0; y = 0;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- RGB Inputs -->
        <div class="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> RGB Printing Input
              </h4>
              <button id="cmyk-reset-ex3" class="text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 transition">
                Load Exercise 3 (51, 255, 102)
              </button>
            </div>

            <div class="p-4 rounded-xl border border-slate-700/80 mb-5 flex items-center justify-between" style="background: rgb(${r}, ${g}, ${b});">
              <div class="bg-slate-950/80 backdrop-blur px-3 py-2 rounded-lg border border-white/20 text-white font-mono text-xs">
                RGB(${r}, ${g}, ${b}) <br/>
                Normalized: (${rPrime.toFixed(2)}, ${gPrime.toFixed(2)}, ${bPrime.toFixed(2)})
              </div>
            </div>

            <div class="space-y-4 text-xs font-mono">
              <div>
                <div class="flex justify-between text-rose-400 font-bold mb-1">
                  <span>Red (R): ${r}</span>
                  <span class="text-slate-400">R' = ${rPrime.toFixed(2)}</span>
                </div>
                <input type="range" id="cmyk-slider-r" min="0" max="255" value="${r}" class="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg" />
              </div>
              <div>
                <div class="flex justify-between text-emerald-400 font-bold mb-1">
                  <span>Green (G): ${g}</span>
                  <span class="text-slate-400">G' = ${gPrime.toFixed(2)}</span>
                </div>
                <input type="range" id="cmyk-slider-g" min="0" max="255" value="${g}" class="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg" />
              </div>
              <div>
                <div class="flex justify-between text-sky-400 font-bold mb-1">
                  <span>Blue (B): ${b}</span>
                  <span class="text-slate-400">B' = ${bPrime.toFixed(2)}</span>
                </div>
                <input type="range" id="cmyk-slider-b" min="0" max="255" value="${b}" class="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg" />
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 khmer-font">
            CMYK គឺជា Subtractive Color Model ប្រើប្រាស់សម្រាប់បច្ចេកវិទ្យាបោះពុម្ព (Printing)។
          </div>
        </div>

        <!-- CMYK Results & Bars -->
        <div class="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> CMYK Subtractive Calculation & Inks
          </h4>

          <!-- Key (Black K) Step -->
          <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <div class="flex justify-between items-center mb-1">
              <span class="text-slate-300 font-bold">Step 1: Calculate Key (Black, K)</span>
              <span class="font-mono text-slate-200 font-bold">K = ${(k * 100).toFixed(1)}% (${k.toFixed(2)})</span>
            </div>
            <div class="font-mono text-slate-400">
              $$K = 1 - \\max(R', G', B') = 1 - \\max(${rPrime.toFixed(2)}, ${gPrime.toFixed(2)}, ${bPrime.toFixed(2)}) = 1 - ${maxPrime.toFixed(2)} = ${k.toFixed(2)}$$
            </div>
          </div>

          <!-- C, M, Y Formulas -->
          <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2">
            <div class="text-slate-300 font-bold">Step 2: Calculate Subtractive Inks (C, M, Y)</div>
            <div class="grid grid-cols-3 gap-2 font-mono text-center">
              <div class="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300">
                <div class="text-[10px] text-slate-400">Cyan (C)</div>
                <div class="text-base font-bold">${(c * 100).toFixed(0)}%</div>
                <div class="text-[9px] text-slate-400 mt-1">$\\frac{1 - ${rPrime.toFixed(2)} - ${k.toFixed(2)}}{1 - ${k.toFixed(2)}}$</div>
              </div>
              <div class="p-2 rounded-lg bg-fuchsia-950/60 border border-fuchsia-800 text-fuchsia-300">
                <div class="text-[10px] text-slate-400">Magenta (M)</div>
                <div class="text-base font-bold">${(m * 100).toFixed(0)}%</div>
                <div class="text-[9px] text-slate-400 mt-1">$\\frac{1 - ${gPrime.toFixed(2)} - ${k.toFixed(2)}}{1 - ${k.toFixed(2)}}$</div>
              </div>
              <div class="p-2 rounded-lg bg-yellow-950/60 border border-yellow-800 text-yellow-300">
                <div class="text-[10px] text-slate-400">Yellow (Y)</div>
                <div class="text-base font-bold">${(y * 100).toFixed(0)}%</div>
                <div class="text-[9px] text-slate-400 mt-1">$\\frac{1 - ${bPrime.toFixed(2)} - ${k.toFixed(2)}}{1 - ${k.toFixed(2)}}$</div>
              </div>
            </div>
          </div>

          <!-- Ink Level Bars -->
          <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 text-xs font-mono">
            <div>
              <div class="flex justify-between text-cyan-400 mb-1">
                <span>Cyan (C)</span>
                <span>${(c * 100).toFixed(1)}%</span>
              </div>
              <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div class="bg-cyan-500 h-full rounded-full transition-all duration-300" style="width: ${c * 100}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-fuchsia-400 mb-1">
                <span>Magenta (M)</span>
                <span>${(m * 100).toFixed(1)}%</span>
              </div>
              <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div class="bg-fuchsia-500 h-full rounded-full transition-all duration-300" style="width: ${m * 100}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-yellow-400 mb-1">
                <span>Yellow (Y)</span>
                <span>${(y * 100).toFixed(1)}%</span>
              </div>
              <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div class="bg-yellow-400 h-full rounded-full transition-all duration-300" style="width: ${y * 100}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-slate-300 mb-1">
                <span>Key / Black (K)</span>
                <span>${(k * 100).toFixed(1)}%</span>
              </div>
              <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div class="bg-slate-400 h-full rounded-full transition-all duration-300" style="width: ${k * 100}%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Sliders
    const sliderR = document.getElementById("cmyk-slider-r");
    const sliderG = document.getElementById("cmyk-slider-g");
    const sliderB = document.getElementById("cmyk-slider-b");
    const resetEx3 = document.getElementById("cmyk-reset-ex3");

    if (sliderR) sliderR.addEventListener("input", (e) => { this.cmykRgb.r = parseInt(e.target.value); this.render(); });
    if (sliderG) sliderG.addEventListener("input", (e) => { this.cmykRgb.g = parseInt(e.target.value); this.render(); });
    if (sliderB) sliderB.addEventListener("input", (e) => { this.cmykRgb.b = parseInt(e.target.value); this.render(); });
    if (resetEx3) resetEx3.addEventListener("click", () => { this.cmykRgb = { r: 51, g: 255, b: 102 }; this.render(); });
  }

  /* ------------------- 3. Pseudo-Color Density Slicing Simulator ------------------- */
  renderSlicingTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="glass-panel p-5 rounded-2xl border border-slate-800">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h4 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Airport Baggage Scanner Simulator (Exercise 5)
              </h4>
              <p class="text-xs text-slate-400 mt-1 khmer-font">
                កាត់កម្រិតដង់ស៊ីតេប្រផេះជា ៣ តំបន់ពណ៌៖ ខៀវ (ដង់ស៊ីតេទាប) | បៃតង (សរីរាង្គ) | ក្រហម (លោហៈ/អាវុធ)
              </p>
            </div>
            
            <div class="flex items-center gap-3">
              <button id="slice-reset-ex5" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 transition">
                Reset Thresholds ($T_1=60, T_2=170$)
              </button>
            </div>
          </div>

          <!-- Threshold Sliders -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <div class="flex justify-between text-cyan-400 font-bold mb-1">
                <span>Threshold 1 (T1: Blue $\\leftrightarrow$ Green): ${this.sliceT1}</span>
                <span>0 to ${this.sliceT1} = Pure Blue</span>
              </div>
              <input type="range" id="slider-t1" min="10" max="150" value="${this.sliceT1}" class="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg" />
            </div>

            <div>
              <div class="flex justify-between text-rose-400 font-bold mb-1">
                <span>Threshold 2 (T2: Green $\\leftrightarrow$ Red): ${this.sliceT2}</span>
                <span>${this.sliceT2} to 255 = Pure Red</span>
              </div>
              <input type="range" id="slider-t2" min="151" max="240" value="${this.sliceT2}" class="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg" />
            </div>
          </div>

          <!-- Interactive Canvases Side-by-Side -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Grayscale Scanner Input -->
            <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center">
              <div class="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                <i data-lucide="scan" class="w-4 h-4 text-slate-400"></i> Original X-Ray Grayscale Scanner
              </div>
              <canvas id="canvas-grayscale-scan" width="280" height="200" class="rounded-lg shadow-inner border border-slate-700 bg-black"></canvas>
              <span class="text-[11px] text-slate-400 mt-2 font-mono">8-bit Grayscale Density $f(x,y) \\in [0, 255]$</span>
            </div>

            <!-- Pseudo-Color Output -->
            <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center">
              <div class="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <i data-lucide="palette" class="w-4 h-4 text-emerald-400"></i> Pseudo-Color Sliced Output
              </div>
              <canvas id="canvas-sliced-scan" width="280" height="200" class="rounded-lg shadow-inner border border-slate-700 bg-black"></canvas>
              <div class="flex items-center gap-3 mt-2 text-[10px] font-mono">
                <span class="flex items-center gap-1 text-sky-400"><span class="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span> Low (0-${this.sliceT1})</span>
                <span class="flex items-center gap-1 text-emerald-400"><span class="w-2.5 h-2.5 rounded bg-green-500 inline-block"></span> Mid (${this.sliceT1+1}-${this.sliceT2})</span>
                <span class="flex items-center gap-1 text-rose-400"><span class="w-2.5 h-2.5 rounded bg-red-600 inline-block"></span> High (${this.sliceT2+1}-255)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.drawScannerSimulation();

    const sliderT1 = document.getElementById("slider-t1");
    const sliderT2 = document.getElementById("slider-t2");
    const resetEx5 = document.getElementById("slice-reset-ex5");

    if (sliderT1) sliderT1.addEventListener("input", (e) => {
      this.sliceT1 = parseInt(e.target.value);
      if (this.sliceT1 >= this.sliceT2) this.sliceT1 = this.sliceT2 - 5;
      this.renderSlicingTab(container);
    });

    if (sliderT2) sliderT2.addEventListener("input", (e) => {
      this.sliceT2 = parseInt(e.target.value);
      if (this.sliceT2 <= this.sliceT1) this.sliceT2 = this.sliceT1 + 5;
      this.renderSlicingTab(container);
    });

    if (resetEx5) resetEx5.addEventListener("click", () => {
      this.sliceT1 = 60;
      this.sliceT2 = 170;
      this.renderSlicingTab(container);
    });
  }

  drawScannerSimulation() {
    const grayCanvas = document.getElementById("canvas-grayscale-scan");
    const sliceCanvas = document.getElementById("canvas-sliced-scan");
    if (!grayCanvas || !sliceCanvas) return;

    const gCtx = grayCanvas.getContext("2d");
    const sCtx = sliceCanvas.getContext("2d");
    const w = grayCanvas.width;
    const h = grayCanvas.height;

    // Generate a synthetic luggage image (bag outline, clothes/liquids, metal gun/knife)
    gCtx.fillStyle = "#1e293b"; // suitcase body (low density ~40)
    gCtx.fillRect(0, 0, w, h);

    // Suitcase border
    gCtx.strokeStyle = "#475569";
    gCtx.lineWidth = 12;
    gCtx.strokeRect(10, 10, w - 20, h - 20);

    // Organic clothes / shampoo bottles (mid density ~110-140)
    gCtx.fillStyle = "#64748b"; // ~100
    gCtx.beginPath();
    gCtx.arc(80, 80, 45, 0, Math.PI * 2);
    gCtx.fill();

    gCtx.fillStyle = "#94a3b8"; // ~150
    gCtx.fillRect(50, 120, 90, 50);

    // High-density metal object (knife / metal shield ~210-240)
    gCtx.fillStyle = "#e2e8f0"; // ~225
    // Draw knife blade
    gCtx.beginPath();
    gCtx.moveTo(170, 60);
    gCtx.lineTo(240, 130);
    gCtx.lineTo(230, 150);
    gCtx.lineTo(160, 80);
    gCtx.closePath();
    gCtx.fill();

    // Metal shield rectangle
    gCtx.fillStyle = "#f8fafc"; // ~250
    gCtx.fillRect(180, 130, 70, 40);

    // Now apply Pseudo-color Density Slicing pixel by pixel
    const imgData = gCtx.getImageData(0, 0, w, h);
    const slicedData = sCtx.createImageData(w, h);
    const src = imgData.data;
    const dst = slicedData.data;

    for (let i = 0; i < src.length; i += 4) {
      const grayVal = src[i]; // Since R=G=B in grayscale
      let r = 0, g = 0, b = 0;

      if (grayVal <= this.sliceT1) {
        // Pure Blue
        r = 0; g = 0; b = 255;
      } else if (grayVal <= this.sliceT2) {
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
  }

  /* ------------------- 4. HSV Histogram Equalization Simulator ------------------- */
  renderEqualizationTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="glass-panel p-5 rounded-2xl border border-slate-800">
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> HSV Value Channel Equalization vs Naive RGB Distortion (Exercise 4)
            </h4>
            <p class="text-xs text-slate-400 mt-1 khmer-font">
              ការប្រៀបធៀបជាក់ស្តែង៖ ហេតុអ្វីបានជាការធ្វើ Histogram Equalization លើឆានែល R, G, B ដាច់ដោយឡែក បណ្តាលឱ្យខូចទ្រង់ទ្រាយពណ៌ (Color Distortion)?
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 1. Original Foggy / Low Contrast Image -->
            <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center">
              <span class="text-xs font-bold text-slate-300 mb-2">1. Low Contrast Input</span>
              <canvas id="canvas-eq-orig" width="220" height="150" class="rounded border border-slate-700 bg-black"></canvas>
              <span class="text-[10px] text-slate-400 mt-2 text-center">រូបភាពដើមស្រអាប់ មាន Contrast ទាប</span>
            </div>

            <!-- 2. Bad Independent RGB Equalization -->
            <div class="p-4 bg-slate-950/80 rounded-xl border border-rose-900/50 bg-rose-950/10 flex flex-col items-center">
              <span class="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> 2. Naive RGB Equalization (Distorted)
              </span>
              <canvas id="canvas-eq-rgb" width="220" height="150" class="rounded border border-rose-800 bg-black"></canvas>
              <span class="text-[10px] text-rose-300 mt-2 text-center khmer-font">❌ ខូចជាតិពណ៌ដើម ដោយសារ R,G,B រីកដោយឯករាជ្យ</span>
            </div>

            <!-- 3. Correct HSV V-Channel Equalization -->
            <div class="p-4 bg-slate-950/80 rounded-xl border border-emerald-900/50 bg-emerald-950/10 flex flex-col items-center">
              <span class="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> 3. HSV V-Channel Equalized (Correct)
              </span>
              <canvas id="canvas-eq-hsv" width="220" height="150" class="rounded border border-emerald-800 bg-black"></canvas>
              <span class="text-[10px] text-emerald-300 mt-2 text-center khmer-font">✅ រក្សាជាតិពណ៌ដើម (Hue & Saturation) 100%</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
            <div class="text-amber-400 font-bold font-sans">OpenCV Core Implementation:</div>
            <pre class="text-emerald-400 overflow-x-auto text-[11px] p-3 bg-slate-950 rounded-lg"><code>hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(hsv)
v_eq = cv2.equalizeHist(v) # Only equalize intensity!
hsv_eq = cv2.merge([h, s, v_eq])
result = cv2.cvtColor(hsv_eq, cv2.COLOR_HSV2BGR)</code></pre>
          </div>
        </div>
      </div>
    `;

    this.drawEqualizationComparison();
  }

  drawEqualizationComparison() {
    const cOrig = document.getElementById("canvas-eq-orig");
    const cRgb = document.getElementById("canvas-eq-rgb");
    const cHsv = document.getElementById("canvas-eq-hsv");
    if (!cOrig || !cRgb || !cHsv) return;

    const ctxOrig = cOrig.getContext("2d");
    const ctxRgb = cRgb.getContext("2d");
    const ctxHsv = cHsv.getContext("2d");
    const w = cOrig.width, h = cOrig.height;

    // Draw low contrast landscape (sunset mountains with foggy haze)
    // Sky
    const skyGrad = ctxOrig.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, "rgb(180, 140, 130)"); // hazy dusk
    skyGrad.addColorStop(1, "rgb(140, 130, 150)");
    ctxOrig.fillStyle = skyGrad;
    ctxOrig.fillRect(0, 0, w, h);

    // Mountains
    ctxOrig.fillStyle = "rgb(100, 90, 110)";
    ctxOrig.beginPath();
    ctxOrig.moveTo(0, h * 0.7);
    ctxOrig.lineTo(w * 0.35, h * 0.45);
    ctxOrig.lineTo(w * 0.7, h * 0.65);
    ctxOrig.lineTo(w, h * 0.4);
    ctxOrig.lineTo(w, h);
    ctxOrig.lineTo(0, h);
    ctxOrig.closePath();
    ctxOrig.fill();

    // Foreground grass hill
    ctxOrig.fillStyle = "rgb(90, 110, 85)";
    ctxOrig.beginPath();
    ctxOrig.ellipse(w * 0.4, h * 0.95, w * 0.6, h * 0.25, 0, 0, Math.PI * 2);
    ctxOrig.fill();

    const origData = ctxOrig.getImageData(0, 0, w, h);
    const rgbData = ctxRgb.createImageData(w, h);
    const hsvData = ctxHsv.createImageData(w, h);

    // Compute independent RGB equalization & HSV equalization
    // For visual simulation:
    // Naive RGB equalization shifts colors toward un-harmonized extremes
    for (let i = 0; i < origData.data.length; i += 4) {
      let r = origData.data[i];
      let g = origData.data[i + 1];
      let b = origData.data[i + 2];

      // Distorted RGB version (boosts individual channels without hue balance)
      rgbData.data[i] = Math.min(255, Math.pow(r / 180, 2.2) * 255);
      rgbData.data[i + 1] = Math.min(255, Math.pow(g / 150, 1.2) * 230);
      rgbData.data[i + 2] = Math.min(255, Math.pow(b / 200, 3.0) * 255);
      rgbData.data[i + 3] = 255;

      // Proper HSV V-Equalization (Contrast boosted while keeping exact hue ratio)
      const maxC = Math.max(r, g, b);
      const factor = maxC === 0 ? 1 : Math.min(255, (maxC - 60) * 2.2) / maxC;
      hsvData.data[i] = Math.min(255, Math.max(0, r * factor));
      hsvData.data[i + 1] = Math.min(255, Math.max(0, g * factor));
      hsvData.data[i + 2] = Math.min(255, Math.max(0, b * factor));
      hsvData.data[i + 3] = 255;
    }

    ctxRgb.putImageData(rgbData, 0, 0);
    ctxHsv.putImageData(hsvData, 0, 0);
  }
}

window.ColorLab = ColorLab;
