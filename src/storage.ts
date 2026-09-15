import type { AppState } from './types';
import { getInitialState } from './seed';

export const STORAGE_KEY = 'fde-roadmap-app-state';

export function loadState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getInitialState();
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return getInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return getInitialState();
}
