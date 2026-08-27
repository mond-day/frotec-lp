"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { Children, useRef, type ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px", amount: 0.15 });

  if (as === "section") {
    return (
      <motion.section
        ref={ref}
        className={className}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut", delay }}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function MotionStagger({ children, className }: MotionStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px", amount: 0.12 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={container}
    >
      {Children.toArray(children).map((child, index) => (
            <motion.div key={index} variants={item}>
              {child}
            </motion.div>
          ))}
    </motion.div>
  );
}
