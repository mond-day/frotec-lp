"use client";

import { useEffect } from "react";

/**
 * Aplica a classe `in-view` nos elementos `.reveal` / `.reveal-stagger` quando
 * eles entram na tela, disparando as transicoes definidas no globals.css.
 *
 * Fica montado uma unica vez no layout: assim as secoes continuam sendo Server
 * Components e nao precisam de um wrapper de cliente cada uma.
 */
export default function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal, .reveal-stagger");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
