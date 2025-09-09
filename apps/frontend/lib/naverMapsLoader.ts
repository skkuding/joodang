import type { NaverMapsNamespace } from "@/types/naver";

let naverMapsLoadingPromise: Promise<NaverMapsNamespace> | null = null;

const SCRIPT_ID = "naver-maps-sdk";
const CALLBACK_NAME = "__onNaverMapsReady" as const;

declare global {
  interface Window {
    __onNaverMapsReady?: () => void;
    naver: { maps?: NaverMapsNamespace };
  }
}

export function loadNaverMaps(): Promise<NaverMapsNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Naver Maps can only be loaded in the browser")
    );
  }
  if (window.naver?.maps) {
    return Promise.resolve(window.naver.maps);
  }
  if (naverMapsLoadingPromise) return naverMapsLoadingPromise;

  const ncpKey = process.env.NEXT_PUBLIC_NAVER_ID;
  if (!ncpKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_NAVER_ID env var"));
  }

  naverMapsLoadingPromise = new Promise<NaverMapsNamespace>(
    (resolve, reject) => {
      window.__onNaverMapsReady = () => {
        if (window.naver?.maps) resolve(window.naver.maps);
        else
          reject(
            new Error("Naver Maps loaded but window.naver.maps is undefined")
          );
      };

      const existing = document.getElementById(
        SCRIPT_ID
      ) as HTMLScriptElement | null;
      if (!existing) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.defer = true;
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpKey}&submodules=gl&callback=${CALLBACK_NAME}`;
        script.onerror = () => {
          naverMapsLoadingPromise = null;
          delete window.__onNaverMapsReady;
          reject(new Error("Failed to load Naver Maps script"));
        };
        document.head.appendChild(script);
      }
    }
  );

  return naverMapsLoadingPromise;
}

export function isNaverMapsLoaded(): boolean {
  return !!window.naver?.maps;
}
