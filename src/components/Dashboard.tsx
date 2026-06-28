/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Droplet, 
  ListChecks, 
  BrainCircuit, 
  Trophy, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Award,
  CalendarDays
} from 'lucide-react';
import { UserState, Task, BrainQuote } from '../types';

interface DashboardProps {
  state: UserState;
  onToggleTask: (taskId: string) => void;
  onIncrementStudy: (category: 'threejs' | 'frontend', hours: number) => void;
  onIncrementWater: () => void;
  onResetWater: () => void;
  onAddCustomGoal: (text: string, tag: 'threejs' | 'portfolio' | 'career' | 'fitness') => void;
}

const MOTIVATIONAL_QUOTES: BrainQuote[] = [
  { text: "Elite developers write responsive stories that unfold dynamically on the browser stage.", author: "Frontend Philosophy", category: "creative" },
  { text: "Shader development is where creative painting meets mathematical wizardry. Embrace GLSL.", author: "Creative Coder Guild", category: "technical" },
  { text: "Hydration fuels cognition. The human brain is 75% water — debug with oxygen and H2O.", author: "BioHacking for Devs", category: "focus" },
  { text: "The event loop waits for no one. Master synchronous pipelines and concurrent rendering.", author: "JS Performance Guru", category: "technical" },
  { text: "A WebGL mesh is empty until camera angles and textures bind it with human visual emotion.", author: "WebGL Masterclass", category: "creative" },
  { text: "Never be afraid to optimize. 60 FPS is standard; 120 FPS is an art form.", author: "High Performance Web", category: "technical" }
];

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  onToggleTask,
  onIncrementStudy,
  onIncrementWater,
  onResetWater
}) => {
  const [quote, setQuote] = useState<BrainQuote>(MOTIVATIONAL_QUOTES[0]);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    // Generate static localized time
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    setCurrentTimeStr(new Date().toLocaleDateString('en-US', options));
    
    const rIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[rIdx]);
  }, [state.streak]);

  // Today's completion stats
  const todayTasks = state.history[state.history.length - 1]?.tasks || [];
  const totalTasksCount = todayTasks.length;
  const completedTasksCount = todayTasks.filter(t => t.completed).length;
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Gauge state texts & colors
  let momentumStatus = 'Resting';
  let statusColorClass = 'text-zinc-500';
  let ratingText = 'Calibration Required';
  if (completionPercentage > 0 && completionPercentage <= 30) {
    momentumStatus = 'Steady';
    statusColorClass = 'text-orange-400';
    ratingText = 'Keep climbing';
  } else if (completionPercentage > 30 && completionPercentage <= 75) {
    momentumStatus = 'Active';
    statusColorClass = 'text-[#ff7a00]';
    ratingText = 'Optimal performance';
  } else if (completionPercentage > 75) {
    momentumStatus = 'Excel';
    statusColorClass = 'text-[#ea6400] font-medium';
    ratingText = 'Outstanding state';
  }

  // XP level parameters
  const currentLevel = state.level;
  const baseXPForCurrentLevel = (currentLevel - 1) * 500;
  const xpIntoCurrentLevel = state.xp - baseXPForCurrentLevel;
  const xpNeededForNextLevel = 500;
  const levelProgressPercentage = Math.min(100, Math.max(0, Math.round((xpIntoCurrentLevel / xpNeededForNextLevel) * 100)));

  // Analytics: Last 7 Days
  const last7Days = state.history.slice(-7);
  const maxDailyHours = Math.max(1, ...last7Days.map(d => (d.studyHours?.threejs || 0) + (d.studyHours?.frontend || 0)));

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      
      {/* 1. PREMIUM HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[11px] tracking-widest text-[#ff7a00] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] animate-pulse"></span>
            {currentTimeStr || 'STUDY INITIATIVE ACTIVE'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-white leading-tight">
            Hi, Sabur <span className="text-3xl md:text-4xl animate-pulse">👋</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-sans mt-2 opacity-85">
            Crafting high-performance aesthetics, line by line.
          </p>
        </div>

        {/* Level Badge Badge */}
        <div className="flex items-center gap-4 bg-surface border border-border p-3 px-5 rounded-2xl shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7a00]/10 text-[#ff7a00]">
            <Award className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1 font-semibold">USER GROWTH MATRIX</span>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-xl font-bold text-white tracking-tight">Level {currentLevel}</span>
              <span className="text-[11px] text-[#ff7a00] font-sans font-medium">({state.xp} XP total)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Brain Quote */}
      <div className="premium-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-4 p-3 text-zinc-800 font-sans font-bold text-9xl pointer-events-none select-none select-all-none opacity-50">
          “
        </div>
        <div className="relative z-10">
          <span className="font-sans font-semibold text-[10px] text-[#ff7a00] tracking-widest uppercase mb-2 block">DAILY CREATIVE DOSAGE</span>
          <p className="font-sans text-[16px] sm:text-lg md:text-xl text-zinc-200 tracking-wide font-light leading-relaxed max-w-4xl">
            "{quote.text}"
          </p>
          <div className="flex items-center gap-2 mt-4 font-sans text-[12px] text-zinc-500">
            <span>—</span>
            <span className="uppercase text-zinc-300 font-bold tracking-wider">{quote.author}</span>
            <span>•</span>
            <span className="capitalize">{quote.category} alignment</span>
          </div>
        </div>
      </div>

      {/* 2. THREE-COLUMN ASYMMETRICAL BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BENTO COLUMN A (Span 5): Dynamic Speedometer Progress Dial Gauge */}
        <div className="lg:col-span-5 premium-panel p-6 md:p-8 flex flex-col justify-between gap-8 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-sans text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">PERFORMANCE SCALING</span>
              <h2 className="font-sans text-lg font-semibold text-zinc-100 mt-0.5">MOMENTUM SCORE</h2>
            </div>
            <span className="text-[11px] font-sans font-bold text-[#ff7a00] bg-[#ff7a00]/10 px-3 py-1 rounded-full">
              {completionPercentage}% DONE
            </span>
          </div>

          {/* Mathematical Perfect Arc Speedometer Gauge */}
          <div className="relative flex flex-col items-center justify-center py-4">
            <svg className="w-48 h-28" viewBox="0 0 160 100">
              {/* Outer Gauge Background Slot */}
              <path 
                d="M 20,90 A 60,60 0 0,1 140,90" 
                stroke="#2a2a2a" 
                strokeWidth="11" 
                fill="none" 
                strokeLinecap="round" 
              />
              {/* Active Progress colored overlay arc */}
              <path 
                d="M 20,90 A 60,60 0 0,1 140,90" 
                stroke="url(#speedometerGrad)" 
                strokeWidth="11" 
                fill="none" 
                strokeLinecap="round" 
                strokeDasharray="188.5" 
                strokeDashoffset={188.5 - (188.5 * Math.max(0.01, completionPercentage / 100))}
                className="transition-all duration-1000 ease-out"
              />
              
              <defs>
                <linearGradient id="speedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffb366" />
                  <stop offset="50%" stopColor="#ff9124" />
                  <stop offset="100%" stopColor="#ff7a00" />
                </linearGradient>
              </defs>
            </svg>

            {/* Float values inside the speed gauge */}
            <div className="absolute bottom-0 flex flex-col items-center justify-center text-center w-full pb-3">
              <span className={`text-2xl md:text-3xl font-bold font-sans tracking-tight leading-none ${statusColorClass}`}>
                {momentumStatus}
              </span>
              <span className="font-sans text-[11px] font-medium text-zinc-400 mt-1.5 tracking-wide block bg-[#0a0a0a]/80 px-2 rounded">
                {completedTasksCount} / {totalTasksCount} Daily Checkpoints
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between text-xs">
            <span className="font-sans text-[10px] text-zinc-500 font-bold uppercase">SIGNAL STATUS:</span>
            <span className="text-white font-sans text-[11px] font-medium bg-[#1e1e1e] px-3 py-1 rounded-full border border-border">
              ● {ratingText}
            </span>
          </div>
        </div>

        {/* BENTO COLUMN B (Span 7): Asymmetrical Bento Widgets Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Bento Item 1: High Contrast Orange Streak Launcher Widget */}
          <div className="rounded-2xl p-6 bg-[#ff7a00] text-[#0a0a0a] flex flex-col justify-between gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-lg">
            {/* Visual background element */}
            <div className="absolute -right-6 -bottom-6 text-[#0a0a0a] opacity-10">
              <Flame className="h-32 w-32 stroke-[1.5]" />
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="font-sans text-[10px] font-bold text-[#0a0a0a]/70 tracking-wider uppercase">momentum cycle</span>
                <h3 className="font-sans font-bold text-lg text-[#0a0a0a] leading-tight">MOMENTUM STREAK</h3>
              </div>
              <div className="p-2 ml-auto rounded-full bg-[#0a0a0a]/10 text-[#0a0a0a]">
                <Flame className="h-5 w-5" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-7xl font-bold tracking-tighter leading-none mb-2 text-[#0a0a0a] font-sans">
                {state.streak}
              </div>
              <div className="flex items-center gap-2 font-sans text-[12px] font-semibold text-[#0a0a0a]/80">
                <span>Active Streak •</span>
                <span className="text-[#0a0a0a] bg-white/40 px-2.5 py-0.5 rounded-full font-bold">Record: {state.longestStreak}D</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0a0a0a]/20 text-[11px] font-semibold text-[#0a0a0a]/80 flex items-center justify-between relative z-10 leading-snug">
              <span>Next upgrade bonus:</span>
              <span>+50 study XP boost</span>
            </div>
          </div>

          {/* Bento Item 2: Bio-Hydration Sync station */}
          <div className="premium-panel p-6 flex flex-col justify-between gap-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-sans text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">HYDRATION STATUS</span>
                <h3 className="font-sans font-semibold text-zinc-100 text-sm mt-0.5">BIO-HYDRATION Matrix</h3>
              </div>
              <div className="p-2 rounded-full bg-[#ff7a00]/10 text-[#ff7a00]">
                <Droplet className="h-5 w-5" />
              </div>
            </div>

            {/* Capsule vials that light up */}
            <div className="flex flex-col gap-3 bg-[#1e1e1e] p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between font-sans font-medium text-[11px]">
                <span className="text-zinc-400">DAILY CAPACITY</span>
                <span className="text-[#ff7a00] font-bold tracking-tight">
                  {state.waterIntakeGlassToday} / {state.waterGoalGlasses} GLASSES
                </span>
              </div>
              
              <div className="grid grid-cols-8 gap-2 pt-1.5">
                {Array.from({ length: state.waterGoalGlasses }).map((_, idx) => {
                  const isHydrated = idx < state.waterIntakeGlassToday;
                  return (
                    <button
                      key={idx}
                      id={`vial-${idx}`}
                      onClick={onIncrementWater}
                      className={`h-8 rounded-full border transition-all duration-300 relative overflow-hidden flex items-end justify-center ${
                        isHydrated 
                          ? 'border-[#ff7a00] bg-[#ff7a00]/20 translate-y-[1px]' 
                          : 'border-border hover:border-[#ff7a00]/40 hover:bg-[#1e1e1e]'
                      }`}
                      title={`Consume drink glass ${idx + 1}`}
                    >
                      {isHydrated && (
                        <div className="w-full bg-[#ff7a00] h-4/5"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                id="drink-btn"
                onClick={onIncrementWater}
                disabled={state.waterIntakeGlassToday >= state.waterGoalGlasses}
                className={`flex-1 py-2.5 px-3.5 rounded-full font-sans text-[11px] font-bold tracking-wider text-center uppercase transition-all cursor-pointer ${
                  state.waterIntakeGlassToday >= state.waterGoalGlasses 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-[#ff7a00] text-white hover:bg-[#ea6400] active:scale-95'
                }`}
              >
                {state.waterIntakeGlassToday >= state.waterGoalGlasses ? '✔ TARGET CONCLUDED' : '+ DRINK VIAL'}
              </button>
              <button
                id="reset-water"
                onClick={onResetWater}
                className="py-2.5 px-4 rounded-full font-sans font-semibold text-[11px] uppercase tracking-wide text-zinc-400 hover:text-white bg-[#1e1e1e] border border-border transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Bento Item 3 (Spans 2 columns): XP Progression slider */}
          <div className="sm:col-span-2 premium-panel p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#ff7a00]" />
                <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-zinc-400">LEVEL EXPERIENCE FLUX</span>
              </div>
              <span className="font-sans font-bold text-[11px] text-zinc-300">
                {xpIntoCurrentLevel} / {xpNeededForNextLevel} XP
              </span>
            </div>

            <div className="w-full h-4 bg-[#1e1e1e] rounded-full overflow-hidden border border-border relative">
              <div 
                className="h-full bg-[#ff7a00] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${levelProgressPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between font-sans font-medium text-[11px] text-zinc-500">
              <span className="text-zinc-300">LVL {currentLevel}</span>
              <span>{100 - levelProgressPercentage}% XP REMAINING TO LEVEL {currentLevel + 1}</span>
              <span className="text-zinc-300">LVL {currentLevel + 1}</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. TWO-COLUMN INTERACTIVE ACTIONS BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (Col-span 7): Activities Checklist bar */}
        <div className="lg:col-span-7 premium-panel p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="font-sans text-[10px] text-zinc-500 font-bold uppercase tracking-wider">DAILY COMPATIBILTY CHECKS</span>
              <h2 className="font-sans font-semibold text-lg text-white mt-0.5">TODAY'S ACTIVITIES</h2>
            </div>
            <span className="text-[11px] font-sans font-semibold text-zinc-400 bg-[#1e1e1e] border border-border px-3 py-1.5 rounded-full">
              UTC CYCLE STATUS
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {todayTasks.map((task: Task, idx: number) => {
              let customBarTheme = 'bg-[#1e1e1e] border-border text-zinc-200';
              let accentLabelTheme = 'bg-[#2a2a2a] text-zinc-300';
              let glowBorderTheme = 'hover:border-[#ff7a00]/50';
              
              // Apply fully-checked high density completion
              if (task.completed) {
                customBarTheme = 'bg-[#ff7a00]/10 border-[#ff7a00]/30 text-white';
                accentLabelTheme = 'bg-[#ff7a00] text-white';
                glowBorderTheme = 'border-[#ff7a00]/50';
              }

              return (
                <div
                  key={task.id}
                  id={`activity-bar-${task.id}`}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-[1px] ${customBarTheme} ${glowBorderTheme}`}
                >
                  <div className="flex items-center gap-5">
                    {/* Glowing Checkbox item */}
                    <div className="relative">
                      <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'border-[#ff7a00] bg-[#ff7a00] text-white' 
                          : 'border-zinc-600 bg-[#161616] group-hover:border-zinc-400'
                      }`}>
                        {task.completed ? (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className={`text-base font-medium tracking-wide transition-all font-sans ${
                        task.completed ? 'text-zinc-400 line-through opacity-80' : 'text-zinc-100'
                      }`}>
                        {task.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-1 font-sans font-semibold uppercase tracking-wider">
                        CATEGORY: {task.category}
                      </span>
                    </div>
                  </div>

                  {/* High visibility tag */}
                  <div className="flex items-center gap-2.5">
                    <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${accentLabelTheme}`}>
                      {task.completed ? 'SECURED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#1e1e1e] border border-border rounded-xl">
            <p className="font-sans text-[11px] font-medium text-zinc-400 leading-relaxed text-center sm:text-left">
              ⭐ <strong>ACCUMULATED RECORDING</strong>: Progress checkpoints sync to your local database immediately on interaction. Unlock levels and exclusive achievements dynamically.
            </p>
          </div>
        </div>

        {/* Right Side (Col-span 5): Study Flux & Target Buffs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Study Logging Console */}
          <div className="premium-panel p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-sans text-[10px] text-zinc-500 font-bold tracking-wider uppercase">direct parameters sync</span>
                <h3 className="font-sans font-semibold text-sm text-zinc-100 mt-0.5">STUDY ACCUMULATION</h3>
              </div>
              <div className="p-2 rounded-full bg-[#ff7a00]/10 text-[#ff7a00]">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            <p className="text-xs text-zinc-400 select-none leading-relaxed font-sans">
              Add interactive study increments direct to your educational matrix log:
            </p>

            <div className="flex flex-col gap-4">
              {/* Three.js block practice */}
              <div className="p-5 rounded-xl bg-[#1e1e1e] border border-border flex items-center justify-between group hover:border-[#ff7a00]/50 transition-all duration-300">
                <div>
                  <h4 className="text-[11px] font-bold font-sans text-zinc-400 uppercase">three.js mesh physics</h4>
                  <div className="flex items-baseline gap-2 mt-1 text-[#ff7a00]">
                    <span className="font-sans text-3xl font-bold tracking-tight">{state.totalHoursThreejs}</span>
                    <span className="text-[10px] text-zinc-500 font-sans font-bold tracking-wider uppercase">HOURS TOTAL</span>
                  </div>
                </div>
                <button
                  id="log-threejs-btn"
                  onClick={() => onIncrementStudy('threejs', 1)}
                  className="premium-button primary text-[11px]"
                >
                  +1 HOUR
                </button>
              </div>

              {/* Frontend block practice */}
              <div className="p-5 rounded-xl bg-[#1e1e1e] border border-border flex items-center justify-between group hover:border-[#ff7a00]/50 transition-all duration-300">
                <div>
                  <h4 className="text-[11px] font-bold font-sans text-zinc-400 uppercase">frontend system state</h4>
                  <div className="flex items-baseline gap-2 mt-1 text-[#ff7a00]">
                    <span className="font-sans text-3xl font-bold tracking-tight">{state.totalHoursFrontend}</span>
                    <span className="text-[10px] text-zinc-500 font-sans font-bold tracking-wider uppercase">HOURS TOTAL</span>
                  </div>
                </div>
                <button
                  id="log-frontend-btn"
                  onClick={() => onIncrementStudy('frontend', 1)}
                  className="premium-button primary text-[11px]"
                >
                  +1 HOUR
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#ff7a00]/10 border border-[#ff7a00]/20 rounded-xl text-center">
              <span className="font-sans font-bold text-[10px] text-[#ff7a00] uppercase block tracking-wider mb-1">combined academic stats</span>
              <p className="font-sans text-xl font-bold text-white leading-normal">
                {state.totalHoursThreejs + state.totalHoursFrontend} Combined Hours Recorded
              </p>
            </div>
          </div>

          {/* 7-Day Study Analytics Chart */}
          <div className="premium-panel p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#ff7a00]" />
                <span className="font-sans font-bold text-[10px] text-zinc-500 tracking-wider uppercase">ANALYTICS: PAST 7 DAYS</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-32 gap-2 border-b border-border pb-2">
              {last7Days.map((log, idx) => {
                const dayTotal = (log.studyHours?.threejs || 0) + (log.studyHours?.frontend || 0);
                const barHeight = Math.max(5, (dayTotal / maxDailyHours) * 100);
                const dayName = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 w-full group">
                    <div className="text-[10px] font-mono text-[#ff7a00] opacity-0 group-hover:opacity-100 transition-opacity">
                      {dayTotal}h
                    </div>
                    <div 
                      className="w-full bg-[#1e1e1e] border border-border rounded-t flex flex-col justify-end overflow-hidden group-hover:border-[#ff7a00]/50 transition-all"
                      style={{ height: `${barHeight}%` }}
                    >
                      <div className="w-full bg-[#ff7a00] opacity-80" style={{ height: '100%' }}></div>
                    </div>
                    <span className="text-[9px] font-sans text-zinc-500 uppercase tracking-widest">{dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Locked Buff Alerts */}
          <div className="premium-panel p-6 flex flex-col gap-4 select-none">
            <span className="font-sans font-bold text-[10px] text-zinc-500 tracking-wider uppercase">active milestone requirements</span>
            
            <div className="flex items-center gap-4 bg-[#1e1e1e] p-4 rounded-xl border border-border">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#ea6400]/10 text-[#ea6400]">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-zinc-100 uppercase tracking-wide">Consistency Prodigy</span>
                <span className="text-[11px] text-zinc-400 mt-0.5 font-medium">Awarded at 7 consecutive days study cycle</span>
              </div>
              <span className="ml-auto font-sans font-bold text-[11px] text-[#ea6400] bg-[#ea6400]/10 px-3 py-1.5 rounded-full border border-[#ea6400]/20">
                {state.streak} / 7D
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
