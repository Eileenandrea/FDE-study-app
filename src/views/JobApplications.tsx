import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AppState, JobApplication } from '../types';
import { addJobApplication, removeJobApplication, updateJobApplication } from '../state';
import { currentWeekFromStartDate } from '../lib/date';

interface JobApplicationsProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

type ApplicationStatus = JobApplication['status'];

const STATUS_META: Record<ApplicationStatus, { label: string; cls: string }> = {
  applied: { label: 'Applied', cls: 'text-sky-300 border-sky-500/60' },
  interviewing: { label: 'Interviewing', cls: 'text-amber-300 border-amber-500/60' },
  offer: { label: 'Offer', cls: 'text-emerald-400 border-emerald-500/60' },
  rejected: { label: 'Rejected', cls: 'text-rose-400 border-rose-500/60' },
};

/** yyyy-mm-dd for today, using local date parts (not UTC) so it matches
 * what the user sees in a native date input regardless of timezone. */
function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface FormState {
  company: string;
  role: string;
  dateApplied: string;
  status: ApplicationStatus;
  notes: string;
}

function emptyForm(): FormState {
  return { company: '', role: '', dateApplied: todayISO(), status: 'applied', notes: '' };
}

// Local, debounced notes textarea for a logged application row — mirrors
// WeeklyPlan's WeekNotesField pattern: instant local keystrokes, saveState
// fires at most every ~400ms, per CLAUDE.md.
function ApplicationNotesField({
  notes,
  onSave,
}: {
  notes: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(notes);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Kept in refs (rather than read from closure) so the unmount-flush effect
  // below always sees the latest keystroke/value, not whichever were current
  // when the mount-time effect closure was created.
  const valueRef = useRef(value);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Flush any pending debounced save on unmount (e.g. switching tabs, or
  // deleting this row) instead of silently discarding it — previously this
  // only cleared the timeout, dropping the last edit if it happened within
  // the debounce window.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        onSaveRef.current(valueRef.current);
      }
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
      placeholder="Notes..."
      rows={2}
      className="mt-2 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
    />
  );
}

export default function JobApplications({ state, updateState }: JobApplicationsProps) {
  const [form, setForm] = useState<FormState>(() => emptyForm());

  const currentWeek = currentWeekFromStartDate(state.startDate, new Date());
  const showEarlyNote = currentWeek === null || currentWeek < 11;

  const sortedApplications = [...state.jobApplications].sort((a, b) =>
    b.dateApplied.localeCompare(a.dateApplied),
  );

  function handleAdd() {
    if (!form.company.trim() || !form.role.trim()) return;
    updateState((prev) =>
      addJobApplication(prev, {
        company: form.company.trim(),
        role: form.role.trim(),
        dateApplied: form.dateApplied || todayISO(),
        status: form.status,
        notes: form.notes.trim(),
      }),
    );
    setForm(emptyForm());
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-200">Job applications</h3>
        {showEarlyNote && (
          <p className="mb-3 text-xs text-slate-500">
            Applications typically start Week 11 — but don't let that stop you if you're ready
            sooner.
          </p>
        )}

        <div className="mb-3 flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Company"
              className="flex-1 rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
            />
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="Role"
              className="flex-1 rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
            />
            <input
              type="date"
              value={form.dateApplied}
              onChange={(e) => setForm((f) => ({ ...f, dateApplied: e.target.value }))}
              className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as ApplicationStatus }))
              }
              className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
            >
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center justify-center gap-1 rounded bg-amber-400 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-amber-300"
            >
              <Plus size={15} /> Add
            </button>
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Notes (optional)"
            rows={2}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          {sortedApplications.length === 0 && (
            <p className="text-xs text-slate-600">No applications logged yet.</p>
          )}
          {sortedApplications.map((application) => {
            const statusMeta = STATUS_META[application.status];
            return (
              <div
                key={application.id}
                className="rounded border border-slate-800 bg-slate-900 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-100">
                      {application.company}{' '}
                      <span className="text-slate-500">&mdash; {application.role}</span>
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      {application.dateApplied}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        updateState((prev) =>
                          updateJobApplication(prev, application.id, {
                            status: e.target.value as ApplicationStatus,
                          }),
                        )
                      }
                      className={
                        'rounded border bg-slate-950 px-2 py-1 text-xs ' + statusMeta.cls
                      }
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => updateState((prev) => removeJobApplication(prev, application.id))}
                      className="text-slate-600 hover:text-red-400"
                      aria-label={`Remove application to ${application.company}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <ApplicationNotesField
                  key={application.id}
                  notes={application.notes}
                  onSave={(notes) =>
                    updateState((prev) => updateJobApplication(prev, application.id, { notes }))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
