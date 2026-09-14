# FDE Roadmap Tracker — Project Spec for Claude Code

## What this app is

A local, single-user web app to track progress through a personal 17-week
"Forward Deployed Engineer" learning-and-build roadmap. It runs entirely in
the browser — no backend, no auth, no cloud sync. All state persists in
`localStorage`. The goal is a fast, low-friction daily/weekly checklist tool,
not a polished SaaS product.

## Tech stack (use exactly this — keep it simple)

- **React + TypeScript + Vite** (`npm create vite@latest -- --template react-ts`)
- **Tailwind CSS** for styling (utility classes only, no component library)
- **No backend.** All data lives in `localStorage`, wrapped by a small
  `storage.ts` helper (get/set/reset, JSON-serialized).
- **No routing library needed** — a handful of tabs/views in one page is
  fine (`useState` for the active view). Only add `react-router` if the app
  grows enough to need real URLs.
- Single `npm run dev` should be enough to run everything locally.

## Data model

Put these in `src/types.ts`:

```typescript
export interface Week {
  number: number;              // 1–17
  title: string;
  course: string;
  practice: string;
  portfolio: string;
  interview: string;
  deliverable: string;
  sideProjectNote?: string;
  pythonWarmupTopic?: string;  // only set for weeks 1–4
  courseDone: boolean;
  practiceDone: boolean;
  portfolioDone: boolean;
  deliverableDone: boolean;
  notes: string;
}

export interface Skill {
  id: number;                  // 1–19
  name: string;
  primaryCourse: string;
  stopLearningWhen: string;
  status: 'not_started' | 'in_progress' | 'done';
}

export interface SideProjectMilestone {
  label: string;
  done: boolean;
}

export interface SideProject {
  id: string;
  name: string;
  description: string;
  weeks: string;               // e.g. "Weeks 3–5"
  milestones: SideProjectMilestone[];
}

export interface PythonWarmupDay {
  week: number;                // 1–4
  day: number;                 // 1–7 (Mon–Sun, or however the user works)
  topic: string;
  done: boolean;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string;         // ISO date
  status: 'applied' | 'interviewing' | 'rejected' | 'offer';
  notes: string;
}

export interface InterviewMock {
  id: string;
  week: number;
  type: 'decomposition' | 'solution-design' | 'deep-dive' | 'take-home' | 'other';
  date: string;                // ISO date
  notes: string;
}

export interface PortfolioArtifact {
  id: string;
  label: string;               // "Flagship repo", "Eval CLI tool repo", "NL-to-SQL repo", "Blog post 1", "Demo video", etc.
  url: string;
  done: boolean;
}

export interface AppState {
  startDate: string;           // ISO date the user picked as Week 1, Day 1
  weeks: Week[];
  skills: Skill[];
  sideProjects: SideProject[];
  pythonWarmup: PythonWarmupDay[];
  jobApplications: JobApplication[];
  interviewMocks: InterviewMock[];
  portfolioArtifacts: PortfolioArtifact[];
}
```

## Seed data

Create `src/seed.ts` exporting a function `getInitialState(): AppState` with
the data below hard-coded. This is the actual roadmap content — don't
invent placeholder text. On first load (no `localStorage` key present),
initialize state from this seed; after that, always read/write
`localStorage`.

### Weeks (17)

| # | Title | Course | Practice | Portfolio | Interview | Deliverable | Side project note | Python warm-up topic |
|---|---|---|---|---|---|---|---|---|
| 1 | LLM foundations (+ daily Python warm-up) | Ed Donner's LLM Engineering (prompting, structured output, embeddings) | 5-pattern prompt library with token-cost measurement, written as a typed, tested Python package | First LLM endpoint answering questions, scaffolded as a typed Python repo with pytest | Explain LLM architecture + prompt vs RAG vs fine-tune; Python's typing/async model | Working AI feature (single LLM call) in a public, typed repo + CI stub | — | typing → Pydantic |
| 2 | Structured output + Claude API basics (+ daily Python warm-up) | Anthropic Academy "Building with the Claude API" (API access, structured data, streaming) | Force structured JSON output with Pydantic validation | Flagship returns structured, validated responses | Structured output + why it matters for tools | Structured-output feature | — | async/await → context managers |
| 3 | LLM app development (+ daily Python warm-up) | Academind's "AI Agents & Workflows – The Practical Guide" | Build the Q&A bot with raw SDK vs framework | Refactor flagship into clean layers (model/prompt/logic) | Framework vs no-framework tradeoffs | First AI workflow deployed to a free host | Weekend: start the NL-to-SQL agent — pick a public dataset, get plain-English → SQL working for simple queries | pytest |
| 4 | Tool calling (+ daily Python warm-up, final week) | Tool-calling modules within Ed Donner's LLM Engineering course | Add calculator + Wikipedia + mock-internal-API tools with error handling | Flagship gains tools (ticket lookup, search) | How tool calling works under the hood | Multi-tool bot | Weekend: add tool-calling + error handling to the NL-to-SQL agent (retry on invalid SQL, explain results in plain English) | packaging / decorators / generators |
| 5 | RAG part 1 | The Complete LangChain & RAG Developer Course 2026 | Chunk + embed a document corpus; basic retrieval | Flagship RAG backend v1 | Chunking/embeddings/vector search | RAG-answering feature | Weekend: polish and deploy the NL-to-SQL agent; measure accuracy on ~50 test queries and write it up — side project finish line | — |
| 6 | RAG part 2 (production + eval) | RAG++ (W&B/Cohere/Weaviate, free) | Add reranking + hybrid search; measure precision/recall/faithfulness | Flagship RAG v2 + eval notebook | Debugging bad retrievals; RAG evaluation | RAG eval report | — | — |
| 7 | Agentic AI part 1 | Ed Donner's Complete Agentic AI Engineering Course (CrewAI/LangGraph fundamentals) | Build a multi-tool agent | Convert flagship workflow → agent | Workflow vs agent | Working agent | — | — |
| 8 | Agentic AI part 2 + MCP | Complete Agentic AI Engineering Course (deployment module) + Eden Marco's MCP Crash Course | Deploy agent; build an MCP server | Expose flagship tools via MCP server | MCP N×M problem + agent failure modes | Deployed agent + MCP server | — | — |
| 9 | AI evaluation | AI Agents, RAG & LLM Evals for Beginners (DeepEval & RAGAS) | Golden dataset + LLM-as-judge; induce and catch a regression | Flagship eval dashboard + CI eval gate | Designing an eval strategy for a customer | Evaluation pipeline + a second, standalone portfolio repo | Generalize the eval suite into the standalone eval CLI side project — point it at the flagship as the first test case | — |
| 10 | AI security | AI Security: Defend LLM Apps Against the OWASP LLM Top 10 | Run and defend a prompt-injection + system-prompt-leak on the flagship | Guardrails + one-page threat model | OWASP LLM Top 10 walkthrough | Hardened flagship + threat model doc | — | — |
| 11 | Backend/API + START APPLYING | Eric Roby's FastAPI Complete Course | Wrap flagship in authenticated, tested FastAPI | Flagship as a real API with OpenAPI docs + JWT | API design defense | API service + first batch of job applications sent | — | — |
| 12 | System design | Frank Kane's Mastering the System Design Interview + selected Pogrebinsky modules | Whiteboard "enterprise LLM assistant" + a data pipeline | Architecture doc + diagram in README | Structured design narration | Architecture doc + more applications | — | — |
| 13 | Docker + Cloud/AWS part 1 | Bret Fisher's Docker Mastery (Docker-only modules) + Stephane Maarek's AWS Cloud Practitioner | Containerize flagship + vector DB with Compose | Dockerfile + compose in repo | Container/deploy strategy | Containerized app | — | — |
| 14 | Cloud/AWS part 2 + CI/CD | Maarek's AWS course (deploy focus) + Academind's GitHub Actions Complete Guide | Deploy flagship to ECS Fargate/App Runner; build test→eval→build→deploy pipeline | Live public URL + green CI badge | Deploy/secure/monitor/troubleshoot on AWS | Live deployed flagship + CI/CD | — | — |
| 15 | Observability + technical communication | OpenTelemetry for Observability: The Complete Course + Google Technical Writing | Instrument flagship (latency/tokens/cost traces); write README + architecture doc | Monitoring dashboard + polished docs + 5-min demo video | Diagnosing LLM latency | Observability dashboard + demo video | — | — |
| 16 | Customer discovery + FDE interview prep part 1 | The Mom Test + Palantir "Navigating Open-Ended Questions" + Exponent FDE guide | 2 discovery role-plays + 3 decomposition mocks | Customer problem brief + 1 blog post | Solution-design scoping; decomposition | Customer brief + blog post + heavy applications | — | — |
| 17 | FDE interview prep part 2 + push | Review + values/responsible-deployment reasoning | Timed API take-home + recorded client video; 30-min flagship deep-dive rehearsal; solution-design role-play | Final polish + 2nd blog post | Full mock loop | Interview-ready portfolio + sustained applications/networking | — | — |

All `*Done` booleans start `false`. `notes` starts `""`.

### Skills (19)

For each, `status` starts `'not_started'`.

1. **Python for experienced software engineers** — Primary: Complete Python Bootcamp (Jose Portilla, Udemy), daily warm-up Weeks 1–4 — Stop learning when: you can build and debug a typed, tested production Python API without reaching for syntax references.
2. **AI/LLM engineering (foundations)** — Primary: LLM Engineering: Master AI, Large Language Models & Agents (Ed Donner, Udemy) — Stop learning when: you can explain LLM architecture at a whiteboard and pick the right technique for a customer problem.
3. **LLM application development** — Primary: AI Agents & Workflows – The Practical Guide (Academind, Udemy) — Stop learning when: you can build a multi-step LLM app and justify your framework choice.
4. **RAG (retrieval-augmented generation)** — Primary: The Complete LangChain & RAG Developer Course 2026 (Udemy) — Stop learning when: you can design, implement, evaluate, and explain a production RAG system end to end.
5. **Tool calling** — Primary: covered inside Ed Donner's LLM Engineering + Complete Agentic AI Engineering Course — Stop learning when: you can wire multiple reliable tools into an LLM with proper error handling.
6. **Agentic AI** — Primary: The Complete Agentic AI Engineering Course (Ed Donner, Udemy) — Stop learning when: you can build, deploy, and evaluate a multi-step agent and articulate its failure modes.
7. **MCP (Model Context Protocol)** — Primary: MCP Crash Course (Eden Marco, Udemy) — Stop learning when: you can build and explain an MCP server + client from scratch.
8. **Claude / Anthropic APIs** — Primary: Building with the Claude API (Anthropic Academy, free) — Stop learning when: you can ship a production Claude integration using caching, tool use, and citations.
9. **AI evaluation** — Primary: AI Agents, RAG & LLM Evals for Beginners: DeepEval & RAGAS (Udemy) — Stop learning when: you can design, implement, and interpret an evaluation pipeline that gates deployments.
10. **AI security** — Primary: AI Security: Defend LLM Apps Against the OWASP LLM Top 10 (Udemy) — Stop learning when: you can threat-model an LLM app and implement the core mitigations.
11. **Backend/API engineering** — Primary: FastAPI — The Complete Course 2026 (Eric Roby, Udemy) — Stop learning when: you can build, secure, test, and document a production FastAPI service.
12. **System design** — Primary: Mastering the System Design Interview (Frank Kane, Udemy) — Stop learning when: you can confidently structure and narrate any mid-level design problem, including AI systems.
13. **Cloud/AWS** — Primary: Ultimate AWS Certified Cloud Practitioner CLF-C02 (Stephane Maarek, Udemy) — Stop learning when: you can deploy, monitor, secure, and troubleshoot the flagship on AWS.
14. **Docker** — Primary: Docker Mastery (Bret Fisher, Udemy) — Stop learning when: you can containerize and locally orchestrate a multi-service app.
15. **CI/CD** — Primary: GitHub Actions — The Complete Guide (Academind, Udemy) — Stop learning when: you have an automated test→eval→build→deploy pipeline running.
16. **Observability** — Primary: OpenTelemetry for Observability: The Complete Course (Udemy) — Stop learning when: you can instrument, trace, and debug the flagship's performance and cost in production.
17. **Customer discovery** — Primary: The Mom Test (free, book) — Stop learning when: you instinctively ask about real past behavior instead of pitching your solution.
18. **Technical communication** — Primary: Google Technical Writing (free) — Stop learning when: you can explain any project you built clearly in writing and on video to a non-expert.
19. **FDE interview preparation** — Primary: Palantir's "Navigating Open-Ended Questions" + Exponent FDE guide (free) — Stop learning when: you can pass a decomposition mock, deliver a clean project deep-dive, and scope a solution-design prompt without jumping to architecture.

### Side projects (2)

```
{
  id: "eval-tool",
  name: "Eval/observability micro-tool",
  description: "A standalone CLI that points at any RAG/agent HTTP endpoint plus a golden-question dataset, runs an LLM-as-judge pass, and prints a scored report (faithfulness, context relevance, pass/fail per question).",
  weeks: "Week 9",
  milestones: [
    { label: "Golden-question dataset created", done: false },
    { label: "LLM-as-judge scoring implemented", done: false },
    { label: "CLI accepts any endpoint URL as input", done: false },
    { label: "Scored report output (faithfulness, context relevance, pass/fail)", done: false },
    { label: "Run against the flagship as first test case", done: false },
    { label: "Published as its own GitHub repo", done: false }
  ]
}

{
  id: "nl-to-sql",
  name: "Natural-language-to-SQL agent",
  description: "Plain-English question in, SQL query + result table + plain-English explanation out, against a small public dataset. Includes retry-on-invalid-SQL error handling.",
  weeks: "Weeks 3–5",
  milestones: [
    { label: "Public dataset chosen and loaded", done: false },
    { label: "Basic plain-English → SQL working", done: false },
    { label: "Tool-calling + retry on invalid SQL", done: false },
    { label: "Plain-English explanation of results", done: false },
    { label: "Deployed somewhere public", done: false },
    { label: "Accuracy measured on ~50 test queries and written up", done: false }
  ]
}
```

### Python warm-up (Weeks 1–4, 7 days each = 28 rows)

Generate 7 `PythonWarmupDay` rows per week, `done: false`, using that week's
`pythonWarmupTopic` from the Weeks table above as the `topic` for all 7 days
of that week (the user can edit individual day topics later if they want
finer granularity — don't over-engineer this).

### Job applications, interview mocks, portfolio artifacts

Start all three as empty arrays — these are logs the user fills in as they
go, not pre-seeded content. For `portfolioArtifacts`, pre-seed these rows
with empty `url` and `done: false` so the user has a checklist to fill in:

```
"Flagship repo", "Flagship live deployment URL", "Eval CLI tool repo",
"NL-to-SQL agent repo", "MCP server repo", "Architecture doc / README",
"Demo video", "Blog post 1", "Blog post 2"
```

## Features to build (in this order)

1. **Dashboard (home view).** Overall progress bar (% of week checkboxes
   completed across all 17 weeks). A "current week" indicator computed from
   `startDate` + today's date (assume each week = 7 days from `startDate`;
   clamp to 1–17). Quick counts: skills done / 19, applications sent, mocks
   completed, side-project milestones done. If `startDate` isn't set yet,
   show a prompt to set it before anything else.

2. **Weekly Plan view.** All 17 weeks as an accordion or card list, current
   week expanded/highlighted by default. Each week shows course / practice /
   portfolio / interview / deliverable text, four checkboxes
   (course/practice/portfolio/deliverable), the side-project note if present,
   and a free-text notes box. Weeks 1–4 also show their Python warm-up topic
   inline with a link to the Python Warm-up view.

3. **Python Warm-up view.** Only relevant for Weeks 1–4. Show as a 4×7 grid
   (week × day) or a simple checklist grouped by week. Show a streak counter
   (consecutive days marked done). This view can be visually de-emphasized
   or hidden once Week 4 is past, but don't delete the data.

4. **Skills view.** All 19 skills as cards, each with a status selector
   (not started / in progress / done), the primary course name, and the
   "stop learning when" line shown as the definition of done — display it
   prominently so the user references it before marking a skill done.

5. **Side Projects view.** Two project cards, each with its milestone
   checklist and a progress bar (milestones done / total).

6. **Job Applications view.** Table + "add application" form (company, role,
   date, status, notes). Editable status per row. Sort by date, most recent
   first. Show a note if today's computed current week is before Week 11:
   "Applications typically start Week 11 — but don't let that stop you if
   you're ready sooner."

7. **Interview Prep Mocks view.** Log of mock sessions (week, type, date,
   notes) with an add form. Simple running count by type.

8. **Portfolio Artifacts view.** Checklist of the pre-seeded artifact rows,
   each with an editable URL field and a done checkbox.

9. **Settings.** Set/change `startDate`. A "reset all data" button
   (with a confirmation step) that wipes `localStorage` and reloads from
   `seed.ts`.

## Conventions

- Functional components, hooks only, no class components.
- One component per file under `src/components/`; views under
  `src/views/`; all data logic (load/save/update helpers) isolated in
  `src/storage.ts` and `src/state.ts` — don't scatter `localStorage` calls
  through components.
- Keep styling plain Tailwind utility classes; no custom design system.
- Favor editing the single `AppState` object as a whole (load once into a
  top-level `useState`, pass down setters via props or a small context) over
  fragmented per-feature state — this is a small app, don't over-architect it.
- Every mutation should immediately persist to `localStorage` (debounce if
  needed for text fields, but checkboxes/selects should save instantly).
- No test suite needed for a personal tool like this; skip it unless asked.

## Non-goals

- No user accounts, no backend, no cloud sync, no mobile app.
- No drag-and-drop reordering, no notifications/reminders, no calendar
  integration — keep scope tight to what's described above.
