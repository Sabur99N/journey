/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Milestone, 
  Map, 
  Sparkles, 
  Compass, 
  Trophy, 
  Code2, 
  CircleDot, 
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { UserState, RoadmapSection } from '../types';

interface RoadmapProps {
  state: UserState;
}

interface PortfolioNode {
  title: string;
  month: string;
  tech: string[];
  description: string;
  unlockedAtHours: number;
}

const PORTFOLIO_DEMOS: PortfolioNode[] = [
  { title: "Visual Solar Orbit Playground", month: "Month 2", tech: ["Three.js", "Vectors", "Lighting"], description: "A gorgeous, floating gravity-mapped space playground simulating camera orbit controls and customized point shadows.", unlockedAtHours: 15 },
  { title: "Bake Model Physics Maze Game", month: "Month 5", tech: ["GLTFLoader", "GSAP", "Cannon.js"], description: "An interactive rolling ball maze using custom baked ambient occlusion lighting maps and scrolltrigger animation curves.", unlockedAtHours: 40 },
  { title: "Interactive Particle Ocean Shader", month: "Month 8", tech: ["GLSL", "Perlin Noise", "Attributes"], description: "Vertex-displacement driven dynamic ocean displacement mesh simulating infinite procedurally animated waves.", unlockedAtHours: 65 },
  { title: "Sabur's Immersive Portfolio Showcase", month: "Month 11", tech: ["Custom Shaders", "Physics Menu", "Dolly Cam"], description: "Masterpiece landing portfolio. Highly optimized physics meshes, customized displacement wave transitions, and sound syncs.", unlockedAtHours: 90 }
];

export const Roadmap: React.FC<RoadmapProps> = ({ state }) => {
  const [selectedDemo, setSelectedDemo] = useState<PortfolioNode>(PORTFOLIO_DEMOS[0]);
  
  const totalCombinedHours = state.totalHoursThreejs + state.totalHoursFrontend;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Visual Header */}
      <div className="border-b border-border pb-5">
        <h1 className="font-sans font-bold text-2xl lg:text-3xl text-white tracking-tight flex items-center gap-2.5">
          <Milestone className="h-7 w-7 text-[#ff7a00]" />
          The Elite 1-Year Curricular Path
        </h1>
        <p className="font-sans text-xs text-zinc-400 mt-1">
          Scale cumulative competencies across 4 progressive training cycles to build Sabur's Journey showcase.
        </p>
      </div>

      {/* Overview stats */}
      <div className="premium-panel p-6 flex flex-col md:flex-row gap-6 justify-between items-center shadow-lg border-[#ff7a00]/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-1.5 px-2.5 rounded-md bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/30 font-sans font-bold text-[10px] tracking-wider uppercase">ROADMAP STATUS</span>
            <span className="text-sm font-bold text-zinc-100 font-sans tracking-wide">Active Space Sector Track</span>
          </div>
          <p className="font-sans text-[13px] text-zinc-400 max-w-xl leading-relaxed font-light">
            Your progressive tech acquisition is determined by cumulative practice loops checked. Logging 2 hours daily secures elite capabilities across procedural shaders, advanced models, and performance engineering inside 1 solar year.
          </p>
        </div>

        <div className="flex items-center gap-5 bg-[#161616] p-5 rounded-xl border border-border font-sans text-center shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">COMBINED TIME LOGGED</span>
            <span className="text-xl font-bold text-[#ea6400] tracking-tight">{totalCombinedHours} / 730 Hours</span>
          </div>
          <div className="h-8 w-[1px] bg-border"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">ELITE PIPELINE TARGET</span>
            <span className="text-sm font-bold text-[#ff7a00] tracking-wider uppercase">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* ROADMAP TREE TIMELINE AND NODES (Grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* The 4 Timeline Phases (7 cols) */}
        <div className="lg:col-span-7 premium-panel p-6 flex flex-col gap-5 relative">
          <h2 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">
            Progressive curriculum tracks timeline
          </h2>

          <div className="flex flex-col gap-6 mt-3 relative">
            {/* Visual connector line in background */}
            <div className="absolute left-[22px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#ff7a00] via-[#ffb366] to-[#1e1e1e] z-0"></div>

            {state.roadmapThreejs.map((phase: RoadmapSection, index: number) => {
              const isComp = phase.status === 'completed';
              const isAct = phase.status === 'active';
              
              const nodeGlowBorder = isAct 
                ? 'border-[#ff7a00] bg-[#ff7a00]/10 text-[#ff7a00]' 
                : isComp 
                  ? 'border-zinc-500 bg-[#1e1e1e] text-zinc-300' 
                  : 'border-border bg-[#161616] text-zinc-600';

              return (
                <div key={phase.phase} className="flex gap-5 relative z-10 font-sans">
                  {/* Circular Node index */}
                  <div className={`h-11 w-11 rounded-full border-2 flex items-center justify-center font-sans font-bold text-sm shrink-0 shadow-sm transition-all ${nodeGlowBorder}`}>
                    {isComp ? '✓' : `0${index + 1}`}
                  </div>

                  {/* Node contents */}
                  <div className={`flex-1 p-5 rounded-xl border flex flex-col gap-3 transition-all ${
                    isAct ? 'bg-[#1e1e1e] border-[#ff7a00]/30 shadow-md' : 'bg-surface border-border'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="font-sans text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">
                          {phase.timeline}
                        </span>
                        <h4 className={`font-sans font-bold text-[15px] ${isComp ? 'text-zinc-400' : 'text-zinc-100'}`}>{phase.phase}</h4>
                      </div>
                      <span className={`text-[9px] font-sans font-bold uppercase px-2.5 py-1 rounded-md border tracking-wider ${
                        isComp 
                          ? 'border-zinc-700 text-zinc-400 bg-zinc-800' 
                          : isAct 
                            ? 'border-[#ff7a00]/40 text-[#ff7a00] bg-[#ff7a00]/10 animate-pulse' 
                            : 'border-border text-zinc-600 bg-transparent'
                      }`}>
                        {phase.status}
                      </span>
                    </div>

                    <p className={`text-[12.5px] leading-relaxed ${isComp ? 'text-zinc-500 font-light' : 'text-zinc-300 font-medium'}`}>
                      {phase.title}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {phase.modules.map(m => (
                        <span
                          key={m.id}
                          className={`text-[9.5px] px-2.5 py-1 rounded-md border font-sans font-bold uppercase tracking-wider ${
                            m.completed 
                              ? 'border-[#ff7a00]/30 bg-[#ff7a00]/10 text-[#ff7a00]' 
                              : 'border-border bg-[#161616] text-zinc-500'
                          }`}
                        >
                          {m.title.split(' ')[0]} {/* short code label */}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Portfolio Showcases Unlocker (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="premium-panel p-6 flex flex-col gap-5">
            <h3 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase flex items-center gap-2">
              <Code2 className="h-5 w-5 text-[#ff7a00]" />
              Target Project Milestones
            </h3>
            <p className="font-sans text-[12px] text-zinc-400 font-light leading-relaxed -mt-2">
              Select showcase nodes to preview core milestone tasks that construct Sabur's Journey portfolio.
            </p>

            {/* Showcase project node lists */}
            <div className="grid grid-cols-2 gap-3 my-1">
              {PORTFOLIO_DEMOS.map((demo) => {
                const isItemDemoSelected = selectedDemo.title === demo.title;
                const isProjectUnlocked = totalCombinedHours >= demo.unlockedAtHours;

                return (
                  <button
                    key={demo.title}
                    id={`demo-node-${demo.title.split(' ')[0]}`}
                    onClick={() => setSelectedDemo(demo)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-28 ${
                      isItemDemoSelected 
                        ? 'border-[#ff7a00] bg-[#ff7a00]/10 text-white shadow-lg' 
                        : 'border-border bg-surface hover:border-[#ff7a00]/50 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full font-sans font-bold tracking-wider text-[10px]">
                      <span>{demo.month}</span>
                      {!isProjectUnlocked && <Lock className="h-3.5 w-3.5 text-zinc-600" />}
                    </div>
                    <span className="font-sans text-[11px] font-bold leading-snug w-full mt-2 line-clamp-2">
                      {demo.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Demo card detailed container */}
            <div className="bg-[#161616] p-5 rounded-xl border border-border font-sans flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-[#ff7a00] font-bold text-[10px] tracking-wider uppercase">★ PORTFOLIO NODE SELECT</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{selectedDemo.month} TARGET</span>
              </div>
              
              <h4 className="font-sans text-[15px] font-bold text-zinc-100">{selectedDemo.title}</h4>
              <p className="text-[12.5px] text-zinc-400 leading-relaxed font-light">
                {selectedDemo.description}
              </p>

              <div>
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-2">Key Tech Implementations:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedDemo.tech.map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-border bg-[#1e1e1e] text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-1 border-t border-border flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider">
                <span className="text-zinc-500">UNLOCK HOURS REQ:</span>
                <span className={`${totalCombinedHours >= selectedDemo.unlockedAtHours ? 'text-[#ff7a00]' : 'text-zinc-400'}`}>
                  {selectedDemo.unlockedAtHours} Hours (Current: {totalCombinedHours}h)
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
