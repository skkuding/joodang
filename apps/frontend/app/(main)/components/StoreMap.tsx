"use client";

import { Store } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import type { NaverMapInstance, NaverMarkerInstance } from "@/types/naver";
import { loadNaverMaps } from "@/lib/naverMapsLoader";

interface StoreMapProps {
  stores: Store[];
  current: number;
}

export default function StoreMap({ stores, current }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMapInstance | null>(null);
  const markerRef = useRef<NaverMarkerInstance | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const STYLE_ID = "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c";

  useEffect(() => {
    let mounted = true;
    loadNaverMaps()
      .then(() => mounted && setSdkLoaded(true))
      .catch(err => console.warn("Naver Maps load error", err));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !mapRef.current) return;
    const { naver } = window;
    if (!naver?.maps) return;

    const selectedIndex = stores.length
      ? Math.max(
          0,
          Math.min(stores.length - 1, current > 0 ? current - 1 : current)
        )
      : 0;
    const selectedStore = stores[selectedIndex];
    const lat = selectedStore?.latitude ?? 37.2931959;
    const lng = selectedStore?.longitude ?? 126.9745929;
    const center = new naver.maps.LatLng(lat, lng);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        center,
        zoom: 16,
        customStyleId: STYLE_ID,
        gl: true,
      });
    } else {
      try { mapInstanceRef.current.panTo(center); } catch {}
    }

    if (selectedStore && mapInstanceRef.current) {
      const markerHtml = `<div style=\"display:flex;flex-direction:column;align-items:center;gap:4px;color:white;\">\n <span style=\"background:rgba(0,0,0,0.35);padding:4px 10px;font-size:13px;font-weight:600;border-radius:4px;white-space:nowrap;\">${selectedStore.name}</span>\n <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"22\" height=\"35\" />\n</div>`;
      const pos = new naver.maps.LatLng(
        selectedStore.latitude,
        selectedStore.longitude
      );
      if (markerRef.current) {
        markerRef.current.setPosition(pos);
        markerRef.current.setIcon({
          content: markerHtml,
          anchor: new naver.maps.Point(20, 55),
        });
        if (!markerRef.current.getMap())
          markerRef.current.setMap(mapInstanceRef.current);
      } else {
        markerRef.current = new naver.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          icon: { content: markerHtml, anchor: new naver.maps.Point(20, 55) },
        });
      }
    }
  }, [sdkLoaded, stores, current]);

  useEffect(
    () => () => {
      if (markerRef.current)
        try {
          markerRef.current.setMap(null);
        } catch {}
    },
    []
  );

  return (
    <div
      ref={mapRef}
      className="relative isolate z-0 my-3 aspect-[67/43] overflow-hidden rounded-md"
    />
  );
}
