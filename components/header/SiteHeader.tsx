"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#beneficios", label: "Benefícios" },
  { href: "#cobertura", label: "Cobertura" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [mostrarCtaMobile, setMostrarCtaMobile] = useState(false);

  useEffect(() => {
    const aoRolar = () => {
      const y = window.scrollY;
      setRolou(y > 24);
      setMostrarCtaMobile(y > window.innerHeight * 0.85);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-mobile-cta", mostrarCtaMobile);
    return () => document.body.classList.remove("has-mobile-cta");
  }, [mostrarCtaMobile]);

  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAberto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuAberto]);

  return (
    <>
      <header className={rolou ? "scrolled" : undefined}>
        <nav>
          <a href="#topo" className="brand" aria-label="Frotec — início">
            <Image
              className="brand-logo"
              src="/frotec-logo.png"
              alt="Frotec"
              width={936}
              height={149}
              priority
            />
          </a>

          <ul className={`nav-links${menuAberto ? " open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuAberto(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav-cta">
              <a
                href="#contato"
                className="btn btn-primary"
                onClick={() => {
                  setMenuAberto(false);
                  track("hero_cta_click", { source: "nav_mobile" });
                }}
              >
                Diagnosticar minha frota
              </a>
            </li>
          </ul>

          <a
            href="#contato"
            className="btn btn-primary desktop-only nav-cta"
            onClick={() => track("hero_cta_click", { source: "nav" })}
          >
            Diagnosticar minha frota
          </a>

          <button
            type="button"
            className="burger"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            {menuAberto ? "\u2715" : "\u2630"}
          </button>
        </nav>
      </header>

      <div className={`mobile-cta-bar${mostrarCtaMobile ? " visible" : ""}`}>
        <a
          href="#contato"
          className="btn btn-primary"
          onClick={() => track("hero_cta_click", { source: "mobile_sticky" })}
        >
          Avaliar minha frota
        </a>
      </div>
    </>
  );
}
