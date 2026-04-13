import Link from "next/link";
import InsuranceForm from "./components/InsuranceForm";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>

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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/history" style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none" }}>
            Historique
          </Link>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
            Moteur de tarification v1.0
          </span>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "6px 14px", marginBottom: "1.5rem" }}>
          <div style={{ width: "6px", height: "6px", background: "#60a5fa", borderRadius: "50%" }}></div>
          <span style={{ color: "#93c5fd", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Tarification actuarielle</span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, margin: "0 0 1rem", lineHeight: 1.2 }}>
          Calculez votre prime<br />
          <span style={{ color: "#93c5fd" }}>d'assurance auto</span>
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", margin: "0 auto 2.5rem", maxWidth: "500px", lineHeight: 1.7 }}>
          Notre moteur prédit votre fréquence de sinistre et le coût moyen estimé pour calculer une prime pure techniquement justifiée.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" as const }}>
          {[
            { label: "Probabilité de sinistre", title: "Fréquence" },
            null,
            { label: "Coût moyen estimé", title: "Sévérité" },
            null,
            { label: "Résultat final", title: "Prime pure", accent: true },
          ].map((item, i) =>
            item === null ? (
              <span key={i} style={{ color: "rgba(255,255,255,0.3)", fontSize: "20px" }}>{i === 1 ? "×" : "="}</span>
            ) : (
              <div key={i} style={{ background: item.accent ? "#2563eb" : "rgba(255,255,255,0.1)", border: `1px solid ${item.accent ? "#3b82f6" : "rgba(255,255,255,0.2)"}`, padding: "10px 20px", borderRadius: "10px" }}>
                <div style={{ color: item.accent ? "#93c5fd" : "rgba(255,255,255,0.5)", fontSize: "11px", marginBottom: "3px" }}>{item.label}</div>
                <div style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>{item.title}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Form */}
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <InsuranceForm />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>
          AutoTarif — Projet Data Science Assurance Auto · Modèles CatBoost calibrés
        </p>
      </footer>
    </div>
  );
}