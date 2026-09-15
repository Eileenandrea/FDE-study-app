import type { LucideIcon } from 'lucide-react';

interface StatTileProps {
  icon: LucideIcon;
  value: string;
  caption: string;
  tone?: 'sky' | 'amber';
}

export default function StatTile({ icon: Icon, value, caption, tone = 'sky' }: StatTileProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className={'flex items-center gap-2 ' + (tone === 'amber' ? 'text-amber-400' : 'text-sky-400')}>
        <Icon size={16} />
        <span className="font-mono text-2xl text-slate-50">{value}</span>
      </div>
      <p className="mt-0.5 text-xs text-slate-400">{caption}</p>
    </div>
  );
}
