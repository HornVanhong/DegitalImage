/**
 * Practice & Exam Quiz Engine
 * Generates randomized Digital Image Processing exam questions based on the PDF exercises.
 * Automatic grading, step-by-step worked solutions, and score tracking.
 */

class QuizEngine {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = {};
    this.isSubmitted = false;
    this.selectedTopic = "all";
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const startBtn = document.getElementById("quiz-start-btn");
    const restartBtn = document.getElementById("quiz-restart-btn");
    const topicFilter = document.getElementById("quiz-topic-filter");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const count = parseInt(document.getElementById("quiz-count-select")?.value || "6");
        const topic = document.getElementById("quiz-topic-filter")?.value || "all";
        this.startQuiz(count, topic);
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        const count = parseInt(document.getElementById("quiz-count-select")?.value || "6");
        const topic = document.getElementById("quiz-topic-filter")?.value || "all";
        this.startQuiz(count, topic);
      });
    }

    if (topicFilter) {
      topicFilter.addEventListener("change", (e) => {
        this.selectedTopic = e.target.value;
      });
    }
  }

  startQuiz(count = 6, topic = "all") {
    this.questions = this.generateQuestions(count, topic);
    this.currentIndex = 0;
    this.userAnswers = {};
    this.isSubmitted = false;
    this.renderQuizView();
  }

  generateQuestions(count, topic) {
    const generators = [
      this.genSpatialBoxQ.bind(this),
      this.genHsiIntensitySatQ.bind(this),
      this.genCmykQ.bind(this),
      this.genLaplacianQ.bind(this),
      this.genDensitySlicingQ.bind(this),
      this.genOpenCvHsvQ.bind(this),
      this.genMorphologyDilationQ.bind(this),
      this.genMorphologyBoundaryQ.bind(this)
    ];

    let filteredGens = generators;
    if (topic === "spatial") {
      filteredGens = [this.genSpatialBoxQ.bind(this), this.genLaplacianQ.bind(this)];
    } else if (topic === "color") {
      filteredGens = [this.genHsiIntensitySatQ.bind(this), this.genCmykQ.bind(this), this.genDensitySlicingQ.bind(this), this.genOpenCvHsvQ.bind(this)];
    } else if (topic === "morphology") {
      filteredGens = [this.genMorphologyDilationQ.bind(this), this.genMorphologyBoundaryQ.bind(this)];
    }

    const list = [];
    for (let i = 0; i < count; i++) {
      const gen = filteredGens[i % filteredGens.length];
      list.push(gen());
    }

    // Shuffle questions
    return list.sort(() => Math.random() - 0.5);
  }

  /* ------------------- Generator Methods ------------------- */
  genSpatialBoxQ() {
    // Random 3x3 matrix
    const m = [
      [Math.floor(Math.random()*50)+10, Math.floor(Math.random()*50)+10, Math.floor(Math.random()*50)+10],
      [Math.floor(Math.random()*50)+10, Math.floor(Math.random()*50)+10, Math.floor(Math.random()*50)+10],
      [Math.floor(Math.random()*50)+10, Math.floor(Math.random()*50)+10, Math.floor(Math.random()*50)+10]
    ];
    const sum = m.flat().reduce((a,b)=>a+b, 0);
    const correctVal = Number((sum / 9).toFixed(2));

    const options = [
      correctVal.toString(),
      (correctVal + 12.5).toFixed(2),
      Math.max(1, (correctVal - 8.33)).toFixed(2),
      (sum / 8).toFixed(2)
    ].sort(() => Math.random() - 0.5);

    return {
      type: "spatial",
      titleEn: "Spatial Box Filter Calculation (Valid Padding)",
      titleKh: "ការគណនា Box Filter (Valid Padding)",
      promptEn: `Given the $3\\times 3$ image segment:
$$I = \\begin{bmatrix} ${m[0][0]} & ${m[0][1]} & ${m[0][2]} \\\\ ${m[1][0]} & ${m[1][1]} & ${m[1][2]} \\\\ ${m[2][0]} & ${m[2][1]} & ${m[2][2]} \\end{bmatrix}$$
Calculate the filtered pixel value at the center position using a $3\\times 3$ Box Filter $H = \\frac{1}{9}\\begin{bmatrix} 1&1&1\\\\1&1&1\\\\1&1&1 \\end{bmatrix}$.`,
      promptKh: `គេឱ្យផ្ទាំង Matrix $3\\times 3$ ដូចខាងលើ។ ចូរគណនាតម្លៃ Pixel ថ្មីនៅចំកណ្តាលដោយប្រើ Box Filter $3\\times 3$ $H = \\frac{1}{9}[1]_{3\\times 3}$។`,
      options,
      correctAnswer: correctVal.toString(),
      solutionEn: `$$\\text{Sum} = ${m[0].join('+')} + ${m[1].join('+')} + ${m[2].join('+')} = ${sum}$$
$$\\text{Result} = \\frac{1}{9} \\times ${sum} = ${correctVal}$$`,
      solutionKh: `បូកធាតុទាំង 9 បញ្ចូលគ្នា៖ $\\text{Sum} = ${sum}$ រួចគុណនឹង $\\frac{1}{9} = ${correctVal}$។`
    };
  }

  genHsiIntensitySatQ() {
    const r = (Math.floor(Math.random() * 5) + 1) * 30; // e.g. 60, 90, 120
    const g = (Math.floor(Math.random() * 5) + 1) * 40;
    const b = (Math.floor(Math.random() * 4) + 1) * 50;
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const sumN = rN + gN + bN;
    const minN = Math.min(rN, gN, bN);
    const sat = Number((1 - (3 / sumN) * minN).toFixed(4));
    const intensity = Math.round((r + g + b) / 3);

    const isSatQuestion = Math.random() > 0.5;

    if (isSatQuestion) {
      const correct = sat.toString();
      const options = [
        correct,
        (Math.max(0.05, sat - 0.15)).toFixed(4),
        (Math.min(0.95, sat + 0.12)).toFixed(4),
        (minN).toFixed(4)
      ].sort(() => Math.random() - 0.5);

      return {
        type: "color",
        titleEn: "HSI Saturation Calculation",
        titleKh: "ការគណនា Saturation ($S$) ក្នុងប្រព័ន្ធ HSI",
        promptEn: `For an RGB pixel with values $R = ${r}, G = ${g}, B = ${b}$, compute the normalized **Saturation component ($S$)** using the standard HSI formula:
$$S = 1 - \\frac{3}{R_{\\text{norm}} + G_{\\text{norm}} + B_{\\text{norm}}}[\\min(R_{\\text{norm}}, G_{\\text{norm}}, B_{\\text{norm}})]$$`,
        promptKh: `សម្រាប់ Pixel ពណ៌ដែលមាន $R = ${r}, G = ${g}, B = ${b}$ ចូរគណនាតម្លៃ Saturation ($S$) ក្នុងប្រព័ន្ធ HSI។`,
        options,
        correctAnswer: correct,
        solutionEn: `1. $R' = \\frac{${r}}{255} \\approx ${rN.toFixed(4)}, G' = \\frac{${g}}{255} \\approx ${gN.toFixed(4)}, B' = \\frac{${b}}{255} \\approx ${bN.toFixed(4)}$
2. $\\min(R',G',B') = ${minN.toFixed(4)}$, $\\text{Sum} = ${sumN.toFixed(4)}$
3. $S = 1 - \\frac{3}{${sumN.toFixed(4)}} \\times ${minN.toFixed(4)} = ${sat}$`,
        solutionKh: `ធ្វើ Normalization លើ R, G, B រួចជំនួសចូលរូបមន្តទទួលបាន $S = ${sat}$ (${(sat*100).toFixed(2)}%)។`
      };
    } else {
      const correct = intensity.toString();
      const options = [
        correct,
        (intensity + 25).toString(),
        Math.max(10, intensity - 30).toString(),
        Math.round((r + b) / 2).toString()
      ].sort(() => Math.random() - 0.5);

      return {
        type: "color",
        titleEn: "HSI Intensity Component (I)",
        titleKh: "ការគណនា Intensity ($I$) ក្នុងប្រព័ន្ធ HSI",
        promptEn: `For an RGB pixel with values $R = ${r}, G = ${g}, B = ${b}$, calculate the **Intensity component ($I$)** on the 8-bit scale:`,
        promptKh: `សម្រាប់ Pixel ពណ៌ដែលមាន $R = ${r}, G = ${g}, B = ${b}$ ចូរគណនាតម្លៃ Intensity ($I$) លើកម្រិត 8-bit៖`,
        options,
        correctAnswer: correct,
        solutionEn: `$$I = \\frac{R + G + B}{3} = \\frac{${r} + ${g} + ${b}}{3} = \\frac{${r+g+b}}{3} = ${intensity}$$`,
        solutionKh: `$$I = \\frac{R + G + B}{3} = \\frac{${r+g+b}}{3} = ${intensity}$$`
      };
    }
  }

  genCmykQ() {
    const r = 51, g = 255, b = 102; // Exercise 3 baseline
    const rP = 0.2, gP = 1.0, bP = 0.4;
    const k = 0.0;
    const c = 0.8;

    const options = [
      "C = 80%, M = 0%, Y = 60%, K = 0%",
      "C = 20%, M = 100%, Y = 40%, K = 0%",
      "C = 60%, M = 0%, Y = 80%, K = 20%",
      "C = 0%, M = 80%, Y = 20%, K = 40%"
    ];

    return {
      type: "color",
      titleEn: "RGB to CMYK Subtractive Color Conversion",
      titleKh: "ការបំប្លែងពណ៌ពី RGB ទៅ CMYK",
      promptEn: `A pixel has $R = 51, G = 255, B = 102$. What are the resulting $(C, M, Y, K)$ values for printing?`,
      promptKh: `Pixel មួយមានតម្លៃ $R = 51, G = 255, B = 102$។ តើតម្លៃ $(C, M, Y, K)$ សម្រាប់បោះពុម្ពស្មើនឹងប៉ុន្មាន?`,
      options,
      correctAnswer: "C = 80%, M = 0%, Y = 60%, K = 0%",
      solutionEn: `1. Normalized: $R' = 0.2, G' = 1.0, B' = 0.4$
2. $K = 1 - \\max(0.2, 1.0, 0.4) = 0$
3. $C = \\frac{1 - 0.2 - 0}{1 - 0} = 0.8$ ($80\\%$)
4. $M = \\frac{1 - 1.0 - 0}{1} = 0.0$ ($0\\%$)
5. $Y = \\frac{1 - 0.4 - 0}{1} = 0.6$ ($60\\%$)`,
      solutionKh: `បំប្លែងទៅជា $[0,1]$ រួចគណនា $K=0, C=0.8 (80\\%), M=0.0 (0\\%), Y=0.6 (60\\%)$។`
    };
  }

  genLaplacianQ() {
    const center = 75;
    const top = 35, bottom = 220, left = 90, right = 185;
    const rawVal = (top + bottom + left + right) - 4 * center; // 530 - 300 = 230

    const options = [
      "230",
      "0 (Clipped)",
      "129",
      "300"
    ];

    return {
      type: "spatial",
      titleEn: "Laplacian Edge Detection Calculation & Clipping",
      titleKh: "ការគណនា Laplacian Edge Filter",
      promptEn: `For a pixel with center value $75$ and 4-neighbors: $\\text{Top}=35, \\text{Bottom}=220, \\text{Left}=90, \\text{Right}=185$, what is the output value after applying the standard Laplacian mask $\\begin{bmatrix} 0&1&0\\\\1&-4&1\\\\0&1&0 \\end{bmatrix}$?`,
      promptKh: `សម្រាប់ Pixel ដែលមានតម្លៃកណ្តាល 75 និងធាតុជុំវិញ លើ=35, ក្រោម=220, ឆ្វេង=90, ស្តាំ=185 តើតម្លៃក្រោយចម្រោះ Laplacian ស្មើប៉ុន្មាន?`,
      options,
      correctAnswer: "230",
      solutionEn: `$$\\text{Value} = (35 + 220 + 90 + 185) - 4(75) = 530 - 300 = 230$$`,
      solutionKh: `$$\\text{Value} = (35 + 220 + 90 + 185) - 4(75) = 530 - 300 = 230$$`
    };
  }

  genDensitySlicingQ() {
    const options = [
      "Low (0-60) -> Blue, Mid (61-170) -> Green, High (171-255) -> Red",
      "Low (0-60) -> Red, Mid (61-170) -> Green, High (171-255) -> Blue",
      "Low (0-60) -> Green, Mid (61-170) -> Blue, High (171-255) -> Red",
      "All pixels are mapped to Grayscale inverted values"
    ];

    return {
      type: "color",
      titleEn: "Pseudo-Color Baggage Scanner Density Mapping",
      titleKh: "ការចាត់ចែងពណ៌ក្នុង Pseudo-Color Density Slicing",
      promptEn: `In the airport baggage scanner exercise (Exercise 5), what is the correct color assignment for density slicing?`,
      promptKh: `ក្នុងលំហាត់ស្កេនឥវ៉ាន់ព្រលានយន្តហោះ (លំហាត់ទី ៥) តើការបែងចែកពណ៌តាមដង់ស៊ីតេមួយណាត្រឹមត្រូវ?`,
      options,
      correctAnswer: "Low (0-60) -> Blue, Mid (61-170) -> Green, High (171-255) -> Red",
      solutionEn: `● Low density (0-60) = Pure Blue (BGR: [255, 0, 0])
● Mid density (61-170) = Pure Green (BGR: [0, 255, 0])
● High density (171-255) = Pure Red (BGR: [0, 0, 255])`,
      solutionKh: `ដង់ស៊ីតេទាប $\\rightarrow$ ខៀវ, សរីរាង្គមធ្យម $\\rightarrow$ បៃតង, លោហៈដង់ស៊ីតេខ្ពស់ $\\rightarrow$ ក្រហម។`
    };
  }

  genOpenCvHsvQ() {
    const options = [
      "Equalize ONLY the V (Value) channel after converting to HSV, then convert back",
      "Equalize R, G, and B channels independently using cv2.equalizeHist()",
      "Convert to Grayscale, equalize, and discard color information",
      "Equalize both H and S channels while leaving V untouched"
    ];

    return {
      type: "color",
      titleEn: "Contrast Enhancement without Color Distortion",
      titleKh: "ការពង្រឹង Contrast ដោយមិនឱ្យខូចជាតិពណ៌ដើម",
      promptEn: `Why is histogram equalization applied specifically to the **V (Value) channel** in HSV space rather than RGB channels independently?`,
      promptKh: `ហេតុអ្វីបានជាគេត្រូវធ្វើ Histogram Equalization តែលើឆានែល V (Value) ក្នុង HSV ជាជាងធ្វើលើ R, G, B ដាច់ដោយឡែកពីគ្នា?`,
      options,
      correctAnswer: "Equalize ONLY the V (Value) channel after converting to HSV, then convert back",
      solutionEn: `Independent equalization of R, G, and B alters the relative ratios between channels, causing severe color shifts (Color Distortion). Equalizing only V boosts intensity while preserving Hue ($H$) and Saturation ($S$).`,
      solutionKh: `ការធ្វើលើ R, G, B ដោយឯករាជ្យធ្វើឱ្យខូចសមាមាត្រពណ៌ដើម។ ធ្វើតែលើ V channel ជួយបង្កើន Contrast ដោយរក្សាជាតិពណ៌ (Hue & Saturation) ឱ្យនៅដដែល។`
    };
  }

  genMorphologyDilationQ() {
    const options = [
      "Internal: A - (A ⊖ B) | External: (A ⊕ B) - A | Gradient: (A ⊕ B) - (A ⊖ B)",
      "Internal: (A ⊕ B) - A | External: A - (A ⊖ B) | Gradient: A ⊕ B",
      "Internal: A ⊖ B | External: A ⊕ B | Gradient: A ∩ B",
      "Internal: A + (A ⊖ B) | External: A - (A ⊕ B) | Gradient: A - B"
    ];

    return {
      type: "morphology",
      titleEn: "Morphological Boundary & Gradient Formulas",
      titleKh: "រូបមន្ត Morphological Boundary & Gradient",
      promptEn: `Which set of mathematical morphology formulas correctly defines Internal Boundary, External Boundary, and Morphological Gradient?`,
      promptKh: `តើរូបមន្តមួយណាត្រឹមត្រូវសម្រាប់ Internal Boundary, External Boundary, និង Morphological Gradient?`,
      options,
      correctAnswer: "Internal: A - (A ⊖ B) | External: (A ⊕ B) - A | Gradient: (A ⊕ B) - (A ⊖ B)",
      solutionEn: `● Internal Boundary: $\\beta_{\\text{int}}(A) = A - (A \\ominus B)$
● External Boundary: $\\beta_{\\text{ext}}(A) = (A \\oplus B) - A$
● Morphological Gradient: $G(A) = (A \\oplus B) - (A \\ominus B)$`,
      solutionKh: `រូបមន្តស្តង់ដារ៖ $\\beta_{\\text{int}} = A - (A \\ominus B)$, $\\beta_{\\text{ext}} = (A \\oplus B) - A$, $G = (A \\oplus B) - (A \\ominus B)$។`
    };
  }

  genMorphologyBoundaryQ() {
    const options = [
      "All zeros (all cells = 0)",
      "Identical to matrix A",
      "Inverted matrix of A",
      "A 3x3 diagonal cross"
    ];

    return {
      type: "morphology",
      titleEn: "Erosion Result when Structuring Element does NOT fit",
      titleKh: "លទ្ធផល Erosion នៅពេលដែល SE មិនអាច Fit ពេញលេញ",
      promptEn: `In Exercise 7, why is the Erosion result $A \\ominus B$ equal to an all-zero matrix?`,
      promptKh: `ក្នុងលំហាត់ទី ៧ ហេតុអ្វីបានជាលទ្ធផល Erosion $A \\ominus B$ ស្មើនឹងសូន្យទាំងអស់?`,
      options,
      correctAnswer: "All zeros (all cells = 0)",
      solutionEn: `Because there is no position in matrix $A$ where all 5 elements of the cross structuring element $B$ simultaneously overlap with 1s. If even a single position touches a 0, the erosion result at that origin becomes 0.`,
      solutionKh: `ដោយសារគ្មានទីតាំងណាដែលមានរាងជាសញ្ញាបូក (1) សុទ្ធនៅក្នុង Matrix A ឡើយ។ ឱ្យតែប៉ះលេខ 0 តែមួយ ផ្ចិតនោះនឹងក្លាយជា 0 ទាំងអស់។`
    };
  }

  /* ------------------- Render Methods ------------------- */
  renderQuizView() {
    const container = document.getElementById("quiz-active-area");
    if (!container) return;

    if (this.questions.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <i data-lucide="help-circle" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
          <p>No questions loaded. Click "Start Practice Exam" above!</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    if (this.isSubmitted) {
      this.renderResults(container);
      return;
    }

    const q = this.questions[this.currentIndex];
    const userAns = this.userAnswers[this.currentIndex];

    container.innerHTML = `
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <!-- Progress Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono font-bold">
              Question ${this.currentIndex + 1} / ${this.questions.length}
            </span>
            <span class="text-xs text-slate-400 uppercase tracking-wider font-semibold">${q.type}</span>
          </div>

          <div class="flex items-center gap-1.5">
            ${this.questions.map((_, i) => `
              <button data-q-nav="${i}" class="w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                i === this.currentIndex 
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' 
                  : this.userAnswers[i] !== undefined 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }">
                ${i + 1}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Question Prompt -->
        <div class="space-y-3">
          <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            ${q.titleEn}
          </h3>
          <p class="text-xs text-indigo-300 khmer-font font-medium">${q.titleKh}</p>
          
          <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
            <div>${q.promptEn}</div>
            <div class="mt-2 text-xs text-slate-400 khmer-font border-t border-slate-800/80 pt-2">${q.promptKh}</div>
          </div>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Select the correct answer:</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${q.options.map((opt, optIdx) => {
              const isSelected = userAns === opt;
              return `
                <button data-opt-val="${encodeURIComponent(opt)}" class="quiz-opt-btn p-3.5 rounded-xl text-left text-xs font-mono transition flex items-start gap-3 border ${
                  isSelected 
                    ? 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/90'
                }">
                  <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}">
                    ${String.fromCharCode(65 + optIdx)}
                  </span>
                  <span class="break-words leading-relaxed">${opt}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Controls -->
        <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button id="quiz-prev-btn" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition ${this.currentIndex === 0 ? 'opacity-40 pointer-events-none' : ''}">
            ← Previous
          </button>

          ${this.currentIndex === this.questions.length - 1 ? `
            <button id="quiz-submit-btn" class="px-6 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition">
              Submit Exam & View Solutions ✓
            </button>
          ` : `
            <button id="quiz-next-btn" class="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition">
              Next Question →
            </button>
          `}
        </div>
      </div>
    `;

    this.bindQuizNavEvents();

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

  bindQuizNavEvents() {
    document.querySelectorAll(".quiz-opt-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const val = decodeURIComponent(e.currentTarget.getAttribute("data-opt-val"));
        this.userAnswers[this.currentIndex] = val;
        this.renderQuizView();
      });
    });

    document.querySelectorAll("[data-q-nav]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-q-nav"));
        this.currentIndex = idx;
        this.renderQuizView();
      });
    });

    const prevBtn = document.getElementById("quiz-prev-btn");
    const nextBtn = document.getElementById("quiz-next-btn");
    const submitBtn = document.getElementById("quiz-submit-btn");

    if (prevBtn) prevBtn.addEventListener("click", () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.renderQuizView();
      }
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.renderQuizView();
      }
    });

    if (submitBtn) submitBtn.addEventListener("click", () => {
      this.isSubmitted = true;
      this.renderQuizView();
      if (window.confetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  }

  renderResults(container) {
    let correctCount = 0;
    this.questions.forEach((q, i) => {
      if (this.userAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = this.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    let gradeBadge = { text: "Mastery Level: Excellent!", color: "emerald", icon: "award" };
    if (percentage < 50) gradeBadge = { text: "Needs Review - Keep Practicing!", color: "rose", icon: "alert-circle" };
    else if (percentage < 80) gradeBadge = { text: "Good Job - Almost Perfect!", color: "amber", icon: "thumbs-up" };

    container.innerHTML = `
      <div class="space-y-8">
        <!-- Score Banner -->
        <div class="glass-panel p-8 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>
          
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${gradeBadge.color}-950 text-${gradeBadge.color}-300 border border-${gradeBadge.color}-800 mb-3">
            <i data-lucide="${gradeBadge.icon}" class="w-3.5 h-3.5"></i> ${gradeBadge.text}
          </span>

          <h2 class="text-4xl font-extrabold text-white mb-2">
            ${correctCount} / ${total} Correct (${percentage}%)
          </h2>
          <p class="text-sm text-slate-400 khmer-font">
            សូមពិនិត្យមើលដំណោះស្រាយលម្អិតមួយជំហានៗនៅខាងក្រោម ដើម្បីពង្រឹងចំណេះដឹងរបស់អ្នក។
          </p>

          <div class="mt-6 flex justify-center gap-3">
            <button id="quiz-retry-btn" class="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition flex items-center gap-2">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Generate New Exam
            </button>
          </div>
        </div>

        <!-- Detailed Solutions List -->
        <div class="space-y-6">
          <h3 class="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="check-square" class="w-4 h-4 text-emerald-400"></i> Step-by-Step Question Review & Solutions
          </h3>

          ${this.questions.map((q, idx) => {
            const userAns = this.userAnswers[idx];
            const isCorrect = userAns === q.correctAnswer;
            return `
              <div class="glass-panel p-5 rounded-2xl border ${isCorrect ? 'border-emerald-800/80 bg-emerald-950/10' : 'border-rose-800/80 bg-rose-950/10'} space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold font-mono px-2.5 py-1 rounded ${isCorrect ? 'bg-emerald-900/80 text-emerald-200' : 'bg-rose-900/80 text-rose-200'}">
                    Q${idx + 1}: ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                  <span class="text-xs text-slate-400 font-semibold uppercase">${q.type}</span>
                </div>

                <div>
                  <h4 class="text-sm font-bold text-slate-100">${q.titleEn}</h4>
                  <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 mt-2">
                    ${q.promptEn}
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div class="p-3 rounded-xl border ${isCorrect ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-rose-950/40 border-rose-800 text-rose-300'}">
                    <span class="text-[10px] text-slate-400 block font-sans">Your Answer:</span>
                    <strong>${userAns || 'No Answer Selected'}</strong>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
                    <span class="text-[10px] text-slate-400 block font-sans">Correct Answer:</span>
                    <strong>${q.correctAnswer}</strong>
                  </div>
                </div>

                <!-- Step Solution -->
                <div class="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div class="text-amber-400 font-bold font-sans flex items-center gap-1.5">
                    <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i> Worked Solution & Explanation:
                  </div>
                  <div class="text-slate-300 font-mono leading-relaxed">${q.solutionEn}</div>
                  <div class="text-slate-400 khmer-font border-t border-slate-800 pt-2 text-[11px]">${q.solutionKh}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const retryBtn = document.getElementById("quiz-retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        const count = parseInt(document.getElementById("quiz-count-select")?.value || "6");
        const topic = document.getElementById("quiz-topic-filter")?.value || "all";
        this.startQuiz(count, topic);
      });
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
}

window.QuizEngine = QuizEngine;
