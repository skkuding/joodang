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

export function formatWithComma(num: number): string {
  return num.toLocaleString();
}

export function formatDateWithDay(date: string | Date): string {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const dayOfWeek = dayNames[dateObj.getDay()];

  return `${year}. ${month}. ${day} (${dayOfWeek})`;
}
