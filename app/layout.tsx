import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, Manrope } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import MotionConfigProvider from "@/components/motion/MotionConfig";
import "lenis/dist/lenis.css";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Frotec+ | Gestão técnica para frotas que não podem parar",
  description:
    "Acompanhe o estado técnico da frota, organize a prevenção e audite serviços — antes que uma falha vire emergência na estrada. Atuação no corredor BR-163, eixo MT–RO.",
  openGraph: {
    title: "Frotec+ | Gestão técnica para frotas que não podem parar",
    description:
      "Previsibilidade técnica para frotas diesel: prevenção, auditoria de OS e cobertura no corredor BR-163.",
    locale: "pt_BR",
    type: "website",
    siteName: "Frotec",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frotec+ | Gestão técnica para frotas que não podem parar",
    description:
      "Previsibilidade técnica para frotas diesel no corredor BR-163 — MT e RO.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${barlowCondensed.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <LenisProvider />
        <MotionConfigProvider>{children}</MotionConfigProvider>
      </body>
    </html>
  );
}
