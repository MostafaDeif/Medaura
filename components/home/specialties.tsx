import React from "react";
import {
  HeartPulse,
  Bone,
  Baby,
  Brain,
  Ear,
  Eye,
  Stethoscope,
//   Tooth,
  Droplets,
  Scan,
  Syringe,
  Droplet,
} from "lucide-react";
import Link from "next/link";

type Specialty = {
  title: string;
  doctors: number;
  icon: React.ReactNode;
};

const specialties: Specialty[] = [
  { title: "عظام", doctors: 200, icon: <Bone size={28} /> },
  { title: "مخ وأعصاب", doctors: 100, icon: <Brain size={28} /> },
  { title: "طب الأطفال", doctors: 80, icon: <Baby size={28} /> },
  { title: "قلب وأوعية دموية", doctors: 120, icon: <HeartPulse size={28} /> },
  { title: "صدر وجهاز تنفسي", doctors: 200, icon: <Stethoscope size={28} /> },
  { title: "كلى", doctors: 100, icon: <Droplets size={28} /> },
  { title: "الأورام", doctors: 80, icon: <Scan size={28} /> },
  { title: "طب الأذن والأنف والحنجرة", doctors: 120, icon: <Ear size={28} /> },
//   { title: "أسنان", doctors: 200, icon: <Tooth size={28} /> },
  { title: "جلدية", doctors: 100, icon: <Droplet size={28} /> },
  { title: "نساء وتوليد", doctors: 80, icon: <Syringe size={28} /> },
  { title: "طب العيون", doctors: 120, icon: <Eye size={28} /> },
];

const Specialties = () => {
  return (
    
    <section className="py-16 bg-white">
        
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            التخصصات
          </h2>
          <p className="text-gray-500 text-sm">
            مش متأكد تختار التخصص أو تستخدم المساعد الذكي للمساعدة.
          </p>
        </div>
        <div className="mb-10 text-left">
          <Link href="/site/specialties" className="text-blue-700 text-sm hover:underline flex items-center gap-1">
            عرض الكل
          </Link>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {specialties.map((item, index) => (
            <div
              key={index}
              className="group bg-white border border-blue-200 rounded-2xl
                         shadow-sm hover:shadow-md transition-all duration-300
                         flex flex-col items-center justify-center
                         py-6 cursor-pointer"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center
                              rounded-xl border border-blue-300
                              text-blue-700 mb-4
                              group-hover:bg-blue-700 group-hover:text-white
                              transition">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>

              {/* Doctors count */}
              <p className="text-xs text-blue-700">
                {item.doctors} طبيب
              </p>
            </div>
          ))}
        </div>

        {/* Show all */}

      </div>
    </section>
  );
};

export default Specialties;
