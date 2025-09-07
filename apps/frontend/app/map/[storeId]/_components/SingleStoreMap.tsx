"use client";
import type { StoreDetail } from "@/app/type";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

declare global {
  interface Window {
    naver: naver.maps.Map;
  }
}
interface SingleStoreMapProps {
  store: StoreDetail;
}

export default function SingleStoreMap({ store }: SingleStoreMapProps) {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const [myMarker, setMyMarker] = useState<naver.maps.Marker | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!window.naver) return;

    // 지도 생성
    const map = new window.naver.maps.Map("map", {
      gl: true,
      center: new window.naver.maps.LatLng(store.latitude, store.longitude),
      zoom: 15,
      customStyleId: "5ebaa70e-0bc8-4f24-b7a3-6247c307974c",
    });
    mapRef.current = map;

    // 가게 위치 마커
    const storeMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(store.latitude, store.longitude),
      map,
      icon: {
        content: `<div style="display: flex; width: fit-content; flex-direction: column; align-items: center; gap: 4px;  padding: 8px; border-radius: 8px; color: white;">
                    <span style="background-color: rgba(255,255,255,0.1); padding: 4px 12px; font-size: 14px; font-weight: 600;">
                      ${store.name}
                    </span>
                    <img
                      src="/icons/icon_location.svg"
                      alt="pin"
                      width="35"
                      height="35"
                    />
                  </div>`,
      },
    });
    window.naver.maps.Event.addListener(storeMarker, "click", () => {
      map.setZoom(17);
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

    // 내 위치 가져오기
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     const { latitude, longitude } = position.coords;
    //     const myLatLng = new window.naver.maps.LatLng(latitude, longitude);

    //     const marker = new window.naver.maps.Marker({
    //       position: myLatLng,
    //       map,
    //       icon: {
    //         content:
    //           '<div style="width:20px;height:20px;background:red;border-radius:50%;border:2px solid white;"></div>',
    //       },
    //     });
    //     setMyMarker(marker);
    //   });
    // }
    if (navigator.geolocation) {
      // 위치 변화 감지
      const watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const myLatLng = new window.naver.maps.LatLng(latitude, longitude);

          if (!myMarker) {
            // 처음에는 새 마커 생성
            const newMarker = new window.naver.maps.Marker({
              position: myLatLng,
              map,
              icon: {
                content:
                  '<div style="width:20px;height:20px;background:red;border-radius:50%;border:2px solid white;"></div>',
              },
            });
            setMyMarker(newMarker);
          } else {
            // 이후에는 위치만 갱신
            myMarker.setPosition(myLatLng);
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
  }, [store.latitude, store.longitude]);

  // 버튼 클릭 시 내 위치로 이동
  const moveToMyLocation = () => {
    if (mapRef.current && myMarker) {
      mapRef.current.setCenter(myMarker.getPosition() as naver.maps.LatLng);
    }
  };

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl`}
        strategy="beforeInteractive"
      />
      <div className="relative mb-[-100px] mt-[-48px] h-screen w-screen">
        {/* 지도 */}
        <div className="h-full w-full" id="map" />
        <IoIosArrowBack
          className="absolute left-5 top-11 h-6 w-6 text-white"
          onClick={() => {
            router.back();
          }}
        />

        {/* 내 위치 버튼 */}
        <button
          onClick={moveToMyLocation}
          className="absolute bottom-2 right-2 rounded-full bg-[#4A4A4A] shadow-md hover:cursor-pointer"
        >
          <Image
            src="/icons/icon_my_location.svg"
            alt="My Location"
            width={40}
            height={40}
          />
        </button>
      </div>
    </>
  );
}
