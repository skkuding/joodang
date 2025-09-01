import { baseUrl } from "@/constant";

// src/lib/push-subscription.ts
export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function requestPermissionAndSubscribe() {
  if (typeof window === "undefined") return;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    alert("이 브라우저는 알림을 지원하지 않아요. PWA 설치를 해주세요.");
    return;
  }

  // SW 등록(이미 등록돼 있으면 ready로 대기)
  const registration =
    (await navigator.serviceWorker.getRegistration()) ||
    (await navigator.serviceWorker.register("/service-worker.js"));

  // 권한 상태 확인
  const perm = Notification.permission;
  if (perm === "denied") {
    alert("알림 권한이 차단되어 있어요. 브라우저 설정에서 허용해 주세요.");
    return;
  }
  if (perm === "default") {
    const res = await Notification.requestPermission();
    if (res !== "granted") return;
  }

  // 서버에서 VAPID 퍼블릭키 받기
  const { publicKey } = await fetch(`${baseUrl}/notification/vapid`).then((r) =>
    r.json(),
  );

  // 이미 구독이 있으면 재사용
  const existing = await registration.pushManager.getSubscription();
  const sub =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  // 서버에 구독 저장 (로그인 필요 시 서버에서 userId 바인딩)
  await fetch(`${baseUrl}/notification/push-subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });
}
