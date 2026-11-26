import { useState } from 'react';
import {
  Search, GraduationCap, PenLine, Code2, CheckCircle2, Lightbulb, X,
  Copy, Check, MessageSquareHeart, LayoutTemplate,
} from 'lucide-react';
import { CATEGORIES, TEMPLATES } from '../data/templates.js';
import TemplateModal from '../components/TemplateModal.jsx';

const CAT_ICONS = { GraduationCap, PenLine, Code2, CheckCircle2, Lightbulb };

export default function Templates({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openTemplate, setOpenTemplate] = useState(null);

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = category === 'all' || t.category === category;
    const q = query.toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.template.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Prompt Template Library</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {TEMPLATES.length} fill-in-the-blank prompts, built on the Golden Formula. Edit the brackets, copy, done.
          </p>
        </div>
        <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
          <LayoutTemplate size={13} /> 5 categories
        </span>
      </div>

      {/* Search + filters */}
      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates… e.g. email, quiz, bug"
            className="input !pl-9"
          />
        </div>
      </div>
      <div className="thin-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory('all')}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
            category === 'all' ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300'
          }`}
        >
          All ({TEMPLATES.length})
        </button>
        {CATEGORIES.map((c) => {
          const Icon = CAT_ICONS[c.icon];
          const count = TEMPLATES.filter((t) => t.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                category === c.id ? 'border-brand-500 bg-brand-600 text-white' : 'border-slate-300 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon size={13} /> {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => {
          const cat = CATEGORIES.find((c) => c.id === t.category);
          const Icon = CAT_ICONS[cat.icon];
          return (
            <button key={t.id} onClick={() => setOpenTemplate(t)} className="card group flex flex-col p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`badge self-start ${cat.color}`}>
                <Icon size={12} /> {cat.label}
              </span>
              <h3 className="mt-2.5 font-bold text-slate-800 dark:text-slate-100">{t.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t.desc}</p>
              <p className="mt-3 line-clamp-2 rounded-lg bg-slate-50 p-2.5 font-mono text-[11px] leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                {t.template.slice(0, 90)}…
              </p>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card mt-4 flex flex-col items-center py-12 text-center">
          <Search size={26} className="text-slate-300" />
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">No template matches "{query}"</p>
          <p className="mt-1 text-xs text-slate-400">Try a broader keyword, or clear the category filter.</p>
        </div>
      )}

      {openTemplate && (
        <TemplateModal
          template={openTemplate}
          onClose={() => setOpenTemplate(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
