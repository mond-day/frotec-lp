"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { track } from "@/lib/analytics";
import { CONTATO } from "@/lib/contato";

const NAV_LINKS = [
  { href: "/#dor", label: "O problema" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#ganhos", label: "Ganhos" },
  { href: "/#cobertura", label: "Cobertura" },
  { href: "/#escopo", label: "Escopo" },
] as const;

const TRUST_LINKS = [
  { href: "/#para-quem", label: "Para quem é" },
  { href: "/#prova", label: "Prova operacional" },
  { href: "/#auditoria", label: "Auditoria de OS" },
  { href: "/#faq", label: "FAQ" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos" },
] as const;

function TextHoverEffect({ text = "FROTEC" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

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
      <div className="foot-bg-grid" aria-hidden="true" />
      <div className="wrap foot-inner">
        <div className="foot-cta">
          <div>
            <div className="eyebrow">Último passo</div>
            <h2>Quanto da sua rotina hoje ainda depende de apagar incêndio?</h2>
            <p>
              Uma conversa inicial para entender operação, frota e os principais pontos de perda de
              previsibilidade.
            </p>
          </div>
          <div className="foot-cta-actions">
            <a
              href="#contato"
              className="btn btn-primary"
              onClick={() => track("hero_cta_click", { source: "footer_cta" })}
            >
              Avaliar minha frota <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
            <a href={CONTATO.telefoneLink} className="btn btn-ghost">
              Falar por telefone
            </a>
            <span className="foot-cta-note">Resposta em horário comercial</span>
          </div>
        </div>

        <div className="foot-grid">
          <div className="foot-brand-block">
            <Image
              className="foot-logo"
              src="/frotec-logo.png"
              alt="Frotec"
              width={936}
              height={149}
            />
            <p className="foot-brand-copy">
              Gestão técnica de frotas diesel no corredor BR-163 — eixo Mato Grosso–Rondônia, com
              base em Sinop/MT.
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
            <h4>Confiança</h4>
            {TRUST_LINKS.map((link) => (
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
          condições, limites e exclusões de cada plano são definidos em contrato. Razão social e
          CNPJ em processo de registro.
        </p>

        <TextHoverEffect text="FROTEC" />

        <div className="foot-bottom">
          <span>
            © {year} {CONTATO.marca} · {CONTATO.cidade} — atuação em MT e RO
          </span>
          <span className="foot-bottom-links">
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos</Link>
            <span>Desenvolvido por Sonder.Corp</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
