"use client";

import { Store } from "@/app/type";
import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    naver: naver.maps.Map;
  }
}

interface StoreMapProps {
  stores: Store[];
  current: number;
}

export default function StoreMap({ stores, current }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const { naver } = window;
    if (!naver?.maps) return;

    const selectedStore = stores[current];

    const centerLat = selectedStore?.latitude ?? 37.2931959;
    const centerLng = selectedStore?.longitude ?? 126.9745929;

    const map = new naver.maps.Map(mapRef.current, {
      gl: true,
      center: new naver.maps.LatLng(centerLat, centerLng),
      zoom: 15,
      customStyleId: "5ebaa70e-0bc8-4f24-b7a3-6247c307974c",
    });

    stores.forEach((store, index) => {
      if (index !== current - 1) return;
      new naver.maps.Marker({
        position: new naver.maps.LatLng(store.latitude, store.longitude),
        map,
        icon: {
          content: `<div style="display: flex; width: fit-content; flex-direction: column; align-items: center; gap: 4px;  padding: 8px; border-radius: 8px; color: white;">
                      <span style="background-color: rgba(255,255,255,0.1); padding: 4px 12px; font-size: 14px; font-weight: 600;">
                        ${store.name}
                      </span>
                      <img
                        src="/icons/icon_location.svg"
                        alt="pin"
                        width="22"
                        height="35"
                      />
                    </div>`,
        },
      });
    });
  });

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl`}
      />
      <div ref={mapRef} className="h-[215px] rounded-md" />
    </>
  );
}
