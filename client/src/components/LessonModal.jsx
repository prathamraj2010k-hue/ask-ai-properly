import { useState } from 'react';
import { X, Quote, ThumbsDown, ThumbsUp, CheckCircle2, PartyPopper, FlaskConical } from 'lucide-react';
import { LESSONS } from '../data/lessons.js';
import { useProgress } from '../context/ProgressContext.jsx';
import Quiz from './Quiz.jsx';

export default function LessonModal({ lessonId, onClose, onNavigate }) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const { completeLesson, isLessonComplete } = useProgress();
  const [quizPassed, setQuizPassed] = useState(false);
  const alreadyDone = isLessonComplete(lessonId);

  if (!lesson) return null;

  const handlePass = (score) => {
    completeLesson(lessonId, score);
    setQuizPassed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="thin-scroll max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky -mx-5 -mt-5 mb-5 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3 sm:-mx-7 sm:-mt-7 sm:px-7 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-500">Module lesson</p>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{lesson.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close lesson">
            <X size={20} />
          </button>
        </div>

        {/* Analogy */}
        <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-900/20">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
            <Quote size={14} /> Real-world analogy
          </p>
          <p className="mt-2 text-sm leading-relaxed text-violet-900 dark:text-violet-100">{lesson.analogy}</p>
        </div>

        {/* Sections */}
        {lesson.sections.map((s, i) => (
          <section key={i} className="mt-5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              <span className="mr-2 text-brand-500">{String(i + 1).padStart(2, '0')}</span>
              {s.heading}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.body}</p>
          </section>
        ))}

        {/* Bad vs Good prompt */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-900/20">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-rose-600 dark:text-rose-300">
              <ThumbsDown size={14} /> Weak prompt
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-rose-900 dark:text-rose-100">{lesson.badPrompt.text}</p>
            <p className="mt-2 text-xs text-rose-600/80 dark:text-rose-300/80">{lesson.badPrompt.why}</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-900/20">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
              <ThumbsUp size={14} /> Strong prompt
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-emerald-900 dark:text-emerald-100">{lesson.goodPrompt.text}</p>
            <p className="mt-2 text-xs text-emerald-600/80 dark:text-emerald-300/80">{lesson.goodPrompt.why}</p>
          </div>
        </div>

        {/* Formula table (module 2 only) */}
        {lesson.formula && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2">Part</th>
                  <th className="px-3 py-2">Example</th>
                  <th className="hidden px-3 py-2 sm:table-cell">It answers…</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lesson.formula.map((f) => (
                  <tr key={f.part}>
                    <td className="px-3 py-2 font-bold text-brand-600 dark:text-brand-400">{f.part}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600 dark:text-slate-300">{f.example}</td>
                    <td className="hidden px-3 py-2 text-slate-500 dark:text-slate-400 sm:table-cell">{f.question}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quiz */}
        <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
          {alreadyDone || quizPassed ? (
            <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
              <p className="flex items-center justify-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                <PartyPopper size={18} /> Module complete!
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button onClick={onClose} className="btn-secondary">Back to path</button>
                <button onClick={() => onNavigate('lab')} className="btn-primary">
                  <FlaskConical size={16} /> Try the Visual Lab
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                Quiz time - pass to unlock the next module
              </p>
              <Quiz questions={lesson.quiz} onPass={handlePass} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
