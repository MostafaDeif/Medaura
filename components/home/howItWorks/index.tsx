"use client";

import { CalendarCheck2, Search, UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

export default function HowItWorks() {
  const [locale, setLocale] = useState(() => {
    try {
      return document.documentElement.lang || localStorage.getItem("locale") || "en";
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    function onLocale(e: any) {
      setLocale(e?.detail || document.documentElement.lang || "en");
    }
    window.addEventListener("localeChange", onLocale as EventListener);
    return () => window.removeEventListener("localeChange", onLocale as EventListener);
  }, []);

  const steps = t("howItWorks.steps", locale) as any[];
  const icons = [Search, UserRoundCheck, CalendarCheck2];

  return (
    <section className="rounded-[30px] border border-[#d8e3ff] bg-[#f7f9ff] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">{t("howItWorks.title", locale)}</h2>
        <p className="mt-2 text-sm text-[#687aa8]">{t("howItWorks.description", locale)}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = icons[index] || Search;

          return (
            <article
              key={index}
              className="rounded-3xl border border-[#d8e2ff] bg-white p-6 shadow-[0_10px_28px_rgba(20,61,180,0.08)]"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#5e7de0]">
                {t("howItWorks.stepLabel", locale)} {index + 1}
              </p>
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5edff] text-[#1946cc]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-extrabold text-[#102155]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5d719f]">{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
