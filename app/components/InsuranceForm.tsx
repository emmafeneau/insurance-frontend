"use client";

import { useState } from "react";
import { Field, Input, Select } from "./Field";
import { StepIndicator } from "./StepIndicator";
import { Results } from "./Results";
import { PredictionInput, PrimeOutput, predictPrime } from "../lib/api";

const DEFAULT: PredictionInput = {
  bonus: 0.5,
  type_contrat: "Maxi",
  duree_contrat: 29,
  anciennete_info: 9,
  freq_paiement: "Biannual",
  paiement: "No",
  utilisation: "Retired",
  code_postal: "36233",
  age_conducteur1: 45,
  sex_conducteur1: "M",
  anciennete_permis1: 20,
  conducteur2: "No",
  age_conducteur2: 0,
  sex_conducteur2: null,
  anciennete_permis2: 0,
  anciennete_vehicule: 10,
  cylindre_vehicule: 1587,
  din_vehicule: 98,
  essence_vehicule: "Gasoline",
  marque_vehicule: "PEUGEOT",
  modele_vehicule: "306",
  debut_vente_vehicule: 10,
  fin_vente_vehicule: 9,
  vitesse_vehicule: 182,
  type_vehicule: "Tourism",
  prix_vehicule: 20700,
  poids_vehicule: 1210,
};

export default function InsuranceForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PredictionInput>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PrimeOutput | null>(null);

  function set(field: keyof PredictionInput, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const data = await predictPrime(form);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <Results
        result={result}
        onReset={() => {
          setResult(null);
          setStep(0);
        }}
      />
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      {/* STEP 0 — Contrat */}
      {step === 0 && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#1e3a5f", marginBottom: "1.5rem" }}>
            Informations du contrat
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Coefficient bonus-malus" hint="Entre 0.5 (bonus max) et 3.5 (malus max)">
              <Input type="number" step="0.01" min={0.5} max={3.5} value={form.bonus}
                onChange={(e) => set("bonus", parseFloat(e.target.value))} />
            </Field>
            <Field label="Type de contrat">
              <Select value={form.type_contrat} onChange={(e) => set("type_contrat", e.target.value)}
                options={[
                  { value: "Maxi", label: "Maxi" },
                  { value: "Mini", label: "Mini" },
                  { value: "Medium", label: "Medium" },
                  { value: "Standard", label: "Standard" },
                ]} />
            </Field>
            <Field label="Durée du contrat (mois)">
              <Input type="number" min={0} value={form.duree_contrat}
                onChange={(e) => set("duree_contrat", parseInt(e.target.value))} />
            </Field>
            <Field label="Ancienneté info (années)">
              <Input type="number" min={0} value={form.anciennete_info}
                onChange={(e) => set("anciennete_info", parseInt(e.target.value))} />
            </Field>
            <Field label="Fréquence de paiement">
              <Select value={form.freq_paiement} onChange={(e) => set("freq_paiement", e.target.value)}
                options={[
                  { value: "Annual", label: "Annuel" },
                  { value: "Biannual", label: "Bi-annuel" },
                  { value: "Monthly", label: "Mensuel" },
                  { value: "Quarterly", label: "Trimestriel" },
                ]} />
            </Field>
            <Field label="Paiement en cours">
              <Select value={form.paiement} onChange={(e) => set("paiement", e.target.value)}
                options={[
                  { value: "No", label: "Non" },
                  { value: "Yes", label: "Oui" },
                ]} />
            </Field>
            <Field label="Utilisation du véhicule">
              <Select value={form.utilisation} onChange={(e) => set("utilisation", e.target.value)}
                options={[
                  { value: "Retired", label: "Retraité" },
                  { value: "Professional", label: "Professionnel" },
                  { value: "Private", label: "Privé" },
                  { value: "AllPurpose", label: "Tous usages" },
                ]} />
            </Field>
            <Field label="Code postal" hint="5 chiffres">
              <Input type="text" maxLength={5} value={form.code_postal}
                onChange={(e) => set("code_postal", e.target.value)} />
            </Field>
          </div>
        </div>
      )}

      {/* STEP 1 — Conducteur */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#1e3a5f", marginBottom: "1.5rem" }}>
            Conducteur(s)
          </h2>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem", background: "#f8fafc" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: "1rem" }}>
              Conducteur principal
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <Field label="Âge">
                <Input type="number" min={18} max={120} value={form.age_conducteur1}
                  onChange={(e) => set("age_conducteur1", parseInt(e.target.value))} />
              </Field>
              <Field label="Sexe">
                <Select value={form.sex_conducteur1} onChange={(e) => set("sex_conducteur1", e.target.value)}
                  options={[
                    { value: "M", label: "Masculin" },
                    { value: "F", label: "Féminin" },
                  ]} />
              </Field>
              <Field label="Ancienneté permis (ans)">
                <Input type="number" min={0} value={form.anciennete_permis1}
                  onChange={(e) => set("anciennete_permis1", parseInt(e.target.value))} />
              </Field>
            </div>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
                Conducteur secondaire
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["No", "Yes"].map((v) => (
                  <button key={v} type="button"
                    onClick={() => {
                      set("conducteur2", v);
                      if (v === "No") {
                        set("age_conducteur2", 0);
                        set("sex_conducteur2", null);
                        set("anciennete_permis2", 0);
                      }
                    }}
                    style={{
                      padding: "6px 16px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
                      background: form.conducteur2 === v ? "#1e3a5f" : "white",
                      color: form.conducteur2 === v ? "white" : "#64748b",
                      border: form.conducteur2 === v ? "1px solid #1e3a5f" : "1px solid #e2e8f0",
                    }}>
                    {v === "Yes" ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>
            {form.conducteur2 === "Yes" ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <Field label="Âge">
                  <Input type="number" min={18} max={120} value={form.age_conducteur2 || ""}
                    onChange={(e) => set("age_conducteur2", parseInt(e.target.value))} />
                </Field>
                <Field label="Sexe">
                  <Select value={form.sex_conducteur2 || "M"} onChange={(e) => set("sex_conducteur2", e.target.value)}
                    options={[
                      { value: "M", label: "Masculin" },
                      { value: "F", label: "Féminin" },
                    ]} />
                </Field>
                <Field label="Ancienneté permis (ans)">
                  <Input type="number" min={0} value={form.anciennete_permis2 || ""}
                    onChange={(e) => set("anciennete_permis2", parseInt(e.target.value))} />
                </Field>
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                Aucun conducteur secondaire déclaré
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 2 — Véhicule */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 500, color: "#1e3a5f", marginBottom: "1.5rem" }}>
            Véhicule
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Marque">
              <Input type="text" value={form.marque_vehicule}
                onChange={(e) => set("marque_vehicule", e.target.value.toUpperCase())} placeholder="ex : PEUGEOT" />
            </Field>
            <Field label="Modèle">
              <Input type="text" value={form.modele_vehicule}
                onChange={(e) => set("modele_vehicule", e.target.value.toUpperCase())} placeholder="ex : 308" />
            </Field>
            <Field label="Type de carburant">
              <Select value={form.essence_vehicule} onChange={(e) => set("essence_vehicule", e.target.value)}
                options={[
                  { value: "Gasoline", label: "Essence" },
                  { value: "Diesel", label: "Diesel" },
                  { value: "Electric", label: "Électrique" },
                  { value: "Hybrid", label: "Hybride" },
                  { value: "GPL", label: "GPL" },
                ]} />
            </Field>
            <Field label="Type de véhicule">
              <Select value={form.type_vehicule} onChange={(e) => set("type_vehicule", e.target.value)}
                options={[
                  { value: "Tourism", label: "Tourisme" },
                  { value: "Utility", label: "Utilitaire" },
                  { value: "SUV", label: "SUV" },
                  { value: "Coupe", label: "Coupé" },
                  { value: "Convertible", label: "Cabriolet" },
                ]} />
            </Field>
            <Field label="Ancienneté véhicule (ans)">
              <Input type="number" min={0} step="0.1" value={form.anciennete_vehicule}
                onChange={(e) => set("anciennete_vehicule", parseFloat(e.target.value))} />
            </Field>
            <Field label="Prix du véhicule (€)">
              <Input type="number" min={0} value={form.prix_vehicule}
                onChange={(e) => set("prix_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Cylindrée (cc)">
              <Input type="number" min={1} value={form.cylindre_vehicule}
                onChange={(e) => set("cylindre_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Puissance DIN (ch)">
              <Input type="number" min={1} value={form.din_vehicule}
                onChange={(e) => set("din_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Vitesse max (km/h)">
              <Input type="number" min={1} value={form.vitesse_vehicule}
                onChange={(e) => set("vitesse_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Poids (kg)" hint="0 si inconnu">
              <Input type="number" min={0} value={form.poids_vehicule}
                onChange={(e) => set("poids_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Début vente (mois)" hint="1-12">
              <Input type="number" min={1} max={12} value={form.debut_vente_vehicule}
                onChange={(e) => set("debut_vente_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Fin vente (mois)" hint="1-12">
              <Input type="number" min={1} max={12} value={form.fin_vente_vehicule}
                onChange={(e) => set("fin_vente_vehicule", parseInt(e.target.value))} />
            </Field>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1.5rem", border: "1px solid #fecaca", background: "#fef2f2", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", color: "#991b1b" }}>
          <strong>Erreur : </strong>{error}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", gap: "12px", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)}
            style={{ padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", color: "#64748b", background: "white", cursor: "pointer" }}>
            ← Retour
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < 2 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)}
            style={{ padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
            Suivant →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading}
            style={{ padding: "10px 28px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Calcul en cours..." : "Calculer la prime →"}
          </button>
        )}
      </div>
    </div>
  );
}