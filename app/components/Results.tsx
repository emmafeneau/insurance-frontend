"use client";

import { PrimeOutput, PredictionInput } from "../lib/api";

function Gauge({ value, max = 1 }: { value: number; max?: number }) {
  const pct = Math.min(value / max, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * 0.75;
  const offset = dash - pct * dash;
  return (
    <svg width="140" height="100" viewBox="0 0 140 100">
      <path d="M 14 90 A 56 56 0 1 1 126 90" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M 14 90 A 56 56 0 1 1 126 90"
        fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

const CARBURANT: Record<string, string> = {
  Gasoline: "Essence", Diesel: "Diesel",
  Electric: "Électrique", Hybrid: "Hybride", GPL: "GPL",
};

const UTILISATION: Record<string, string> = {
  Retired: "Retraité", Professional: "Professionnel",
  Private: "Privé", AllPurpose: "Tous usages",
};

interface ResultsProps {
  result: PrimeOutput;
  input: PredictionInput;
  onReset: () => void;
  onCompare?: () => void;
}

export function Results({ result, input, onReset, onCompare }: ResultsProps) {
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
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", background: "#f8fafc" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "12px" }}>Fréquence</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "-8px" }}>
            <Gauge value={freq} max={1} />
          </div>
          <p style={{ fontSize: "22px", fontWeight: 500, textAlign: "center", color: "#1e3a5f", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            {(freq * 100).toFixed(2)}<span style={{ fontSize: "14px", color: "#94a3b8", marginLeft: "4px" }}>%</span>
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", margin: 0 }}>Probabilité de sinistre</p>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", background: "#f8fafc" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "12px" }}>Sévérité</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "-8px" }}>
            <Gauge value={sev} max={5000} />
          </div>
          <p style={{ fontSize: "22px", fontWeight: 500, textAlign: "center", color: "#1e3a5f", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>
            {sev.toFixed(0)}<span style={{ fontSize: "14px", color: "#94a3b8", marginLeft: "4px" }}>€</span>
          </p>
          <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", margin: 0 }}>Coût moyen estimé</p>
        </div>
      </div>

      {/* Risk badge */}
      <RiskBadge freq={freq} />

      {/* Facteurs de risque */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", marginTop: "1.5rem" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "1rem" }}>
          Facteurs de risque identifiés
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
          <RiskFactor
            label="Bonus-malus"
            good={input.bonus <= 1}
            goodText="Bon historique de conduite"
            badText="Historique de sinistres détecté"
          />
          <RiskFactor
            label="Âge du conducteur"
            good={input.age_conducteur1 >= 25 && input.age_conducteur1 <= 65}
            goodText="Tranche d'âge à faible risque"
            badText="Tranche d'âge à risque élevé"
          />
          <RiskFactor
            label="Ancienneté du permis"
            good={input.anciennete_permis1 >= 5}
            goodText="Conducteur expérimenté"
            badText="Conducteur peu expérimenté"
          />
          <RiskFactor
            label="Puissance du véhicule"
            good={input.din_vehicule <= 130}
            goodText="Puissance modérée"
            badText="Véhicule puissant — risque accru"
          />
          <RiskFactor
            label="Valeur du véhicule"
            good={input.prix_vehicule <= 25000}
            goodText="Valeur standard"
            badText="Véhicule de valeur élevée"
          />
        </div>
      </div>

      {/* Récapitulatif */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", marginTop: "1.5rem" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "1rem" }}>
          Récapitulatif des données
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Marque", value: input.marque_vehicule },
            { label: "Modèle", value: input.modele_vehicule },
            { label: "Bonus-malus", value: input.bonus.toFixed(2) },
            { label: "Type de contrat", value: input.type_contrat },
            { label: "Âge conducteur", value: `${input.age_conducteur1} ans` },
            { label: "Permis depuis", value: `${input.anciennete_permis1} ans` },
            { label: "Puissance", value: `${input.din_vehicule} ch` },
            { label: "Prix véhicule", value: `${input.prix_vehicule.toLocaleString()} €` },
            { label: "Carburant", value: CARBURANT[input.essence_vehicule] || input.essence_vehicule },
            { label: "Utilisation", value: UTILISATION[input.utilisation] || input.utilisation },
            { label: "Code postal", value: input.code_postal },
            { label: "Conducteur 2", value: input.conducteur2 === "Yes" ? "Oui" : "Non" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{item.label}</span>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "#1e3a5f" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
        <button onClick={onReset}
          style={{ flex: 1, padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#64748b", background: "white", cursor: "pointer" }}>
          Nouvelle simulation
        </button>
        {onCompare && (
          <button onClick={onCompare}
            style={{ flex: 1, padding: "10px 20px", border: "1px solid #2563eb", borderRadius: "8px", fontSize: "14px", color: "#2563eb", background: "white", cursor: "pointer", fontWeight: 500 }}>
            Comparer →
          </button>
        )}
        <button onClick={() => window.print()}
          style={{ padding: "10px 20px", border: "1px solid #1e3a5f", borderRadius: "8px", fontSize: "14px", color: "#1e3a5f", background: "white", cursor: "pointer", fontWeight: 500 }}>
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

function RiskFactor({ label, good, goodText, badText }: {
  label: string; good: boolean; goodText: string; badText: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 12px", borderRadius: "8px",
      background: good ? "#f0fdf4" : "#fef2f2",
      border: `1px solid ${good ? "#bbf7d0" : "#fecaca"}`,
    }}>
      <div>
        <span style={{ fontSize: "13px", fontWeight: 500, color: good ? "#166534" : "#991b1b" }}>{label}</span>
        <p style={{ fontSize: "11px", color: good ? "#16a34a" : "#ef4444", margin: "2px 0 0" }}>
          {good ? goodText : badText}
        </p>
      </div>
      <div style={{ fontSize: "18px", color: good ? "#16a34a" : "#ef4444" }}>{good ? "✓" : "↑"}</div>
    </div>
  );
}