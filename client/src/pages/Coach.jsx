import { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Sparkles, User, Bot, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api.js';
import { useProgress } from '../context/ProgressContext.jsx';

const STARTERS = [
  'How do I make AI write like me?',
  'What is an AI Agent?',
  'Why does AI make things up?',
  'Give me a prompt to summarise my notes',
];

export default function Coach() {
  const { chatHistory, setChatHistory } = useProgress();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory, loading]);

  // Auto-send when arriving from the Template Library ("Test in Coach Chat").
  useEffect(() => {
    if (sessionStorage.getItem('askai-autosend') === '1') {
      sessionStorage.removeItem('askai-autosend');
      const last = chatHistory[chatHistory.length - 1];
      if (last && last.role === 'user') send(last.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setError('');
    setInput('');
    const userMsg = { role: 'user', content, ts: Date.now() };
    const history = [...chatHistory, userMsg];
    setChatHistory(history);
    setLoading(true);
    try {
      const data = await api.chat(history.slice(-12).map(({ role, content }) => ({ role, content })));
      setChatHistory([...history, { role: 'assistant', content: data.reply, ts: Date.now() }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-9.5rem)] flex-col animate-fade-up lg:h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">AI Coach</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">A patient AI teacher. Ask anything about AI, prompts or agents.</p>
        </div>
        {chatHistory.length > 0 && (
          <button onClick={() => { setChatHistory([]); setError(''); }} className="btn-secondary !px-3 !py-2 text-xs">
            <RotateCcw size={14} /> New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="thin-scroll card mt-4 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {chatHistory.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
              <Bot size={28} />
            </span>
            <p className="mt-3 font-bold text-slate-700 dark:text-slate-200">Hi! I am your AI Coach.</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              I explain things simply, give copy-paste examples, and suggest what to ask next. No question is too basic.
            </p>
            <div className="mt-5 grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-left text-xs font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/60"
                >
                  <Sparkles size={12} className="mr-1.5 inline" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === 'user' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-brand-600 text-white'}`}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </span>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'rounded-tr-sm bg-brand-600 text-white' : 'rounded-tl-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Bot size={16} /></span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3.5 dark:bg-slate-800">
              {[0, 1, 2].map((d) => <span key={d} className="typing-dot h-2 w-2 rounded-full bg-slate-400" />)}
            </div>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={Math.min(3, Math.max(1, input.split('\n').length))}
          placeholder="Ask the Coach anything… (Enter to send, Shift+Enter for new line)"
          className="input resize-none"
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="btn-primary h-[42px] !px-4" aria-label="Send message">
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
