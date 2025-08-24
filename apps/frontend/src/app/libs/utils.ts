import dayjs from 'dayjs';

export const dateFormatter = (date: string | Date, format: string) => {
  return dayjs(
    new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
  ).format(format);
};
