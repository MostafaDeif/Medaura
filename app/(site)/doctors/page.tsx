"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Hospital,
  MapPin,
  Stethoscope,
  UserRound,
} from "lucide-react";
import type { DoctorProfile } from "@/lib/types/api";

const API_BASE_URL = "http://localhost:3001/api";
const DOCTORS_API_URL = `${API_BASE_URL}/doctors`;
const DOCTOR_FALLBACK_IMAGE = "/images/blank-profile-picture.png";

type DoctorWithClinic = DoctorProfile & {
  clinic_id?: number;
  photo?: string;
  image?: string;
  email?: string;
};

const filters = [
  { label: "الدفع", icon: <Hospital className="h-3.5 w-3.5" /> },
  { label: "اختر رسوم الاستشارة", icon: <ChevronDown className="h-3.5 w-3.5" /> },
  { label: "اختر تخصص", icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { label: "اختر محافظة", icon: <MapPin className="h-3.5 w-3.5" /> },
  { label: "النوع", icon: <UserRound className="h-3.5 w-3.5" /> },
];

function getDoctorImage(doctor: DoctorWithClinic) {
  return doctor.photo?.trim() || doctor.image?.trim() || DOCTOR_FALLBACK_IMAGE;
}

async function getDoctors(specialist?: string) {
  try {
    let url = DOCTORS_API_URL;

    if (specialist) {
      url += `?specialist=${encodeURIComponent(specialist)}`;
    }

    const response = await fetch(url);
    const data = (await response.json()) as {
      doctors?: DoctorWithClinic[];
    };

    console.log("API:", data);

    return data.doctors || [];
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
}

function DoctorCard({ doctor }: { doctor: DoctorWithClinic }) {
  const clinicId = doctor.clinic_id ?? 1;
  const rating = doctor.rating ?? 0;

  return (
    <article className="w-full">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0 overflow-hidden rounded-sm bg-[#edf2ff]" style={{ height: 86, width: 86 }}>
          <Image
            src={getDoctorImage(doctor)}
            alt={doctor.full_name}
            width={86}
            height={86}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-0 top-0 flex h-5 items-center gap-0.5 bg-[#001a8d] px-1.5 text-[11px] font-bold leading-none text-white">
            {rating.toFixed(1)}
            <span className="text-[9px] text-[#ffd84d]">★</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-2 text-right">
          <h2 className="text-[14px] font-bold leading-5 text-[#111827]">
            {doctor.full_name}
          </h2>
          <p className="mt-1 text-[13px] font-medium leading-5 text-[#001a6e]">
            {doctor.specialist}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 text-right">
        <div>
          <p className="text-[13px] font-medium text-[#1f2937]">سعر الجلسة</p>
          <p className="mt-2 text-[13px] font-bold text-[#001a6e]">
            {doctor.consultation_price} ج.م
          </p>
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#1f2937]">مواعيد العمل</p>
          <p className="mt-2 text-[13px] font-bold text-[#001a6e]">
            {doctor.work_from} - {doctor.work_to}
          </p>
        </div>
      </div>

      <Link
        href={`/clinics/${clinicId}/book/${doctor.id}`}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-[5px] border border-[#001a6e] text-[19px] font-medium leading-none text-[#001a6e] transition hover:bg-[#f3f6ff]"
      >
        عرض الملف الشخصي
      </Link>
    </article>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorWithClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        setError("");

        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-white pb-16 pt-28">
      <section className="mx-auto w-full max-w-245 px-4">
        <header className="text-center">
          <h1 className="text-[32px] font-bold leading-tight text-[#111827] sm:text-[40px]">
            الأطباء الأكثر حجزا في التخصصات
          </h1>
          <p className="mt-2 text-[16px] font-medium text-[#8b93a5]">
            محترفو الرعاية الصحية ذوي تقييم عال
          </p>
        </header>

        <div className="mt-24 rounded-[5px] bg-white px-2.5 py-1.5 shadow-[0_3px_5px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="flex h-7 min-w-17 items-center justify-center rounded-[3px] bg-[#001a6e] px-5 text-[12px] font-medium text-white"
            >
              ابحث
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#001a6e]">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold leading-none"
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <p className="mt-24 text-center text-[16px] font-semibold text-[#001a6e]">
            جاري تحميل الأطباء...
          </p>
        )}

        {!loading && error && (
          <p className="mt-24 text-center text-[16px] font-semibold text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && doctors.length === 0 && (
          <p className="mt-24 text-center text-[16px] font-semibold text-[#001a6e]">
            لا يوجد أطباء متاحون حاليا
          </p>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="mt-24 grid grid-cols-1 gap-x-13 gap-y-13.5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
