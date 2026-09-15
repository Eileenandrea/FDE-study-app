import { useMemo } from 'react';
import { CalendarCheck, Coffee, Flame } from 'lucide-react';
import type { AppState } from '../types';
import { togglePythonWarmupDay } from '../state';
import {
  currentWarmupDayIndex,
  currentWeekFromStartDate,
  warmupIndexToWeekDay,
  WARMUP_TOTAL_DAYS,
} from '../lib/date';
import Checkbox from '../components/Checkbox';
import StatTile from '../components/StatTile';

interface PythonWarmupProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

const WARMUP_WEEKS = [1, 2, 3, 4];
const WARMUP_DAYS = [1, 2, 3, 4, 5, 6, 7];

export default function PythonWarmup({ state, updateState }: PythonWarmupProps) {
  const today = useMemo(() => new Date(), []);
  const currentWeek = currentWeekFromStartDate(state.startDate, today);
  const dayIndex = currentWarmupDayIndex(state.startDate, today);
  const isPastWarmup = currentWeek !== null && currentWeek > 4;

  // Streak = consecutive done days counting backward from today's computed
  // position in the 28-day warm-up range, breaking on the first not-done
  // day. Mirrors the template's `streak` logic (dayKey walk-back) but
  // anchored on `currentWarmupDayIndex` instead of the template's
  // whole-roadmap day index.
  const streak = useMemo(() => {
    if (dayIndex === null) return 0;
    let count = 0;
    for (let i = dayIndex; i >= 1; i--) {
      const { week, day } = warmupIndexToWeekDay(i);
      const entry = state.pythonWarmup.find((d) => d.week === week && d.day === day);
      if (entry?.done) count++;
      else break;
    }
    return count;
  }, [state.pythonWarmup, dayIndex]);

  const totalDone = state.pythonWarmup.filter((d) => d.done).length;

  function topicForWeek(week: number): string {
    return state.pythonWarmup.find((d) => d.week === week)?.topic ?? '';
  }

  function entryFor(week: number, day: number) {
    return state.pythonWarmup.find((d) => d.week === week && d.day === day);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-amber-400">
          Python Warm-up
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Weeks 1–4 daily warm-up — 28 short reps to keep Python fluency sharp
          alongside the main curriculum.
        </p>
      </div>

      {isPastWarmup && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-500">
          Week 4 has passed — this section is for reference. The warm-up log
          stays here and stays editable, but it's no longer the daily focus.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile icon={Flame} value={String(streak)} caption="day streak" tone="amber" />
        <StatTile
          icon={CalendarCheck}
          value={`${totalDone}/${WARMUP_TOTAL_DAYS}`}
          caption="days completed"
        />
        <StatTile
          icon={Coffee}
          value={currentWeek === null ? '--' : `Wk ${Math.min(currentWeek, 4)}`}
          caption={currentWeek === null ? 'set start date to begin' : 'current warm-up week'}
        />
      </div>

      {/* 4x7 grid: rows = weeks 1-4, columns = days 1-7 */}
      <div
        className={
          'overflow-x-auto rounded-lg border border-slate-800 ' +
          (isPastWarmup ? 'opacity-70' : '')
        }
      >
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900 text-slate-500">
              <th className="px-3 py-2 text-left font-mono font-normal">Week</th>
              <th className="px-3 py-2 text-left font-normal">Topic</th>
              {WARMUP_DAYS.map((day) => (
                <th key={day} className="px-2 py-2 text-center font-mono font-normal">
                  D{day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WARMUP_WEEKS.map((week) => {
              const isCurrentWarmupWeek = currentWeek === week;
              return (
                <tr
                  key={week}
                  className={
                    'border-b border-slate-800/60 last:border-b-0 ' +
                    (isCurrentWarmupWeek ? 'bg-amber-500/5' : '')
                  }
                >
                  <td className="whitespace-nowrap px-3 py-3 align-top font-mono text-slate-300">
                    Wk {week}
                  </td>
                  <td className="px-3 py-3 align-top text-slate-400">{topicForWeek(week)}</td>
                  {WARMUP_DAYS.map((day) => {
                    const entry = entryFor(week, day);
                    return (
                      <td key={day} className="px-2 py-3">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={entry?.done ?? false}
                            onChange={() =>
                              updateState((prev) => togglePythonWarmupDay(prev, week, day))
                            }
                            tone="emerald"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
