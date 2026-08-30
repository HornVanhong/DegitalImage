/**
 * Main Application Controller for Digital Image Processing Platform
 */

document.addEventListener("DOMContentLoaded", () => {
  // App state
  const state = {
    currentTab: "overview",
    language: "kh", // default bilingual with Khmer emphasis
    selectedExerciseId: 1,
    filterTopic: "all",
    searchQuery: ""
  };

  // Instantiate Sub-modules
  const spatialLab = new window.SpatialFilterLab();
  const colorLab = new window.ColorLab();
  const morphologyLab = new window.MorphologyLab();
  const quizEngine = new window.QuizEngine();

  // Navigation Tabs
  const navTabs = [
    { id: "overview", labelEn: "Overview & Cheatsheet", labelKh: "ទិដ្ឋភាពទូទៅ & រូបមន្ត", icon: "book-open" },
    { id: "exercises", labelEn: "Worked Solutions (8 Exercises)", labelKh: "ដំណោះស្រាយលំហាត់ទាំង ៨", icon: "layers" },
    { id: "labs", labelEn: "Interactive Simulation Lab", labelKh: "បន្ទប់ពិសោធន៍អនុវត្តជាក់ស្តែង", icon: "flask-conical" },
    { id: "exam", labelEn: "Exam Prep & Practice Quiz", labelKh: "ប្រឡងសាកល្បង & លំហាត់អនុវត្ត", icon: "graduation-cap" },
    { id: "python", labelEn: "Python & OpenCV Hub", labelKh: "មជ្ឈមណ្ឌលកូដ Python & OpenCV", icon: "code-2" }
  ];

  // Initialize UI
  function init() {
    bindGlobalEvents();
    renderNavigation();
    renderActiveTab();
  }

  function bindGlobalEvents() {
    // Language Toggle
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        state.language = state.language === "en" ? "kh" : "en";
        langBtn.innerHTML = `
          <i data-lucide="globe" class="w-4 h-4 mr-1.5 inline"></i>
          <span>${state.language === "en" ? "English" : "ភាសាខ្មែរ (Khmer)"}</span>
        `;
        renderActiveTab();
        if (window.lucide) lucide.createIcons();
      });
    }
  }

  function renderNavigation() {
    const navContainer = document.getElementById("main-nav-tabs");
    if (!navContainer) return;

    navContainer.innerHTML = navTabs.map(tab => `
      <button data-tab-id="${tab.id}" class="tab-btn px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm flex items-center gap-2 border border-transparent transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 ${state.currentTab === tab.id ? 'active' : ''}">
        <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
        <span>${state.language === 'en' ? tab.labelEn : tab.labelKh}</span>
      </button>
    `).join('');

    navContainer.querySelectorAll("[data-tab-id]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.getAttribute("data-tab-id");
        state.currentTab = tabId;
        renderNavigation();
        renderActiveTab();
      });
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderActiveTab() {
    const mainContent = document.getElementById("main-tab-content");
    if (!mainContent) return;

    if (state.currentTab === "overview") {
      renderOverviewTab(mainContent);
    } else if (state.currentTab === "exercises") {
      renderExercisesTab(mainContent);
    } else if (state.currentTab === "labs") {
      renderLabsTab(mainContent);
    } else if (state.currentTab === "exam") {
      renderExamTab(mainContent);
    } else if (state.currentTab === "python") {
      renderPythonTab(mainContent);
    }

    if (window.renderMathInElement) {
      renderMathInElement(mainContent, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  /* ------------------- 1. OVERVIEW TAB ------------------- */
  function renderOverviewTab(container) {
    const isKh = state.language === "kh";

    container.innerHTML = `
      <div class="space-y-8">
        <!-- Hero Header -->
        <div class="relative overflow-hidden glass-panel p-8 md:p-10 rounded-3xl border border-indigo-900/50 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              Digital Image Processing Course & Exam Prep Hub
            </div>
            
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ${isKh ? 'មជ្ឈមណ្ឌលសិក្សា & អនុវត្ត Digital Image Processing' : 'Master Digital Image Processing with Interactive Labs'}
            </h1>
            
            <p class="text-sm md:text-base text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}">
              ${isKh 
                ? 'វេទិកាអន្តរកម្មពេញលេញសម្រាប់សិក្សាលំហាត់ និងដំណោះស្រាយកម្រិតខ្ពស់ (Spatial Filtering, HSI/HSV/CMYK Models, Pseudo-color Density Slicing, Edge Detection និង Mathematical Morphology) ស្របតាមឯកសារមេរៀន និងត្រៀមប្រឡង។'
                : 'A comprehensive interactive platform covering step-by-step worked solutions, real-time matrix sandboxes, formula derivations, and self-assessment quizzes based on the Digital Image Processing curriculum.'}
            </p>

            <div class="pt-4 flex flex-wrap items-center gap-3">
              <button id="hero-goto-exercises" class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4"></i>
                <span>${isKh ? 'មើលដំណោះស្រាយទាំង ៨ លំហាត់' : 'Explore 8 Worked Exercises'}</span>
              </button>
              <button id="hero-goto-labs" class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2">
                <i data-lucide="flask-conical" class="w-4 h-4"></i>
                <span>${isKh ? 'បើកបន្ទប់ពិសោធន៍ Simulation' : 'Launch Interactive Labs'}</span>
              </button>
              <button id="hero-goto-exam" class="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition flex items-center gap-2">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
                <span>${isKh ? 'ប្រឡងសាកល្បង Quiz' : 'Take Practice Exam'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Major Topic Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Topic 1 -->
          <div class="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <i data-lucide="grid" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-bold text-slate-100 mb-1">Spatial Filtering</h3>
              <p class="text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'Box filter smoothing, Valid padding vs Zero-padding, និង 2D matrix convolution។' : 'Box filter smoothing, Valid vs Zero padding boundary handling, and 2D convolution.'}
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-indigo-400 font-medium">
              Exercises 1 & 6 →
            </div>
          </div>

          <!-- Topic 2 -->
          <div class="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <i data-lucide="palette" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-bold text-slate-100 mb-1">Color Spaces & CMYK</h3>
              <p class="text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'ការគណនា HSI Intensity & Saturation, និងការបំប្លែង RGB ទៅជា CMYK Subtractive model។' : 'HSI intensity & saturation normalization, and RGB to CMYK subtractive conversion formulas.'}
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-emerald-400 font-medium">
              Exercises 2 & 3 →
            </div>
          </div>

          <!-- Topic 3 -->
          <div class="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                <i data-lucide="sliders" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-bold text-slate-100 mb-1">Enhancement & Slicing</h3>
              <p class="text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'HSV V-channel equalization (cv2.equalizeHist) និង Pseudo-color density slicing ដោយប្រើ NumPy masks។' : 'HSV V-channel histogram equalization & Pseudo-color density slicing with NumPy masks.'}
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-rose-400 font-medium">
              Exercises 4 & 5 →
            </div>
          </div>

          <!-- Topic 4 -->
          <div class="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <i data-lucide="binary" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-bold text-slate-100 mb-1">Mathematical Morphology</h3>
              <p class="text-xs text-slate-400 leading-relaxed ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'Dilation (⊕), Erosion (⊖), Internal/External boundaries (βint, βext) និង Morphological Gradient។' : 'Dilation (⊕), Erosion (⊖), Internal/External boundaries, and morphological gradient.'}
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-cyan-400 font-medium">
              Exercises 7 & 8 →
            </div>
          </div>
        </div>

        <!-- Comprehensive Formula Quick Reference Sheet -->
        <div class="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <i data-lucide="sigma" class="w-5 h-5 text-indigo-400"></i>
                <span>${isKh ? 'តារាងសង្ខេបរូបមន្តសំខាន់ៗសម្រាប់ប្រឡង (Formula Cheatsheet)' : 'Essential Exam Formulas Cheatsheet'}</span>
              </h2>
              <p class="text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'រូបមន្តគន្លឹះទាំងអស់ដែលត្រូវបានប្រើប្រាស់ក្នុងលំហាត់ទាំង ៨' : 'Quick reference of all core mathematical formulas across the 8 exercises.'}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <!-- Formula 1: HSI Intensity & Saturation -->
            <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-emerald-400 block">1. HSI Color Model</span>
              <div class="font-mono text-slate-300">
                $$I = \\frac{R + G + B}{3}$$
                $$S = 1 - \\frac{3}{R + G + B}[\\min(R, G, B)]$$
              </div>
              <p class="text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'ចំណាំ៖ ត្រូវ Normalize $R, G, B$ ទៅក្នុងចន្លោះ $[0, 1]$ ដោយចែកនឹង 255 ជាមុនសិន។' : 'Note: Values must be normalized to $[0, 1]$ by dividing by 255.'}
              </p>
            </div>

            <!-- Formula 2: CMYK Subtractive -->
            <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-amber-400 block">2. CMYK Subtractive Model</span>
              <div class="font-mono text-slate-300">
                $$K = 1 - \\max(R', G', B')$$
                $$C = \\frac{1 - R' - K}{1 - K}, \\quad M = \\frac{1 - G' - K}{1 - K}$$
                $$Y = \\frac{1 - B' - K}{1 - K}$$
              </div>
              <p class="text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? '$R\', G\', B\'$ គឺជាតម្លៃ Normalized ក្នុងចន្លោះ $[0, 1]$។' : '$R\', G\', B\'$ are RGB components in the normalized range $[0, 1]$.'}
              </p>
            </div>

            <!-- Formula 3: Laplacian Edge Detection -->
            <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-indigo-400 block">3. Laplacian Filter (2nd Derivative)</span>
              <div class="font-mono text-slate-300">
                $$H = \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & -4 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}$$
                $$\\nabla^2 f = (N + S + W + E) - 4 \\times C$$
              </div>
              <p class="text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'ប្រសិនបើតម្លៃចេញមកអវិជ្ជមាន (< 0) ត្រូវកាត់ស្មើ 0 (Clipping [0, 255])។' : 'Negative values must be clipped to 0 (Range $[0, 255]$).'}
              </p>
            </div>

            <!-- Formula 4: Morphology Boundary -->
            <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-cyan-400 block">4. Internal & External Boundaries</span>
              <div class="font-mono text-slate-300">
                $$\\beta_{\\text{int}}(A) = A - (A \\ominus B)$$
                $$\\beta_{\\text{ext}}(A) = (A \\oplus B) - A$$
              </div>
              <p class="text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'Internal: យក A ដក Erosion | External: យក Dilation ដក A។' : 'Internal takes boundary from inside object; External from outside shell.'}
              </p>
            </div>

            <!-- Formula 5: Morphological Gradient -->
            <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-purple-400 block">5. Morphological Gradient</span>
              <div class="font-mono text-slate-300">
                $$G(A) = (A \\oplus B) - (A \\ominus B)$$
              </div>
              <p class="text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'វាស់វែងគម្លាតរវាងការរីក និងការរួម ដើម្បីទាញយកខ្សែបន្ទាត់គែមរួម។' : 'Measures the difference between dilation and erosion to highlight total edge thickness.'}
              </p>
            </div>

            <!-- Formula 6: Box Filter Averaging -->
            <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-rose-400 block">6. Box Filter Smoothing (3x3)</span>
              <div class="font-mono text-slate-300">
                $$H = \\frac{1}{9}\\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{bmatrix}$$
                $$g(x,y) = \\frac{1}{9}\\sum_{s=-1}^1 \\sum_{t=-1}^1 f(x+s, y+t)$$
              </div>
              <p class="text-[11px] text-slate-400 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'បូកតម្លៃជុំវិញទាំង 9 រួចចែកនឹង 9 ដើម្បីបន្ទន់កម្រិតពណ៌។' : 'Sums 9 neighboring pixel values and divides by 9 for spatial averaging.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Quick Navigation Buttons
    const btnEx = document.getElementById("hero-goto-exercises");
    const btnLab = document.getElementById("hero-goto-labs");
    const btnExam = document.getElementById("hero-goto-exam");

    if (btnEx) btnEx.addEventListener("click", () => { state.currentTab = "exercises"; renderNavigation(); renderActiveTab(); });
    if (btnLab) btnLab.addEventListener("click", () => { state.currentTab = "labs"; renderNavigation(); renderActiveTab(); });
    if (btnExam) btnExam.addEventListener("click", () => { state.currentTab = "exam"; renderNavigation(); renderActiveTab(); });
  }

  /* ------------------- 2. EXERCISES TAB ------------------- */
  function renderExercisesTab(container) {
    const isKh = state.language === "kh";
    const exercises = window.EXERCISES_DATA;
    const activeEx = exercises.find(e => e.id === state.selectedExerciseId) || exercises[0];

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Sidebar Navigation List -->
        <div class="lg:col-span-4 space-y-3">
          <div class="glass-panel p-4 rounded-2xl border border-slate-800">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              ${isKh ? 'បញ្ជីលំហាត់ទាំង ៨ (Exercises List)' : 'Course Exercises (1 to 8)'}
            </h3>

            <div class="space-y-2">
              ${exercises.map(ex => {
                const isSelected = ex.id === activeEx.id;
                return `
                  <button data-ex-id="${ex.id}" class="w-full text-left p-3 rounded-xl transition flex items-start gap-3 border ${
                    isSelected 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30' 
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }">
                    <span class="w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}">
                      ${ex.id}
                    </span>
                    <div class="min-w-0">
                      <div class="text-xs font-bold truncate">${isKh ? ex.titleKh : ex.titleEn}</div>
                      <span class="text-[10px] text-slate-400 font-mono">${ex.topic}</span>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs space-y-2">
            <span class="text-slate-400 font-bold block">${isKh ? 'សកម្មភាពរហ័ស' : 'Interactive Playground'}</span>
            <button id="ex-open-lab-btn" class="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition flex items-center justify-center gap-2">
              <i data-lucide="flask-conical" class="w-4 h-4"></i>
              <span>${isKh ? 'បើកពិសោធន៍ក្នុង Lab' : 'Open in Interactive Lab'}</span>
            </button>
          </div>
        </div>

        <!-- Main Exercise Detail View -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Exercise Header Card -->
          <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                ${activeEx.topic}
              </span>
              <span class="text-xs font-mono text-slate-400">Difficulty: ${activeEx.difficulty}</span>
            </div>

            <h2 class="text-2xl font-extrabold text-white">
              ${isKh ? activeEx.titleKh : activeEx.titleEn}
            </h2>

            <!-- Problem Statement -->
            <div class="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed space-y-3">
              <div class="font-bold text-amber-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <i data-lucide="help-circle" class="w-4 h-4"></i> Problem Statement (ប្រធានលំហាត់):
              </div>
              <div class="font-sans">${isKh ? activeEx.problemKh : activeEx.problemEn}</div>
            </div>
          </div>

          <!-- Step-by-Step Questions / Worked Solutions -->
          ${activeEx.questions ? activeEx.questions.map(q => `
            <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                  ${q.qNum}
                </span>
                <h3 class="text-base font-bold text-slate-100">
                  ${isKh ? q.titleKh : q.titleEn}
                </h3>
              </div>

              ${q.explanationKh ? `
                <div class="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-900/50 text-xs text-indigo-200 leading-relaxed ${isKh ? 'khmer-font' : ''}">
                  ${q.explanationKh}
                </div>
              ` : ''}

              <!-- Steps Breakdown -->
              ${q.steps ? `
                <div class="space-y-3">
                  <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ${isKh ? 'ដំណាក់កាលគណនាលម្អិត៖' : 'Step-by-step Arithmetic:'}
                  </div>
                  ${q.steps.map(s => `
                    <div class="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
                      <div class="text-slate-300 font-bold ${isKh ? 'khmer-font' : ''}">
                        ${isKh ? s.stepKh : s.stepEn}
                      </div>
                      <div class="font-mono text-slate-200 overflow-x-auto">
                        $$${s.math}$$
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Final Answer Banner -->
              <div class="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/80 text-xs text-emerald-300 font-medium ${isKh ? 'khmer-font' : ''}">
                ${isKh ? q.finalAnswerKh : q.finalAnswerEn}
              </div>
            </div>
          `).join('') : ''}

          <!-- Code Snippet View (For Code-based Exercises 4 & 5) -->
          ${activeEx.codeSnippet ? `
            <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <i data-lucide="code-2" class="w-5 h-5"></i>
                  <span>${isKh ? 'កូដ Python & OpenCV ពេញលេញ' : 'Complete Python & OpenCV Solution'}</span>
                </h3>
                <button id="copy-code-btn" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 font-mono">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy Script
                </button>
              </div>

              <pre class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed"><code>${activeEx.codeSnippet}</code></pre>

              ${activeEx.keyConceptsKh ? `
                <div class="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span class="text-amber-400 font-bold block ${isKh ? 'khmer-font' : ''}">${isKh ? 'ការពន្យល់ពីបច្ចេកទេសក្នុងកូដ៖' : 'Key Code Concepts:'}</span>
                  <ul class="list-disc list-inside space-y-1.5 text-slate-300 ${isKh ? 'khmer-font' : ''}">
                    ${activeEx.keyConceptsKh.map(c => `<li>${c}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Bind sidebar clicks
    document.querySelectorAll("[data-ex-id]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        state.selectedExerciseId = parseInt(e.currentTarget.getAttribute("data-ex-id"));
        renderExercisesTab(container);
      });
    });

    const openLabBtn = document.getElementById("ex-open-lab-btn");
    if (openLabBtn) {
      openLabBtn.addEventListener("click", () => {
        state.currentTab = "labs";
        renderNavigation();
        renderActiveTab();
      });
    }

    const copyBtn = document.getElementById("copy-code-btn");
    if (copyBtn && activeEx.codeSnippet) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(activeEx.codeSnippet);
        copyBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Copied!`;
        setTimeout(() => {
          copyBtn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy Script`;
          if (window.lucide) lucide.createIcons();
        }, 2000);
      });
    }
  }

  /* ------------------- 3. INTERACTIVE LABS TAB ------------------- */
  function renderLabsTab(container) {
    const isKh = state.language === "kh";

    container.innerHTML = `
      <div class="space-y-8">
        <!-- Lab Subheader & Switcher -->
        <div class="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <i data-lucide="flask-conical" class="w-5 h-5 text-indigo-400"></i>
              <span>${isKh ? 'បន្ទប់ពិសោធន៍ Simulation អន្តរកម្ម' : 'Interactive Image Processing Simulation Lab'}</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}">
              ${isKh ? 'ជ្រើសរើសផ្នែកពិសោធន៍ដើម្បីតេស្តម៉ាទ្រីស កម្រិតពណ៌ និងទម្រង់ Morphology ដោយផ្ទាល់។' : 'Select a simulation module to experiment with spatial filtering, color models, and morphology.'}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button id="lab-tab-spatial" class="lab-main-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              Spatial Filter Lab
            </button>
            <button id="lab-tab-color" class="lab-main-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-800 text-slate-300 hover:bg-slate-700">
              Color & Slicing Lab
            </button>
            <button id="lab-tab-morph" class="lab-main-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-800 text-slate-300 hover:bg-slate-700">
              Morphology Lab
            </button>
          </div>
        </div>

        <!-- 1. Spatial Filter Lab Section -->
        <div id="spatial-lab-section" class="space-y-6">
          <div class="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold">Preset Matrix:</span>
              <select id="spatial-preset-select" class="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="ex6">Exercise 6 Matrix (4x4)</option>
                <option value="ex1">Exercise 1 Matrix (3x3)</option>
                <option value="custom">Custom Matrix (4x4)</option>
              </select>
              <button id="spatial-random-btn" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                Randomize
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold">Kernel:</span>
              <select id="spatial-kernel-select" class="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="box3x3">Box Filter 3x3 (1/9)</option>
                <option value="laplacian4">Laplacian 4-neighbor (Edge)</option>
                <option value="laplacian8">Laplacian 8-neighbor</option>
                <option value="gaussian3x3">Gaussian Smoothing 3x3</option>
                <option value="sobelX">Sobel Horizontal (Gx)</option>
                <option value="sobelY">Sobel Vertical (Gy)</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold">Padding:</span>
              <select id="spatial-padding-select" class="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="valid">Valid (No Padding)</option>
                <option value="zero">Zero-Padding (Boundary=0)</option>
                <option value="replicate">Replicate Border</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button id="spatial-play-btn" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1">
                <i data-lucide="play" class="w-3.5 h-3.5"></i> Auto Play
              </button>
            </div>
          </div>

          <div id="spatial-lab-content"></div>
        </div>

        <!-- 2. Color & Slicing Lab Section (Hidden by default) -->
        <div id="color-lab-section" class="space-y-6 hidden">
          <div class="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-bold">
            <button data-color-tab="hsi" class="color-subtab-btn px-4 py-2 rounded-xl bg-indigo-600 text-white transition active">
              1. RGB ↔ HSI / HSV Calculator
            </button>
            <button data-color-tab="cmyk" class="color-subtab-btn px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
              2. RGB ↔ CMYK Subtractive Inks
            </button>
            <button data-color-tab="slicing" class="color-subtab-btn px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
              3. Airport Scanner Density Slicing
            </button>
            <button data-color-tab="equalization" class="color-subtab-btn px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
              4. HSV V-Equalization vs RGB Distortion
            </button>
          </div>

          <div id="color-lab-content"></div>
        </div>

        <!-- 3. Morphology Lab Section (Hidden by default) -->
        <div id="morph-lab-section" class="space-y-6 hidden">
          <div class="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold">Preset Image A:</span>
              <select id="morph-preset-select" class="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="ex7">Exercise 7 Binary Image (5x5)</option>
                <option value="ex8">Exercise 8 Binary Image (4x5)</option>
                <option value="custom">Custom Plus Shape (5x5)</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-bold">Structuring Element (SE):</span>
              <select id="morph-se-select" class="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="cross3x3">3x3 Cross (Ex 7, Center Origin)</option>
                <option value="asym2x2">2x2 Asymmetric (Ex 8, Top-Left Origin)</option>
                <option value="box3x3">3x3 Box / Square</option>
                <option value="horizontal3">1x3 Horizontal Line</option>
              </select>
            </div>
          </div>

          <div id="morphology-lab-content"></div>
        </div>
      </div>
    `;

    // Lab Switcher Buttons
    const tabSpatial = document.getElementById("lab-tab-spatial");
    const tabColor = document.getElementById("lab-tab-color");
    const tabMorph = document.getElementById("lab-tab-morph");
    const secSpatial = document.getElementById("spatial-lab-section");
    const secColor = document.getElementById("color-lab-section");
    const secMorph = document.getElementById("morph-lab-section");

    const switchLabTab = (activeTab, activeSec, allTabs, allSecs) => {
      allTabs.forEach(t => t.classList.remove("bg-indigo-600", "text-white", "shadow-lg", "shadow-indigo-500/20"));
      allTabs.forEach(t => t.classList.add("bg-slate-800", "text-slate-300"));
      activeTab.classList.remove("bg-slate-800", "text-slate-300");
      activeTab.classList.add("bg-indigo-600", "text-white", "shadow-lg", "shadow-indigo-500/20");

      allSecs.forEach(s => s.classList.add("hidden"));
      activeSec.classList.remove("hidden");
    };

    if (tabSpatial) {
      tabSpatial.addEventListener("click", () => {
        switchLabTab(tabSpatial, secSpatial, [tabSpatial, tabColor, tabMorph], [secSpatial, secColor, secMorph]);
        spatialLab.render();
      });
    }
    if (tabColor) {
      tabColor.addEventListener("click", () => {
        switchLabTab(tabColor, secColor, [tabSpatial, tabColor, tabMorph], [secSpatial, secColor, secMorph]);
        colorLab.render();
      });
    }
    if (tabMorph) {
      tabMorph.addEventListener("click", () => {
        switchLabTab(tabMorph, secMorph, [tabSpatial, tabColor, tabMorph], [secSpatial, secColor, secMorph]);
        morphologyLab.render();
      });
    }

    spatialLab.init();
    colorLab.init();
    morphologyLab.init();
  }

  /* ------------------- 4. EXAM PREP & QUIZ TAB ------------------- */
  function renderExamTab(container) {
    const isKh = state.language === "kh";

    container.innerHTML = `
      <div class="space-y-8 max-w-4xl mx-auto">
        <!-- Exam Generator Control Banner -->
        <div class="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
                <i data-lucide="graduation-cap" class="w-3.5 h-3.5"></i> Self-Assessment & Exam Simulator
              </div>
              <h2 class="text-2xl font-extrabold text-white">
                ${isKh ? 'ប្រឡងសាកល្បង & លំហាត់អនុវត្ត (Exam Practice)' : 'Interactive Digital Image Processing Practice Exam'}
              </h2>
              <p class="text-xs text-slate-400 mt-1 ${isKh ? 'khmer-font' : ''}">
                ${isKh ? 'បង្កើតសំណួរប្រឡងចៃដន្យដោយផ្អែកលើមេរៀនទាំង ៨ ជាមួយនឹងការកែពិន្ទុភ្លាមៗ និងបង្ហាញដំណោះស្រាយលម្អិត។' : 'Generate randomized exam problems based on all 8 exercise templates with auto-grading.'}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button id="quiz-start-btn" class="px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition flex items-center gap-2">
                <i data-lucide="play" class="w-4 h-4"></i>
                <span>${isKh ? 'ចាប់ផ្តើមប្រឡងថ្មី' : 'Start Practice Exam'}</span>
              </button>
            </div>
          </div>

          <!-- Configuration Controls -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <label class="text-slate-300 font-bold block mb-1.5">Topic Focus:</label>
              <select id="quiz-topic-filter" class="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="all">All Topics (Comprehensive Full Exam)</option>
                <option value="spatial">Spatial Filtering & Edge Detection Only</option>
                <option value="color">Color Models (HSI/HSV/CMYK) & Slicing Only</option>
                <option value="morphology">Mathematical Morphology Only</option>
              </select>
            </div>

            <div>
              <label class="text-slate-300 font-bold block mb-1.5">Number of Questions:</label>
              <select id="quiz-count-select" class="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="6">6 Questions (Quick Quiz - ~8 mins)</option>
                <option value="8">8 Questions (Standard Exam - ~12 mins)</option>
                <option value="12">12 Questions (Deep Mastery - ~18 mins)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Active Quiz Container -->
        <div id="quiz-active-area">
          <div class="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <i data-lucide="sparkles" class="w-8 h-8"></i>
            </div>
            <h3 class="text-lg font-bold text-white">Ready to test your Image Processing skills?</h3>
            <p class="text-xs text-slate-400 max-w-md mx-auto ${isKh ? 'khmer-font' : ''}">
              ${isKh ? 'ចុចប៊ូតុង "ចាប់ផ្តើមប្រឡងថ្មី" ខាងលើ ដើម្បីបង្កើតសំណួរប្រឡងចៃដន្យ។' : 'Click "Start Practice Exam" above to generate a new custom test set with instant feedback.'}
            </p>
          </div>
        </div>
      </div>
    `;

    quizEngine.init();
  }

  /* ------------------- 5. PYTHON & OPENCV TAB ------------------- */
  function renderPythonTab(container) {
    const isKh = state.language === "kh";

    container.innerHTML = `
      <div class="space-y-8 max-w-5xl mx-auto">
        <div class="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <i data-lucide="code-2" class="w-3.5 h-3.5"></i> OpenCV & NumPy Python Hub
          </div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-white">
            ${isKh ? 'មជ្ឈមណ្ឌលកូដ Python & OpenCV សម្រាប់ Image Processing' : 'Python & OpenCV Implementation Reference'}
          </h2>
          <p class="text-xs md:text-sm text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}">
            ${isKh ? 'បណ្តុំកូដ Python ពេញលេញ និងការពន្យល់បច្ចេកទេសសម្រាប់លំហាត់ OpenCV (HSV Histogram Equalization, Pseudo-color Density Slicing, Spatial Convolutions)។' : 'Production-ready Python snippets with line-by-line annotations, covering OpenCV color space conversions, histogram equalization, and NumPy vectorized masking.'}
          </p>
        </div>

        <!-- Script 1: Exercise 4 -->
        <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-mono font-bold text-rose-400">Exercise 4 Reference</span>
              <h3 class="text-lg font-bold text-white">HSV V-Channel Histogram Equalization (Contrast Boost)</h3>
            </div>
          </div>
          <pre class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto"><code>import cv2

# 1. Load image (BGR by default in OpenCV)
image = cv2.imread('input_image.jpg')

# 2. Convert from BGR to HSV color space
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# 3. Split into individual channels
h_channel, s_channel, v_channel = cv2.split(hsv_image)

# 4. Apply equalization ONLY to the Value (V) channel
equalized_v = cv2.equalizeHist(v_channel)

# 5. Merge channels back and convert back to BGR
hsv_enhanced = cv2.merge([h_channel, s_channel, equalized_v])
result_image = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)

# 6. Save & display
cv2.imwrite('output_contrast_enhanced.jpg', result_image)</code></pre>
        </div>

        <!-- Script 2: Exercise 5 -->
        <div class="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-mono font-bold text-cyan-400">Exercise 5 Reference</span>
              <h3 class="text-lg font-bold text-white">Pseudo-Color Density Slicing with Fast NumPy Masking</h3>
            </div>
          </div>
          <pre class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto"><code>import cv2
import numpy as np

# 1. Load Grayscale image
gray_img = cv2.imread('baggage_scan.jpg', cv2.IMREAD_GRAYSCALE)
height, width = gray_img.shape

# 2. Create empty 3-channel BGR output
color_sliced = np.zeros((height, width, 3), dtype=np.uint8)

# 3. Vectorized NumPy boolean slicing (Fast O(1) in C)
# Low-density: 0 <= f <= 60 -> Pure Blue [255, 0, 0]
blue_mask = (gray_img >= 0) & (gray_img <= 60)
color_sliced[blue_mask] = [255, 0, 0]

# Mid-density: 61 <= f <= 170 -> Pure Green [0, 255, 0]
green_mask = (gray_img >= 61) & (gray_img <= 170)
color_sliced[green_mask] = [0, 255, 0]

# High-density: 171 <= f <= 255 -> Pure Red [0, 0, 255]
red_mask = (gray_img >= 171) & (gray_img <= 255)
color_sliced[red_mask] = [0, 0, 255]

# 4. Save result
cv2.imwrite('pseudo_color_luggage.jpg', color_sliced)</code></pre>
        </div>
      </div>
    `;
  }

  // Run init on startup
  init();
});
