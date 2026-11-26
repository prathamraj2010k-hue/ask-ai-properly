import { useState } from 'react';
import {
  GraduationCap,
  MessageSquareHeart,
  Wand2,
  FlaskConical,
  LayoutTemplate,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from './context/ThemeContext.jsx';
import { useProgress } from './context/ProgressContext.jsx';
import { LESSONS } from './data/lessons.js';
import Learn from './pages/Learn.jsx';
import Coach from './pages/Coach.jsx';
import Fixer from './pages/Fixer.jsx';
import Lab from './pages/Lab.jsx';
import Templates from './pages/Templates.jsx';

const TABS = [
  { id: 'learn', label: 'Learn', icon: GraduationCap, description: 'Interactive lessons' },
  { id: 'coach', label: 'Coach', icon: MessageSquareHeart, description: 'Chat with AI tutor' },
  { id: 'fixer', label: 'Fixer', icon: Wand2, description: 'Upgrade weak prompts' },
  { id: 'lab', label: 'Visual Lab', icon: FlaskConical, description: 'Agent simulator' },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, description: 'Copy-ready prompts' },
];

export default function App() {
  const [tab, setTab] = useState('learn');
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { completedLessons, chatHistory } = useProgress();

  const go = (id) => {
    setTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const progressPct = Math.round((completedLessons.length / LESSONS.length) * 100);

  const NavItem = ({ t, compact = false }) => {
    const active = tab === t.id;
    return (
      <button
        onClick={() => go(t.id)}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
          active
            ? 'bg-brand-600 text-white shadow'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        } ${compact ? 'justify-center' : ''}`}
        aria-current={active ? 'page' : undefined}
      >
        <t.icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-brand-500'} />
        {!compact && (
          <span className="flex-1">
            {t.label}
            <span className={`block text-xs font-normal ${active ? 'text-brand-100' : 'text-slate-400 dark:text-slate-500'}`}>
              {t.description}
            </span>
          </span>
        )}
        {!compact && t.id === 'learn' && progressPct === 100 && (
          <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Done</span>
        )}
      </button>
    );
  };

  const Sidebar = (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:flex">
      <button onClick={() => go('learn')} className="mb-6 flex items-center gap-2.5 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-lg font-extrabold text-white">AI</span>
        <span className="text-lg font-extrabold tracking-tight">
          Ask <span className="text-brand-600 dark:text-brand-400">AI</span> Properly
        </span>
      </button>

      <nav className="flex-1 space-y-1.5">
        {TABS.map((t) => (
          <NavItem key={t.id} t={t} />
        ))}
      </nav>

      <div className="mt-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Learning progress</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {completedLessons.length} / {LESSONS.length} modules · {chatHistory.length} chat messages
        </p>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      {Sidebar}

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:hidden">
          <button onClick={() => setMenuOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="text-base font-extrabold tracking-tight">
            Ask <span className="text-brand-600 dark:text-brand-400">AI</span> Properly
          </span>
          <ThemeButton dark={dark} toggle={toggle} />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-5 lg:px-8 lg:pb-10 lg:pt-8">
          {tab === 'learn' && <Learn onNavigate={go} />}
          {tab === 'coach' && <Coach />}
          {tab === 'fixer' && <Fixer />}
          {tab === 'lab' && <Lab />}
          {tab === 'templates' && <Templates onNavigate={go} />}
        </main>
      </div>

      {/* Desktop theme toggle (floating) */}
      <div className="fixed bottom-5 right-5 z-30 hidden lg:block">
        <ThemeButton dark={dark} toggle={toggle} />
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-4 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-lg font-extrabold">
                Ask <span className="text-brand-600 dark:text-brand-400">AI</span> Properly
              </span>
              <button onClick={() => setMenuOpen(false)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1.5">
              {TABS.map((t) => (
                <NavItem key={t.id} t={t} />
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}
            >
              <t.icon size={20} />
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function ThemeButton({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
