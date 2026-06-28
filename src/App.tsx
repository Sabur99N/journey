/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Flame, 
  Award,
  BookOpen, 
  Printer, 
  Bookmark, 
  History,
  FileText,
  Volume2,
  CalendarDays
} from 'lucide-react';
import { UserState, Task, Note, Goal, WeeklyReview } from './types';
import { loadUserState, saveUserState, DEFAULT_TASKS } from './utils/storage';

// Component imports
import { Navigation, TabId } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { StudySections } from './components/StudySections';
import { HabitTracker } from './components/HabitTracker';
import { Reminders } from './components/Reminders';
import { NotebookAndWeekly } from './components/NotebookAndWeekly';
import { Roadmap } from './components/Roadmap';
import { Gamification } from './components/Gamification';

export default function App() {
  const [state, setState] = useState<UserState>(() => loadUserState());
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [showInstallPromptButton, setShowInstallPromptButton] = useState(false);

  // Success Celebration Overlay State
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  // Sync PWA Install Listeners
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent standard Mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPromptButton(true);
    };

    const handleAppInstalled = () => {
      setPwaInstalled(true);
      setShowInstallPromptButton(false);
      setDeferredPrompt(null);
      console.log("Sabur's Journey installed successfully on desktop/device!");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Initial check
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPwaInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Save changes to localStorage on state adjustment
  useEffect(() => {
    saveUserState(state);
  }, [state]);

  // Global Notification Scheduler
  useEffect(() => {
    // Check every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;
      
      // We also check seconds to avoid firing multiple times in the same minute
      // Only fire within the first 5 seconds of the minute
      if (now.getSeconds() < 5) {
        state.reminders?.forEach(rem => {
          if (rem.enabled && rem.time === currentTimeString) {
            triggerNotificationAlert(rem);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.reminders]);

  const triggerNotificationAlert = (rem: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const opt: NotificationOptions = {
        body: rem.message,
        icon: "https://img.icons8.com/nolan/256/space-port.png",
        tag: rem.id,
        requireInteraction: true
      };
      
      new Notification(`Sabur's Journey: ${rem.label}`, opt);
      // Play synthesis sound
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(`Reminder: ${rem.label}. ${rem.message}`);
        synth.speak(utter);
      }
    }
  };

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    
    // Play synthesis voice celebration if allowed
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance("Congratulations, Sabur! Daily matrix completed! Streak upgraded and 50 XP logged to master track.");
      synth.speak(utter);
    }

    setTimeout(() => {
      setShowCelebration(false);
    }, 5500);
  };

  // 1. Routine checklist toggle action
  const handleToggleTask = (taskId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      const historyCopy = [...prev.history];
      let todayLog = historyCopy[historyCopy.length - 1];

      // fallback helper
      if (!todayLog || todayLog.date !== todayStr) {
        todayLog = {
          date: todayStr,
          tasks: DEFAULT_TASKS.map(t => ({ ...t, completed: false })),
          studyHours: { threejs: 0, frontend: 0 }
        };
        historyCopy.push(todayLog);
      }

      // Update task status inside current log
      const updatedTasks = todayLog.tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, completed: !t.completed };
        }
        return t;
      });

      // Check if all routines completed right now
      const totalRoutines = updatedTasks.length;
      const completedRoutinesNow = updatedTasks.filter(t => t.completed).length;
      const wasAllAlreadyCompleted = todayLog.completedAt !== undefined;
      const becameAllCompleted = completedRoutinesNow === totalRoutines;

      let newStreak = prev.streak;
      let newLongest = prev.longestStreak;
      let newXP = prev.xp;
      let dateStringCompleted: string | undefined = todayLog.completedAt;

      if (becameAllCompleted && !wasAllAlreadyCompleted) {
        newStreak += 1;
        newLongest = Math.max(newLongest, newStreak);
        newXP += 100; // Large streak-completion XP bonus!
        dateStringCompleted = new Date().toISOString();
        // Delay to allow state render
        setTimeout(() => triggerCelebration("MEGA MATRIX CONVERGENCE! +100 XP"), 250);
      } else if (!becameAllCompleted && wasAllAlreadyCompleted) {
        newStreak = Math.max(0, newStreak - 1);
        dateStringCompleted = undefined;
      } else {
        // Normal task toggle XP bonus
        const taskObj = todayLog.tasks.find(t => t.id === taskId);
        const addedValue = taskObj ? (!taskObj.completed ? 15 : -15) : 15;
        newXP = Math.max(0, newXP + addedValue);
      }

      const calculatedLevel = Math.floor(newXP / 500) + 1;

      // Update log reference
      const updatedLog = {
        ...todayLog,
        tasks: updatedTasks,
        completedAt: dateStringCompleted
      };
      
      historyCopy[historyCopy.length - 1] = updatedLog;

      return {
        ...prev,
        history: historyCopy,
        streak: newStreak,
        longestStreak: newLongest,
        xp: newXP,
        level: calculatedLevel
      };
    });
  };

  // 2. Add cumulative study hours directly
  const handleIncrementStudy = (category: 'threejs' | 'frontend', hours: number) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setState(prev => {
      const historyCopy = [...prev.history];
      let todayLog = historyCopy[historyCopy.length - 1];

      if (!todayLog || todayLog.date !== todayStr) {
        todayLog = {
          date: todayStr,
          tasks: DEFAULT_TASKS.map(t => ({ ...t, completed: false })),
          studyHours: { threejs: 0, frontend: 0 }
        };
        historyCopy.push(todayLog);
      }

      // Increment today's study metrics
      const currentHours = todayLog.studyHours[category] || 0;
      const updatedStudyHours = {
        ...todayLog.studyHours,
        [category]: currentHours + hours
      };

      // Also auto-complete the corresponding check box task!
      const taskIdToToggle = category === 'threejs' ? 'threejs' : 'frontend';
      const updatedTasks = todayLog.tasks.map(t => {
        if (t.id === taskIdToToggle) {
          return { ...t, completed: true }; // check off study
        }
        return t;
      });

      // Update cumulative values
      const cumThreejs = prev.totalHoursThreejs + (category === 'threejs' ? hours : 0);
      const cumFrontend = prev.totalHoursFrontend + (category === 'frontend' ? hours : 0);
      
      // Award nice study completion XP
      const addedXP = hours * 35;
      const finalXP = prev.xp + addedXP;
      const calculatedLevel = Math.floor(finalXP / 500) + 1;

      historyCopy[historyCopy.length - 1] = {
        ...todayLog,
        studyHours: updatedStudyHours,
        tasks: updatedTasks
      };

      return {
        ...prev,
        history: historyCopy,
        totalHoursThreejs: cumThreejs,
        totalHoursFrontend: cumFrontend,
        xp: finalXP,
        level: calculatedLevel
      };
    });
  };

  // 3. Hydrate state water logs + Auto-check off 'water' Daily checkbox task if water logs hit 8
  const handleIncrementWater = () => {
    setState(prev => {
      const currentVolume = prev.waterIntakeGlassToday;
      const targetVolume = prev.waterGoalGlasses;
      const newVolume = Math.min(targetVolume, currentVolume + 1);

      let historyCopy = [...prev.history];
      let todayStr = new Date().toISOString().split('T')[0];
      let todayLog = historyCopy[historyCopy.length - 1];

      if (!todayLog || todayLog.date !== todayStr) {
        todayLog = {
          date: todayStr,
          tasks: DEFAULT_TASKS.map(t => ({ ...t, completed: false })),
          studyHours: { threejs: 0, frontend: 0 }
        };
        historyCopy.push(todayLog);
      }

      // If hydration hit maximum goal:
      let updatedTasks = [...todayLog.tasks];
      if (newVolume >= targetVolume) {
        updatedTasks = todayLog.tasks.map(t => {
          if (t.id === 'water') {
            return { ...t, completed: true }; // Check off water checklists
          }
          return t;
        });
      }

      historyCopy[historyCopy.length - 1] = {
        ...todayLog,
        tasks: updatedTasks
      };

      // Award dynamic micro hydration XP!
      const bonusXP = 10;
      const finalXP = prev.xp + bonusXP;
      const finalLevel = Math.floor(finalXP / 500) + 1;

      return {
        ...prev,
        waterIntakeGlassToday: newVolume,
        history: historyCopy,
        xp: finalXP,
        level: finalLevel
      };
    });
  };

  const handleResetWater = () => {
    setState(prev => ({ ...prev, waterIntakeGlassToday: 0 }));
  };

  // 4. Milestone goal board manipulation
  const handleAddGoal = (text: string, tag: 'threejs' | 'portfolio' | 'career' | 'fitness') => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 day standard timeline
    const deadlineString = targetDate.toISOString().split('T')[0];

    const newGoalObj: Goal = {
      id: Math.random().toString(36).substring(7),
      text,
      tag,
      deadline: deadlineString,
      completed: false
    };

    setState(prev => ({
      ...prev,
      goals: [newGoalObj, ...prev.goals],
      xp: prev.xp + 20, // Goal creation bonus!
      level: Math.floor((prev.xp + 20) / 500) + 1
    }));
  };

  const handleToggleGoal = (id: string) => {
    setState(prev => {
      const updated = prev.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
      // Give goal completion boost (+50 XP!)
      const targetGoal = prev.goals.find(g => g.id === id);
      const wasComp = targetGoal?.completed || false;
      const addedXP = wasComp ? -50 : 50;

      const finalXP = Math.max(0, prev.xp + addedXP);
      const finalLevel = Math.floor(finalXP / 500) + 1;

      return {
        ...prev,
        goals: updated,
        xp: finalXP,
        level: finalLevel
      };
    });
  };

  const handleDeleteGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  // 5. Dev Notebook notebook logs
  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(7),
      title,
      content,
      updatedAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
  };

  const handleDeleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  // 6. Weekly Accountability Review logs
  const handleAddWeeklyReview = (wins: string[], challenges: string[], focusNextWeek: string, energyLevel: number) => {
    const currentReviewObj: WeeklyReview = {
      id: Math.random().toString(36).substring(7),
      weekRange: "Current Study Week",
      wins,
      challenges,
      focusNextWeek,
      energyLevel
    };

    setState(prev => ({
      ...prev,
      weeklyReviews: [currentReviewObj, ...prev.weeklyReviews],
      xp: prev.xp + 80, // Review submission accountability reward
      level: Math.floor((prev.xp + 80) / 500) + 1
    }));
  };

  // 7. Interactive tech curriculum roadmap check
  const handleToggleThreejsModule = (sectionPhase: string, moduleId: string) => {
    setState(prev => {
      const updatedRoadmap = prev.roadmapThreejs.map(section => {
        if (section.phase === sectionPhase) {
          const updatedModules = section.modules.map(m => {
            if (m.id === moduleId) {
              return { ...m, completed: !m.completed };
            }
            return m;
          });
          return { ...section, modules: updatedModules };
        }
        return section;
      });

      return {
        ...prev,
        roadmapThreejs: updatedRoadmap
      };
    });
  };

  const handleToggleFrontendModule = (moduleId: string) => {
    setState(prev => {
      const updatedRoadmap = prev.roadmapFrontend.map(m => {
        if (m.id === moduleId) {
          return { ...m, completed: !m.completed };
        }
        return m;
      });

      return {
        ...prev,
        roadmapFrontend: updatedRoadmap
      };
    });
  };

  // 8. Reminders toggle
  const handleToggleReminder = (id: string) => {
    setState(prev => {
      const updatedReminders = (prev.reminders || []).map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
      return {
        ...prev,
        reminders: updatedReminders
      };
    });
  };

  // 9. Export & Import Data
  const handleExportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `saburs_journey_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target?.result as string);
        if (importedState && importedState.history) {
          setState(importedState);
          triggerCelebration("Data backup imported successfully!");
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse the backup file.");
      }
    };
    reader.readAsText(file);
    // clear input
    event.target.value = '';
  };

  // Trigger Native Device PWA install modal call
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation is fully active. Secure app directly using browser actions menu on iPhone (Add to Home Screen) or Android options.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation intent chosen: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallPromptButton(false);
  };

  // Export progress as PDF printable document layout!
  const handlePrintExportReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen relative font-sans text-zinc-100 selection:bg-[#ff7a00]/30 selection:text-white">
      
      {/* Primary responsive sidebar / top header wrapper layout */}
      <div className="lg:pl-80 min-h-screen">
        
        {/* Navigation Sidebar/Sticky top */}
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            // Safe tab transitions
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          pwaInstalled={pwaInstalled}
          onInstallClick={handleInstallClick}
          showInstallPromptButton={showInstallPromptButton}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />

        {/* Global secondary diagnostic strip */}
        <nav className="no-print hidden lg:flex items-center justify-between border-b border-border bg-surface/30 backdrop-blur-md p-3 px-6 font-mono text-[11px] text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="text-[#ff7a00] flex items-center gap-2 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] animate-pulse"></span>
              ACTIVE STUDY MATRIX ONLINE
            </span>
            <span className="text-zinc-700">|</span>
            <span>STREAK CYCLES: <strong className="text-zinc-200">{state.streak} DAYS</strong></span>
            <span className="text-zinc-700">|</span>
            <span>EXPERIENCE SCORE: <strong className="text-zinc-200">{state.xp} XP</strong></span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick printable layout PDF trigger */}
            <button
              id="global-print-pdf-btn"
              onClick={handlePrintExportReport}
              className="py-1 px-3 rounded-full border border-border bg-surface hover:bg-[#1e1e1e] hover:text-white hover:border-border-hover transition-all text-[11px] font-medium tracking-wide flex items-center gap-2 cursor-pointer text-zinc-300 font-sans"
              title="Print layout report ready as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              PRINT PROGRESS (PDF)
            </button>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">STUDENT: SABUR</span>
          </div>
        </nav>

        {/* MAIN DISPLAY VIEW SCREEN AREA */}
        <main className="p-4 sm:p-6 lg:p-8 pb-32 lg:pb-12 h-full">
          
          {/* Dashboard Tab Case */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              state={state}
              onToggleTask={handleToggleTask}
              onIncrementStudy={handleIncrementStudy}
              onIncrementWater={handleIncrementWater}
              onResetWater={handleResetWater}
              onAddCustomGoal={handleAddGoal}
            />
          )}

          {/* Core study curricula tracks */}
          {activeTab === 'curriculum' && (
            <StudySections 
              state={state}
              onToggleThreejsModule={handleToggleThreejsModule}
              onToggleFrontendModule={handleToggleFrontendModule}
            />
          )}

          {/* Interactive heatmaps tracker */}
          {activeTab === 'habits' && (
            <HabitTracker state={state} />
          )}

          {/* 1-Year detailed technical roadmap timelines */}
          {activeTab === 'roadmap' && (
            <Roadmap state={state} />
          )}

          {/* Achievements progress & badge levels gallery */}
          {activeTab === 'gamification' && (
            <Gamification state={state} />
          )}

          {/* Goal Setting Board & Workspace log Notebooks */}
          {activeTab === 'goals_weekly' && (
            <NotebookAndWeekly 
              state={state}
              onAddGoal={handleAddGoal}
              onToggleGoal={handleToggleGoal}
              onDeleteGoal={handleDeleteGoal}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onAddWeeklyReview={handleAddWeeklyReview}
            />
          )}

          {/* Developer Scratch notebook log notes */}
          {activeTab === 'notebook' && (
            <NotebookAndWeekly 
              state={state}
              onAddGoal={handleAddGoal}
              onToggleGoal={handleToggleGoal}
              onDeleteGoal={handleDeleteGoal}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onAddWeeklyReview={handleAddWeeklyReview}
            />
          )}

          {/* Browser Scheduled Notifications Setup alerts */}
          {activeTab === 'reminders' && (
            <Reminders 
              reminders={state.reminders || []}
              onToggleReminder={handleToggleReminder}
            />
          )}

        </main>

      </div>

      {/* GORGEOUS SPACE CELEBRATION FLOATING SPARKS MODAL OVERLAY */}
      {showCelebration && (
        <div 
          onClick={() => setShowCelebration(false)}
          className="fixed inset-0 bg-[#0a0a0a]/80 z-50 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-sm animate-fade-in transition-all cursor-pointer"
        >
          {/* Rotating halo background glow lights */}
          <div className="absolute h-96 w-96 rounded-full bg-[#ff7a00] opacity-10 filter blur-3xl animate-pulse"></div>
          
          <div className="relative premium-panel px-8 py-10 flex flex-col items-center gap-5 max-w-md shadow-2xl z-10">
            <div className="p-4 rounded-full bg-[#ff7a00]/10 text-[#ff7a00] shrink-0">
              <Trophy className="h-10 w-10 animate-pulse" />
            </div>

            <h2 className="font-sans text-xl md:text-2xl font-bold text-white uppercase tracking-tight leading-none">
              Sabur's Daily Sync complete!
            </h2>
            
            <p className="font-sans text-xs text-zinc-400 px-2 leading-relaxed">
              Wonderful engineering consistency, Sabur! Complete parameters synced successfully to SQLite and local cached local state database:
            </p>

            <div className="flex flex-col gap-2 font-sans text-sm items-start w-full bg-[#1e1e1e] border border-border p-4 rounded-xl mt-1 text-zinc-300">
              <span className="flex items-center gap-2"><span className="text-[#ff7a00]">✔</span> Active Study Streak Upgraded: <strong className="text-white">{state.streak} Days</strong></span>
              <span className="flex items-center gap-2"><span className="text-[#ff7a00]">✔</span> Level score: <strong className="text-white">Level {state.level}</strong></span>
              <span className="flex items-center gap-2"><span className="text-[#ff7a00]">✔</span> Combined study hours logged successfully</span>
            </div>

            <p className="font-sans text-xs text-zinc-500 mt-2">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
