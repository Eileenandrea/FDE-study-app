import React, { useState, useMemo } from "react";
import {
  BookOpen, Wrench, Hammer, Rocket, Users, Briefcase, RotateCcw, Coffee,
  Check, ChevronDown, ChevronRight, Settings as SettingsIcon, Plus, Trash2,
  Flame, Target, FolderGit2, ClipboardList, Map as MapIcon, Compass
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* SEED DATA — pulled from CLAUDE.md                                   */
/* ------------------------------------------------------------------ */

const WEEKS = [
  { n: 1, title: "Python for experienced software engineers", course: "Jose Portilla's Complete Python Bootcamp", practice: "Port a utility from a prior project into typed, tested Python", portfolio: "Scaffold the flagship as a typed Python repo with Pydantic models and pytest", interview: "Python's typing/async model and its tradeoffs", deliverable: "Public, typed repo skeleton + CI stub", side: null },
  { n: 2, title: "LLM foundations", course: "Ed Donner's LLM Engineering", practice: "5-pattern prompt library with token-cost measurement", portfolio: "First LLM endpoint answering questions", interview: "LLM architecture, prompt vs RAG vs fine-tune", deliverable: "Working AI feature (single LLM call) + CI stub", side: null },
  { n: 3, title: "Structured output + Claude API basics", course: "Anthropic Academy \u2014 Building with the Claude API", practice: "Force structured JSON output with Pydantic validation", portfolio: "Flagship returns structured, validated responses", interview: "Structured output + why it matters for tools", deliverable: "Structured-output feature", side: null },
  { n: 4, title: "LLM app development", course: "Academind \u2014 AI Agents & Workflows", practice: "Build the Q&A bot with raw SDK vs framework", portfolio: "Refactor flagship into clean layers", interview: "Framework vs no-framework tradeoffs", deliverable: "First AI workflow deployed to a free host", side: "Start the NL-to-SQL agent" },
  { n: 5, title: "Tool calling", course: "Tool-calling modules \u2014 LLM Engineering", practice: "Calculator + Wikipedia + mock-API tools with error handling", portfolio: "Flagship gains tools", interview: "How tool calling works under the hood", deliverable: "Multi-tool bot", side: "Add tool-calling + retries to NL-to-SQL" },
  { n: 6, title: "RAG part 1", course: "The Complete LangChain & RAG Developer Course", practice: "Chunk + embed a document corpus; basic retrieval", portfolio: "Flagship RAG backend v1", interview: "Chunking / embeddings / vector search", deliverable: "RAG-answering feature", side: "Deploy NL-to-SQL, measure accuracy (finish line)" },
  { n: 7, title: "RAG part 2 (production + eval)", course: "RAG++ (W&B / Cohere / Weaviate)", practice: "Reranking + hybrid search; precision/recall/faithfulness", portfolio: "Flagship RAG v2 + eval notebook", interview: "Debugging bad retrievals; RAG evaluation", deliverable: "RAG eval report", side: null },
  { n: 8, title: "Agentic AI part 1", course: "Ed Donner's Complete Agentic AI Engineering Course", practice: "Build a multi-tool agent", portfolio: "Convert flagship workflow \u2192 agent", interview: "Workflow vs agent", deliverable: "Working agent", side: null },
  { n: 9, title: "Agentic AI part 2 + MCP", course: "Agentic AI Engineering (deploy) + Eden Marco's MCP Crash Course", practice: "Deploy agent; build an MCP server", portfolio: "Expose flagship tools via MCP server", interview: "MCP N\u00d7M problem + agent failure modes", deliverable: "Deployed agent + MCP server", side: null },
  { n: 10, title: "AI evaluation", course: "AI Agents, RAG & LLM Evals: DeepEval & RAGAS", practice: "Golden dataset + LLM-as-judge; catch a regression", portfolio: "Eval dashboard + CI eval gate", interview: "Designing an eval strategy for a customer", deliverable: "Eval pipeline + standalone eval-tool repo", side: "Generalize eval suite into standalone CLI tool" },
  { n: 11, title: "AI security", course: "AI Security \u2014 OWASP LLM Top 10", practice: "Run and defend prompt-injection + prompt-leak attacks", portfolio: "Guardrails + one-page threat model", interview: "OWASP LLM Top 10 walkthrough", deliverable: "Hardened flagship + threat model doc", side: null },
  { n: 12, title: "Backend/API + START APPLYING", course: "Eric Roby's FastAPI Complete Course", practice: "Wrap flagship in authenticated, tested FastAPI", portfolio: "Flagship as a real API with OpenAPI docs + JWT", interview: "API design defense", deliverable: "API service + first applications sent", side: null },
  { n: 13, title: "System design", course: "Frank Kane \u2014 Mastering the System Design Interview", practice: "Whiteboard an enterprise LLM assistant + a data pipeline", portfolio: "Architecture doc + diagram in README", interview: "Structured design narration", deliverable: "Architecture doc + more applications", side: null },
  { n: 14, title: "Docker + Cloud/AWS part 1", course: "Bret Fisher's Docker Mastery + Maarek's AWS Cloud Practitioner", practice: "Containerize flagship + vector DB with Compose", portfolio: "Dockerfile + compose in repo", interview: "Container / deploy strategy", deliverable: "Containerized app", side: null },
  { n: 15, title: "Cloud/AWS part 2 + CI/CD", course: "Maarek's AWS course + Academind's GitHub Actions Guide", practice: "Deploy to ECS Fargate/App Runner; build the pipeline", portfolio: "Live public URL + green CI badge", interview: "Deploy / secure / monitor / troubleshoot on AWS", deliverable: "Live deployed flagship + CI/CD", side: null },
  { n: 16, title: "Observability + technical communication", course: "OpenTelemetry Complete Course + Google Technical Writing", practice: "Instrument flagship; write README + architecture doc", portfolio: "Monitoring dashboard + docs + demo video", interview: "Diagnosing LLM latency", deliverable: "Observability dashboard + demo video", side: null },
  { n: 17, title: "Customer discovery + FDE interview prep pt. 1", course: "The Mom Test + Palantir & Exponent FDE guides", practice: "2 discovery role-plays + 3 decomposition mocks", portfolio: "Customer problem brief + 1 blog post", interview: "Solution-design scoping; decomposition", deliverable: "Customer brief + blog post + heavy applications", side: null },
  { n: 18, title: "FDE interview prep pt. 2 + push", course: "Review + values/responsible-deployment reasoning", practice: "Timed take-home + client video; deep-dive rehearsal", portfolio: "Final polish + 2nd blog post", interview: "Full mock loop", deliverable: "Interview-ready portfolio + sustained applications", side: null },
];

const DAILY = [
  [1,1,"Mon","Typing basics","Type hints, generics, an intro to Pydantic.","course"],
  [1,2,"Tue","Pydantic deep dive","Models and validation.","course"],
  [1,3,"Wed","Async/await","Coroutines and event-loop basics.","course"],
  [1,4,"Thu","Context managers + pytest","Write your first tests.","course"],
  [1,5,"Fri","Packaging, decorators, generators + first build","Cover packaging/decorators/generators; port a utility into a typed, tested package; scaffold the flagship repo; rehearse the typing/async talking point.","build"],
  [1,6,"Sat","Polish the repo","Clean up repo structure and write a short README for what exists so far.","buffer"],
  [1,7,"Sun","Review the week","Write 3 bullet notes; preview next week's LLM foundations material.","review"],

  [2,1,"Mon","Start the LLM course","Begin Ed Donner's LLM Engineering: prompting fundamentals modules.","course"],
  [2,2,"Tue","Continue prompting modules","Structured-output modules; start the 5-pattern prompt library exercise.","course"],
  [2,3,"Wed","Finish the prompt library exercise","Wrap prompt-library outputs in Pydantic models; measure token cost per pattern.","practice"],
  [2,4,"Thu","Build the flagship endpoint","Build the flagship's first LLM endpoint on top of Week 1's typed scaffold.","build"],
  [2,5,"Fri","Ship the first AI feature","Add pytest tests, write a CI stub, push the public repo; rehearse the LLM-architecture talking point.","ship"],
  [2,6,"Sat","Polish the repo","Clean up repo structure.","buffer"],
  [2,7,"Sun","Review the week","Write 3 bullet notes; light preview of next week's Claude API material.","review"],

  [3,1,"Mon","Start the Claude API course","Messages API, system prompts.","course"],
  [3,2,"Tue","Continue the Claude API course","Streaming and structured-data modules.","course"],
  [3,3,"Wed","Force structured output","Force structured JSON output with Pydantic validation.","practice"],
  [3,4,"Thu","Wire structured output into the flagship","Integrate structured, validated responses into the flagship's endpoint.","build"],
  [3,5,"Fri","Ship the structured-output feature","Finish and rehearse why structured output matters for tools.","ship"],
  [3,6,"Sat","Add error handling","Handle malformed structured responses gracefully.","buffer"],
  [3,7,"Sun","Review the week","Write 3 bullet notes; light preview of next week's app-framework material.","review"],

  [4,1,"Mon","Start the app-dev course","Academind's AI Agents & Workflows: app structure fundamentals.","course"],
  [4,2,"Tue","Continue the app-dev course","Chains, memory, retrievers modules.","course"],
  [4,3,"Wed","Build the Q&A bot (raw SDK)","Build the Q&A bot using the raw Anthropic SDK.","practice"],
  [4,4,"Thu","Rebuild the Q&A bot (framework)","Rebuild the same bot with a framework; compare tradeoffs.","practice"],
  [4,5,"Fri","Refactor and ship the workflow","Refactor flagship into clean model/prompt/logic layers; deploy the first AI workflow; rehearse framework-vs-no-framework talking point.","ship"],
  [4,6,"Sat","Side project: start NL-to-SQL","Pick a public dataset and load it for the NL-to-SQL agent.","build"],
  [4,7,"Sun","Side project: basic NL\u2192SQL","Get plain-English \u2192 SQL working for simple queries.","build"],

  [5,1,"Mon","Start tool-calling material","Tool/function-calling schema fundamentals.","course"],
  [5,2,"Tue","Continue tool-calling material","Multi-turn tool loops.","course"],
  [5,3,"Wed","Add calculator + Wikipedia tools","Add a calculator tool and a Wikipedia-lookup tool with error handling.","practice"],
  [5,4,"Thu","Add a mock-internal-API tool","Add a mock-internal-API tool; handle tool errors gracefully.","practice"],
  [5,5,"Fri","Ship the multi-tool bot","Wire all three tools into the flagship; rehearse how tool calling works under the hood.","ship"],
  [5,6,"Sat","Side project: tool-calling for NL-to-SQL","Add tool-calling and retry-on-invalid-SQL to the NL-to-SQL agent.","build"],
  [5,7,"Sun","Side project: plain-English explanations","Have the agent explain query results in plain English; wrap up the week.","build"],

  [6,1,"Mon","Start the RAG course","Chunking strategies.","course"],
  [6,2,"Tue","Continue the RAG course","Embeddings and vector stores (FAISS/ChromaDB).","course"],
  [6,3,"Wed","Chunk and embed a corpus","Chunk and embed a real document corpus for the flagship.","practice"],
  [6,4,"Thu","Wire up basic retrieval","Build the flagship's RAG backend v1.","build"],
  [6,5,"Fri","Ship the RAG feature","Polish and ship the RAG-answering feature; rehearse the chunking/embeddings talking point.","ship"],
  [6,6,"Sat","Side project: polish + deploy NL-to-SQL","Polish and deploy the NL-to-SQL agent publicly.","build"],
  [6,7,"Sun","Side project: measure accuracy (finish line)","Run ~50 test queries, measure accuracy, write up the results \u2014 side project finish line.","ship"],

  [7,1,"Mon","Start RAG++","Production RAG concepts and hallucination reduction.","course"],
  [7,2,"Tue","Continue RAG++","Evaluation metrics: faithfulness, context relevance.","course"],
  [7,3,"Wed","Add hybrid search","Add hybrid (BM25 + vector) search to the flagship's RAG backend.","practice"],
  [7,4,"Thu","Add reranking","Add reranking; measure precision/recall/faithfulness before vs. after.","practice"],
  [7,5,"Fri","Ship the RAG eval report","Write up flagship RAG v2 + eval notebook; rehearse the debugging talking point.","ship"],
  [7,6,"Sat","Clean up the RAG pipeline","Document design choices in the repo.","buffer"],
  [7,7,"Sun","Review the week","Write 3 bullet notes; preview next week's agent material.","review"],

  [8,1,"Mon","Start the agentic course","Agent-loop fundamentals.","course"],
  [8,2,"Tue","Continue the agentic course","CrewAI or LangGraph basics (pick one first).","course"],
  [8,3,"Wed","Build a standalone multi-tool agent","Build a multi-tool agent from scratch.","practice"],
  [8,4,"Thu","Convert the flagship to an agent","Convert the flagship's workflow into an agent that plans multi-step resolutions.","build"],
  [8,5,"Fri","Ship the working agent","Finish and rehearse the workflow-vs-agent talking point.","ship"],
  [8,6,"Sat","Interview prep: decomposition mock #1","First decomposition mock of the roadmap.","interview-prep"],
  [8,7,"Sun","Polish agent memory/planning","Review the week.","buffer"],

  [9,1,"Mon","Agentic deployment module","Guardrails, cost, latency.","course"],
  [9,2,"Tue","Deploy the agent","Deploy the flagship's agent (from Week 8) somewhere public.","build"],
  [9,3,"Wed","Start the MCP Crash Course","MCP theory and client-server architecture.","course"],
  [9,4,"Thu","Build a basic MCP server","Tools/resources/prompts primitives; build a basic MCP server.","course"],
  [9,5,"Fri","Ship agent + MCP server","Expose the flagship's tools via the MCP server; rehearse the MCP N\u00d7M talking point.","ship"],
  [9,6,"Sat","Interview prep: one mock","Decomposition or solution-design mock.","interview-prep"],
  [9,7,"Sun","Connect an MCP client","Connect the server from Claude Desktop or a custom client; review the week.","buffer"],

  [10,1,"Mon","Start the evals course","LLM-as-judge fundamentals, DeepEval/RAGAS basics.","course"],
  [10,2,"Tue","Build a golden dataset","Build a golden-question dataset for the flagship.","practice"],
  [10,3,"Wed","Wire up LLM-as-judge scoring","Deliberately induce a regression and confirm it's caught.","practice"],
  [10,4,"Thu","Build the eval CLI tool","Wrap the eval suite into a standalone CLI (side project) that accepts any endpoint URL.","build"],
  [10,5,"Fri","Ship eval pipeline + tool","Add a CI eval gate; ship both the evaluation pipeline and the standalone eval-tool repo.","ship"],
  [10,6,"Sat","Interview prep: one mock","Decomposition or solution-design mock.","interview-prep"],
  [10,7,"Sun","Write the eval tool's README","Polish the eval-tool repo; review the week.","buffer"],

  [11,1,"Mon","Start the OWASP LLM course","Prompt injection modules (offense + defense).","course"],
  [11,2,"Tue","Attempt prompt injection","Attack the flagship with prompt injection; note what worked.","practice"],
  [11,3,"Wed","Implement mitigations","Add input validation/output filtering; confirm the attack is blocked.","practice"],
  [11,4,"Thu","Cover remaining OWASP risks","Data exposure, excessive agency; attempt + defend a system-prompt leak.","course"],
  [11,5,"Fri","Ship hardened flagship + threat model","Write the one-page threat model doc; rehearse the OWASP Top 10 walkthrough.","ship"],
  [11,6,"Sat","Interview prep: one mock","Decomposition or solution-design mock.","interview-prep"],
  [11,7,"Sun","Review the week","Light preview of next week's FastAPI material.","review"],

  [12,1,"Mon","Start the FastAPI course","Routing, Pydantic integration (skim past intro/HTTP basics).","course"],
  [12,2,"Tue","Continue the FastAPI course","Dependency injection, JWT auth.","course"],
  [12,3,"Wed","Wrap the flagship in FastAPI","Wrap the flagship's AI logic behind FastAPI endpoints.","build"],
  [12,4,"Thu","Add auth + docs","Add JWT auth and tests; generate OpenAPI docs.","build"],
  [12,5,"Fri","Ship the API + shortlist companies","Finish the API service; rehearse API-design-defense; shortlist target companies/roles.","ship"],
  [12,6,"Sat","Send the first applications","Send the first batch of job applications.","job-search"],
  [12,7,"Sun","Interview prep: one mock","Review the week.","interview-prep"],

  [13,1,"Mon","Start the system design course","Core concepts: caching, load balancing, CAP.","course"],
  [13,2,"Tue","Learn the framework","A structured framework for ambiguous problems; first mock design problem.","course"],
  [13,3,"Wed","Design an enterprise LLM assistant","Whiteboard \u201can LLM-backed enterprise assistant\u201d using the framework.","practice"],
  [13,4,"Thu","Design a data pipeline","Whiteboard a data-ingestion pipeline; review architecture-depth modules.","practice"],
  [13,5,"Fri","Write the architecture doc","Add the architecture doc + diagram to the README; send more applications.","build"],
  [13,6,"Sat","Interview prep: system-design mock","Do one system-design mock out loud.","interview-prep"],
  [13,7,"Sun","Networking / outreach","Review the week.","job-search"],

  [14,1,"Mon","Start Docker Mastery","Images, Dockerfiles.","course"],
  [14,2,"Tue","Continue Docker Mastery","Volumes, networking, Compose.","course"],
  [14,3,"Wed","Write the flagship's Dockerfile","Containerize the flagship and the vector DB.","build"],
  [14,4,"Thu","Wire up docker-compose","Combine services into docker-compose.yml; test locally end-to-end.","build"],
  [14,5,"Fri","Start AWS + ship containers","IAM, EC2/ECS fundamentals; commit the containerized app; rehearse talking point.","course"],
  [14,6,"Sat","Applications + interview mock","Send applications; one interview mock.","job-search"],
  [14,7,"Sun","Optimize the image","Multi-stage build cleanup; review the week.","buffer"],

  [15,1,"Mon","Continue the AWS course","S3, CloudWatch, IAM least-privilege security.","course"],
  [15,2,"Tue","Deploy manually first","Deploy the containerized flagship to ECS Fargate or App Runner.","build"],
  [15,3,"Wed","Start GitHub Actions","Workflows, secrets, Docker build/push.","course"],
  [15,4,"Thu","Wire up the CI/CD pipeline","Build the lint \u2192 test \u2192 eval \u2192 build \u2192 deploy pipeline.","build"],
  [15,5,"Fri","Ship live deployment + CI/CD","Confirm the pipeline deploys on merge; live public URL + green CI badge.","ship"],
  [15,6,"Sat","Applications + interview mock","Send applications; one interview mock.","job-search"],
  [15,7,"Sun","CloudWatch sanity check","Review the week.","buffer"],

  [16,1,"Mon","Start the OpenTelemetry course","Instrumentation basics.","course"],
  [16,2,"Tue","Instrument the flagship","Add latency, token, and cost traces via OpenTelemetry.","build"],
  [16,3,"Wed","Build a Grafana dashboard","Wire traces into a monitoring dashboard.","build"],
  [16,4,"Thu","Write the README + architecture doc","Google Technical Writing course; polish flagship docs.","course"],
  [16,5,"Fri","Ship the demo video","Record the 5-minute client-style demo video.","ship"],
  [16,6,"Sat","Applications + interview mock","Send applications; one interview mock.","job-search"],
  [16,7,"Sun","Polish dashboard screenshots","Review the week.","buffer"],

  [17,1,"Mon","Read The Mom Test","Aim to finish the short book this week.","course"],
  [17,2,"Tue","Read FDE-specific guides","Palantir's \u201cNavigating Open-Ended Questions\u201d + Exponent's FDE interview guide.","course"],
  [17,3,"Wed","Discovery role-play #1","Role-play with a friend playing a customer; take structured notes.","practice"],
  [17,4,"Thu","Discovery role-play #2 + write the brief","Second role-play; write the one-page customer problem brief.","practice"],
  [17,5,"Fri","Publish blog post #1","Draft and publish a blog post on what you built and why; heavy application push.","ship"],
  [17,6,"Sat","Interview prep: decomposition mock #2","Decomposition mock.","interview-prep"],
  [17,7,"Sun","Interview prep: decomposition mock #3","Decomposition mock.","interview-prep"],

  [18,1,"Mon","Review values/responsible deployment","Skim anything shaky from earlier weeks.","review"],
  [18,2,"Tue","Timed API take-home","Complete a timed ~5-hour API take-home exercise.","practice"],
  [18,3,"Wed","Record the client video","Record the client-style video walkthrough of the take-home.","practice"],
  [18,4,"Thu","Rehearse the flagship deep-dive","30-minute deep-dive on the flagship, recorded.","practice"],
  [18,5,"Fri","Solution-design role-play + publish blog post #2","Role-play plus final portfolio polish and publishing blog post #2.","practice"],
  [18,6,"Sat","Interview prep: full mock loop","Decomposition + solution design + deep-dive, back to back.","interview-prep"],
  [18,7,"Sun","Sustained applications + networking","Final review of the whole roadmap.","job-search"],
].map(([w, d, dl, t, x, k]) => ({ w, d, dl, t, x, k }));

const SKILLS = [
  { name: "Python for experienced software engineers", course: "Complete Python Bootcamp (Jose Portilla, Udemy)", stop: "You can build and debug a typed, tested production Python API without reaching for syntax references." },
  { name: "AI/LLM engineering (foundations)", course: "LLM Engineering (Ed Donner, Udemy)", stop: "You can explain LLM architecture at a whiteboard and pick the right technique for a customer problem." },
  { name: "LLM application development", course: "AI Agents & Workflows (Academind, Udemy)", stop: "You can build a multi-step LLM app and justify your framework choice." },
  { name: "RAG (retrieval-augmented generation)", course: "The Complete LangChain & RAG Developer Course (Udemy)", stop: "You can design, implement, evaluate, and explain a production RAG system end to end." },
  { name: "Tool calling", course: "Covered inside LLM Engineering + Agentic AI Engineering", stop: "You can wire multiple reliable tools into an LLM with proper error handling." },
  { name: "Agentic AI", course: "The Complete Agentic AI Engineering Course (Ed Donner, Udemy)", stop: "You can build, deploy, and evaluate a multi-step agent and articulate its failure modes." },
  { name: "MCP (Model Context Protocol)", course: "MCP Crash Course (Eden Marco, Udemy)", stop: "You can build and explain an MCP server + client from scratch." },
  { name: "Claude / Anthropic APIs", course: "Building with the Claude API (Anthropic Academy, free)", stop: "You can ship a production Claude integration using caching, tool use, and citations." },
  { name: "AI evaluation", course: "AI Agents, RAG & LLM Evals: DeepEval & RAGAS (Udemy)", stop: "You can design, implement, and interpret an evaluation pipeline that gates deployments." },
  { name: "AI security", course: "AI Security \u2014 OWASP LLM Top 10 (Udemy)", stop: "You can threat-model an LLM app and implement the core mitigations." },
  { name: "Backend/API engineering", course: "FastAPI \u2014 The Complete Course (Eric Roby, Udemy)", stop: "You can build, secure, test, and document a production FastAPI service." },
  { name: "System design", course: "Mastering the System Design Interview (Frank Kane, Udemy)", stop: "You can confidently structure and narrate any mid-level design problem, including AI systems." },
  { name: "Cloud/AWS", course: "Ultimate AWS Certified Cloud Practitioner (Stephane Maarek, Udemy)", stop: "You can deploy, monitor, secure, and troubleshoot the flagship on AWS." },
  { name: "Docker", course: "Docker Mastery (Bret Fisher, Udemy)", stop: "You can containerize and locally orchestrate a multi-service app." },
  { name: "CI/CD", course: "GitHub Actions \u2014 The Complete Guide (Academind, Udemy)", stop: "You have an automated test\u2192eval\u2192build\u2192deploy pipeline running." },
  { name: "Observability", course: "OpenTelemetry for Observability (Udemy)", stop: "You can instrument, trace, and debug the flagship's performance and cost in production." },
  { name: "Customer discovery", course: "The Mom Test (free, book)", stop: "You instinctively ask about real past behavior instead of pitching your solution." },
  { name: "Technical communication", course: "Google Technical Writing (free)", stop: "You can explain any project you built clearly in writing and on video to a non-expert." },
  { name: "FDE interview preparation", course: "Palantir + Exponent FDE guides (free)", stop: "You can pass a decomposition mock, deliver a clean project deep-dive, and scope a solution-design prompt without jumping to architecture." },
].map((s, i) => ({ id: i + 1, ...s }));

const SIDE_PROJECTS = [
  {
    id: "eval-tool",
    name: "Eval/observability micro-tool",
    weeks: "Week 10",
    description: "A standalone CLI that scores any RAG/agent endpoint against a golden dataset with an LLM-as-judge pass.",
    milestones: [
      "Golden-question dataset created",
      "LLM-as-judge scoring implemented",
      "CLI accepts any endpoint URL as input",
      "Scored report output (faithfulness, context relevance, pass/fail)",
      "Run against the flagship as first test case",
      "Published as its own GitHub repo",
    ],
  },
  {
    id: "nl-to-sql",
    name: "Natural-language-to-SQL agent",
    weeks: "Weeks 4\u20136",
    description: "Plain-English question in, SQL query + result table + explanation out, against a public dataset.",
    milestones: [
      "Public dataset chosen and loaded",
      "Basic plain-English \u2192 SQL working",
      "Tool-calling + retry on invalid SQL",
      "Plain-English explanation of results",
      "Deployed somewhere public",
      "Accuracy measured on ~50 test queries and written up",
    ],
  },
];

const PORTFOLIO_SEED = [
  "Flagship repo", "Flagship live deployment URL", "Eval CLI tool repo",
  "NL-to-SQL agent repo", "MCP server repo", "Architecture doc / README",
  "Demo video", "Blog post 1", "Blog post 2",
];

const TYPE_META = {
  course: { label: "Course", Icon: BookOpen },
  practice: { label: "Practice", Icon: Wrench },
  build: { label: "Build", Icon: Hammer },
  ship: { label: "Ship", Icon: Rocket },
  "interview-prep": { label: "Interview prep", Icon: Users },
  "job-search": { label: "Job search", Icon: Briefcase },
  review: { label: "Review", Icon: RotateCcw },
  buffer: { label: "Buffer", Icon: Coffee },
};

const TOTAL_DAYS = DAILY.length; // 126
const TOTAL_WEEKS = WEEKS.length; // 18

const TABS = [
  { id: "today", label: "Today", Icon: Compass },
  { id: "route", label: "Route", Icon: MapIcon },
  { id: "skills", label: "Skills", Icon: Target },
  { id: "side", label: "Side projects", Icon: FolderGit2 },
  { id: "apps", label: "Applications", Icon: Briefcase },
  { id: "portfolio", label: "Portfolio", Icon: ClipboardList },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                              */
/* ------------------------------------------------------------------ */

function dayKey(w, d) {
  return w + "-" + d;
}

function diffDays(fromISO, toDate) {
  const from = new Date(fromISO + "T00:00:00");
  const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const fromMid = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((to - fromMid) / 86400000);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* ------------------------------------------------------------------ */
/* SMALL UI PIECES                                                      */
/* ------------------------------------------------------------------ */

function TypeBadge({ type }) {
  const meta = TYPE_META[type] || TYPE_META.course;
  const Icon = meta.Icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-xs text-slate-300">
      <Icon size={12} strokeWidth={2} />
      {meta.label}
    </span>
  );
}

function ProgressBar({ pct, className }) {
  return (
    <div className={"h-1.5 w-full overflow-hidden rounded-full bg-slate-800 " + (className || "")}>
      <div
        className="h-full rounded-full bg-sky-500 transition-all duration-500"
        style={{ width: clamp(pct, 0, 100) + "%" }}
      />
    </div>
  );
}

function Checkbox({ checked, onChange, tone = "sky" }) {
  const toneClasses =
    tone === "amber"
      ? "border-amber-400 bg-amber-400 text-slate-950"
      : "border-emerald-500 bg-emerald-500 text-slate-950";
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      className={
        "flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors " +
        (checked ? toneClasses : "border-slate-600 bg-transparent hover:border-slate-400")
      }
    >
      {checked && <Check size={15} strokeWidth={3} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN APP                                                             */
/* ------------------------------------------------------------------ */

export default function FDERoadmapApp() {
  const [tab, setTab] = useState("today");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 9); // demo default: pretend we're 10 days in
    return d.toISOString().slice(0, 10);
  });
  const [done, setDone] = useState({});
  const [skillStatus, setSkillStatus] = useState({});
  const [milestoneDone, setMilestoneDone] = useState({});
  const [weekNotes, setWeekNotes] = useState({});
  const [expandedWeek, setExpandedWeek] = useState(null);

  const [applications, setApplications] = useState([]);
  const [appForm, setAppForm] = useState({ company: "", role: "" });

  const [mocks, setMocks] = useState([]);
  const [mockForm, setMockForm] = useState({ type: "decomposition" });

  const [portfolio, setPortfolio] = useState(
    PORTFOLIO_SEED.map((label) => ({ label, url: "", done: false }))
  );

  const toggleDay = (w, d) =>
    setDone((prev) => ({ ...prev, [dayKey(w, d)]: !prev[dayKey(w, d)] }));

  const toggleMilestone = (pid, idx) => {
    const k = pid + "-" + idx;
    setMilestoneDone((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const cycleSkill = (id) => {
    const order = ["not_started", "in_progress", "done"];
    setSkillStatus((prev) => {
      const cur = prev[id] || "not_started";
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...prev, [id]: next };
    });
  };

  /* ---- derived state ---- */
  const rawDayIndex = diffDays(startDate, new Date()) + 1;
  const currentDayIndex = clamp(rawDayIndex, 1, TOTAL_DAYS);
  const currentWeek = clamp(Math.ceil(currentDayIndex / 7), 1, TOTAL_WEEKS);
  const currentDayInWeek = currentDayIndex - (currentWeek - 1) * 7;
  const todayTask = DAILY.find((t) => t.w === currentWeek && t.d === currentDayInWeek);
  const isBeforeStart = rawDayIndex < 1;
  const isAfterEnd = rawDayIndex > TOTAL_DAYS;

  const totalDaysDone = useMemo(
    () => Object.values(done).filter(Boolean).length,
    [done]
  );
  const overallPct = (totalDaysDone / TOTAL_DAYS) * 100;

  const skillsDoneCount = useMemo(
    () => Object.values(skillStatus).filter((s) => s === "done").length,
    [skillStatus]
  );

  const milestonesDoneCount = useMemo(
    () => Object.values(milestoneDone).filter(Boolean).length,
    [milestoneDone]
  );
  const milestonesTotal = SIDE_PROJECTS.reduce((n, p) => n + p.milestones.length, 0);

  const streak = useMemo(() => {
    let s = 0;
    for (let i = currentDayIndex; i >= 1; i--) {
      const w = clamp(Math.ceil(i / 7), 1, TOTAL_WEEKS);
      const dInWeek = i - (w - 1) * 7;
      if (done[dayKey(w, dInWeek)]) s++;
      else break;
    }
    return s;
  }, [done, currentDayIndex]);

  const weekProgress = (w) => {
    let c = 0;
    for (let d = 1; d <= 7; d++) if (done[dayKey(w, d)]) c++;
    return c;
  };

  const addApplication = () => {
    if (!appForm.company.trim() || !appForm.role.trim()) return;
    setApplications((prev) => [
      { id: Date.now(), company: appForm.company, role: appForm.role, date: new Date().toISOString().slice(0, 10), status: "applied" },
      ...prev,
    ]);
    setAppForm({ company: "", role: "" });
  };

  const removeApplication = (id) =>
    setApplications((prev) => prev.filter((a) => a.id !== id));

  const updateAppStatus = (id, status) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const addMock = () => {
    setMocks((prev) => [
      { id: Date.now(), type: mockForm.type, date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
  };

  const removeMock = (id) => setMocks((prev) => prev.filter((m) => m.id !== id));

  const updatePortfolio = (idx, patch) =>
    setPortfolio((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  const resetAll = () => {
    setDone({});
    setSkillStatus({});
    setMilestoneDone({});
    setWeekNotes({});
    setApplications([]);
    setMocks([]);
    setPortfolio(PORTFOLIO_SEED.map((label) => ({ label, url: "", done: false })));
  };

  /* ---- render ---- */
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-sky-400">FDE Roadmap</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-50 sm:text-3xl">
              18-week route to Forward Deployed Engineer
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2">
            <span className="font-mono text-lg text-sky-400">
              {String(currentWeek).padStart(2, "0")}
            </span>
            <div className="text-xs leading-tight text-slate-400">
              <div>week of 18</div>
              <div className="font-mono text-slate-300">
                day {clamp(currentDayIndex, 1, TOTAL_DAYS)}/{TOTAL_DAYS}
              </div>
            </div>
          </div>
        </header>

        {/* overall progress */}
        <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-300">Overall progress</span>
            <span className="font-mono text-slate-400">
              {totalDaysDone}/{TOTAL_DAYS} days &middot; {overallPct.toFixed(0)}%
            </span>
          </div>
          <ProgressBar pct={overallPct} />
        </div>

        {/* nav */}
        <nav className="mb-6 flex flex-wrap gap-1 border-b border-slate-800 pb-2">
          {TABS.map((t) => {
            const Icon = t.Icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  "flex items-center gap-1.5 rounded-t px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "border-b-2 border-amber-400 text-slate-50"
                    : "text-slate-400 hover:text-slate-200")
                }
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* ---- TODAY ---- */}
        {tab === "today" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 rounded-lg border border-slate-800 bg-slate-900 p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-amber-400">
                {isBeforeStart
                  ? "Not started yet"
                  : isAfterEnd
                  ? "Roadmap complete"
                  : "Today \u2014 " + todayTask.dl}
              </p>
              {todayTask && !isBeforeStart && (
                <>
                  <div className="mt-2 flex items-start gap-3">
                    <Checkbox
                      checked={!!done[dayKey(todayTask.w, todayTask.d)]}
                      onChange={() => toggleDay(todayTask.w, todayTask.d)}
                      tone="amber"
                    />
                    <div>
                      <h2 className="text-lg font-medium text-slate-50">{todayTask.t}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{todayTask.x}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <TypeBadge type={todayTask.k} />
                        <span className="text-xs text-slate-500">
                          Week {todayTask.w} &middot; {WEEKS[todayTask.w - 1].title}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {isBeforeStart && (
                <p className="mt-2 text-sm text-slate-400">
                  Set a start date in Settings to begin tracking.
                </p>
              )}
              {isAfterEnd && (
                <p className="mt-2 text-sm text-slate-400">
                  You've reached the end of the 18-week plan &mdash; go re-read your Week 18 deep-dive notes before interviews.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Flame size={16} />
                  <span className="font-mono text-2xl text-slate-50">{streak}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">day streak</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2 text-sky-400">
                  <Target size={16} />
                  <span className="font-mono text-2xl text-slate-50">{skillsDoneCount}/19</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">skills done</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2 text-sky-400">
                  <Briefcase size={16} />
                  <span className="font-mono text-2xl text-slate-50">{applications.length}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">applications sent</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center gap-2 text-sky-400">
                  <FolderGit2 size={16} />
                  <span className="font-mono text-2xl text-slate-50">
                    {milestonesDoneCount}/{milestonesTotal}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">side-project milestones</p>
              </div>
            </div>

            {/* route overview strip */}
            <div className="sm:col-span-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="mb-3 text-sm text-slate-300">Route overview</p>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {WEEKS.map((w) => {
                  const p = weekProgress(w.n);
                  const isCurrent = w.n === currentWeek;
                  return (
                    <button
                      key={w.n}
                      onClick={() => {
                        setTab("route");
                        setExpandedWeek(w.n);
                      }}
                      title={w.title}
                      className="flex flex-col items-center gap-1 px-1"
                    >
                      <div
                        className={
                          "flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] " +
                          (p === 7
                            ? "border-emerald-500 bg-emerald-500 text-slate-950"
                            : isCurrent
                            ? "border-amber-400 text-amber-300"
                            : "border-slate-700 text-slate-500")
                        }
                      >
                        {w.n}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---- ROUTE (weekly plan) ---- */}
        {tab === "route" && (
          <div className="relative">
            <div className="absolute bottom-0 left-[15px] top-0 w-px bg-slate-800 sm:left-[19px]" />
            <div className="flex flex-col gap-2">
              {WEEKS.map((w) => {
                const isOpen = expandedWeek === w.n;
                const p = weekProgress(w.n);
                const isCurrent = w.n === currentWeek;
                const days = DAILY.filter((t) => t.w === w.n);
                return (
                  <div key={w.n} className="relative pl-9 sm:pl-11">
                    <div
                      className={
                        "absolute left-0 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 font-mono text-xs sm:h-[38px] sm:w-[38px] " +
                        (p === 7
                          ? "border-emerald-500 bg-emerald-500 text-slate-950"
                          : isCurrent
                          ? "border-amber-400 bg-slate-950 text-amber-300"
                          : "border-slate-700 bg-slate-950 text-slate-500")
                      }
                    >
                      {w.n}
                    </div>

                    <button
                      onClick={() => setExpandedWeek(isOpen ? null : w.n)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-left hover:border-slate-700"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-100">{w.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{w.course}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-mono text-xs text-slate-500">{p}/7</span>
                        {isOpen ? (
                          <ChevronDown size={16} className="text-slate-500" />
                        ) : (
                          <ChevronRight size={16} className="text-slate-500" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mb-3 mt-2 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                        <dl className="mb-4 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
                          <div>
                            <dt className="text-slate-500">Practice</dt>
                            <dd className="text-slate-300">{w.practice}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-500">Portfolio</dt>
                            <dd className="text-slate-300">{w.portfolio}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-500">Interview talking point</dt>
                            <dd className="text-slate-300">{w.interview}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-500">Deliverable</dt>
                            <dd className="text-slate-300">{w.deliverable}</dd>
                          </div>
                          {w.side && (
                            <div className="sm:col-span-2">
                              <dt className="text-slate-500">Side project (weekend)</dt>
                              <dd className="text-amber-300">{w.side}</dd>
                            </div>
                          )}
                        </dl>

                        <div className="flex flex-col gap-1.5">
                          {days.map((t) => (
                            <div
                              key={t.d}
                              className="flex items-start gap-3 rounded border border-slate-800 bg-slate-950 px-3 py-2"
                            >
                              <Checkbox
                                checked={!!done[dayKey(t.w, t.d)]}
                                onChange={() => toggleDay(t.w, t.d)}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[11px] text-slate-500">{t.dl}</span>
                                  <span className="text-sm text-slate-100">{t.t}</span>
                                  <TypeBadge type={t.k} />
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500">{t.x}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <textarea
                          value={weekNotes[w.n] || ""}
                          onChange={(e) =>
                            setWeekNotes((prev) => ({ ...prev, [w.n]: e.target.value }))
                          }
                          placeholder="Notes for this week..."
                          className="mt-3 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- SKILLS ---- */}
        {tab === "skills" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {SKILLS.map((s) => {
              const status = skillStatus[s.id] || "not_started";
              const statusMeta = {
                not_started: { label: "Not started", cls: "text-slate-500 border-slate-700" },
                in_progress: { label: "In progress", cls: "text-amber-300 border-amber-500/60" },
                done: { label: "Done", cls: "text-emerald-400 border-emerald-500/60" },
              }[status];
              return (
                <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium text-slate-100">{s.name}</h3>
                    <button
                      onClick={() => cycleSkill(s.id)}
                      className={"shrink-0 rounded-full border px-2.5 py-1 text-[11px] " + statusMeta.cls}
                    >
                      {statusMeta.label}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">{s.course}</p>
                  <p className="mt-2 border-l-2 border-sky-700 pl-2 text-xs italic leading-relaxed text-slate-400">
                    Stop when: {s.stop}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- SIDE PROJECTS ---- */}
        {tab === "side" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {SIDE_PROJECTS.map((p) => {
              const doneCount = p.milestones.filter((_, i) => milestoneDone[p.id + "-" + i]).length;
              return (
                <div key={p.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-100">{p.name}</h3>
                    <span className="font-mono text-xs text-sky-400">{p.weeks}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{p.description}</p>
                  <div className="mt-3">
                    <ProgressBar pct={(doneCount / p.milestones.length) * 100} />
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {doneCount}/{p.milestones.length} milestones
                    </p>
                  </div>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {p.milestones.map((m, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2 rounded px-1 py-0.5 text-xs text-slate-300 hover:bg-slate-800/50"
                      >
                        <Checkbox
                          checked={!!milestoneDone[p.id + "-" + i]}
                          onChange={() => toggleMilestone(p.id, i)}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- APPLICATIONS ---- */}
        {tab === "apps" && (
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="mb-2 text-sm font-medium text-slate-200">Job applications</h3>
              {currentWeek < 12 && (
                <p className="mb-3 text-xs text-slate-500">
                  Applications typically start Week 12 &mdash; but don't let that stop you if you're ready sooner.
                </p>
              )}
              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={appForm.company}
                  onChange={(e) => setAppForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Company"
                  className="flex-1 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
                />
                <input
                  value={appForm.role}
                  onChange={(e) => setAppForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Role"
                  className="flex-1 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
                />
                <button
                  onClick={addApplication}
                  className="flex items-center justify-center gap-1 rounded bg-amber-400 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-amber-300"
                >
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {applications.length === 0 && (
                  <p className="text-xs text-slate-600">No applications logged yet.</p>
                )}
                {applications.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-100">
                        {a.company} <span className="text-slate-500">&mdash; {a.role}</span>
                      </p>
                      <p className="font-mono text-[11px] text-slate-500">{a.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={a.status}
                        onChange={(e) => updateAppStatus(a.id, e.target.value)}
                        className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300"
                      >
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => removeApplication(a.id)}
                        className="text-slate-600 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-medium text-slate-200">Interview mocks</h3>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <select
                  value={mockForm.type}
                  onChange={(e) => setMockForm({ type: e.target.value })}
                  className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                >
                  <option value="decomposition">Decomposition</option>
                  <option value="solution-design">Solution design</option>
                  <option value="deep-dive">Deep-dive</option>
                  <option value="take-home">Take-home</option>
                  <option value="other">Other</option>
                </select>
                <button
                  onClick={addMock}
                  className="flex items-center justify-center gap-1 rounded bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
                >
                  <Plus size={15} /> Log mock
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {mocks.length === 0 && (
                  <p className="text-xs text-slate-600">No mocks logged yet.</p>
                )}
                {mocks.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm capitalize text-slate-100">{m.type.replace("-", " ")}</p>
                      <p className="font-mono text-[11px] text-slate-500">{m.date}</p>
                    </div>
                    <button onClick={() => removeMock(m.id)} className="text-slate-600 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ---- PORTFOLIO ---- */}
        {tab === "portfolio" && (
          <div className="flex flex-col gap-2">
            {portfolio.map((p, i) => (
              <div
                key={p.label}
                className="flex flex-col gap-2 rounded border border-slate-800 bg-slate-900 px-3 py-2.5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                  <Checkbox checked={p.done} onChange={() => updatePortfolio(i, { done: !p.done })} />
                  <span className="text-sm text-slate-200">{p.label}</span>
                </div>
                <input
                  value={p.url}
                  onChange={(e) => updatePortfolio(i, { url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* ---- SETTINGS ---- */}
        {tab === "settings" && (
          <div className="max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-5">
            <label className="mb-1 block text-xs text-slate-400">Start date (Week 1, Day 1)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mb-4 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
            />
            <p className="mb-4 text-xs text-slate-500">
              This preview keeps state in memory only &mdash; the real app will save everything to your
              browser automatically.
            </p>
            <button
              onClick={resetAll}
              className="rounded border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300 hover:bg-red-950/70"
            >
              Reset all progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
