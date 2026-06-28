/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserState, Task, DailyLog, Badge, Goal, Note, WeeklyReview, RoadmapSection, StudyModule, Reminder } from '../types';

const LOCAL_STORAGE_KEY = "saburs_journey_state_v1";

export const DEFAULT_TASKS: Task[] = [
  { id: 'workout', name: 'Active Fitness Workout', category: 'health', completed: false },
  { id: 'jog', name: 'Morning Jog & Cardio', category: 'health', completed: false },
  { id: 'threejs', name: 'Three.js Learning Core (1 hour)', category: 'study', completed: false },
  { id: 'frontend', name: 'Frontend Growth Study (1 hour)', category: 'study', completed: false },
  { id: 'sleep', name: 'Bedtime Routine Before 11 PM', category: 'routine', completed: false },
  { id: 'water', name: 'Drink 8 Glasses of Water', category: 'routine', completed: false }
];

const INITIAL_ROADMAP_THREEJS: RoadmapSection[] = [
  {
    phase: "Phase 1: Months 1-3",
    title: "The WebGL Foundation",
    timeline: "Months 1-3",
    status: "completed",
    modules: [
      { id: 't1', title: 'Scene, Camera & Renderer Setup', duration: '12h', completed: true, topics: ['Creating dynamic Scenes', 'Perspective vs Orthographic Camera', 'WebGLRenderer and resizing'] },
      { id: 't2', title: 'Geometry & Custom Meshes', duration: '15h', completed: true, topics: ['Box, Sphere, Torus shapes', 'BufferGeometry and vertices', 'Efficient material assignments'] },
      { id: 't3', title: 'Lighting & Shadows', duration: '14h', completed: true, topics: ['Ambient, Directional, Point lights', 'Shadow mapping & bias', 'Performance implications'] },
      { id: 't4', title: 'Vectors & Trigonometry', duration: '10h', completed: true, topics: ['Vector3 manipulation', 'Dot & Cross products', 'Dynamic movement using sine & cosine'] }
    ]
  },
  {
    phase: "Phase 2: Months 4-6",
    title: "Materials, Physics & Animation",
    timeline: "Months 4-6",
    status: "active",
    modules: [
      { id: 't5', title: 'Advanced Materials & Shading', duration: '16h', completed: true, topics: ['MeshStandardMaterial', 'Roughness, Metalness, Normal maps', 'Custom shaders introductions'] },
      { id: 't6', title: 'High-Res Textures & Lighting Maps', duration: '14h', completed: false, topics: ['Mipmapping and filtering', 'HDR environment maps', 'Shadow and baking maps'] },
      { id: 't7', title: 'Loading 3D Models (GLTF, FBX)', duration: '18h', completed: false, topics: ['GLTFLoader, DRACO compression', 'Animation mixer and bones', 'Model optimization in Blender'] },
      { id: 't8', title: 'Micro-Interactions with GSAP', duration: '12h', completed: false, topics: ['Timeline animations', 'ScrollTrigger integration', 'Raycasting hover/click events'] }
    ]
  },
  {
    phase: "Phase 3: Months 7-9",
    title: "Custom GLSL & Procedural Worlds",
    timeline: "Months 7-9",
    status: "locked",
    modules: [
      { id: 't9', title: 'Custom Shaders (GLSL)', duration: '24h', completed: false, topics: ['Vertex and Fragment shaders', 'Uniforms, Attributes, Varyings', 'Passing matrix positions'] },
      { id: 't10', title: 'Noise & Mathematical displacement', duration: '20h', completed: false, topics: ['Perlin & Simplex noise', 'Animated wave terrains', 'Procedural skyboxes and clouds'] },
      { id: 't11', title: 'Procedural Shader Effects', duration: '22h', completed: false, topics: ['Raymarching intro', 'Custom post-processing composer', 'Depth of field and blooms'] }
    ]
  },
  {
    phase: "Phase 4: Months 10-12",
    title: "The Ultimate Showcase Project",
    timeline: "Months 10-12",
    status: "locked",
    modules: [
      { id: 't12', title: 'Journey Portfolio Masterpiece', duration: '50h', completed: false, topics: ['Creative 3D grid layout', 'Physics-based menu scrolling', 'Optimized shader backgrounds', 'Sound integration'] }
    ]
  }
];

const INITIAL_ROADMAP_FRONTEND: StudyModule[] = [
  { id: 'f1', title: 'Advanced JavaScript Deep-Dive', duration: '18h', completed: true, topics: ['Event Loop, Microtasks & Macrotasks', 'Closures & Scope Chain', 'Prototypal Inheritance & Proxy objects'] },
  { id: 'f2', title: 'TypeScript for UI Engineers', duration: '16h', completed: true, topics: ['Generic types & Constraints', 'Mapped types & Conditonals', 'Utility types & sound configuration'] },
  { id: 'f3', title: 'React 19 Hooks & Rendering', duration: '20h', completed: true, topics: ['React compiler and auto-memoization', 'Concurrent features: transitions, useActionState', 'Server components hydration'] },
  { id: 'f4', title: 'Next.js 15 App Router Architecture', duration: '24h', completed: false, topics: ['Nested layouts & Streaming UI', 'Server actions & Middleware security', 'Static vs dynamic optimization'] },
  { id: 'f5', title: 'Performance Optimization Patterns', duration: '18h', completed: false, topics: ['Core Web Vitals acceleration', 'Image/Font loader optimization', 'Virtual routing and light bundle sizes'] }
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

// Seed historical logs helper: Backfill past 14 days
const generateSeedHistory = (currentDate: Date): DailyLog[] => {
  const history: DailyLog[] = [];
  const daysToSeed = 15; // Log past 15 days of progressive entries

  for (let i = daysToSeed; i >= 1; i--) {
    const seedDate = new Date(currentDate);
    seedDate.setDate(currentDate.getDate() - i);
    const dateString = seedDate.toISOString().split('T')[0];

    // Some completion variance to make heatmap realistic
    const completionSeed = (i % 3 === 0) ? 0.6 : (i % 5 === 0) ? 0.5 : 1.0; 
    const isFullCompletion = completionSeed === 1.0;

    const tasks: Task[] = DEFAULT_TASKS.map(t => {
      // Toggle completed based on seed completion rate
      let comp = isFullCompletion;
      if (!isFullCompletion) {
        if (t.id === 'workout') comp = i % 2 === 0;
        if (t.id === 'jog') comp = i % 2 !== 0;
        if (t.id === 'threejs') comp = i % 3 !== 0; // Study mostly done
        if (t.id === 'frontend') comp = i % 4 !== 0;
        if (t.id === 'sleep') comp = i % 3 === 0;
        if (t.id === 'water') comp = true;
      }
      return { ...t, completed: comp };
    });

    history.push({
      date: dateString,
      tasks,
      studyHours: {
        threejs: isFullCompletion ? 1 : (i % 3 !== 0 ? 1 : 0),
        frontend: isFullCompletion ? 1 : (i % 4 !== 0 ? 1 : 0),
      },
      completedAt: isFullCompletion ? seedDate.toISOString() : undefined,
      customNotes: i % 4 === 0 ? `Finished module practice under Phase ${i % 2 === 0 ? '1' : '2'}. Got physics demo working smoothly!` : undefined
    });
  }

  return history;
};

export const getInitialState = (): UserState => {
  const currentDate = new Date();
  const seedLogs = generateSeedHistory(currentDate);

  // Calculate some realistic accumulated stats based on seed logs
  const totalThreejs = seedLogs.reduce((acc, curr) => acc + curr.studyHours.threejs, 25); // Include a buffer of 25 existing completed studies
  const totalFrontend = seedLogs.reduce((acc, curr) => acc + curr.studyHours.frontend, 30); // Buffer of 30

  // Standard streak calculation
  const streak = 6; // Set active streak count to 6 so completing today earns the 7-day badge! Perfect onboarding.
  const longestStreak = 12;

  // Level & XP based on accumulated hours and completions:
  // Completing 1 task = 10 XP, Completed day = 50 bonus XP, logged hour = 20 XP
  const calculatedXP = (seedLogs.length * 120) + 1200; // Let's seed around 2800 XP
  const level = Math.floor(calculatedXP / 500) + 1; // 500 XP per level

  const defaultGoals: Goal[] = [
    { id: '1', text: "Complete Three.js Months 1-3 Core WebGL modules", deadline: "2026-07-31", tag: 'threejs', completed: true },
    { id: '2', text: "Deploy WebGL-integrated interactive Resume Showcase", deadline: "2026-08-15", tag: 'portfolio', completed: false },
    { id: '3', text: "Perfect standard React 19 concurrent hydration pipeline metrics", deadline: "2026-09-01", tag: 'career', completed: false },
    { id: '4', text: "Achieve consistent morning jog rhythm: 5km visual log tracker", deadline: "2026-07-20", tag: 'fitness', completed: false }
  ];

  const defaultNotes: Note[] = [
    {
      id: "n-1",
      title: "Three.js - Vector Mathematics Cheat Sheet",
      content: `### Essential Vector Operations for Creative Frontends \n\n*   **Vector displacement**: Use \`position.add(direction.multiplyScalar(speed))\` inside the tick/render loop animate meshes. \n*   **Trigonometric Cycles**: Applying standard \`Math.sin(elapsedTime * scale)\` creates gorgeous floaty waves for custom camera heights.\n*   **Camera focus**: Bind mouse coordinates smoothly using lerps:\n    \`\`\`js\n    camera.position.x += (mouseX - camera.position.x) * 0.05;\n    \`\`\`\n`,
      updatedAt: new Date(currentDate.getTime() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: "n-2",
      title: "Self-Review Plan & React 19 Performance",
      content: `### Target Milestones for Sabur's Creative Path\n\n1.  Master React 19 compile hooks: \`useActionState\`, \`useFormStatus\`, and async transition buffers.\n2.  Study how to bake ambient occlusion maps in Blender to reduce expensive real-time shadows.\n3.  Build custom GLSL wave animations to serve as modular site headers.`,
      updatedAt: new Date(currentDate.getTime() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const defaultWeeklyReviews: WeeklyReview[] = [
    {
      id: "wr-1",
      weekRange: "June 08 - June 14",
      wins: [
        "Completed baseline Three.js renderer configurations",
        "Achieved 100% hydration check on most days",
        "Set up standard GitHub repository structure"
      ],
      challenges: [
        "Struggled to sleep before 11 PM on Wednesday during shader deep-dives.",
        "Need better scheduling to avoid fitting jog late"
      ],
      focusNextWeek: "Transition into Materials and standard Baked textures in Three.js framework.",
      energyLevel: 8
    }
  ];

  // Process achievements unlock statuses based on seed initial values
  const processInitialBadges = [...ALL_BADGES];
  // 6 cumulative days streak, plus total study cumulative hours
  if (totalThreejs + totalFrontend >= 50) {
    const badge = processInitialBadges.find(b => b.id === 'hours_50');
    if (badge) badge.unlockedAt = new Date().toISOString();
  }

  const defaultReminders: Reminder[] = [
    { id: '1', time: '21:00', label: 'Three.js Learning Time', enabled: true, message: 'Time to open VS Code and deep-dive into camera/renderer matrices!' },
    { id: '2', time: '22:00', label: 'Frontend Learning Time', enabled: true, message: 'Focus cycle: Study React concurrent hydration performance optimization.' },
    { id: '3', time: '23:00', label: 'Sleep Time Routine', enabled: true, message: 'Save your files, drink water, and sleep for maximum neural recovery!' }
  ];

  return {
    level,
    xp: calculatedXP,
    streak,
    longestStreak,
    totalHoursThreejs: totalThreejs,
    totalHoursFrontend: totalFrontend,
    waterIntakeGlassToday: 3, // Start today at 3 glasses
    waterGoalGlasses: 8,
    history: seedLogs,
    goals: defaultGoals,
    notes: defaultNotes,
    weeklyReviews: defaultWeeklyReviews,
    roadmapThreejs: INITIAL_ROADMAP_THREEJS,
    roadmapFrontend: INITIAL_ROADMAP_FRONTEND,
    reminders: defaultReminders
  };
};

export const loadUserState = (): UserState => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Double check date offsets to handle active logs migration
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load user state from localStorage", error);
  }
  return getInitialState();
};

export const saveUserState = (state: UserState): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state to LocalStorage", error);
  }
};
