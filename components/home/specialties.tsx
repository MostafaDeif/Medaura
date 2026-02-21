"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, HeartPulse, Bone, Baby, Brain, Ear, Eye, Stethoscope, Droplets, Scan, Syringe, Droplet } from "lucide-react";
import { useEffect, useState } from "react";
import { t } from "@/i18n";

type Specialty = {
  title: string;
  doctors: number;
  icon: React.ReactNode;
};

const specialties: Specialty[] = [
  { title: "Orthopedics", doctors: 200, icon: <Bone size={24} /> },
  { title: "Neurology", doctors: 100, icon: <Brain size={24} /> },
  { title: "Pediatrics", doctors: 80, icon: <Baby size={24} /> },
  { title: "Cardiology", doctors: 120, icon: <HeartPulse size={24} /> },
  { title: "Pulmonology", doctors: 200, icon: <Stethoscope size={24} /> },
  { title: "Nephrology", doctors: 100, icon: <Droplets size={24} /> },
  { title: "Oncology", doctors: 80, icon: <Scan size={24} /> },
  { title: "ENT", doctors: 120, icon: <Ear size={24} /> },
  { title: "Dermatology", doctors: 100, icon: <Droplet size={24} /> },
  { title: "OB-GYN", doctors: 80, icon: <Syringe size={24} /> },
  { title: "Ophthalmology", doctors: 120, icon: <Eye size={24} /> },
];

const Specialties = () => {
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
        <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">{t("specialties.title", locale)}</h2>
        <p className="mt-2 text-sm text-[#6d7da7]">{t("specialties.description", locale)}</p>
      </div>

      <div className="mb-8 flex justify-start">
          <Link
            href="/site/specialties"
            className="inline-flex items-center gap-2 rounded-full border border-[#d1ddff] px-4 py-2 text-sm font-semibold text-[#001a6e] transition hover:bg-[#f4f7ff]"
          >
            {t("specialties.viewAll", locale)}
            <ChevronLeft size={18} />
          </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {specialties.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-[#dbe4ff] bg-[#f9fbff] px-3 py-5 text-center transition hover:-translate-y-1 hover:border-[#9db4ff] hover:shadow-[0_14px_30px_rgba(18,57,173,0.15)]"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7eeff] text-[#1742c7] transition group-hover:bg-[#1c3faa] group-hover:text-white">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-[#0f1a4f]">{item.title}</h3>
            <p className="mt-1 text-xs text-[#4f66a7]">{item.doctors} doctors</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Specialties;
