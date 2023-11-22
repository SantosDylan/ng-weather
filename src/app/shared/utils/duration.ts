export const ONE_MILLISECONDS_MS = 1;
export const ONE_SECONDS_MS = 1000 * 1;
export const ONE_MINUTE_MS = 1000 * 1 * 60;
export const ONE_HOUR_MS = 1000 * 1 * 60 * 60;
export const ONE_DAY_MS = 1000 * 1 * 60 * 60 * 24;

export type Duration = 'millisecond' | 'second' | 'minute' | 'hour' | 'day';

export const DURATION_DATA: Record<Duration, number> = {
  millisecond: ONE_MILLISECONDS_MS,
  second: ONE_SECONDS_MS,
  minute: ONE_MINUTE_MS,
  hour: ONE_HOUR_MS,
  day: ONE_DAY_MS,
};
