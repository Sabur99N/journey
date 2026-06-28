/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  Award, 
  Shield, 
  Compass, 
  Crown, 
  Zap, 
  Droplet,
  Lock,
  CompassIcon
} from 'lucide-react';
import { UserState, Badge } from '../types';

interface GamificationProps {
  state: UserState;
}

const BADGE_ICONS: { [key: string]: React.ComponentType<any> } = {
  Flame: Flame,
  Award: Award,
  Shield: Shield,
  Compass: Compass,
  Crown: Crown,
  Zap: Zap,
  Droplet: Droplet
};

export const Gamification: React.FC<GamificationProps> = ({ state }) => {
  // Compute levels
  const currentLevel = state.level;
  const rankNames = [
    "Novice Web Voyager",
    "WebGL Explorer",
    "Scene Creator",
    "Mesh Architect",
    "Shader Apprentice",
    "Vector Alchemist (Today)",
    "Creative Matrix Engineer",
    "Elite Creative Frontend Master"
  ];
  const activeRankName = rankNames[Math.min(currentLevel - 1, rankNames.length - 1)];

  // Convert state history to check badge unlocks dynamically
  const totalCombinedHours = state.totalHoursThreejs + state.totalHoursFrontend;
  const historyDoneDaysCount = state.history.filter(log => log.completedAt).length;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Visual Header */}
      <div className="border-b border-border pb-5">
        <h1 className="font-sans font-bold text-2xl lg:text-3xl text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="h-7 w-7 text-[#ff7a00]" />
          Achievements & Gamified Badges
        </h1>
        <p className="font-sans text-xs text-zinc-400 mt-1">
          Review levels progression, cumulative XP, and verify unlocked badges inside Sabur's development database.
        </p>
      </div>

      {/* Hero Level & Rank Arena Card */}
      <div className="premium-panel p-6 lg:p-8 flex flex-col md:flex-row gap-8 justify-between items-center relative overflow-hidden shadow-lg border-[#ff7a00]/20">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
          <Crown className="h-48 w-48 text-[#ff7a00]" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          {/* Level Circle Orb */}
          <div className="h-28 w-28 rounded-full bg-[#ff7a00] border-4 border-[#ffb366]/30 flex flex-col items-center justify-center font-sans shadow-xl shrink-0">
            <span className="text-[11px] text-zinc-900 font-bold uppercase tracking-widest leading-none">LVL</span>
            <span className="text-5xl font-extrabold text-white tracking-tighter leading-none mt-1">{currentLevel}</span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="p-1 px-2.5 rounded-md bg-[#ea6400]/10 text-[#ea6400] border border-[#ea6400]/30 text-[10px] font-sans uppercase font-bold tracking-widest">
                ACTIVE CLASSIFICATION TIER
              </span>
            </div>
            <h2 className="font-sans font-bold text-2xl lg:text-3xl text-zinc-100 tracking-tight">
              {activeRankName}
            </h2>
            <p className="font-sans text-[13px] text-zinc-400 mt-2 max-w-md font-light leading-relaxed">
              Your level progress is calculated securely via daily routines. Checked tasks and logged study hours fuel standard XP parameters directly.
            </p>
          </div>
        </div>

        {/* Level XP statistics details (Right Column) */}
        <div className="w-full md:w-80 font-sans text-xs text-zinc-400 shrink-0 bg-[#161616] p-5 rounded-xl border border-border flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
            <span>TOTAL ACCUMULATED XP:</span>
            <span className="text-[#ff7a00] text-sm">{state.xp} XP</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-border mt-1 relative">
            <div 
              className="h-full bg-[#ff7a00] transition-all duration-1000" 
              style={{ width: `${Math.min(100, (state.xp % 500) / 5)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">
            <span>LEVEL {currentLevel} ACTIVE</span>
            <span>{500 - (state.xp % 500)} XP TO LVL {currentLevel + 1}</span>
          </div>
        </div>
      </div>

      {/* BADGES GALLERY GRID (Achievements list) */}
      <div className="premium-panel p-6 flex flex-col gap-5">
        <h3 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">
          Sabur's Growth Badge Gallery
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-1">
          {state.history.length >= 0 && [
            // Standard PWA badges matching requirements
            { id: 'streak_7', title: 'Consistent Starter', description: 'Complete a 7-day completion streak', icon: 'Flame', req: `Streak: ${state.streak} / 7 days` },
            { id: 'streak_30', title: 'Orbit Champion (30D)', description: 'Fulfill a 30-day completion streak', icon: 'Award', req: `Streak: ${state.streak} / 30 days` },
            { id: 'streak_90', title: 'Frontend Centurion (90D)', description: 'Master a 90-day completion loop', icon: 'Shield', req: `Streak: ${state.streak} / 90 days` },
            { id: 'streak_180', title: 'Space Traveler (180D)', description: 'Fulfill 180 days of active progress', icon: 'Compass', req: `Streak: ${state.streak} / 180 days` },
            { id: 'streak_365', title: 'Elite Creative (365D)', description: 'Master full 1-year elite cycle', icon: 'Crown', req: `Streak: ${state.streak} / 365 days` },
            { id: 'hours_50', title: 'Hyper Focus', description: 'Log cumulative 50 hours combined study', icon: 'Zap', req: `Study: ${totalCombinedHours} / 50 hours` },
            { id: 'water_master', title: 'Hydro Powered', description: 'Fulfill water routine goals', icon: 'Droplet', req: `Hydration: ${state.waterIntakeGlassToday}/8 Glasses` }
          ].map((item) => {
            // Check dynamic unlocks:
            let isUnlocked = false;
            if (item.id === 'streak_7') isUnlocked = state.streak >= 7;
            if (item.id === 'streak_30') isUnlocked = state.streak >= 30;
            if (item.id === 'streak_90') isUnlocked = state.streak >= 90;
            if (item.id === 'streak_180') isUnlocked = state.streak >= 180;
            if (item.id === 'streak_365') isUnlocked = state.streak >= 365;
            if (item.id === 'hours_50') isUnlocked = totalCombinedHours >= 50;
            if (item.id === 'water_master') isUnlocked = state.waterIntakeGlassToday >= 8;

            const IconComp = BADGE_ICONS[item.icon] || Award;

            const badgeBorder = isUnlocked 
              ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10' 
              : 'border-border bg-[#161616] opacity-70';

            return (
              <div
                key={item.id}
                id={`badge-card-${item.id}`}
                className={`rounded-2xl p-6 border flex flex-col items-center text-center gap-5 transition-all duration-300 relative overflow-hidden group ${badgeBorder}`}
              >
                {/* Micro illumination glow inside */}
                {isUnlocked && (
                  <div className="absolute -inset-10 bg-gradient-to-tr from-amber-500/[0.05] to-transparent rounded-2xl filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}

                {/* Badge icon box */}
                <div className={`h-16 w-16 rounded-full border flex items-center justify-center transition-all ${
                  isUnlocked 
                    ? 'border-amber-500/50 bg-amber-500 text-white shadow-lg' 
                    : 'border-zinc-700 bg-zinc-900 text-zinc-600'
                }`}>
                  {isUnlocked ? <IconComp className="h-7 w-7" /> : <Lock className="h-6 w-6" />}
                </div>

                <div className="flex flex-col select-none px-1">
                  <h4 className={`text-sm font-sans tracking-wide ${
                    isUnlocked ? 'text-amber-500 font-bold' : 'text-zinc-500 font-semibold'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-zinc-400 mt-2 font-light leading-relaxed h-10">
                    {item.description}
                  </p>
                </div>

                {/* Requirement / Complete stats */}
                <div className="mt-2 pt-4 border-t border-border w-full font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                  <span>METRIC:</span>
                  <span className={isUnlocked ? 'text-amber-500' : 'text-zinc-600'}>
                    {isUnlocked ? 'SECURED ✓' : item.req}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
