import type {
  AppState,
  Week,
  Skill,
  SideProject,
  PythonWarmupDay,
  PortfolioArtifact,
} from './types';

interface WeekSeed {
  number: number;
  title: string;
  course: string;
  practice: string;
  portfolio: string;
  interview: string;
  deliverable: string;
  sideProjectNote?: string;
  pythonWarmupTopic?: string;
}

const WEEK_SEEDS: WeekSeed[] = [
  {
    number: 1,
    title: 'LLM foundations (+ daily Python warm-up)',
    course:
      "Ed Donner's LLM Engineering (prompting, structured output, embeddings)",
    practice:
      '5-pattern prompt library with token-cost measurement, written as a typed, tested Python package',
    portfolio:
      'First LLM endpoint answering questions, scaffolded as a typed Python repo with pytest',
    interview:
      "Explain LLM architecture + prompt vs RAG vs fine-tune; Python's typing/async model",
    deliverable:
      'Working AI feature (single LLM call) in a public, typed repo + CI stub',
    pythonWarmupTopic: 'typing → Pydantic',
  },
  {
    number: 2,
    title: 'Structured output + Claude API basics (+ daily Python warm-up)',
    course:
      'Anthropic Academy "Building with the Claude API" (API access, structured data, streaming)',
    practice: 'Force structured JSON output with Pydantic validation',
    portfolio: 'Flagship returns structured, validated responses',
    interview: 'Structured output + why it matters for tools',
    deliverable: 'Structured-output feature',
    pythonWarmupTopic: 'async/await → context managers',
  },
  {
    number: 3,
    title: 'LLM app development (+ daily Python warm-up)',
    course: "Academind's \"AI Agents & Workflows – The Practical Guide\"",
    practice: 'Build the Q&A bot with raw SDK vs framework',
    portfolio: 'Refactor flagship into clean layers (model/prompt/logic)',
    interview: 'Framework vs no-framework tradeoffs',
    deliverable: 'First AI workflow deployed to a free host',
    sideProjectNote:
      'Weekend: start the NL-to-SQL agent — pick a public dataset, get plain-English → SQL working for simple queries',
    pythonWarmupTopic: 'pytest',
  },
  {
    number: 4,
    title: 'Tool calling (+ daily Python warm-up, final week)',
    course: "Tool-calling modules within Ed Donner's LLM Engineering course",
    practice:
      'Add calculator + Wikipedia + mock-internal-API tools with error handling',
    portfolio: 'Flagship gains tools (ticket lookup, search)',
    interview: 'How tool calling works under the hood',
    deliverable: 'Multi-tool bot',
    sideProjectNote:
      'Weekend: add tool-calling + error handling to the NL-to-SQL agent (retry on invalid SQL, explain results in plain English)',
    pythonWarmupTopic: 'packaging / decorators / generators',
  },
  {
    number: 5,
    title: 'RAG part 1',
    course: 'The Complete LangChain & RAG Developer Course 2026',
    practice: 'Chunk + embed a document corpus; basic retrieval',
    portfolio: 'Flagship RAG backend v1',
    interview: 'Chunking/embeddings/vector search',
    deliverable: 'RAG-answering feature',
    sideProjectNote:
      'Weekend: polish and deploy the NL-to-SQL agent; measure accuracy on ~50 test queries and write it up — side project finish line',
  },
  {
    number: 6,
    title: 'RAG part 2 (production + eval)',
    course: 'RAG++ (W&B/Cohere/Weaviate, free)',
    practice:
      'Add reranking + hybrid search; measure precision/recall/faithfulness',
    portfolio: 'Flagship RAG v2 + eval notebook',
    interview: 'Debugging bad retrievals; RAG evaluation',
    deliverable: 'RAG eval report',
  },
  {
    number: 7,
    title: 'Agentic AI part 1',
    course:
      "Ed Donner's Complete Agentic AI Engineering Course (CrewAI/LangGraph fundamentals)",
    practice: 'Build a multi-tool agent',
    portfolio: 'Convert flagship workflow → agent',
    interview: 'Workflow vs agent',
    deliverable: 'Working agent',
  },
  {
    number: 8,
    title: 'Agentic AI part 2 + MCP',
    course:
      "Complete Agentic AI Engineering Course (deployment module) + Eden Marco's MCP Crash Course",
    practice: 'Deploy agent; build an MCP server',
    portfolio: 'Expose flagship tools via MCP server',
    interview: 'MCP N×M problem + agent failure modes',
    deliverable: 'Deployed agent + MCP server',
  },
  {
    number: 9,
    title: 'AI evaluation',
    course: 'AI Agents, RAG & LLM Evals for Beginners (DeepEval & RAGAS)',
    practice: 'Golden dataset + LLM-as-judge; induce and catch a regression',
    portfolio: 'Flagship eval dashboard + CI eval gate',
    interview: 'Designing an eval strategy for a customer',
    deliverable: 'Evaluation pipeline + a second, standalone portfolio repo',
    sideProjectNote:
      'Generalize the eval suite into the standalone eval CLI side project — point it at the flagship as the first test case',
  },
  {
    number: 10,
    title: 'AI security',
    course: 'AI Security: Defend LLM Apps Against the OWASP LLM Top 10',
    practice:
      'Run and defend a prompt-injection + system-prompt-leak on the flagship',
    portfolio: 'Guardrails + one-page threat model',
    interview: 'OWASP LLM Top 10 walkthrough',
    deliverable: 'Hardened flagship + threat model doc',
  },
  {
    number: 11,
    title: 'Backend/API + START APPLYING',
    course: "Eric Roby's FastAPI Complete Course",
    practice: 'Wrap flagship in authenticated, tested FastAPI',
    portfolio: 'Flagship as a real API with OpenAPI docs + JWT',
    interview: 'API design defense',
    deliverable: 'API service + first batch of job applications sent',
  },
  {
    number: 12,
    title: 'System design',
    course:
      "Frank Kane's Mastering the System Design Interview + selected Pogrebinsky modules",
    practice: 'Whiteboard "enterprise LLM assistant" + a data pipeline',
    portfolio: 'Architecture doc + diagram in README',
    interview: 'Structured design narration',
    deliverable: 'Architecture doc + more applications',
  },
  {
    number: 13,
    title: 'Docker + Cloud/AWS part 1',
    course:
      "Bret Fisher's Docker Mastery (Docker-only modules) + Stephane Maarek's AWS Cloud Practitioner",
    practice: 'Containerize flagship + vector DB with Compose',
    portfolio: 'Dockerfile + compose in repo',
    interview: 'Container/deploy strategy',
    deliverable: 'Containerized app',
  },
  {
    number: 14,
    title: 'Cloud/AWS part 2 + CI/CD',
    course:
      "Maarek's AWS course (deploy focus) + Academind's GitHub Actions Complete Guide",
    practice:
      'Deploy flagship to ECS Fargate/App Runner; build test→eval→build→deploy pipeline',
    portfolio: 'Live public URL + green CI badge',
    interview: 'Deploy/secure/monitor/troubleshoot on AWS',
    deliverable: 'Live deployed flagship + CI/CD',
  },
  {
    number: 15,
    title: 'Observability + technical communication',
    course:
      'OpenTelemetry for Observability: The Complete Course + Google Technical Writing',
    practice:
      'Instrument flagship (latency/tokens/cost traces); write README + architecture doc',
    portfolio: 'Monitoring dashboard + polished docs + 5-min demo video',
    interview: 'Diagnosing LLM latency',
    deliverable: 'Observability dashboard + demo video',
  },
  {
    number: 16,
    title: 'Customer discovery + FDE interview prep part 1',
    course:
      'The Mom Test + Palantir "Navigating Open-Ended Questions" + Exponent FDE guide',
    practice: '2 discovery role-plays + 3 decomposition mocks',
    portfolio: 'Customer problem brief + 1 blog post',
    interview: 'Solution-design scoping; decomposition',
    deliverable: 'Customer brief + blog post + heavy applications',
  },
  {
    number: 17,
    title: 'FDE interview prep part 2 + push',
    course: 'Review + values/responsible-deployment reasoning',
    practice:
      'Timed API take-home + recorded client video; 30-min flagship deep-dive rehearsal; solution-design role-play',
    portfolio: 'Final polish + 2nd blog post',
    interview: 'Full mock loop',
    deliverable: 'Interview-ready portfolio + sustained applications/networking',
  },
];

function buildWeeks(): Week[] {
  return WEEK_SEEDS.map((seed) => ({
    number: seed.number,
    title: seed.title,
    course: seed.course,
    practice: seed.practice,
    portfolio: seed.portfolio,
    interview: seed.interview,
    deliverable: seed.deliverable,
    sideProjectNote: seed.sideProjectNote,
    pythonWarmupTopic: seed.pythonWarmupTopic,
    courseDone: false,
    practiceDone: false,
    portfolioDone: false,
    deliverableDone: false,
    notes: '',
  }));
}

interface SkillSeed {
  id: number;
  name: string;
  primaryCourse: string;
  stopLearningWhen: string;
}

const SKILL_SEEDS: SkillSeed[] = [
  {
    id: 1,
    name: 'Python for experienced software engineers',
    primaryCourse:
      'Complete Python Bootcamp (Jose Portilla, Udemy), daily warm-up Weeks 1–4',
    stopLearningWhen:
      'you can build and debug a typed, tested production Python API without reaching for syntax references.',
  },
  {
    id: 2,
    name: 'AI/LLM engineering (foundations)',
    primaryCourse:
      'LLM Engineering: Master AI, Large Language Models & Agents (Ed Donner, Udemy)',
    stopLearningWhen:
      'you can explain LLM architecture at a whiteboard and pick the right technique for a customer problem.',
  },
  {
    id: 3,
    name: 'LLM application development',
    primaryCourse:
      'AI Agents & Workflows – The Practical Guide (Academind, Udemy)',
    stopLearningWhen:
      'you can build a multi-step LLM app and justify your framework choice.',
  },
  {
    id: 4,
    name: 'RAG (retrieval-augmented generation)',
    primaryCourse: 'The Complete LangChain & RAG Developer Course 2026 (Udemy)',
    stopLearningWhen:
      'you can design, implement, evaluate, and explain a production RAG system end to end.',
  },
  {
    id: 5,
    name: 'Tool calling',
    primaryCourse:
      "covered inside Ed Donner's LLM Engineering + Complete Agentic AI Engineering Course",
    stopLearningWhen:
      'you can wire multiple reliable tools into an LLM with proper error handling.',
  },
  {
    id: 6,
    name: 'Agentic AI',
    primaryCourse: 'The Complete Agentic AI Engineering Course (Ed Donner, Udemy)',
    stopLearningWhen:
      'you can build, deploy, and evaluate a multi-step agent and articulate its failure modes.',
  },
  {
    id: 7,
    name: 'MCP (Model Context Protocol)',
    primaryCourse: 'MCP Crash Course (Eden Marco, Udemy)',
    stopLearningWhen:
      'you can build and explain an MCP server + client from scratch.',
  },
  {
    id: 8,
    name: 'Claude / Anthropic APIs',
    primaryCourse: 'Building with the Claude API (Anthropic Academy, free)',
    stopLearningWhen:
      'you can ship a production Claude integration using caching, tool use, and citations.',
  },
  {
    id: 9,
    name: 'AI evaluation',
    primaryCourse:
      'AI Agents, RAG & LLM Evals for Beginners: DeepEval & RAGAS (Udemy)',
    stopLearningWhen:
      'you can design, implement, and interpret an evaluation pipeline that gates deployments.',
  },
  {
    id: 10,
    name: 'AI security',
    primaryCourse:
      'AI Security: Defend LLM Apps Against the OWASP LLM Top 10 (Udemy)',
    stopLearningWhen:
      'you can threat-model an LLM app and implement the core mitigations.',
  },
  {
    id: 11,
    name: 'Backend/API engineering',
    primaryCourse: 'FastAPI — The Complete Course 2026 (Eric Roby, Udemy)',
    stopLearningWhen:
      'you can build, secure, test, and document a production FastAPI service.',
  },
  {
    id: 12,
    name: 'System design',
    primaryCourse: 'Mastering the System Design Interview (Frank Kane, Udemy)',
    stopLearningWhen:
      'you can confidently structure and narrate any mid-level design problem, including AI systems.',
  },
  {
    id: 13,
    name: 'Cloud/AWS',
    primaryCourse:
      'Ultimate AWS Certified Cloud Practitioner CLF-C02 (Stephane Maarek, Udemy)',
    stopLearningWhen:
      'you can deploy, monitor, secure, and troubleshoot the flagship on AWS.',
  },
  {
    id: 14,
    name: 'Docker',
    primaryCourse: 'Docker Mastery (Bret Fisher, Udemy)',
    stopLearningWhen:
      'you can containerize and locally orchestrate a multi-service app.',
  },
  {
    id: 15,
    name: 'CI/CD',
    primaryCourse: 'GitHub Actions — The Complete Guide (Academind, Udemy)',
    stopLearningWhen:
      'you have an automated test→eval→build→deploy pipeline running.',
  },
  {
    id: 16,
    name: 'Observability',
    primaryCourse:
      'OpenTelemetry for Observability: The Complete Course (Udemy)',
    stopLearningWhen:
      "you can instrument, trace, and debug the flagship's performance and cost in production.",
  },
  {
    id: 17,
    name: 'Customer discovery',
    primaryCourse: 'The Mom Test (free, book)',
    stopLearningWhen:
      'you instinctively ask about real past behavior instead of pitching your solution.',
  },
  {
    id: 18,
    name: 'Technical communication',
    primaryCourse: 'Google Technical Writing (free)',
    stopLearningWhen:
      'you can explain any project you built clearly in writing and on video to a non-expert.',
  },
  {
    id: 19,
    name: 'FDE interview preparation',
    primaryCourse:
      "Palantir's \"Navigating Open-Ended Questions\" + Exponent FDE guide (free)",
    stopLearningWhen:
      'you can pass a decomposition mock, deliver a clean project deep-dive, and scope a solution-design prompt without jumping to architecture.',
  },
];

function buildSkills(): Skill[] {
  return SKILL_SEEDS.map((seed) => ({
    id: seed.id,
    name: seed.name,
    primaryCourse: seed.primaryCourse,
    stopLearningWhen: seed.stopLearningWhen,
    status: 'not_started',
  }));
}

function buildSideProjects(): SideProject[] {
  return [
    {
      id: 'eval-tool',
      name: 'Eval/observability micro-tool',
      description:
        'A standalone CLI that points at any RAG/agent HTTP endpoint plus a golden-question dataset, runs an LLM-as-judge pass, and prints a scored report (faithfulness, context relevance, pass/fail per question).',
      weeks: 'Week 9',
      milestones: [
        { label: 'Golden-question dataset created', done: false },
        { label: 'LLM-as-judge scoring implemented', done: false },
        { label: 'CLI accepts any endpoint URL as input', done: false },
        {
          label:
            'Scored report output (faithfulness, context relevance, pass/fail)',
          done: false,
        },
        { label: 'Run against the flagship as first test case', done: false },
        { label: 'Published as its own GitHub repo', done: false },
      ],
    },
    {
      id: 'nl-to-sql',
      name: 'Natural-language-to-SQL agent',
      description:
        'Plain-English question in, SQL query + result table + plain-English explanation out, against a small public dataset. Includes retry-on-invalid-SQL error handling.',
      weeks: 'Weeks 3–5',
      milestones: [
        { label: 'Public dataset chosen and loaded', done: false },
        { label: 'Basic plain-English → SQL working', done: false },
        { label: 'Tool-calling + retry on invalid SQL', done: false },
        { label: 'Plain-English explanation of results', done: false },
        { label: 'Deployed somewhere public', done: false },
        {
          label: 'Accuracy measured on ~50 test queries and written up',
          done: false,
        },
      ],
    },
  ];
}

function buildPythonWarmup(weeks: Week[]): PythonWarmupDay[] {
  const days: PythonWarmupDay[] = [];
  for (const week of weeks) {
    if (week.number < 1 || week.number > 4) continue;
    const topic = week.pythonWarmupTopic ?? '';
    for (let day = 1; day <= 7; day++) {
      days.push({
        week: week.number,
        day,
        topic,
        done: false,
      });
    }
  }
  return days;
}

const PORTFOLIO_ARTIFACT_LABELS = [
  'Flagship repo',
  'Flagship live deployment URL',
  'Eval CLI tool repo',
  'NL-to-SQL agent repo',
  'MCP server repo',
  'Architecture doc / README',
  'Demo video',
  'Blog post 1',
  'Blog post 2',
];

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildPortfolioArtifacts(): PortfolioArtifact[] {
  return PORTFOLIO_ARTIFACT_LABELS.map((label) => ({
    id: slugify(label),
    label,
    url: '',
    done: false,
  }));
}

export function getInitialState(): AppState {
  const weeks = buildWeeks();
  return {
    startDate: '',
    weeks,
    skills: buildSkills(),
    sideProjects: buildSideProjects(),
    pythonWarmup: buildPythonWarmup(weeks),
    jobApplications: [],
    interviewMocks: [],
    portfolioArtifacts: buildPortfolioArtifacts(),
  };
}
