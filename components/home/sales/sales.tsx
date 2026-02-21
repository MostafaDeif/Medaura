"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

export default function SalesSection() {
  const [locale, setLocale] = useState(() => {
    try {
      return (
        document.documentElement.lang || localStorage.getItem("locale") || "en"
      );
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    function onLocale(e: any) {
      setLocale(e?.detail || document.documentElement.lang || "en");
    }
    window.addEventListener("localeChange", onLocale as EventListener);
    return () =>
      window.removeEventListener("localeChange", onLocale as EventListener);
  }, []);

  const offers = t("sales.offers", locale) as any[];

  return (
    <section className="rounded-[30px] border border-[#d8e3ff] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b69c7]">
            {t("sales.label", locale)}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#001a6e] sm:text-3xl">
            {t("sales.title", locale)}
          </h2>
        </div>
        <Link
          href="/auth/register"
          className="rounded-full border border-[#cfdcff] px-4 py-2 text-sm font-semibold text-[#163fb8] transition hover:bg-[#f2f6ff]"
        >
          {t("sales.startNow", locale)}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <article
            key={offer.title}
            className="overflow-hidden rounded-3xl border border-[#dbe5ff] bg-[#f8faff] shadow-[0_10px_30px_rgba(20,61,180,0.08)]"
          >
            <div className="relative h-48 w-full">
              <Image
                src={`/images/${offer.image ?? "sale1.png"}`}
                alt={offer.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-extrabold text-[#0f1a4f]">
                {offer.title}
              </h3>
              <p className="text-sm leading-6 text-[#5a6d9d]">
                {offer.description}
              </p>
              <button className="rounded-xl bg-[#1c3faa] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#162f80]">
                {t("sales.claimOffer", locale)}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
