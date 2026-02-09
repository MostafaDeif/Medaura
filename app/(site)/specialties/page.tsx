"use client";

import { useState } from "react";
import { Search, Star } from "lucide-react";
import Image from "next/image";

type Specialty = {
  title: string;
  count: number;
  icon: string;
};

type Doctor = {
  name: string;
  specialty: string;
  rating: number;
  price: number;
  experience: number;
};

const specialties: Specialty[] = [
  { title: "عظام", count: 200, icon: "🦴" },
  { title: "مخ وأعصاب", count: 100, icon: "🧠" },
  { title: "طب الأطفال", count: 80, icon: "👶" },
  { title: "قلب وأوعية", count: 120, icon: "❤️" },
];

const doctors: Doctor[] = [
  {
    name: "د. أحمد محمود",
    specialty: "قلب وأوعية",
    rating: 4.9,
    price: 350,
    experience: 8,
  },
  {
    name: "د. محمد حسن",
    specialty: "قلب وأوعية",
    rating: 4.8,
    price: 300,
    experience: 6,
  },
  {
    name: "د. محمود علي",
    specialty: "عظام",
    rating: 4.7,
    price: 250,
    experience: 5,
  },
  {
    name: "د. كريم يوسف",
    specialty: "طب الأطفال",
    rating: 4.9,
    price: 200,
    experience: 7,
  },
];

export default function Specialties() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );

  const filteredSpecialties = specialties.filter((item) =>
    item.title.includes(search),
  );

  const filteredDoctors = doctors.filter(
    (doc) => doc.specialty === selectedSpecialty,
  );

  return (
    <section dir="rtl" className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#001A6E] mb-2">
            اختر تخصصك لحالتك
          </h2>
          <p className="text-gray-500">
            احجز موعدك مع أفضل الأطباء في غضون دقائق
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن تخصص..."
            className="w-full rounded-full border border-gray-200 py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#001A6E]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Specialties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {filteredSpecialties.map((item) => (
            <button
              key={item.title}
              onClick={() => setSelectedSpecialty(item.title)}
              className={`rounded-xl border p-6 text-center transition
                ${
                  selectedSpecialty === item.title
                    ? "border-[#001A6E] bg-blue-50"
                    : "hover:shadow-md"
                }`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-[#001A6E] mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.count} طبيب</p>
            </button>
          ))}
        </div>

        {/* Doctors */}
        {selectedSpecialty && (
          <div>
            <h3 className="text-xl font-bold text-[#001A6E] mb-6">
              الأطباء المتاحون في {selectedSpecialty}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredDoctors.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition"
                >
                  {/* Image */}
               <div className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-sm overflow-hidden">
  <Image
    src="/images/DOC.png"
    alt="صورة الطبيب"
    width={112}
    height={112}
    className="object-cover"
    priority
  />
</div>

                  {/* Name */}
                  <h4 className="font-semibold text-[#001A6E]">{doc.name}</h4>

                  {/* Specialty */}
                  <p className="text-sm text-gray-500 mb-2">
                    استشاري {doc.specialty}
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center items-center gap-1 text-sm mb-4">
                    <span className="text-yellow-400">★</span>
                    <span>{doc.rating}</span>
                  </div>

                  {/* Info */}
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div>
                      <p className="font-medium">سعر الجلسة</p>
                      <p>{doc.price} ج.م</p>
                    </div>

                    <div>
                      <p className="font-medium">الخبرة</p>
                      <p>{doc.experience} سنوات</p>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full border border-[#001A6E] text-[#001A6E] py-2 rounded-lg hover:bg-[#001A6E] hover:text-white transition">
                    احجز الآن
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
