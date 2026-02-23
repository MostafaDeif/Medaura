"use client";

import { useParams } from "next/navigation";
import { MapPin, Phone, Clock, Star, Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import DoctorCard from "@/components/home/doctorCard/doctorCard";
import { allClinics } from "@/constants/clinics";
import { t } from "@/i18n";

export default function ClinicDetailsPage() {
  const params = useParams();
  const clinic =
    allClinics.find((c) => c.id === Number(params.id)) || allClinics[0];

  const [visibleDoctors, setVisibleDoctors] = useState(3);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);

    const handleLocaleChange = (e: any) => setLocale(e.detail);
    window.addEventListener("localeChange", handleLocaleChange);
    return () => window.removeEventListener("localeChange", handleLocaleChange);
  }, []);

  const filteredDoctors = clinic.doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === "" || doc.specialty.includes(selectedSpecialty);
    const matchesGender =
      selectedGender === "" || doc.gender === selectedGender;
    const matchesSearch = searchQuery === "" || doc.name.includes(searchQuery);
    return matchesSpecialty && matchesGender && matchesSearch;
  });

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
                src={clinic.image}
                alt={clinic.name}
                className="w-full h-[350px] object-cover"
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
              {clinic.specialties.map((spec, index) => (
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
                <span>{clinic.city}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone
                  className={`w-5 h-5 ${locale === "ar" ? "ml-3" : "mr-3"}`}
                />
                <span dir="ltr">{clinic.phone}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Clock
                  className={`w-5 h-5 ${locale === "ar" ? "ml-3" : "mr-3"}`}
                />
                <span>{clinic.hours}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {clinic.specialties.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-600 text-xs px-4 py-1.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-300 text-xs">
              {t("clinics.fromVisitors", locale).replace("{count}", "245")}
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
            <div className="relative min-w-[200px]">
              <select
                className={`appearance-none w-full border border-gray-200 rounded-full ${locale === "ar" ? "px-6" : "px-10"} py-2.5 text-gray-400 text-sm focus:outline-none focus:border-[#001A6E]`}
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">{t("clinics.selectSpecialty", locale)}</option>
                {clinic.specialties.map((spec, i) => (
                  <option key={i} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-4 h-4 absolute ${locale === "ar" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 pointer-events-none text-gray-400`}
              />
            </div>

            <div className="relative min-w-[150px]">
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

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.slice(0, visibleDoctors).map((doc) => (
              <DoctorCard
                key={doc.id}
                id={doc.id}
                clinicId={clinic.id}
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
                onClick={() => setVisibleDoctors((prev) => prev + 3)}
                className="flex items-center gap-2 text-[#001A6E] font-bold hover:opacity-80"
              >
                {t("clinics.moreDoctors", locale)}
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-10 text-[#001A6E]">
            {t("clinics.clinicLocation", locale)}
          </h2>
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
          <h2 className="text-2xl font-bold mb-12 text-[#001A6E]">
            {t("clinics.patientReviews", locale)}
          </h2>

          {/* Overall Rating */}
          <div className="text-center mb-12">
            <div className="flex gap-1 mb-3 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="font-bold text-lg text-gray-800">
              {t("clinics.overallRating", locale)}
            </p>
            <p className="text-gray-400 text-sm">
              {t("clinics.fromVisitors", locale).replace("{count}", "200")}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {clinic.reviews.slice(0, 4).map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="font-bold text-sm text-gray-800 mb-2">
                  {t("clinics.overallRating", locale)}
                </p>
                <p className="text-gray-600 text-xs font-medium mb-1">
                  {review.name}
                </p>
                <p className="text-gray-400 text-[11px] mb-3">{review.date}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
