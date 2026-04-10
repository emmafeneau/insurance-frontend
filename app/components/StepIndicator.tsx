"use client";

const STEPS = ["Contrat", "Conducteur", "Véhicule"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
      {STEPS.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 500, transition: "all 0.2s",
                background: active ? "#2563eb" : done ? "#1e3a5f" : "#f1f5f9",
                color: active || done ? "white" : "#94a3b8",
                border: active ? "2px solid #2563eb" : done ? "2px solid #1e3a5f" : "1px solid #e2e8f0",
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : i + 1}
              </div>
              <span style={{ fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: active ? "#2563eb" : "#94a3b8", fontWeight: active ? 500 : 400 }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: "1px", background: done ? "#1e3a5f" : "#e2e8f0", margin: "0 12px", marginBottom: "20px", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}