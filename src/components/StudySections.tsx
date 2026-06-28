/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Workflow, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award,
  CircleDot,
  CheckCircle,
  Cpu
} from 'lucide-react';
import { UserState, RoadmapSection, StudyModule } from '../types';

interface StudySectionsProps {
  state: UserState;
  onToggleThreejsModule: (sectionPhase: string, moduleId: string) => void;
  onToggleFrontendModule: (moduleId: string) => void;
}

export const StudySections: React.FC<StudySectionsProps> = ({
  state,
  onToggleThreejsModule,
  onToggleFrontendModule
}) => {
  const [subTab, setSubTab] = useState<'threejs' | 'frontend'>('threejs');

  // Count completions
  const totalThreejsModulesCount = state.roadmapThreejs.reduce((acc, curr) => acc + curr.modules.length, 0);
  const completedThreejsModulesCount = state.roadmapThreejs.reduce(
    (acc, curr) => acc + curr.modules.filter(m => m.completed).length, 0
  );
  const threejsProgressRate = totalThreejsModulesCount > 0 
    ? Math.round((completedThreejsModulesCount / totalThreejsModulesCount) * 100) 
    : 0;

  const totalFrontendModulesCount = state.roadmapFrontend.length;
  const completedFrontendModulesCount = state.roadmapFrontend.filter(m => m.completed).length;
  const frontendProgressRate = totalFrontendModulesCount > 0 
    ? Math.round((completedFrontendModulesCount / totalFrontendModulesCount) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Header section with cumulative stats summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-sans font-bold text-2xl lg:text-3xl text-white tracking-tight">
            Curriculum Mastery Engine
          </h1>
          <p className="font-sans text-xs text-zinc-400 mt-1">
            Track and complete elite visual learning targets. Progress feeds directly into your rank multipliers.
          </p>
        </div>

        {/* Visual selector toggle tabs */}
        <div className="flex items-center p-1 bg-surface border border-border rounded-xl self-start lg:self-center font-sans text-xs font-semibold">
          <button
            id="tab-threejs"
            onClick={() => setSubTab('threejs')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all cursor-pointer ${
              subTab === 'threejs' 
                ? 'bg-[#ff7a00] text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1e1e1e]'
            }`}
          >
            <Layers className="h-4 w-4" />
            THREE.JS
          </button>
          <button
            id="tab-frontend"
            onClick={() => setSubTab('frontend')}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all cursor-pointer ${
              subTab === 'frontend' 
                ? 'bg-[#ff7a00] text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1e1e1e]'
            }`}
          >
            <Cpu className="h-4 w-4" />
            FRONTEND
          </button>
        </div>
      </div>

      {subTab === 'threejs' ? (
        /* ----- THREE.JS CURRICULUM PAGE ----- */
        <div className="flex flex-col gap-8">
          
          {/* Top Info Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="premium-panel p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Mastery level</span>
                <p className="font-sans text-xl font-bold text-[#ff7a00] mt-1">Months 1-6 Active</p>
              </div>
              <div className="p-3 bg-[#ff7a00]/10 border border-[#ff7a00]/20 rounded-xl text-[#ff7a00]">
                <Workflow className="h-5 w-5" />
              </div>
            </div>

            <div className="premium-panel p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target Completion</span>
                <p className="font-sans text-xl font-bold text-white mt-1">
                  {completedThreejsModulesCount}/{totalThreejsModulesCount} Modules ({threejsProgressRate}%)
                </p>
              </div>
              <div className="p-3 bg-surface border border-border rounded-xl text-zinc-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="premium-panel p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Practice Commitment</span>
                <p className="font-sans text-xl font-bold text-[#ff7a00] mt-1">{state.totalHoursThreejs} Hours Logged</p>
              </div>
              <div className="p-3 bg-[#ff7a00]/10 border border-[#ff7a00]/20 rounded-xl text-[#ff7a00]">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* List Phases */}
          <div className="flex flex-col gap-8">
            {state.roadmapThreejs.map((phase: RoadmapSection) => {
              const isActivePhase = phase.status === 'active';
              const isCompletedPhase = phase.status === 'completed';
              
              const headerBorder = isActivePhase 
                ? 'border-[#ff7a00]/50 bg-[#1e1e1e]' 
                : isCompletedPhase 
                  ? 'border-zinc-700 bg-[#161616]' 
                  : 'border-border bg-surface';

              return (
                <div key={phase.phase} className="flex flex-col gap-4">
                  {/* Phase Title Header */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${headerBorder}`}>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-md font-sans text-[10px] font-bold uppercase ${
                        isActivePhase 
                          ? 'bg-[#ff7a00] text-white' 
                          : isCompletedPhase 
                            ? 'bg-zinc-800 text-zinc-300' 
                            : 'bg-zinc-900 text-zinc-500'
                      }`}>
                        {phase.phase}
                      </span>
                      <h2 className="font-sans font-semibold text-zinc-100 tracking-tight text-base">
                        {phase.title}
                      </h2>
                    </div>
                    <span className="font-sans text-xs text-zinc-500 font-semibold">{phase.timeline}</span>
                  </div>

                  {/* Phase Modules Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.modules.map((module: StudyModule) => {
                      const isComplete = module.completed;
                      const hasTopics = module.topics && module.topics.length > 0;

                      return (
                        <div
                          key={module.id}
                          id={`module-box-${module.id}`}
                          onClick={() => onToggleThreejsModule(phase.phase, module.id)}
                          className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${
                            isComplete 
                              ? 'border-[#ff7a00]/30 bg-[#ff7a00]/5 hover:bg-[#ff7a00]/10' 
                              : 'border-border bg-[#161616] hover:border-[#ff7a00]/40 hover:bg-[#1e1e1e]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`p-1 mt-0.5 transition-colors ${
                                isComplete ? 'text-[#ff7a00]' : 'text-zinc-600'
                              }`}>
                                {isComplete ? <CheckCircle className="h-5 w-5" /> : <CircleDot className="h-5 w-5" />}
                              </div>
                              <div>
                                <h3 className={`font-sans text-[14px] font-semibold tracking-wide ${
                                  isComplete ? 'text-zinc-400 line-through opacity-80' : 'text-zinc-100'
                                }`}>
                                  {module.title}
                                </h3>
                                <span className="font-sans font-bold tracking-wider uppercase text-[9px] text-zinc-500 inline-block mt-1 bg-[#1e1e1e] border border-border px-2 py-0.5 rounded-full">
                                  EST: {module.duration}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[9px] font-sans font-bold uppercase px-2 py-1 rounded-md border ${
                              isComplete 
                                ? 'border-[#ff7a00]/40 text-[#ff7a00] bg-[#ff7a00]/10' 
                                : 'border-border text-zinc-500'
                            }`}>
                              {isComplete ? 'ACQUIRED' : 'PENDING'}
                            </span>
                          </div>

                          {/* Topics detailed bullet breakdown */}
                          {hasTopics && (
                            <div className="border-t border-border pt-4 mt-1">
                              <span className="font-sans font-bold text-[10px] text-zinc-500 uppercase block mb-2 tracking-wider">Key Objectives:</span>
                              <ul className="flex flex-col gap-1.5">
                                {module.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                                    <span className="text-[#ff7a00]">›</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* ----- FRONTEND MASTERY PAGE ----- */
        <div className="flex flex-col gap-8">
          
          {/* Top Stats Column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="premium-panel p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active Tracks</span>
                <p className="font-sans text-xl font-bold text-[#ff7a00] mt-1">Architect pipeline</p>
              </div>
              <div className="p-3 bg-[#ff7a00]/10 border border-[#ff7a00]/20 rounded-xl text-[#ff7a00]">
                <Workflow className="h-5 w-5" />
              </div>
            </div>

            <div className="premium-panel p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target Competencies</span>
                <p className="font-sans text-xl font-bold text-white mt-1">
                  {completedFrontendModulesCount}/{totalFrontendModulesCount} Tracks ({frontendProgressRate}%)
                </p>
              </div>
              <div className="p-3 bg-surface border border-border rounded-xl text-zinc-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="premium-panel p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total study time</span>
                <p className="font-sans text-xl font-bold text-[#ff7a00] mt-1">{state.totalHoursFrontend} Hours Logged</p>
              </div>
              <div className="p-3 bg-[#ff7a00]/10 border border-[#ff7a00]/20 rounded-xl text-[#ff7a00]">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Grid Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {state.roadmapFrontend.map((module: StudyModule) => {
              const isComp = module.completed;
              return (
                <div
                  key={module.id}
                  id={`fe-module-box-${module.id}`}
                  onClick={() => onToggleFrontendModule(module.id)}
                  className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 ${
                    isComp 
                      ? 'border-[#ff7a00]/30 bg-[#ff7a00]/5 hover:bg-[#ff7a00]/10' 
                      : 'border-border bg-[#161616] hover:border-[#ff7a00]/40 hover:bg-[#1e1e1e]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-1 mt-0.5 transition-colors ${
                        isComp ? 'text-[#ff7a00]' : 'text-zinc-600'
                      }`}>
                        {isComp ? <CheckCircle className="h-5 w-5" /> : <CircleDot className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className={`font-sans text-[14px] font-semibold tracking-wide ${
                          isComp ? 'text-zinc-400 line-through opacity-80' : 'text-white'
                        }`}>
                          {module.title}
                        </h3>
                        <span className="font-sans font-bold tracking-wider uppercase text-[9px] text-zinc-500 inline-block mt-1 bg-[#1e1e1e] border border-border px-2 py-0.5 rounded-full">
                          ESTIMATE: {module.duration}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-sans font-bold uppercase px-2 py-1 rounded-md border ${
                      isComp 
                        ? 'border-[#ff7a00]/40 text-[#ff7a00] bg-[#ff7a00]/10' 
                        : 'border-border text-zinc-500'
                    }`}>
                      {isComp ? 'ACQUIRED' : 'PENDING'}
                    </span>
                  </div>

                  {module.topics && module.topics.length > 0 && (
                    <div className="border-t border-border pt-4 mt-1">
                      <span className="font-sans font-bold text-[10px] text-zinc-500 uppercase block mb-2 tracking-wider">Skills Included:</span>
                      <ul className="flex flex-col gap-1.5">
                        {module.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                            <span className="text-[#ff7a00]">■</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Interactive visual helper box */}
      <div className="p-5 bg-surface border border-border rounded-xl leading-relaxed text-xs text-zinc-400 select-none">
        🏆 <strong className="text-zinc-200">ENGINE ACQUISITION SYSTEM</strong>: Completing the modules checked above directly unlocks cumulative XP and level counts! Each module completed adds an estimated 50 XP to Sabur's rank matrices. Update these topics honestly as you proceed along training journeys.
      </div>

    </div>
  );
};
