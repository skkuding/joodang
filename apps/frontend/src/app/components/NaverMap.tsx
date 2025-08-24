// 'use client';

// import { useEffect, useRef, useState } from 'react';

// declare global {
//   interface Window {
//     naver: typeof naver;
//   }
// }

// function loadNaverScript(clientId: string, submodules: string[] = []) {
//   // 중복 삽입 방지
//   const exists = document.querySelector('script[data-navermap]');
//   if (exists) return Promise.resolve();

//   return new Promise<void>((resolve, reject) => {
//     const s = document.createElement('script');
//     const params = new URLSearchParams({ ncpClientId: clientId });
//     if (submodules.length) params.set('submodules', submodules.join(','));
//     s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${params.toString()}`;
//     s.async = true;
//     s.defer = true;
//     s.dataset.navermap = 'true';
//     s.onload = () => resolve();
//     s.onerror = () => reject(new Error('Failed to load Naver Maps script'));
//     document.head.appendChild(s);
//   });
// }

// export default function NaverMap() {
//   const mapRef = useRef<HTMLDivElement | null>(null);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const id = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID;
//     if (!id) {
//       console.error('Missing NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID');
//       return;
//     }
//     // 필요 시 ['geocoder', 'drawing', 'visualization', 'panorama'] 등 서브모듈 추가
//     loadNaverScript(id, [])
//       .then(() => setReady(true))
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!ready || !mapRef.current || !window.naver) return;

//     const { naver } = window;

//     // 튜토리얼처럼 기본 옵션으로 생성
//     const center = new naver.maps.LatLng(37.5665, 126.978); // 서울 시청
//     const map = new naver.maps.Map(mapRef.current, {
//       center,
//       zoom: 13,
//       mapDataControl: false, // 우측 하단 데이터 컨트롤 숨김 예시
//     });

//     // 마커 예시 (튜토리얼의 Marker)
//     const marker = new naver.maps.Marker({
//       position: center,
//       map,
//       title: 'Seoul City Hall',
//     });

//     // 인포윈도우 예시
//     const info = new naver.maps.InfoWindow({
//       content: `<div style="padding:8px;">안녕, 네이버 지도!</div>`,
//     });
//     naver.maps.Event.addListener(marker, 'click', () => {
//       info.getMap() ? info.close() : info.open(map, marker);
//     });

//     // 클린업: DOM만 비워주면 됨
//     return () => {
//       if (mapRef.current) mapRef.current.innerHTML = '';
//     };
//   }, [ready]);

//   // 컨테이너는 반드시 크기를 가져야 지도 보임!
//   return (
//     <div
//       ref={mapRef}
//       style={{
//         width: '100%',
//         height: 420,
//         borderRadius: 12,
//         overflow: 'hidden',
//       }}
//     />
//   );
// }

'use client';
import { useEffect } from 'react';

const NaverMap = () => {
  useEffect(() => {
    naver.maps.Service.geocode(
      {
        query: '여러분이 찾고 싶은 주소',
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert('Someting Wrong!');
        }

        console.log(response);
      },
    );
  }, []);

  return (
    <>
      <div id="그리고 싶은 영역의 id" style={{ height: '200px' }}></div>
    </>
  );
};

export default NaverMap;
