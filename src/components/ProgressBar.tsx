import { clamp } from '../lib/date';

interface ProgressBarProps {
  pct: number;
  className?: string;
}

export default function ProgressBar({ pct, className = '' }: ProgressBarProps) {
  return (
    <div className={'h-1.5 w-full overflow-hidden rounded-full bg-slate-800 ' + className}>
      <div
        className="h-full rounded-full bg-sky-500 transition-all duration-500"
        style={{ width: clamp(pct, 0, 100) + '%' }}
      />
    </div>
  );
}
