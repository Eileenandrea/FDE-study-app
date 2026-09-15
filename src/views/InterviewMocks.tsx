import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AppState, InterviewMock } from '../types';
import { addInterviewMock, removeInterviewMock } from '../state';
import { currentWeekFromStartDate } from '../lib/date';

interface InterviewMocksProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

type MockType = InterviewMock['type'];

const TYPE_META: Record<MockType, { label: string; cls: string }> = {
  decomposition: { label: 'Decomposition', cls: 'text-sky-300 border-sky-500/60' },
  'solution-design': { label: 'Solution design', cls: 'text-amber-300 border-amber-500/60' },
  'deep-dive': { label: 'Deep-dive', cls: 'text-emerald-400 border-emerald-500/60' },
  'take-home': { label: 'Take-home', cls: 'text-rose-400 border-rose-500/60' },
  other: { label: 'Other', cls: 'text-slate-300 border-slate-500/60' },
};

const TYPE_ORDER: MockType[] = ['decomposition', 'solution-design', 'deep-dive', 'take-home', 'other'];

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
  week: number;
  type: MockType;
  date: string;
  notes: string;
}

function emptyForm(defaultWeek: number): FormState {
  return { week: defaultWeek, type: 'decomposition', date: todayISO(), notes: '' };
}

export default function InterviewMocks({ state, updateState }: InterviewMocksProps) {
  const currentWeek = currentWeekFromStartDate(state.startDate, new Date()) ?? 1;
  const [form, setForm] = useState<FormState>(() => emptyForm(currentWeek));

  const sortedMocks = [...state.interviewMocks].sort((a, b) => b.date.localeCompare(a.date));

  const countsByType = state.interviewMocks.reduce<Record<MockType, number>>(
    (acc, mock) => {
      acc[mock.type] = (acc[mock.type] ?? 0) + 1;
      return acc;
    },
    { decomposition: 0, 'solution-design': 0, 'deep-dive': 0, 'take-home': 0, other: 0 },
  );

  function handleAdd() {
    if (!form.week || form.week < 1) return;
    updateState((prev) =>
      addInterviewMock(prev, {
        week: form.week,
        type: form.type,
        date: form.date || todayISO(),
        notes: form.notes.trim(),
      }),
    );
    setForm(emptyForm(currentWeek));
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-200">Interview prep mocks</h3>

        <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-400">
          {TYPE_ORDER.map((type, index) => (
            <span key={type}>
              {TYPE_META[type].label}: <span className="text-slate-200">{countsByType[type]}</span>
              {index < TYPE_ORDER.length - 1 && <span className="ml-2 text-slate-700">&middot;</span>}
            </span>
          ))}
        </div>

        <div className="mb-3 flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min={1}
              max={17}
              value={form.week}
              onChange={(e) => setForm((f) => ({ ...f, week: Number(e.target.value) }))}
              placeholder="Week"
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-sky-600 focus:outline-none sm:w-20"
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as MockType }))}
              className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
            >
              {TYPE_ORDER.map((type) => (
                <option key={type} value={type}>
                  {TYPE_META[type].label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center justify-center gap-1 rounded bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              <Plus size={15} /> Log mock
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
          {sortedMocks.length === 0 && (
            <p className="text-xs text-slate-600">No mocks logged yet.</p>
          )}
          {sortedMocks.map((mock) => {
            const typeMeta = TYPE_META[mock.type];
            return (
              <div
                key={mock.id}
                className="rounded border border-slate-800 bg-slate-900 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-100">
                      Week {mock.week}{' '}
                      <span className={'ml-1 rounded border px-1.5 py-0.5 text-[11px] ' + typeMeta.cls}>
                        {typeMeta.label}
                      </span>
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">{mock.date}</p>
                    {mock.notes && (
                      <p className="mt-1 text-xs text-slate-400">{mock.notes}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateState((prev) => removeInterviewMock(prev, mock.id))}
                    className="shrink-0 text-slate-600 hover:text-red-400"
                    aria-label={`Remove Week ${mock.week} ${typeMeta.label} mock`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
