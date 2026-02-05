import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LicitaFácil - Tu Radar de Licitaciones",
  description: "Encuentra y gana licitaciones públicas con ayuda de la IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
