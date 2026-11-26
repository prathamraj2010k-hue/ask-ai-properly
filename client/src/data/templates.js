/**
 * Feature 5 - Prompt Template Library.
 * 15 fill-in-the-blank templates across 5 categories.
 * Placeholders use [BRACKETS] and become editable form fields in the UI.
 */

export const CATEGORIES = [
  { id: 'students', label: 'Students & Studying', icon: 'GraduationCap', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300' },
  { id: 'writing', label: 'Writing & Communication', icon: 'PenLine', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300' },
  { id: 'coding', label: 'Coding & Tech', icon: 'Code2', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' },
  { id: 'productivity', label: 'Daily Productivity', icon: 'CheckCircle2', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' },
  { id: 'creative', label: 'Creative Brainstorming', icon: 'Lightbulb', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300' },
];

export const TEMPLATES = [
  // ---- Students & Studying ----
  {
    id: 't1', category: 'students', title: 'Explain Like I Am New',
    desc: 'Understand any concept from zero, with an analogy you will never forget.',
    template:
      'You are a patient teacher who explains things simply. Explain [TOPIC] to me as if I am a complete beginner who knows nothing about it. Structure: 1) a one-sentence definition, 2) an everyday analogy, 3) why it matters, 4) one common misconception. Keep it under 300 words.',
  },
  {
    id: 't2', category: 'students', title: 'Active Recall Quiz Master',
    desc: 'Turn any notes or chapter into a self-test quiz.',
    template:
      'You are a study coach. Create a quiz of 8 questions based on this material: "[PASTE YOUR NOTES]". Mix question types: 4 multiple choice, 3 short answer, 1 hard "explain in your own words". After each question, leave the answer hidden below a spacer line so I can test myself first.',
  },
  {
    id: 't3', category: 'students', title: 'Essay Feedback Coach',
    desc: 'Get structured, actionable feedback before you submit.',
    template:
      'You are a strict but encouraging essay grader. Review this essay: "[PASTE ESSAY]". Give: 1) a score out of 10, 2) the 3 strongest points, 3) the 3 biggest weaknesses with concrete rewrites of my actual sentences, 4) one paragraph-level suggestion about structure. Be specific - quote my text when you comment.',
  },
  // ---- Writing & Communication ----
  {
    id: 't4', category: 'writing', title: 'Professional Email Writer',
    desc: 'Polite, clear emails that get replies.',
    template:
      'You are a professional communication expert. Write an email to [RECIPIENT] about [WHAT THE EMAIL IS ABOUT]. Situation context: [BACKGROUND - e.g. "I have already asked once, two weeks ago"]. Goal of the email: [WHAT YOU WANT TO HAPPEN]. Tone: polite but firm. Keep it under 150 words and give me 2 versions: formal and friendly.',
  },
  {
    id: 't5', category: 'writing', title: 'Rewrite in My Voice',
    desc: 'Make any text sound like you wrote it.',
    template:
      'Rewrite the text below so it sounds like me. My writing style: [DESCRIBE YOUR STYLE - e.g. "casual, short sentences, light humour, no jargon"]. Keep the meaning identical, do not add new facts. Text: "[PASTE TEXT]". After rewriting, list the 3 biggest changes you made.',
  },
  {
    id: 't6', category: 'writing', title: 'Difficult Message Diplomat',
    desc: 'Say something hard without starting a war.',
    template:
      'You are a diplomacy expert. I need to tell [WHO] that [THE HARD MESSAGE]. Their perspective is probably: [HOW THEY SEE IT]. I want to keep the relationship good while still being honest. Draft the message, then explain the 2 phrases that do the heavy lifting to keep it kind but clear.',
  },
  // ---- Coding & Tech ----
  {
    id: 't7', category: 'coding', title: 'Bug Hunter',
    desc: 'Explain the bug, then fix it - with reasoning.',
    template:
      'You are a senior [LANGUAGE] developer. Here is my code: "[PASTE CODE]". The bug or problem is: [DESCRIBE THE SYMPTOM]. Steps: 1) explain the root cause in simple language, 2) give the corrected code with the changed lines marked by comments, 3) tell me how to avoid this bug class in the future.',
  },
  {
    id: 't8', category: 'coding', title: 'Code Explainer',
    desc: 'Understand unfamiliar code line by line.',
    template:
      'You are a programming tutor. Explain this code to someone who knows basic [LANGUAGE]: "[PASTE CODE]". Structure: 1) what the code does overall in one sentence, 2) walk through it block by block, 3) point out one clever part and one risky part. Use analogies for anything advanced.',
  },
  {
    id: 't9', category: 'coding', title: 'Tech Stack Advisor',
    desc: 'Pick the right tool with honest trade-offs.',
    template:
      'You are a pragmatic software architect. I want to build [PROJECT DESCRIPTION]. My skill level: [BEGINNER/INTERMEDIATE/ADVANCED]. Constraints: [BUDGET/TIME/PLATFORM]. Compare 3 realistic tech stack options in a table (pros, cons, learning curve), then recommend ONE with a 2-sentence justification. Do not recommend enterprise tools for small projects.',
  },
  // ---- Daily Productivity ----
  {
    id: 't10', category: 'productivity', title: 'Overwhelm-to-Plan Converter',
    desc: 'Turn a chaotic to-do pile into a calm schedule.',
    template:
      'You are a productivity coach. Here is everything on my plate: "[LIST YOUR TASKS/STRESSES]". I have [NUMBER] hours available and my energy peaks [WHEN - e.g. "in the morning"]. Turn this into a realistic plan: 1) what to do now, 2) what to schedule, 3) what to delete or delegate, 4) the ONE task that will make today a success. Be honest about what does not fit.',
  },
  {
    id: 't11', category: 'productivity', title: 'Meeting Minutes Machine',
    desc: 'Messy notes in, clean decisions out.',
    template:
      'You are an executive assistant. Turn these rough meeting notes into clean minutes: "[PASTE NOTES]". Output format: Decisions Made / Action Items (owner + deadline) / Open Questions / Next Meeting. If a decision or owner is unclear, flag it with "?" instead of guessing.',
  },
  {
    id: 't12', category: 'productivity', title: 'Decision Pros & Cons Analyst',
    desc: 'Think through a hard choice with a fair framework.',
    template:
      'You are a rational decision coach. I am deciding between [OPTION A] and [OPTION B]. What matters to me: [YOUR PRIORITIES]. Build a weighted pros/cons table (weight each factor 1-5 based on my priorities), name the 2 factors that should dominate the decision, and tell me what information is missing that would make the choice easier.',
  },
  // ---- Creative Brainstorming ----
  {
    id: 't13', category: 'creative', title: 'Idea Explosion',
    desc: '20 ideas sorted from safe to wild.',
    template:
      'You are a creative director. Give me 20 ideas for [WHAT YOU NEED IDEAS FOR]. Context: [WHO IT IS FOR / CONSTRAINTS]. Split them into 3 groups: Safe & proven (7), Interesting twists (7), Wild & unexpected (6). Format: numbered list, one bold title + one line per idea. Do not repeat variations of the same idea.',
  },
  {
    id: 't14', category: 'creative', title: 'Story & Character Builder',
    desc: 'A story seed with conflict baked in.',
    template:
      'You are a novelist. Build a story premise set in [SETTING] whose main character is [CHARACTER SKETCH]. Give: 1) a logline (1 sentence), 2) the character\'s want vs need (they must conflict), 3) the central obstacle, 4) a twist idea, 5) the opening scene in 3 sentences. Tone of the story: [DARK/HOPEFUL/FUNNY].',
  },
  {
    id: 't15', category: 'creative', title: 'Name & Tagline Factory',
    desc: 'Names for anything, with reasoning.',
    template:
      'You are a brand naming expert. Create names for [PROJECT/BUSINESS/PRODUCT] which is [ONE-LINE DESCRIPTION]. Target audience: [AUDIENCE]. Feel: [E.G. playful/premium/technical]. Give 10 names: 5 invented words, 5 real-word combinations. For each: one-line rationale and a matching tagline. Flag any name that has obvious negative meanings.',
  },
];
