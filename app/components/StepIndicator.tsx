"use client";

const STEPS = ["Contrat", "Conducteur", "Véhicule"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium border transition-all duration-300 ${
                  active
                    ? "bg-accent border-accent text-paper"
                    : done
                    ? "bg-ink border-ink text-paper"
                    : "bg-transparent border-border text-muted"
                }`}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] tracking-wider uppercase ${
                  active ? "text-accent font-medium" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 mb-5 transition-all duration-500 ${
                  done ? "bg-ink" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
