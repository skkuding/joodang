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
  const timeoutsRef = useRef<number[]>([]);
  const didInitialCenterRef = useRef(false);
  const pannedOnceRef = useRef(false);
  const STYLE_ID = "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c";

  const getAdjustedPos = (
    map: NaverMapInstance,
    pos: NaverLatLng,
    markerHeightPx: number
  ): NaverLatLng => {
    const { naver } = window;
    const proj = map.getProjection();
    if (!proj) return pos;
    const pt = proj.fromCoordToOffset(pos);
    const adjustedPt = new naver.maps.Point(
      pt.x,
      pt.y - Math.round(markerHeightPx * 0.3)
    );
    return proj.fromOffsetToCoord(adjustedPt);
  };

  const panWithNudge = (map: NaverMapInstance, target: NaverLatLng) => {
    const { naver } = window;
    const cur = map.getCenter();
    const nearlyEqual =
      Math.abs(cur.lat() - target.lat()) < 1e-7 &&
      Math.abs(cur.lng() - target.lng()) < 1e-7;
    if (nearlyEqual) {
      map.setCenter(new naver.maps.LatLng(target.lat() + 1e-6, target.lng()));
      requestAnimationFrame(() => {
        try {
          map.panTo(target);
        } catch {
          map.setCenter(target);
        }
      });
    } else {
      try {
        map.panTo(target);
      } catch {
        map.setCenter(target);
      }
    }
  };

  const ensureReadyAndPan = (
    map: NaverMapInstance,
    pos: NaverLatLng,
    markerHeightPx: number,
    maxWaitMs = 800,
    pollMs = 80
  ) => {
    const startedAt = Date.now();
    const tryOnce = () => {
      if (pannedOnceRef.current) return;
      const proj = map.getProjection();
      const size = map.getSize();
      const ready = !!proj && size.width > 0 && size.height > 0;
      if (ready) {
        const adjusted = getAdjustedPos(map, pos, markerHeightPx);
        const run = () => {
          if (pannedOnceRef.current) return;
          pannedOnceRef.current = true;
          panWithNudge(map, adjusted);
        };
        requestAnimationFrame(run);
        const id = window.setTimeout(run, 60);
        timeoutsRef.current.push(id);
        return;
      }
      if (Date.now() - startedAt >= maxWaitMs) {
        pannedOnceRef.current = true;
        try {
          map.panTo(pos);
        } catch {
          map.setCenter(pos);
        }
        return;
      }
      const id = window.setTimeout(tryOnce, pollMs);
      timeoutsRef.current.push(id);
    };
    tryOnce();
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

    if (timeoutsRef.current.length) {
      for (const id of timeoutsRef.current) window.clearTimeout(id);
      timeoutsRef.current = [];
    }

    const initialStore = stores[0];
    const initialCenter = initialStore
      ? new naver.maps.LatLng(initialStore.latitude, initialStore.longitude)
      : new naver.maps.LatLng(37.2945623, 126.9710853);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 16,
        customStyleId: STYLE_ID,
        gl: true,
      });
      didInitialCenterRef.current = false; // 새 맵 생성 시 초기 센터 처리 초기화
    }

    const selectedIndex = stores.length
      ? Math.max(
          0,
          Math.min(stores.length - 1, current > 0 ? current - 1 : current)
        )
      : 0;
    const selectedStore = stores[selectedIndex] ?? initialStore;
    const map = mapInstanceRef.current;
    if (!map || !selectedStore) return;

    const buildMarkerHTML = (name: string) =>
      `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px;border-radius:6px;color:white;pointer-events:none;">\n  <span style=\"background:rgba(0,0,0,0.35);padding:4px 10px;font-size:13px;font-weight:600;border-radius:4px;white-space:nowrap;\">${name}</span>\n  <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"35\" height=\"35\" />\n</div>`;
    const measure = (html: string) => {
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:absolute;left:-9999px;top:0;";
      wrap.innerHTML = html;
      document.body.appendChild(wrap);
      const rect = (
        wrap.firstElementChild as HTMLElement
      ).getBoundingClientRect();
      document.body.removeChild(wrap);
      return { html, w: Math.round(rect.width), h: Math.round(rect.height) };
    };

    const markerDef = measure(buildMarkerHTML(selectedStore.name));
    const pos = new naver.maps.LatLng(
      selectedStore.latitude,
      selectedStore.longitude
    );

    if (markerRef.current) {
      markerRef.current.setPosition(pos);
      markerRef.current.setIcon({
        content: markerDef.html,
        anchor: new naver.maps.Point(Math.round(markerDef.w / 2), markerDef.h),
      });
      if (!markerRef.current.getMap()) markerRef.current.setMap(map);
    } else {
      markerRef.current = new naver.maps.Marker({
        position: pos,
        map,
        icon: {
          content: markerDef.html,
          anchor: new naver.maps.Point(
            Math.round(markerDef.w / 2),
            markerDef.h
          ),
        },
      });
    }

    if (!didInitialCenterRef.current) {
      try {
        map.setCenter(pos);
      } catch {}
      didInitialCenterRef.current = true;
    }

    pannedOnceRef.current = false;
    ensureReadyAndPan(map, pos, markerDef.h);
  }, [sdkLoaded, stores, current]);

  useEffect(
    () => () => {
      for (const id of timeoutsRef.current) window.clearTimeout(id);
      timeoutsRef.current = [];
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
        } catch {}
      }
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
