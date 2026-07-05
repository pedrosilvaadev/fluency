export const DEFAULT_TIME_ZONE = "America/Sao_Paulo";

export type StreakState = Readonly<{
  streak: number;
  lastActivityAt: Date | null;
}>;

export type StreakUpdate = Readonly<{
  streak: number;
  activityDate: string;
  changed: boolean;
}>;

type CalendarDate = Readonly<{
  year: number;
  month: number;
  day: number;
}>;

function getCalendarDate(date: Date, timeZone: string): CalendarDate {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter(
        ({ type }) => type === "year" || type === "month" || type === "day",
      )
      .map(({ type, value }) => [type, Number(value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  } as CalendarDate;
}

function toDayNumber(date: CalendarDate) {
  return Math.floor(Date.UTC(date.year, date.month - 1, date.day) / 86_400_000);
}

function toDateKey(date: CalendarDate) {
  return [date.year, date.month, date.day]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");
}

export function dateKeyInTimeZone(
  date: Date,
  timeZone = DEFAULT_TIME_ZONE,
) {
  return toDateKey(getCalendarDate(date, timeZone));
}

export function recentDateKeys(
  now: Date,
  count: number,
  timeZone = DEFAULT_TIME_ZONE,
) {
  const currentDay = toDayNumber(getCalendarDate(now, timeZone));
  return Array.from({ length: Math.max(0, Math.trunc(count)) }, (_, index) => {
    const date = new Date((currentDay - (count - index - 1)) * 86_400_000);
    return toDateKey({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    });
  });
}

export function updateDailyStreak(
  state: StreakState,
  now: Date,
  timeZone = DEFAULT_TIME_ZONE,
): StreakUpdate {
  const currentDate = getCalendarDate(now, timeZone);
  const activityDate = toDateKey(currentDate);

  if (!state.lastActivityAt) {
    return { streak: 1, activityDate, changed: true };
  }

  const previousDate = getCalendarDate(state.lastActivityAt, timeZone);
  const elapsedDays = toDayNumber(currentDate) - toDayNumber(previousDate);

  if (elapsedDays === 0) {
    return {
      streak: Math.max(1, Math.trunc(state.streak)),
      activityDate,
      changed: false,
    };
  }

  if (elapsedDays === 1) {
    return {
      streak: Math.max(0, Math.trunc(state.streak)) + 1,
      activityDate,
      changed: true,
    };
  }

  return { streak: 1, activityDate, changed: true };
}

/** Updates a streak when the persisted value is a PostgreSQL DATE (a civil
 * date without timezone), avoiding an accidental timezone conversion. */
export function updateDailyStreakFromDateKey(
  streak: number,
  lastActivityDate: string | null,
  now: Date,
  timeZone = DEFAULT_TIME_ZONE,
): StreakUpdate {
  const currentDate = getCalendarDate(now, timeZone);
  const activityDate = toDateKey(currentDate);

  if (!lastActivityDate) {
    return { streak: 1, activityDate, changed: true };
  }

  const [year, month, day] = lastActivityDate.split("-").map(Number);
  const elapsedDays =
    toDayNumber(currentDate) - toDayNumber({ year, month, day });

  if (elapsedDays === 0) {
    return {
      streak: Math.max(1, Math.trunc(streak)),
      activityDate,
      changed: false,
    };
  }

  if (elapsedDays === 1) {
    return {
      streak: Math.max(0, Math.trunc(streak)) + 1,
      activityDate,
      changed: true,
    };
  }

  return { streak: 1, activityDate, changed: true };
}
