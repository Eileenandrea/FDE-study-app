import type { AppState } from '../types';
import { toggleMilestone } from '../state';
import Checkbox from '../components/Checkbox';
import ProgressBar from '../components/ProgressBar';

interface SideProjectsProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

export default function SideProjects({ state, updateState }: SideProjectsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {state.sideProjects.map((project) => {
        const doneCount = project.milestones.filter((m) => m.done).length;
        const totalCount = project.milestones.length;
        const pct = totalCount === 0 ? 0 : (doneCount / totalCount) * 100;

        return (
          <div key={project.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-slate-100">{project.name}</h3>
              <span className="shrink-0 font-mono text-xs text-sky-400">{project.weeks}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{project.description}</p>

            <div className="mt-3">
              <ProgressBar pct={pct} />
              <p className="mt-1 font-mono text-[11px] text-slate-500">
                {doneCount}/{totalCount} milestones
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              {project.milestones.map((milestone, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 rounded px-1 py-0.5 text-xs text-slate-300 hover:bg-slate-800/50"
                >
                  <Checkbox
                    checked={milestone.done}
                    onChange={() =>
                      updateState((prev) => toggleMilestone(prev, project.id, index))
                    }
                  />
                  {milestone.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
