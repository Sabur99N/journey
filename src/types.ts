/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Reminder {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  message: string;
}

export interface Task {
  id: string;
  name: string;
  category: 'health' | 'study' | 'routine';
  completed: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  tasks: Task[];
  studyHours: {
    threejs: number;
    frontend: number;
  };
  customNotes?: string;
  completedAt?: string; // ISO string if all done
}

export interface BrainQuote {
  text: string;
  author: string;
  category: 'creative' | 'technical' | 'focus';
}

export interface StudyModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  topics: string[];
}

export interface RoadmapSection {
  phase: string;
  title: string;
  timeline: string;
  status: 'locked' | 'active' | 'completed';
  modules: StudyModule[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt: string | null;
  requirementDays: number;
}

export interface Goal {
  id: string;
  text: string;
  deadline: string;
  tag: 'threejs' | 'portfolio' | 'career' | 'fitness';
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface WeeklyReview {
  id: string;
  weekRange: string; // e.g. "June 15 - June 21"
  wins: string[];
  challenges: string[];
  focusNextWeek: string;
  energyLevel: number; // 1-10
}

export interface UserState {
  level: number;
  xp: number;
  streak: number;
  longestStreak: number;
  totalHoursThreejs: number;
  totalHoursFrontend: number;
  waterIntakeGlassToday: number;
  waterGoalGlasses: number;
  history: DailyLog[]; // Historical logs
  goals: Goal[];
  notes: Note[];
  weeklyReviews: WeeklyReview[];
  roadmapThreejs: RoadmapSection[];
  roadmapFrontend: StudyModule[];
  reminders: Reminder[];
}
