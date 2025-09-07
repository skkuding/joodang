"use client";

import { Store } from "@/app/type";
import Script from "next/script";
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
  const didReloadRef = useRef(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // If already loaded (e.g., from previous navigation), mark ready
    if (window.naver?.maps) setIsReady(true);
    // Define SDK callback to mark readiness exactly when SDK signals loaded
    window.__onNaverReady = () => setIsReady(true);
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
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        gl: true,
        center: new naver.maps.LatLng(centerLat, centerLng),
        zoom: 16,
        customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
      });
      mapInstanceRef.current.setOptions({
        customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
      });
      window.naver.maps.Event?.once(mapInstanceRef.current!, "idle", () => {
        mapInstanceRef.current?.setOptions({
          customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
        });
      });
      setTimeout(() => {
        mapInstanceRef.current?.setOptions({
          customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
        });
      }, 50);

      // One-time soft reload: recreate map shortly after first init
      setTimeout(() => {
        if (didReloadRef.current) return;
        didReloadRef.current = true;
        // Detach existing marker from old map before recreating
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }
        // Null current instance to force re-creation on next effect pass
        mapInstanceRef.current = null;
        setReloadToken(t => t + 1);
      }, 120);
    } else {
      const nextCenter = new naver.maps.LatLng(centerLat, centerLng);
      if (typeof mapInstanceRef.current.panTo === "function") {
        mapInstanceRef.current.panTo(nextCenter);
      } else {
        mapInstanceRef.current.setCenter(nextCenter);
      }
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
        if (markerRef.current.getMap() !== mapInstanceRef.current) {
          markerRef.current.setMap(mapInstanceRef.current!);
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

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl&callback=__onNaverReady`}
        strategy="beforeInteractive"
        onLoad={() => setIsReady(true)}
        onReady={() => setIsReady(true)}
      />
  <div ref={mapRef} className="relative isolate z-0 h-[215px] overflow-hidden rounded-md" />
    </>
  );
}
