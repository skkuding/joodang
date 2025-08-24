"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const { naver } = window;
    if (!naver?.maps) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(37.2931959, 126.9745929),
      zoom: 18,
      mapDataControl: false,
    });

    new naver.maps.Marker({
      //마커는 이런식으로 추가하면 되는듯..
      position: new naver.maps.LatLng(37.2931959, 126.9745929),
      map,
    });
  }, [loaded]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}`}
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
      />
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", borderRadius: 8 }}
      />
    </>
  );
}
