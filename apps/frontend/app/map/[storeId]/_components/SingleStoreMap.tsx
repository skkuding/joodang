"use client";
import type { StoreDetail } from "@/app/type";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { StoreDrawer } from "./StoreDrawer";
import type { NaverMapInstance, NaverMarkerInstance } from "@/types/naver";
interface SingleStoreMapProps {
  store: StoreDetail;
}

export default function SingleStoreMap({ store }: SingleStoreMapProps) {
  const mapRef = useRef<NaverMapInstance | null>(null);
  const myMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!window.naver) return;

    // 지도 생성
    const map = new window.naver.maps.Map("map", {
      gl: true,
      center: new window.naver.maps.LatLng(store.latitude, store.longitude),
      zoom: 16,
      customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
    });
    mapRef.current = map;

    // 가게 위치 마커
    function buildIconHTML(name: string) {
      return `
        <div class="store-marker" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border-radius:8px;color:white;pointer-events:none;">
          <span style="background-color:rgba(255,255,255,0.1);padding:4px 12px;font-size:14px;font-weight:600;white-space:nowrap;">
            ${name}
          </span>
          <img src="/icons/icon_location.svg" alt="pin" width="35" height="35" style="display:block;" />
        </div>`;
    }

    function measureHTML(html: string) {
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
    }

    // storeMarker 생성 부분 대체
    const iconHtml = buildIconHTML(store.name);
    const measured = measureHTML(iconHtml);

    const storeMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(store.latitude, store.longitude),
      map,
      icon: {
        content: measured.html,
        // 하단 중앙이 좌표에 오도록 설정
        anchor: new window.naver.maps.Point(
          Math.round(measured.width / 2),
          measured.height
        ),
      },
    });
    window.naver.maps.Event.addListener(storeMarker, "click", () => {
      map.setZoom(16);
      map.setCenter(
        new window.naver.maps.LatLng(store.latitude, store.longitude)
      );
    });
    const storeLatLng = new window.naver.maps.LatLng(
      store.latitude,
      store.longitude
    );
    window.naver.maps.Event.once(map, "idle", () => {
      const projection = map.getProjection();
      if (projection) {
        const point = projection.fromCoordToOffset(storeLatLng);
        const mapSize = map.getSize();

        // 화면 높이의 1/3 만큼 y 좌표를 아래로 내려줌
        const newPoint = new window.naver.maps.Point(
          point.x,
          point.y + mapSize.height / 3
        );

        const newCenter = projection.fromOffsetToCoord(newPoint);
        map.setCenter(newCenter);
      }
    });

    if (navigator.geolocation) {
      // 위치 변화 감지
      const watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const myLatLng = new window.naver.maps.LatLng(latitude, longitude);

          const currentMarker = myMarkerRef.current;
          if (!currentMarker) {
            // 처음에는 새 마커 생성
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
            // 이후에는 위치만 갱신
            currentMarker.setPosition(myLatLng);
          }
        },
        error => {
          console.error("위치 추적 오류:", error);
        },
        {
          enableHighAccuracy: true, // GPS 정확도 우선
          maximumAge: 0,
          timeout: 5000,
        }
      );

      // cleanup (컴포넌트 언마운트 시 위치 추적 중단)
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [store.latitude, store.longitude, store.name]);

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
      <div className="relative mb-[-100px] mt-[-48px] h-dvh w-screen">
        {/* 지도 */}
        <div className="h-full w-full" id="map" />
        <IoIosArrowBack
          className="absolute left-5 top-11 h-6 w-6 text-white"
          onClick={() => {
            router.back();
          }}
        />

        <StoreDrawer store={store} mylocationfunc={moveToMyLocation} />
      </div>
    </>
  );
}
