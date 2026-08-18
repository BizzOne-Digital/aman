"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function Experience({ introEnabled }: { introEnabled: boolean }) {
  const intro = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("canam-intro-seen");
    const frame = requestAnimationFrame(() =>
      setShowIntro(introEnabled && !reduced && !seen && pathname === "/"),
    );
    return () => cancelAnimationFrame(frame);
  }, [introEnabled, pathname]);

  useEffect(() => {
    if (!showIntro || !intro.current) return;
    document.documentElement.classList.add("intro-active");
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("canam-intro-seen", "true");
          document.documentElement.classList.remove("intro-active");
          setShowIntro(false);
        },
      });
      timeline
        .from(".intro-word", { yPercent: 120, duration: 0.8, ease: "power4.out" })
        .to(".intro-progress-bar", { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.35)
        .to(".intro-percent", { textContent: 100, snap: { textContent: 1 }, duration: 1.5 }, 0.35)
        .to(".intro-panel-left", { xPercent: -101, duration: 0.9, ease: "power4.inOut" }, 2)
        .to(".intro-panel-right", { xPercent: 101, duration: 0.9, ease: "power4.inOut" }, 2)
        .to(intro.current, { autoAlpha: 0, duration: 0.1 });
    }, intro);
    return () => {
      context.revert();
      document.documentElement.classList.remove("intro-active");
    };
  }, [showIntro]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 800px)").matches;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = mobile ? null : new Lenis({ duration: 1.05, smoothWheel: true });
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: mobile ? 24 : 54, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } },
        );
      });
      if (!mobile) {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.to(element, { yPercent: 10, ease: "none", scrollTrigger: { trigger: element, scrub: true } });
        });
      }
    });
    return () => {
      context.revert();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, [pathname]);

  if (!showIntro) return null;
  return (
    <div className="intro" ref={intro} aria-hidden="true">
      <div className="intro-panel intro-panel-left" />
      <div className="intro-panel intro-panel-right" />
      <div className="intro-center">
        <div className="intro-word-wrap"><span className="intro-word">CANAM</span></div>
        <span className="intro-kicker">FACILITY SERVICES</span>
        <div className="intro-progress"><span className="intro-progress-bar" /></div>
        <span className="intro-percent">0</span>
      </div>
    </div>
  );
}
