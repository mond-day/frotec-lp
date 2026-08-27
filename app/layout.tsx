import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Mono, Inter } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import RevealObserver from "@/components/RevealObserver";
import "lenis/dist/lenis.css";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Frotec+ | Sua frota sempre rodando",
  description:
    "Gestão técnica recorrente para frotas de caminhões diesel: prevenção, auditoria de OS e rede credenciada no corredor da BR-163, eixo Mato Grosso–Rondônia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${chakraPetch.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <LenisProvider />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
