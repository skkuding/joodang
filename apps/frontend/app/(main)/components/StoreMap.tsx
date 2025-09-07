"use client";

import { Store } from "@/app/type";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type NaverLatLng = unknown;
type NaverPoint = unknown;

interface NaverMapInstance {
  setCenter(latlng: NaverLatLng): void;
  panTo?(latlng: NaverLatLng): void;
}

interface NaverMarkerInstance {
  setPosition(latlng: NaverLatLng): void;
  setIcon(icon: { content: string; anchor: NaverPoint }): void;
  getMap(): NaverMapInstance | null;
  setMap(map: NaverMapInstance | null): void;
}

declare global {
  interface Window {
    naver: {
      maps?: {
        Map: new (
          el: HTMLElement,
          options: {
            gl?: boolean;
            center: NaverLatLng;
            zoom: number;
            customStyleId?: string;
          }
        ) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Point: new (x: number, y: number) => NaverPoint;
        Marker: new (opts: {
          position: NaverLatLng;
          map: NaverMapInstance;
          icon: { content: string; anchor: NaverPoint };
        }) => NaverMarkerInstance;
      };
    };
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

    // optional cleanup on unmount
    return () => {
      // leave map instance to persist across renders; cleanup happens on component unmount
    };
  }, [isReady, stores, current]);

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl`}
        onLoad={() => setIsReady(true)}
      />
      <div ref={mapRef} className="h-[215px] rounded-md" />
    </>
  );
}
