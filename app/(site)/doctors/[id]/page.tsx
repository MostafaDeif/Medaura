"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Star } from "lucide-react";
import DatePicker from "@/components/booking/DatePicker";
import TimePicker from "@/components/booking/TimePicker";
import ValidationModal from "@/components/booking/ValidationModal";
import { t } from "@/i18n";

const DOCTOR_FALLBACK_IMAGE = "/images/blank-profile-picture.png";
const API_BASE_URL = "http://127.0.0.1:3001/api";

type DoctorProfileData = {
  id?: number;
  doctor_id?: number;
  full_name?: string;
  specialist?: string;
  work_days?: string;
  work_from?: string;
  work_to?: string;
  consultation_price?: number;
  photo?: string | null;
  image?: string | null;
  location?: string;
  clinic_id?: number;
  average_rating?: number;
  rating?: number;
  total_ratings?: number;
  bio?: string;
  can_be_booked?: number | boolean;
};

type BookingSlot = {
  from: string;
  to: string;
  available: boolean;
};

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null;
}

function unwrapData(data: unknown): unknown {
  if (isRecord(data) && data.data !== undefined) return unwrapData(data.data);
  return data;
}

function normalizeDoctor(data: unknown): DoctorProfileData | null {
  const unwrapped = unwrapData(data);
  if (!isRecord(unwrapped)) return null;
  return (unwrapped.doctor || unwrapped.profile || unwrapped) as DoctorProfileData;
}

function normalizeSlots(data: unknown): BookingSlot[] {
  const unwrapped = unwrapData(data);
  const slots = Array.isArray(unwrapped)
    ? unwrapped
    : isRecord(unwrapped) && Array.isArray(unwrapped.slots)
      ? unwrapped.slots
      : [];

  return slots
    .map((slot): BookingSlot => {
      const record = isRecord(slot) ? slot : {};
      const from = String(record.from || record.time || record.booking_from || "");
      return {
        from,
        to: String(record.to || ""),
        available: Boolean(record.available ?? record.is_available ?? true),
      };
    })
    .filter((slot: BookingSlot) => slot.from);
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatDisplayDate(date: string, locale: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

const DAY_INDEX_MAP: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  tues: 2,
  wed: 3,
  thu: 4,
  thur: 4,
  fri: 5,
  sat: 6,
};

function formatDayToken(token: string, locale: string) {
  const trimmed = token.trim();
  if (!trimmed) return "";

  const normalized = trimmed.toLowerCase().replace(/\.$/, "");
  const index = DAY_INDEX_MAP[normalized];

  if (index !== undefined) {
    const base = new Date("2024-01-07T00:00:00");
    base.setDate(base.getDate() + index);

    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
    }).format(base);
  }

  if (trimmed.length < 2) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function formatWorkingDays(value: string, locale: string) {
  if (!value) return "";

  const parts = value
    .split(/[,/|]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-");
        return `${formatDayToken(start, locale)} - ${formatDayToken(end, locale)}`.trim();
      }
      return formatDayToken(part, locale);
    })
    .filter(Boolean);

  return parts.join(", ");
}

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = Number(params.id);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [locale, setLocale] = useState("en");
  const [doctor, setDoctor] = useState<DoctorProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [validationModalData, setValidationModalData] = useState<{
    type: "success" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("locale");
    if (stored) setLocale(stored);

    const handleLocaleChange: EventListener = (event) => {
      setLocale((event as CustomEvent<string>).detail);
    };
    window.addEventListener("localeChange", handleLocaleChange);
    return () => window.removeEventListener("localeChange", handleLocaleChange);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!doctorId) {
        setProfileError(t("clinics.notFound", locale));
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setProfileError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/doctors/${doctorId}/profile`,
          {
            credentials: "include",
          }
        );
        const payload = await response.json();

        if (!response.ok || payload.success === false) {
          throw new Error(
            payload.error || payload.message || "Failed to load doctor profile"
          );
        }

        setDoctor(normalizeDoctor(payload));
      } catch (error: unknown) {
        console.error("Doctor profile fetch error:", error);
        setProfileError(
          getErrorMessage(error, "Failed to load doctor profile.")
        );
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, [doctorId, locale]);

  useEffect(() => {
    async function loadSlots() {
      if (!doctorId || !selectedDate) {
        setSlots([]);
        return;
      }

      setSlotsLoading(true);
      setSlotsError("");

      try {
        const params = new URLSearchParams({
          doctor_id: String(doctorId),
          booking_date: selectedDate,
        });
        const response = await fetch(`/api/book/slots?${params.toString()}`, {
          credentials: "include",
        });
        const payload = await response.json();

        if (!response.ok || payload.success === false) {
          throw new Error(
            payload.error || payload.message || "Failed to load available slots"
          );
        }

        setSlots(normalizeSlots(payload));
      } catch (error: unknown) {
        console.error("Booking slots fetch error:", error);
        setSlots([]);
        setSlotsError(
          getErrorMessage(error, "Failed to load available times.")
        );
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
  }, [doctorId, selectedDate]);

  const doctorName = doctor?.full_name || "";
  const doctorSpecialist = doctor?.specialist || "";
  const ratingValue = Number(doctor?.average_rating ?? doctor?.rating ?? 0);
  const rating = Number.isFinite(ratingValue) ? ratingValue : 0;
  const ratingCount = Number(doctor?.total_ratings ?? 0);
  const canBeBooked =
    doctor?.can_be_booked !== false && doctor?.can_be_booked !== 0;
  const doctorImage =
    doctor?.photo?.trim() ||
    doctor?.image?.trim() ||
    DOCTOR_FALLBACK_IMAGE;
  const formattedWorkingDays = useMemo(
    () => formatWorkingDays(doctor?.work_days || "", locale),
    [doctor?.work_days, locale]
  );
  const displayedDate = useMemo(
    () => formatDisplayDate(selectedDate, locale),
    [locale, selectedDate]
  );

  const openTimePicker = () => {
    if (!selectedDate) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectDateOnly.title", locale),
        message: t("booking.validation.selectDateOnly.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    setShowTimePicker(true);
  };

  const handleBookingClick = async () => {
    if (!canBeBooked) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.alreadyBooked.title", locale),
        message: "This doctor is not available for booking right now.",
      });
      setShowValidationModal(true);
      return;
    }

    if (!selectedDate && !selectedTime) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectDateTime.title", locale),
        message: t("booking.validation.selectDateTime.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    if (selectedDate && !selectedTime) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectTimeOnly.title", locale),
        message: t("booking.validation.selectTimeOnly.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    if (!selectedDate && selectedTime) {
      setValidationModalData({
        type: "warning",
        title: t("booking.validation.selectDateOnly.title", locale),
        message: t("booking.validation.selectDateOnly.message", locale),
      });
      setShowValidationModal(true);
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          booking_date: selectedDate,
          booking_from: selectedTime,
        }),
        credentials: "include",
      });
      const payload = await response.json();

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.error || payload.message || "Failed to create booking"
        );
      }

      setValidationModalData({
        type: "success",
        title: t("booking.validation.success.title", locale),
        message: t("booking.validation.success.message", locale)
          .replace("{doctorName}", doctorName)
          .replace("{date}", displayedDate || selectedDate)
          .replace("{time}", selectedTime),
      });
      setShowValidationModal(true);
      setSlots((current) =>
        current.map((slot) =>
          slot.from === selectedTime ? { ...slot, available: false } : slot
        )
      );
    } catch (error: unknown) {
      setValidationModalData({
        type: "warning",
        title: "Could not complete booking",
        message: getErrorMessage(
          error,
          "Something went wrong while creating the booking."
        ),
      });
      setShowValidationModal(true);
    } finally {
      setIsBooking(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-semibold text-[#001A6E]">Loading profile...</p>
      </div>
    );
  }

  if (profileError || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-semibold text-red-600">
          {profileError || t("clinics.notFound", locale)}
        </p>
      </div>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-white pb-16 pt-28">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#001A6E] font-bold mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowRight className="w-5 h-5" />
          {t("booking.back", locale)}
        </button>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-40 h-40 relative rounded-3xl overflow-hidden shadow-md shrink-0 bg-gray-50">
                <Image
                  src={doctorImage}
                  alt={doctorName}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-0 top-0 flex h-6 items-center gap-1 bg-[#001a8d] px-2 text-xs font-bold text-white">
                  {rating.toFixed(1)}
                  <span className="text-[10px] text-[#ffd84d]">★</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#001A6E]">
                    {doctorName}
                  </h1>
                  {formattedWorkingDays && (
                    <span className="text-xs font-semibold text-[#001A6E] bg-blue-50 px-3 py-1 rounded-full">
                      {formattedWorkingDays}
                    </span>
                  )}
                </div>

                <p className="text-gray-500 font-medium">
                  {doctorSpecialist}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {rating.toFixed(1)}
                  </span>
                  {ratingCount > 0 && (
                    <span className="text-xs text-gray-400">
                      ({ratingCount})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-400 mb-1">
                      {t("booking.sessionFee", locale)}
                    </p>
                    <p className="font-bold text-[#001A6E]">
                      {doctor.consultation_price ?? "-"} EGP
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-400 mb-1">
                      {t("booking.city", locale)}
                    </p>
                    <p className="font-bold text-[#001A6E]">
                      {doctor.location || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold text-[#001A6E] mb-4">
                {t("booking.aboutDoctor", locale)}
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                {doctor.bio || "No bio available."}
              </p>
            </section>
          </section>

          <aside className="lg:sticky lg:top-32">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#001A6E] mb-6">
                {t("booking.bookNow", locale)}
              </h2>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="flex items-center gap-2 text-sm text-gray-500 border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#001A6E]" />
                  {displayedDate || t("booking.datePlaceholder", locale)}
                </button>
                <button
                  onClick={openTimePicker}
                  className="flex items-center gap-2 text-sm text-gray-500 border border-gray-100 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Clock className="w-4 h-4 text-[#001A6E]" />
                  {selectedTime || t("booking.timePlaceholder", locale)}
                </button>
              </div>

              <button
                onClick={handleBookingClick}
                disabled={isBooking || !canBeBooked}
                className="mt-6 w-full bg-[#001A6E] text-white py-4 rounded-2xl font-bold hover:bg-[#001250] transition-colors shadow-lg shadow-blue-900/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBooking ? "Booking..." : t("booking.bookNow", locale)}
              </button>

              {(doctor.work_from || doctor.work_to) && (
                <p className="mt-4 text-xs text-gray-400">
                  {t("booking.workingHours", locale)} {doctor.work_from || ""}
                  {doctor.work_from && doctor.work_to ? " - " : ""}
                  {doctor.work_to || ""}
                </p>
              )}
            </div>
          </aside>
        </div>

        {showDatePicker && (
          <DatePicker
            selectedDate={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime("");
              setShowDatePicker(false);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        )}

        {showTimePicker && (
          <TimePicker
            slots={slots}
            loading={slotsLoading}
            error={slotsError}
            onSelect={(time) => {
              setSelectedTime(time);
              setShowTimePicker(false);
            }}
            onClose={() => setShowTimePicker(false)}
          />
        )}

        {showValidationModal && validationModalData && (
          <ValidationModal
            type={validationModalData.type}
            title={validationModalData.title}
            message={validationModalData.message}
            onClose={() => setShowValidationModal(false)}
          />
        )}
      </div>
    </main>
  );
}
