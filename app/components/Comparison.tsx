"use client";

import { PrimeOutput, PredictionInput } from "../lib/api";

const CARBURANT: Record<string, string> = {
  Gasoline: "Essence", Diesel: "Diesel",
  Electric: "Électrique", Hybrid: "Hybride", GPL: "GPL",
};

const UTILISATION: Record<string, string> = {
  Retired: "Retraité", Professional: "Professionnel",
  Private: "Privé", AllPurpose: "Tous usages",
};

interface ComparisonProps {
  result1: PrimeOutput;
  input1: PredictionInput;
  result2: PrimeOutput;
  input2: PredictionInput;
  onReset: () => void;
}

export function Comparison({ result1, input1, result2, input2, onReset }: ComparisonProps) {
  const prime1 = result1.prime_pure;
  const prime2 = result2.prime_pure;
  const maxPrime = Math.max(prime1, prime2);
  const winner = prime1 < prime2 ? 1 : 2;

  const rows = [
    { label: "Marque", v1: input1.marque_vehicule, v2: input2.marque_vehicule },
    { label: "Modèle", v1: input1.modele_vehicule, v2: input2.modele_vehicule },
    { label: "Bonus-malus", v1: input1.bonus.toFixed(2), v2: input2.bonus.toFixed(2) },
    { label: "Âge conducteur", v1: `${input1.age_conducteur1} ans`, v2: `${input2.age_conducteur1} ans` },
    { label: "Permis depuis", v1: `${input1.anciennete_permis1} ans`, v2: `${input2.anciennete_permis1} ans` },
    { label: "Puissance", v1: `${input1.din_vehicule} ch`, v2: `${input2.din_vehicule} ch` },
    { label: "Prix véhicule", v1: `${input1.prix_vehicule.toLocaleString()} €`, v2: `${input2.prix_vehicule.toLocaleString()} €` },
    { label: "Carburant", v1: CARBURANT[input1.essence_vehicule] || input1.essence_vehicule, v2: CARBURANT[input2.essence_vehicule] || input2.essence_vehicule },
    { label: "Utilisation", v1: UTILISATION[input1.utilisation] || input1.utilisation, v2: UTILISATION[input2.utilisation] || input2.utilisation },
    { label: "Conducteur 2", v1: input1.conducteur2 === "Yes" ? "Oui" : "Non", v2: input2.conducteur2 === "Yes" ? "Oui" : "Non" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: "6px" }}>
          Comparaison
        </p>
        <h2 style={{ fontSize: "22px", fontWeight: 500, color: "#1e3a5f", margin: 0 }}>
          Deux simulations côte à côte
        </h2>
      </div>

      {/* Primes hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>
        {[
          { result: result1, prime: prime1, label: "Simulation 1", isWinner: winner === 1 },
          { result: result2, prime: prime2, label: "Simulation 2", isWinner: winner === 2 },
        ].map((sim, i) => (
          <div key={i} style={{
            background: sim.isWinner ? "#1e3a5f" : "#f8fafc",
            border: `2px solid ${sim.isWinner ? "#1e3a5f" : "#e2e8f0"}`,
            borderRadius: "12px", padding: "1.5rem", position: "relative", overflow: "hidden",
          }}>
            {sim.isWinner && (
              <div style={{ position: "absolute", top: "12px", right: "12px", background: "#2563eb", color: "white", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "100px", letterSpacing: "0.05em" }}>
                MEILLEURE PRIME
              </div>
            )}
            <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: sim.isWinner ? "rgba(255,255,255,0.5)" : "#94a3b8", marginBottom: "6px" }}>
              {sim.label}
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 300, margin: "0 0 4px", color: sim.isWinner ? "white" : "#1e3a5f" }}>
              {sim.prime.toFixed(2)}
              <span style={{ fontSize: "1.2rem", marginLeft: "6px", color: sim.isWinner ? "rgba(255,255,255,0.5)" : "#94a3b8" }}>€</span>
            </p>
            <p style={{ fontSize: "11px", color: sim.isWinner ? "rgba(255,255,255,0.4)" : "#94a3b8", margin: 0 }}>
              {(result1.frequence * 100).toFixed(2)}% × {sim.result.severite.toFixed(0)} €
            </p>
          </div>
        ))}
      </div>

      {/* Différence */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", textAlign: "center" as const }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#166534" }}>
          Économie : {Math.abs(prime1 - prime2).toFixed(2)} € / an en choisissant la simulation {winner}
        </span>
      </div>

      {/* Barres de comparaison */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", background: "#f8fafc" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: "1rem" }}>
          Visualisation des primes
        </p>
        {[
          { label: "Simulation 1", prime: prime1, color: "#2563eb" },
          { label: "Simulation 2", prime: prime2, color: "#64748b" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", color: "#64748b", width: "90px" }}>{item.label}</span>
            <div style={{ flex: 1, background: "#e2e8f0", borderRadius: "4px", height: "10px", overflow: "hidden" }}>
              <div style={{
                width: `${(item.prime / maxPrime) * 100}%`,
                height: "100%", background: item.color,
                borderRadius: "4px", transition: "width 1s ease",
              }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e3a5f", width: "70px", textAlign: "right" as const }}>
              {item.prime.toFixed(0)} €
            </span>
          </div>
        ))}
      </div>

      {/* Tableau comparatif */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#1e3a5f", padding: "10px 16px" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Champ</span>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" as const }}>Simulation 1</span>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" as const, letterSpacing: "0.06em", textAlign: "center" as const }}>Simulation 2</span>
        </div>
        {rows.map((row, i) => {
          const isDiff = row.v1 !== row.v2;
          return (
            <div key={row.label} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              padding: "10px 16px",
              background: isDiff ? "#eff6ff" : i % 2 === 0 ? "white" : "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: isDiff ? 600 : 400, color: isDiff ? "#2563eb" : "#1e3a5f", textAlign: "center" as const }}>{row.v1}</span>
              <span style={{ fontSize: "13px", fontWeight: isDiff ? 600 : 400, color: isDiff ? "#2563eb" : "#1e3a5f", textAlign: "center" as const }}>{row.v2}</span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", paddingTop: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
        <button onClick={onReset}
          style={{ flex: 1, padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#64748b", background: "white", cursor: "pointer" }}>
          Nouvelle simulation
        </button>
        <button onClick={() => window.print()}
          style={{ padding: "10px 20px", border: "1px solid #1e3a5f", borderRadius: "8px", fontSize: "14px", color: "#1e3a5f", background: "white", cursor: "pointer", fontWeight: 500 }}>
          Imprimer
        </button>
      </div>
    </div>
  );
}