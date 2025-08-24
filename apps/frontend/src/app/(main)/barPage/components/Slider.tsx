"use client";
import { useMemo } from "react";

type Props = {
  options: number[]; // [10000, 15000, 20000] 같이 이산 값
  value: number; // 현재 선택된 값 (예: 15000)
  onChange: (v: number) => void;
};

export default function PriceSlider({ options, value, onChange }: Props) {
  const index = Math.max(0, options.indexOf(value)); // value → 인덱스
  const max = options.length - 1;

  // 채워진 트랙 길이 계산(퍼센트)
  const fillPercent = useMemo(() => (index / max) * 100, [index, max]);

  return (
    <div className="w-full">
      {/* 슬라이더 */}
      <div className="relative px-2">
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={index}
          onChange={(e) => onChange(options[Number(e.target.value)])}
          aria-valuetext={`${value.toLocaleString()}원`}
          className="w-full appearance-none bg-transparent"
          style={{
            // 트랙 배경: 왼쪽은 채움색, 오른쪽은 회색
            background: `linear-gradient(to right, #ff6540 ${fillPercent}%, #d1d5db ${fillPercent}%)`,
            height: 4,
            borderRadius: 9999,
          }}
        />
        {/* 웹킷 스타일 */}
        <style jsx>{`
          input[type="range"] {
            outline: none;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            height: 4px;
            background: transparent;
            border-radius: 9999px;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 9999px;
            background: white;
            border: 3px solid #ff6540;
            margin-top: -7px; /* thumb가 트랙 중앙에 오도록 */
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          }
          /* Firefox */
          input[type="range"]::-moz-range-track {
            height: 4px;
            background: transparent;
            border-radius: 9999px;
          }
          input[type="range"]::-moz-range-progress {
            background: #ff6540;
            height: 4px;
            border-radius: 9999px 0 0 9999px;
          }
          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 9999px;
            background: white;
            border: 3px solid #ff6540;
          }
        `}</style>
      </div>

      {/* 라벨(라디오처럼 이산 값 표시) */}
      <div className="mt-2 flex justify-between text-sm text-gray-500 select-none">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`relative -mx-2 px-2`}
            aria-pressed={opt === value}
          >
            {opt.toLocaleString()}원
          </button>
        ))}
      </div>
    </div>
  );
}
