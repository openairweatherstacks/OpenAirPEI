import SunCalc from "suncalc";

export interface SunWindow {
  sunrise: Date;
  sunset: Date;
  daylightMinutes: number;
}

export function getSunWindow(lat: number, lng: number, date: Date = new Date()): SunWindow {
  const times = SunCalc.getTimes(date, lat, lng);
  const daylightMinutes = Math.round(
    (times.sunset.getTime() - times.sunrise.getTime()) / 60000,
  );
  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
    daylightMinutes,
  };
}
