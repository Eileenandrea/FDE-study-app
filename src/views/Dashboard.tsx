import { useMemo, useState } from 'react';
import { Briefcase, FolderGit2, Mic, Target } from 'lucide-react';
import type { AppState } from '../types';
import { setStartDate } from '../state';
import { currentWeekFromStartDate } from '../lib/date';
import ProgressBar from '../components/ProgressBar';
import StatTile from '../components/StatTile';

interface DashboardProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

const WEEK_CHECKBOX_FIELDS = [
  'courseDone',
  'practiceDone',
  'portfolioDone',
  'deliverableDone',
] as const;

export default function Dashboard({ state, updateState }: DashboardProps) {
  const [pendingStartDate, setPendingStartDate] = useState('');

  const today = useMemo(() => new Date(), []);
  const currentWeek = currentWeekFromStartDate(state.startDate, today);

  const totalWeekCheckboxes = state.weeks.length * WEEK_CHECKBOX_FIELDS.length;
  const doneWeekCheckboxes = state.weeks.reduce(
    (sum, week) =>
      sum + WEEK_CHECKBOX_FIELDS.filter((field) => week[field]).length,
    0,
  );
  const overallPct =
    totalWeekCheckboxes === 0 ? 0 : (doneWeekCheckboxes / totalWeekCheckboxes) * 100;

  const skillsDoneCount = state.skills.filter((skill) => skill.status === 'done').length;
  const applicationsCount = state.jobApplications.length;
  const mocksCount = state.interviewMocks.length;

  const milestonesTotal = state.sideProjects.reduce(
    (sum, project) => sum + project.milestones.length,
    0,
  );
  const milestonesDone = state.sideProjects.reduce(
    (sum, project) => sum + project.milestones.filter((m) => m.done).length,
    0,
  );

  function handleSetStartDate() {
    if (!pendingStartDate) return;
    updateState((prev) => setStartDate(prev, pendingStartDate));
  }

  if (!state.startDate) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-amber-400">
          Set your start date
        </p>
        <h2 className="mt-2 text-lg font-medium text-slate-50">
          Pick the date you're calling Week 1, Day 1
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Everything on this dashboard — current week, progress, the route
          overview — is computed from this date. Set it before anything else.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="date"
            value={pendingStartDate}
            onChange={(e) => setPendingStartDate(e.target.value)}
            className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSetStartDate}
            disabled={!pendingStartDate}
            className="rounded bg-amber-400 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Set start date
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* overall progress */}
      <div className="sm:col-span-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-300">Overall progress</span>
          <span className="font-mono text-slate-400">
            {doneWeekCheckboxes}/{totalWeekCheckboxes} checkboxes &middot;{' '}
            {overallPct.toFixed(0)}%
          </span>
        </div>
        <ProgressBar pct={overallPct} />
        <p className="mt-2 text-xs text-slate-500">
          Currently in{' '}
          <span className="font-mono text-amber-300">Week {currentWeek}</span> of 17.
        </p>
      </div>

      {/* quick counts */}
      <div className="sm:col-span-3 grid gap-3 sm:grid-cols-4">
        <StatTile icon={Target} value={`${skillsDoneCount}/19`} caption="skills done" />
        <StatTile icon={Briefcase} value={String(applicationsCount)} caption="applications sent" />
        <StatTile icon={Mic} value={String(mocksCount)} caption="mocks completed" />
        <StatTile
          icon={FolderGit2}
          value={`${milestonesDone}/${milestonesTotal}`}
          caption="side-project milestones"
        />
      </div>

      {/* route overview strip */}
      <div className="sm:col-span-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <p className="mb-3 text-sm text-slate-300">Route overview</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {state.weeks.map((week) => {
            const checkedCount = WEEK_CHECKBOX_FIELDS.filter((field) => week[field]).length;
            const isComplete = checkedCount === WEEK_CHECKBOX_FIELDS.length;
            const isCurrent = week.number === currentWeek;
            return (
              <button
                key={week.number}
                type="button"
                title={week.title}
                className="flex flex-col items-center gap-1 px-1"
              >
                <div
                  className={
                    'flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] ' +
                    (isComplete
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                      : isCurrent
                        ? 'border-amber-400 text-amber-300'
                        : 'border-slate-700 text-slate-500')
                  }
                >
                  {week.number}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
