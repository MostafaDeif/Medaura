"use client";

import { ChevronLeft } from "lucide-react";
import DoctorCard from "@/components/doctorCard/doctorCard";

type Doctor = {
  name: string;
  specialty: string;
  rating: number;
  price: number;
  experience: number;
};

const bestDoctors: Doctor[] = [
  {
    name: "د. صالح محمود",
    specialty: "جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
  },
  {
    name: "د. كريم محمد",
    specialty: "جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
  },
  {
    name: "د. محمود صالح",
    specialty: "جراحة القلب",
    rating: 4.9,
    price: 350,
    experience: 8,
  },
];

export default function BestDoctors() {
  return (
    <section dir="rtl" className=" py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#001A6E] mb-2">
            الأطباء الأكثر اختياراً
          </h2>
          <p className="text-gray-500">
            متخصرو الرعاية الصحية ذوي تقييم عالي
          </p>
        </div>

        {/* View All Button */}
        <div className="flex justify-start mb-8">
          <button className="flex items-center gap-2 text-[#001A6E] font-medium hover:opacity-70 transition">
            عرض الكل
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestDoctors.map((doc, index) => (
            <DoctorCard
              key={index}
              name={doc.name}
              specialty={doc.specialty}
              rating={doc.rating}
              price={doc.price}
              experience={doc.experience}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
