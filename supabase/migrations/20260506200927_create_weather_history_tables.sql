-- Create pei_weather_history table
create table if not exists pei_weather_history (
  id            bigserial primary key,
  date          date not null unique,
  month         smallint not null,
  day           smallint not null,
  year          smallint not null,
  max_temp      numeric(5,1),
  min_temp      numeric(5,1),
  mean_temp     numeric(5,1),
  total_precip  numeric(6,1),
  total_rain    numeric(6,1),
  total_snow    numeric(6,1),
  snow_on_ground smallint,
  wind_speed    numeric(5,1),
  station_id    text default '6526',
  created_at    timestamptz default now()
);

create index if not exists pei_weather_history_month_day on pei_weather_history (month, day);
create index if not exists pei_weather_history_date on pei_weather_history (date);

-- Create pei_history_daily_cache table
create table if not exists pei_history_daily_cache (
  id              bigserial primary key,
  cache_date      date not null unique,
  avg_high        numeric(5,1),
  avg_low         numeric(5,1),
  record_high     numeric(5,1),
  record_high_year smallint,
  record_low      numeric(5,1),
  record_low_year smallint,
  record_precip   numeric(6,1),
  record_precip_year smallint,
  precip_frequency numeric(5,2),
  years_on_record  smallint,
  ai_narrative    text,
  created_at      timestamptz default now()
);
