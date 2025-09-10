"use client";

import { Store } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import type {
  NaverLatLng,
  NaverMapInstance,
  NaverMarkerInstance,
} from "@/types/naver";
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

  // 마커를 화면 중앙보다 약간 아래에 보이도록 중심 좌표를 위로 보정해서 이동
  const panToWithMarkerOffset = (pos: NaverLatLng, markerHeightPx: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const { naver } = window;
    const proj = map.getProjection();
    if (!proj) {
      try {
        map.panTo(pos);
      } catch {
        map.setCenter(pos);
      }
      return;
    }
    try {
      const pt = proj.fromCoordToOffset(pos);
      const adjusted = proj.fromOffsetToCoord(
        new naver.maps.Point(pt.x, pt.y - markerHeightPx * 0.3)
      );
      map.panTo(adjusted);
    } catch {
      map.setCenter(pos);
    }
  };

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

    const initialStore = stores[0];
    const initialCenter = initialStore
      ? new naver.maps.LatLng(initialStore.latitude, initialStore.longitude)
      : new naver.maps.LatLng(37.2945623, 126.9710853);

    let justCreated = false;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 16,
        customStyleId: STYLE_ID,
        gl: true,
      });
      justCreated = true;
    }

    // 선택된 스토어(없으면 첫 번째)로 마커/센터 갱신
    const selectedIndex = stores.length
      ? Math.max(
          0,
          Math.min(stores.length - 1, current > 0 ? current - 1 : current)
        )
      : 0;
    const selectedStore = stores[selectedIndex] ?? initialStore;
    if (selectedStore && mapInstanceRef.current) {
      const buildMarkerHTML = (name: string) =>
        `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px;border-radius:6px;color:white;pointer-events:none;">\n  <span style=\"background:rgba(0,0,0,0.35);padding:4px 10px;font-size:13px;font-weight:600;border-radius:4px;white-space:nowrap;\">${selectedStore.name}</span>\n  <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"35\" height=\"35\" />\n</div>`;
      const measure = (html: string) => {
        const wrap = document.createElement("div");
        wrap.style.cssText = "position:absolute;left:-9999px;top:0;";
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
        const rect = wrap.firstElementChild!.getBoundingClientRect();
        document.body.removeChild(wrap);
        return { html, w: Math.round(rect.width), h: Math.round(rect.height) };
      };

      const { naver } = window;
      const markerDef = measure(buildMarkerHTML(selectedStore.name));
      const pos = new naver.maps.LatLng(
        selectedStore.latitude,
        selectedStore.longitude
      );

      if (markerRef.current) {
        markerRef.current.setPosition(pos);
        markerRef.current.setIcon({
          content: markerDef.html,
          anchor: new naver.maps.Point(
            Math.round(markerDef.w / 2),
            markerDef.h
          ),
        });
        if (!markerRef.current.getMap())
          markerRef.current.setMap(mapInstanceRef.current);
      } else {
        markerRef.current = new naver.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          icon: {
            content: markerDef.html,
            anchor: new naver.maps.Point(
              Math.round(markerDef.w / 2),
              markerDef.h
            ),
          },
        });
      }

      // 지도 중심을 마커 높이의 절반만큼 위로 보정해 이동
      if (justCreated) {
        naver.maps.Event.once(mapInstanceRef.current, "idle", () => {
          panToWithMarkerOffset(pos, markerDef.h);
        });
      } else {
        panToWithMarkerOffset(pos, markerDef.h);
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
