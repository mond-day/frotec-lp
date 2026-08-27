"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
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
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);

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
    document.body.classList.toggle("menu-open", menuAberto);
    return () => document.body.classList.remove("menu-open");
  }, [menuAberto]);

  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAberto(false);
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setMenuAberto(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [menuAberto]);

  return (
    <>
      <header className={rolou ? "scrolled" : undefined}>
        <nav ref={navRef}>
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

          <ul id={menuId} className={`nav-links${menuAberto ? " open" : ""}`}>
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
                Avaliar minha frota
              </a>
            </li>
          </ul>

          <a
            href="#contato"
            className="btn btn-primary desktop-only nav-cta"
            onClick={() => track("hero_cta_click", { source: "nav" })}
          >
            Avaliar minha frota
          </a>

          <button
            type="button"
            className="burger"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls={menuId}
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
