"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PropostaTopbar() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    try {
      await fetch("/api/propostas/logout", { method: "POST" });
    } finally {
      router.push("/propostas/login");
      router.refresh();
    }
  }

  return (
    <header className="proposta-topbar">
      <div className="wrap proposta-topbar-inner">
        <Link href="/propostas" className="proposta-brand">
          <Image src="/frotec-logo.png" alt="Frotec" width={936} height={149} />
        </Link>
        <div className="proposta-topbar-actions">
          <span className="proposta-topbar-kicker">Gerador de propostas</span>
          <button type="button" className="btn btn-ghost" onClick={sair} disabled={saindo}>
            {saindo ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </header>
  );
}
