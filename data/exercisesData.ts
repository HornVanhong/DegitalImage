import { Exercise } from '@/types';

export const EXERCISES_DATA: Exercise[] = [
  {
    id: 1,
    titleEn: "Exercise 1: Spatial Filter & Boundary Handling",
    titleKh: "លំហាត់ទី ១៖ Spatial Filter & ការគ្រប់គ្រងព្រំដែន (Boundary Handling)",
    topic: "Spatial Filtering",
    difficulty: "Medium",
    badgeColor: "indigo",
    problemEn: `You are given a 3x3 grayscale image segment $I$ and a 3x3 box filter kernel $H$ defined below:
$$I = \\begin{bmatrix} 10 & 20 & 30 \\\\ 40 & 50 & 60 \\\\ 70 & 80 & 90 \\end{bmatrix} \\quad \\text{and} \\quad H = \\frac{1}{9}\\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{bmatrix}$$

1. Calculate the filtered pixel value at the center of the image (Value 50) using **valid padding** (no boundary extension).
2. Calculate the filtered pixel value for the top-left pixel (Value 10) by applying **zero-padding** (assume all pixel values outside boundary are 0).`,
    problemKh: `គេឱ្យផ្ទាំងរូបភាព Grayscale ទំហំ 3x3 ឈ្មោះ $I$ និង Kernel ចម្រោះ Box Filter ទំហំ 3x3 ឈ្មោះ $H$ ដូចខាងក្រោម៖
$$I = \\begin{bmatrix} 10 & 20 & 30 \\\\ 40 & 50 & 60 \\\\ 70 & 80 & 90 \\end{bmatrix} \\quad \\text{និង} \\quad H = \\frac{1}{9}\\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{bmatrix}$$

១. គណនាតម្លៃ Pixel ថ្មីនៅចំកណ្តាលរូបភាព (តម្លៃ 50) ដោយប្រើ **Valid Padding** (មិនបន្ថែមគែម)។
២. គណនាតម្លៃ Pixel ថ្មីនៅជ្រុងលើខាងឆ្វេង (តម្លៃ 10) ដោយប្រើ **Zero-Padding** (សន្មតថាធាតុក្រៅព្រំដែនទាំងអស់ស្មើ 0)។`,
    matrixI: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ],
    kernelH: [
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9]
    ],
    questions: [
      {
        qNum: 1,
        titleEn: "1. Filtered value at Center (Pixel 50) with Valid Padding",
        titleKh: "១. គណនាតម្លៃ Pixel ថ្មីនៅចំកណ្តាល (តម្លៃ 50) ដោយប្រើ Valid Padding",
        explanationKh: `ពាក្យថា Valid Padding (ឬ No Padding) មានន័យថាយើងមិនអនុញ្ញាតឱ្យ Kernel លៀនចេញក្រៅព្រំដែននៃរូបភាពឡើយ។ 
យើងគណនាបានតែត្រង់ចំណុចណាដែល Kernel អាចគ្របដណ្តប់លើរូបភាពបានពេញលេញ 3x3 តែម្តង។

នៅពេលយើងដាក់ Kernel H ឱ្យចំកណ្តាលរូបភាព (លេខ 50) វានឹងត្រួតស៊ីគ្នាជាមួយ Matrix I ទាំងស្រុង ដោយមិនចាំបាច់ថែមគែមអ្វីទាំងអស់។`,
        formula: `\\text{Result} = \\frac{1}{9} \\sum_{i=1}^3 \\sum_{j=1}^3 I(i,j) \\times 1`,
        steps: [
          {
            stepEn: "Step 1: Overlay Kernel H directly on Matrix I",
            stepKh: "ជំហានទី ១៖ ដាក់ Kernel H ត្រួតលើ Matrix I",
            math: `\\begin{bmatrix} 10 & 20 & 30 \\\\ 40 & 50 & 60 \\\\ 70 & 80 & 90 \\end{bmatrix} \\odot \\frac{1}{9}\\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{bmatrix}`
          },
          {
            stepEn: "Step 2: Multiply corresponding elements and sum",
            stepKh: "ជំហានទី ២៖ គុណធាតុនីមួយៗតាមទីតាំងរួចបូកបញ្ចូលគ្នា",
            math: `\\text{Sum} = (10\\times 1) + (20\\times 1) + (30\\times 1) + (40\\times 1) + (50\\times 1) + (60\\times 1) + (70\\times 1) + (80\\times 1) + (90\\times 1) = 450`
          },
          {
            stepEn: "Step 3: Multiply by normalization factor 1/9",
            stepKh: "ជំហានទី ៣៖ គុណនឹងមេគុណសម្រួល 1/9",
            math: `\\text{Result} = \\frac{1}{9} \\times 450 = 50`
          }
        ],
        finalAnswerEn: "Filtered pixel value at center is **50**.",
        finalAnswerKh: "តម្លៃផ្ទាំងរូបភាពចម្លង (Filtered value) នៅចំកណ្តាលគឺ **50**។"
      },
      {
        qNum: 2,
        titleEn: "2. Filtered value at Top-Left (Pixel 10) with Zero-Padding",
        titleKh: "២. គណនាតម្លៃ Pixel ថ្មីនៅជ្រុងលើខាងឆ្វេង (តម្លៃ 10) ដោយប្រើ Zero-Padding",
        explanationKh: `នៅពេលចង់គណនាត្រង់ចំណុចគែមដូចជាលេខ 10 Kernel ទំហំ 3x3 នឹងត្រូវលៀនចេញទៅក្រៅព្រំដែនរូបភាព។ 
តាមលក្ខខណ្ឌ Zero-Padding យើងត្រូវសន្មតថារាល់តំបន់ដែលលៀនចេញក្រៅរូបភាពដើម គឺត្រូវជំនួសដោយលេខ 0 ទាំងអស់។`,
        formula: `\\text{Result} = \\frac{1}{9} \\times (0 + 0 + 0 + 0 + 10 + 20 + 0 + 40 + 50)`,
        steps: [
          {
            stepEn: "Step 1: Construct padded neighborhood around top-left pixel (10)",
            stepKh: "ជំហានទី ១៖ បង្កើត Matrix ជុំវិញលេខ 10 ដោយថែម 0 នៅក្រៅព្រំដែន",
            math: `\\text{Neighborhood} = \\begin{bmatrix} 0 & 0 & 0 \\\\ 0 & 10 & 20 \\\\ 0 & 40 & 50 \\end{bmatrix}`
          },
          {
            stepEn: "Step 2: Sum active non-zero elements",
            stepKh: "ជំហានទី ២៖ បូកធាតុទាំងអស់ដែលមិនមែនសូន្យ",
            math: `10 + 20 + 40 + 50 = 120`
          },
          {
            stepEn: "Step 3: Multiply by 1/9",
            stepKh: "ជំហានទី ៣៖ គុណនឹង 1/9",
            math: `\\text{Result} = \\frac{1}{9} \\times 120 = \\frac{120}{9} \\approx 13.33 \\quad (\\text{or } 13 \\text{ for 8-bit integer})`
          }
        ],
        finalAnswerEn: "Filtered pixel value at top-left is **13.33** (or **13** if rounded to 8-bit integer).",
        finalAnswerKh: "តម្លៃផ្ទាំងរូបភាពចម្លងនៅជ្រុងលើខាងឆ្វេងគឺ **13.33** (ឬ **13** ប្រសិនបើងាកមកជាចំនួនគត់ 8-bit pixel)។"
      }
    ],
    interactiveLab: "spatial"
  },
  {
    id: 2,
    titleEn: "Exercise 2: RGB to HSI Intensity & Saturation Extraction",
    titleKh: "លំហាត់ទី ២៖ ការបំប្លែង RGB ទៅជា HSI (គណនា Intensity និង Saturation)",
    topic: "Color Models (HSI/HSV)",
    difficulty: "Medium",
    badgeColor: "emerald",
    problemEn: `A digital color image contains a pixel with the RGB values:
$$R = 100, \\quad G = 150, \\quad B = 200 \\quad \\text{(on standard 8-bit scale } 0\\text{ to } 255\\text{)}$$

1. Compute the intensity component ($I$) of the pixel in the HSI color model.
2. Normalize the RGB values to the range $[0, 1]$ and compute the saturation component ($S$) using the standard formula:
$$S = 1 - \\frac{3}{R + G + B}[\\min(R, G, B)]$$`,
    problemKh: `រូបភាពពណ៌ឌីជីថលមួយមាន Pixel មួយដែលមានតម្លៃ RGB៖
$$R = 100, \\quad G = 150, \\quad B = 200 \\quad (\\text{លើកម្រិត 8-bit ពី } 0 \\text{ ដល់ } 255)$$

១. គណនាតម្លៃសមាសភាគពន្លឺ Intensity ($I$) នៅក្នុងប្រព័ន្ធពណ៌ HSI។
២. ធ្វើ Normalization លើតម្លៃ RGB ឱ្យនៅក្នុងចន្លោះ $[0, 1]$ រួចគណនាសមាសភាគ Saturation ($S$) តាមរូបមន្តស្តង់ដារ៖
$$S = 1 - \\frac{3}{R + G + B}[\\min(R, G, B)]$$`,
    rgbInput: { r: 100, g: 150, b: 200 },
    questions: [
      {
        qNum: 1,
        titleEn: "1. Compute Intensity Component (I)",
        titleKh: "១. គណនាតម្លៃ Intensity Component (I)",
        explanationKh: `នៅក្នុងប្រព័ន្ធពណ៌ HSI សមាសភាគ Intensity (I) គឺជាមធ្យមភាគនព្វន្ធ (Arithmetic Average) នៃតម្លៃពណ៌ទាំងបី។ វាតំណាងឱ្យកម្រិតពន្លឺសរុបដោយមិនគិតពីជាតិពណ៌ឡើយ។`,
        formula: `I = \\frac{R + G + B}{3}`,
        steps: [
          {
            stepEn: "Step 1: Substitute R=100, G=150, B=200 into the arithmetic mean formula",
            stepKh: "ជំហានទី ១៖ ជំនួសតម្លៃ R=100, G=150, B=200 ចូលក្នុងរូបមន្ត",
            math: `I = \\frac{100 + 150 + 200}{3} = \\frac{450}{3} = 150`
          }
        ],
        finalAnswerEn: "Intensity $I = 150$ (on standard 8-bit scale).",
        finalAnswerKh: "តម្លៃ Intensity Component ($I$) គឺ **150** (នៅលើកម្រិត 8-bit scale ដដែល)។"
      },
      {
        qNum: 2,
        titleEn: "2. Normalize to [0,1] and Compute Saturation (S)",
        titleKh: "២. ធ្វើ Normalization ទៅចន្លោះ [0, 1] រួចគណនា Saturation (S)",
        explanationKh: `ដើម្បីប្រើប្រាស់រូបមន្តស្តង់ដារនេះបានត្រឹមត្រូវ ជំហានដំបូងបំផុតគឺត្រូវធ្វើ Normalization លើតម្លៃ R, G, B ពីកម្រិត 8-bit (0 ដល់ 255) ឱ្យទៅនៅក្នុងចន្លោះ [0, 1] ជាមុនសិន ដោយយកតម្លៃនីមួយៗចែកនឹង 255។`,
        formula: `S = 1 - \\frac{3}{R_{\\text{norm}} + G_{\\text{norm}} + B_{\\text{norm}}} \\times \\min(R_{\\text{norm}}, G_{\\text{norm}}, B_{\\text{norm}})`,
        steps: [
          {
            stepEn: "Step 1: Normalize R, G, B values by dividing by 255",
            stepKh: "ជំហានទី ១៖ គណនាតម្លៃ Normalized R, G, B",
            math: `R_{\\text{norm}} = \\frac{100}{255} \\approx 0.3922, \\quad G_{\\text{norm}} = \\frac{150}{255} \\approx 0.5882, \\quad B_{\\text{norm}} = \\frac{200}{255} \\approx 0.7843`
          },
          {
            stepEn: "Step 2: Find the minimum component",
            stepKh: "ជំហានទី ២៖ ស្វែងរកតម្លៃតូចបំផុត min(R, G, B)",
            math: `\\min(0.3922, 0.5882, 0.7843) = 0.3922 \\quad (R_{\\text{norm}})`
          },
          {
            stepEn: "Step 3: Calculate denominator sum (R+G+B)",
            stepKh: "ជំហានទី ៣៖ គណនាភាគបែង (Rnorm + Gnorm + Bnorm)",
            math: `R_{\\text{norm}} + G_{\\text{norm}} + B_{\\text{norm}} = 0.3922 + 0.5882 + 0.7843 = 1.7647`
          },
          {
            stepEn: "Step 4: Compute Saturation S",
            stepKh: "ជំហានទី ៤៖ គណនាតម្លៃ S",
            math: `S = 1 - \\frac{3}{1.7647} \\times (0.3922) = 1 - (1.7000 \\times 0.3922) = 1 - 0.6667 = 0.3333`
          }
        ],
        finalAnswerEn: "Saturation $S = 0.3333$ (or **33.33%**).",
        finalAnswerKh: "តម្លៃ Saturation Component ($S$) គឺ **0.3333** (ឬស្មើនឹង **33.33%**)។"
      }
    ],
    interactiveLab: "color"
  },
  {
    id: 3,
    titleEn: "Exercise 3: CMYK Color Complement Calculation",
    titleKh: "លំហាត់ទី ៣៖ ការបំប្លែងពណ៌ RGB ទៅជា CMYK (Subtractive Color Model)",
    topic: "Color Models (CMYK)",
    difficulty: "Easy",
    badgeColor: "amber",
    problemEn: `A graphic design software package needs to convert an RGB pixel to the CMYK (Cyan, Magenta, Yellow, Black) subtractive color model for printing. 
The pixel values are $R = 51, G = 255,$ and $B = 102$.

1. Convert the RGB values to a normalized range $[0, 1]$.
2. Calculate the corresponding $C, M, Y,$ and $K$ values using the standard conversion formulas:
   - $K = 1 - \\max(R', G', B')$
   - $C = \\frac{1 - R' - K}{1 - K}$
   - $M = \\frac{1 - G' - K}{1 - K}$
   - $Y = \\frac{1 - B' - K}{1 - K}$`,
    problemKh: `កម្មវិធីឌីហ្សាញក្រាហ្វិកមួយត្រូវការបំប្លែង Pixel ពណ៌ RGB ទៅជាប្រព័ន្ធពណ៌ដក CMYK (Cyan, Magenta, Yellow, Black) សម្រាប់បោះពុម្ព។ 
តម្លៃ Pixel គឺ $R = 51, G = 255,$ និង $B = 102$។

១. បំប្លែងតម្លៃ RGB ទៅជាចន្លោះ Normalized $[0, 1]$។
២. គណនាតម្លៃ $C, M, Y,$ និង $K$ តាមរូបមន្តស្តង់ដារ។`,
    rgbInput: { r: 51, g: 255, b: 102 },
    questions: [
      {
        qNum: 1,
        titleEn: "1. Normalization of RGB to [0, 1]",
        titleKh: "១. បំប្លែងតម្លៃ RGB ទៅជាចន្លោះ Normalized [0, 1]",
        steps: [
          {
            stepEn: "Divide each channel value by 255",
            stepKh: "ចែកតម្លៃនៃឆានែលនីមួយៗនឹង 255",
            math: `R' = \\frac{51}{255} = 0.2, \\quad G' = \\frac{255}{255} = 1.0, \\quad B' = \\frac{102}{255} = 0.4`
          }
        ],
        finalAnswerEn: "$R' = 0.2, \\quad G' = 1.0, \\quad B' = 0.4$",
        finalAnswerKh: "$R' = 0.2, \\quad G' = 1.0, \\quad B' = 0.4$"
      },
      {
        qNum: 2,
        titleEn: "2. Calculate Key (Black K), Cyan (C), Magenta (M), and Yellow (Y)",
        titleKh: "២. គណនាតម្លៃ Key (K), Cyan (C), Magenta (M), និង Yellow (Y)",
        steps: [
          {
            stepEn: "Step 1: Calculate Key (Black, K)",
            stepKh: "ជំហានទី ១៖ គណនាតម្លៃជាតិពណ៌ខ្មៅ Key (K)",
            math: `K = 1 - \\max(0.2, 1.0, 0.4) = 1 - 1.0 = 0`
          },
          {
            stepEn: "Step 2: Calculate Cyan (C)",
            stepKh: "ជំហានទី ២៖ គណនាតម្លៃ Cyan (C)",
            math: `C = \\frac{1 - 0.2 - 0}{1 - 0} = \\frac{0.8}{1} = 0.8 \\quad (80\\%)`
          },
          {
            stepEn: "Step 3: Calculate Magenta (M)",
            stepKh: "ជំហានទី ៣៖ គណនាតម្លៃ Magenta (M)",
            math: `M = \\frac{1 - 1.0 - 0}{1 - 0} = \\frac{0}{1} = 0.0 \\quad (0\\%)`
          },
          {
            stepEn: "Step 4: Calculate Yellow (Y)",
            stepKh: "ជំហានទី ៤៖ គណនាតម្លៃ Yellow (Y)",
            math: `Y = \\frac{1 - 0.4 - 0}{1 - 0} = \\frac{0.6}{1} = 0.6 \\quad (60\\%)`
          }
        ],
        finalAnswerEn: "CMYK Result: **C = 80%, M = 0%, Y = 60%, K = 0%**",
        finalAnswerKh: "សង្ខេបចម្លើយចុងក្រោយ (CMYK): **Cyan (C) = 0.8 (80%), Magenta (M) = 0.0 (0%), Yellow (Y) = 0.6 (60%), Black (K) = 0.0 (0%)**"
      }
    ],
    interactiveLab: "color"
  },
  {
    id: 4,
    titleEn: "Exercise 4: HSI/HSV Intensity Extraction & Enhancement",
    titleKh: "លំហាត់ទី ៤៖ ការពង្រឹងកម្រិត Contrast លើរូបភាពពណ៌ដោយប្រើ HSV និង EqualizeHist",
    topic: "Image Enhancement & OpenCV",
    difficulty: "Hard",
    badgeColor: "rose",
    problemEn: `Increasing the contrast of a color image by applying histogram equalization to individual R, G, and B channels independently creates severe color distortion. 
The correct approach is to transform the image to a space like HSI (or HSV), equalize only the Intensity/Value channel, and convert it back.

Write a Python script to:
1. Load a color image and convert to the HSV color space.
2. Split the image into individual H, S, and V channels.
3. Apply standard histogram equalization to the V (Value/Intensity) channel using cv2.equalizeHist().
4. Merge the channels back together and convert the image back to the BGR space for saving.`,
    problemKh: `ការបង្កើនកម្រិត Contrast នៃរូបភាពពណ៌ដោយធ្វើ Histogram Equalization លើឆានែល R, G, B ដាច់ដោយឡែកពីគ្នា នឹងបង្កឱ្យមានការខូចទ្រង់ទ្រាយពណ៌យ៉ាងធ្ងន់ធ្ងរ (Color Distortion)។ 
វិធីសាស្ត្រត្រឹមត្រូវ គឺត្រូវបំប្លែងរូបភាពទៅជាប្រព័ន្ធពណ៌ HSV រួចធ្វើ Equalize តែលើឆានែលពន្លឺ Value (V) ប៉ុណ្ណោះ រួចបំប្លែងត្រឡប់មកវិញ។

ចូរសរសេរកូដ Python ដើម្បីអនុវត្ត ៤ ជំហានខាងលើ។`,
    codeSnippet: `import cv2
import numpy as np

# =========================================================================
# ជំហានទី ១៖ ផ្ទុក និងបំប្លែងរូបភាពទៅ HSV (Load Image & Convert to HSV)
# =========================================================================
image = cv2.imread('input_image.jpg')
if image is None:
    print("Error: មិនអាចបើករូបភាពបានឡើយ! សូមពិនិត្យមើលផ្លូវ (Path)")
    exit()

# បំប្លែងពី BGR ទៅ HSV Color Space
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# =========================================================================
# ជំហានទី ២៖ បំបែក Channels ដាច់ពីគ្នា (Split into H, S, and V channels)
# =========================================================================
h_channel, s_channel, v_channel = cv2.split(hsv_image)

# =========================================================================
# ជំហានទី ៣៖ ធ្វើ Histogram Equalization លើ V Channel (Equalize V Channel)
# =========================================================================
# ប្រើប្រាស់ cv2.equalizeHist ដើម្បីពង្រីកកម្រិតពន្លឺនៃ V Channel
equalized_v = cv2.equalizeHist(v_channel)

# =========================================================================
# ជំហានទី ៤៖ បញ្ចូល Channels ឡើងវិញរួចបំប្លែងមក BGR (Merge & Convert back)
# =========================================================================
# ផ្គុំ V channel ដែលបានបង្កើន Contrast ជាមួយ Hue និង Saturation ដើម
hsv_enhanced = cv2.merge([h_channel, s_channel, equalized_v])

# បំប្លែងពី HSV ត្រឡប់មក BGR ដើម្បីបង្ហាញ និងរក្សាទុក
result_image = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)

# រក្សាទុករូបភាពលទ្ធផល
cv2.imwrite('hsv_equalized_output.jpg', result_image)

# បង្ហាញលទ្ធផលប្រៀបធៀប
cv2.imshow('Original Color Image', image)
cv2.imshow('Enhanced Contrast Image (V-Channel Equalized)', result_image)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    keyConceptsKh: [
      "cv2.split(): ប្រើដើម្បីបំបែក Matrix រូបភាព 3D ទៅជា Matrix 2D ចំនួន ៣ ដាច់ដោយឡែកពីគ្នា (H, S, V)។",
      "cv2.equalizeHist(): គណនាអ៊ីស្តូក្រាមនៃរូបភាពសខ្មៅ (ក្នុងលំហាត់នេះគឺ V channel) រួចធ្វើការចែកចាយកម្រិតពន្លឺឱ្យរាយប៉ាយស្មើគ្នាពេញចន្លោះ 0 ដល់ 255។",
      "cv2.merge(): យក Matrix 2D ទាំង ៣ មកដេរភ្ជាប់គ្នាទៅជាទម្រង់រូបភាព 3-channel វិញ។",
      "Color Integrity: ការមិនប៉ះពាល់ H (Hue) និង S (Saturation) ធានាថាក្រិតពណ៌មិនលម្អៀង ឬផ្លាស់ប្តូរឡើយ។"
    ],
    interactiveLab: "color"
  },
  {
    id: 5,
    titleEn: "Exercise 5: Dynamic Range Density Slicing (Pseudo-Color)",
    titleKh: "លំហាត់ទី ៥៖ ការកាត់កម្រិតដង់ស៊ីតេ និងចាក់ពណ៌ក្លែងក្លាយ (Pseudo-Color Density Slicing)",
    topic: "Pseudo-Color Processing",
    difficulty: "Medium",
    badgeColor: "cyan",
    problemEn: `An airport baggage scanner outputs 8-bit grayscale images $f(x,y)$. To highlight hidden illegal goods, write a Python script that applies pseudo-color density slicing:
- **Low-density areas** ($0 \\le f \\le 60$) map to **Pure Blue** (BGR: [255, 0, 0])
- **Mid-density organic compounds** ($61 \\le f \\le 170$) map to **Pure Green** (BGR: [0, 255, 0])
- **High-density metallic shielding** ($171 \\le f \\le 255$) map to **Pure Red** (BGR: [0, 0, 255])`,
    problemKh: `ម៉ាស៊ីនស្កេនឥវ៉ាន់នៅព្រលានយន្តហោះបញ្ចេញរូបភាពកម្រិតប្រផេះ 8-bit $f(x,y)$។ ដើម្បីបង្ហាញទំនិញលួចលាក់ខុសច្បាប់ ចូរសរសេរកូដ Python ដោយអនុវត្ត Pseudo-color Density Slicing៖
- **តំបន់ដង់ស៊ីតេទាប** ($0 \\le f \\le 60$) $\\rightarrow$ ពណ៌ខៀវសុទ្ធ Pure Blue (BGR: [255, 0, 0])
- **សមាសធាតុសរីរាង្គដង់ស៊ីតេមធ្យម** ($61 \\le f \\le 170$) $\\rightarrow$ ពណ៌បៃតងសុទ្ធ Pure Green (BGR: [0, 255, 0])
- **លោហៈដង់ស៊ីតេខ្ពស់** ($171 \\le f \\le 255$) $\\rightarrow$ ពណ៌ក្រហមសុទ្ធ Pure Red (BGR: [0, 0, 255])`,
    codeSnippet: `import cv2
import numpy as np

# =========================================================================
# ជំហានទី ១៖ ផ្ទុករូបភាពជា Grayscale (Load Grayscale Image)
# =========================================================================
gray_img = cv2.imread('baggage_scan.jpg', cv2.IMREAD_GRAYSCALE)
if gray_img is None:
    print("Error: មិនអាចបើករូបភាពបានឡើយ!")
    exit()

height, width = gray_img.shape

# =========================================================================
# ជំហានទី ២៖ បង្កើតផ្ទាំងរូបភាពទទេ BGR (Create empty BGR image)
# =========================================================================
color_sliced = np.zeros((height, width, 3), dtype=np.uint8)

# =========================================================================
# ជំហានទី ៣៖ អនុវត្ត Density Slicing ដោយប្រើ NumPy Masking
# =========================================================================
# ក. តំបន់ដង់ស៊ីតេទាប (0 <= f <= 60) -> Pure Blue (BGR: [255, 0, 0])
blue_mask = (gray_img >= 0) & (gray_img <= 60)
color_sliced[blue_mask] = [255, 0, 0]

# ខ. តំបន់ដង់ស៊ីតេមធ្យម (61 <= f <= 170) -> Pure Green (BGR: [0, 255, 0])
green_mask = (gray_img >= 61) & (gray_img <= 170)
color_sliced[green_mask] = [0, 255, 0]

# គ. តំបន់ដង់ស៊ីតេខ្ពស់ (171 <= f <= 255) -> Pure Red (BGR: [0, 0, 255])
red_mask = (gray_img >= 171) & (gray_img <= 255)
color_sliced[red_mask] = [0, 0, 255]

# =========================================================================
# ជំហានទី ៤៖ រក្សាទុក និងបង្ហាញលទ្ធផល
# =========================================================================
cv2.imwrite('baggage_sliced_output.jpg', color_sliced)
cv2.imshow('Original Scanner Image (Grayscale)', gray_img)
cv2.imshow('Density Sliced Image (Pseudo-color)', color_sliced)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    keyConceptsKh: [
      "np.zeros((height, width, 3), ...): បង្កើតផ្ទាំងរូបភាពទទេមួយជាទម្រង់ពណ៌ BGR (មាន 3 channels)។",
      "NumPy Masking (ដូចជា blue_mask): ជំនួសឱ្យការប្រើ Loop for ពីរជាន់ដែលដើរយឺត។",
      "OpenCV BGR Order: OpenCV ប្រើ BGR (Blue, Green, Red) មិនមែន RGB ឡើយ។"
    ],
    interactiveLab: "color"
  },
  {
    id: 6,
    titleEn: "Exercise 6: 4x4 Matrix Smoothing & Laplacian Edge Detection",
    titleKh: "លំហាត់ទី ៦៖ ការធ្វើ Smoothing (Box Filter) និង Edge Detection (Laplacian) លើ Matrix 4x4",
    topic: "Spatial Filtering & Edges",
    difficulty: "Hard",
    badgeColor: "purple",
    problemEn: `Given an input image $I$ defined by a 4x4 matrix:
$$I = \\begin{bmatrix} 85 & 35 & 112 & 10 \\\\ 90 & 75 & 185 & 25 \\\\ 120 & 220 & 235 & 68 \\\\ 165 & 70 & 89 & 80 \\end{bmatrix}$$

1. Compute the output image smoothing, $I_{\\text{smooth}}$, if the filter mask is $H = \\frac{1}{9}\\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{bmatrix}$ (Valid padding $\\rightarrow 2\\times 2$).
2. Compute the edge detection $I_{\\text{edge}}$, if the filter mask is $H = \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & -4 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}$ with $[0, 255]$ clipping.`,
    problemKh: `គេឱ្យរូបភាពដើម $I$ ជាទម្រង់ Matrix 4x4៖
$$I = \\begin{bmatrix} 85 & 35 & 112 & 10 \\\\ 90 & 75 & 185 & 25 \\\\ 120 & 220 & 235 & 68 \\\\ 165 & 70 & 89 & 80 \\end{bmatrix}$$

១. គណនារូបភាពម៉ត់ ($I_{\\text{smooth}}$) ដោយប្រើ Box Filter $H = \\frac{1}{9}[1]_{3\\times 3}$ (ប្រើ Valid Padding ទទួលបាន Matrix $2\\times 2$)។
២. គណនារូបភាពចាប់គែម ($I_{\\text{edge}}$) ដោយប្រើ Laplacian Filter $H = \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & -4 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}$ រួមទាំងការកាត់តម្លៃអវិជ្ជមានទៅ 0 (Clipping $[0, 255]$)។`,
    matrixI: [
      [85, 35, 112, 10],
      [90, 75, 185, 25],
      [120, 220, 235, 68],
      [165, 70, 89, 80]
    ],
    questions: [
      {
        qNum: 1,
        titleEn: "1. Smoothing Output (Box Filter 3x3)",
        titleKh: "១. គណនារូបភាពម៉ត់ (Ismooth) ដោយប្រើ Box Filter",
        explanationKh: `ដោយសារតែមិនមានបញ្ជាក់ពីប្រភេទ Padding តាមគោលការណ៍ស្តង់ដារគឺយើងគណនាត្រង់ចំណុចណាដែល Kernel អាចដាក់គ្របពីលើបានពេញលេញ (Valid Padding)។ 
ដូច្នេះ រូបភាពលទ្ធផលនឹងបង្រួញមកសល់ទំហំ 2 x 2 (មាន ៤ ទីតាំងនៅចំកណ្តាល)។`,
        steps: [
          {
            stepEn: "Top-Left Center (Center at 75): Submatrix [[85,35,112],[90,75,185],[120,220,235]]",
            stepKh: "ទីតាំងទី១ (ចំលេខ 75): គ្របលើ Sub-matrix ខាងលើឆ្វេង",
            math: `\\text{Value}_1 = \\frac{1}{9}(85 + 35 + 112 + 90 + 75 + 185 + 120 + 220 + 235) = \\frac{1}{9}(1157) \\approx 128.56 \\approx 129`
          },
          {
            stepEn: "Top-Right Center (Center at 185): Submatrix [[35,112,10],[75,185,25],[220,235,68]]",
            stepKh: "ទីតាំងទី២ (ចំលេខ 185): គ្របលើ Sub-matrix ខាងលើស្តាំ",
            math: `\\text{Value}_2 = \\frac{1}{9}(35 + 112 + 10 + 75 + 185 + 25 + 220 + 235 + 68) = \\frac{1}{9}(965) \\approx 107.22 \\approx 107`
          },
          {
            stepEn: "Bottom-Left Center (Center at 220): Submatrix [[90,75,185],[120,220,235],[165,70,89]]",
            stepKh: "ទីតាំងទី៣ (ចំលេខ 220): គ្របលើ Sub-matrix ខាងក្រោមឆ្វេង",
            math: `\\text{Value}_3 = \\frac{1}{9}(90 + 75 + 185 + 120 + 220 + 235 + 165 + 70 + 89) = \\frac{1}{9}(1249) \\approx 138.78 \\approx 139`
          },
          {
            stepEn: "Bottom-Right Center (Center at 235): Submatrix [[75,185,25],[220,235,68],[70,89,80]]",
            stepKh: "ទីតាំងទី៤ (ចំលេខ 235): គ្របលើ Sub-matrix ខាងក្រោមស្តាំ",
            math: `\\text{Value}_4 = \\frac{1}{9}(75 + 185 + 25 + 220 + 235 + 68 + 70 + 89 + 80) = \\frac{1}{9}(1047) \\approx 116.33 \\approx 116`
          }
        ],
        finalAnswerEn: "$$I_{\\text{smooth}} = \\begin{bmatrix} 128.56 & 107.22 \\\\ 138.78 & 116.33 \\end{bmatrix} \\approx \\begin{bmatrix} 129 & 107 \\\\ 139 & 116 \\end{bmatrix}$$",
        finalAnswerKh: "ផ្ទាំងរូបភាពម៉ត់ចុងក្រោយគឺ៖ $$I_{\\text{smooth}} = \\begin{bmatrix} 128.56 & 107.22 \\\\ 138.78 & 116.33 \\end{bmatrix} \\approx \\begin{bmatrix} 129 & 107 \\\\ 139 & 116 \\end{bmatrix}$$"
      },
      {
        qNum: 2,
        titleEn: "2. Edge Detection Output (Laplacian Filter)",
        titleKh: "២. គណនារូបភាពចាប់គែម (Iedge) ដោយប្រើ Laplacian Filter",
        explanationKh: `រូបមន្ត Laplacian (ដេរីវេទី២)៖
$$\\text{Value} = (\\text{លើ} + \\text{ក្រោម} + \\text{ឆ្វេង} + \\text{ស្តាំ}) - 4 \\times (\\text{កណ្តាល})$$
ប្រសិនបើតម្លៃចេញមកជាចំនួនអវិជ្ជមាន ត្រូវកាត់ស្មើ 0 តាមគោលការណ៍ Clipping [0, 255]។`,
        steps: [
          {
            stepEn: "Pos 1 (Center 75): Neighbors are Top=35, Bottom=220, Left=90, Right=185",
            stepKh: "ទីតាំងទី១ (ចំលេខ 75): ធាតុជុំវិញគឺ លើ=35, ក្រោម=220, ឆ្វេង=90, ស្តាំ=185",
            math: `\\text{Value}_1 = (35 + 220 + 90 + 185) - 4(75) = 530 - 300 = 230`
          },
          {
            stepEn: "Pos 2 (Center 185): Neighbors are Top=112, Bottom=235, Left=75, Right=25",
            stepKh: "ទីតាំងទី២ (ចំលេខ 185): ធាតុជុំវិញគឺ លើ=112, ក្រោម=235, ឆ្វេង=75, ស្តាំ=25",
            math: `\\text{Value}_2 = (112 + 235 + 75 + 25) - 4(185) = 447 - 740 = -293 \\rightarrow 0 \\quad (\\text{clipped})`
          },
          {
            stepEn: "Pos 3 (Center 220): Neighbors are Top=75, Bottom=70, Left=120, Right=235",
            stepKh: "ទីតាំងទី៣ (ចំលេខ 220): ធាតុជុំវិញគឺ លើ=75, ក្រោម=70, ឆ្វេង=120, ស្តាំ=235",
            math: `\\text{Value}_3 = (75 + 70 + 120 + 235) - 4(220) = 500 - 880 = -380 \\rightarrow 0 \\quad (\\text{clipped})`
          },
          {
            stepEn: "Pos 4 (Center 235): Neighbors are Top=185, Bottom=89, Left=220, Right=68",
            stepKh: "ទីតាំងទី៤ (ចំលេខ 235): ធាតុជុំវិញគឺ លើ=185, ក្រោម=89, ឆ្វេង=220, ស្តាំ=68",
            math: `\\text{Value}_4 = (185 + 89 + 220 + 68) - 4(235) = 562 - 940 = -378 \\rightarrow 0 \\quad (\\text{clipped})`
          }
        ],
        finalAnswerEn: "$$I_{\\text{edge}} = \\begin{bmatrix} 230 & 0 \\\\ 0 & 0 \\end{bmatrix}$$",
        finalAnswerKh: "ផ្ទាំងរូបភាពចាប់គែមចុងក្រោយគឺ៖ $$I_{\\text{edge}} = \\begin{bmatrix} 230 & 0 \\\\ 0 & 0 \\end{bmatrix}$$"
      }
    ],
    interactiveLab: "spatial"
  },
  {
    id: 7,
    titleEn: "Exercise 7: Mathematical Morphology on Binary Image (Cross SE)",
    titleKh: "លំហាត់ទី ៧៖ គណិតវិទ្យារូបរាង (Mathematical Morphology) ជាមួយ Structuring Element ស៊ីមេទ្រី",
    topic: "Mathematical Morphology",
    difficulty: "Hard",
    badgeColor: "blue",
    problemEn: `Given the binary image $A$ and a 3x3 cross-shaped structuring element $B$ (origin at center):
$$A = \\begin{bmatrix} 0 & 0 & 0 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 1 & 1 & 0 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\end{bmatrix} \\quad \\text{and} \\quad B = \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & 1 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}$$

1. Compute $A \\oplus B$ (Dilation) and $A \\ominus B$ (Erosion).
2. Compute the Internal boundary $\\beta_{\\text{int}}(A)$ and External boundary $\\beta_{\\text{ext}}(A)$.
3. Compute the Morphological Gradient $G(A)$.`,
    problemKh: `គេឱ្យរូបភាព Binary $A$ ទំហំ 5x5 និង Structuring Element $B$ ទម្រង់សញ្ញាបូក (Origin នៅចំកណ្តាល)៖
$$A = \\begin{bmatrix} 0 & 0 & 0 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 1 & 1 & 0 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\end{bmatrix} \\quad \\text{និង} \\quad B = \\begin{bmatrix} 0 & 1 & 0 \\\\ 1 & 1 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}$$

១. គណនា $A \\oplus B$ (Dilation) និង $A \\ominus B$ (Erosion)។
២. គណនា Internal Boundary $\\beta_{\\text{int}}(A)$ និង External Boundary $\\beta_{\\text{ext}}(A)$។
៣. គណនា Morphological Gradient $G(A)$។`,
    matrixA: [
      [0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0]
    ],
    matrixB: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    questions: [
      {
        qNum: 1,
        titleEn: "1. Dilation (A ⊕ B) and Erosion (A ⊖ B)",
        titleKh: "១. គណនា Dilation (A ⊕ B) និង Erosion (A ⊖ B)",
        explanationKh: `Dilation (A ⊕ B): ពង្រីកតំបន់លេខ 1។ ឱ្យតែផ្ចិតរបស់ B ជាន់ចំលេខ 1 ណាមួយរបស់ A នោះគ្រប់ទីតាំងជុំវិញរបស់ B នឹងត្រូវលាបទៅជា 1។
Erosion (A ⊖ B): បង្រួញតំបន់លេខ 1។ លទ្ធផលបាន 1 លុះត្រាតែគ្រប់ទីតាំងរបស់ B ដែលមានតម្លៃ 1 ត្រូវ Fit លើលេខ 1 របស់ A ទាំងអស់។`,
        steps: [
          {
            stepEn: "Dilation result: Expands 1s into adjacent positions",
            stepKh: "លទ្ធផល Dilation៖ រីកសាយភាយលេខ 1 ទៅកាន់កោសិកាជាប់គ្នា",
            math: `A \\oplus B = \\begin{bmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\end{bmatrix}`
          },
          {
            stepEn: "Erosion result: No 3x3 cross fits completely inside A's 1s, so all cells are 0",
            stepKh: "លទ្ធផល Erosion៖ គ្មានទីតាំងណាដែលមានរាងជាសញ្ញាបូក [1] សុទ្ធនៅក្នុង A ឡើយ ដូច្នេះលទ្ធផលស្មើ 0 ទាំងអស់",
            math: `A \\ominus B = \\begin{bmatrix} 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{bmatrix}`
          }
        ],
        finalAnswerEn: "$A \\oplus B$ is expanded matrix; $A \\ominus B$ is all zeros.",
        finalAnswerKh: "$A \\oplus B$ ទទួលបាន Matrix រីកធំ; $A \\ominus B$ គឺសូន្យទាំងអស់ (All zeros)។"
      },
      {
        qNum: 2,
        titleEn: "2. Internal & External Boundaries",
        titleKh: "២. គណនា Internal Boundary និង External Boundary",
        explanationKh: `Internal Boundary: គឺជាខ្សែបន្ទាត់គែមខាងក្នុងវត្ថុដើម βint(A) = A - (A ⊖ B)
External Boundary: គឺជាខ្សែបន្ទាត់គែមព័ទ្ធជុំវិញខាងក្រៅវត្ថុដើម βext(A) = (A ⊕ B) - A`,
        steps: [
          {
            stepEn: "Internal boundary calculation: A - (A ⊖ B) = A - 0 = A",
            stepKh: "គណនា Internal Boundary៖ យក A ដកនឹង Erosion (A ⊖ B)",
            math: `\\beta_{\\text{int}}(A) = A - 0 = \\begin{bmatrix} 0 & 0 & 0 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 1 & 1 & 0 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\end{bmatrix}`
          },
          {
            stepEn: "External boundary calculation: (A ⊕ B) - A",
            stepKh: "គណនា External Boundary៖ យក Dilation ដកនឹង A",
            math: `\\beta_{\\text{ext}}(A) = (A \\oplus B) - A = \\begin{bmatrix} 0 & 1 & 1 & 0 & 1 \\\\ 1 & 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 1 & 0 & 0 & 0 & 1 \\\\ 0 & 1 & 0 & 0 & 1 \\end{bmatrix}`
          }
        ],
        finalAnswerEn: "Internal boundary equals $A$; External boundary forms the outer border shell.",
        finalAnswerKh: "Internal Boundary គឺស្មើនឹង $A$ ទាំងស្រុង; External Boundary បង្កើតជាសំបកព័ទ្ធជុំវិញ $A$។"
      },
      {
        qNum: 3,
        titleEn: "3. Morphological Gradient",
        titleKh: "៣. គណនា Morphological Gradient",
        explanationKh: `Morphological Gradient (G): វាស់វែងគម្លាតរវាងការរីក និងការរួម ដើម្បីទាញយកខ្សែបន្ទាត់គែមរួម G = (A ⊕ B) - (A ⊖ B)។`,
        steps: [
          {
            stepEn: "Calculate (A ⊕ B) - (A ⊖ B)",
            stepKh: "គណនា (A ⊕ B) - (A ⊖ B)",
            math: `G = (A \\oplus B) - 0 = \\begin{bmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 1 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\end{bmatrix}`
          }
        ],
        finalAnswerEn: "Gradient $G = A \\oplus B$.",
        finalAnswerKh: "Morphological Gradient $G = A \\oplus B$ (ដោយសារ Erosion ស្មើ 0)។"
      }
    ],
    interactiveLab: "morphology"
  },
  {
    id: 8,
    titleEn: "Exercise 8: Morphology with Non-Symmetric 2x2 Structuring Element",
    titleKh: "លំហាត់ទី ៨៖ Morphology ជាមួយ Structuring Element មិនស៊ីមេទ្រី 2x2 (Origin នៅជ្រុងលើឆ្វេង)",
    topic: "Mathematical Morphology",
    difficulty: "Hard",
    badgeColor: "pink",
    problemEn: `Given a binary image $A$ ($4\\times 5$) and a structuring element $S$ ($2\\times 2$, origin underlined at top-left):
$$A = \\begin{bmatrix} 0 & 1 & 1 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 1 \\end{bmatrix}_{4\\times 5} \\quad \\text{and} \\quad S = \\begin{bmatrix} \\underline{1} & 1 \\\\ 0 & 1 \\end{bmatrix}_{2\\times 2}$$

1. Compute the Dilation $A \\oplus S$ and the Erosion $A \\ominus S$.
2. Compute the Internal boundary $\\beta_{\\text{int}}$ and External boundary $\\beta_{\\text{ext}}$.
3. Compute the Morphological Gradient $G(A)$.`,
    problemKh: `គេឱ្យរូបភាព Binary $A$ ទំហំ 4x5 និង Structuring Element $S$ ទំហំ 2x2 (មាន Origin នៅជ្រុងលើខាងឆ្វេង (1)):
$$A = \\begin{bmatrix} 0 & 1 & 1 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 1 \\end{bmatrix}_{4\\times 5} \\quad \\text{និង} \\quad S = \\begin{bmatrix} \\underline{1} & 1 \\\\ 0 & 1 \\end{bmatrix}_{2\\times 2}$$

១. គណនា Dilation $A \\oplus S$ និង Erosion $A \\ominus S$។
២. គណនា Internal Boundary $\\beta_{\\text{int}}$ និង External Boundary $\\beta_{\\text{ext}}$។
៣. គណនា Morphological Gradient $G$។`,
    matrixA: [
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1]
    ],
    matrixS: [
      [1, 1],
      [0, 1]
    ],
    originS: { r: 0, c: 0 },
    questions: [
      {
        qNum: 1,
        titleEn: "1. Dilation (A ⊕ S) & Erosion (A ⊖ S) with Asymmetric Origin",
        titleKh: "១. គណនា Dilation (A ⊕ S) និង Erosion (A ⊖ S)",
        explanationKh: `លំហាត់នេះប្រើប្រាស់ Structuring Element មិនស៊ីមេទ្រី និងមានផ្ចិត (Origin) នៅជ្រុងលើខាងឆ្វេង (1)៖
- Dilation: រាល់ពេលដែល Origin ប៉ះចំលេខ 1 របស់ A វានឹងលាបកោសិកានៅខាងស្តាំ និងកោសិកានៅក្រោមស្តាំ ឱ្យទៅជា 1 ដែរ។
- Erosion: ផ្ចិតទទួលបាន 1 លុះត្រាតែទីតាំង Origin, ខាងស្តាំ, និងក្រោមស្តាំ សុទ្ធតែជា 1 ទាំងអស់ក្នុង A។`,
        steps: [
          {
            stepEn: "Dilation result A ⊕ S",
            stepKh: "លទ្ធផល Dilation A ⊕ S",
            math: `A \\oplus S = \\begin{bmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix}`
          },
          {
            stepEn: "Erosion result A ⊖ S (Matches pattern [[1,1],[*,1]])",
            stepKh: "លទ្ធផល Erosion A ⊖ S (រកទីតាំងដែលត្រូវនឹងលំនាំ [[1,1],[0,1]])",
            math: `A \\ominus S = \\begin{bmatrix} 0 & 1 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{bmatrix}`
          }
        ],
        finalAnswerEn: "$$A \\oplus S = \\begin{bmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix}, \\quad A \\ominus S = \\begin{bmatrix} 0 & 1 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{bmatrix}$$",
        finalAnswerKh: "លទ្ធផល $A \\oplus S$ និង $A \\ominus S$ ដូចសមីការខាងលើ។"
      },
      {
        qNum: 2,
        titleEn: "2. Internal & External Boundary with Asymmetric SE",
        titleKh: "២. គណនា Internal Boundary និង External Boundary",
        steps: [
          {
            stepEn: "Internal Boundary: βint = A - (A ⊖ S)",
            stepKh: "Internal Boundary៖ βint = A - (A ⊖ S)",
            math: `\\beta_{\\text{int}}(A) = \\begin{bmatrix} 0 & 1 & 1 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 1 \\end{bmatrix} - \\begin{bmatrix} 0 & 1 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 1 \\end{bmatrix}`
          },
          {
            stepEn: "External Boundary: βext = (A ⊕ S) - A",
            stepKh: "External Boundary៖ βext = (A ⊕ S) - A",
            math: `\\beta_{\\text{ext}}(A) = \\begin{bmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix} - \\begin{bmatrix} 0 & 1 & 1 & 1 & 0 \\\\ 0 & 1 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 & 0 & 0 & 1 \\\\ 0 & 0 & 0 & 0 & 1 \\\\ 0 & 1 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 1 & 0 \\end{bmatrix}`
          }
        ],
        finalAnswerEn: "Internal and External boundaries calculated accurately.",
        finalAnswerKh: "Internal Boundary និង External Boundary ត្រូវបានគណនាដូចបង្ហាញខាងលើ។"
      },
      {
        qNum: 3,
        titleEn: "3. Morphological Gradient",
        titleKh: "៣. គណនា Morphological Gradient",
        steps: [
          {
            stepEn: "Gradient: G = (A ⊕ S) - (A ⊖ S)",
            stepKh: "Gradient៖ G = (A ⊕ S) - (A ⊖ S)",
            math: `G = \\begin{bmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix} - \\begin{bmatrix} 0 & 1 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 & 0 & 1 & 1 \\\\ 0 & 1 & 0 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix}`
          }
        ],
        finalAnswerEn: "$$G = \\begin{bmatrix} 0 & 0 & 0 & 1 & 1 \\\\ 0 & 1 & 0 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix}$$",
        finalAnswerKh: "Morphological Gradient G ចុងក្រោយ៖ $$G = \\begin{bmatrix} 0 & 0 & 0 & 1 & 1 \\\\ 0 & 1 & 0 & 1 & 1 \\\\ 0 & 1 & 1 & 1 & 1 \\\\ 0 & 0 & 1 & 1 & 1 \\end{bmatrix}$$"
      }
    ],
    interactiveLab: "morphology"
  }
];
