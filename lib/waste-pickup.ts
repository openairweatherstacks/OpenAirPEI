// Stratford / Cameron Heights — IWMC Capital Region pickup schedule
// Schedule rules:
//   - Monday: alternating Green Cart (compost) and Black Cart (waste)
//   - 4th Wednesday of each month: Blue Bag (recycling)
//
// Anchor: 2026-05-11 = Green Cart Monday (compost)
//         2026-05-18 = Black Cart Monday (waste)

const ANCHOR_GREEN_CART = new Date("2026-05-11T00:00:00-03:00");

export type WasteStream = "compost" | "waste" | "recycling";

export interface NextPickup {
  date: Date;
  daysFromNow: number;
  streams: WasteStream[];
  isToday: boolean;
  isTomorrow: boolean;
  isThisWeek: boolean;
  label: string;
  callToAction: string;
}

function atlanticDateParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: get("weekday"),
  };
}

function startOfAtlanticDay(date: Date): Date {
  const { year, month, day } = atlanticDateParts(date);
  return new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00-03:00`);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfAtlanticDay(b).getTime() - startOfAtlanticDay(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function isMondayInAtlantic(date: Date): boolean {
  return atlanticDateParts(date).weekday === "Mon";
}

function isWednesdayInAtlantic(date: Date): boolean {
  return atlanticDateParts(date).weekday === "Wed";
}

function nthWednesdayOfMonth(year: number, month: number, n: number): Date {
  // Find the first Wednesday of the given month in Atlantic time
  for (let day = 1; day <= 7; day++) {
    const candidate = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00-03:00`);
    if (isWednesdayInAtlantic(candidate)) {
      return addDays(candidate, (n - 1) * 7);
    }
  }
  throw new Error("Unreachable: every month has a Wednesday in its first 7 days.");
}

function nextMondayOnOrAfter(from: Date): Date {
  let candidate = startOfAtlanticDay(from);
  for (let i = 0; i < 7; i++) {
    if (isMondayInAtlantic(candidate)) return candidate;
    candidate = addDays(candidate, 1);
  }
  return candidate;
}

function mondayStreamForDate(monday: Date): "compost" | "waste" {
  const weeksSinceAnchor = Math.round(daysBetween(ANCHOR_GREEN_CART, monday) / 7);
  return weeksSinceAnchor % 2 === 0 ? "compost" : "waste";
}

function nextBlueBagOnOrAfter(from: Date): Date {
  const { year, month } = atlanticDateParts(from);
  const thisMonthBlueBag = nthWednesdayOfMonth(year, month, 4);
  if (startOfAtlanticDay(thisMonthBlueBag).getTime() >= startOfAtlanticDay(from).getTime()) {
    return thisMonthBlueBag;
  }
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return nthWednesdayOfMonth(nextYear, nextMonth, 4);
}

function streamLabel(streams: WasteStream[]): string {
  const labels: Record<WasteStream, string> = {
    compost: "Green Cart (compost)",
    waste: "Black Cart (waste)",
    recycling: "Blue Bag (recycling)",
  };
  return streams.map((s) => labels[s]).join(" + ");
}

export function getNextWastePickup(now: Date = new Date()): NextPickup {
  const today = startOfAtlanticDay(now);
  const nextMonday = nextMondayOnOrAfter(today);
  const nextBlueBag = nextBlueBagOnOrAfter(today);

  // Pick whichever pickup comes first
  let pickupDate: Date;
  let streams: WasteStream[];

  if (
    isMondayInAtlantic(today) &&
    daysBetween(today, nextMonday) === 0
  ) {
    pickupDate = nextMonday;
    streams = [mondayStreamForDate(nextMonday)];
  } else if (
    daysBetween(today, nextBlueBag) === 0
  ) {
    pickupDate = nextBlueBag;
    streams = ["recycling"];
  } else if (nextBlueBag.getTime() < nextMonday.getTime()) {
    pickupDate = nextBlueBag;
    streams = ["recycling"];
  } else {
    pickupDate = nextMonday;
    streams = [mondayStreamForDate(nextMonday)];
  }

  // If today is a Monday that's also the 4th Wed... won't happen (different days),
  // but if today is the 4th Wednesday AND the upcoming Monday already happened today,
  // we'd want both. Realistically, Monday + Wednesday are distinct so this is fine.

  // If today is a Monday and also the same week as the 4th Wednesday and that Wed comes after,
  // the next pickup is just today's Monday — Wednesday will be picked up after.

  const daysFromNow = daysBetween(today, pickupDate);
  const isToday = daysFromNow === 0;
  const isTomorrow = daysFromNow === 1;
  const isThisWeek = daysFromNow <= 6;

  const dateFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Halifax",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  let label: string;
  if (isToday) label = "Today";
  else if (isTomorrow) label = "Tomorrow";
  else label = dateFmt.format(pickupDate);

  const streamText = streamLabel(streams);
  let callToAction: string;
  if (isToday) {
    callToAction = `${streamText} pickup is today — make sure your bins are at the curb.`;
  } else if (isTomorrow) {
    callToAction = `${streamText} pickup is tomorrow morning — put your bins out tonight.`;
  } else if (isThisWeek) {
    callToAction = `Next pickup is ${streamText} on ${label}.`;
  } else {
    callToAction = `Next pickup is ${streamText} on ${label}.`;
  }

  return {
    date: pickupDate,
    daysFromNow,
    streams,
    isToday,
    isTomorrow,
    isThisWeek,
    label,
    callToAction,
  };
}
