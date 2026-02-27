"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

export default function WhatClientSay() {
  const [locale, setLocale] = useState("ar");

  useEffect(() => {
    function onLocale(e: any) {
      setLocale(e?.detail || "ar");
    }
    window.addEventListener("localeChange", onLocale as EventListener);
    return () =>
      window.removeEventListener("localeChange", onLocale as EventListener);
  }, []);

  const testimonials = t("whatClientSay.testimonials", locale) as any[];

  return (
    <section className="rounded-[30px] border border-[#d8e3ff] bg-[#f5f8ff] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">
          {t("whatClientSay.title", locale)}
        </h2>
        <p className="mt-2 text-sm text-[#6b7aa4]">
          {t("whatClientSay.description", locale)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="rounded-3xl border border-[#d9e4ff] bg-white p-5 shadow-[0_10px_25px_rgba(20,61,180,0.08)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#d6e1ff]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-extrabold text-[#14245a]">
                {item.name}
              </h3>
            </div>

            <p className="text-sm leading-7 text-[#566a9c]">
              &quot;{item.text}&quot;
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
