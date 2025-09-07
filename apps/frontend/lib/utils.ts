import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import ky, { HTTPError } from "ky";
import { twMerge } from "tailwind-merge";
import { baseUrl } from "../constant";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isHttpError = (error: unknown) => error instanceof HTTPError;

export const fetcher = ky.create({
  prefixUrl: baseUrl,
  retry: 0,
  timeout: 5000,
  throwHttpErrors: false,
  hooks: {},
  credentials: "include",
});

// difference with fetcher: "throws" http error (must handle error when using)
export const safeFetcher = fetcher.extend({
  throwHttpErrors: true,
});

export const convertToLetter = (n: number) => {
  return String.fromCharCode(65 + n);
};

export const dateFormatter = (date: string | Date, format: string) => {
  return dayjs(
    new Date(date).toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  ).format(format);
};

/**
 *
 * @param num
 * @returns 세 자리마다 ,를 찍어서 반환합니다. ex) 15000 -> 15,000
 */
export const formatWithComma = (num: number): string => {
  return num.toLocaleString();
};

export const formatDateWithDay = (date: string | Date): string => {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const dayOfWeek = dayNames[dateObj.getDay()];

  return `${year}. ${month}. ${day} (${dayOfWeek})`;
};

export const getDateRange = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const dates: string[] = [];
  let current = startDate;
  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    dates.push(
      current
        .format("YYYY년 MM월 DD일 (dd)")
        .replace("(Su)", "(일)")
        .replace("(Mo)", "(월)")
        .replace("(Tu)", "(화)")
        .replace("(We)", "(수)")
        .replace("(Th)", "(목)")
        .replace("(Fr)", "(금)")
        .replace("(Sa)", "(토)")
    );
    current = current.add(1, "day");
  }
  return dates;
};

/**
 *
 * @param isoString
 * @returns isoString에서 HH:MM을 추출합니다.
 */
export function formatToHHMM(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// UTC 시간을 한국 시간 HH:MM 형태로 변환하는 함수
export const formatTimeToKST = (utcTimeString: string) => {
  const utcDate = new Date(utcTimeString);
  // 한국 시간으로 변환 (UTC+9)
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// 0000-00-00 -> 0000.00.00 하는 함수
export function formatDateDash2Point(dateStr: string | null) {
  if (!dateStr) {
    return "";
  }
  const [year, month, day] = dateStr.split("-");
  return `${year}.${month}.${day}`;
}
