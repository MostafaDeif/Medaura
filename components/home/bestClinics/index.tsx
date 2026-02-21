"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

const clinics = [
  {
    name: "Medaura Prime Clinic",
    location: "Nasr City, Cairo",
    rating: 4.9,
    image: "/images/clinic1.png",
  },
  {
    name: "Medaura Care Center",
    location: "Smouha, Alexandria",
    rating: 4.8,
    image: "/images/clinic2.png",
  },
  {
    name: "Medaura Family Clinic",
    location: "Dokki, Giza",
    rating: 4.7,
    image: "/images/clinic3.png",
  },
];

export default function BestClinics() {
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
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">
            {t("bestClinics.title", locale)}
          </h2>
          <p className="mt-2 text-sm text-[#6d7da7]">
            {t("bestClinics.description", locale)}
          </p>
        </div>
        <Link
          href="/clinics"
          className="rounded-full border border-[#d1ddff] px-4 py-2 text-sm font-semibold text-[#001a6e] transition hover:bg-[#f4f7ff]"
        >
          {t("bestClinics.viewClinics", locale)}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {clinics.map((clinic) => (
          <article
            key={clinic.name}
            className="overflow-hidden rounded-3xl border border-[#dce6ff] bg-[#fafcff] shadow-[0_12px_30px_rgba(20,61,180,0.08)]"
          >
            <div className="relative h-48">
              <Image
                src={clinic.image}
                alt={clinic.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3 p-5">
              <h3 className="text-lg font-extrabold text-[#102155]">
                {clinic.name}
              </h3>

              <p className="inline-flex items-center gap-2 text-sm text-[#5a6f9f]">
                <MapPin className="h-4 w-4" />
                {clinic.location}
              </p>

              <p className="inline-flex items-center gap-1 rounded-full bg-[#fff4d9] px-3 py-1 text-sm font-semibold text-[#875900]">
                <Star className="h-4 w-4 fill-current" />
                {clinic.rating}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
