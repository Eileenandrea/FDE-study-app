import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AppState, Week } from '../types';
import { toggleWeekField, setWeekNotes } from '../state';
import { currentWeekFromStartDate } from '../lib/date';
import Checkbox from '../components/Checkbox';
import ProgressBar from '../components/ProgressBar';
import type { CheckboxTone } from '../components/Checkbox';

interface WeeklyPlanProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
  onNavigate?: (tabId: string) => void;
}

type WeekCheckboxField =
  | 'courseDone'
  | 'practiceDone'
  | 'portfolioDone'
  | 'deliverableDone';

const CHECKBOX_FIELDS: { field: WeekCheckboxField; label: string; tone: CheckboxTone }[] = [
  { field: 'courseDone', label: 'Course', tone: 'sky' },
  { field: 'practiceDone', label: 'Practice', tone: 'sky' },
  { field: 'portfolioDone', label: 'Portfolio', tone: 'sky' },
  { field: 'deliverableDone', label: 'Deliverable', tone: 'emerald' },
];

// Local, debounced notes textarea. Kept as its own component so keystrokes
// update local state instantly (for a responsive textarea) while the actual
// saveState()-backed update fires at most every ~400ms, per CLAUDE.md.
function WeekNotesField({
  notes,
  onSave,
}: {
  notes: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(notes);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setValue(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSave(next);
    }, 400);
  }

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder="Notes for this week..."
      rows={3}
      className="mt-3 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
    />
  );
}

function weekCheckedCount(week: Week): number {
  return CHECKBOX_FIELDS.filter(({ field }) => week[field]).length;
}

export default function WeeklyPlan({ state, updateState, onNavigate }: WeeklyPlanProps) {
  const today = useMemo(() => new Date(), []);
  const currentWeek = currentWeekFromStartDate(state.startDate, today);

  const [expandedWeek, setExpandedWeek] = useState<number>(currentWeek ?? 1);

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[15px] top-0 w-px bg-slate-800 sm:left-[19px]" />
      <div className="flex flex-col gap-2">
        {state.weeks.map((week) => {
          const isOpen = expandedWeek === week.number;
          const checkedCount = weekCheckedCount(week);
          const isComplete = checkedCount === CHECKBOX_FIELDS.length;
          const isCurrent = week.number === currentWeek;
          const showPythonWarmup = week.pythonWarmupTopic && week.pythonWarmupTopic.length > 0;

          return (
            <div key={week.number} className="relative pl-9 sm:pl-11">
              <div
                className={
                  'absolute left-0 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 font-mono text-xs sm:h-[38px] sm:w-[38px] ' +
                  (isComplete
                    ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                    : isCurrent
                      ? 'border-amber-400 bg-slate-950 text-amber-300'
                      : 'border-slate-700 bg-slate-950 text-slate-500')
                }
              >
                {week.number}
              </div>

              <button
                type="button"
                onClick={() => setExpandedWeek(isOpen ? -1 : week.number)}
                className={
                  'flex w-full items-center justify-between gap-3 rounded-lg border bg-slate-900 px-4 py-3 text-left hover:border-slate-700 ' +
                  (isCurrent ? 'border-amber-500/60' : 'border-slate-800')
                }
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100">
                    Week {week.number}: {week.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{week.course}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden w-16 sm:block">
                    <ProgressBar pct={(checkedCount / CHECKBOX_FIELDS.length) * 100} />
                  </div>
                  <span className="font-mono text-xs text-slate-500">
                    {checkedCount}/{CHECKBOX_FIELDS.length}
                  </span>
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
                      <dt className="text-slate-500">Course</dt>
                      <dd className="text-slate-300">{week.course}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Practice</dt>
                      <dd className="text-slate-300">{week.practice}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Portfolio</dt>
                      <dd className="text-slate-300">{week.portfolio}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Interview talking point</dt>
                      <dd className="text-slate-300">{week.interview}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-slate-500">Deliverable</dt>
                      <dd className="text-slate-300">{week.deliverable}</dd>
                    </div>
                    {week.sideProjectNote && (
                      <div className="sm:col-span-2">
                        <dt className="text-slate-500">Side project (weekend)</dt>
                        <dd className="text-amber-300">{week.sideProjectNote}</dd>
                      </div>
                    )}
                    {showPythonWarmup && (
                      <div className="sm:col-span-2">
                        <dt className="text-slate-500">Python warm-up topic</dt>
                        <dd className="flex flex-wrap items-center gap-2 text-slate-300">
                          <span>{week.pythonWarmupTopic}</span>
                          {onNavigate ? (
                            <button
                              type="button"
                              onClick={() => onNavigate('python-warmup')}
                              className="text-sky-400 hover:text-sky-300 hover:underline"
                            >
                              &rarr; see Python Warm-up tab for daily tracking
                            </button>
                          ) : (
                            <span className="text-sky-400">
                              &rarr; see Python Warm-up tab for daily tracking
                            </span>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="flex flex-wrap gap-2">
                    {CHECKBOX_FIELDS.map(({ field, label, tone }) => (
                      <label
                        key={field}
                        className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300"
                      >
                        <Checkbox
                          checked={week[field]}
                          onChange={() =>
                            updateState((prev) => toggleWeekField(prev, week.number, field))
                          }
                          tone={tone}
                        />
                        {label}
                      </label>
                    ))}
                  </div>

                  <WeekNotesField
                    key={week.number}
                    notes={week.notes}
                    onSave={(notes) =>
                      updateState((prev) => setWeekNotes(prev, week.number, notes))
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
