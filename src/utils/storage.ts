/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserState, Task, DailyLog, Badge, Goal, Note, WeeklyReview, RoadmapSection, StudyModule, Reminder } from '../types';

const LOCAL_STORAGE_KEY = "saburs_journey_state_v2"; // Incremented to wipe old state

export const DEFAULT_TASKS: Task[] = [
  { id: 'jog', name: '06:20 Walk/Jog', category: 'health', completed: false },
  { id: 'workout', name: '07:00 Workout', category: 'health', completed: false },
  { id: 'threejs', name: '21:00 Three.js Learning Block', category: 'study', completed: false },
  { id: 'frontend', name: '22:00 Frontend Learning Block', category: 'study', completed: false },
  { id: 'sleep', name: '23:00 Sleep', category: 'routine', completed: false }
];

const INITIAL_ROADMAP_THREEJS: RoadmapSection[] = [
  {
    phase: "Phase 1: Months 1-3",
    title: "The WebGL Foundation",
    timeline: "Months 1-3",
    status: "active",
    modules: [
      { id: 't1', title: 'Scene, Camera, Renderer', duration: '20h', completed: false, topics: ['Basic Setup', 'Canvas resizing', 'Render loops'] },
      { id: 't2', title: 'Geometry & Custom Meshes', duration: '15h', completed: false, topics: ['Box, Sphere, Torus', 'BufferGeometry'] },
      { id: 't3', title: 'Lighting & Shadows', duration: '14h', completed: false, topics: ['Ambient, Directional, Point', 'Shadow maps'] },
      { id: 't4', title: 'Vectors & Math', duration: '10h', completed: false, topics: ['Vector3 manipulation', 'Trigonometry basics'] }
    ]
  },
  {
    phase: "Phase 2: Months 4-6",
    title: "Materials, Models & Animation",
    timeline: "Months 4-6",
    status: "locked",
    modules: [
      { id: 't5', title: 'Materials & Textures', duration: '20h', completed: false, topics: ['StandardMaterial', 'Normal Maps', 'Roughness'] },
      { id: 't6', title: 'Models & Optimization', duration: '15h', completed: false, topics: ['GLTF Loader', 'DRACO compression'] },
      { id: 't7', title: 'GSAP Integrations', duration: '15h', completed: false, topics: ['ScrollTrigger', 'Timelines', 'Camera animation'] }
    ]
  },
  {
    phase: "Phase 3: Months 7-9",
    title: "Custom GLSL & Procedural Worlds",
    timeline: "Months 7-9",
    status: "locked",
    modules: [
      { id: 't8', title: 'Custom Shaders (GLSL)', duration: '24h', completed: false, topics: ['Vertex and Fragment shaders', 'Uniforms'] },
      { id: 't9', title: 'Noise & Mathematics', duration: '20h', completed: false, topics: ['Perlin noise', 'Wave displacement'] },
      { id: 't10', title: 'Procedural Effects', duration: '22h', completed: false, topics: ['Post-processing', 'Raymarching intro'] }
    ]
  },
  {
    phase: "Phase 4: Months 10-12",
    title: "The Ultimate Showcase Project",
    timeline: "Months 10-12",
    status: "locked",
    modules: [
      { id: 't11', title: 'Portfolio Journey Project', duration: '50h', completed: false, topics: ['Creative 3D grid layout', 'Physics', 'Optimization'] }
    ]
  }
];

const INITIAL_ROADMAP_FRONTEND: StudyModule[] = [
  { id: 'f1', title: 'JavaScript Deep Dive', duration: '20h', completed: false, topics: ['Event Loop', 'Closures', 'Prototypes', 'Performance'] },
  { id: 'f2', title: 'TypeScript Mastery', duration: '20h', completed: false, topics: ['Generics', 'Utility types', 'Advanced Inference'] },
  { id: 'f3', title: 'React Internals', duration: '25h', completed: false, topics: ['Reconciliation', 'Concurrent rendering', 'Hooks deep dive'] },
  { id: 'f4', title: 'Architecture and Performance', duration: '20h', completed: false, topics: ['Design Patterns', 'Core Web Vitals', 'Bundle sizing'] },
  { id: 'f5', title: 'Next.js and Production Systems', duration: '25h', completed: false, topics: ['App Router', 'Server Actions', 'Streaming'] }
];

export const ALL_BADGES: Badge[] = [
  { id: 'streak_7', title: 'Consistent Starter', description: 'Maintain a 7-day completion streak', icon: 'Flame', unlockedAt: null, requirementDays: 7 },
  { id: 'streak_30', title: 'Orbit Champion (30D)', description: 'Maintain a 30-day completion streak', icon: 'Award', unlockedAt: null, requirementDays: 30 },
  { id: 'streak_90', title: 'Frontend Centurion (90D)', description: 'Scale elite status with a 90-day streak', icon: 'Shield', unlockedAt: null, requirementDays: 90 },
  { id: 'streak_180', title: 'Space Traveler (180D)', description: 'Secure 180 days of active progress', icon: 'Compass', unlockedAt: null, requirementDays: 180 },
  { id: 'streak_365', title: 'Elite Creative Engineer (365D)', description: 'Master full 1-year elite cycle', icon: 'Crown', unlockedAt: null, requirementDays: 365 },
  { id: 'hours_50', title: 'Hyper Focus', description: 'Log a total of 50 cumulative hours of study', icon: 'Zap', unlockedAt: null, requirementDays: 50 },
  { id: 'water_master', title: 'Hydro Powered', description: 'Complete water goal 10 days in a row', icon: 'Droplet', unlockedAt: null, requirementDays: 10 }
];

export const getInitialState = (): UserState => {
  const currentDate = new Date();
  
  const defaultGoals: Goal[] = [
    { id: '1', text: "Study 2 focused hours daily.", deadline: "2027-01-01", tag: 'career', completed: false },
    { id: '2', text: "Build something every day.", deadline: "2027-01-01", tag: 'portfolio', completed: false },
    { id: '3', text: "Finish before starting something new.", deadline: "2027-01-01", tag: 'career', completed: false },
    { id: '4', text: "Stay consistent for 365 days.", deadline: "2027-01-01", tag: 'fitness', completed: false }
  ];

  const defaultNotes: Note[] = [
    {
      id: "n-1",
      title: "Sabur's Mission Statement",
      content: `Become a Creative Frontend Engineer with strong skills in Frontend Development, Three.js, GSAP, Shaders, and Interactive Storytelling. \n\n**Rules:**\n1. Study 2 focused hours daily.\n2. Build something every day.\n3. Finish before starting something new.\n4. Track Workout, Three.js, Frontend, Sleep.\n5. Stay consistent for 365 days.`,
      updatedAt: currentDate.toISOString()
    }
  ];

  const defaultReminders: Reminder[] = [
    { id: '1', time: '06:00', label: 'Wake up', enabled: true, message: 'Time to wake up! 06:05-06:20 Freshen up, water, mobility.' },
    { id: '2', time: '06:20', label: 'Walk/Jog', enabled: true, message: 'Get outside for your morning Walk/Jog.' },
    { id: '3', time: '07:00', label: 'Workout', enabled: true, message: 'Time to crush the workout block.' },
    { id: '4', time: '21:00', label: 'Three.js Learning Block', enabled: true, message: 'Time to focus on 3D, WebGL, and Three.js!' },
    { id: '5', time: '22:00', label: 'Frontend Learning Block', enabled: true, message: 'Focus cycle: Deep dive into Frontend Architecture.' },
    { id: '6', time: '23:00', label: 'Sleep', enabled: true, message: 'Rest and recover for tomorrow.' }
  ];

  return {
    level: 1,
    xp: 0,
    streak: 0,
    longestStreak: 0,
    totalHoursThreejs: 0,
    totalHoursFrontend: 0,
    waterIntakeGlassToday: 0,
    waterGoalGlasses: 8,
    history: [], // Start completely fresh
    goals: defaultGoals,
    notes: defaultNotes,
    weeklyReviews: [],
    roadmapThreejs: INITIAL_ROADMAP_THREEJS,
    roadmapFrontend: INITIAL_ROADMAP_FRONTEND,
    reminders: defaultReminders
  };
};

export const loadUserState = (): UserState => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load user state", error);
  }
  return getInitialState();
};

export const saveUserState = (state: UserState): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state", error);
  }
};
