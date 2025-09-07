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
      gl: true,
      center: new naver.maps.LatLng(37.2931959, 126.9745929),
      zoom: 16,
      customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
    });

    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.2931959, 126.9745929),
      map,

      icon: {
        content: `<div style="display: flex; width: fit-content; flex-direction: column; align-items: center; gap: 4px;  padding: 8px; border-radius: 8px; color: white;">
                    <span style="background-color: rgba(255,255,255,0.1); padding: 4px 12px; font-size: 14px; font-weight: 600;">
                      모태솔로지만 연애는 하고싶어
                    </span>
                    <img
                      src="/icons/icon_location.svg"
                      alt="pin"
                      width="22"
                      height="35"
                    />
                  </div>`,
        anchor: new naver.maps.Point(100, 50),
      },
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
