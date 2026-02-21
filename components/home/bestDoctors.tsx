"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DoctorCard from "@/components/home/doctorCard/doctorCard";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

type Doctor = {
  name: string;
  specialty: string;
  rating: number;
  price: number;
  experience: number;
  imageSrc: string;
};

const bestDoctors: Doctor[] = [
  {
    name: "Dr. Saleh Mahmoud",
    specialty: "Cardiology",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc1.jpg",
  },
  {
    name: "Dr. Karim Mohamed",
    specialty: "Internal Medicine",
    rating: 4.8,
    price: 320,
    experience: 10,
    imageSrc: "/images/doc2.jpg",
  },
  {
    name: "Dr. Nadine Adel",
    specialty: "Dermatology",
    rating: 4.9,
    price: 280,
    experience: 7,
    imageSrc: "/images/doc3.jpg",
  },
];

export default function BestDoctors() {
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
    <section className="rounded-[30px] border border-[#d8e3ff] bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">{t("bestDoctors.title", locale)}</h2>
        <p className="mt-2 text-sm text-[#6d7da7]">{t("bestDoctors.subtitle", locale)}</p>
      </div>

      <div className="mb-8 flex justify-start">
        <Link
          href="/site/specialties"
          className="inline-flex items-center gap-2 rounded-full border border-[#d1ddff] px-4 py-2 text-sm font-semibold text-[#001a6e] transition hover:bg-[#f4f7ff]"
        >
          {t("bestDoctors.viewAll", locale)}
          <ChevronLeft size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bestDoctors.map((doc) => (
          <DoctorCard
            key={doc.name}
            name={doc.name}
            specialty={doc.specialty}
            rating={doc.rating}
            price={doc.price}
            experience={doc.experience}
            imageSrc={doc.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}
