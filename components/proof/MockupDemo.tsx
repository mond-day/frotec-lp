"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type DemoFrame = {
  src: string;
  label: string;
  /** Posição relativa do clique fictício (0–100). */
  click?: { x: number; y: number };
};

const DESKTOP_FRAMES: DemoFrame[] = [
  {
    src: "/mockups/demo/desktop-dashboard.png",
    label: "Dashboard",
    click: { x: 18, y: 28 },
  },
  {
    src: "/mockups/demo/desktop-frota.png",
    label: "Frota",
    click: { x: 18, y: 36 },
  },
  {
    src: "/mockups/demo/desktop-checklist.png",
    label: "Avaliação",
    click: { x: 72, y: 78 },
  },
  {
    src: "/mockups/demo/desktop-os.png",
    label: "Ordens de serviço",
    click: { x: 18, y: 48 },
  },
];

const MOBILE_FRAMES: DemoFrame[] = [
  {
    src: "/mockups/demo/mobile-checklist.png",
    label: "Checklist",
    click: { x: 50, y: 88 },
  },
  {
    src: "/mockups/demo/mobile-fotos.png",
    label: "Evidências",
    click: { x: 50, y: 88 },
  },
  {
    src: "/mockups/demo/mobile-risco.png",
    label: "Risco",
    click: { x: 50, y: 88 },
  },
  {
    src: "/mockups/demo/mobile-laudo.png",
    label: "Laudo",
    click: { x: 70, y: 90 },
  },
];

const INTERVAL_MS = 3200;

function DemoScreen({
  frames,
  paused,
  reduce,
  className,
  alt,
}: {
  frames: DemoFrame[];
  paused: boolean;
  reduce: boolean | null;
  className?: string;
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const frame = frames[index] ?? frames[0];

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      setCursorVisible(true);
      window.setTimeout(() => {
        setCursorVisible(false);
        setIndex((i) => (i + 1) % frames.length);
      }, 480);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [frames.length, paused, reduce]);

  return (
    <div className={`demo-screen${className ? ` ${className}` : ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={frame.src}
          className="demo-screen-frame"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Image
            src={frame.src}
            alt={`${alt} — ${frame.label}`}
            fill
            sizes="(max-width: 980px) 100vw, 60vw"
            className="mockup-img"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {!reduce && frame.click && (
        <motion.div
          className="demo-cursor"
          aria-hidden="true"
          animate={{
            left: `${frame.click.x}%`,
            top: `${frame.click.y}%`,
            opacity: cursorVisible ? 1 : 0.35,
            scale: cursorVisible ? 0.85 : 1,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={`demo-cursor-ring${cursorVisible ? " is-click" : ""}`} />
        </motion.div>
      )}

      <div className="demo-screen-caption" aria-live="polite">
        {frame.label}
      </div>
    </div>
  );
}

export default function MockupDemo() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="mockup-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="device-laptop">
        <div className="device-laptop-bezel">
          <div className="device-laptop-screen">
            <DemoScreen
              frames={DESKTOP_FRAMES}
              paused={paused}
              reduce={reduce}
              alt="Portal Frotec desktop — modelo demonstrativo futuro"
            />
          </div>
        </div>
        <div className="device-laptop-base" aria-hidden="true" />
        <span className="demo-tag mockup-tag">Portal futuro · modelo demonstrativo</span>
      </div>

      <div className="device-phone">
        <div className="device-phone-bezel">
          <DemoScreen
            frames={MOBILE_FRAMES}
            paused={paused}
            reduce={reduce}
            className="is-phone"
            alt="App avaliador Frotec — modelo demonstrativo futuro"
          />
        </div>
        <span className="demo-tag mockup-tag">App avaliador · ilustrativo</span>
      </div>
    </div>
  );
}
