"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DoctorCard from "@/components/home/doctorCard/doctorCard";
import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { bestDoctors as bestDoctorsData } from "@/constants/clinics";
import { motion } from "framer-motion";

export default function BestDoctors() {
  const [locale, setLocale] = useState("ar");

  useEffect(() => {
    function onLocale(e: any) {
      setLocale(e?.detail || "ar");
    }
    window.addEventListener("localeChange", onLocale as EventListener);
    return () =>
      window.removeEventListener("localeChange", onLocale as EventListener);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="rounded-[30px] border border-[#d8e3ff] bg-white px-4 py-10 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="mb-10 text-center"
      >
        <h2 className="text-2xl font-extrabold text-[#001a6e] sm:text-3xl">
          {t("bestDoctors.title", locale)}
        </h2>

        <p className="mt-2 text-sm text-[#6d7da7]">
          {t("bestDoctors.subtitle", locale)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={`mb-8 flex ${
          locale === "ar" ? "justify-start" : "justify-end"
        }`}
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
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bestDoctorsData.map((doc, i) => (
          <motion.div
            key={`${doc.clinicId}-${doc.id}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              delay: i * 0.12,
              ease: "easeOut",
            }}
          >
            <DoctorCard
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
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}