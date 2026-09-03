export type Language = 'en' | 'kh';

export type MainTab = 'beginner' | 'overview' | 'exercises' | 'labs' | 'matrix' | 'exam' | 'python';

export interface ExerciseStep {
  stepEn: string;
  stepKh: string;
  math: string;
}

export interface ExerciseQuestion {
  qNum: number;
  titleEn: string;
  titleKh: string;
  explanationKh?: string;
  formula?: string;
  steps?: ExerciseStep[];
  finalAnswerEn: string;
  finalAnswerKh: string;
}

export interface Exercise {
  id: number;
  titleEn: string;
  titleKh: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  badgeColor: string;
  problemEn: string;
  problemKh: string;
  matrixI?: number[][];
  kernelH?: number[][];
  rgbInput?: { r: number; g: number; b: number };
  codeSnippet?: string;
  keyConceptsKh?: string[];
  matrixA?: number[][];
  matrixB?: number[][];
  matrixS?: number[][];
  originS?: { r: number; c: number };
  questions?: ExerciseQuestion[];
  interactiveLab?: 'spatial' | 'color' | 'morphology';
}

export interface QuizQuestion {
  type: 'spatial' | 'color' | 'morphology';
  titleEn: string;
  titleKh: string;
  promptEn: string;
  promptKh: string;
  options: string[];
  correctAnswer: string;
  solutionEn: string;
  solutionKh: string;
}
