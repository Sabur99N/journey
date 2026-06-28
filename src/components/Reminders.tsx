/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clock, 
  ExternalLink
} from 'lucide-react';

import { Reminder } from '../types';

interface RemindersProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
}

export const Reminders: React.FC<RemindersProps> = ({ reminders, onToggleReminder }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Browser notification API is not supported on this device/browser.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
    } catch (err) {
      console.warn("Could not retrieve notification permissions due to iframe sandboxing restrictions: ", err);
      alert("Iframe sandboxing may block notification checks. Please open the app in a new tab to authorize native push alerts!");
    }
  };

  const triggerTestNotification = (rem: Reminder) => {
    if (!('Notification' in window)) {
      alert("Browser notification API not supported. Standard check: " + rem.label + " - " + rem.message);
      return;
    }

    if (Notification.permission === 'granted') {
      const opt: NotificationOptions = {
        body: rem.message,
        icon: "https://img.icons8.com/nolan/256/space-port.png",
        tag: rem.id,
        requireInteraction: true
      };
      
      const n = new Notification(`Sabur's Journey: ${rem.label}`, opt);
      // Play synthesis sound
      if (soundEnabled && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(`Reminder: ${rem.label}. ${rem.message}`);
        synth.speak(utter);
      }
    } else {
      alert(`🔔 [REMINDER PREVIEW]\n\nType: ${rem.label}\nSchedule: ${rem.time}\nMessage: "${rem.message}"\n\n(Authorize permission or open in a browser tab to trigger native desktop alerts)`);
    }
  };

  const toggleReminder = (id: string) => {
    onToggleReminder(id);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto pb-12">
      
      {/* Visual Header */}
      <div className="border-b border-border pb-5">
        <h1 className="font-sans font-bold text-2xl lg:text-3xl text-white tracking-tight flex items-center gap-2.5">
          <Bell className="h-7 w-7 text-[#ff7a00]" />
          Alert Center & Reminders Sync
        </h1>
        <p className="font-sans text-xs text-zinc-400 mt-1">
          Stay aligned on study regimens using system push alerts and auditory indicators.
        </p>
      </div>

      {/* Permission Setup Card */}
      <div className="premium-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg border-[#ff7a00]/20">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-[#ff7a00]">
              <Sparkles className="h-5 w-5 animate-spin-slow" />
            </span>
            <h2 className="font-sans text-lg font-semibold text-zinc-100 tracking-tight">Native System Sync Connection</h2>
          </div>
          <p className="font-sans text-[13px] text-zinc-400 leading-relaxed font-light">
            Authorized notifications send push indicators directly to your desktop or locked mobile screen when it is time to practice. If running from inside a sandbox view portal, authorize permissions here or open the app in a new tab!
          </p>
          <div className="flex items-center gap-3 mt-4 font-sans font-bold text-[11px]">
            <span className="text-zinc-500 uppercase tracking-widest">NATIVE PUSH:</span>
            <span className={`px-2.5 py-1 rounded-md uppercase tracking-wider border ${
              permission === 'granted' 
                ? 'bg-[#ea6400]/10 border-[#ea6400]/30 text-[#ea6400]' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {permission === 'granted' ? 'Connected' : 'Blocked / Default'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="req-notify-perms-btn"
            onClick={requestNotificationPermission}
            className="premium-button primary text-[11px]"
          >
            AUTHORIZE PERMISSION
          </button>
          
          {/* Custom tab opening button */}
          <a
            href={window.location.href}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button secondary text-[11px] flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            OPEN IN NEW TAB
          </a>
        </div>
      </div>

      {/* Scheduled Reminders List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Scheduled List (8 columns) */}
        <div className="lg:col-span-8 premium-panel p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
            <div>
              <h2 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">STUDY INTENSITY ALERTS</h2>
              <p className="font-sans text-[11px] text-zinc-500 mt-0.5">Scheduled reminders calibrated to Sabur's curriculum tracks.</p>
            </div>

            {/* Speaking feedback sound slider toggle */}
            <button
              id="speech-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 px-3 rounded-lg border flex items-center gap-2 text-[11px] font-sans font-bold tracking-wider uppercase transition-all ${
                soundEnabled 
                  ? 'border-[#ff7a00]/40 bg-[#ff7a00]/10 text-[#ff7a00]' 
                  : 'border-border bg-surface text-zinc-500'
              }`}
              title={soundEnabled ? 'Speech Synthesis Enabled' : 'Auditory cues disabled'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{soundEnabled ? 'VOICE ON' : 'MUTED'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {reminders.map((rem: Reminder) => {
              return (
                <div
                  key={rem.id}
                  id={`reminder-row-${rem.id}`}
                  className={`rounded-xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${
                    rem.enabled 
                      ? 'border-[#ff7a00]/20 bg-[#ff7a00]/5' 
                      : 'border-border bg-[#161616] opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Schedule Indicator */}
                    <div className={`p-3 rounded-xl font-sans text-center tracking-tighter shrink-0 border ${
                      rem.enabled 
                        ? 'bg-[#ff7a00] border-transparent text-white shadow-md' 
                        : 'bg-[#1e1e1e] border-border text-zinc-500'
                    }`}>
                      <Clock className={`h-5 w-5 mx-auto mb-1 ${rem.enabled ? 'animate-pulse' : ''}`} />
                      <span className="text-sm font-bold block leading-none">{rem.time}</span>
                    </div>

                    <div className="flex flex-col leading-snug pt-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-sans font-semibold text-base ${rem.enabled ? 'text-zinc-100' : 'text-zinc-400'}`}>{rem.label}</h4>
                        <span className="font-sans text-[9px] uppercase text-zinc-500 font-bold bg-[#1e1e1e] border border-border px-2 py-0.5 rounded-full tracking-wider">
                          DAILY CYCLE
                        </span>
                      </div>
                      <p className="text-[13px] text-zinc-400 mt-2 leading-relaxed font-light max-w-md">{rem.message}</p>
                    </div>
                  </div>

                  {/* Testing trigger controls and schedule switches */}
                  <div className="flex items-center sm:justify-end gap-3 shrink-0 border-t border-border sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                    <button
                      id={`test-rem-btn-${rem.id}`}
                      onClick={() => triggerTestNotification(rem)}
                      className="premium-button secondary text-[10px]"
                    >
                      TEST ALERT
                    </button>
                    
                    <button
                      id={`toggle-rem-switch-${rem.id}`}
                      onClick={() => toggleReminder(rem.id)}
                      className={`py-1.5 px-3 text-[10px] font-sans font-bold tracking-wider rounded-lg border transition-all uppercase ${
                        rem.enabled 
                          ? 'border-[#ea6400]/30 bg-[#ea6400]/10 text-[#ea6400] hover:bg-[#ea6400]/20' 
                          : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {rem.enabled ? 'ACTIVE' : 'DEACTIVATED'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Info box (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="premium-panel p-6 flex flex-col gap-4 text-xs text-zinc-400 leading-relaxed">
            <h3 className="font-sans font-bold text-zinc-100 text-sm tracking-wide uppercase">Auditory Alarm cues</h3>
            <p className="font-light">
              When 'VOICE ON' state is designated, native test cycles trigger high-quality HTML5 speech synthesis to deliver audio focus loops with correct pacing markers:
            </p>
            <div className="flex flex-col gap-2 font-sans font-medium text-[11px] bg-[#161616] p-4 rounded-xl border border-border">
              <span className="flex gap-2 items-center text-zinc-300"><span className="text-[#ff7a00]">✔</span> Three.js Study Voice cues</span>
              <span className="flex gap-2 items-center text-zinc-300"><span className="text-[#ff7a00]">✔</span> Frontend Core Optimization Cues</span>
              <span className="flex gap-2 items-center text-zinc-300"><span className="text-[#ff7a00]">✔</span> Sleep cycle notifications</span>
            </div>
            <p className="text-[11px] text-zinc-500 italic block mt-1">
              Tip: Trigger the 'TEST ALERT' button to inspect output and practice focus matrices.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
