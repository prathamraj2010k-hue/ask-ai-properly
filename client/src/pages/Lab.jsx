import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Users, Bot, Play, RotateCcw, Check, Search, Calculator, Calendar,
  BrainCircuit, Wrench, Eye, RefreshCw, CircleCheck, Clock,
} from 'lucide-react';

/**
 * Feature 4 - Visual Lab: compare how a Standard Chatbot, an AI Copilot
 * and an Autonomous Agent tackle the SAME task. Simulation is 100% local
 * (scripted, animated) so it works with or without an API key.
 */

const SCENARIOS = [
  'Plan a 3-day budget trip to Lisbon',
  'Organise my week of exam revision',
  'Cut my monthly food spending',
];

const MODES = [
  {
    id: 'chatbot',
    name: 'Standard Chatbot',
    icon: MessageSquare,
    color: 'sky',
    tagline: 'One prompt in, one text out. No tools, no memory.',
    iconMap: {},
  },
  {
    id: 'copilot',
    name: 'AI Copilot',
    icon: Users,
    color: 'violet',
    tagline: 'Suggests actions inside your workflow - you approve every step.',
    iconMap: {},
  },
  {
    id: 'agent',
    name: 'Autonomous Agent',
    icon: Bot,
    color: 'emerald',
    tagline: 'Plans, uses tools, observes results and self-corrects until done.',
    iconMap: {},
  },
];

const COLOR = {
  sky: { bg: 'bg-sky-500', soft: 'bg-sky-50 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', ring: 'ring-sky-300 dark:ring-sky-700' },
  violet: { bg: 'bg-violet-500', soft: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', ring: 'ring-violet-300 dark:ring-violet-700' },
  emerald: { bg: 'bg-emerald-500', soft: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-300 dark:ring-emerald-700' },
};

/* Scripted steps per mode for the selected scenario */
function buildSteps(mode, scenario) {
  if (mode === 'chatbot') {
    return [
      { icon: MessageSquare, title: 'User prompt received', say: `You typed: "${scenario}". A chatbot has exactly one move: generate text.` },
      { icon: BrainCircuit, title: 'Text prediction', say: 'It predicts a helpful-sounding reply from patterns it learned - a generic itinerary/list with no real prices, dates or bookings.' },
      { icon: MessageSquare, title: 'Single reply delivered', say: 'Done in one turn. It cannot open a website, check a calendar or follow up tomorrow. If the answer is wrong, only YOU can spot it.' },
    ];
  }
  if (mode === 'copilot') {
    return [
      { icon: MessageSquare, title: 'User + app context received', say: `You typed: "${scenario}". A copilot also sees what you are working on (this document, this calendar).` },
      { icon: BrainCircuit, title: 'AI suggests 3 options', say: 'Instead of one answer, it drafts 3 candidate plans tailored to your context and highlights trade-offs.' },
      { icon: Users, title: 'Human in the loop - approval', say: 'You review the suggestions, edit one, and press Approve. The AI never acts on its own - you are the decision-maker.' },
      { icon: CircleCheck, title: 'Approved action executed', say: 'Only after your click does it apply the change (insert the plan into your document). Suggestions are cheap, mistakes are hard.' },
    ];
  }
  return [
    { icon: BrainCircuit, title: '1. Goal analysis & planning', say: `Given the goal "${scenario}", the agent breaks it into subtasks: research options → estimate costs → check dates → assemble plan. This plan is its own, not yours to write.` },
    { icon: Wrench, title: '2. Tool selection', say: 'It picks the tools it needs: Web Search for real prices, Calculator for the budget, Calendar for availability. Tools are what make it an agent, not just a talker.' },
    { icon: Search, title: '3. Execution & observation', say: 'It runs the tools and READS the results: flights found, total cost calculated, dates cross-checked. Observation is key - the result feeds back into its brain.' },
    { icon: RefreshCw, title: '4. Self-correction / reflection', say: 'First plan was over budget! The agent notices by itself, swaps a pricey neighbourhood for a cheaper one, re-runs the calculator, and confirms the new total fits.' },
    { icon: CircleCheck, title: 'Goal complete - verified', say: 'It finishes only when its own checks pass: budget respected, dates valid, plan complete. Then it reports back. That loop - plan, act, observe, correct - is the heart of agentic AI.' },
  ];
}

const TOOLICONS = { Search, Calculator, Calendar, BrainCircuit, Wrench, Eye, RefreshCw };

export default function Lab() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [mode, setMode] = useState('chatbot');
  const [step, setStep] = useState(-1); // -1 = not started
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const active = MODES.find((m) => m.id === mode);
  const steps = buildSteps(mode, scenario);
  const finished = step >= steps.length - 1;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const run = () => {
    clearInterval(timerRef.current);
    setStep(0);
    setRunning(true);
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, 1900);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setStep(-1);
    setRunning(false);
  };

  const switchMode = (m) => {
    clearInterval(timerRef.current);
    setMode(m);
    setStep(-1);
    setRunning(false);
  };

  return (
    <div className="animate-fade-up">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Agent Visual Lab</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          One task, three kinds of AI. Run the same scenario through each mode and watch the difference.
        </p>
      </div>

      {/* Scenario picker */}
      <div className="card mt-4 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">The task</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s}
              onClick={() => { setScenario(s); reset(); }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                scenario === s
                  ? 'border-brand-500 bg-brand-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Mode switcher */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {MODES.map((m) => {
          const isActive = mode === m.id;
          const c = COLOR[m.color];
          return (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`card p-4 text-left transition ${isActive ? `ring-2 ${c.ring}` : 'hover:shadow'}`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-lg text-white ${c.bg}`}>
                <m.icon size={18} />
              </span>
              <p className="mt-2.5 font-bold text-slate-800 dark:text-slate-100">{m.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{m.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Simulation stage */}
      <div className={`card mt-4 overflow-hidden border-2 ${active.color === 'sky' ? 'border-sky-200 dark:border-sky-800' : active.color === 'violet' ? 'border-violet-200 dark:border-violet-800' : 'border-emerald-200 dark:border-emerald-800'}`}>
        <div className={`flex items-center justify-between px-4 py-3 ${COLOR[active.color].soft}`}>
          <p className={`flex items-center gap-2 text-sm font-bold ${COLOR[active.color].text}`}>
            <active.icon size={17} /> {active.name} <span className="font-normal opacity-70">· "{scenario}"</span>
          </p>
          <div className="flex gap-2">
            {step === -1 ? (
              <button onClick={run} className="btn-primary !px-3 !py-1.5 text-xs">
                <Play size={13} /> Run Simulation
              </button>
            ) : (
              <button onClick={reset} className="btn-secondary !px-3 !py-1.5 text-xs">
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Step track */}
        <div className="p-4 sm:p-5">
          {step === -1 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Press <span className="font-bold">Run Simulation</span> to watch, step by step, how the {active.name.toLowerCase()} handles this task -
                with plain-language explanations of what happens inside its "brain".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {steps.slice(0, step + 1).map((s, i) => {
                const isLast = i === step;
                return (
                  <div
                    key={`${mode}-${i}`}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${
                      isLast
                        ? `border-transparent ${COLOR[active.color].soft} animate-fade-up`
                        : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${isLast ? `${COLOR[active.color].bg} text-white` : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <s.icon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{s.say}</p>
                    </div>
                    {i < step && <Check size={16} className="mt-2 shrink-0 text-emerald-500" />}
                    {isLast && running && <span className="typing-dot mt-2.5 h-2 w-2 rounded-full bg-slate-400" />}
                  </div>
                );
              })}
              {finished && (
                <p className={`animate-fade-up rounded-xl p-3 text-center text-xs font-bold ${COLOR[active.color].text}`}>
                  Simulation complete. Now run the same task in another mode and compare!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison cheat sheet */}
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2.5">Capability</th>
              <th className="px-4 py-2.5">Chatbot</th>
              <th className="px-4 py-2.5">Copilot</th>
              <th className="px-4 py-2.5">Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 dark:divide-slate-800 dark:text-slate-300">
            {[
              ['Text answers', 'Yes', 'Yes', 'Yes'],
              ['Uses tools (search, calendar…)', 'No', 'Limited', 'Yes'],
              ['Plans its own steps', 'No', 'No', 'Yes'],
              ['Human approves each action', 'n/a', 'Yes', 'Only at key checkpoints'],
              ['Self-corrects from results', 'No', 'No', 'Yes'],
            ].map((row) => (
              <tr key={row[0]}>
                <td className="px-4 py-2.5 font-medium">{row[0]}</td>
                {row.slice(1).map((cell, i) => (
                  <td key={i} className="px-4 py-2.5">
                    {cell === 'Yes' ? <Check size={15} className="text-emerald-500" /> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
