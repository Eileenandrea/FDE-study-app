import { useState } from 'react'
import {
  Briefcase,
  ClipboardList,
  Coffee,
  FolderGit2,
  Map as MapIcon,
  Mic,
  Settings as SettingsIcon,
  Target,
} from 'lucide-react'
import type { AppState } from './types'
import { loadState, saveState } from './storage'
import { currentWeekFromStartDate } from './lib/date'
import Dashboard from './views/Dashboard'
import WeeklyPlan from './views/WeeklyPlan'
import PythonWarmup from './views/PythonWarmup'
import Skills from './views/Skills'

interface Tab {
  id: string
  label: string
  Icon: typeof MapIcon
  comingInStep: number
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: MapIcon, comingInStep: 3 },
  { id: 'weekly-plan', label: 'Weekly Plan', Icon: ClipboardList, comingInStep: 4 },
  { id: 'python-warmup', label: 'Python Warm-up', Icon: Coffee, comingInStep: 5 },
  { id: 'skills', label: 'Skills', Icon: Target, comingInStep: 6 },
  { id: 'side-projects', label: 'Side Projects', Icon: FolderGit2, comingInStep: 7 },
  { id: 'job-applications', label: 'Applications', Icon: Briefcase, comingInStep: 8 },
  { id: 'interview-mocks', label: 'Interview Mocks', Icon: Mic, comingInStep: 9 },
  { id: 'portfolio', label: 'Portfolio', Icon: ClipboardList, comingInStep: 10 },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon, comingInStep: 11 },
]

function App() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id)
  const [state, setState] = useState<AppState>(() => loadState())
  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0]

  // Every mutation goes through here: apply the pure reducer, update React
  // state, then persist immediately to localStorage (per CLAUDE.md, all but
  // debounced text fields save synchronously).
  function updateState(updater: (state: AppState) => AppState) {
    setState((prev) => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }

  const currentWeek = currentWeekFromStartDate(state.startDate, new Date())

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-sky-400">
              FDE Roadmap
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-50 sm:text-3xl">
              17-week route to Forward Deployed Engineer
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2">
            <span className="font-mono text-lg text-sky-400">
              {currentWeek === null ? '--' : String(currentWeek).padStart(2, '0')}
            </span>
            <div className="text-xs leading-tight text-slate-400">
              <div>{currentWeek === null ? 'current week' : 'week of 17'}</div>
              <div className="font-mono text-slate-300">
                {currentWeek === null ? 'set start date' : `week ${currentWeek}`}
              </div>
            </div>
          </div>
        </header>

        {/* nav */}
        <nav className="mb-6 flex flex-wrap gap-1 border-b border-slate-800 pb-2">
          {TABS.map((tab) => {
            const Icon = tab.Icon
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={
                  'flex items-center gap-1.5 rounded-t px-3 py-2 text-sm transition-colors ' +
                  (isActive
                    ? 'border-b-2 border-amber-400 text-slate-50'
                    : 'text-slate-400 hover:text-slate-200')
                }
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* content */}
        <main>
          {active.id === 'dashboard' ? (
            <Dashboard state={state} updateState={updateState} />
          ) : active.id === 'weekly-plan' ? (
            <WeeklyPlan state={state} updateState={updateState} onNavigate={setActiveTab} />
          ) : active.id === 'python-warmup' ? (
            <PythonWarmup state={state} updateState={updateState} />
          ) : active.id === 'skills' ? (
            <Skills state={state} updateState={updateState} />
          ) : (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <p className="font-mono text-xs uppercase tracking-wide text-amber-400">
                {active.label}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {active.label} view — coming in Step {active.comingInStep}.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
