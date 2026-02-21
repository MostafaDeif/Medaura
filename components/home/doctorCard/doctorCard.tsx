"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

type DoctorCardProps = {
  name: string;
  specialty: string;
  rating: number;
  price: number;
  experience: number;
  imageSrc?: string;
};

export default function DoctorCard({
  name,
  specialty,
  rating,
  price,
  experience,
  imageSrc = "/images/DOC.png",
}: DoctorCardProps) {
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
  return (
    <article className="rounded-3xl border border-[#d9e3ff] bg-white p-4 shadow-[0_10px_25px_rgba(20,61,180,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(20,61,180,0.14)]">
      <div className="mb-4 overflow-hidden rounded-2xl">
        <Image
          src={imageSrc}
          alt={name}
          width={640}
          height={420}
          className="h-52 w-full object-cover"
        />
      </div>

      <h4 className="text-base font-extrabold text-[#001a6e]">{name}</h4>
      <p className="mt-1 text-sm text-[#53679f]">{t("doctorCard.consultant", locale)} {specialty}</p>

      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#fff4d9] px-3 py-1 text-sm font-semibold text-[#8d5a00]">
        <Star className="h-4 w-4 fill-current" />
        {rating}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-[#f5f8ff] p-3 text-sm text-[#2a3f78]">
        <div>
          <p className="text-xs text-[#6c7ba4]">{t("doctorCard.sessionFee", locale)}</p>
          <p className="font-bold">{price} EGP</p>
        </div>
        <div>
          <p className="text-xs text-[#6c7ba4]">{t("doctorCard.experience", locale)}</p>
          <p className="font-bold">{experience} {locale === "ar" ? "سنة" : "years"}</p>
        </div>
      </div>

      <button className="mt-4 w-full rounded-xl bg-[#1c3faa] py-2.5 text-sm font-bold text-white transition hover:bg-[#162f80]">
        {t("doctorCard.bookNow", locale)}
      </button>
    </article>
  );
}
