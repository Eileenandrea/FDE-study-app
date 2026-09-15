import type {
  AppState,
  InterviewMock,
  JobApplication,
  PortfolioArtifact,
  Skill,
  Week,
} from './types';

type WeekCheckboxField =
  | 'courseDone'
  | 'practiceDone'
  | 'portfolioDone'
  | 'deliverableDone';

type SkillStatus = Skill['status'];

const SKILL_STATUS_CYCLE: SkillStatus[] = ['not_started', 'in_progress', 'done'];

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---- Weeks ----

export function toggleWeekField(
  state: AppState,
  weekNumber: number,
  field: WeekCheckboxField,
): AppState {
  return {
    ...state,
    weeks: state.weeks.map((week: Week) =>
      week.number === weekNumber ? { ...week, [field]: !week[field] } : week,
    ),
  };
}

export function setWeekNotes(
  state: AppState,
  weekNumber: number,
  notes: string,
): AppState {
  return {
    ...state,
    weeks: state.weeks.map((week: Week) =>
      week.number === weekNumber ? { ...week, notes } : week,
    ),
  };
}

// ---- Skills ----

export function cycleSkillStatus(state: AppState, skillId: number): AppState {
  return {
    ...state,
    skills: state.skills.map((skill: Skill) => {
      if (skill.id !== skillId) return skill;
      const currentIndex = SKILL_STATUS_CYCLE.indexOf(skill.status);
      const nextStatus =
        SKILL_STATUS_CYCLE[(currentIndex + 1) % SKILL_STATUS_CYCLE.length];
      return { ...skill, status: nextStatus };
    }),
  };
}

export function setSkillStatus(
  state: AppState,
  skillId: number,
  status: SkillStatus,
): AppState {
  return {
    ...state,
    skills: state.skills.map((skill: Skill) =>
      skill.id === skillId ? { ...skill, status } : skill,
    ),
  };
}

// ---- Side project milestones ----

export function toggleMilestone(
  state: AppState,
  projectId: string,
  milestoneIndex: number,
): AppState {
  return {
    ...state,
    sideProjects: state.sideProjects.map((project) => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        milestones: project.milestones.map((milestone, index) =>
          index === milestoneIndex
            ? { ...milestone, done: !milestone.done }
            : milestone,
        ),
      };
    }),
  };
}

// ---- Python warm-up ----

export function togglePythonWarmupDay(
  state: AppState,
  week: number,
  day: number,
): AppState {
  return {
    ...state,
    pythonWarmup: state.pythonWarmup.map((entry) =>
      entry.week === week && entry.day === day
        ? { ...entry, done: !entry.done }
        : entry,
    ),
  };
}

// ---- Job applications ----

export function addJobApplication(
  state: AppState,
  application: Omit<JobApplication, 'id'>,
): AppState {
  const newApplication: JobApplication = { ...application, id: generateId() };
  return {
    ...state,
    jobApplications: [...state.jobApplications, newApplication],
  };
}

export function updateJobApplication(
  state: AppState,
  id: string,
  updates: Partial<Omit<JobApplication, 'id'>>,
): AppState {
  return {
    ...state,
    jobApplications: state.jobApplications.map((application) =>
      application.id === id ? { ...application, ...updates } : application,
    ),
  };
}

export function removeJobApplication(state: AppState, id: string): AppState {
  return {
    ...state,
    jobApplications: state.jobApplications.filter(
      (application) => application.id !== id,
    ),
  };
}

// ---- Interview mocks ----

export function addInterviewMock(
  state: AppState,
  mock: Omit<InterviewMock, 'id'>,
): AppState {
  const newMock: InterviewMock = { ...mock, id: generateId() };
  return {
    ...state,
    interviewMocks: [...state.interviewMocks, newMock],
  };
}

export function removeInterviewMock(state: AppState, id: string): AppState {
  return {
    ...state,
    interviewMocks: state.interviewMocks.filter((mock) => mock.id !== id),
  };
}

// ---- Portfolio artifacts ----

export function updatePortfolioArtifact(
  state: AppState,
  id: string,
  updates: Partial<Pick<PortfolioArtifact, 'url' | 'done'>>,
): AppState {
  return {
    ...state,
    portfolioArtifacts: state.portfolioArtifacts.map((artifact) =>
      artifact.id === id ? { ...artifact, ...updates } : artifact,
    ),
  };
}

// ---- Settings ----

export function setStartDate(state: AppState, startDate: string): AppState {
  return { ...state, startDate };
}
