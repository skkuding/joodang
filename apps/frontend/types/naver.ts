// Refined minimal Naver Maps typings (subset tailored to current usage)

export interface NaverLatLng {
  lat(): number;
  lng(): number;
}

export interface NaverPoint {
  x: number;
  y: number;
}

export interface NaverProjection {
  fromCoordToOffset(latlng: NaverLatLng): NaverPoint;
  fromOffsetToCoord(pt: NaverPoint): NaverLatLng;
}

export interface NaverMapOptions {
  gl?: boolean;
  center: NaverLatLng;
  zoom: number;
  customStyleId?: string;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  logoControl?: boolean;
  mapDataControl?: boolean;
  zoomControl?: boolean;
  minZoom?: number;
  maxZoom?: number;
}

export interface NaverMapInstance {
  setCenter(latlng: NaverLatLng): void;
  panTo(latlng: NaverLatLng): void;
  setZoom(zoom: number): void;
  setOptions(
    options: Partial<NaverMapOptions> & { center?: NaverLatLng }
  ): void;
  getProjection(): NaverProjection | null;
  getSize(): { width: number; height: number };
  getCenter(): NaverLatLng;
  getZoom(): number;
}

export interface NaverMarkerIcon {
  content: string;
  anchor?: NaverPoint;
}

export interface NaverMarkerInstance {
  setPosition(latlng: NaverLatLng): void;
  setIcon(icon: NaverMarkerIcon): void;
  getMap(): NaverMapInstance | null;
  setMap(map: NaverMapInstance | null): void;
  getPosition(): NaverLatLng;
}

export interface NaverMapsEvent {
  addListener(
    target: unknown,
    eventName: string,
    handler: (...args: unknown[]) => void
  ): void;
  once(
    target: unknown,
    eventName: string,
    handler: (...args: unknown[]) => void
  ): void;
}

export interface NaverMapsNamespace {
  Map: new (
    el: string | HTMLElement,
    options: NaverMapOptions
  ) => NaverMapInstance;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Point: new (x: number, y: number) => NaverPoint;
  Marker: new (opts: {
    position: NaverLatLng;
    map: NaverMapInstance;
    icon: NaverMarkerIcon;
  }) => NaverMarkerInstance;
  Event: NaverMapsEvent;
}

declare global {
  interface Window {
    naver: {
      maps?: NaverMapsNamespace;
    };
  }
}

export {};
