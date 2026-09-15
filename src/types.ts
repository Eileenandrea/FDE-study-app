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
