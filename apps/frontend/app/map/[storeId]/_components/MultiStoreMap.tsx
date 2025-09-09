"use client";
import type { Store } from "@/app/type";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MultiStoreDrawer } from "./MultiStoreDrawer";
import type { NaverMapInstance, NaverMarkerInstance } from "@/types/naver";
import { useSelectedStore } from "@/app/stores/useSelectedStore";
interface MultiStoreMapProps {
  stores: Store[];
}

export default function MultiStoreMap({ stores }: MultiStoreMapProps) {
  const selectedStoreId = useSelectedStore(state => state.selectedStoreId);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const storeMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const myMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!window.naver) return;
    if (stores.length === 0) return;

    const initialStore =
      stores.find(s => s.id === selectedStoreId) ?? stores[0];

    const map = new window.naver.maps.Map("map", {
      gl: true,
      center: new window.naver.maps.LatLng(
        initialStore.latitude,
        initialStore.longitude
      ),
      zoom: 16,
      customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
    });
    mapRef.current = map;

    // 가게 마커 생성
    const buildIconHTML = (name: string) => `
      <div class="store-marker" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border-radius:8px;color:white;pointer-events:none;">
        <span style="background-color:rgba(255,255,255,0.1);padding:4px 12px;font-size:14px;font-weight:600;white-space:nowrap;">
          ${name}
        </span>
        <img src="/icons/icon_location.svg" alt="pin" width="35" height="35" style="display:block;" />
      </div>`;

    const measureHTML = (html: string) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      const el = wrapper.firstElementChild as HTMLElement;
      const rect = el.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      document.body.removeChild(wrapper);
      return { html, width, height };
    };

    const iconHtml = buildIconHTML(initialStore.name);
    const measured = measureHTML(iconHtml);

    const storeMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        initialStore.latitude,
        initialStore.longitude
      ),
      map,
      icon: {
        content: measured.html,
        anchor: new window.naver.maps.Point(
          Math.round(measured.width / 2),
          measured.height
        ),
      },
    });
    storeMarkerRef.current = storeMarker;

    // 지도 중심 보정 (상단 1/3 지점)
    const storeLatLng = new window.naver.maps.LatLng(
      initialStore.latitude,
      initialStore.longitude
    );
    window.naver.maps.Event.once(map, "idle", () => {
      const projection = map.getProjection();
      if (projection) {
        const point = projection.fromCoordToOffset(storeLatLng);
        const mapSize = map.getSize();

        const newPoint = new window.naver.maps.Point(
          point.x,
          point.y + mapSize.height / 3
        );
        const newCenter = projection.fromOffsetToCoord(newPoint);
        map.setCenter(newCenter);
      }
    });

    // 내 위치 마커 생성 및 업데이트
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const myLatLng = new window.naver.maps.LatLng(latitude, longitude);

          if (!myMarkerRef.current) {
            const newMarker = new window.naver.maps.Marker({
              position: myLatLng,
              map,
              icon: {
                content:
                  '<div style="width:20px;height:20px;background:red;border-radius:50%;border:2px solid white;"></div>',
              },
            });
            myMarkerRef.current = newMarker;
          } else {
            myMarkerRef.current.setPosition(myLatLng);
          }
        },
        error => {
          console.error("위치 추적 오류:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [stores]);

  // 선택된 가게가 바뀔 때만 마커/센터 이동
  useEffect(() => {
    if (!mapRef.current || !storeMarkerRef.current || stores.length === 0)
      return;

    const store = stores.find(s => s.id === selectedStoreId) ?? stores[0];

    const iconHtml = `
      <div class="store-marker" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border-radius:8px;color:white;pointer-events:none;">
        <span style="background-color:rgba(255,255,255,0.1);padding:4px 12px;font-size:14px;font-weight:600;white-space:nowrap;">
          ${store.name}
        </span>
        <img src="/icons/icon_location.svg" alt="pin" width="35" height="35" style="display:block;" />
      </div>`;

    const measured = (() => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = "-9999px";
      wrapper.innerHTML = iconHtml;
      document.body.appendChild(wrapper);
      const rect = wrapper.firstElementChild!.getBoundingClientRect();
      document.body.removeChild(wrapper);
      return { html: iconHtml, width: rect.width, height: rect.height };
    })();

    // 마커 아이콘과 위치 갱신
    storeMarkerRef.current.setIcon({
      content: measured.html,
      anchor: new window.naver.maps.Point(
        Math.round(measured.width / 2),
        measured.height
      ),
    });
    const newLatLng = new window.naver.maps.LatLng(
      store.latitude,
      store.longitude
    );
    storeMarkerRef.current.setPosition(newLatLng);
    const projection = mapRef.current.getProjection();
    if (projection) {
      const point = projection.fromCoordToOffset(newLatLng);
      const mapSize = mapRef.current.getSize();

      const newPoint = new window.naver.maps.Point(
        point.x,
        point.y + mapSize.height / 3
      );
      const newCenter = projection.fromOffsetToCoord(newPoint);
      mapRef.current.setCenter(newCenter);
    }
  }, [selectedStoreId, stores]);

  // 버튼 클릭 시 내 위치로 이동
  const moveToMyLocation = () => {
    if (mapRef.current && myMarkerRef.current) {
      mapRef.current.setCenter(myMarkerRef.current.getPosition());
    }
  };

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl`}
        strategy="beforeInteractive"
      />
      <div className="relative mb-[-100px] mt-[-88px] h-dvh w-screen">
        {/* 지도 */}
        <div className="h-full w-full" id="map" />
        <IoIosArrowBack
          className="absolute left-5 top-11 h-6 w-6 text-white"
          onClick={() => {
            router.back();
          }}
        />

        <MultiStoreDrawer stores={stores} mylocationfunc={moveToMyLocation} />
      </div>
    </>
  );
}
