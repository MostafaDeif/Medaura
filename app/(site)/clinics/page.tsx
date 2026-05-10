"use client";
import { useEffect, useState } from "react";
import ClinicCard from "@/components/clinics/ClinicCard";
import { ChevronDown } from "lucide-react";
import { t } from "@/i18n";

interface ApiClinic {
  clinic_id: number;
  name: string;
  location: string;
  phone: string;
  doctors_count: number;
  total_ratings: number;
  average_rating: number;
  geo_location: null | string;
}

interface Clinic {
  id: number;
  name: string;
  city: string;
  phone: string;
  rating: number;
  hours: string;
  specialties: string[];
  image: string;
}

export default function Page() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [locale, setLocale] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);

    const handleLocaleChange = (e: any) => setLocale(e.detail);
    window.addEventListener("localeChange", handleLocaleChange);
    return () => window.removeEventListener("localeChange", handleLocaleChange);
  }, []);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3001/api/clinic");
        
        if (!response.ok) {
          throw new Error("Failed to fetch clinics");
        }

        const data = await response.json();
        
        // Transform API response to expected format
        const transformedClinics: Clinic[] = data.clinics.map((clinic: ApiClinic) => ({
          id: clinic.clinic_id,
          name: clinic.name,
          city: clinic.location,
          phone: clinic.phone,
          rating: clinic.average_rating,
          hours: "9:00 AM - 6:00 PM",
          specialties: ["Healthcare Services"],
          image: "/images/clinic1.png", // Default image
        }));

        setClinics(transformedClinics);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching clinics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001A6E]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {clinics.slice(0, visibleCount).map((clinic) => (
                  <ClinicCard key={clinic.id} clinic={clinic} />
                ))}
              </div>

              {/* Load More */}
              {visibleCount < clinics.length && (
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

              {/* Empty State */}
              {clinics.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No clinics found</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
