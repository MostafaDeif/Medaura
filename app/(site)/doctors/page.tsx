"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseMedical,
  ChevronDown,
  Hospital,
  MapPin,
  Stethoscope,
  UserRound,
} from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  experience: number;
  imageSrc: string;
};

const doctors: Doctor[] = [
  {
    id: 1,
    name: "د. صلاح محمود",
    specialty: "استشاري جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc1.jpg",
  },
  {
    id: 2,
    name: "د. كريم محمد",
    specialty: "تخصص عيون",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc2.jpg",
  },
  {
    id: 3,
    name: "د. صلاح محمود",
    specialty: "استشاري جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc3.jpg",
  },
  {
    id: 4,
    name: "د. محمود صالح",
    specialty: "استشاري جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc1.jpg",
  },
  {
    id: 5,
    name: "د. كريم محمد",
    specialty: "استشاري جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc2.jpg",
  },
  {
    id: 6,
    name: "د. صلاح محمود",
    specialty: "استشاري جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc3.jpg",
  },
  {
    id: 7,
    name: "د. أحمد محمود",
    specialty: "استشاري جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc1.jpg",
  },
  {
    id: 8,
    name: "د. ندين عادل",
    specialty: "استشاري باطنة",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc3.jpg",
  },
  {
    id: 9,
    name: "د. عمر حسين",
    specialty: "استشاري عظام",
    rating: 4.9,
    price: 350,
    experience: 8,
    imageSrc: "/images/doc2.jpg",
  },
];

const filters = [
  { label: "الدفع", icon: <Hospital className="h-3.5 w-3.5" /> },
  { label: "اختار رسوم الاستشارة", icon: <ChevronDown className="h-3.5 w-3.5" /> },
  { label: "اختار تخصص", icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { label: "اختار محافظة", icon: <MapPin className="h-3.5 w-3.5" /> },
  { label: "النوع", icon: <UserRound className="h-3.5 w-3.5" /> },
];

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="w-full">
      <div className="flex items-start gap-5">
        <div className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-sm bg-[#edf2ff]">
          <Image
            src={doctor.imageSrc}
            alt={doctor.name}
            width={86}
            height={86}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-0 top-0 flex h-5 items-center gap-0.5 bg-[#001a8d] px-1.5 text-[11px] font-bold leading-none text-white">
            {doctor.rating}
            <span className="text-[9px] text-[#ffd84d]">★</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-2 text-right">
          <h2 className="text-[14px] font-bold leading-5 text-[#111827]">
            {doctor.name}
          </h2>
          <p className="mt-1 text-[13px] font-medium leading-5 text-[#001a6e]">
            {doctor.specialty}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 text-right">
        <div>
          <p className="text-[13px] font-medium text-[#1f2937]">سعر الجلسة</p>
          <p className="mt-2 text-[13px] font-bold text-[#001a6e]">
            {doctor.price} ج.م
          </p>
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#1f2937]">الخبرة</p>
          <p className="mt-2 text-[13px] font-bold text-[#001a6e]">
            {doctor.experience} سنوات
          </p>
        </div>
      </div>

      <Link
        href={`/clinics/1/book/${doctor.id}`}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-[5px] border border-[#001a6e] text-[19px] font-medium leading-none text-[#001a6e] transition hover:bg-[#f3f6ff]"
      >
        عرض الملف الشخصي
      </Link>
    </article>
  );
}

export default function DoctorsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-white pb-16 pt-28">
      <section className="mx-auto w-full max-w-[980px] px-4">
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
              className="flex h-7 min-w-[68px] items-center justify-center rounded-[3px] bg-[#001a6e] px-5 text-[12px] font-medium text-white"
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

        <div className="mt-24 grid grid-cols-1 gap-x-[52px] gap-y-[54px] sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[16px] font-bold text-[#001a6e] transition hover:opacity-75"
          >
            <BriefcaseMedical className="h-4 w-4" />
            المزيد من الأطباء
          </button>
        </div>
      </section>
    </main>
  );
}
