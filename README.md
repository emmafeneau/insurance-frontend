# AutoTarif — Frontend

Frontend Next.js pour le moteur de tarification assurance auto.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- Déploiement : **Vercel** (frontend) + **Render** (API FastAPI)

## Installation locale

```bash
npm install
cp .env.local.example .env.local
# Éditez .env.local avec votre URL Render
npm run dev
```

Ouvrez http://localhost:3000

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de l'API FastAPI sur Render | `https://mon-api.onrender.com` |

## Déploiement Vercel

1. Poussez ce dossier sur GitHub
2. Importez le repo sur [vercel.com](https://vercel.com)
3. Ajoutez `NEXT_PUBLIC_API_URL` dans Settings → Environment Variables
4. Déployez

## Structure

```
app/
├── page.tsx              # Page principale
├── layout.tsx            # Layout racine
├── globals.css           # Styles globaux + fonts
├── lib/
│   └── api.ts            # Client API typé
└── components/
    ├── InsuranceForm.tsx  # Formulaire 3 étapes
    ├── Field.tsx          # Composants input/select
    ├── StepIndicator.tsx  # Indicateur d'étapes
    └── Results.tsx        # Affichage résultats
```
