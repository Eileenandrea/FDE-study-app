import type { AppState } from '../types';
import { setStartDate } from '../state';
import { resetState } from '../storage';
import ConfirmButton from '../components/ConfirmButton';

interface SettingsProps {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}

export default function Settings({ state, updateState }: SettingsProps) {
  function handleReset() {
    // Wipes localStorage and reseeds; a full reload also resets every
    // view's own local component state (debounced text-field drafts,
    // expanded-accordion state, etc.), which is simpler and more reliable
    // than trying to reset each view's local state individually.
    resetState();
    window.location.reload();
  }

  return (
    <div className="max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-sky-400">Settings</p>

      <label className="mb-1 mt-3 block text-xs text-slate-400">
        Start date (Week 1, Day 1)
      </label>
      <input
        type="date"
        value={state.startDate}
        onChange={(e) => updateState((prev) => setStartDate(prev, e.target.value))}
        className="mb-4 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-sky-600 focus:outline-none"
      />
      <p className="mb-4 text-xs text-slate-500">
        Everything else — current week, progress, the route overview — is
        computed from this date. Changing it here recalculates everything
        immediately.
      </p>

      <div className="border-t border-slate-800 pt-4">
        <p className="mb-2 text-xs text-slate-400">Danger zone</p>
        <ConfirmButton
          label="Reset all data"
          confirmLabel="Are you sure? Click to confirm"
          onConfirm={handleReset}
          className="rounded border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300 hover:bg-red-950/70"
          confirmClassName="rounded border border-red-500 bg-red-900/60 px-3 py-2 text-sm text-red-100 hover:bg-red-900"
        />
        <p className="mt-2 text-xs text-slate-500">
          Wipes everything saved in this browser and reloads fresh from the
          original roadmap seed data. This cannot be undone.
        </p>
      </div>
    </div>
  );
}
