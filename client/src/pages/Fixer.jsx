import { useState } from 'react';
import { Wand2, Copy, Check, AlertTriangle, Play, Eye, Loader2 } from 'lucide-react';
import { api } from '../lib/api.js';

const GOALS = ['Learn', 'Write', 'Code', 'Brainstorm', 'Summarize'];
const TONES = ['Friendly', 'Professional', 'Simple', 'Detailed'];

const LABEL_COLORS = {
  Role: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800',
  Task: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800',
  Context: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  Format: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
  Tone: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800',
};

export default function Fixer() {
  const [prompt, setPrompt] = useState('');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState(null);
  const [fixing, setFixing] = useState(false);
  const [preview, setPreview] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fix = async () => {
    if (!prompt.trim() || fixing) return;
    setError(''); setResult(null); setPreview('');
    setFixing(true);
    try {
      const data = await api.fixPrompt(prompt, goal || undefined, tone || undefined);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setFixing(false);
    }
  };

  const runPreview = async () => {
    if (!result || previewing) return;
    setError(''); setPreview('');
    setPreviewing(true);
    try {
      const data = await api.preview(result.proPrompt);
      setPreview(data.reply);
    } catch (e) {
      setError(e.message);
    } finally {
      setPreviewing(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.proPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Could not access the clipboard in this browser.');
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Prompt Fixer Studio</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Paste a weak prompt. Get a pro version, see why each part works, and preview the result.
          </p>
        </div>
        <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
          <Wand2 size={13} /> Golden Formula applied automatically
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* LEFT: input */}
        <section className="card flex flex-col p-4 sm:p-5">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Your weak prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
            rows={7}
            placeholder='e.g. "write about healthy eating"'
            className="input mt-2 flex-1 resize-none font-mono text-xs leading-relaxed"
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{prompt.length}/2000</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Goal (optional)</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="input mt-1.5">
                <option value="">Auto-detect</option>
                {GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tone (optional)</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="input mt-1.5">
                <option value="">Auto-detect</option>
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button onClick={fix} disabled={fixing || !prompt.trim()} className="btn-primary mt-4 w-full">
            {fixing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {fixing ? 'Fixing your prompt…' : 'Fix my prompt'}
          </button>
        </section>

        {/* RIGHT: results */}
        <section className="card flex flex-col p-4 sm:p-5">
          {!result && !fixing && (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                <Wand2 size={24} />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Your upgraded prompt appears here</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                The fixer rewrites your prompt using Role + Task + Context + Format + Tone, then explains each part.
              </p>
            </div>
          )}

          {fixing && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10">
              <Loader2 size={28} className="animate-spin text-brand-500" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Rebuilding your prompt with the Golden Formula…</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Pro prompt</p>
                  <button onClick={copy} className="btn-secondary !px-3 !py-1.5 text-xs">
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy Prompt</>}
                  </button>
                </div>
                <pre className="thin-scroll mt-2 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-3.5 font-mono text-xs leading-relaxed text-emerald-300">{result.proPrompt}</pre>
              </div>

              {result.whatChanged && (
                <p className="rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
                  <span className="font-bold">What changed: </span>{result.whatChanged}
                </p>
              )}

              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Why it works - colour-coded breakdown</p>
                <div className="mt-2 space-y-2">
                  {result.breakdown.map((b, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${LABEL_COLORS[b.label] || 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'}`}>
                      <p className="text-xs font-extrabold uppercase tracking-wide">{b.label}</p>
                      <p className="mt-1 font-mono text-xs leading-relaxed">"{b.text}"</p>
                      {b.why && <p className="mt-1.5 text-[11px] opacity-80"><span className="font-semibold">Why:</span> {b.why}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Live preview</p>
                  <button onClick={runPreview} disabled={previewing} className="btn-secondary !px-3 !py-1.5 text-xs">
                    {previewing ? <Loader2 size={13} className="animate-spin" /> : <><Eye size={13} /> Run it</>}
                  </button>
                </div>
                {previewing && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-100 p-3.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Play size={13} /> Running your pro prompt against the AI…
                  </div>
                )}
                {preview && (
                  <pre className="thin-scroll mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs leading-relaxed text-slate-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-slate-200">{preview}</pre>
                )}
                {!preview && !previewing && (
                  <p className="mt-2 text-[11px] text-slate-400">Click "Run it" to see what a real AI answers to your upgraded prompt.</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
