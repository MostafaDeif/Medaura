"use client";

import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Star,
  Mail,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import { allClinics } from "@/constants/clinics";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "@/components/booking/DatePicker";
import TimePicker from "@/components/booking/TimePicker";
import ValidationModal from "@/components/booking/ValidationModal";
import { t } from "@/i18n";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const clinicId = Number(params.id);
  const doctorId = Number(params.doctorId);

  const clinic = allClinics.find((c) => c.id === clinicId);
  const doctor = clinic?.doctors.find((d) => d.id === doctorId);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [locale, setLocale] = useState("en");
  const [validationModalData, setValidationModalData] = useState<{
    type: "success" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);

    const handleLocaleChange = (e: any) => setLocale(e.detail);
    window.addEventListener("localeChange", handleLocaleChange);
    return () => window.removeEventListener("localeChange", handleLocaleChange);
  }, []);

  const handleBookingClick = () => {
    // Check if already booked
    if (isBooked) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.alreadyBooked.title", locale),
        message: t("booking.validation.alreadyBooked.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    // Check if both date and time are selected
    if (!selectedDate && !selectedTime) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectDateTime.title", locale),
        message: t("booking.validation.selectDateTime.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    // Check if only date is selected
    if (selectedDate && !selectedTime) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectTimeOnly.title", locale),
        message: t("booking.validation.selectTimeOnly.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    // Check if only time is selected
    if (!selectedDate && selectedTime) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectDateOnly.title", locale),
        message: t("booking.validation.selectDateOnly.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    // Both date and time are selected - show success message
    setValidationModalData({
      type: "success",
      title: t("booking.validation.success.title", locale),
      message: t("booking.validation.success.message", locale)
        .replace("{doctorName}", doctor?.name || "")
        .replace("{date}", selectedDate)
        .replace("{time}", selectedTime),
    });
    setIsBooked(true);
    setShowValidationModal(true);
  };

  if (!clinic || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("clinics.notFound", locale)}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto pt-32 pb-12 px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#001A6E] font-bold mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowRight
            className={`w-5 h-5 ${locale === "ar" ? "" : "rotate-180"}`}
          />
          {t("booking.back", locale)}
        </button>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Doctor Details (First on mobile) */}
          <div
            className={`flex-1 space-y-12 ${locale === "ar" ? "order-1 lg:order-1" : "order-1"}`}
          >
            {/* Doctor Info Card */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-48 h-48 relative rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                <Image
                  src={doctor.imageSrc}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#001A6E]">
                    {doctor.name}
                  </h1>
                  <p className="text-gray-500 font-medium">
                    {t("specialties.doctors", locale)} {doctor.specialty}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-400 mb-1">
                      {t("booking.sessionFee", locale)}
                    </p>
                    <p className="font-bold text-[#001A6E]">
                      {doctor.price} {locale === "ar" ? "ج.م" : "EGP"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-400 mb-1">
                      {t("booking.city", locale)}
                    </p>
                    <p className="font-bold text-[#001A6E]">{clinic.city}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowDatePicker(true)}
                    className="flex items-center gap-2 text-sm text-gray-500 border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#001A6E]" />
                    {selectedDate || t("booking.datePlaceholder", locale)}
                  </button>
                  <button
                    onClick={() => setShowTimePicker(true)}
                    className="flex items-center gap-2 text-sm text-gray-500 border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-[#001A6E]" />
                    {selectedTime || t("booking.timePlaceholder", locale)}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={handleBookingClick}
                    className="flex-1 bg-[#001A6E] text-white py-4 rounded-2xl font-bold hover:bg-[#001250] transition-colors shadow-lg shadow-blue-900/10"
                  >
                    {t("booking.bookNow", locale)}
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                    <Mail className="w-5 h-5" />
                    {t("booking.sendMessage", locale)}
                  </button>
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <section>
              <h2 className="text-xl font-bold text-[#001A6E] mb-4">
                {t("booking.aboutDoctor", locale)}
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                {doctor.about ||
                  (locale === "ar"
                    ? "استشاري متخصص بخبرة واسعة في مجاله، يحرص على تقديم أفضل رعاية طبية للمرضى باستخدام أحدث التقنيات الطبية العالمية."
                    : "Specialized consultant with extensive experience in his field, keen to provide the best medical care to patients using the latest global medical technologies.")}
              </p>
            </section>
          </div>

          {/* Right Column: Clinic Info (Second on mobile) */}
          <div
            className={`lg:w-80 flex-shrink-0 ${locale === "ar" ? "order-2 lg:order-2" : "order-2"}`}
          >
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm sticky top-32">
              <h2 className="text-xl font-bold text-[#001A6E] mb-6">
                {t("booking.clinicInfo", locale)}
              </h2>

              <div className="aspect-square relative rounded-2xl overflow-hidden mb-6 shadow-inner">
                <Image
                  src={clinic.image}
                  alt={clinic.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    {clinic.name}
                  </h3>
                  <div className="flex items-start gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{clinic.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span dir="ltr">{clinic.phone}</span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">
                    {t("booking.workingHours", locale)}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {clinic.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width Centered */}
        <div className="mt-20 py-12 border-t border-b border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#001A6E] mb-4">
              {t("booking.patientReviews", locale)}
            </h2>
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="font-bold text-lg text-gray-800">
                {t("booking.overallRating", locale)}
              </p>
              <p className="text-gray-400 text-sm">
                {t("booking.fromVisitors", locale)}
              </p>
            </div>
          </div>

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
                  {t("booking.overallRating", locale)}
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

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DatePicker
            onSelect={(date) => {
              setSelectedDate(date);
              setShowDatePicker(false);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <TimePicker
            onSelect={(time) => {
              setSelectedTime(time);
              setShowTimePicker(false);
            }}
            onClose={() => setShowTimePicker(false)}
          />
        )}

        {/* Validation Modal */}
        {showValidationModal && validationModalData && (
          <ValidationModal
            type={validationModalData.type}
            title={validationModalData.title}
            message={validationModalData.message}
            onClose={() => setShowValidationModal(false)}
          />
        )}
      </div>
    </div>
  );
}
