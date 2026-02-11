
import React, { useState } from 'react';
import { copyToClipboard } from '../utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, label, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button 
      onClick={handleCopy}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 transition-all ${className}`}
    >
      <span className="text-xs font-medium truncate max-w-[120px]">{label || text}</span>
      <i className={`fa-solid ${copied ? 'fa-check text-emerald-500' : 'fa-copy text-slate-500'} text-[10px]`}></i>
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
          Copiado!
        </span>
      )}
    </button>
  );
};
