"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DoctorCard from "@/components/home/doctorCard/doctorCard";
import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { bestDoctors as bestDoctorsData } from "@/constants/clinics";

export default function BestDoctors() {
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

  return (
    <section className="rounded-[30px] border border-[#d8e3ff] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">
          {t("bestDoctors.title", locale)}
        </h2>
        <p className="mt-2 text-sm text-[#6d7da7]">
          {t("bestDoctors.subtitle", locale)}
        </p>
      </div>

      <div
        className={`mb-8 flex ${locale === "ar" ? "justify-start" : "justify-end"}`}
      >
        <Link
          href="/specialties"
          className="inline-flex items-center gap-2 rounded-full border border-[#d1ddff] px-4 py-2 text-sm font-semibold text-[#001a6e] transition hover:bg-[#f4f7ff]"
        >
          {t("bestDoctors.viewAll", locale)}
          {locale === "ar" ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bestDoctorsData.map((doc) => (
          <DoctorCard
            key={`${doc.clinicId}-${doc.id}`}
            id={doc.id}
            clinicId={doc.clinicId}
            name={doc.name}
            specialty={doc.specialty}
            rating={doc.rating}
            price={doc.price}
            experience={doc.experience}
            imageSrc={doc.imageSrc}
            isFromHome={true}
          />
        ))}
      </div>
    </section>
  );
}
