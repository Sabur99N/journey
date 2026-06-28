/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Milestone, 
  Trophy, 
  Bell, 
  FileText, 
  Target,
  Sparkles
} from 'lucide-react';

export type TabId = 'dashboard' | 'curriculum' | 'habits' | 'roadmap' | 'gamification' | 'notebook' | 'goals_weekly' | 'reminders';

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  pwaInstalled: boolean;
  onInstallClick: () => void;
  showInstallPromptButton: boolean;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TabMeta: { id: TabId; label: string; icon: React.ComponentType<any>; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Daily tracker & vital stats' },
  { id: 'curriculum', label: 'Curriculum', icon: BookOpen, description: 'Three.js & Frontend modules' },
  { id: 'habits', label: 'Habits Analytics', icon: Calendar, description: 'Heatmaps & weekly stats' },
  { id: 'roadmap', label: 'Roadmap 1Y', icon: Milestone, description: '1-Year Elite path visualizer' },
  { id: 'gamification', label: 'Achievements', icon: Trophy, description: 'Rank, Levels & custom badges' },
  { id: 'goals_weekly', label: 'Goals & Weekly', icon: Target, description: 'Milestones & evaluations' },
  { id: 'notebook', label: 'Dev Log Notebook', icon: FileText, description: 'Persisted workspace scratchpad' },
  { id: 'reminders', label: 'Alert Center', icon: Bell, description: 'Browser reminders setup' }
];

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  onInstallClick, 
  showInstallPromptButton,
  onExportData,
  onImportData
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 min-h-screen fixed left-0 top-0 border-r border-border bg-[#0a0a0a] p-7 z-30 justify-between">
        <div className="flex flex-col gap-10">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3.5 py-2 px-1 border-b border-border pb-6">
            <div className="p-2.5 rounded-xl bg-[#ff7a00]/10 text-[#ff7a00]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-xl tracking-tight text-white leading-none">
                Sabur's <span className="font-normal text-[#ff7a00]">Journey</span>
              </h1>
              <p className="font-sans text-[10px] text-zinc-500 tracking-widest uppercase mt-1">Premium Engine</p>
            </div>
          </div>
 
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {TabMeta.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 text-left group ${
                    isActive 
                      ? 'bg-surface border border-border text-white' 
                      : 'text-zinc-400 hover:text-white hover:bg-surface border border-transparent'
                  }`}
                >
                  <div className={`transition-all duration-200 ${
                    isActive ? 'text-[#ff7a00]' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-sans text-[14px] font-medium tracking-wide leading-none">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
 
        {/* PWA Promotion & Install Sidebar widget */}
        <div className="flex flex-col gap-4 pt-6 border-t border-border">
          {showInstallPromptButton && (
            <button
               id="pwa-install-sidebar"
               onClick={onInstallClick}
               className="premium-button primary w-full text-sm font-bold shadow-[0_0_15px_rgba(255,122,0,0.2)]"
            >
               <Sparkles className="h-4 w-4 mr-2" />
               INSTALL DESKTOP APP
            </button>
          )}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-sans tracking-wide">
            <span>JOURNAL SYNC</span>
            <span className="text-[#ff7a00]">PREMIUM</span>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <button
              onClick={onExportData}
              className="py-2 px-3 text-[11px] font-sans font-bold tracking-wider text-zinc-400 hover:text-white border border-border hover:border-zinc-500 rounded-lg transition-all"
            >
              ⬇ EXPORT DATA
            </button>
            <label className="py-2 px-3 text-[11px] font-sans font-bold tracking-wider text-zinc-400 hover:text-white border border-border hover:border-zinc-500 rounded-lg transition-all text-center cursor-pointer">
              ⬆ IMPORT BACKUP
              <input 
                type="file" 
                accept=".json" 
                onChange={onImportData} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Header */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#ff7a00]/10 text-[#ff7a00]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-sans font-semibold text-sm text-white">Sabur's Journey</h1>
          </div>
        </div>

        {showInstallPromptButton && (
          <button
            id="pwa-install-mobile"
            onClick={onInstallClick}
            className="premium-button primary text-[10px] py-1.5 px-3"
          >
            INSTALL
          </button>
        )}
      </header>

      {/* Mobile Bottom Navigation Grid */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-[#0a0a0a]/95 backdrop-blur-xl grid grid-cols-4 select-none pb-safe z-40 text-center">
        {TabMeta.slice(0, 4).map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-mobile-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-1 border-t-2 transition-all ${
                isActive 
                  ? 'border-[#ff7a00] text-[#ff7a00] bg-surface' 
                  : 'border-transparent text-zinc-500'
              }`}
            >
              <IconComp className="h-5 w-5" />
              <span className="text-[10px] mt-1 font-sans font-medium tracking-wide truncate max-w-full">
                {tab.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
        {/* Toggle overlay or select other categories */}
        <div className="col-span-4 flex justify-around border-t border-border bg-[#161616] p-2">
          {TabMeta.slice(4).map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-btn-mobile-more-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all font-sans ${
                  isActive 
                    ? 'bg-[#ff7a00] text-white' 
                    : 'text-zinc-400 hover:text-white bg-[#1e1e1e]'
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
