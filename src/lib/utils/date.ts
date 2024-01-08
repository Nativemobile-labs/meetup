import { FilterTimeframe, MessageThreadModel, TwibModel } from "../types";
import { DateTime } from "luxon";
import logger from "./logger";
import { filters } from "../dictionary";

/**
 * If the input is a string, we need to assume it is in UTC when we convert it to a DateTime object.
 * Otherwise, we should assume it has already been converted to UTC.
 * @param datetime
 */
export const normalize = (datetime: string | DateTime): DateTime => {
  if (typeof datetime === "string") {
    if (datetime.includes("T")) {
      return DateTime.fromISO(datetime, { zone: "utc" });
    } else {
      return DateTime.fromSQL(datetime, { zone: "utc" });
    }
  }

  return datetime;
};

export const localize = <T>(datetime: string | DateTime): T => {
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles";

  const normalized = DateTime.fromISO(normalize(datetime).toISO()!, {
    zone: "utc",
  });
  const localized = normalized.setZone(timezone);

  if (typeof datetime === "string") {
    if (datetime.includes("T")) {
      return localized.toJSDate().toISOString() as T;
    } else {
      return localized.toISO() as T;
    }
  }

  return localized as T;
};

export const dateIsValid = (date: Date | null): boolean => {
  if (date === null) {
    return false;
  }
  return !Number.isNaN(date.getTime());
};

export const datePart = (datetime: string): string => {
  return datetime.substring(0, 10);
};

export const isInFuture = (thread: MessageThreadModel): boolean => {
  const { twib_date, twib_time, timezone } = thread.twib;
  let date;

  if (twib_date !== null && twib_time !== null) {
    date = DateTime.fromSQL(datePart(twib_date) + " " + twib_time);
  } else if (twib_date !== null && twib_time === null) {
    date = DateTime.fromISO(twib_date);
  } else {
    return true;
  }

  return DateTime.now() <= date.setZone(timezone);
};

export const formattedDate = (datetime: string | DateTime) => {
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles";
  const normalized = normalize(datetime);

  if (normalized.zoneName !== "UTC") {
    throw new Error(
      "formattedDate expects a UTC date, got [" + normalized.zoneName + "]"
    );
  }

  return normalized.setZone(timezone).toLocaleString(DateTime.DATETIME_MED);
};

export const dateForTwib = (twib: TwibModel): DateTime | null => {
  if (twib.twib_date !== null && twib.twib_time !== null) {
    return DateTime.fromSQL(datePart(twib.twib_date) + " " + twib.twib_time, {
      zone: twib.timezone,
    });
  } else if (twib.twib_date !== null && twib.twib_time === null) {
    return DateTime.fromISO(twib.twib_date.replace(/Z$/, ""), {
      zone: twib.timezone,
    });
  }

  return null;
};

export const twibDetailDate = (twib: TwibModel): string => {
  let dateValue: string | null = twib.twib_date;
  if (dateValue === null) {
    return "Any day";
  }

  // for some reason the date is coming back from the server in "2021-09-01T00:00:00.000Z" format, instead of just "2021-09-01"
  if (dateValue.length > 10) {
    dateValue = dateValue.substring(0, 10);
  }

  const date = DateTime.fromISO(dateValue);
  const adjustedDate = date.setZone("America/Los_Angeles");
  return adjustedDate.toFormat("ccc, L/d");
};

export const twibDetailTime = (twib: TwibModel): string => {
  if (twib.twib_time === null) {
    return "Any time";
  }

  const date = DateTime.fromISO(twib.twib_time, { zone: twib.timezone });
  const adjustedDate = date.setZone("America/Los_Angeles");
  return adjustedDate.toFormat("h:mma").toLowerCase().replace(/m$/, "");
};

export const timeframeFromTwib = (twib: TwibModel): FilterTimeframe => {
  const date = dateForTwib(twib);
  const anytime = filters.timeframes.list.find(
    (tf) => tf.id === filters.timeframes.anytime
  )!;
  const thisWeek = filters.timeframes.list.find(
    (tf) => tf.id === filters.timeframes.thisWeek
  )!;
  const today = filters.timeframes.list.find(
    (tf) => tf.id === filters.timeframes.today
  )!;

  if (date === null) {
    return anytime;
  }

  const now = DateTime.now();
  const diff = date.diff(now, "days").toObject();

  if (diff.days! > 7) {
    return anytime;
  } else if (diff.days! > 1) {
    return thisWeek;
  } else {
    return today;
  }
};
