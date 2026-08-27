"use client";

import { useReducedMotion } from "framer-motion";
import { HERO_HAS_VIDEO, HERO_POSTER_SRC, HERO_VIDEO_MOBILE_SRC, HERO_VIDEO_SRC } from "@/lib/media";

export default function HeroMedia() {
  const reduce = useReducedMotion();

  return (
    <>
      {HERO_HAS_VIDEO && !reduce ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER_SRC}
        >
          <source src={HERO_VIDEO_MOBILE_SRC} type="video/mp4" media="(max-width: 760px)" />
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div className="hero-poster" role="presentation" />
      )}
      <div className="hero-media-overlay" />
      <div className="hero-grain" />
    </>
  );
}
