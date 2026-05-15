"use client";

import { useParams } from "next/navigation";
import { MapPin, Phone, Clock, Star, Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import DoctorCard from "@/components/home/doctorCard/doctorCard";
import { t } from "@/i18n";

const API_BASE_URL = "http://127.0.0.1:3001/api";

type ClinicDoctor = {
  staff_id: number;
  full_name: string;
  role_title: string;
  specialist: string;
  work_days: string;
  work_from: string;
  work_to: string;
  consultation_price: number;
  photo: string | null;
  can_be_booked: number;
};

type GeoLocation = {
  latitude: number;
  longitude: number;
};

type ClinicProfileData = {
  clinic_id: number;
  name: string;
  location: string;
  phone: string;
  photo: string;
  total_ratings: number;
  average_rating: number;
  geo_location: GeoLocation | null;
};

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null;
}

function unwrapData(data: unknown): unknown {
  if (isRecord(data) && data.data !== undefined) return unwrapData(data.data);
  return data;
}

function toNumber(value: unknown, fallback: number) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function normalizeClinic(
  value: unknown,
  fallbackId: number,
): ClinicProfileData | null {
  if (!isRecord(value)) return null;

  const clinicId = toNumber(value.clinic_id ?? value.id, fallbackId);
  const name = typeof value.name === "string" ? value.name : "";
  const location = typeof value.location === "string" ? value.location : "";
  const phone = typeof value.phone === "string" ? value.phone : "";
  const photo =
    typeof value.photo === "string" && value.photo.trim()
      ? value.photo
      : "/images/clinic1.png";
  const totalRatings = toNumber(value.total_ratings, 0);
  const averageRating = toNumber(value.average_rating, 0);
  const geoLocation =
    isRecord(value.geo_location) &&
    typeof value.geo_location.latitude === "number" &&
    typeof value.geo_location.longitude === "number"
      ? {
          latitude: value.geo_location.latitude,
          longitude: value.geo_location.longitude,
        }
      : null;

  return {
    clinic_id: clinicId,
    name,
    location,
    phone,
    photo,
    total_ratings: totalRatings,
    average_rating: averageRating,
    geo_location: geoLocation,
  };
}

function normalizeDoctors(value: unknown): ClinicDoctor[] {
  if (!Array.isArray(value)) return [];

  const doctors: ClinicDoctor[] = [];

  for (const [index, entry] of value.entries()) {
    if (!isRecord(entry)) continue;

    doctors.push({
      staff_id: toNumber(entry.staff_id ?? entry.id, index + 1),
      full_name:
        typeof entry.full_name === "string"
          ? entry.full_name
          : typeof entry.name === "string"
            ? entry.name
            : "",
      role_title: typeof entry.role_title === "string" ? entry.role_title : "",
      specialist: typeof entry.specialist === "string" ? entry.specialist : "",
      work_days: typeof entry.work_days === "string" ? entry.work_days : "",
      work_from: typeof entry.work_from === "string" ? entry.work_from : "",
      work_to: typeof entry.work_to === "string" ? entry.work_to : "",
      consultation_price: toNumber(entry.consultation_price, 0),
      photo: typeof entry.photo === "string" ? entry.photo : null,
      can_be_booked:
        typeof entry.can_be_booked === "number"
          ? entry.can_be_booked
          : entry.can_be_booked
            ? 1
            : 0,
    });
  }

  return doctors;
}

function getClinicHours(doctors: ClinicDoctor[]) {
  const withHours = doctors.find(
    (doctor) => doctor.work_from && doctor.work_to,
  );
  if (!withHours) return "";
  return `${withHours.work_from} - ${withHours.work_to}`;
}

export default function ClinicDetailsPage() {
  const params = useParams();
  const clinicId = Number(params.id);

  const [visibleDoctors, setVisibleDoctors] = useState(3);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("en");
  const [clinicProfile, setClinicProfile] = useState<ClinicProfileData | null>(
    null,
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [doctors, setDoctors] = useState<ClinicDoctor[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);

    const handleLocaleChange = (e: any) => setLocale(e.detail);
    window.addEventListener("localeChange", handleLocaleChange);
    return () => window.removeEventListener("localeChange", handleLocaleChange);
  }, []);

  useEffect(() => {
    async function loadClinicProfile() {
      if (!clinicId) {
        setClinicProfile(null);
        setDoctors([]);
        setProfileError("Clinic not found");
        return;
      }

      setProfileLoading(true);
      setProfileError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/clinic/${clinicId}/profile`,
        );
        const data = await response.json();

        if (!response.ok) {
          const message =
            data.error || data.message || "Failed to load clinic profile";
          throw new Error(message);
        }

        const unwrapped = unwrapData(data);
        const clinicSource = isRecord(unwrapped)
          ? (unwrapped.clinic ?? unwrapped.profile ?? unwrapped)
          : unwrapped;
        const doctorsSource = isRecord(unwrapped)
          ? (unwrapped.doctors ?? unwrapped.staff ?? [])
          : [];

        setClinicProfile(normalizeClinic(clinicSource, clinicId));
        setDoctors(normalizeDoctors(doctorsSource));
      } catch (error: any) {
        console.error("Clinic profile fetch error:", error);
        setProfileError(error?.message || "تعذر تحميل بيانات العيادة");
        setClinicProfile(null);
        setDoctors([]);
      } finally {
        setProfileLoading(false);
      }
    }

    loadClinicProfile();
  }, [clinicId]);

  const clinic = clinicProfile;
  const clinicSpecialties = Array.from(
    new Set(
      doctors
        .map((doctor) => doctor.specialist)
        .filter((specialty) => specialty),
    ),
  );
  const clinicHours = getClinicHours(doctors);
  const ratingValue = clinic?.average_rating ?? 0;
  const ratingCount = clinic?.total_ratings ?? 0;
  const roundedRating = Math.round(ratingValue);
  const mapSrc = clinic?.geo_location
    ? `https://maps.google.com/maps?q=${clinic.geo_location.latitude},${clinic.geo_location.longitude}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        clinic?.location || "Cairo",
      )}&z=12&output=embed`;

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === "" || doc.specialist?.includes(selectedSpecialty);
    const matchesGender = true;
    const matchesSearch =
      searchQuery === "" ||
      doc.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesGender && matchesSearch;
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto pt-32 pb-12 px-4">
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001A6E]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !clinic) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto pt-32 pb-12 px-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg text-center">
            <p>{profileError || "Clinic not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto pt-32 pb-12 px-4">
        {/* Clinic Header Section */}
        <div className="flex flex-col md:flex-row gap-12 mb-20">
          {/* Right: Image (First on mobile) */}
          <div
            className={`md:w-1/2 relative ${locale === "ar" ? "order-1 md:order-2" : "order-1"}`}
          >
            <div className="rounded-3xl overflow-hidden shadow-sm">
              <img
                src={clinic.photo}
                alt={clinic.name}
                className="w-full h-87.5 object-cover"
              />
            </div>
          </div>

          {/* Left: Info (Second on mobile) */}
          <div
            className={`flex-1 ${locale === "ar" ? "order-2 md:order-1" : "order-2"}`}
          >
            <h2 className="text-2xl font-bold mb-2 text-[#001A6E]">
              {t("clinics.aboutClinic", locale)}
            </h2>
            <p className="text-gray-400 mb-8">{clinic.name}</p>

            <h3 className="text-xl font-bold mb-6">
              {t("clinics.medicalSpecialties", locale)}
            </h3>
            <div className="flex flex-wrap gap-4 mb-12">
              {clinicSpecialties.map((spec, index) => (
                <span key={index} className="text-gray-400 text-sm">
                  {spec}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-6">{clinic.name}</h1>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-400">
                <MapPin
                  className={`w-5 h-5 ${locale === "ar" ? "ml-3" : "mr-3"}`}
                />
                <span>{clinic.location}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone
                  className={`w-5 h-5 ${locale === "ar" ? "ml-3" : "mr-3"}`}
                />
                <span dir="ltr">{clinic.phone}</span>
              </div>
              {clinicHours ? (
                <div className="flex items-center text-gray-400">
                  <Clock
                    className={`w-5 h-5 ${locale === "ar" ? "ml-3" : "mr-3"}`}
                  />
                  <span>{clinicHours}</span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {clinicSpecialties.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-600 text-xs px-4 py-1.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-300 text-xs">
              {t("clinics.fromVisitors", locale).replace(
                "{count}",
                String(ratingCount),
              )}
            </p>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-10 text-[#001A6E]">
            {t("clinics.doctors", locale)}
          </h2>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            <div className="relative min-w-50">
              <select
                className={`appearance-none w-full border border-gray-200 rounded-full ${locale === "ar" ? "px-6" : "px-10"} py-2.5 text-gray-400 text-sm focus:outline-none focus:border-[#001A6E]`}
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">{t("clinics.selectSpecialty", locale)}</option>
                {clinicSpecialties.map((spec, i) => (
                  <option key={i} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-4 h-4 absolute ${locale === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400`}
              />
            </div>

            <div className="relative min-w-37.5">
              <select
                className={`appearance-none w-full border border-gray-200 rounded-full ${locale === "ar" ? "px-6" : "px-10"} py-2.5 text-gray-400 text-sm focus:outline-none focus:border-[#001A6E]`}
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">{t("clinics.gender", locale)}</option>
                <option value="male">{t("clinics.male", locale)}</option>
                <option value="female">{t("clinics.female", locale)}</option>
              </select>
              <ChevronDown
                className={`w-4 h-4 absolute ${locale === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400`}
              />
            </div>

            <button className="bg-[#001A6E] text-white px-10 py-2.5 rounded-full flex items-center gap-2 font-bold hover:opacity-90 transition-opacity">
              <Search className="w-4 h-4" />
              {t("clinics.search", locale)}
            </button>
          </div>

          {profileLoading ? (
            <p className="text-center text-[#001A6E]">جاري تحميل الدكاترة...</p>
          ) : profileError ? (
            <p className="text-center text-red-600">{profileError}</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-center text-[#001A6E]">
              لا يوجد دكاترة متاحين في هذه العيادة حالياً
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.slice(0, visibleDoctors).map((doc) => (
                  <DoctorCard
                    key={doc.staff_id}
                    id={doc.staff_id}
                    clinicId={clinic.clinic_id}
                    name={doc.full_name}
                    specialty={doc.specialist || ""}
                    rating={0}
                    price={doc.consultation_price}
                    experience={0}
                    imageSrc={doc.photo || ""}
                  />
                ))}
              </div>

              {visibleDoctors < filteredDoctors.length && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setVisibleDoctors((prev) => prev + 3)}
                    className="flex items-center gap-2 text-[#001A6E] font-bold hover:opacity-80"
                  >
                    {t("clinics.moreDoctors", locale)}
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Location Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-10 text-[#001A6E]">
            {t("clinics.clinicLocation", locale)}
          </h2>
          <div className="rounded-3xl overflow-hidden h-96 border border-gray-100 shadow-sm relative">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-12 text-[#001A6E]">
            {t("clinics.patientReviews", locale)}
          </h2>

          {/* Overall Rating */}
          <div className="text-center mb-12">
            <div className="flex gap-1 mb-3 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < roundedRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="font-bold text-lg text-gray-800">
              {t("clinics.overallRating", locale)}
            </p>
            <p className="text-gray-400 text-sm">
              {t("clinics.fromVisitors", locale).replace(
                "{count}",
                String(ratingCount),
              )}
            </p>
          </div>

          {/* Reviews Grid */}
          {ratingCount === 0 ? (
            <p className="text-center text-gray-400">No reviews yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
