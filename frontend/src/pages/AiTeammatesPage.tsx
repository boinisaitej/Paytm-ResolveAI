import React, { useState } from 'react';
import { Bot, CheckCircle2, Shield, Wrench, Play, Pause } from 'lucide-react';
import { Agent } from '../types';

interface AiTeammatesProps {
  agents: Agent[];
}

export const AiTeammatesPage: React.FC<AiTeammatesProps> = ({ agents }) => {
  const [pausedAgents, setPausedAgents] = useState<Record<string, boolean>>({});

  const togglePause = (agentName: string) => {
    setPausedAgents((prev) => ({
      ...prev,
      [agentName]: !prev[agentName],
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">AI Workforce Management</h2>
        <p className="text-xs text-slate-500">Autonomous specialist agents orchestrated via Microsoft Agent Framework</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const isPaused = pausedAgents[agent.name];
          return (
            <div
              key={agent.name}
              className={`bg-white rounded-xl border p-5 shadow-2xs space-y-4 transition-all ${
                isPaused ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#002970]/10 flex items-center justify-center text-[#002970] font-bold text-sm">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{agent.name}</h3>
                    <p className="text-xs text-slate-500">{agent.role}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPaused ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isPaused ? 'PAUSED' : 'ACTIVE'}
                </span>
              </div>

              {agent.responsibilities && (
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-600 text-[11px]">Key Responsibilities:</span>
                  <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px]">
                    {agent.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {agent.tools && (
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold">
                    <Wrench className="w-3.5 h-3.5 text-[#00BAF2]" />
                    <span>Registered Backend Tools ({agent.tools.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((tool) => (
                      <span key={tool} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Tasks: <strong className="text-slate-800">{agent.completed_tasks || 92}</strong>
                </div>
                <button
                  onClick={() => togglePause(agent.name)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-semibold transition-all ${
                    isPaused
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
