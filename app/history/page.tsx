"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Prediction {
  id: number;
  prediction_type: string;
  frequence: number | null;
  severite: number | null;
  prime_pure: number | null;
  marque: string | null;
  modele: string | null;
  created_at: string;
}

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/predictions`)
      .then((r) => r.json())
      .then(setPredictions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const primes = predictions.filter((p) => p.prediction_type === "prime");

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <header style={{ background: "#1e3a5f", padding: "0 2rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", background: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 6V10M6 8H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ color: "white", fontWeight: 600, fontSize: "15px", letterSpacing: "0.06em" }}>AUTOTARIF</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none" }}>
            ← Nouvelle simulation
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: "6px" }}>
            Base de données
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: 500, color: "#1e3a5f", margin: "0 0 8px" }}>
            Historique des simulations
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {primes.length} simulation{primes.length > 1 ? "s" : ""} enregistrée{primes.length > 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: "80px", background: "#e2e8f0", borderRadius: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : primes.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "4rem 2rem", border: "1px dashed #e2e8f0", borderRadius: "12px" }}>
            <p style={{ fontSize: "15px", color: "#94a3b8" }}>Aucune simulation enregistrée pour l'instant.</p>
            <Link href="/" style={{ display: "inline-block", marginTop: "1rem", padding: "10px 24px", background: "#2563eb", color: "white", borderRadius: "8px", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>
              Faire une simulation
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
            {primes.map((p) => (
              <div key={p.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "44px", height: "44px", background: "#eff6ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "#1e3a5f", margin: "0 0 3px" }}>
                      {p.marque || "—"} {p.modele || ""}
                    </p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                      #{p.id} · {new Date(p.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <p style={{ fontSize: "20px", fontWeight: 500, color: "#1e3a5f", margin: "0 0 3px" }}>
                    {p.prime_pure?.toFixed(2)} €
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    {((p.frequence || 0) * 100).toFixed(2)}% · {p.severite?.toFixed(0)} €
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}