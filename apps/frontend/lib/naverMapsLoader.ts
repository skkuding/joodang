import type { NaverMapsNamespace } from "@/types/naver";

// Single-flight promise holder to avoid duplicate script injections
let naverMapsLoadingPromise: Promise<NaverMapsNamespace> | null = null;

const SCRIPT_ID = "naver-maps-sdk";
const CALLBACK_NAME = "__onNaverMapsReady"; // global callback required by Naver script

declare global {
  interface Window {
    [CALLBACK_NAME]?: () => void; // dynamically referenced
    naver: { maps?: NaverMapsNamespace };
  }
}

export function loadNaverMaps(): Promise<NaverMapsNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Naver Maps can only be loaded in the browser"));
  }
  if (window.naver?.maps) {
    // Already available
    return Promise.resolve(window.naver.maps);
  }
  if (naverMapsLoadingPromise) return naverMapsLoadingPromise;

  const ncpKey = process.env.NEXT_PUBLIC_NAVER_ID;
  if (!ncpKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_NAVER_ID env var"));
  }

  naverMapsLoadingPromise = new Promise<NaverMapsNamespace>((resolve, reject) => {
    // Define the callback the SDK will invoke
    (window as any)[CALLBACK_NAME] = () => {
      if (window.naver?.maps) resolve(window.naver.maps);
      else reject(new Error("Naver Maps loaded but window.naver.maps is undefined"));
    };

    // Reuse existing script tag if present (e.g., another component already appended it)
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.defer = true;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpKey}&submodules=gl&callback=${CALLBACK_NAME}`;
      script.onerror = () => {
        naverMapsLoadingPromise = null; // allow retry
        delete (window as any)[CALLBACK_NAME];
        reject(new Error("Failed to load Naver Maps script"));
      };
      document.head.appendChild(script);
    }
  });

  return naverMapsLoadingPromise;
}

export function isNaverMapsLoaded(): boolean {
  return !!window.naver?.maps;
}
