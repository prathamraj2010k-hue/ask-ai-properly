import { useMemo, useState, useEffect } from 'react';
import { X, Copy, Check, MessageSquareHeart, Loader2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext.jsx';
import { api } from '../lib/api.js';

/**
 * Template modal: turns [BRACKETED] placeholders into editable form
 * fields, live-updates the final prompt, and offers Copy + "Test in
 * Coach Chat" (which jumps to the Coach tab with the prompt prefilled).
 */

// Split template text into plain text and [PLACEHOLDER] tokens
function parseTemplate(text) {
  const parts = [];
  const regex = /\[([A-Z0-9 _/+-]+)\]/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
    parts.push({ type: 'field', name: m[1].trim(), key: `f${key++}` });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}

export default function TemplateModal({ template, onClose, onNavigate }) {
  const fields = useMemo(() => parseTemplate(template.template), [template]);
  const [values, setValues] = useState({});
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const { setChatHistory, savePrompt } = useProgress();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const finalPrompt = useMemo(
    () =>
      fields
        .map((p) => (p.type === 'text' ? p.value : values[p.key] || `[${p.name}]`))
        .join('')
        .trim(),
    [fields, values]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      savePrompt({ text: finalPrompt, title: template.title, ts: Date.now() });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const testInCoach = async () => {
    setTesting(true);
    savePrompt({ text: finalPrompt, title: template.title, ts: Date.now() });
    setChatHistory([{ role: 'user', content: finalPrompt, ts: Date.now() }]);
    // Flag tells the Coach page to auto-send this prompt on mount.
    sessionStorage.setItem('askai-autosend', '1');
    setTimeout(() => {
      onNavigate('coach');
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="thin-scroll max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{template.title}</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{template.desc}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Fill-in fields */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Fill in the blanks</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {fields.filter((f) => f.type === 'field').map((f) => {
              const long = f.name.length > 24 || /PASTE|NOTES|LIST|TEXT|ESSAY|CODE|TASKS|STRESSES|DESCRIPTION/i.test(f.name);
              return (
                <label key={f.key} className={`block ${long ? 'sm:col-span-2' : ''}`}>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{f.name}</span>
                  {long ? (
                    <textarea
                      rows={3}
                      value={values[f.key] || ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={`Paste or type: ${f.name.toLowerCase()}…`}
                      className="input mt-1 resize-none font-mono text-xs"
                    />
                  ) : (
                    <input
                      value={values[f.key] || ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={`e.g. ${f.name.toLowerCase()}`}
                      className="input mt-1"
                    />
                  )}
                </label>
              );
            })}
          </div>
          {fields.filter((f) => f.type === 'field').length === 0 && (
            <p className="mt-1 text-xs text-slate-400">This template is ready to use as-is.</p>
          )}
        </div>

        {/* Live final prompt */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Your final prompt (live)</p>
          <pre className="thin-scroll mt-2 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-3.5 font-mono text-xs leading-relaxed text-slate-100">{finalPrompt}</pre>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={copy} className="btn-primary flex-1">
            {copied ? <><Check size={15} /> Copied & saved</> : <><Copy size={15} /> Copy</>}
          </button>
          <button onClick={testInCoach} disabled={testing} className="btn-secondary flex-1">
            {testing ? <Loader2 size={15} className="animate-spin" /> : <MessageSquareHeart size={15} />}
            Test in Coach Chat
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          "Test in Coach Chat" opens the Coach tab with this prompt prefilled and runs it against the AI teacher.
        </p>
      </div>
    </div>
  );
}
