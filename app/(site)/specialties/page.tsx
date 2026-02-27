"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Bone,
  Brain,
  ChevronDown,
  ChevronLeft,
  Droplet,
  Droplets,
  Ear,
  Eye,
  HeartPulse,
  Scan,
  Search,
  Star,
  Stethoscope,
  Syringe,
} from "lucide-react";

type Specialty = {
  key: string;
  titleAr: string;
  titleEn: string;
  count: number;
  icon: ReactNode;
};

type Doctor = {
  id: number;
  name: string;
  specialtyKey: string;
  specialtyAr: string;
  specialtyEn: string;
  rating: number;
  price: number;
  experience: number;
  imageSrc: string;
};

const specialties: Specialty[] = [
  { key: "cardio", titleAr: "قلبي و أوعية", titleEn: "Cardiology", count: 120, icon: <HeartPulse size={24} /> },
  { key: "pediatrics", titleAr: "طب الأطفال", titleEn: "Pediatrics", count: 80, icon: <Baby size={24} /> },
  { key: "neuro", titleAr: "مخ و أعصاب", titleEn: "Neurology", count: 100, icon: <Brain size={24} /> },
  { key: "ortho", titleAr: "عظام", titleEn: "Orthopedics", count: 200, icon: <Bone size={24} /> },
  { key: "pulmo", titleAr: "صدر و جهاز تنفسي", titleEn: "Pulmonology", count: 200, icon: <Stethoscope size={24} /> },
  { key: "nephro", titleAr: "كلى", titleEn: "Nephrology", count: 100, icon: <Droplets size={24} /> },
  { key: "oncology", titleAr: "الأورام", titleEn: "Oncology", count: 80, icon: <Scan size={24} /> },
  { key: "ent", titleAr: "الاذن والانف والحنجرة", titleEn: "ENT", count: 120, icon: <Ear size={24} /> },
  { key: "ophtha", titleAr: "طب العيون", titleEn: "Ophthalmology", count: 120, icon: <Eye size={24} /> },
  { key: "obgyn", titleAr: "نسا و توليد", titleEn: "OB-GYN", count: 80, icon: <Syringe size={24} /> },
  { key: "derma", titleAr: "جلدية", titleEn: "Dermatology", count: 100, icon: <Droplet size={24} /> },
];

const doctors: Doctor[] = [
  { id: 1, name: "د. صلاح محمود", specialtyKey: "cardio", specialtyAr: "استشاري جراحة القلب", specialtyEn: "Cardiac Surgery Consultant", rating: 4.9, price: 350, experience: 8, imageSrc: "/images/doc1.jpg" },
  { id: 2, name: "د. كريم محمد", specialtyKey: "cardio", specialtyAr: "استشاري جراحة القلب", specialtyEn: "Cardiac Surgery Consultant", rating: 4.9, price: 350, experience: 8, imageSrc: "/images/doc2.jpg" },
  { id: 3, name: "د. أحمد محمود", specialtyKey: "cardio", specialtyAr: "استشاري جراحة القلب", specialtyEn: "Cardiac Surgery Consultant", rating: 4.9, price: 350, experience: 8, imageSrc: "/images/doc3.jpg" },
  { id: 4, name: "أميرة صابرين", specialtyKey: "cardio", specialtyAr: "استشاري جراحة القلب", specialtyEn: "Cardiac Surgery Consultant", rating: 4.9, price: 350, experience: 8, imageSrc: "/images/doc1.jpg" },
  { id: 5, name: "د. محمود محمد", specialtyKey: "cardio", specialtyAr: "استشاري جراحة القلب", specialtyEn: "Cardiac Surgery Consultant", rating: 4.9, price: 350, experience: 8, imageSrc: "/images/doc2.jpg" },
  { id: 6, name: "د. محسن محسن", specialtyKey: "cardio", specialtyAr: "بروفيسور", specialtyEn: "Professor", rating: 4.9, price: 350, experience: 8, imageSrc: "/images/doc3.jpg" },
];

export default function SpecialtiesPage() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("cardio");
  const [locale] = useState("ar");

  const isArabic = locale === "ar";
  const heroTitle = isArabic ? "اختر تخصصك لحالتك" : "Choose Your Specialty";
  const heroSubtitle = isArabic
    ? "احجز موعدك مع أفضل الاطباء في غضون دقائق"
    : "Book your appointment with top doctors in minutes";
  const searchPlaceholder = isArabic
    ? "ابحث عن تخصصك، اسم الطبيب، المستشفى..."
    : "Search specialty, doctor name, hospital...";
  const listTitle = isArabic ? "التخصصات الطبية" : "Medical Specialties";
  const viewAll = isArabic ? "عرض الكل" : "View all";
  const availableDoctorsTitle = isArabic
    ? `الاطباء المتاحون في ${
        specialties.find((s) => s.key === selectedSpecialty)?.titleAr ?? ""
      }`
    : `Available doctors in ${
        specialties.find((s) => s.key === selectedSpecialty)?.titleEn ?? ""
      }`;
  const moreDoctorsLabel = isArabic ? "المزيد من الأطباء" : "More doctors";
  const feeLabel = isArabic ? "سعر الجلسة" : "Session fee";
  const expLabel = isArabic ? "الخبرة" : "Experience";
  const yearsLabel = isArabic ? "سنوات" : "years";
  const bookNow = isArabic ? "احجز الآن" : "Book now";
  const doctorsWord = isArabic ? "طبيب" : "doctors";

  const filteredSpecialties = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return specialties;
    return specialties.filter((item) => {
      const title = isArabic ? item.titleAr : item.titleEn;
      return title.toLowerCase().includes(q);
    });
  }, [isArabic, search]);

  const filteredDoctors = useMemo(
    () => doctors.filter((doc) => doc.specialtyKey === selectedSpecialty),
    [selectedSpecialty],
  );

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto min-h-screen w-full max-w-7xl bg-white px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-[#0f1a4f] sm:text-5xl">
          {heroTitle}
        </h1>
        <p className="mt-3 text-xl text-[#8a96b2]">{heroSubtitle}</p>

        <div className="relative mx-auto mt-8 max-w-xl">
          <Search
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#acb2bf] ${isArabic ? "right-4" : "left-4"}`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className={`h-11 w-full rounded-full border border-[#dce3f2] bg-white px-11 text-sm text-[#2d3551] shadow-[0_2px_8px_rgba(32,50,92,0.07)] outline-none transition focus:border-[#22459f] ${isArabic ? "text-right" : "text-left"}`}
          />
        </div>
      </div>

      <div className="mt-14 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#0f1a4f]">{listTitle}</h2>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1 text-lg font-semibold text-[#22459f] hover:opacity-80"
        >
          {viewAll}
          <ChevronLeft size={18} />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredSpecialties.map((item) => {
          const active = item.key === selectedSpecialty;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedSpecialty(item.key)}
              className={`rounded-xl border bg-white px-3 py-4 text-center shadow-[0_4px_10px_rgba(28,52,112,0.06)] transition ${active ? "border-[#9db1e8] bg-[#f2f6ff]" : "border-[#e6ebf5] hover:border-[#b8c7ee]"}`}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center text-[#22459f]">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f1a4f]">
                {isArabic ? item.titleAr : item.titleEn}
              </h3>
              <p className="mt-1 text-sm text-[#5a6ea8]">
                {item.count} {doctorsWord}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-[#0f1a4f]">{availableDoctorsTitle}</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <article
              key={doc.id}
              className="rounded-xl border border-[#e6ebf5] bg-white p-4 shadow-[0_4px_12px_rgba(28,52,112,0.06)]"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-bold text-[#111a3d]">
                    {doc.name}
                  </h4>
                  <p className="mt-0.5 truncate text-sm text-[#3f5c9d]">
                    {isArabic ? doc.specialtyAr : doc.specialtyEn}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#11152f]">
                    <Star className="h-4 w-4 fill-[#f4b400] text-[#f4b400]" />
                    {doc.rating}
                  </div>
                </div>
                <div className="h-16 w-16 overflow-hidden rounded-sm">
                  <Image
                    src={doc.imageSrc}
                    alt={doc.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#767c8f]">{feeLabel}</p>
                  <p className="font-semibold text-[#22459f]">
                    {isArabic ? "ج.م " : "EGP "}
                    {doc.price}
                  </p>
                </div>
                <div>
                  <p className="text-[#767c8f]">{expLabel}</p>
                  <p className="font-semibold text-[#22459f]">
                    {doc.experience} {yearsLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 h-11 w-full rounded-lg border border-[#7f99d8] text-lg font-semibold text-[#22459f] transition hover:bg-[#f2f6ff]"
              >
                {bookNow}
              </button>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-lg font-semibold text-[#0f1a4f] hover:opacity-80"
          >
            <ChevronDown size={18} />
            {moreDoctorsLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
