import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoTarif — Moteur de tarification assurance auto",
  description:
    "Calculez votre prime d'assurance automobile en temps réel grâce à nos modèles prédictifs de fréquence et sévérité.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
