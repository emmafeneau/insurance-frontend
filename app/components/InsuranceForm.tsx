// Bouton retour
<button
  type="button"
  onClick={() => setStep((s) => s - 1)}
  style={{ padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#64748b", background: "white", cursor: "pointer" }}
>
  ← Retour
</button>

// Bouton suivant
<button
  type="button"
  onClick={() => setStep((s) => s + 1)}
  style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
>
  Suivant →
</button>

// Bouton calculer
<button
  type="button"
  onClick={handleSubmit}
  disabled={loading}
  style={{ padding: "10px 28px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
>
  {loading ? "Calcul en cours..." : "Calculer la prime →"}
</button>