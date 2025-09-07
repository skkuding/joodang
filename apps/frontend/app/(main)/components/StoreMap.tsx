"use client";

import { Store } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import type { NaverMapInstance, NaverMarkerInstance } from "@/types/naver";

declare global {
  interface Window {
    __onNaverReady?: () => void;
  }
}

interface StoreMapProps {
  stores: Store[];
  current: number;
}

export default function StoreMap({ stores, current }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMapInstance | null>(null);
  const markerRef = useRef<NaverMarkerInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const STYLE_ID = "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c";
  // Allow up to two soft reloads to maximize style application reliability
  const reloadCountRef = useRef(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);

  const scheduleTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const scheduleInterval = (fn: () => void, every: number, stopAfterMs: number) => {
    const started = Date.now();
    const id = window.setInterval(() => {
      fn();
      if (Date.now() - started > stopAfterMs) {
        window.clearInterval(id);
      }
    }, every);
    intervalsRef.current.push(id as unknown as number);
    return id;
  };

  // Apply style with aggressive retries to guarantee application
  const applyCustomStyle = (
    map: NaverMapInstance | null,
    mode: "robust" | "light" = "robust"
  ) => {
    if (!map) return;
    const attempt = () => {
      try {
        map.setOptions({ customStyleId: STYLE_ID });
      } catch {}
    };

    // Always try immediately
    attempt();

    const delays = mode === "robust" ? [16, 33, 66, 120, 200, 350, 600, 1200, 2000] : [60, 180];
    for (const d of delays) {
      scheduleTimeout(attempt, d);
    }

    // Also on first idle after any re-render
    try {
      window.naver?.maps?.Event?.once(map, "idle", () => {
        attempt();
        // a couple more short retries post-idle
        scheduleTimeout(attempt, 60);
        scheduleTimeout(attempt, 180);
      });
    } catch {}

    // Try on additional map lifecycle events that often correlate with style swaps
    try {
      window.naver?.maps?.Event?.once(map, "tilesloaded", () => {
        attempt();
        scheduleTimeout(attempt, 80);
      });
    } catch {}
    try {
      window.naver?.maps?.Event?.once(map, "zoom_changed", () => {
        attempt();
      });
    } catch {}
    try {
      window.naver?.maps?.Event?.once(map, "center_changed", () => {
        attempt();
      });
    } catch {}

    // Short burst interval to cover GL internal reflows
    if (mode === "robust") {
      scheduleInterval(attempt, 100, 3000);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    // If already loaded (e.g., from previous navigation), mark ready
    if (window.naver?.maps) {
      setIsReady(true);
      return;
    }

    // Define SDK callback as a fallback (in case URL uses callback later)
    window.__onNaverReady = () => setIsReady(true);

    const existing = document.getElementById(
      "naver-maps-sdk"
    ) as HTMLScriptElement | null;
    const onLoad = () => setIsReady(true);

    if (existing) {
      // If script tag exists but not loaded yet, hook load event
      if (!window.naver?.maps) {
        existing.addEventListener("load", onLoad);
        return () => existing.removeEventListener("load", onLoad);
      }
      setIsReady(true);
      return;
    }

    // Dynamically inject SDK (works on client-side navigation too)
    const script = document.createElement("script");
    script.id = "naver-maps-sdk";
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl`;
    script.addEventListener("load", onLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!isReady) return;

    const { naver } = window;
    if (!naver?.maps) return;

    const selectedIndex = stores.length
      ? Math.max(
          0,
          Math.min(stores.length - 1, current > 0 ? current - 1 : current)
        )
      : 0;
    const selectedStore = stores[selectedIndex];

    const centerLat = selectedStore?.latitude ?? 37.2931959;
    const centerLng = selectedStore?.longitude ?? 126.9745929;

    if (!mapInstanceRef.current) {
      setIsVisible(false);
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        gl: true,
        center: new naver.maps.LatLng(centerLat, centerLng),
        zoom: 16,
        customStyleId: STYLE_ID,
      });
  applyCustomStyle(mapInstanceRef.current, "robust");
      // Reveal after first stable render
      try {
        window.naver?.maps?.Event?.once(mapInstanceRef.current, "idle", () =>
          setIsVisible(true)
        );
      } catch {
        setIsVisible(true);
      }
      // Fallback reveal (slightly longer to avoid flashing pre-style)
      scheduleTimeout(() => setIsVisible(true), 320);

      // Up to two soft reloads to further guarantee style application
      const softReload = () => {
        // Detach marker from old instance
        if (markerRef.current) {
          try {
            markerRef.current.setMap(null);
          } catch {}
          markerRef.current = null;
        }
        // Clear container and null map instance to force re-init
        const el = mapRef.current;
        if (el) {
          try {
            el.innerHTML = "";
          } catch {}
        }
        mapInstanceRef.current = null;
        setIsVisible(false);
        setReloadToken((t) => t + 1);
      };

    const scheduleSoftReload = (delay: number) => {
        scheduleTimeout(() => {
      if (reloadCountRef.current >= 4) return;
          reloadCountRef.current += 1;
          softReload();
        }, delay);
      };

      scheduleSoftReload(120);
      scheduleSoftReload(420);
    scheduleSoftReload(900);
    scheduleSoftReload(1800);
    } else {
      const nextCenter = new naver.maps.LatLng(centerLat, centerLng);
      if (typeof mapInstanceRef.current.panTo === "function") {
        mapInstanceRef.current.panTo(nextCenter);
      } else {
        mapInstanceRef.current.setCenter(nextCenter);
      }
      // Light re-apply after movement to avoid any style loss
      applyCustomStyle(mapInstanceRef.current, "light");
    }

    // Update marker for the selected store
    if (selectedStore) {
      const markerContent = `<div id="marker-${selectedStore.id}" style="display: flex; width: fit-content; flex-direction: column; align-items: center; gap: 4px; padding: 0px; border-radius: 8px; color: white;">
                        <span style="background-color: rgba(255,255,255,0.1); padding: 4px 12px; font-size: 14px; font-weight: 600;">
                          ${selectedStore.name}
                        </span>
                        <img
                          src="/icons/icon_location.svg"
                          alt="pin"
                          width="22"
                          height="35"
                        />
                      </div>`;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = markerContent;
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.top = "-9999px";
      document.body.appendChild(tempDiv);

      const markerElement = tempDiv.firstElementChild as HTMLElement;
      const rect = markerElement.getBoundingClientRect();
      const anchorX = rect.width / 2;
      const anchorY = 55;
      document.body.removeChild(tempDiv);

      const position = new naver.maps.LatLng(
        selectedStore.latitude,
        selectedStore.longitude
      );

      if (markerRef.current) {
        markerRef.current.setPosition(position);
        markerRef.current.setIcon({
          content: markerContent,
          anchor: new naver.maps.Point(anchorX, anchorY),
        });
        if (!markerRef.current.getMap()) {
          markerRef.current.setMap(mapInstanceRef.current);
        }
      } else {
        markerRef.current = new naver.maps.Marker({
          position,
          map: mapInstanceRef.current,
          icon: {
            content: markerContent,
            anchor: new naver.maps.Point(anchorX, anchorY),
          },
        });
      }
    }

    return () => {};
  }, [isReady, stores, current, reloadToken]);

  // Re-apply style on page return/visibility
  useEffect(() => {
    const reapply = () => applyCustomStyle(mapInstanceRef.current, "robust");
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        scheduleTimeout(reapply, 50);
      }
    };
    window.addEventListener("pageshow", reapply);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pageshow", reapply);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // cleanup any timers/intervals on unmount
  useEffect(() => {
    return () => {
      for (const id of timeoutsRef.current) window.clearTimeout(id);
      for (const id of intervalsRef.current) window.clearInterval(id);
      timeoutsRef.current = [];
      intervalsRef.current = [];
    };
  }, []);

  return (
    <>
      <div
        ref={mapRef}
        className={`relative isolate z-0 my-3 aspect-[67/43] overflow-hidden rounded-md transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
