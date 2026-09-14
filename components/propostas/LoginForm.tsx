"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPropostas() {
  const router = useRouter();
  const params = useSearchParams();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const resposta = await fetch("/api/propostas/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      if (!resposta.ok) {
        const corpo = (await resposta.json().catch(() => ({}))) as { erro?: string };
        setErro(corpo.erro ?? "Não foi possível entrar.");
        return;
      }
      const destino = params.get("next");
      router.push(destino && destino.startsWith("/propostas") ? destino : "/propostas");
      router.refresh();
    } catch {
      setErro("Não foi possível entrar. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="proposta-login">
      <div className="proposta-login-card">
        <Link href="/" className="proposta-login-logo">
          <Image src="/frotec-logo.png" alt="Frotec" width={936} height={149} />
        </Link>
        <p className="eyebrow">Area interna</p>
        <h1>Gerador de propostas</h1>
        <p className="proposta-login-lead">Acesso restrito ao comercial da Frotec.</p>
        <form onSubmit={aoEnviar} noValidate>
          <div className="field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {erro ? (
            <p className="form-msg err" role="alert">
              {erro}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
