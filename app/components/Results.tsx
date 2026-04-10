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
        stroke="#d4cec4"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 14 90 A 56 56 0 1 1 126 90"
        fill="none"
        stroke="#c8401e"
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
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-xs tracking-widest uppercase text-muted mb-2">
          Résultat #{result.prediction_id}
        </p>
        <h2
          className="text-3xl text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Prime calculée
        </h2>
      </div>

      {/* Prime pure — hero */}
      <div className="bg-ink text-paper p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,.05)_20px,rgba(255,255,255,.05)_21px)]" />
        </div>
        <p className="text-xs tracking-widest uppercase text-paper/50 mb-2 relative">
          Prime pure annuelle
        </p>
        <p
          className="text-6xl font-light relative"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {prime.toFixed(2)}
          <span className="text-2xl ml-2 text-paper/60">€</span>
        </p>
        <p className="text-xs text-paper/40 mt-3 relative">
          fréquence × sévérité = {freq.toFixed(4)} × {sev.toFixed(2)} €
        </p>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Fréquence */}
        <div className="border border-border p-5">
          <p className="text-xs tracking-widest uppercase text-muted mb-3">
            Fréquence
          </p>
          <div className="flex justify-center -mb-2">
            <Gauge value={freq} max={1} />
          </div>
          <p
            className="text-2xl text-center mt-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {(freq * 100).toFixed(2)}
            <span className="text-base text-muted ml-1">%</span>
          </p>
          <p className="text-xs text-center text-muted mt-1">
            Probabilité de sinistre
          </p>
        </div>

        {/* Sévérité */}
        <div className="border border-border p-5">
          <p className="text-xs tracking-widest uppercase text-muted mb-3">
            Sévérité
          </p>
          <div className="flex justify-center -mb-2">
            <Gauge value={sev} max={5000} />
          </div>
          <p
            className="text-2xl text-center mt-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {sev.toFixed(0)}
            <span className="text-base text-muted ml-1">€</span>
          </p>
          <p className="text-xs text-center text-muted mt-1">
            Coût moyen estimé
          </p>
        </div>
      </div>

      {/* Risk level */}
      <RiskBadge freq={freq} />

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onReset}
          className="flex-1 border border-border py-3 text-sm tracking-wider uppercase hover:border-ink hover:text-ink transition-colors text-muted"
        >
          Nouvelle simulation
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 border border-ink py-3 text-sm tracking-wider uppercase hover:bg-ink hover:text-paper transition-colors"
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
      ? { label: "Risque faible", color: "bg-emerald-100 text-emerald-800 border-emerald-200" }
      : freq < 0.15
      ? { label: "Risque modéré", color: "bg-amber-100 text-amber-800 border-amber-200" }
      : { label: "Risque élevé", color: "bg-red-100 text-red-800 border-red-200" };
  return (
    <div
      className={`border px-4 py-2.5 text-sm font-medium tracking-wide ${level.color}`}
    >
      {level.label} — probabilité de sinistre {freq < 0.05 ? "inférieure à 5%" : freq < 0.15 ? "entre 5% et 15%" : "supérieure à 15%"}
    </div>
  );
}
