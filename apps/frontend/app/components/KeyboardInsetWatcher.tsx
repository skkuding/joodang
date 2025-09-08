"use client";
import { useEffect } from "react";

export default function KeyboardInsetWatcher() {
  useEffect(() => {
    const setKB = (px: number) => {
      const v = Math.max(0, Math.round(px));
      document.documentElement.style.setProperty("--kb", `${v}px`);
    };

    const compute = () => {
      try {
        const vv = window.visualViewport;
        if (!vv) {
          setKB(0);
          return;
        }
        // keyboard overlap estimate: innerHeight - (visual height + offsetTop)
        const kb = window.innerHeight - (vv.height + vv.offsetTop);
        setKB(kb > 0 ? kb : 0);
      } catch {
        setKB(0);
      }
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };

    // initial
    compute();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", schedule);
    vv?.addEventListener("scroll", schedule);
    window.addEventListener("focusin", schedule);
    window.addEventListener("focusout", schedule);
    window.addEventListener("orientationchange", schedule);
    window.addEventListener("pageshow", schedule);
    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      vv?.removeEventListener("resize", schedule);
      vv?.removeEventListener("scroll", schedule);
      window.removeEventListener("focusin", schedule);
      window.removeEventListener("focusout", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.removeEventListener("pageshow", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
