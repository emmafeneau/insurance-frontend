"use client";

import { PrimeOutput } from "../lib/api";

function Gauge({ value, max = 1 }: { value: number; max?: number }) {
  const pct = Math.min(value / max, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * 0.75;
  const offset = dash - pct * dash;
  return (
    <svg width="140" height="100" viewBox="0 0 140 100">
      <path
        d="M 14 90 A 56 56 0 1 1 126 90"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 14 90 A 56 56 0 1 1 126 90"
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

interface ResultsProps {
  result: PrimeOutput;
  onReset: () => void;
}

export function Results({ result, onReset }: ResultsProps) {
  const freq = result.frequence;
  const sev = result.severite;
  const prime = result.prime_pure;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: "6px" }}>
          Résultat #{result.prediction_id}
        </p>
        <h2 style={{ fontSize: "22px", fontWeight: 500, color: "#1e3a5f", margin: 0, fontFamily: "var(--font-display)" }}>
          Prime calculée
        </h2>
      </div>

      {/* Prime pure hero */}
      <div style={{ background: "#1e3a5f", color: "white", padding: "2rem", borderRadius: "12px", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "rgba(37,99,235,0.3)", borderRadius: "50%", transform: "translate(50px, -80px)" }} />
        <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)", marginBottom: "8px", position: "relative" }}>
          Prime pure annuelle
        </p>
        <p style={{ fontSize: "3.5rem", fontWeight: 300, fontFamily: "var(--font-display)", margin: 0, position: "relative" }}>
          {prime.toFixed(2)}
          <span style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.5)", marginLeft: "8px" }}>€</span>
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px", position: "relative" }}>
          fréquence × sévérité = {freq.toFixed(4)} × {sev.toFixed(2)} €
        </p>
      </div>

      {/* Detail cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "1.5rem" }}>
        {/* Fréquence */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", background: "#f8fafc" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "12px" }}>
            Fréquence
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "-8px" }}>
            <Gauge value={freq} max={1} />
          </div>
          <p style={{ fontSize: "22px", fontWeight: 500, textAlign: "center", color: "#1e3a5f", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            {(freq * 100).toFixed(2)}
            <span style={{ fontSize: "14px", color: "#94a3b8", marginLeft: "4px" }}>%</span>
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", margin: 0 }}>
            Probabilité de sinistre
          </p>
        </div>

        {/* Sévérité */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", background: "#f8fafc" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "12px" }}>
            Sévérité
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "-8px" }}>
            <Gauge value={sev} max={5000} />
          </div>
          <p style={{ fontSize: "22px", fontWeight: 500, textAlign: "center", color: "#1e3a5f", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            {sev.toFixed(0)}
            <span style={{ fontSize: "14px", color: "#94a3b8", marginLeft: "4px" }}>€</span>
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", margin: 0 }}>
            Coût moyen estimé
          </p>
        </div>
      </div>

      {/* Risk badge */}
      <RiskBadge freq={freq} />

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
        <button
          onClick={onReset}
          style={{ flex: 1, padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#64748b", background: "white", cursor: "pointer" }}
        >
          Nouvelle simulation
        </button>
        <button
          onClick={() => window.print()}
          style={{ padding: "10px 20px", border: "1px solid #1e3a5f", borderRadius: "8px", fontSize: "14px", color: "#1e3a5f", background: "white", cursor: "pointer", fontWeight: 500 }}
        >
          Imprimer
        </button>
      </div>
    </div>
  );
}

function RiskBadge({ freq }: { freq: number }) {
  const level =
    freq < 0.05
      ? { label: "Risque faible", bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" }
      : freq < 0.15
      ? { label: "Risque modéré", bg: "#fffbeb", color: "#92400e", border: "#fde68a" }
      : { label: "Risque élevé", bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };

  return (
    <div style={{ background: level.bg, border: `1px solid ${level.border}`, borderRadius: "8px", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: level.color }}>
      {level.label} — probabilité de sinistre{" "}
      {freq < 0.05 ? "inférieure à 5%" : freq < 0.15 ? "entre 5% et 15%" : "supérieure à 15%"}
    </div>
  );
}