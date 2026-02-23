"use client";
import { useEffect, useState } from "react";
import ClinicCard from "@/components/clinics/ClinicCard";
import { ChevronDown } from "lucide-react";
import { allClinics } from "@/constants/clinics";
import { t } from "@/i18n";

export default function Page() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);

    const handleLocaleChange = (e: any) => setLocale(e.detail);
    window.addEventListener("localeChange", handleLocaleChange);
    return () => window.removeEventListener("localeChange", handleLocaleChange);
  }, []);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="bg-white pt-24 pb-12">
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#001A6E]">
              {t("clinics.title", locale)}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {t("clinics.subtitle", locale)}
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allClinics.slice(0, visibleCount).map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} locale={locale} />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < allClinics.length && (
            <div className="flex justify-center mt-16">
              <button 
                onClick={loadMore}
                className="flex flex-col items-center gap-2 text-[#001A6E] font-bold hover:opacity-80 transition-opacity"
              >
                <span>{t("clinics.loadMore", locale)}</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
