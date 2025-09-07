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
  const didReloadRef = useRef(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const applyCustomStyle = (map: NaverMapInstance | null) => {
    if (!map) return;
    try {
      map.setOptions({ customStyleId: STYLE_ID });
    } catch {}
    try {
      window.naver?.maps?.Event?.once(map, "idle", () => {
        try {
          map.setOptions({ customStyleId: STYLE_ID });
        } catch {}
      });
    } catch {}
    // Single fallback after a short delay
    window.setTimeout(() => {
      try {
        map.setOptions({ customStyleId: STYLE_ID });
      } catch {}
    }, 150);
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
      if (!(window as any).naver?.maps) {
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
      applyCustomStyle(mapInstanceRef.current);
      // Reveal after first stable render
      try {
        window.naver?.maps?.Event?.once(mapInstanceRef.current, "idle", () =>
          setIsVisible(true)
        );
      } catch {
        setIsVisible(true);
      }
      // Fallback reveal
      window.setTimeout(() => setIsVisible(true), 220);

      // One-time soft reload to stabilize first paint/styles
      window.setTimeout(() => {
        if (didReloadRef.current) return;
        didReloadRef.current = true;
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
        setReloadToken(t => t + 1);
      }, 120);
    } else {
      const nextCenter = new naver.maps.LatLng(centerLat, centerLng);
      if (typeof mapInstanceRef.current.panTo === "function") {
        mapInstanceRef.current.panTo(nextCenter);
      } else {
        mapInstanceRef.current.setCenter(nextCenter);
      }
      // Keep current style; avoid redundant reapply to reduce jank
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
    const reapply = () => applyCustomStyle(mapInstanceRef.current);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        window.setTimeout(reapply, 50);
      }
    };
    window.addEventListener("pageshow", reapply);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pageshow", reapply);
      document.removeEventListener("visibilitychange", onVisible);
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
