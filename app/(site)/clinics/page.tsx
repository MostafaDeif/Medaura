"use client";
import { useState } from "react";
import ClinicCard from "@/components/clinics/ClinicCard";
import { ChevronDown } from "lucide-react";
import { allClinics } from "@/constants/clinics";

export default function Page() {
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="bg-white pt-24 pb-12" dir="rtl">
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#001A6E]">
              العيادات
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              أفضل العيادات حسب آراء وتجارب المستخدمين
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {allClinics.slice(0, visibleCount).map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < allClinics.length && (
            <div className="flex justify-center mt-16">
              <button 
                onClick={loadMore}
                className="flex flex-col items-center gap-2 text-[#001A6E] font-bold hover:opacity-80 transition-opacity"
              >
                <span>عرض المزيد</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
