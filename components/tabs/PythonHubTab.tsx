'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';
import { Language, MainTab } from '@/types';
import { LearningPathFooter } from '../LearningPathFooter';

interface PythonHubTabProps {
  language: Language;
  onNavigateTab: (tab: MainTab) => void;
}

export const PythonHubTab: React.FC<PythonHubTabProps> = ({ language, onNavigateTab }) => {
  const isKh = language === 'kh';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const snippets = [
    {
      id: 'ex4',
      titleEn: '1. HSV V-Channel Histogram Equalization (Contrast Boost)',
      titleKh: '១. ការពង្រឹងកម្រិត Contrast លើរូបភាពពណ៌ដោយប្រើ HSV និង EqualizeHist',
      badge: 'Exercise 4',
      code: `import cv2
import numpy as np

# 1. Load color image (OpenCV loads in BGR order)
image = cv2.imread('input_image.jpg')
if image is None:
    print("Error: Could not load image!")
    exit()

# 2. Convert from BGR to HSV color space
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# 3. Split into individual channels
h_channel, s_channel, v_channel = cv2.split(hsv_image)

# 4. Apply histogram equalization ONLY to the Value (V/Intensity) channel
equalized_v = cv2.equalizeHist(v_channel)

# 5. Merge enhanced channels back together and convert to BGR for output
hsv_enhanced = cv2.merge([h_channel, s_channel, equalized_v])
result_image = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)

# 6. Save & display results
cv2.imwrite('hsv_equalized_output.jpg', result_image)
cv2.imshow('Original Image', image)
cv2.imshow('Enhanced Image', result_image)
cv2.waitKey(0)
cv2.destroyAllWindows()`
    },
    {
      id: 'ex5',
      titleEn: '2. Dynamic Range Density Slicing (Airport Baggage Scanner)',
      titleKh: '២. ការកាត់កម្រិតដង់ស៊ីតេ និងចាក់ពណ៌ក្លែងក្លាយ (Pseudo-Color Density Slicing)',
      badge: 'Exercise 5',
      code: `import cv2
import numpy as np

# 1. Load grayscale X-ray scan
gray_img = cv2.imread('baggage_scan.jpg', cv2.IMREAD_GRAYSCALE)
if gray_img is None:
    print("Error: Could not load baggage scan!")
    exit()

height, width = gray_img.shape

# 2. Create empty 3-channel BGR output image
color_sliced = np.zeros((height, width, 3), dtype=np.uint8)

# 3. Vectorized NumPy boolean masking (Fast O(1) in C)
# Low-density areas (0 <= f <= 60) -> Pure Blue [255, 0, 0]
blue_mask = (gray_img >= 0) & (gray_img <= 60)
color_sliced[blue_mask] = [255, 0, 0]

# Mid-density organic compounds (61 <= f <= 170) -> Pure Green [0, 255, 0]
green_mask = (gray_img >= 61) & (gray_img <= 170)
color_sliced[green_mask] = [0, 255, 0]

# High-density metallic shielding (171 <= f <= 255) -> Pure Red [0, 0, 255]
red_mask = (gray_img >= 171) & (gray_img <= 255)
color_sliced[red_mask] = [0, 0, 255]

# 4. Save and display
cv2.imwrite('baggage_sliced_output.jpg', color_sliced)
cv2.imshow('Grayscale Scan', gray_img)
cv2.imshow('Pseudo-Color Sliced Output', color_sliced)
cv2.waitKey(0)
cv2.destroyAllWindows()`
    },
    {
      id: 'ex6',
      titleEn: '3. Spatial 2D Filtering & Laplacian Edge Detection',
      titleKh: '៣. ការធ្វើ Spatial Convolution និង Laplacian Edge Filter ជាមួយ OpenCV',
      badge: 'Exercise 6',
      code: `import cv2
import numpy as np

# Load grayscale image
gray = cv2.imread('input.jpg', cv2.IMREAD_GRAYSCALE)

# 1. 3x3 Box Smoothing Filter
box_kernel = np.ones((3, 3), dtype=np.float32) / 9.0
smoothed = cv2.filter2D(gray, -1, box_kernel)

# 2. Laplacian Edge Filter (4-neighbor)
laplacian_kernel = np.array([
    [0,  1, 0],
    [1, -4, 1],
    [0,  1, 0]
], dtype=np.float32)
edges = cv2.filter2D(gray, cv2.CV_32F, laplacian_kernel)
# Clip negative values to 0 and convert to uint8
edges_clipped = np.clip(edges, 0, 255).astype(np.uint8)

cv2.imshow('Original', gray)
cv2.imshow('Box Smoothed', smoothed)
cv2.imshow('Laplacian Edges', edges_clipped)
cv2.waitKey(0)`
    },
    {
      id: 'ex78',
      titleEn: '4. Mathematical Morphology (Dilation, Erosion, Gradient)',
      titleKh: '៤. ការអនុវត្ត Mathematical Morphology ជាមួយ OpenCV',
      badge: 'Exercises 7 & 8',
      code: `import cv2
import numpy as np

# Binary image input
binary_img = cv2.imread('binary_shape.png', cv2.IMREAD_GRAYSCALE)

# 1. Structuring Element (3x3 Cross or 2x2 custom)
kernel_cross = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
kernel_rect = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))

# 2. Dilation & Erosion
dilated = cv2.dilate(binary_img, kernel_cross, iterations=1)
eroded = cv2.erode(binary_img, kernel_cross, iterations=1)

# 3. Boundaries & Morphological Gradient
internal_boundary = binary_img - eroded
external_boundary = dilated - binary_img
morph_gradient = cv2.morphologyEx(binary_img, cv2.MORPH_GRADIENT, kernel_cross)

cv2.imshow('Original Binary', binary_img)
cv2.imshow('Internal Boundary', internal_boundary)
cv2.imshow('External Boundary', external_boundary)
cv2.imshow('Morphological Gradient', morph_gradient)
cv2.waitKey(0)`
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <Terminal className="w-3.5 h-3.5" /> OpenCV & NumPy Python Hub
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          {isKh ? 'មជ្ឈមណ្ឌលកូដ Python & OpenCV សម្រាប់ Image Processing' : 'Python & OpenCV Implementation Reference'}
        </h2>
        <p className={`text-xs md:text-sm text-slate-300 leading-relaxed ${isKh ? 'khmer-font' : ''}`}>
          {isKh
            ? 'បណ្តុំកូដ Python ពេញលេញ និងការពន្យល់បច្ចេកទេសសម្រាប់លំហាត់ OpenCV (HSV Histogram Equalization, Pseudo-color Density Slicing, Spatial Convolutions)។'
            : 'Production-ready Python snippets with line-by-line annotations, covering OpenCV color space conversions, histogram equalization, and NumPy vectorized masking.'}
        </p>
      </div>

      
      <div className="space-y-6">
        {snippets.map((snip) => (
          <div key={snip.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">{snip.badge}</span>
                <h3 className="text-base md:text-lg font-bold text-white">{isKh ? snip.titleKh : snip.titleEn}</h3>
              </div>

              <button
                onClick={() => handleCopy(snip.id, snip.code)}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 font-mono shadow-sm"
              >
                {copiedId === snip.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
              <code>{snip.code}</code>
            </pre>
          </div>
        ))}
      </div>

      <LearningPathFooter currentTab="python" language={language} onNavigateTab={onNavigateTab} />
    </div>
  );
};
