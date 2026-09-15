import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../types';
import { updatePortfolioArtifact } from '../state';
import Checkbox from '../components/Checkbox';

interface PortfolioArtifactsProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

// Local, debounced URL input for an artifact row — mirrors WeeklyPlan's
// WeekNotesField / JobApplications' ApplicationNotesField pattern: instant
// local keystrokes, saveState fires at most every ~400ms, per CLAUDE.md.
function ArtifactUrlField({
  url,
  onSave,
}: {
  url: string;
  onSave: (url: string) => void;
}) {
  const [value, setValue] = useState(url);
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

  // Flush any pending debounced save on unmount (e.g. switching tabs)
  // instead of silently discarding it — previously this only cleared the
  // timeout, dropping the last edit if it happened within the debounce
  // window.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        onSaveRef.current(valueRef.current);
      }
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSave(next);
    }, 400);
  }

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder="https://..."
      className="flex-1 rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:border-sky-600 focus:outline-none"
    />
  );
}

export default function PortfolioArtifacts({ state, updateState }: PortfolioArtifactsProps) {
  const doneCount = state.portfolioArtifacts.filter((a) => a.done).length;
  const totalCount = state.portfolioArtifacts.length;

  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs text-slate-500">
        {doneCount}/{totalCount} artifacts done
      </p>
      <div className="flex flex-col gap-2">
        {state.portfolioArtifacts.map((artifact) => (
          <div
            key={artifact.id}
            className="flex flex-col gap-2 rounded border border-slate-800 bg-slate-900 px-3 py-2.5 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
              <Checkbox
                checked={artifact.done}
                onChange={() =>
                  updateState((prev) =>
                    updatePortfolioArtifact(prev, artifact.id, { done: !artifact.done }),
                  )
                }
              />
              <span className="text-sm text-slate-200">{artifact.label}</span>
            </div>
            <ArtifactUrlField
              key={artifact.id}
              url={artifact.url}
              onSave={(url) =>
                updateState((prev) => updatePortfolioArtifact(prev, artifact.id, { url }))
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
