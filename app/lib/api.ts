const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PredictionInput {
  // Contrat
  bonus: number;
  type_contrat: string;
  duree_contrat: number;
  anciennete_info: number;
  freq_paiement: string;
  paiement: string;
  utilisation: string;
  code_postal: string;
  // Conducteur principal
  age_conducteur1: number;
  sex_conducteur1: string;
  anciennete_permis1: number;
  // Conducteur secondaire
  conducteur2: string;
  age_conducteur2: number;
  sex_conducteur2: string | null;
  anciennete_permis2: number;
  // Véhicule
  anciennete_vehicule: number;
  cylindre_vehicule: number;
  din_vehicule: number;
  essence_vehicule: string;
  marque_vehicule: string;
  modele_vehicule: string;
  debut_vente_vehicule: number;
  fin_vente_vehicule: number;
  vitesse_vehicule: number;
  type_vehicule: string;
  prix_vehicule: number;
  poids_vehicule: number;
}

export interface PrimeOutput {
  frequence: number;
  severite: number;
  prime_pure: number;
  prediction_id: number;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  models_loaded: boolean;
  freq_model: string;
  sev_model: string;
}

export interface VehicleBrand {
  value: string;
  label: string;
  models: { value: string; label: string }[];
}

export async function predictPrime(
  data: PredictionInput
): Promise<PrimeOutput> {
  const res = await fetch(`${API_URL}/api/v1/predict/prime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || `Erreur API (${res.status})`);
  }
  return res.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/api/v1/health`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error("API indisponible");
  return res.json();
}

export async function getVehicles(): Promise<{ brands: VehicleBrand[] }> {
  const res = await fetch(`${API_URL}/api/v1/vehicles`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Impossible de charger les véhicules");
  return res.json();
}