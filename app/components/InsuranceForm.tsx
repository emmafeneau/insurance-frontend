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
        <div className="space-y-5 animate-fade-up">
          <h2
            className="text-2xl mb-6 text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Informations du contrat
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Coefficient bonus-malus" hint="Entre 0.5 (bonus max) et 3.5 (malus max)">
              <Input
                type="number"
                step="0.01"
                min={0.5}
                max={3.5}
                value={form.bonus}
                onChange={(e) => set("bonus", parseFloat(e.target.value))}
              />
            </Field>

            <Field label="Type de contrat">
              <Select
                value={form.type_contrat}
                onChange={(e) => set("type_contrat", e.target.value)}
                options={[
                  { value: "Maxi", label: "Maxi" },
                  { value: "Mini", label: "Mini" },
                  { value: "Medium", label: "Medium" },
                  { value: "Standard", label: "Standard" },
                ]}
              />
            </Field>

            <Field label="Durée du contrat (mois)">
              <Input
                type="number"
                min={0}
                value={form.duree_contrat}
                onChange={(e) => set("duree_contrat", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Ancienneté info (années)">
              <Input
                type="number"
                min={0}
                value={form.anciennete_info}
                onChange={(e) => set("anciennete_info", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Fréquence de paiement">
              <Select
                value={form.freq_paiement}
                onChange={(e) => set("freq_paiement", e.target.value)}
                options={[
                  { value: "Annual", label: "Annuel" },
                  { value: "Biannual", label: "Bi-annuel" },
                  { value: "Monthly", label: "Mensuel" },
                  { value: "Quarterly", label: "Trimestriel" },
                ]}
              />
            </Field>

            <Field label="Paiement en cours">
              <Select
                value={form.paiement}
                onChange={(e) => set("paiement", e.target.value)}
                options={[
                  { value: "No", label: "Non" },
                  { value: "Yes", label: "Oui" },
                ]}
              />
            </Field>

            <Field label="Utilisation du véhicule">
              <Select
                value={form.utilisation}
                onChange={(e) => set("utilisation", e.target.value)}
                options={[
                  { value: "Retired", label: "Retraité" },
                  { value: "Professional", label: "Professionnel" },
                  { value: "Private", label: "Privé" },
                  { value: "AllPurpose", label: "Tous usages" },
                ]}
              />
            </Field>

            <Field label="Code postal" hint="5 chiffres">
              <Input
                type="text"
                maxLength={5}
                value={form.code_postal}
                onChange={(e) => set("code_postal", e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}

      {/* STEP 1 — Conducteur */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-up">
          <h2
            className="text-2xl mb-6 text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Conducteur(s)
          </h2>

          <div className="border border-border p-5 mb-4">
            <p className="text-xs tracking-widest uppercase text-muted mb-4">
              Conducteur principal
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Âge">
                <Input
                  type="number"
                  min={18}
                  max={120}
                  value={form.age_conducteur1}
                  onChange={(e) => set("age_conducteur1", parseInt(e.target.value))}
                />
              </Field>
              <Field label="Sexe">
                <Select
                  value={form.sex_conducteur1}
                  onChange={(e) => set("sex_conducteur1", e.target.value)}
                  options={[
                    { value: "M", label: "Masculin" },
                    { value: "F", label: "Féminin" },
                  ]}
                />
              </Field>
              <Field label="Ancienneté permis (ans)">
                <Input
                  type="number"
                  min={0}
                  value={form.anciennete_permis1}
                  onChange={(e) => set("anciennete_permis1", parseInt(e.target.value))}
                />
              </Field>
            </div>
          </div>

          <div className="border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-widest uppercase text-muted">
                Conducteur secondaire
              </p>
              <div className="flex gap-2">
                {["No", "Yes"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      set("conducteur2", v);
                      if (v === "No") {
                        set("age_conducteur2", 0);
                        set("sex_conducteur2", null);
                        set("anciennete_permis2", 0);
                      }
                    }}
                    className={`px-4 py-1.5 text-xs tracking-wider uppercase border transition-colors ${
                      form.conducteur2 === v
                        ? "bg-ink text-paper border-ink"
                        : "bg-transparent text-muted border-border hover:border-muted"
                    }`}
                  >
                    {v === "Yes" ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>

            {form.conducteur2 === "Yes" && (
              <div className="grid grid-cols-3 gap-4 animate-fade-in">
                <Field label="Âge">
                  <Input
                    type="number"
                    min={18}
                    max={120}
                    value={form.age_conducteur2 || ""}
                    onChange={(e) => set("age_conducteur2", parseInt(e.target.value))}
                  />
                </Field>
                <Field label="Sexe">
                  <Select
                    value={form.sex_conducteur2 || "M"}
                    onChange={(e) => set("sex_conducteur2", e.target.value)}
                    options={[
                      { value: "M", label: "Masculin" },
                      { value: "F", label: "Féminin" },
                    ]}
                  />
                </Field>
                <Field label="Ancienneté permis (ans)">
                  <Input
                    type="number"
                    min={0}
                    value={form.anciennete_permis2 || ""}
                    onChange={(e) => set("anciennete_permis2", parseInt(e.target.value))}
                  />
                </Field>
              </div>
            )}
            {form.conducteur2 === "No" && (
              <p className="text-sm text-muted/60 italic">
                Aucun conducteur secondaire déclaré
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 2 — Véhicule */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-up">
          <h2
            className="text-2xl mb-6 text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Véhicule
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Marque">
              <Input
                type="text"
                value={form.marque_vehicule}
                onChange={(e) => set("marque_vehicule", e.target.value.toUpperCase())}
                placeholder="ex : PEUGEOT"
              />
            </Field>
            <Field label="Modèle">
              <Input
                type="text"
                value={form.modele_vehicule}
                onChange={(e) => set("modele_vehicule", e.target.value.toUpperCase())}
                placeholder="ex : 308"
              />
            </Field>

            <Field label="Type de carburant">
              <Select
                value={form.essence_vehicule}
                onChange={(e) => set("essence_vehicule", e.target.value)}
                options={[
                  { value: "Gasoline", label: "Essence" },
                  { value: "Diesel", label: "Diesel" },
                  { value: "Electric", label: "Électrique" },
                  { value: "Hybrid", label: "Hybride" },
                  { value: "GPL", label: "GPL" },
                ]}
              />
            </Field>

            <Field label="Type de véhicule">
              <Select
                value={form.type_vehicule}
                onChange={(e) => set("type_vehicule", e.target.value)}
                options={[
                  { value: "Tourism", label: "Tourisme" },
                  { value: "Utility", label: "Utilitaire" },
                  { value: "SUV", label: "SUV" },
                  { value: "Coupe", label: "Coupé" },
                  { value: "Convertible", label: "Cabriolet" },
                ]}
              />
            </Field>

            <Field label="Ancienneté véhicule (ans)">
              <Input
                type="number"
                min={0}
                step="0.1"
                value={form.anciennete_vehicule}
                onChange={(e) => set("anciennete_vehicule", parseFloat(e.target.value))}
              />
            </Field>

            <Field label="Prix du véhicule (€)">
              <Input
                type="number"
                min={0}
                value={form.prix_vehicule}
                onChange={(e) => set("prix_vehicule", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Cylindrée (cc)">
              <Input
                type="number"
                min={1}
                value={form.cylindre_vehicule}
                onChange={(e) => set("cylindre_vehicule", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Puissance DIN (ch)">
              <Input
                type="number"
                min={1}
                value={form.din_vehicule}
                onChange={(e) => set("din_vehicule", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Vitesse max (km/h)">
              <Input
                type="number"
                min={1}
                value={form.vitesse_vehicule}
                onChange={(e) => set("vitesse_vehicule", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Poids (kg)" hint="0 si inconnu">
              <Input
                type="number"
                min={0}
                value={form.poids_vehicule}
                onChange={(e) => set("poids_vehicule", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Début vente (mois)" hint="1-12">
              <Input
                type="number"
                min={1}
                max={12}
                value={form.debut_vente_vehicule}
                onChange={(e) => set("debut_vente_vehicule", parseInt(e.target.value))}
              />
            </Field>

            <Field label="Fin vente (mois)" hint="1-12">
              <Input
                type="number"
                min={1}
                max={12}
                value={form.fin_vente_vehicule}
                onChange={(e) => set("fin_vente_vehicule", parseInt(e.target.value))}
              />
            </Field>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Erreur : </strong>{error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-border">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-3 border border-border text-sm tracking-wider uppercase hover:border-muted text-muted transition-colors"
          >
            ← Retour
          </button>
        )}
        <div className="flex-1" />
        {step < 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="px-8 py-3 bg-ink text-paper text-sm tracking-wider uppercase hover:bg-accent transition-colors"
          >
            Suivant →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-accent text-paper text-sm tracking-wider uppercase hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <span className="animate-pulse2">Calcul en cours</span>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full" />
              </>
            ) : (
              "Calculer la prime →"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
