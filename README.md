# 🖼️ Digital Image Processing — Interactive Learning & Exam Practice Platform (Next.js)

An interactive, responsive, and bilingual (**English & Khmer ភាសាខ្មែរ**) **Next.js (App Router)** web application built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **KaTeX**. 

Designed to help students master **Digital Image Processing (DIP)** theory, formulas, and Python/OpenCV implementations based on all 8 worked exercises in `Digital_Image_Processing.pdf`.

---

## 🌟 Key Features & Modules

### 1. 📚 8 Full Worked Exercises & Theory Explorer (`/components/tabs/ExercisesTab.tsx`)
- **Exercise 1**: Spatial Box Filter ($3\times3$) & Boundary Handling (Valid Padding vs Zero-Padding).
- **Exercise 2**: RGB to HSI Intensity ($I$) and Saturation ($S$) with Normalization steps.
- **Exercise 3**: RGB to CMYK Subtractive Color Model Conversion for Printing ($K, C, M, Y$).
- **Exercise 4**: HSV Intensity (V-channel) Histogram Equalization vs Naive RGB Distortion (OpenCV Python).
- **Exercise 5**: Dynamic Range Density Slicing (Airport Baggage Scanner Pseudo-Coloring with NumPy Masks).
- **Exercise 6**: $4\times4$ Matrix Spatial Smoothing (Box Filter) & Edge Detection (Laplacian Filter with $[0, 255]$ clipping).
- **Exercise 7**: Mathematical Morphology with Symmetric Cross Structuring Element ($A \oplus B, A \ominus B, \beta_{\text{int}}, \beta_{\text{ext}}, G$).
- **Exercise 8**: Morphology with Non-Symmetric $2\times2$ Structuring Element (Top-Left Origin).

---

### 2. 🧪 Interactive Simulation Lab (`/components/tabs/LabsTab.tsx`)
- **Spatial Filter & Edge Detection Sandbox** (`/components/tabs/labs/SpatialFilterLab.tsx`):
  - Live $N \times M$ matrix visualizer and custom cell editor.
  - Presets: Box Filter ($3\times3$), Laplacian 4-neighbor, Laplacian 8-neighbor, Gaussian $3\times3$, Sobel $G_x/G_y$.
  - Padding modes: Valid (No padding), Zero-Padding, Replicate border.
  - Step-by-step kernel convolution animation highlighting neighborhood pixels and live arithmetic calculations.
- **Color Model Studio** (`/components/tabs/labs/ColorLab.tsx`):
  - Live RGB $\leftrightarrow$ HSI / HSV converter with color picker and normalization derivations.
  - Live RGB $\leftrightarrow$ CMYK converter with dynamic ink level bars.
  - Airport baggage scanner pseudo-color density slicing simulator.
  - HSV V-channel equalization comparison against naive RGB distortion.
- **Morphology Lab** (`/components/tabs/labs/MorphologyLab.tsx`):
  - Interactive binary grid toggle (0/1).
  - Structuring element presets ($3\times3$ Cross, $2\times2$ Asymmetric with configurable origin $\star$).
  - Real-time computation of Dilation, Erosion, Internal Boundary ($\beta_{\text{int}}$), External Boundary ($\beta_{\text{ext}}$), and Morphological Gradient ($G$).

---

### 3. 📝 Exam Prep & Practice Quiz Generator (`/components/tabs/ExamQuizTab.tsx`)
- Generates randomized practice exam questions with dynamic matrices and RGB values.
- Auto-grading with instant performance scores and victory confetti.
- Full step-by-step worked mathematical solutions for each generated problem.

---

### 4. 💻 Python & OpenCV Hub (`/components/tabs/PythonHubTab.tsx`)
- Production-ready Python scripts for HSV contrast enhancement and density slicing.
- Line-by-line breakdown in English and Khmer with one-click copy buttons.

---

## 🚀 How to Run the Next.js App

### 1. Start Development Server:
```powershell
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 2. Build for Production:
```powershell
npm run build
npm start
```
