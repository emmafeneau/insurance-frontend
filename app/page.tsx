import InsuranceForm from "./components/InsuranceForm";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <header className="border-b border-border bg-paper/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-accent flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 5V9M5 7H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium tracking-widest uppercase text-ink">
              AutoTarif
            </span>
          </div>
          <span className="text-xs text-muted tracking-wide">
            Moteur de tarification v1.0
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-ink text-paper py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-paper/40 mb-3">
            Tarification actuarielle
          </p>
          <h1
            className="text-5xl font-light leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Calculez votre
            <br />
            <em>prime d'assurance auto</em>
          </h1>
          <p className="text-paper/50 text-sm max-w-lg leading-relaxed">
            Notre moteur prédit votre fréquence de sinistre et le coût moyen estimé
            pour calculer une prime pure techniquement justifiée.
          </p>

          {/* Formula */}
          <div className="mt-8 flex items-center gap-4 flex-wrap">
            {[
              { label: "Fréquence", sub: "Probabilité de sinistre", icon: "%" },
              { label: "×" , sub: "", icon: null },
              { label: "Sévérité", sub: "Coût moyen estimé", icon: "€" },
              { label: "=" , sub: "", icon: null },
              { label: "Prime pure", sub: "Résultat final", icon: "✓", highlight: true },
            ].map((item, i) =>
              item.icon === null ? (
                <span key={i} className="text-2xl text-paper/30 font-light">
                  {item.label}
                </span>
              ) : (
                <div
                  key={i}
                  className={`border px-4 py-2 ${
                    item.highlight
                      ? "border-accent bg-accent/20"
                      : "border-paper/10 bg-paper/5"
                  }`}
                >
                  <p className="text-xs text-paper/50">{item.sub}</p>
                  <p className="text-sm font-medium text-paper">{item.label}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main form */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <InsuranceForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 px-6 text-center">
        <p className="text-xs text-muted">
          AutoTarif — Projet Data Science Assurance Auto · Modèles CatBoost calibrés
        </p>
      </footer>
    </div>
  );
}
