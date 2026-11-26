import { useState } from 'react';
import { Brain, Wand2, MessagesSquare, Bot, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { LESSONS } from '../data/lessons.js';
import { useProgress } from '../context/ProgressContext.jsx';
import LessonModal from '../components/LessonModal.jsx';

const ICONS = { brain: Brain, wand: Wand2, chat: MessagesSquare, bot: Bot };

export default function Learn({ onNavigate }) {
  const { completedLessons, resetProgress } = useProgress();
  const [openLesson, setOpenLesson] = useState(null);

  const isUnlocked = (index) => index === 0 || completedLessons.includes(LESSONS[index - 1].id);
  const pct = Math.round((completedLessons.length / LESSONS.length) * 100);

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 p-6 text-white shadow-lg sm:p-8">
        <p className="badge bg-white/20 text-white backdrop-blur">
          <Sparkles size={13} /> Interactive learning path
        </p>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
          Learn to talk to AI like a pro
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-100 sm:text-base">
          Four hands-on modules: how AI actually thinks, the Golden Prompt Formula, the art of the follow-up,
          and how AI Agents work. Each module ends with a quiz that unlocks the next one.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold">{pct}%</span>
        </div>
        {pct === 100 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="badge bg-emerald-400 text-emerald-950">
              <CheckCircle2 size={14} /> All modules complete - you are a prompt pro!
            </span>
            <button onClick={resetProgress} className="text-xs underline underline-offset-2 text-white/80 hover:text-white">
              reset progress
            </button>
          </div>
        )}
      </section>

      {/* Module cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {LESSONS.map((lesson, i) => {
          const Icon = ICONS[lesson.icon] || Brain;
          const done = completedLessons.includes(lesson.id);
          const unlocked = isUnlocked(i);
          return (
            <button
              key={lesson.id}
              onClick={() => unlocked && setOpenLesson(lesson.id)}
              disabled={!unlocked}
              className={`card group relative flex flex-col p-5 text-left transition ${
                unlocked ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${done ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-brand-100 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300'}`}>
                  {unlocked ? <Icon size={22} /> : <Lock size={20} />}
                </span>
                <span className="text-xs font-bold text-slate-400">MODULE {i + 1}</span>
              </div>
              <h3 className="mt-3 font-bold text-slate-800 dark:text-slate-100">{lesson.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">{lesson.tagline}</p>
              <div className="mt-4 flex items-center justify-between">
                {done ? (
                  <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">{lesson.quiz.length} quiz questions</span>
                )}
                {unlocked && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {done ? 'Review' : 'Start'} <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Cross-link */}
      <button
        onClick={() => onNavigate('lab')}
        className="mt-6 flex w-full items-center justify-between rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-4 text-left transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/20 dark:hover:bg-brand-900/40"
      >
        <div>
          <p className="font-bold text-brand-700 dark:text-brand-300">Finished the modules? See AI Agents in action</p>
          <p className="text-sm text-brand-600/80 dark:text-brand-400/80">Run the Chatbot vs Copilot vs Agent simulation in the Visual Lab.</p>
        </div>
        <ArrowRight className="shrink-0 text-brand-500" />
      </button>

      {openLesson && (
        <LessonModal lessonId={openLesson} onClose={() => setOpenLesson(null)} onNavigate={onNavigate} />
      )}
    </div>
  );
}
