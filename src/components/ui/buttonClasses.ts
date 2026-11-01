// The Button's class string, as a plain function (no React) so node:test can check it.
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

const baseStyles = 'inline-flex items-center justify-center font-bold transition-all rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5 shadow-sm',
};

export const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus-visible:ring-blue-600 shadow-sm hover:shadow',
  secondary: 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white focus-visible:ring-slate-900 shadow-sm hover:shadow',
  outline: 'border-2 border-slate-300 hover:border-blue-600 hover:text-blue-700 text-slate-700 bg-white focus-visible:ring-blue-600',
  ghost: 'text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 active:bg-slate-200/80 focus-visible:ring-blue-600',
  soft: 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 focus-visible:ring-blue-600',
};

// twMerge lets the caller's className replace the variant's conflicting utilities (bg-white beats
// bg-blue-600, text-blue-700 beats text-white). Plain concatenation left both in the string and the
// stylesheet order decided: seven buttons came out white text on a white background (2026-11-01).
export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false, className = '' }: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}): string {
  return twMerge(baseStyles, sizeStyles[size], variantStyles[variant], fullWidth ? 'w-full' : '', className);
}
