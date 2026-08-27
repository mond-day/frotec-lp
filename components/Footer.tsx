"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { CONTATO } from "@/lib/contato";

const NAV_LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#beneficios", label: "Benefícios" },
  { href: "/#cobertura", label: "Cobertura" },
  { href: "/#escopo", label: "Escopo" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contato", label: "Contato" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
] as const;

function TextHoverEffect({ text = "Frotec+" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  function onPointerMove(clientX: number, clientY: number) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  }

  return (
    <div
      ref={wrapRef}
      className="foot-hover-wrap"
      onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) onPointerMove(t.clientX, t.clientY);
      }}
    >
      <p className="foot-hover-base" aria-hidden="true">
        {text}
      </p>
      <motion.p
        className="foot-hover-reveal"
        aria-hidden="true"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {text}
      </motion.p>
      <span className="visually-hidden">{text}</span>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="foot-bg-gradient" aria-hidden="true" />
      <div className="wrap foot-inner">
        <div className="foot-grid">
          <div className="foot-brand-block">
            <p className="foot-brand-kicker">{CONTATO.marca}</p>
            <p className="foot-brand-copy">
              Gestão técnica de frota no corredor BR-163 · {CONTATO.cidade}.
            </p>
            <div className="foot-contact-lines">
              <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
              <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
            </div>
          </div>

          <div className="foot-col">
            <h4>Navegação</h4>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h4>Contato</h4>
            <Link href="/#contato">Diagnosticar minha frota</Link>
            <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
            <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
          </div>

          <div className="foot-col">
            <h4>Legal</h4>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="foot-disclaimer">
          A Frotec presta serviços de gestão técnica e consultoria em manutenção de frotas. O
          convênio não é seguro, não é garantia estendida e não constitui operação securitária. As
          condições, limites e exclusões de cada plano são definidos em contrato.
        </p>

        <TextHoverEffect text="Frotec+" />

        <div className="foot-bottom">
          <span>
            © {year} {CONTATO.marca}. {CONTATO.cidade} — atuação em MT e RO.
          </span>
          <span>Desenvolvido por Sonder.Corp</span>
        </div>
      </div>
    </footer>
  );
}
