import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

/**
 * Interactive 2-question quiz. Passing (>=1 correct) calls onPass(score).
 * Instant feedback explains WHY each answer is right - that is where the
 * real learning happens.
 */
export default function Quiz({ questions, onPass }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const passed = score >= 1;

  const submit = () => {
    setSubmitted(true);
    if (passed) onPass(score);
  };

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <div key={qi} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                {qi + 1}
              </span>
              {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                let cls = 'border-slate-200 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-600';
                const isCorrect = submitted && oi === q.correct;
                const isWrongChoice = submitted && chosen === oi && oi !== q.correct;
                if (submitted && isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30';
                if (isWrongChoice) cls = 'border-rose-400 bg-rose-50 dark:bg-rose-900/30';
                return (
                  <button
                    key={oi}
                    onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi }))}
                    disabled={submitted}
                    className={`flex w-full items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 text-left text-sm transition ${cls} ${
                      chosen === oi && !submitted ? 'ring-2 ring-brand-300' : ''
                    }`}
                  >
                    <span className="font-mono text-xs text-slate-400">{String.fromCharCode(65 + oi)}</span>
                    <span className="flex-1 text-slate-700 dark:text-slate-200">{opt}</span>
                    {isCorrect && <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />}
                    {isWrongChoice && <XCircle size={16} className="shrink-0 text-rose-500" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-100 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-500" />
                {q.explain}
              </p>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button onClick={submit} disabled={Object.keys(answers).length < questions.length} className="btn-primary w-full">
          Check my answers <ArrowRight size={16} />
        </button>
      ) : (
        <p className={`text-center font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {passed
            ? `You scored ${score}/${questions.length} - module unlocked!`
            : `You scored ${score}/${questions.length} - read the explanations above and try again.`}
        </p>
      )}
    </div>
  );
}
