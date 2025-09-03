"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    naver: naver.maps.Map;
  }
}

export default function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const { naver } = window;
    if (!naver?.maps) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(37.2931959, 126.9745929),
      zoom: 18,
    });

    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.2931959, 126.9745929),
      map,
    });
  }, []);

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=geocoder`}
      />
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", borderRadius: 8 }}
      />
    </>
  );
}
