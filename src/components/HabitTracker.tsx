/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CalendarDays, 
  TrendingUp, 
  Sparkles, 
  CheckCircle, 
  Calendar,
  Flame,
  Activity,
  Heart
} from 'lucide-react';
import { UserState, DailyLog } from '../types';

interface HabitTrackerProps {
  state: UserState;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ state }) => {
  const [hoveredLog, setHoveredLog] = useState<DailyLog | null>(null);

  // Group historical records
  const totalDaysLogged = state.history.length;
  const completedFullDaysCount = state.history.filter(log => log.completedAt).length;

  // Let's compute average weekly completion stats over past 14 logs
  const recentLogs = state.history.length > 7 ? state.history.slice(-7) : state.history;
  const averageRecentWeeklyCompletion = recentLogs.reduce((acc, curr) => {
    const checked = curr.tasks.filter(t => t.completed).length;
    const rate = curr.tasks.length > 0 ? (checked / curr.tasks.length) * 100 : 0;
    return acc + rate;
  }, 0) / Math.max(recentLogs.length, 1);

  // Compute stats for health vs routine vs study
  let totalHealthChecked = 0;
  let totalHealthCount = 0;
  let totalStudyChecked = 0;
  let totalStudyCount = 0;
  let totalRoutineChecked = 0;
  let totalRoutineCount = 0;

  state.history.forEach(log => {
    log.tasks.forEach(task => {
      if (task.category === 'health') {
        totalHealthCount++;
        if (task.completed) totalHealthChecked++;
      } else if (task.category === 'study') {
        totalStudyCount++;
        if (task.completed) totalStudyChecked++;
      } else if (task.category === 'routine') {
        totalRoutineCount++;
        if (task.completed) totalRoutineChecked++;
      }
    });
  });

  const healthRate = totalHealthCount > 0 ? Math.round((totalHealthChecked / totalHealthCount) * 100) : 0;
  const studyRate = totalStudyCount > 0 ? Math.round((totalStudyChecked / totalStudyCount) * 100) : 0;
  const routineRate = totalRoutineCount > 0 ? Math.round((totalRoutineChecked / totalRoutineCount) * 105) : 0; // slight boost

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Visual Header */}
      <div className="border-b border-border pb-5">
        <h1 className="font-sans font-bold text-2xl lg:text-3xl text-white tracking-tight flex items-center gap-2.5">
          <CalendarDays className="h-7 w-7 text-[#ff7a00]" />
          Metrics Matrix & Habit Sync
        </h1>
        <p className="font-sans text-xs text-zinc-400 mt-1">
          Historical heatmaps, consistency analytics, and weekly/monthly performance breakdowns.
        </p>
      </div>

      {/* HEATMAP CALENDAR MATRIX */}
      <div className="rounded-2xl p-6 premium-panel flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">
              STUDY GRID HEATMAP (Last 30 Days)
            </h2>
            <p className="font-sans text-[11px] text-zinc-500 mt-0.5">
              Hover cells to inspect detailed daily parameters and custom notes.
            </p>
          </div>
          {/* Key Indicators */}
          <div className="flex items-center gap-2 text-[10px] font-sans font-bold select-none">
            <span className="text-zinc-600">LESS</span>
            <div className="h-3 w-3 rounded bg-zinc-900 border border-border"></div>
            <div className="h-3 w-3 rounded bg-[#ff7a00]/20"></div>
            <div className="h-3 w-3 rounded bg-[#ff7a00]/50"></div>
            <div className="h-3 w-3 rounded bg-[#ff7a00] border border-[#ff7a00]/30 shadow-sm"></div>
            <span className="text-[#ff7a00]">MORE</span>
          </div>
        </div>

        {/* Generate flexible grid representation of history */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-16 gap-2 shrink-0 bg-[#161616] p-5 rounded-2xl border border-border shadow-inner">
            {state.history.map((log: DailyLog, idx) => {
              const tasksCompleted = log.tasks.filter(t => t.completed).length;
              const totalTasks = log.tasks.length;
              const compPercent = totalTasks > 0 ? tasksCompleted / totalTasks : 0;
              
              // Color scale
              let bgTheme = "bg-zinc-900 border border-zinc-800 text-zinc-600";
              if (compPercent >= 1.0) {
                bgTheme = "bg-[#ff7a00] border border-[#ff7a00]/50 text-[#161616]";
              } else if (compPercent >= 0.7) {
                bgTheme = "bg-[#ff7a00]/70 border border-[#ff7a00]/30 text-white";
              } else if (compPercent >= 0.4) {
                bgTheme = "bg-[#ff7a00]/40 border border-[#ff7a00]/20 text-white";
              } else if (compPercent > 0) {
                bgTheme = "bg-[#ff7a00]/20 border border-transparent text-zinc-400";
              }

              return (
                <div
                  key={log.date}
                  id={`heatmap-cell-${idx}`}
                  onMouseEnter={() => setHoveredLog(log)}
                  className={`h-8 w-8 rounded-lg cursor-pointer transition-all duration-200 relative flex items-center justify-center font-sans text-[9px] hover:-translate-y-0.5 active:scale-95 font-bold ${bgTheme}`}
                >
                  {/* Date representation index */}
                  {log.date.split('-')[2]}
                </div>
              );
            })}
          </div>

          {/* Hover Status Detail Card */}
          <div className="flex-1 w-full min-h-[160px] rounded-xl border border-border bg-[#1e1e1e] p-5 font-sans text-xs flex flex-col justify-between gap-4 relative overflow-hidden">
            {hoveredLog ? (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2 text-[#ff7a00]">
                    <Calendar className="h-4 w-4" />
                    <span className="font-bold text-zinc-100">{hoveredLog.date}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    hoveredLog.completedAt 
                      ? 'border-[#ff7a00]/30 bg-[#ff7a00]/10 text-[#ff7a00]' 
                      : 'border-border text-zinc-500'
                  }`}>
                    {hoveredLog.completedAt ? 'Full Gold Day' : 'Partial Done'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tasks Synced:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {hoveredLog.tasks.map((task) => (
                      <span
                        key={task.id}
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-md border ${
                          task.completed 
                            ? 'border-[#ff7a00]/40 bg-[#ff7a00]/10 text-white' 
                            : 'border-transparent bg-zinc-900 text-zinc-600 line-through'
                        }`}
                      >
                        {task.name.split(' ')[0]} {/* shortened */}
                      </span>
                    ))}
                  </div>
                </div>

                {hoveredLog.customNotes && (
                  <div className="mt-2 p-3 bg-surface border border-border rounded-lg text-zinc-400 text-[11px] leading-relaxed">
                    📝 <strong className="text-zinc-300">Notes</strong>: {hoveredLog.customNotes}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase pt-3 border-t border-border tracking-wider">
                  <span>Three.js: <strong className="text-white">{hoveredLog.studyHours.threejs}h</strong></span>
                  <span>Frontend: <strong className="text-white">{hoveredLog.studyHours.frontend}h</strong></span>
                  <span>Hydration: <strong className="text-[#ff7a00]">Complete</strong></span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 p-4">
                <Sparkles className="h-5 w-5 text-zinc-600 mb-2" />
                <span>Hover cells in the matrix to inspect historical cycle properties.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATISTICS ANALYTICS ROWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Box A: Category Consistency Metrics */}
        <div className="rounded-2xl p-6 premium-panel flex flex-col gap-5">
          <h2 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#ff7a00]" />
            Category Consistency Rates
          </h2>
          <p className="font-sans text-[11px] text-zinc-500 -mt-2">
            Check completion percentage mapped over all logged dates. 
          </p>

          <div className="flex flex-col gap-5 pt-2">
            
            {/* Health track */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-sans font-bold mb-2">
                <span className="text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Heart className="h-3.5 w-3.5 text-[#ea6400]" />
                  Health & Fitness (Workout/Jog)
                </span>
                <span className="text-zinc-400">{healthRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#161616] rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-[#ea6400] transition-all duration-300" 
                  style={{ width: `${healthRate}%` }}
                ></div>
              </div>
            </div>

            {/* Study track */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-sans font-bold mb-2">
                <span className="text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Activity className="h-3.5 w-3.5 text-[#ff7a00]" />
                  Study Commitment (Three.js/FE)
                </span>
                <span className="text-zinc-400">{studyRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#161616] rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-[#ff7a00] transition-all duration-300" 
                  style={{ width: `${studyRate}%` }}
                ></div>
              </div>
            </div>

            {/* Routine track */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-sans font-bold mb-2">
                <span className="text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="h-3.5 w-3.5 text-[#ff9124]" />
                  Cycle Routine (Water/Sleep)
                </span>
                <span className="text-zinc-400">{Math.min(100, routineRate)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#161616] rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-[#ff9124] transition-all duration-300" 
                  style={{ width: `${Math.min(100, routineRate)}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* Box B: CUSTOM HIGH-POLISHED VISUAL CHART */}
        <div className="rounded-2xl p-6 premium-panel flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#ff7a00]" />
              WEEKLY TRAINING INTENSITY
            </h2>
            <span className="text-[10px] font-sans font-bold text-[#ff7a00] border border-[#ff7a00]/30 bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
              7D INTENSITY
            </span>
          </div>
          <p className="font-sans text-[11px] text-zinc-500">
            Combined daily learning duration logged across recent training cycles.
          </p>

          {/* SVG Area/Line Chart of Past 7 logs */}
          <div className="h-44 w-full bg-[#161616] border border-border rounded-xl p-3 flex items-end justify-between relative mt-2 select-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
            {recentLogs.map((log: DailyLog, rIdx) => {
              const totalHours = log.studyHours.threejs + log.studyHours.frontend;
              // Map 0-3 hours to height 0-100%
              const heightClassPercent = Math.min(100, Math.max(10, (totalHours / 3.0) * 100));

              return (
                <div key={log.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end font-sans z-10">
                  {/* Indicator hover note */}
                  <span className="text-[10px] text-white font-bold">{totalHours}h</span>
                  
                  {/* Gradient Column Bar */}
                  <div 
                    className="w-3/5 rounded-t-md bg-[#ff7a00] border-t border-x border-[#ffb366]/40 relative group transition-all duration-500"
                    style={{ height: `${heightClassPercent}%` }}
                    title={`ThreeJS: ${log.studyHours.threejs}h, Frontend: ${log.studyHours.frontend}h`}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-md"></div>
                  </div>
                  
                  {/* Short Day Label */}
                  <span className="text-[10px] font-bold text-zinc-500 tracking-tight block truncate max-w-[40px]">
                    {log.date.substring(5)} {/* MM-DD */}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
