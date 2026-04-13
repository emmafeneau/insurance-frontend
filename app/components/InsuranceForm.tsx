"use client";

import { useState, useEffect } from "react";
import { Field, Input, Select } from "./Field";
import { StepIndicator } from "./StepIndicator";
import { Results } from "./Results";
import { PredictionInput, PrimeOutput, predictPrime, getVehicles, VehicleBrand } from "../lib/api";

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
  marque_vehicule: "",
  modele_vehicule: "",
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [result, setResult] = useState<PrimeOutput | null>(null);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const selectedBrand = brands.find((b) => b.value === form.marque_vehicule);
  const modeles = selectedBrand ? selectedBrand.models : [];

  useEffect(() => {
    getVehicles()
      .then((data) => setBrands(data.brands))
      .catch(console.error)
      .finally(() => setBrandsLoading(false));
  }, []);

  function set(field: keyof PredictionInput, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const errors: string[] = [];

    if (!form.marque_vehicule) errors.push("La marque du véhicule est obligatoire");
    if (!form.modele_vehicule) errors.push("Le modèle du véhicule est obligatoire");
    if (!form.code_postal || form.code_postal.length < 5) errors.push("Le code postal doit contenir 5 chiffres");
    if (!form.bonus || form.bonus < 0.5 || form.bonus > 3.5) errors.push("Le bonus-malus doit être entre 0.5 et 3.5");
    if (form.duree_contrat < 0 || form.duree_contrat > 120) errors.push("La durée du contrat doit être entre 0 et 120 mois");
    if (form.anciennete_info < 0 || form.anciennete_info > 50) errors.push("L'ancienneté info doit être entre 0 et 50 ans");
    if (!form.age_conducteur1 || form.age_conducteur1 < 18 || form.age_conducteur1 > 100) errors.push("L'âge du conducteur doit être entre 18 et 100 ans");
    if (form.anciennete_permis1 < 0 || form.anciennete_permis1 > form.age_conducteur1 - 18) errors.push("L'ancienneté du permis est incohérente avec l'âge");
    if (form.conducteur2 === "Yes") {
      if (!form.age_conducteur2 || form.age_conducteur2 < 18 || form.age_conducteur2 > 100) errors.push("L'âge du conducteur secondaire doit être entre 18 et 100 ans");
      if (form.anciennete_permis2 < 0 || form.anciennete_permis2 > form.age_conducteur2 - 18) errors.push("L'ancienneté du permis du conducteur secondaire est incohérente");
    }
    if (!form.cylindre_vehicule || form.cylindre_vehicule < 50 || form.cylindre_vehicule > 10000) errors.push("La cylindrée doit être entre 50 et 10 000 cc");
    if (!form.din_vehicule || form.din_vehicule < 1 || form.din_vehicule > 1000) errors.push("La puissance doit être entre 1 et 1 000 ch");
    if (!form.vitesse_vehicule || form.vitesse_vehicule < 50 || form.vitesse_vehicule > 400) errors.push("La vitesse max doit être entre 50 et 400 km/h");
    if (!form.prix_vehicule || form.prix_vehicule < 500 || form.prix_vehicule > 500000) errors.push("Le prix doit être entre 500 et 500 000 €");
    if (form.anciennete_vehicule < 0 || form.anciennete_vehicule > 50) errors.push("L'ancienneté du véhicule doit être entre 0 et 50 ans");
    if (form.poids_vehicule < 0 || form.poids_vehicule > 5000) errors.push("Le poids doit être entre 0 et 5 000 kg");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
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
  input={form}
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
            <Field label="Coefficient bonus-malus" hint="Entre 0.5 (bonus max) et 3.5 (malus max)"
              tooltip="Le coefficient bonus-malus reflète votre historique de conduite. 0.5 signifie aucun sinistre depuis longtemps, 3.5 signifie plusieurs sinistres récents.">
              <Input type="number" step="0.01" min={0.5} max={3.5} value={form.bonus}
                onChange={(e) => set("bonus", parseFloat(e.target.value))} />
            </Field>
            <Field label="Type de contrat"
              tooltip="Le type de contrat détermine le niveau de couverture. Maxi offre la couverture la plus complète.">
              <Select value={form.type_contrat} onChange={(e) => set("type_contrat", e.target.value)}
                options={[
                  { value: "Maxi", label: "Maxi" },
                  { value: "Mini", label: "Mini" },
                  { value: "Medium", label: "Medium" },
                  { value: "Standard", label: "Standard" },
                ]} />
            </Field>
            <Field label="Durée du contrat (mois)"
              tooltip="Durée totale de votre contrat d'assurance en mois.">
              <Input type="number" min={0} max={120} value={form.duree_contrat}
                onChange={(e) => set("duree_contrat", parseInt(e.target.value))} />
            </Field>
            <Field label="Ancienneté info (années)"
              tooltip="Nombre d'années depuis votre première souscription d'assurance auto.">
              <Input type="number" min={0} max={50} value={form.anciennete_info}
                onChange={(e) => set("anciennete_info", parseInt(e.target.value))} />
            </Field>
            <Field label="Fréquence de paiement"
              tooltip="À quelle fréquence vous payez vos cotisations. Le paiement annuel est souvent moins cher.">
              <Select value={form.freq_paiement} onChange={(e) => set("freq_paiement", e.target.value)}
                options={[
                  { value: "Annual", label: "Annuel" },
                  { value: "Biannual", label: "Bi-annuel" },
                  { value: "Monthly", label: "Mensuel" },
                  { value: "Quarterly", label: "Trimestriel" },
                ]} />
            </Field>
            <Field label="Paiement en cours"
              tooltip="Indique si vous avez un paiement en cours sur ce contrat.">
              <Select value={form.paiement} onChange={(e) => set("paiement", e.target.value)}
                options={[
                  { value: "No", label: "Non" },
                  { value: "Yes", label: "Oui" },
                ]} />
            </Field>
            <Field label="Utilisation du véhicule"
              tooltip="L'usage principal de votre véhicule. Un usage professionnel augmente le risque de sinistre.">
              <Select value={form.utilisation} onChange={(e) => set("utilisation", e.target.value)}
                options={[
                  { value: "Retired", label: "Retraité" },
                  { value: "Professional", label: "Professionnel" },
                  { value: "Private", label: "Privé" },
                  { value: "AllPurpose", label: "Tous usages" },
                ]} />
            </Field>
            <Field label="Code postal" hint="5 chiffres"
              tooltip="Votre département influence le risque selon la densité de circulation et les statistiques d'accidents locales.">
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
              <Field label="Âge"
                tooltip="L'âge du conducteur est un facteur clé. Les jeunes conducteurs (18-25 ans) ont statistiquement plus de sinistres.">
                <Input type="number" min={18} max={100} value={form.age_conducteur1}
                  onChange={(e) => set("age_conducteur1", parseInt(e.target.value))} />
              </Field>
              <Field label="Sexe"
                tooltip="Le sexe du conducteur est un facteur statistique utilisé dans le calcul de la prime.">
                <Select value={form.sex_conducteur1} onChange={(e) => set("sex_conducteur1", e.target.value)}
                  options={[
                    { value: "M", label: "Masculin" },
                    { value: "F", label: "Féminin" },
                  ]} />
              </Field>
              <Field label="Ancienneté permis (ans)"
                tooltip="Nombre d'années depuis l'obtention du permis. Plus l'ancienneté est grande, plus le risque diminue.">
                <Input type="number" min={0} max={form.age_conducteur1 - 18} value={form.anciennete_permis1}
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
                <Field label="Âge"
                  tooltip="L'âge du conducteur secondaire influence également la prime calculée.">
                  <Input type="number" min={18} max={100} value={form.age_conducteur2 || ""}
                    onChange={(e) => set("age_conducteur2", parseInt(e.target.value))} />
                </Field>
                <Field label="Sexe">
                  <Select value={form.sex_conducteur2 || "M"} onChange={(e) => set("sex_conducteur2", e.target.value)}
                    options={[
                      { value: "M", label: "Masculin" },
                      { value: "F", label: "Féminin" },
                    ]} />
                </Field>
                <Field label="Ancienneté permis (ans)"
                  tooltip="Ancienneté du permis du conducteur secondaire.">
                  <Input type="number" min={0} max={form.age_conducteur2 ? form.age_conducteur2 - 18 : 0} value={form.anciennete_permis2 || ""}
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
            <Field label="Marque"
              tooltip="Sélectionnez la marque de votre véhicule parmi les marques disponibles.">
              {brandsLoading ? (
                <div style={{ height: "42px", background: "#e2e8f0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
              ) : (
                <Select
                  value={form.marque_vehicule}
                  onChange={(e) => {
                    set("marque_vehicule", e.target.value);
                    set("modele_vehicule", "");
                  }}
                  options={[
                    { value: "", label: "Sélectionner une marque" },
                    ...brands.map((b) => ({ value: b.value, label: b.label }))
                  ]}
                />
              )}
            </Field>
            <Field label="Modèle"
              tooltip="Sélectionnez le modèle de votre véhicule. La liste se met à jour selon la marque choisie.">
              {brandsLoading ? (
                <div style={{ height: "42px", background: "#e2e8f0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
              ) : (
                <Select
                  value={form.modele_vehicule}
                  onChange={(e) => set("modele_vehicule", e.target.value)}
                  options={[
                    { value: "", label: form.marque_vehicule ? "Sélectionner un modèle" : "Choisir une marque d'abord" },
                    ...modeles.map((m) => ({ value: m.value, label: m.label }))
                  ]}
                />
              )}
            </Field>
            <Field label="Type de carburant"
              tooltip="Le type de carburant de votre véhicule.">
              <Select value={form.essence_vehicule} onChange={(e) => set("essence_vehicule", e.target.value)}
                options={[
                  { value: "Gasoline", label: "Essence" },
                  { value: "Diesel", label: "Diesel" },
                  { value: "Electric", label: "Électrique" },
                  { value: "Hybrid", label: "Hybride" },
                  { value: "GPL", label: "GPL" },
                ]} />
            </Field>
            <Field label="Type de véhicule"
              tooltip="La catégorie de votre véhicule. Les SUV et utilitaires ont des profils de risque différents.">
              <Select value={form.type_vehicule} onChange={(e) => set("type_vehicule", e.target.value)}
                options={[
                  { value: "Tourism", label: "Tourisme" },
                  { value: "Utility", label: "Utilitaire" },
                  { value: "SUV", label: "SUV" },
                  { value: "Coupe", label: "Coupé" },
                  { value: "Convertible", label: "Cabriolet" },
                ]} />
            </Field>
            <Field label="Ancienneté véhicule (ans)"
              tooltip="Âge de votre véhicule en années. Les véhicules anciens ont des coûts de réparation différents.">
              <Input type="number" min={0} max={50} step="0.1" value={form.anciennete_vehicule}
                onChange={(e) => set("anciennete_vehicule", parseFloat(e.target.value))} />
            </Field>
            <Field label="Prix du véhicule (€)"
              tooltip="Valeur actuelle de votre véhicule. Influence le coût de remplacement en cas de sinistre total.">
              <Input type="number" min={500} max={500000} value={form.prix_vehicule}
                onChange={(e) => set("prix_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Cylindrée (cc)"
              tooltip="La cylindrée du moteur en centimètres cubes. Une cylindrée élevée est associée à des vitesses plus importantes.">
              <Input type="number" min={50} max={10000} value={form.cylindre_vehicule}
                onChange={(e) => set("cylindre_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Puissance DIN (ch)"
              tooltip="La puissance du moteur en chevaux. Une puissance élevée augmente le risque de sinistre grave.">
              <Input type="number" min={1} max={1000} value={form.din_vehicule}
                onChange={(e) => set("din_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Vitesse max (km/h)"
              tooltip="La vitesse maximale du véhicule. Ce facteur influence directement la gravité des sinistres potentiels.">
              <Input type="number" min={50} max={400} value={form.vitesse_vehicule}
                onChange={(e) => set("vitesse_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Poids (kg)" hint="0 si inconnu"
              tooltip="Le poids du véhicule influence la sévérité des dommages en cas d'accident.">
              <Input type="number" min={0} max={5000} value={form.poids_vehicule}
                onChange={(e) => set("poids_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Début vente (mois)" hint="1-12"
              tooltip="Mois de début de commercialisation du modèle.">
              <Input type="number" min={1} max={12} value={form.debut_vente_vehicule}
                onChange={(e) => set("debut_vente_vehicule", parseInt(e.target.value))} />
            </Field>
            <Field label="Fin vente (mois)" hint="1-12"
              tooltip="Mois de fin de commercialisation du modèle.">
              <Input type="number" min={1} max={12} value={form.fin_vente_vehicule}
                onChange={(e) => set("fin_vente_vehicule", parseInt(e.target.value))} />
            </Field>
          </div>
        </div>
      )}

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div style={{ marginTop: "1.5rem", border: "1px solid #fbbf24", background: "#fffbeb", borderRadius: "8px", padding: "12px 16px" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#92400e", margin: "0 0 8px" }}>
            Veuillez corriger les erreurs suivantes :
          </p>
          <ul style={{ margin: 0, paddingLeft: "16px" }}>
            {validationErrors.map((err, i) => (
              <li key={i} style={{ fontSize: "13px", color: "#92400e", marginBottom: "4px" }}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* API error */}
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