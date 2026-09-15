import type { AppState, Skill } from '../types';
import { cycleSkillStatus } from '../state';

interface SkillsProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

type SkillStatus = Skill['status'];

const STATUS_META: Record<SkillStatus, { label: string; cls: string }> = {
  not_started: { label: 'Not started', cls: 'text-slate-500 border-slate-700' },
  in_progress: { label: 'In progress', cls: 'text-amber-300 border-amber-500/60' },
  done: { label: 'Done', cls: 'text-emerald-400 border-emerald-500/60' },
};

export default function Skills({ state, updateState }: SkillsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {state.skills.map((skill) => {
        const statusMeta = STATUS_META[skill.status];
        return (
          <div key={skill.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-slate-100">{skill.name}</h3>
              <button
                type="button"
                onClick={() => updateState((prev) => cycleSkillStatus(prev, skill.id))}
                aria-label={`Cycle status for ${skill.name} (currently ${statusMeta.label})`}
                className={
                  'shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors ' +
                  statusMeta.cls
                }
              >
                {statusMeta.label}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{skill.primaryCourse}</p>
            <p className="mt-2 border-l-2 border-sky-700 pl-2 text-xs italic leading-relaxed text-slate-400">
              Stop when: {skill.stopLearningWhen}
            </p>
          </div>
        );
      })}
    </div>
  );
}
