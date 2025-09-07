// Shared minimal Naver Maps typings
export type NaverLatLng = object;
export type NaverPoint = { x: number; y: number };

export interface NaverMapInstance {
  setCenter(latlng: NaverLatLng): void;
  panTo?(latlng: NaverLatLng): void;
  setZoom(zoom: number): void;
  getProjection():
    | {
        fromCoordToOffset(latlng: NaverLatLng): NaverPoint;
        fromOffsetToCoord(pt: NaverPoint): NaverLatLng;
      }
    | null;
  getSize(): { width: number; height: number };
}

export interface NaverMarkerInstance {
  setPosition(latlng: NaverLatLng): void;
  setIcon(icon: { content: string; anchor: NaverPoint }): void;
  getMap(): NaverMapInstance | null;
  setMap(map: NaverMapInstance | null): void;
  getPosition(): NaverLatLng;
}

export interface NaverMapsNamespace {
  Map: new (
    el: string | HTMLElement,
    options: {
      gl?: boolean;
      center: NaverLatLng;
      zoom: number;
      customStyleId?: string;
    },
  ) => NaverMapInstance;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Point: new (x: number, y: number) => NaverPoint;
  Marker: new (opts: {
    position: NaverLatLng;
    map: NaverMapInstance;
  icon: { content: string; anchor?: NaverPoint };
  }) => NaverMarkerInstance;
  Event: {
    addListener: (
      target: unknown,
      eventName: string,
      handler: (...args: unknown[]) => void,
    ) => void;
    once: (
      target: unknown,
      eventName: string,
      handler: (...args: unknown[]) => void,
    ) => void;
  };
}

declare global {
  interface Window {
    naver: {
      maps?: {
        Map: NaverMapsNamespace['Map'];
        LatLng: NaverMapsNamespace['LatLng'];
        Point: NaverMapsNamespace['Point'];
  Marker: NaverMapsNamespace['Marker'];
  Event: NaverMapsNamespace['Event'];
      };
    };
  }
}

export {};
