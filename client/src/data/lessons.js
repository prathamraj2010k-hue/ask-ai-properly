/**
 * Feature 1 - Learning Path curriculum.
 * 4 modules, each with: analogy, lesson sections, Bad vs Good prompt demo,
 * and a 2-question quiz that unlocks the next module when passed (>=1 correct).
 */

export const LESSONS = [
  {
    id: 'm1',
    title: 'What is AI & How Does It Think?',
    tagline: 'Meet the pattern-prediction machine',
    icon: 'brain',
    analogy:
      'A chatbot is like an extremely well-read autocomplete: it has read billions of sentences and is simply guessing, word by word, what a helpful reply would look like. It does not "know" things the way you do - it predicts them.',
    sections: [
      {
        heading: 'It predicts, it does not look things up',
        body: 'When you ask a question, the model does not search a database of facts. It generates the most statistically likely answer based on patterns in its training data. That is why phrasing matters: a clearer question steers the prediction toward the kind of answer you actually want.',
      },
      {
        heading: 'Tokens: how AI reads',
        body: 'AI does not read letters or even words - it reads "tokens", chunks of text roughly 4 characters long. "unbelievable" might be split into "un" + "believ" + "able". This matters because very long prompts eat the model\'s memory (context window), and unusual word splits can cause odd outputs.',
      },
      {
        heading: 'Why AI "hallucinates"',
        body: 'Because the model is predicting plausible text - not checking facts - it can confidently invent things: fake citations, wrong dates, imaginary product features. The fix is not to trust blindly: ask for sources, ask it to show its reasoning, and verify anything important.',
      },
    ],
    badPrompt: { text: 'Tell me about history.', why: 'Vague topic, no scope, no format - the AI must guess what you want, so you get a generic wall of text.' },
    goodPrompt: {
      text: 'You are a history teacher for beginners. Explain in 5 bullet points why the Roman Empire fell, focusing on economic causes only. Keep each bullet under 25 words.',
      why: 'Clear role, precise scope, fixed format, and a length limit - the prediction machine now aims exactly where you want.',
    },
    quiz: [
      {
        question: 'What is a large language model (LLM) really doing when it answers you?',
        options: [
          'Searching a verified fact database for the correct answer',
          'Predicting likely next words based on patterns it learned',
          'Thinking logically like a human expert',
          'Copying answers from websites in real time',
        ],
        correct: 1,
        explain: 'LLMs generate the most plausible text, one token at a time. They do not look facts up - which is exactly why hallucinations are possible.',
      },
      {
        question: 'Why can AI confidently state things that are simply wrong?',
        options: [
          'It is lying on purpose',
          'Your question was too short',
          'It predicts plausible-sounding text without fact-checking',
          'It only happens when the internet is down',
        ],
        correct: 2,
        explain: 'Hallucinations happen because fluency and truth are different things to a prediction machine. Always verify important claims.',
      },
    ],
  },
  {
    id: 'm2',
    title: 'The Golden Prompt Formula',
    tagline: 'Role + Task + Context + Format + Tone',
    icon: 'wand',
    analogy:
      'Think of briefing a talented new intern on their first day. If you just say "do marketing", you will get something random. If you say who they are playing (Role), what to do (Task), what you need it for (Context), what the deliverable looks like (Format) and how it should sound (Tone) - you get something usable on the first try.',
    formula: [
      { part: 'Role', example: 'You are an experienced travel agent…', question: 'Who should the AI pretend to be?' },
      { part: 'Task', example: '…create a 3-day itinerary for Lisbon…', question: 'What exactly should it do?' },
      { part: 'Context', example: '…for a couple on a $600 budget who hate museums…', question: 'What background details shape the answer?' },
      { part: 'Format', example: '…as a table with columns Day / Morning / Evening.', question: 'What shape should the output take?' },
      { part: 'Tone', example: 'Keep it fun and casual.', question: 'How should it sound?' },
    ],
    sections: [
      {
        heading: 'Why the formula works',
        body: 'Each part removes a guess the AI would otherwise have to make. Fewer guesses = answers that land closer to what you imagined on the first try. You do not always need all five parts - but when a result disappoints you, ask yourself which part was missing.',
      },
      {
        heading: 'Context is the superpower',
        body: 'The single biggest upgrade most beginners can make is adding context: who the output is for, what came before, what to avoid. "Write an email" is weak; "Write an email to my landlord asking to fix the heater, I have asked twice already and want to stay polite but firm" is strong.',
      },
    ],
    badPrompt: { text: 'Write about healthy eating.', why: 'No role, no audience, no format - you will get a generic essay nobody asked for.' },
    goodPrompt: {
      text: 'You are a nutrition coach. Create a one-day meal plan for a busy student who has only a microwave in a dorm. Format: breakfast, lunch, dinner, snack - each with 1-line preparation steps. Tone: friendly and realistic.',
      why: 'Every formula part is present: Role (coach), Task (meal plan), Context (student + microwave), Format (4 sections), Tone (friendly).',
    },
    quiz: [
      {
        question: 'In the Golden Formula, which part tells the AI who it should act as?',
        options: ['Task', 'Context', 'Role', 'Tone'],
        correct: 2,
        explain: 'Role sets the persona ("You are a…") which shifts the vocabulary, depth and angle of the answer.',
      },
      {
        question: 'Your AI answer feels generic and boring. Which formula part is most likely missing?',
        options: ['Context - the specifics of your situation', 'Tone', 'Format', 'The word "please"'],
        correct: 0,
        explain: 'Generic output almost always means missing context: audience, constraints, background, and what to avoid.',
      },
    ],
  },
  {
    id: 'm3',
    title: 'The Iterative Conversation',
    tagline: 'Great results are a dialogue, not a transaction',
    icon: 'chat',
    analogy:
      'Getting a great result from AI is like sculpting with a sculptor: the first draft is just the block of marble. You shape it with follow-ups - "make it simpler", "give me 3 options", "now critique it yourself" - instead of throwing the marble away and starting over.',
    sections: [
      {
        heading: 'Follow-ups that always work',
        body: 'Keep these in your pocket: "Make it simpler." / "Give me 3 different versions." / "Explain it like I am 12." / "Now do the same for [different case]." / "What is missing from your answer?" Each one steers the next prediction without losing the conversation history.',
      },
      {
        heading: 'Make the AI critique itself',
        body: 'A magic move: after any answer, reply "Critique your own answer: what is weak, risky or missing? Then produce an improved version." The model re-reads its own output with fresh instructions and usually catches real problems - this is a baby version of how AI agents self-correct.',
      },
      {
        heading: 'When to start over',
        body: 'If after 3-4 follow-ups the answer still misses the point, the original prompt was probably the problem. Do not keep polishing the wrong sculpture - go back, strengthen the Context part of the Golden Formula, and restart the thread.',
      },
    ],
    badPrompt: { text: '*Gets a mediocre answer and gives up* / *starts a brand-new chat repeating the same weak prompt*', why: 'Abandoning the thread throws away everything the AI already understood about what you want.' },
    goodPrompt: {
      text: 'Good answer, but too formal. Rewrite it in a casual tone, cut it to 3 short paragraphs, and add one concrete example at the end.',
      why: 'A specific follow-up keeps the good parts, fixes the weak parts, and costs 10 seconds instead of a full restart.',
    },
    quiz: [
      {
        question: 'You got a decent but imperfect answer. What is the smartest next move?',
        options: [
          'Start a new chat and retype the same prompt',
          'Give a specific follow-up that fixes the weak parts',
          'Accept it - AI cannot be improved after answering',
          'Type only "better please"',
        ],
        correct: 1,
        explain: 'Iteration beats restarting: the AI already holds your context, so targeted follow-ups are faster and more precise.',
      },
      {
        question: 'What does "Critique your own answer" trigger in the AI?',
        options: [
          'It refuses - AI cannot evaluate itself',
          'It re-analyses its output and typically finds real gaps',
          'It deletes the previous answer',
          'It switches to a different AI model',
        ],
        correct: 1,
        explain: 'Self-critique prompts make the model review its own output against quality criteria - the same loop autonomous agents use to self-correct.',
      },
    ],
  },
  {
    id: 'm4',
    title: 'AI Agents & Agendas',
    tagline: 'Chatbot vs Copilot vs Autonomous Agent',
    icon: 'bot',
    analogy:
      'A chatbot is like a person you can only text - they answer, but cannot touch anything. A copilot sits next to you in the cockpit: it suggests actions, but you press the buttons. An autonomous agent is a colleague you give a goal to: it plans, opens tools, checks its own work and keeps going until the job is done - you just approve the plan.',
    sections: [
      {
        heading: 'The three levels',
        body: 'Standard chatbot: one prompt in, one text out. No memory between sessions, no tools. Copilot (like AI in your editor): sees your work, suggests completions or actions, but a human approves every step. Autonomous agent: given a goal, it plans steps, uses tools (search, calculator, calendar, code runner), observes the results, and self-corrects until the goal is met.',
      },
      {
        heading: 'Why agents need guardrails',
        body: 'Autonomy is powerful and risky. An agent with tool access can do a lot - so mature setups keep a "human in the loop" for important actions (sending emails, spending money). When you design agent-style workflows, always decide: what may it do alone, and what needs my approval?',
      },
      {
        heading: 'See it for yourself',
        body: 'Open the Visual Lab tab in this app and run the same task ("Plan a 3-day budget trip") through all three modes side by side. Watching the agent\'s plan → tools → observe → self-correct loop is the fastest way to truly get the difference.',
      },
    ],
    badPrompt: { text: 'Book my trip to Tokyo next month.', why: 'Given to a chatbot, this is impossible - a plain chatbot has no tools and cannot book anything. Knowing which AI you are talking to prevents false expectations.' },
    goodPrompt: {
      text: 'Acting as a travel-planning copilot: suggest 3 options for a 5-day Tokyo trip under $1200 (flights excluded). For each option list: neighbourhood to stay in, 2 must-do activities per day, and estimated daily food budget. I will pick one, then you build the full day-by-day plan.',
      why: 'This structures the conversation as a copilot workflow: AI proposes, human approves, then AI executes in detail.',
    },
    quiz: [
      {
        question: 'What makes an autonomous agent different from a standard chatbot?',
        options: [
          'It is always smarter',
          'It can plan, use tools, observe results and self-correct toward a goal',
          'It answers faster',
          'It has a bigger chat window',
        ],
        correct: 1,
        explain: 'The agent loop is: plan → select tools → execute → observe → self-correct. A chatbot just produces text.',
      },
      {
        question: 'In a Copilot workflow, who approves each suggested action?',
        options: ['Another AI', 'The user (human in the loop)', 'Nobody - it acts fully alone', 'The API provider'],
        correct: 1,
        explain: 'Copilots suggest, humans decide. That approval step is exactly what separates copilots from autonomous agents.',
      },
    ],
  },
];

export const lessonIcon = (icon) => ({ brain: 'Brain', wand: 'Wand2', chat: 'MessagesSquare', bot: 'Bot' }[icon] || 'Brain');
