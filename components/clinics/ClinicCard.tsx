"use client";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col border border-gray-100">

      {/* Image */}
      <div className="relative p-4">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={clinic.image}
            alt={clinic.name}
            className="w-full h-48 object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 flex flex-col flex-grow text-right" dir="rtl">

        <h3 className="text-lg font-bold mb-4 text-gray-800">
          {clinic.name}
        </h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-400 text-xs justify-start">
            <MapPin className="w-3.5 h-3.5 ml-2" />
            <span>{clinic.city}</span>
          </div>

          <div className="flex items-center text-gray-400 text-xs justify-start">
            <Phone className="w-3.5 h-3.5 ml-2" />
            <span dir="ltr">{clinic.phone}</span>
          </div>

          <div className="flex items-center text-gray-400 text-xs justify-start">
            <Clock className="w-3.5 h-3.5 ml-2" />
            <span>{clinic.hours}</span>
          </div>
        </div>

        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-2 mb-8 justify-start">
          {clinic.specialties.map((spec, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-600 text-[10px] px-3 py-1 rounded-full font-medium"
            >
              {spec}
            </span>
          ))}
        </div>

        <button
          onClick={() => router.push(`/clinics/${clinic.id}`)}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-[#001A6E] hover:text-white hover:border-[#001A6E] transition-all duration-300"
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}
