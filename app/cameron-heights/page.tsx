import type { Metadata } from "next";
import { AlertTriangle, ArrowDown, ArrowUp, CloudRain, Gauge, Lightbulb, Moon, Radio, Sunrise, SunMedium, Wind, Zap } from "lucide-react";
import Image from "next/image";

import { MeteorologistInsight } from "@/components/ai/MeteorologistInsight";
import { ActivityGrid } from "@/components/conditions/ActivityGrid";
import { ConditionsCard } from "@/components/conditions/ConditionsCard";
import { WindowAlert } from "@/components/conditions/WindowAlert";
import { PEIMap } from "@/components/map/PEIMap";
import { CommunityNoticeCard } from "@/components/ui/CommunityNoticeCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { AirQualityBar } from "@/components/ui/AirQualityBar";
import { SocialShareStrip } from "@/components/ui/SocialShareStrip";
import { UVTimer } from "@/components/ui/UVTimer";
import { LiveAutoRefresh } from "@/components/weather/LiveAutoRefresh";
import { SevenDayForecast } from "@/components/weather/SevenDayForecast";
import { WastePickupCard } from "@/components/community/WastePickupCard";
import { PowerOutageCard } from "@/components/community/PowerOutageCard";
import { getCameronHeightsDashboardData } from "@/lib/cameron-heights";
import { formatObservationTime } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cameron Heights",
  description: "Resident dashboard for Cameron Heights with hyperlocal Tempest weather, radar, and safety context.",
  alternates: {
    canonical: "/cameron-heights",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Cameron Heights",
    description:
      "Resident dashboard for Cameron Heights with hyperlocal Tempest weather, radar, and safety context.",
    url: "/cameron-heights",
    images: [
      {
        url: "/cameron-heights-header.png",
        width: 1672,
        height: 941,
        alt: "Cameron Heights neighbourhood header image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cameron Heights",
    description:
      "Resident dashboard for Cameron Heights with hyperlocal Tempest weather, radar, and safety context.",
    images: ["/cameron-heights-header.png"],
  },
};

function describePressureTrend(pressureTrend: string | null) {
  if (pressureTrend === "rising") return "Pressure is rising, which usually means the neighbourhood is settling down rather than getting messier.";
  if (pressureTrend === "falling") return "Pressure is falling, so the next weather shift is probably already organizing nearby.";
  return "Pressure is steady, which fits a more stable neighbourhood weather window right now.";
}

function describeLightningRisk(lightningLastHour: number, lightningLast3Hours: number) {
  if (lightningLastHour > 0) {
    return `Lightning has already been logged ${lightningLastHour} time${lightningLastHour === 1 ? "" : "s"} in the last hour. Treat outdoor plans like an active weather call.`;
  }
  if (lightningLast3Hours > 0) {
    return `No fresh strikes in the last hour, but ${lightningLast3Hours} showed up within the last 3 hours. Keep one eye on the radar before longer outdoor plans.`;
  }
  return "No lightning strikes have been logged in the last 3 hours, so thunder is not the neighbourhood's main problem right now.";
}

function describeRain(precipToday: number, precipLastHour: number) {
  if (precipLastHour >= 1) {
    return `Rain has been active lately, with ${precipLastHour.toFixed(1)} mm in the last hour and ${precipToday.toFixed(1)} mm so far today.`;
  }
  if (precipToday > 0) {
    return `${precipToday.toFixed(1)} mm has fallen in Cameron Heights today, but the last hour has been quieter.`;
  }
  return "No measurable rain has shown up at the station today, so the neighbourhood is still working with a dry board.";
}

interface ActionItem {
  icon: typeof Lightbulb;
  text: string;
}

function buildActionRecommendations(dashboard: Awaited<ReturnType<typeof getCameronHeightsDashboardData>>): ActionItem[] {
  if (!dashboard) return [];
  const actions: ActionItem[] = [];
  const { entry } = dashboard;
  const wind = entry.weather.windSpeed;
  const gusts = entry.weather.gustSpeed ?? wind;
  const temp = entry.weather.temperature;
  const uv = entry.weather.uvIndex;
  const aqhi = entry.weather.aqhi;

  if (dashboard.lightningLastHour > 0) {
    actions.push({ icon: Zap, text: "Lightning active nearby — stay indoors, avoid showers, unplug sensitive electronics." });
  }
  if (gusts >= 60) {
    actions.push({ icon: Wind, text: `Park in the garage — gusts to ${gusts} km/h. Secure trash bins and patio furniture.` });
  } else if (gusts >= 40) {
    actions.push({ icon: Wind, text: `Tie down anything light outside — gusts around ${gusts} km/h.` });
  }
  if (dashboard.precipLastHour >= 1) {
    actions.push({ icon: CloudRain, text: "Rain is active — close windows and bring laundry indoors." });
  }
  if (aqhi >= 7) {
    actions.push({ icon: AlertTriangle, text: "Air quality is poor — kids, seniors, and anyone with asthma should stay indoors." });
  } else if (aqhi <= 2 && temp >= 15 && temp <= 25 && wind < 25) {
    actions.push({ icon: Lightbulb, text: "Excellent air and comfortable temps — open the windows and air the house out." });
  }
  if (uv >= 7) {
    actions.push({ icon: SunMedium, text: "UV is high — sunscreen before the kids head out, and reapply every 2 hours." });
  }
  if (temp <= 0 && wind >= 20) {
    actions.push({ icon: AlertTriangle, text: "Wind chill is biting — bundle up before stepping out, especially for the school walk." });
  }
  if (temp >= 28) {
    actions.push({ icon: AlertTriangle, text: "Hot day — hydrate, check on neighbours, and keep pets off pavement." });
  }

  if (actions.length === 0) {
    actions.push({ icon: Lightbulb, text: "Nothing pressing right now — the neighbourhood is calm. Enjoy it." });
  }
  return actions.slice(0, 3);
}

export default async function CameronHeightsPage() {
  const dashboard = await getCameronHeightsDashboardData();

  if (!dashboard) {
    return (
      <div className="page-shell space-y-8">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Resident dashboard</p>
          <h1 className="section-title text-3xl sm:text-4xl">Cameron Heights setup needed</h1>
          <p className="section-copy mt-4">
            This page is ready for Tempest-backed hyperlocal weather, but the server could not read
            a Tempest station yet. Add `TEMPEST_API_TOKEN` and, if you want to pin a specific
            station, `TEMPEST_STATION_ID`.
          </p>
        </section>
      </div>
    );
  }

  const { entry, airportComparison } = dashboard;
  const actions = buildActionRecommendations(dashboard);
  const lightningActive = dashboard.lightningLastHour > 0;
  const todayForecast = dashboard.sevenDayForecast[0];
  const tomorrowForecast = dashboard.sevenDayForecast[1];

  return (
    <div className="space-y-8 pb-6">
      <LiveAutoRefresh intervalMs={60_000} />

      <section className="relative overflow-hidden">
        <div className="relative h-[36vh] min-h-[280px] w-full sm:h-[44vh] lg:h-[52vh]">
          <Image
            src="/cameron-heights-header.png"
            alt="Cameron Heights townhomes and neighbourhood roadway under a bright sky"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_82%] sm:object-[center_84%] lg:object-[center_86%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/58 via-[#181512]/12 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#fafaf7]/45 via-[#fafaf7]/12 to-transparent sm:h-16" />
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:-mt-20 sm:px-6 lg:px-8 space-y-6">
        {lightningActive && (
          <div className="rounded-[1.5rem] border-2 border-red-500 bg-red-50 p-5 shadow-lg animate-pulse">
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-700 mb-1">Lightning active — get inside</p>
                <p className="font-serif text-xl text-red-900 leading-snug">
                  {dashboard.lightningLastHour} strike{dashboard.lightningLastHour === 1 ? "" : "s"} in the last hour. Stay indoors, avoid plumbing and electronics, and wait 30 minutes after the last thunder before heading back out.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[1.75rem] border border-forest/30 bg-gradient-to-br from-forest-light to-leaf-light p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-forest" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest">What to do right now</p>
          </div>
          <ul className="space-y-3">
            {actions.map((action, i) => {
              const Icon = action.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="h-4 w-4 text-forest" />
                  </div>
                  <p className="font-serif text-lg leading-7 text-text-primary break-words">{action.text}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <WastePickupCard />
          <PowerOutageCard />
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-6 sm:p-8">
            <div className="max-w-3xl">
              <p className="eyebrow mb-3">Resident dashboard</p>
              <h1 className="section-title text-3xl sm:text-4xl lg:text-5xl">
                Cameron Heights right now
              </h1>
              <p className="section-copy mt-4">
                Hyperlocal conditions from your on-site Tempest station, layered with radar, AQHI,
                and Environment Canada alerts so the neighbourhood read stays personal without
                losing the bigger picture.
              </p>
              <div className="mt-6 border-t border-border/80 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                  Share this page
                </p>
                <SocialShareStrip
                  title="Cameron Heights"
                  description="Resident dashboard for Cameron Heights with hyperlocal weather, radar, and safety context."
                  path="/cameron-heights"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/92 px-5 py-4 shadow-[0_24px_80px_rgba(42,42,42,0.08)] backdrop-blur lg:min-w-[300px]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              Live source
            </p>
            <p className="mt-2 font-serif text-2xl text-text-primary">
              {dashboard.stationPublicName}
            </p>
            <p className="mt-1 text-sm text-text-secondary">{dashboard.stationName}</p>
            <p className="mt-3 text-xs leading-5 text-text-muted">
              Updated {formatObservationTime(entry.weather.observationTime)} · refreshes every 60
              seconds
            </p>
          </div>
        </section>
      </div>

      <div className="page-shell space-y-8">
        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <ConditionsCard entry={entry} compact />
          </div>
          <div className="space-y-5">
            <WindowAlert
              minutes={entry.conditions.windowMinutes}
              statement={entry.conditions.windowStatement}
            />
            <MeteorologistInsight text={entry.conditions.insightOfTheDay} />
            <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-forest">
                <Radio className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Source blend</p>
              </div>
              <p className="font-serif text-xl leading-7 text-text-primary">
                Tempest handles the neighbourhood now. Open-Meteo handles the next shift.
                Environment Canada handles radar, AQHI, and official alerts.
              </p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                That mix keeps the dashboard hyperlocal without losing the island-wide context that
                matters when weather starts moving fast.
              </p>
            </div>
          </div>
        </section>

        {entry.communityNotice && <CommunityNoticeCard notice={entry.communityNotice} />}

        {airportComparison && (
          <section className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4 text-forest" />
              <p className="eyebrow">Your station vs. the airport</p>
            </div>
            <p className="font-serif text-xl leading-snug text-text-primary mb-5 break-words">
              {(() => {
                const parts: string[] = [];
                if (Math.abs(airportComparison.tempDiff) >= 1) {
                  parts.push(`${Math.abs(airportComparison.tempDiff).toFixed(1)}°C ${airportComparison.tempDiff > 0 ? "warmer" : "cooler"}`);
                }
                if (Math.abs(airportComparison.windDiff) >= 5) {
                  parts.push(`wind is ${Math.abs(airportComparison.windDiff)} km/h ${airportComparison.windDiff > 0 ? "stronger" : "lighter"}`);
                }
                if (parts.length === 0) {
                  return "Cameron Heights is reading nearly identical to the airport right now — a calm, even day across town.";
                }
                return `Cameron Heights is ${parts.join(", ")} than Charlottetown Airport right now — this is why your on-site read matters.`;
              })()}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-[#fafaf7] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">Temperature</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-serif text-2xl text-text-primary">{entry.weather.temperature}°C</p>
                  <span className="text-xs text-text-muted">vs {airportComparison.airportTemp}°C</span>
                </div>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${airportComparison.tempDiff > 0 ? "text-sun-text" : airportComparison.tempDiff < 0 ? "text-blue-600" : "text-text-muted"}`}>
                  {airportComparison.tempDiff > 0 ? <ArrowUp className="h-3 w-3" /> : airportComparison.tempDiff < 0 ? <ArrowDown className="h-3 w-3" /> : null}
                  {airportComparison.tempDiff > 0 ? "+" : ""}{airportComparison.tempDiff}°C
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-[#fafaf7] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">Wind</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-serif text-2xl text-text-primary">{entry.weather.windSpeed} km/h</p>
                  <span className="text-xs text-text-muted">vs {airportComparison.airportWind} km/h</span>
                </div>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${airportComparison.windDiff > 0 ? "text-sun-text" : airportComparison.windDiff < 0 ? "text-forest" : "text-text-muted"}`}>
                  {airportComparison.windDiff > 0 ? <ArrowUp className="h-3 w-3" /> : airportComparison.windDiff < 0 ? <ArrowDown className="h-3 w-3" /> : null}
                  {airportComparison.windDiff > 0 ? "+" : ""}{airportComparison.windDiff} km/h
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-[#fafaf7] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-2">Air quality (AQHI)</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-serif text-2xl text-text-primary">{entry.weather.aqhi}</p>
                  <span className="text-xs text-text-muted">vs {airportComparison.airportAqhi}</span>
                </div>
                <div className="mt-2 text-xs text-text-muted">
                  Shared across the city
                </div>
              </div>
            </div>
          </section>
        )}

        {(todayForecast || tomorrowForecast) && (
          <section className="grid gap-4 lg:grid-cols-2">
            {todayForecast && (
              <div className="rounded-[1.75rem] border border-border bg-gradient-to-br from-[#1a2238]/95 to-[#3a4a6b]/90 p-6 shadow-sm text-white">
                <div className="mb-4 flex items-center gap-2">
                  <Moon className="h-4 w-4 text-white/80" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">Tonight</p>
                </div>
                <p className="font-serif text-2xl mb-3 break-words leading-snug">
                  Low of {todayForecast.low}°C · {todayForecast.conditionText}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-1">Rain chance</p>
                    <p className="font-medium">{todayForecast.precipProbability}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 mb-1">Wind peak</p>
                    <p className="font-medium">{todayForecast.maxWindSpeed} km/h</p>
                  </div>
                </div>
              </div>
            )}
            {tomorrowForecast && (
              <div className="rounded-[1.75rem] border border-border bg-gradient-to-br from-sun-light to-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Sunrise className="h-4 w-4 text-sun-text" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-text">Tomorrow morning</p>
                </div>
                <p className="font-serif text-2xl mb-3 text-text-primary break-words leading-snug">
                  {tomorrowForecast.low}° → {tomorrowForecast.high}°C · {tomorrowForecast.conditionText}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">Rain chance</p>
                    <p className="font-medium text-text-primary">{tomorrowForecast.precipProbability}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">UV peak</p>
                    <p className="font-medium text-text-primary">{tomorrowForecast.uvIndexMax}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-text-secondary">
                  Plan the school run and morning commute around this.
                </p>
              </div>
            )}
          </section>
        )}

        <section className="grid gap-5 lg:grid-cols-4">
          <MetricCard
            icon={Wind}
            title="Station wind"
            insight={`Wind at the station is ${entry.weather.windSpeed} km/h from the ${entry.weather.windDirection}, with gusts near ${entry.weather.gustSpeed ?? entry.weather.windSpeed} km/h.`}
            rawLabel={`Tempest live read · device ${dashboard.stationDeviceId ?? "n/a"}`}
            accentClassName="text-sun-text"
          />
          <MetricCard
            icon={CloudRain}
            title="Neighbourhood rain"
            insight={describeRain(dashboard.precipToday, dashboard.precipLastHour)}
            rawLabel={`${dashboard.precipToday.toFixed(1)} mm today · ${dashboard.precipMinutesToday} wet minutes`}
          />
          <MetricCard
            icon={Zap}
            title="Lightning watch"
            insight={describeLightningRisk(
              dashboard.lightningLastHour,
              dashboard.lightningLast3Hours,
            )}
            rawLabel={`${dashboard.lightningLastHour} strikes last hour · ${dashboard.lightningLast3Hours} in 3 hr`}
            accentClassName="text-sun-text"
          />
          <MetricCard
            icon={Gauge}
            title="Pressure trend"
            insight={describePressureTrend(dashboard.pressureTrend)}
            rawLabel={`${entry.weather.pressure} hPa · ${dashboard.pressureTrend ?? "steady"}`}
          />
        </section>

        <SevenDayForecast forecast={dashboard.sevenDayForecast} />

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-2">Neighbourhood map</p>
              <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">
                Cameron Heights with live radar context
              </h2>
            </div>
            <p className="text-sm text-text-muted">
              Green ring shows the local focus area around the Tempest station.
            </p>
          </div>
          <PEIMap
            locations={[entry]}
            focusId={entry.location.id}
            highlightRadiusMeters={650}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div className="panel p-5">
              <p className="eyebrow mb-3">Air quality</p>
              <AirQualityBar value={entry.weather.aqhi} />
              <p className="mt-4 text-sm leading-6 text-text-secondary">
                {entry.conditions.airQualityStatement}
              </p>
            </div>
            <UVTimer uvIndex={entry.weather.uvIndex} />
            <MetricCard
              icon={SunMedium}
              title="Solar read"
              insight={
                dashboard.solarRadiation !== null
                  ? `Solar radiation is sitting around ${dashboard.solarRadiation} W/m², which helps explain how quickly patios, pavement, and sheltered corners warm up.`
                  : "Solar radiation is not available from the station right now."
              }
              rawLabel={`UV ${entry.weather.uvIndex} · feels like ${entry.weather.feelsLike}°C`}
            />
          </div>

          <div className="space-y-5">
            <div className="panel p-5">
              <p className="eyebrow mb-3">Resident activity matcher</p>
              <ActivityGrid activities={entry.conditions.activities} />
            </div>
          </div>
        </section>

        <section className="panel p-5 sm:p-6">
          <p className="eyebrow mb-3">Why this board feels different</p>
          <p className="font-serif text-xl leading-8 text-text-primary sm:text-[1.7rem]">
            Cameron Heights is no longer borrowing the island&apos;s nearest public station. It has
            its own backyard read.
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-text-secondary sm:text-base">
            That matters most on days when showers clip one side of town, wind behaves differently
            from the waterfront, or the airport read feels close but not quite right for the street
            you actually live on.
          </p>
        </section>
      </div>
    </div>
  );
}
