export default function FilterSetting({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  if (!open) return null;

  const TRANSPARENT_TOP = 80; // 윗부분 노출 높이(px)

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 오버레이: 위 80px는 투명, 그 아래는 반투명 검정 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{
          backgroundImage: `linear-gradient(to bottom,
            rgba(0,0,0,0) 0,
            rgba(0,0,0,0) ${TRANSPARENT_TOP}px,
            rgba(0,0,0,0.6) ${TRANSPARENT_TOP}px,
            rgba(0,0,0,0.6) 100%)`,
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 w-[335px] rounded-2xl bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.12)] p-4"
        style={{ top: TRANSPARENT_TOP + 12 }} // 살짝 띄워 여백
        onClick={(e) => e.stopPropagation()} // 오버레이 클릭 닫힘 방지
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 text-base font-medium tracking-[-0.48px]">
          모달 제목
        </div>
        <p className="text-sm leading-[150%] tracking-[-0.42px] text-[var(--Neutral-30,#474747)]">
          내용이 들어갑니다. 위쪽 스트립은 배경이 그대로 보이고, 나머지는 어둡게
          처리돼요.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 h-9 rounded-md bg-[#FF5940] text-white"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
