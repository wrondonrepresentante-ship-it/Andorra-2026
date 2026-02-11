import React from 'react';

interface WidgetProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  accentColor?: 'rose' | 'emerald' | 'sky' | 'amber' | 'slate';
  className?: string;
  footer?: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({ 
  title, 
  icon, 
  children, 
  accentColor = 'slate', 
  className = '',
  footer
}) => {
  const accentClasses = {
    rose: 'border-rose-500/20 ring-rose-500/5 hover:border-rose-500/40',
    emerald: 'border-emerald-500/20 ring-emerald-500/5 hover:border-emerald-500/40',
    sky: 'border-sky-500/20 ring-sky-500/5 hover:border-sky-500/40',
    amber: 'border-amber-500/20 ring-amber-500/5 hover:border-amber-500/40',
    slate: 'border-slate-800 ring-transparent hover:border-slate-700',
  };

  const iconClasses = {
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    slate: 'text-slate-400 bg-slate-800/50 border-slate-700',
  };

  const glowClasses = {
    rose: 'bg-rose-500/5',
    emerald: 'bg-emerald-500/5',
    sky: 'bg-sky-500/5',
    amber: 'bg-amber-500/5',
    slate: 'bg-slate-800/10',
  };

  return (
    <div className={`relative group overflow-hidden bg-slate-900/60 backdrop-blur-md border ${accentClasses[accentColor]} p-5 rounded-3xl shadow-2xl transition-all duration-500 flex flex-col h-full ring-1 ${className}`}>
      {/* Background Glow Effect */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50 ${glowClasses[accentColor]}`}></div>
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className={`w-9 h-9 flex items-center justify-center rounded-xl border ${iconClasses[accentColor]} transition-transform group-hover:scale-110 duration-300`}>
          <i className={`${icon} text-sm`}></i>
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">
          {title}
        </h3>
      </div>
      
      <div className="flex-1 relative z-10">
        {children}
      </div>
      
      {footer && (
        <div className="mt-5 pt-4 border-t border-slate-800/50 text-[10px] font-medium tracking-wide relative z-10">
          {footer}
        </div>
      )}
    </div>
  );
};