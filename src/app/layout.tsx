import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LicitaFlash - Licitaciones en Tiempo Real",
  description: "Recibe alertas instantáneas de licitaciones públicas con IA. Nunca más pierdas una oportunidad.",
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
