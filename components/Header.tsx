"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#beneficios", label: "Benefícios" },
  { href: "#cobertura", label: "Onde atuamos" },
  { href: "#servico", label: "O serviço" },
  { href: "#faq", label: "Perguntas" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 20);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header className={rolou ? "scrolled" : undefined}>
      <nav>
        <div className="brand">
          <Image
            className="brand-logo"
            src="/frotec-logo.png"
            alt="Frotec"
            width={936}
            height={149}
            priority
          />
        </div>

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
              onClick={() => setMenuAberto(false)}
            >
              Agendar avaliação
            </a>
          </li>
        </ul>

        <a href="#contato" className="btn btn-primary desktop-only nav-cta">
          Agendar avaliação
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
  );
}
