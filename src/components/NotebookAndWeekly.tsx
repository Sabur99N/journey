/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Target, 
  Calendar, 
  Trash, 
  Check, 
  PlusCircle, 
  Sparkles, 
  Save, 
  ChevronRight, 
  ClipboardList,
  ChevronDown
} from 'lucide-react';
import { UserState, Goal, Note, WeeklyReview } from '../types';

interface NotebookAndWeeklyProps {
  state: UserState;
  onAddGoal: (text: string, tag: 'threejs' | 'portfolio' | 'career' | 'fitness') => void;
  onToggleGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddWeeklyReview: (wins: string[], challenges: string[], focusNext: string, energy: number) => void;
}

export const NotebookAndWeekly: React.FC<NotebookAndWeeklyProps> = ({
  state,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  onAddNote,
  onDeleteNote,
  onAddWeeklyReview
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'goals' | 'notebook' | 'weekly'>('goals');

  // Goals State inputs
  const [goalText, setGoalText] = useState("");
  const [goalTag, setGoalTag] = useState<'threejs' | 'portfolio' | 'career' | 'fitness'>('threejs');

  // Notebook inputs
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>("n-1");

  // Weekly review inputs
  const [win1, setWin1] = useState("");
  const [win2, setWin2] = useState("");
  const [challenge, setChallenge] = useState("");
  const [focusNext, setFocusNext] = useState("");
  const [energy, setEnergy] = useState<number>(8);

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim()) return;
    onAddGoal(goalText, goalTag);
    setGoalText("");
  };

  const handleSaveNoteSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    onAddNote(noteTitle, noteContent);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleAddWeekSub = (e: React.FormEvent) => {
    e.preventDefault();
    const wins = [win1, win2].filter(w => w.trim() !== "");
    if (wins.length === 0 || !focusNext.trim()) {
      alert("Please add at least one weekly win and your focus plans.");
      return;
    }
    const currentWeekRange = () => {
      const today = new Date();
      const first = today.getDate() - today.getDay() + 1; // beginning of week
      const last = first + 6;
      const fDate = new Date(today.setDate(first)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const lDate = new Date(today.setDate(last)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${fDate} - ${lDate}`;
    };

    onAddWeeklyReview(wins, [challenge].filter(c => c.trim() !== ""), focusNext, energy);
    // clear fields
    setWin1("");
    setWin2("");
    setChallenge("");
    setFocusNext("");
    setEnergy(8);
    alert("Weekly Evaluation logged securely to database!");
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Header section with cumulative stats summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="font-sans font-bold text-2xl lg:text-3xl text-white tracking-tight">
            Strategic Growth Matrix
          </h1>
          <p className="font-sans text-xs text-zinc-400 mt-1">
            Configure long-term goals, organize tech practice journals, and perform weekly accountability checks.
          </p>
        </div>

        {/* Menu selections */}
        <div className="flex items-center p-1 bg-surface border border-border rounded-xl self-start lg:self-center font-sans text-[11px] font-bold tracking-wider uppercase">
          <button
            id="subtab-goals"
            onClick={() => setActiveSubTab('goals')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'goals' ? 'bg-[#ff7a00] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1e1e1e]'
            }`}
          >
            <Target className="h-4 w-4" />
            GOAL BOARD
          </button>
          <button
            id="subtab-notebook"
            onClick={() => setActiveSubTab('notebook')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'notebook' ? 'bg-[#ff7a00] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1e1e1e]'
            }`}
          >
            <FileText className="h-4 w-4" />
            DEV NOTEBOOK
          </button>
          <button
            id="subtab-weekly"
            onClick={() => setActiveSubTab('weekly')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'weekly' ? 'bg-[#ff7a00] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1e1e1e]'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            WEEKLY REVIEW
          </button>
        </div>
      </div>

      {activeSubTab === 'goals' && (
        /* ----- MILESTONE GOALS SECTION ----- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Create goal form (4 cols) */}
          <div className="lg:col-span-4 premium-panel p-6 flex flex-col gap-4">
            <h3 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">CONFIGURE TARGET MILESTONE</h3>
            <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
              Define measurable engineering milestones with visual tags.
            </p>

            <form onSubmit={handleAddGoalSubmit} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5 font-sans font-medium text-xs">
                <label className="text-zinc-400">Milestone Specific Target Name:</label>
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="e.g. Master GLSL matrix vectors"
                  className="p-3 bg-[#161616] border border-border rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-[#ff7a00]/50 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans font-medium text-xs">
                <label className="text-zinc-400">Track tag classification:</label>
                <select
                  value={goalTag}
                  onChange={(e: any) => setGoalTag(e.target.value)}
                  className="p-3 bg-[#161616] border border-border rounded-lg text-zinc-300 text-xs focus:outline-none focus:border-[#ff7a00]/50 transition-colors cursor-pointer"
                >
                  <option value="threejs">Three.js Development</option>
                  <option value="portfolio">Portfolio/Showcase</option>
                  <option value="career">Career/Elite Skills</option>
                  <option value="fitness">Health & Fitness</option>
                </select>
              </div>

              <button
                type="submit"
                id="add-goal-btn"
                className="premium-button primary w-full mt-2"
              >
                <PlusCircle className="h-4 w-4" />
                DOCK GOAL
              </button>
            </form>
          </div>

          {/* Goal List Cards (8 cols) */}
          <div className="lg:col-span-8 premium-panel p-6 flex flex-col gap-5">
            <h2 className="font-sans font-bold text-zinc-100 text-base tracking-tight uppercase">ACTIVE REGIMEN GOALS</h2>

            <div className="flex flex-col gap-3">
              {state.goals.map((g: Goal) => {
                const isComplete = g.completed;
                const tagColor = g.tag === 'threejs' 
                  ? 'border-[#ff7a00]/30 bg-[#ff7a00]/10 text-[#ff7a00]' 
                  : g.tag === 'portfolio' 
                    ? 'border-[#ea6400]/30 bg-[#ea6400]/10 text-[#ea6400]' 
                    : g.tag === 'fitness' 
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-500';

                return (
                  <div
                    key={g.id}
                    id={`goal-row-${g.id}`}
                    className={`rounded-xl p-4 border transition-all duration-300 flex items-center justify-between gap-4 ${
                      isComplete 
                        ? 'border-border bg-[#161616] opacity-60' 
                        : 'border-border bg-surface hover:border-[#ff7a00]/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        id={`cb-goal-${g.id}`}
                        onClick={() => onToggleGoal(g.id)}
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                          isComplete 
                            ? 'border-[#ff7a00] bg-[#ff7a00] text-white' 
                            : 'border-zinc-600 bg-[#161616] hover:border-[#ff7a00]'
                        }`}
                      >
                        {isComplete && <Check className="h-3 w-3" strokeWidth={3} />}
                      </button>

                      <div className="flex flex-col leading-snug">
                        <span className={`text-[14px] font-sans font-medium tracking-wide ${
                          isComplete ? 'text-zinc-500 line-through' : 'text-zinc-200'
                        }`}>
                          {g.text}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5 font-sans font-bold text-[9px] uppercase tracking-wider">
                          <span className={`px-2 py-0.5 rounded border ${tagColor}`}>
                            {g.tag}
                          </span>
                          <span className="text-zinc-500">TARGET: {g.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`delete-goal-${g.id}`}
                      onClick={() => onDeleteGoal(g.id)}
                      className="p-2 rounded-lg border border-transparent hover:border-border hover:bg-[#161616] text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete goal"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'notebook' && (
        /* ----- DEV LOG WORKSPACE SCRATCH NOTEBOOK ----- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Note formulation editor (5 cols) */}
          <div className="lg:col-span-5 premium-panel p-6 flex flex-col gap-4">
            <h3 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">DRAFT NEW RESEARCH ENTRY</h3>
            
            <form onSubmit={handleSaveNoteSub} className="flex flex-col gap-4 mt-2">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Entry title (e.g. Orbit controls, GSAP timelines)"
                className="p-3.5 bg-[#161616] border border-border rounded-lg text-zinc-100 text-sm focus:outline-none focus:border-[#ff7a00]/50 transition-colors"
                required
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Entry practice content, cheatsheets, ideas..."
                rows={7}
                className="p-3.5 bg-[#161616] border border-border rounded-lg text-zinc-300 text-sm font-sans focus:outline-none focus:border-[#ff7a00]/50 transition-colors resize-none leading-relaxed"
                required
              />
              <button
                type="submit"
                id="save-note-btn"
                className="premium-button primary w-full"
              >
                <Save className="h-4 w-4" />
                SECURE LOG RECORD
              </button>
            </form>
          </div>

          {/* Saved Log scrolling accordion (7 cols) */}
          <div className="lg:col-span-7 premium-panel p-6 flex flex-col gap-5">
            <h2 className="font-sans font-bold text-zinc-100 text-base tracking-tight uppercase">PERSISTED DEVS SCRATCH MATRIX</h2>

            <div className="flex flex-col gap-4">
              {state.notes.map((note: Note) => {
                const isExpanded = expandedNoteId === note.id;
                return (
                  <div
                    key={note.id}
                    id={`note-${note.id}`}
                    className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-300"
                  >
                    {/* Collapsible header */}
                    <div
                      onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                      className="p-4 hover:bg-[#161616] cursor-pointer flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-[#ff7a00]" />
                        <div>
                          <h4 className="text-[14px] font-semibold tracking-wide text-zinc-200">{note.title}</h4>
                          <span className="font-sans font-bold text-[9px] text-zinc-500 tracking-wider uppercase mt-1 inline-block">
                            UPDATED: {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          id={`delete-note-${note.id}`}
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1.5 rounded hover:bg-[#1e1e1e] text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete entry"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        <span className="text-zinc-500 p-1">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Content body */}
                    {isExpanded && (
                      <div className="p-5 border-t border-border bg-[#161616] font-sans font-light text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'weekly' && (
        /* ----- WEEKLY REFLECTION ACCOUNTABILITY REPORTS ----- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form to submit review (5 cols) */}
          <div className="lg:col-span-5 premium-panel p-6 flex flex-col gap-4">
            <h3 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">LOG WEEKLY EVALUATION</h3>
            
            <form onSubmit={handleAddWeekSub} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5 font-sans font-medium text-xs">
                <label className="text-zinc-400">Week Wins (Param 1):</label>
                <input
                  type="text"
                  value={win1}
                  onChange={(e) => setWin1(e.target.value)}
                  placeholder="e.g. Fully mastered orbit controls"
                  className="p-3 bg-[#161616] border border-border rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-[#ff7a00]/50 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans font-medium text-xs">
                <label className="text-zinc-400">Wins secondary detail (Optional):</label>
                <input
                  type="text"
                  value={win2}
                  onChange={(e) => setWin2(e.target.value)}
                  placeholder="e.g. Consistently slept before 11 PM"
                  className="p-3 bg-[#161616] border border-border rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-[#ff7a00]/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans font-medium text-xs">
                <label className="text-zinc-400">Primary Core Challenge Encountered:</label>
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="e.g. Shader variables uniforms syntaxes confusing"
                  className="p-3 bg-[#161616] border border-border rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-[#ff7a00]/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans font-medium text-xs">
                <label className="text-zinc-400">Primary Focus Intent Next Week:</label>
                <input
                  type="text"
                  value={focusNext}
                  onChange={(e) => setFocusNext(e.target.value)}
                  placeholder="e.g. Finalize months 4-6 model baking loader targets"
                  className="p-3 bg-[#161616] border border-border rounded-lg text-zinc-100 text-xs focus:outline-none focus:border-[#ff7a00]/50 transition-colors"
                  required
                />
              </div>

              {/* Glowing energy level tracker */}
              <div className="flex flex-col gap-2 font-sans font-medium text-xs mt-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400">Energy & Focus Quotient: </label>
                  <span className="text-[#ff7a00] font-bold text-sm">{energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full accent-[#ff7a00] h-1.5 bg-[#161616] rounded-lg appearance-none cursor-pointer border border-border"
                />
              </div>

              <button
                type="submit"
                id="log-weekly-btn"
                className="premium-button primary w-full mt-3 animate-pulse"
              >
                <Sparkles className="h-4 w-4" />
                DOCK WEEKLY REVIEW
              </button>
            </form>
          </div>

          {/* Historical evaluations log scroll list (7 cols) */}
          <div className="lg:col-span-7 premium-panel p-6 flex flex-col gap-5">
            <h2 className="font-sans font-bold text-zinc-100 text-base tracking-tight uppercase">HISTORIC ACCOUNTABILITY LOG</h2>

            <div className="flex flex-col gap-4">
              {state.weeklyReviews.map((rev) => {
                return (
                  <div
                    key={rev.id}
                    id={`weekly-rev-${rev.id}`}
                    className="rounded-xl border border-border bg-[#161616] p-5 flex flex-col gap-4 font-sans text-xs text-zinc-300"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2 text-[#ff7a00]">
                        <Calendar className="h-4 w-4" />
                        <span className="font-bold text-zinc-100 text-[13px]">{rev.weekRange}</span>
                      </div>
                      <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-[#ea6400] bg-[#ea6400]/10 border border-[#ea6400]/20 px-2.5 py-1 rounded-md">
                        Energy Level: {rev.energyLevel}/10
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 leading-relaxed font-light text-[13px]">
                      <div>
                        <span className="text-emerald-500 font-semibold tracking-wide">★ Wins:</span>
                        <ul className="list-disc list-inside pl-1 text-zinc-400 mt-1 space-y-1">
                          {rev.wins.map((w, wI) => <li key={wI}>{w}</li>)}
                        </ul>
                      </div>

                      {rev.challenges.length > 0 && (
                        <div>
                          <span className="text-amber-500 font-semibold tracking-wide">⚠ Challenge:</span>
                          <p className="pl-1 text-zinc-400 mt-0.5">{rev.challenges.join(', ')}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-[#ff7a00] font-semibold tracking-wide">➜ Next Cycle Plan:</span>
                        <p className="pl-1 text-zinc-400 mt-0.5">{rev.focusNextWeek}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
