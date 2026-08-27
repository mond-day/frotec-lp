"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article";
};

export default function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const props: HTMLMotionProps<"div"> = {
    className,
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2, margin: "0px 0px -40px 0px" },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  };

  if (as === "section") {
    return <motion.section {...props}>{children}</motion.section>;
  }
  if (as === "article") {
    return <motion.article {...props}>{children}</motion.article>;
  }
  return <motion.div {...props}>{children}</motion.div>;
}
