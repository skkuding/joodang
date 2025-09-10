"use client";

import type { Store } from "@/app/type";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MultiStoreDrawer } from "./MultiStoreDrawer";
import type {
  NaverMapInstance,
  NaverMarkerInstance,
  NaverLatLng,
} from "@/types/naver";
import { loadNaverMaps } from "@/lib/naverMapsLoader";
import { useSelectedStore } from "@/app/stores/useSelectedStore";

interface MultiStoreMapProps {
  stores: Store[];
}

export default function MultiStoreMap({ stores }: MultiStoreMapProps) {
  const STYLE_ID = "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c";
  const markerHeightRef = useRef<number>(0);
  const computeCenterFor = (
    pos: NaverLatLng,
    map: NaverMapInstance
  ): NaverLatLng => {
    const { naver } = window;
    const proj = map.getProjection();
    if (!proj) return pos; // fallback
    const mapSize = map.getSize();
    const mapEl = mapDivRef.current;
    const drawer = document.querySelector<HTMLElement>(
      "[data-map-overlay-height]"
    );
    let overlapPx = 0;
    if (drawer && mapEl) {
      const mapRect = mapEl.getBoundingClientRect();
      const drawerRect = drawer.getBoundingClientRect();
      overlapPx = Math.max(0, mapRect.bottom - drawerRect.top);
      overlapPx = Math.min(overlapPx, mapSize.height * 0.9);
    }
    const pt = proj.fromCoordToOffset(pos);
    const markerShift = markerHeightRef.current * 0.35;
    const desiredOffsetY = -overlapPx / 2 + markerShift;
    const deltaPoint = new naver.maps.Point(pt.x, pt.y - desiredOffsetY);
    return proj.fromOffsetToCoord(deltaPoint);
  };
  const selectedStoreId = useSelectedStore(s => s.selectedStoreId);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const storeMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const myMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const router = useRouter();

  const panToAdjustedCenter = (pos: NaverLatLng) => {
    if (!mapRef.current) return;
    const adjusted = computeCenterFor(pos, mapRef.current);
    try {
      mapRef.current.panTo(adjusted);
    } catch {
      mapRef.current.setCenter(adjusted);
    }
  };

  useEffect(() => {
    let active = true;
    loadNaverMaps()
      .then(() => active && setSdkLoaded(true))
      .catch(e => console.warn("Failed to load Naver Maps", e));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !mapDivRef.current || stores.length === 0) return;
    const { naver } = window;
    if (!naver?.maps) return;
    const initialStore =
      stores.find(s => s.id === selectedStoreId) ?? stores[0];
    const center = new naver.maps.LatLng(
      initialStore.latitude,
      initialStore.longitude
    );

    if (!mapRef.current) {
      const tempMap = new naver.maps.Map(mapDivRef.current, {
        center,
        zoom: 16,
        customStyleId: STYLE_ID,
        gl: true,
      });
      mapRef.current = tempMap;
    }

    const buildMarkerHTML = (
      name: string
    ) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border-radius:8px;color:white;pointer-events:none;">
  <span style=\"background:rgba(255,255,255,0.1);padding:4px 12px;font-size:14px;font-weight:600;white-space:nowrap;\">${name}</span>
  <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"35\" height=\"35\" />
</div>`;
    const measure = (html: string) => {
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:absolute;left:-9999px;top:0;";
      wrap.innerHTML = html;
      document.body.appendChild(wrap);
      const rect = wrap.firstElementChild!.getBoundingClientRect();
      document.body.removeChild(wrap);
      return { html, w: Math.round(rect.width), h: Math.round(rect.height) };
    };
    if (!storeMarkerRef.current) {
      const { naver } = window;
      const m = measure(buildMarkerHTML(initialStore.name));
      markerHeightRef.current = m.h;
      const bottomPadding = 8;
      storeMarkerRef.current = new naver.maps.Marker({
        position: center,
        map: mapRef.current!,
        icon: {
          content: m.html,
          anchor: new naver.maps.Point(
            Math.round(m.w / 2),
            Math.max(0, m.h - bottomPadding)
          ),
        },
      });
      naver.maps.Event.once(mapRef.current!, "idle", () => {
        panToAdjustedCenter(center);
      });
    }

    if (navigator.geolocation && geoWatchIdRef.current === null) {
      geoWatchIdRef.current = navigator.geolocation.watchPosition(
        pos => {
          const myPos = new naver.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
          );
          if (!myMarkerRef.current) {
            const content =
              '<div style="width:20px;height:20px;background:#ff3b30;border-radius:50%;border:2px solid white;"></div>';
            const size = 20;
            myMarkerRef.current = new naver.maps.Marker({
              position: myPos,
              map: mapRef.current!,
              icon: {
                content,
                anchor: new naver.maps.Point(size / 2, size / 2),
              },
            });
          } else myMarkerRef.current.setPosition(myPos);
        },
        err => console.warn("geo watch error", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
    return () => {
      if (geoWatchIdRef.current !== null)
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
    };
  }, [sdkLoaded, stores, selectedStoreId]);

  useEffect(() => {
    if (!mapRef.current || !storeMarkerRef.current || stores.length === 0)
      return;
    const { naver } = window;
    const store = stores.find(s => s.id === selectedStoreId) ?? stores[0];
    const pos = new naver.maps.LatLng(store.latitude, store.longitude);

    const html = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border-radius:8px;color:white;pointer-events:none;">
  <span style=\"background:rgba(255,255,255,0.1);padding:4px 12px;font-size:14px;font-weight:600;white-space:nowrap;\">${store.name}</span>
  <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"35\" height=\"35\" />
</div>`;
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:absolute;left:-9999px;top:0;";
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
    const r = wrap.firstElementChild!.getBoundingClientRect();
    document.body.removeChild(wrap);
    const bottomPadding = 8;
    storeMarkerRef.current.setIcon({
      content: html,
      anchor: new naver.maps.Point(
        Math.round(r.width / 2),
        Math.max(0, r.height - bottomPadding)
      ),
    });
    markerHeightRef.current = r.height;
    storeMarkerRef.current.setPosition(pos);

    panToAdjustedCenter(pos);
  }, [selectedStoreId, stores]);

  const moveToMyLocation = () => {
    if (!mapRef.current || !myMarkerRef.current) return;
    const { naver } = window;
    const pos = myMarkerRef.current.getPosition();
    const proj = mapRef.current.getProjection();
    if (!proj) return;
    const mapEl = mapDivRef.current;
    const drawer = document.querySelector<HTMLElement>(
      "[data-map-overlay-height]"
    );
    let overlapPx = 0;
    if (drawer && mapEl) {
      const mapRect = mapEl.getBoundingClientRect();
      const drawerRect = drawer.getBoundingClientRect();
      overlapPx = Math.max(0, mapRect.bottom - drawerRect.top);
      overlapPx = Math.min(overlapPx, mapRef.current.getSize().height * 0.9);
    }
    const pt = proj.fromCoordToOffset(pos);
    const desiredOffsetY = -overlapPx / 2;
    const adj = proj.fromOffsetToCoord(
      new naver.maps.Point(pt.x, pt.y - desiredOffsetY)
    );
    try {
      mapRef.current.panTo(adj);
    } catch {
      mapRef.current.setCenter(adj);
    }
  };

  return (
    <div className="relative mb-[-100px] mt-[-88px] h-dvh w-screen">
      <div ref={mapDivRef} className="h-full w-full" />
      <IoIosArrowBack
        className="absolute left-5 top-11 h-6 w-6 text-white"
        onClick={() => router.back()}
      />
      <MultiStoreDrawer stores={stores} mylocationfunc={moveToMyLocation} />
    </div>
  );
}
