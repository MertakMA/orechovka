"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sunrise, Sunset, ExternalLink } from "lucide-react";
import WebcamPlayer from "@/components/WebcamPlayer";
import WeatherGlyph from "@/components/WeatherGlyph";
import { V } from "@/generated/variables";
import {
  CABIN_COORDS,
  degreesToCompass,
  describeWeatherCode,
  fetchWeather,
  formatTime,
  weatherKind,
  weekdayLabel,
  type OpenMeteoResponse,
} from "@/lib/weather";

type Locale = "cs" | "en";

const TEXT: Record<
  Locale,
  { title: string; error: string; sunrise: string; sunset: string; webcamTitle: string }
> = {
  cs: {
    title: "Počasí v okolí Mladých Buků",
    error: "Počasí se nepodařilo načíst. Zkuste to prosím později.",
    sunrise: "Východ",
    sunset: "Západ",
    webcamTitle: "Webkamera – Ski areál Mladé Buky",
  },
  en: {
    title: "Weather around Mladé Buky",
    error: "Couldn't load the weather. Please try again later.",
    sunrise: "Sunrise",
    sunset: "Sunset",
    webcamTitle: "Webcam – Mladé Buky ski area",
  },
};

export default function WeatherSection({ locale = "cs" }: { locale?: Locale }) {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [error, setError] = useState(false);
  const t = TEXT[locale];

  useEffect(() => {
    let cancelled = false;
    fetchWeather(CABIN_COORDS.lat, CABIN_COORDS.lon)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="pocasi" className="bg-sand px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[0px_10px_30px_0px_rgba(34,25,16,0.08)] lg:w-[500px]"
          >
            <div className="relative flex items-center justify-between overflow-hidden bg-bark px-5 py-4">
              <p className="text-[15px] font-semibold text-white">{t.title}</p>
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-10 size-28 rounded-full bg-white/10"
              />
            </div>

            <div className="px-5 pt-5">
              {error && (
                <p className="py-6 text-sm text-clay">{t.error}</p>
              )}

              {!error && !data && (
                <div className="flex animate-pulse items-center gap-4 py-2">
                  <div className="size-16 rounded-full bg-cream" />
                  <div className="h-12 w-28 rounded bg-cream" />
                </div>
              )}

              {data && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <WeatherGlyph
                    kind={weatherKind(data.current.weather_code)}
                    className="size-[68px] shrink-0 text-brand"
                    strokeWidth={1.45}
                  />
                  <div>
                    <p className="font-sans text-[48px] font-semibold leading-none text-ink">
                      {Math.round(data.current.temperature_2m)}°
                    </p>
                    <p className="mt-2 text-[15px] text-clay">
                      {describeWeatherCode(data.current.weather_code, locale)} ·{" "}
                      {Math.round(data.current.wind_speed_10m)} m/s {degreesToCompass(data.current.wind_direction_10m)}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2 border-t border-border px-3 pb-4 pt-4">
              {(data?.daily.time ?? Array.from({ length: 5 })).map((day, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="flex flex-col items-center gap-1.5 rounded-lg py-3 transition-colors hover:bg-cream"
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-clay">
                    {data ? weekdayLabel(day as string, locale) : "–"}
                  </p>
                  {data ? (
                    <WeatherGlyph kind={weatherKind(data.daily.weather_code[i])} className="size-7 text-brand" />
                  ) : (
                    <span className="block size-7 rounded-full bg-cream" />
                  )}
                  <p className="text-[15px] font-semibold text-ink">
                    {data ? `${Math.round(data.daily.temperature_2m_max[i])}°` : "–°"}
                  </p>
                </motion.div>
              ))}
            </div>

            {data && (
              <div className="flex flex-1 items-center justify-center gap-10 border-t border-border bg-cream/60 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Sunrise className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-clay">{t.sunrise}</p>
                    <p className="text-[14px] font-semibold text-ink">{formatTime(data.daily.sunrise[0], locale)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="size-5 text-brand" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-clay">{t.sunset}</p>
                    <p className="text-[14px] font-semibold text-ink">{formatTime(data.daily.sunset[0], locale)}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full overflow-hidden rounded-xl border border-border bg-surface shadow-[0px_10px_30px_0px_rgba(34,25,16,0.08)] lg:flex-1"
          >
            <a
              href={V.WEBKAMERA_STRANKA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-espresso px-5 py-4 transition-colors hover:bg-[#2f1f14]"
            >
              <p className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                {t.webcamTitle}
                <ExternalLink className="size-3.5 opacity-0 transition-opacity group-hover:opacity-70" aria-hidden />
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-live px-[13px] py-[3px] text-[11px] font-semibold text-white">
                <span className="size-[6px] animate-pulse rounded-full bg-white" />
                LIVE
              </span>
            </a>
            <div className="relative m-4 aspect-video overflow-hidden rounded-lg bg-espresso">
              <WebcamPlayer />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
