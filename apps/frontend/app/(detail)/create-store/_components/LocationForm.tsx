"use client";

import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { useCreateStoreStore } from "@/app/stores/createStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type {
  NaverMapInstance,
  NaverMarkerInstance,
  NaverMapsNamespace,
} from "@/types/naver";
import { loadNaverMaps } from "@/lib/naverMapsLoader";
import { useForm } from "react-hook-form";
import * as v from "valibot";

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
  const mapInstanceRef = useRef<NaverMapInstance | null>(null);
  const markerRef = useRef<NaverMarkerInstance | null>(null);

  const form = useForm<LocationFormData>({
    resolver: valibotResolver(locationFormSchema),
    defaultValues: {
      college: formData.college || "성균관대학교",
      location: formData.location || "",
      latitude: formData.latitude || 37.2931959,
      longitude: formData.longitude || 126.9745929,
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = form;
  const { errors, isValid } = formState;

  // 편집 모드에서 formData 변경 시 폼 리셋 및 맵 상태 반영
  useEffect(() => {
    reset({
      college: formData.college || "성균관대학교",
      location: formData.location || "",
      latitude: formData.latitude || 37.2931959,
      longitude: formData.longitude || 126.9745929,
    });
    setCurrentPosition({
      lat: formData.latitude || 37.2931959,
      lng: formData.longitude || 126.9745929,
    });
  }, [formData, reset]);

  const [sdkLoaded, setSdkLoaded] = useState(false);
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
    if (!sdkLoaded) return;
    const { naver } = window as typeof window & {
      naver?: { maps?: NaverMapsNamespace };
    };
    if (!mapRef.current || !naver?.maps) return;
    if (!mapInstanceRef.current) {
      const centerLat = currentPosition.lat;
      const centerLng = currentPosition.lng;
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(centerLat, centerLng),
        zoom: 16,
        customStyleId: "56e070b5-b8ce-4f3f-90a7-fc9e602ba64c",
        mapTypeControl: false,
        scaleControl: false,
        mapDataControl: false,
        zoomControl: false,
        minZoom: 10,
        maxZoom: 21,
        gl: true,
      });
    }

    const map = mapInstanceRef.current!;

    if (!markerRef.current && formData.latitude && formData.longitude) {
      markerRef.current = new naver.maps.Marker({
        position: new naver.maps.LatLng(formData.latitude, formData.longitude),
        map,
        icon: {
          content: `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">\n  <div style=\"background:#ff4444;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;\">${formData.location || "선택된 위치"}</div>\n  <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"22\" height=\"35\" />\n</div>`,
          anchor: new naver.maps.Point(36.5, 53),
        },
      });
      setIsPositionFixed(true);
      setFixedPosition({ lat: formData.latitude, lng: formData.longitude });
    }

    const handleMapMove = () => {
      const c = map.getCenter ? map.getCenter() : null;
      if (!c) return;
      const newPos = { lat: c.lat(), lng: c.lng() };
      setCurrentPosition(newPos);
      if (!markerRef.current) {
        setValue("latitude", newPos.lat);
        setValue("longitude", newPos.lng);
      }
    };
    const handleMapZoom = () => {
      const c = map.getCenter ? map.getCenter() : null;
      if (!c) return;
      setCurrentPosition({ lat: c.lat(), lng: c.lng() });
    };
    naver.maps.Event.addListener(map, "dragend", handleMapMove);
    naver.maps.Event.addListener(map, "zoom_changed", handleMapZoom);
  }, [
    sdkLoaded,
    currentPosition.lat,
    currentPosition.lng,
    formData.latitude,
    formData.longitude,
    formData.location,
    setValue,
  ]);

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

    const naverMaps = (
      window as typeof window & { naver: { maps: NaverMapsNamespace } }
    ).naver.maps;

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
      const c = mapInstanceRef.current.getCenter
        ? mapInstanceRef.current.getCenter()
        : null;
      if (!c) return;
      const newPosition = { lat: c.lat(), lng: c.lng() };

      // 마커 생성
      const newMarker = new naverMaps.Marker({
        position: new naverMaps.LatLng(newPosition.lat, newPosition.lng),
        map: mapInstanceRef.current!,
        icon: {
          content: `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">\n  <div style=\"background:#FF5940;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;\">위치 고정됨</div>\n  <img src=\"/icons/icon_location.svg\" alt=\"pin\" width=\"22\" height=\"35\" />\n</div>`,
          anchor: new naverMaps.Point(36.5, 53),
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-primary-normal mb-[2px] text-xs">3단계</div>
        <div className="mb-10 text-xl font-medium">
          위치 정보를 입력해주세요
        </div>

        <div className="mb-15 space-y-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <label className="font-medium">학교 선택</label>
            </div>
            <Select
              value={watch("college")}
              onValueChange={value => setValue("college", value)}
            >
              <SelectTrigger className="mt-2 h-[52px] p-4 text-sm">
                <SelectValue placeholder="학교를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="성균관대학교"
                  className="focus:bg-primary-normal/10 px-4 py-[14px] text-sm"
                >
                  성균관대학교
                </SelectItem>
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
              <label className="font-medium">주점 위치</label>
            </div>
            <p className="text-color-neutral-50 mb-4 text-xs">
              상세 위치는 최대 20자까지 등록 가능합니다
            </p>
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
                "bg-primary-normal hover:bg-primary-normal/90 w-full rounded-md px-4 py-[14px] text-sm font-medium text-white transition-colors"
              )}
            >
              {isPositionFixed ? "위치 고정 해제" : "위치 고정"}
            </button>
            <div className="space-y-2 pt-1">
              <Input
                {...register("location")}
                placeholder="상세 위치를 입력해주세요"
                maxLength={20}
                className="h-[49px] px-4 text-sm"
              />
              {errors.location && (
                <p className="text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* 상세 위치 입력 */}
        </div>

        <FloatingBottomBar>
          <Button type="submit" disabled={!isValid}>
            다음
          </Button>
        </FloatingBottomBar>
      </form>
    </>
  );
}
