import { Check } from 'lucide-react';

export type CheckboxTone = 'sky' | 'amber' | 'emerald';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  tone?: CheckboxTone;
}

const TONE_CLASSES: Record<CheckboxTone, string> = {
  sky: 'border-sky-500 bg-sky-500 text-slate-950',
  amber: 'border-amber-400 bg-amber-400 text-slate-950',
  emerald: 'border-emerald-500 bg-emerald-500 text-slate-950',
};

export default function Checkbox({ checked, onChange, tone = 'emerald' }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={
        'flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors ' +
        (checked ? TONE_CLASSES[tone] : 'border-slate-600 bg-transparent hover:border-slate-400')
      }
    >
      {checked && <Check size={15} strokeWidth={3} />}
    </button>
  );
}
