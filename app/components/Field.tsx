"use client";

import React from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className = "" }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-medium tracking-widest uppercase text-muted">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted/70">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-paper-dark border border-border rounded-none px-3 py-2.5 text-sm text-ink placeholder:text-muted/50 transition-colors hover:border-muted focus:border-accent focus:ring-0 outline-none";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input(props: InputProps) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}
export function Select({ options, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`${inputClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a7f72' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-9 ${props.className ?? ""}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
