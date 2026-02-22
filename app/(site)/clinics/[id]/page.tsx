"use client";

import { useParams } from "next/navigation";
import { MapPin, Phone, Clock, Star, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import DoctorCard from "@/components/home/doctorCard/doctorCard";
import { allClinics } from "@/constants/clinics";

export default function ClinicDetailsPage() {
  const params = useParams();
  const clinic = allClinics.find((c) => c.id === Number(params.id)) || allClinics[0];

  const [visibleDoctors, setVisibleDoctors] = useState(3);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = clinic.doctors.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === "" || doc.specialty.includes(selectedSpecialty);
    const matchesGender = selectedGender === "" || doc.gender === selectedGender;
    const matchesSearch = searchQuery === "" || doc.name.includes(searchQuery);
    return matchesSpecialty && matchesGender && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto pt-32 pb-12 px-4">
        
        {/* Clinic Header Section */}
        {/* Use flex-col-reverse on mobile to put the image (which is the second div) on top, 
            but wait, the user wants the image first. In a flex-col, it's the first div. 
            The current order is: Info (Left), Image (Right).
            On mobile (flex-col), Info is first, then Image.
            User wants: Image first, then Info.
            So we use flex-col-reverse on mobile.
        */}
        <div className="flex flex-col-reverse md:flex-row gap-12 mb-20">
          {/* Left: Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-[#001A6E]">عن العيادة</h2>
            <p className="text-gray-400 mb-8">{clinic.name}</p>
            
            <h3 className="text-xl font-bold mb-6">التخصصات الطبية</h3>
            <div className="flex flex-wrap gap-4 mb-12">
              {clinic.specialties.map((spec, index) => (
                <span key={index} className="text-gray-400 text-sm">{spec}</span>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-6">{clinic.name}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 ml-3" />
                <span>{clinic.city}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 ml-3" />
                <span dir="ltr">{clinic.phone}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="w-5 h-5 ml-3" />
                <span>{clinic.hours}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {clinic.specialties.map((tag, i) => (
                <span key={i} className="bg-blue-50 text-blue-600 text-xs px-4 py-1.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-300 text-xs">(٢٤٥ تقييم)</p>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden shadow-sm">
              <img
                src={clinic.image}
                alt={clinic.name}
                className="w-full h-[350px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-10 text-[#001A6E]">الأطباء</h2>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            <div className="relative min-w-[200px]">
              <select 
                className="appearance-none w-full border border-gray-200 rounded-full px-6 py-2.5 text-gray-400 text-sm focus:outline-none focus:border-[#001A6E]"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">اختر التخصص</option>
                {clinic.specialties.map((spec, i) => (
                  <option key={i} value={spec}>{spec}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            <div className="relative min-w-[150px]">
              <select 
                className="appearance-none w-full border border-gray-200 rounded-full px-6 py-2.5 text-gray-400 text-sm focus:outline-none focus:border-[#001A6E]"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">النوع</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            <button className="bg-[#001A6E] text-white px-10 py-2.5 rounded-full flex items-center gap-2 font-bold hover:opacity-90 transition-opacity">
              <Search className="w-4 h-4" />
              ابحث
            </button>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.slice(0, visibleDoctors).map((doc) => (
              <DoctorCard 
                key={doc.id}
                name={doc.name}
                specialty={doc.specialty}
                rating={doc.rating}
                price={doc.price}
                experience={doc.experience}
                imageSrc={doc.imageSrc}
              />
            ))}
          </div>

          {visibleDoctors < filteredDoctors.length && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={() => setVisibleDoctors(prev => prev + 3)}
                className="flex items-center gap-2 text-[#001A6E] font-bold hover:opacity-80"
              >
                المزيد من الأطباء
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-10 text-[#001A6E]">موقع العيادة</h2>
          <div className="rounded-3xl overflow-hidden h-[400px] border border-gray-100 shadow-sm relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.1594251121!2d31.2357116!3d30.0444196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c611843949%3A0x63346f0474665f80!2sCairo%20Opera%20House!5e0!3m2!1sen!2seg!4v1708612345678!5m2!1sen!2seg" 
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
          <h2 className="text-2xl font-bold mb-12 text-[#001A6E]">تقييمات المرضى</h2>
          
          {/* Overall Rating */}
          <div className="flex flex-col items-center mb-16">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="font-bold text-lg mb-1">التقييم العام</p>
            <p className="text-gray-400 text-sm">من 200 زائر للدكتور</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {clinic.reviews.map((review) => (
              <div key={review.id} className="flex flex-col items-center text-center p-6 rounded-3xl border border-gray-50 bg-gray-50/30">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="font-bold text-sm mb-4">التقييم العام</p>
                <p className="text-gray-400 text-xs leading-relaxed mb-1">
                  {review.name}
                </p>
                <p className="text-gray-400 text-[10px]">
                  {review.date}
                </p>
                <p className="mt-4 text-gray-600 text-sm">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
