"use client";

import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  HERO_HAS_VIDEO,
  HERO_POSTER_SRC,
  HERO_VIDEO_MOBILE_SRC,
  HERO_VIDEO_SRC,
} from "@/lib/media";

export default function HeroMedia() {
  const reduce = useReducedMotion();
  const [videoOk, setVideoOk] = useState(HERO_HAS_VIDEO);

  const showVideo = videoOk && !reduce;

  return (
    <>
      {showVideo ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER_SRC}
          onError={() => setVideoOk(false)}
        >
          <source src={HERO_VIDEO_MOBILE_SRC} type="video/mp4" media="(max-width: 760px)" />
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- poster SVG como fundo full-bleed
        <img className="hero-poster" src={HERO_POSTER_SRC} alt="" />
      )}
      <div className="hero-media-overlay" />
      <div className="hero-grain" />
      <div className="hero-split" />
    </>
  );
}
