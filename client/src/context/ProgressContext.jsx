import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Tracks learning progress in localStorage:
 *  - completedLessons: array of lesson ids the user finished
 *  - quizScores: { lessonId: score } from the module quizzes
 * A module counts as complete when its quiz is passed (>=1 of 2).
 */
const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [completedLessons, setCompletedLessons] = useLocalStorage('askai-completed-lessons', []);
  const [quizScores, setQuizScores] = useLocalStorage('askai-quiz-scores', {});
  const [savedPrompts, setSavedPrompts] = useLocalStorage('askai-saved-prompts', []);
  const [chatHistory, setChatHistory] = useLocalStorage('askai-chat-history', []);

  const completeLesson = useCallback(
    (lessonId, score) => {
      setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
      setQuizScores((prev) => ({ ...prev, [lessonId]: Math.max(prev[lessonId] ?? 0, score) }));
    },
    [setCompletedLessons, setQuizScores]
  );

  const resetProgress = useCallback(() => {
    setCompletedLessons([]);
    setQuizScores({});
  }, [setCompletedLessons, setQuizScores]);

  const savePrompt = useCallback(
    (prompt) => {
      setSavedPrompts((prev) =>
        prev.some((p) => p.text === prompt.text) ? prev : [{ ...prompt, id: Date.now() }, ...prev].slice(0, 50)
      );
    },
    [setSavedPrompts]
  );

  const value = {
    completedLessons,
    quizScores,
    savedPrompts,
    chatHistory,
    setChatHistory,
    completeLesson,
    resetProgress,
    savePrompt,
    isLessonComplete: (id) => completedLessons.includes(id),
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export const useProgress = () => useContext(ProgressContext);
