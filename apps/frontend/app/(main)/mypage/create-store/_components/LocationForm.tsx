"use client";

import { useCreateStoreStore } from "@/app/stores/createStore";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Script from "next/script";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 네이버 지도 API 타입 정의
interface NaverMap {
  getCenter(): { lat(): number; lng(): number };
  setCenter(position: NaverLatLng): void;
}

interface NaverLatLng {
  lat(): number;
  lng(): number;
}

interface NaverMarker {
  setMap(map: NaverMap | null): void;
}

interface NaverMaps {
  Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMap;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Point: new (x: number, y: number) => { x: number; y: number };
  Marker: new (options: NaverMarkerOptions) => NaverMarker;
  Event: {
    addListener: (
      target: NaverMap,
      event: string,
      listener: () => void
    ) => void;
  };
}

interface NaverMarkerOptions {
  position: NaverLatLng;
  map: NaverMap;
  icon?: {
    content: string;
    anchor?: { x: number; y: number };
  };
}

interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
  mapTypeControl: boolean;
  scaleControl: boolean;
  logoControl: boolean;
  mapDataControl: boolean;
  zoomControl: boolean;
  minZoom: number;
  maxZoom: number;
}

const locationFormSchema = v.object({
  college: v.pipe(v.string(), v.minLength(1, "학교를 선택해주세요")),
  location: v.pipe(
    v.string(),
    v.minLength(1, "위치를 선택해주세요"),
    v.maxLength(20, "상세 위치는 최대 20자까지 입력 가능합니다")
  ),
  latitude: v.number(),
  longitude: v.number(),
});

type LocationFormData = {
  college: string;
  location: string;
  latitude: number;
  longitude: number;
};

// interface PlaceResult {
//   title: string;
//   address: string;
//   roadAddress: string;
//   mapx: string;
//   mapy: string;
// }

export default function LocationForm() {
  const { formData, setFormData, nextModal } = useCreateStoreStore(
    state => state
  );

  // const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  // const [map, setMap] = useState<any>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: formData.latitude || 37.2931959,
    lng: formData.longitude || 126.9745929,
  });
  const [isPositionFixed, setIsPositionFixed] = useState<boolean>(false);
  const [fixedPosition, setFixedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMap | null>(null);
  const markerRef = useRef<NaverMarker | null>(null);

  const form = useForm<LocationFormData>({
    resolver: valibotResolver(locationFormSchema),
    defaultValues: {
      college: formData.college || "성균관대학교",
      location: formData.location || "",
      latitude: formData.latitude || 37.2931959,
      longitude: formData.longitude || 126.9745929,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  // 네이버 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (
      !mapRef.current ||
      !(window as unknown as { naver: { maps: NaverMaps } }).naver?.maps
    )
      return;

    const naverMaps = (window as unknown as { naver: { maps: NaverMaps } })
      .naver.maps;
    const centerLat = currentPosition.lat;
    const centerLng = currentPosition.lng;

    const naverMap = new naverMaps.Map(mapRef.current, {
      center: new naverMaps.LatLng(centerLat, centerLng),
      zoom: 15,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
      zoomControl: true,
      minZoom: 10,
      maxZoom: 21,
    });

    mapInstanceRef.current = naverMap;

    // 기존 위치가 있으면 마커 표시
    if (formData.latitude && formData.longitude) {
      const existingMarker = new naverMaps.Marker({
        position: new naverMaps.LatLng(formData.latitude, formData.longitude),
        map: naverMap,
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="background-color: #ff4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                ${formData.location || "선택된 위치"}
              </div>
              <img src="/icons/icon_location.svg" alt="pin" width="22" height="35" />
            </div>
          `,
          anchor: new naverMaps.Point(36.5, 53), // 마커의 앵커 포인트 설정 (이미지 하단 중앙)
        },
      });
      markerRef.current = existingMarker;
      setIsPositionFixed(true);
      setFixedPosition({
        lat: formData.latitude,
        lng: formData.longitude,
      });
    }

    // 지도 이동 이벤트 리스너 추가
    const handleMapMove = () => {
      const center = naverMap.getCenter();
      const newPosition = {
        lat: center.lat(),
        lng: center.lng(),
      };
      setCurrentPosition(newPosition);

      // 마커가 없는 경우에만 폼 값 업데이트 (위치가 고정되지 않은 상태)
      if (!markerRef.current) {
        setValue("latitude", newPosition.lat);
        setValue("longitude", newPosition.lng);
      }
    };

    // 지도 확대/축소 이벤트 리스너
    const handleMapZoom = () => {
      const center = naverMap.getCenter();
      const newPosition = {
        lat: center.lat(),
        lng: center.lng(),
      };
      setCurrentPosition(newPosition);
      // 확대/축소 시에는 폼 값을 업데이트하지 않음 (마커 위치 유지)
    };

    // 지도 이동이 끝났을 때 이벤트
    naverMaps.Event.addListener(naverMap, "dragend", handleMapMove);
    naverMaps.Event.addListener(naverMap, "zoom_changed", handleMapZoom);
  }, []); // 의존성 배열을 빈 배열로 변경하여 한 번만 실행

  // 위치 고정 상태가 변경될 때 폼 유효성 업데이트
  useEffect(() => {
    if (isPositionFixed && fixedPosition) {
      setValue("latitude", fixedPosition.lat);
      setValue("longitude", fixedPosition.lng);
    }
  }, [isPositionFixed, fixedPosition, setValue]);

  // 장소 검색 함수 (주석처리)
  // const searchPlaces = async (query: string) => {
  //   if (!query.trim()) {
  //     setSearchResults([]);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
  //         query
  //       )}&display=5&start=1&sort=random`,
  //       {
  //         headers: {
  //           "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_ID || "",
  //           "X-Naver-Client-Secret": process.env.NEXT_PUBLIC_NAVER_SECRET || "",
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSearchResults(data.items || []);
  //     }
  //   } catch (error) {
  //     console.error("장소 검색 오류:", error);
  //   }
  // };

  // 검색어 변경 시 검색 실행 (주석처리)
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     searchPlaces(searchQuery);
  //   }, 300);

  //   return () => clearTimeout(timeoutId);
  // }, [searchQuery]);

  // HTML 태그 제거 함수 (주석처리)
  // const removeHtmlTags = (str: string) => {
  //   return str.replace(/<[^>]*>/g, "");
  // };

  // 장소 선택 처리 (주석처리)
  // const handlePlaceSelect = (place: PlaceResult) => {
  //   const cleanTitle = removeHtmlTags(place.title);
  //   setSearchQuery(cleanTitle);
  //   setSearchResults([]);

  //   // 좌표 변환 (네이버 API는 TM 좌표계를 사용하므로 WGS84로 변환 필요)
  //   const lat = parseFloat(place.mapy);
  //   const lng = parseFloat(place.mapx);

  //   // form 값 업데이트
  //   setValue("location", cleanTitle);
  //   setValue("latitude", lat);
  //   setValue("longitude", lng);

  //   // 지도 중심 이동 및 마커 표시
  //   if (map) {
  //     const newPosition = new window.naver.maps.LatLng(lat, lng);
  //     map.setCenter(newPosition);

  //     // 기존 마커 제거
  //     if (marker) {
  //       marker.setMap(null);
  //     }

  //     // 새 마커 추가
  //     const newMarker = new window.naver.maps.Marker({
  //       position: newPosition,
  //       map: map,
  //       icon: {
  //         content: `
  //           <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
  //             <div style="background-color: #ff4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
  //               ${cleanTitle}
  //             </div>
  //             <img src="/icons/icon_location.svg" alt="pin" width="22" height="35" />
  //           </div>
  //         `,
  //       },
  //     });
  //     setMarker(newMarker);
  //   }
  // };

  // 위치 고정/해제 함수
  const handlePositionToggle = () => {
    if (!mapInstanceRef.current) return;

    const naverMaps = (window as unknown as { naver: { maps: NaverMaps } })
      .naver.maps;

    if (isPositionFixed) {
      // 위치 고정 해제
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      setIsPositionFixed(false);
      setFixedPosition(null);
    } else {
      // 위치 고정
      const center = mapInstanceRef.current.getCenter();
      const newPosition = {
        lat: center.lat(),
        lng: center.lng(),
      };

      // 마커 생성
      const newMarker = new naverMaps.Marker({
        position: new naverMaps.LatLng(newPosition.lat, newPosition.lng),
        map: mapInstanceRef.current,
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="background-color: #FF5940; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                위치 고정됨
              </div>
              <img src="/icons/icon_location.svg" alt="pin" width="22" height="35" />
            </div>
          `,
          anchor: new naverMaps.Point(36.5, 53), // 마커의 앵커 포인트 설정 (이미지 하단 중앙)
        },
      });

      markerRef.current = newMarker;
      setIsPositionFixed(true);
      setFixedPosition(newPosition);
      setValue("latitude", newPosition.lat);
      setValue("longitude", newPosition.lng);
    }
  };

  const onSubmit = (data: LocationFormData) => {
    setFormData({ ...formData, ...data });
    nextModal();
  };

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=gl`}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-primary-normal mb-[2px] text-xs">3단계</div>
        <div className="mb-10 text-xl font-medium">주점 위치</div>
        <div className="text-color-neutral-50 mb-4 text-xs">
          상세 위치는 최대 20자까지 등록 가능합니다
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <label className="font-medium">학교 선택</label>
            </div>
            <Select
              value={watch("college")}
              onValueChange={value => setValue("college", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="학교를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="성균관대학교">성균관대학교</SelectItem>
              </SelectContent>
            </Select>
            {errors.college && (
              <p className="mt-1 text-xs text-red-500">
                {errors.college.message}
              </p>
            )}
          </div>

          {/* 지도 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <label className="font-medium">위치 선택</label>
            </div>
            <div className="relative">
              <div
                ref={mapRef}
                className="h-[300px] w-full rounded-md border"
                style={{ minHeight: "300px" }}
              />
              {/* 중앙에 고정된 핀 - 위치가 고정되지 않은 경우에만 표시 */}
              {!isPositionFixed && (
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
                  <div className="flex flex-col items-center">
                    <div className="bg-primary-normal mb-1 rounded px-2 py-1 text-xs font-medium text-white">
                      위치 선택
                    </div>
                    <Image
                      src="/icons/icon_location.svg"
                      alt="pin"
                      width="22"
                      height="35"
                      className="drop-shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="text-color-neutral-50 text-xs">
              지도를 움직여서 원하는 위치를 선택하세요
            </div>
            {/* 위치 고정 버튼 */}
            <button
              type="button"
              onClick={handlePositionToggle}
              className={cn(
                "bg-primary-normal hover:bg-primary-normal/90 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
              )}
            >
              {isPositionFixed ? "위치 고정 해제" : "위치 고정"}
            </button>
          </div>

          {/* 상세 위치 입력 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <label className="font-medium">상세 위치</label>
            </div>
            <Input
              {...register("location")}
              placeholder="상세 위치를 입력해주세요"
              maxLength={20}
            />
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 flex h-[84px] bg-white px-5 py-4">
          <button
            type="submit"
            className={cn(
              "w-full rounded-md",
              isValid
                ? "bg-primary-normal text-white"
                : "bg-color-neutral-95 text-color-neutral-70"
            )}
            disabled={!isValid}
          >
            다음
          </button>
        </div>
      </form>
    </>
  );
}
