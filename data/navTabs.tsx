import React from 'react';
import { Layers, BookOpen, FlaskConical, GraduationCap, Code2, Cpu, Sparkles } from 'lucide-react';
import { MainTab } from '@/types';

export interface NavTabDef {
  id: MainTab;
  labelEn: string;
  labelKh: string;
  icon: React.ReactNode;
}

// Canonical recommended learning order, shared by the top navbar and the
// per-tab "previous / next" footer so both always agree on what's next.
export const NAV_TABS: NavTabDef[] = [
  { id: 'beginner', labelEn: '🌱 Beginner 101', labelKh: '🌱 មូលដ្ឋានគ្រឹះ 101', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
  { id: 'overview', labelEn: 'Overview & Formulas', labelKh: 'ទិដ្ឋភាពទូទៅ & រូបមន្ត', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'matrix', labelEn: 'All Matrices Masterclass', labelKh: 'មេរៀន Matrix គ្រប់ប្រភេទ', icon: <Cpu className="w-4 h-4" /> },
  { id: 'exercises', labelEn: '8 Worked Exercises', labelKh: 'ដំណោះស្រាយលំហាត់ទាំង ៨', icon: <Layers className="w-4 h-4" /> },
  { id: 'labs', labelEn: 'Interactive Labs', labelKh: 'បន្ទប់ពិសោធន៍ Simulation', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'exam', labelEn: 'Exam Prep & Quiz', labelKh: 'ប្រឡងសាកល្បង & Quiz', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'python', labelEn: 'Python & OpenCV Hub', labelKh: 'មជ្ឈមណ្ឌល Python & OpenCV', icon: <Code2 className="w-4 h-4" /> }
];
