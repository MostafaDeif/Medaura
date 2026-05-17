"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import EditProfileForm, { DoctorEditableProfile } from "./EditProfileForm";

const GeoLocationMap = dynamic(() => import("./GeoLocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-80 items-center justify-center rounded-lg border border-(--card-border) bg-(--semi-card-bg) text-sm text-(--text-secondary)">
      Loading map...
    </div>
  ),
});

type DoctorProfileData = {
  photo?: string | null;
  full_name?: string | null;
  phone?: string | null;
  gender?: string | null;
  bio?: string | null;
  location?: string | null;
  specialist?: string | null;
  work_days?: string | null;
  work_from?: string | null;
  work_to?: string | null;
  consultation_price?: number | string | null;
  years_of_experience?: number | string | null;
  total_ratings?: number | string | null;
  average_rating?: number | string | null;
  is_verified?: boolean | null;
  geo_location?: {
    latitude?: number | string | null;
    longitude?: number | string | null;
  } | null;
};

const DAY_LABELS: Record<string, string> = {
  sun: "الأحد",
  mon: "الاثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
  sat: "السبت",
};

const DEFAULT_GEO_LOCATION = {
  latitude: 30.0444,
  longitude: 31.2357,
};

function valueOrDash(value: unknown) {
  return value === undefined || value === null || value === "" ? "-" : String(value);
}

function toNumberOrEmpty(value: unknown) {
  if (value === undefined || value === null || value === "") return "";
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : "";
}

function formatWorkDays(workDays?: string | null) {
  if (!workDays) return "-";

  return workDays
    .split(",")
    .map((day) => DAY_LABELS[day.trim()] || day.trim())
    .filter(Boolean)
    .join(", ");
}

function formatTimeToAmPm(value?: string | null) {
  if (!value) return "-";
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  if (!Number.isFinite(hour) || !minuteText) return value;
  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minuteText.padStart(2, "0")} ${period}`;
}

function buildInitialData(profile: DoctorProfileData): DoctorEditableProfile {
  return {
    photo: profile.photo || null,
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    gender: profile.gender || "",
    years_of_experience: toNumberOrEmpty(profile.years_of_experience),
    bio: profile.bio || "",
    work_days: profile.work_days || "",
    work_from: profile.work_from || "",
    work_to: profile.work_to || "",
    consultation_price: toNumberOrEmpty(profile.consultation_price),
    location: profile.location || "",
    geo_location: {
      latitude: toNumberOrEmpty(profile.geo_location?.latitude),
      longitude: toNumberOrEmpty(profile.geo_location?.longitude),
    },
  };
}

export default function DoctorSettingsPage() {
  const { user, loading, updateUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileOverride, setProfileOverride] =
    useState<DoctorProfileData | null>(null);
  const userPhoto =
    user && "photo" in user && typeof user.photo === "string"
      ? user.photo
      : null;
  const profileData = {
    ...((user?.profile as DoctorProfileData | undefined) || {}),
    photo: userPhoto,
    ...(profileOverride || {}),
  };
  const mapLatitude = toNumberOrEmpty(profileData.geo_location?.latitude);
  const mapLongitude = toNumberOrEmpty(profileData.geo_location?.longitude);
  const resolvedLatitude =
    mapLatitude === "" ? DEFAULT_GEO_LOCATION.latitude : mapLatitude;
  const resolvedLongitude =
    mapLongitude === "" ? DEFAULT_GEO_LOCATION.longitude : mapLongitude;

  const initials = useMemo(() => {
    const name = profileData.full_name?.trim();
    if (!name) return "";
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
  }, [profileData.full_name]);

  const handleEditSuccess = (updatedProfile: Record<string, unknown>) => {
    const profileUpdate = updatedProfile as DoctorProfileData;

    setProfileOverride((prev) => ({
      ...(prev || profileData),
      ...profileUpdate,
    }));

    if (updateUser && user) {
      const mergedProfile = {
        ...((user.profile as DoctorProfileData) || {}),
        ...profileUpdate,
      };
      updateUser({
        ...user,
        profile: mergedProfile,
        ...(typeof profileUpdate.photo === "string"
          ? { photo: profileUpdate.photo }
          : {}),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-(--text-secondary)">
        جاري تحميل بياناتك...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 space-y-4" dir="rtl">
      {isEditOpen && (
        <EditProfileForm
          onClose={() => setIsEditOpen(false)}
          initialData={buildInitialData(profileData)}
          onSuccess={handleEditSuccess}
        />
      )}

      <div className="w-11/12 rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-blue-50 text-4xl font-bold text-blue-700 lg:h-44 lg:w-44">
              {profileData.photo ? (
                <img
                  src={profileData.photo}
                  alt={profileData.full_name || "Doctor"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials || <User size={48} />
              )}
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-semibold text-(--text-primary)">
                {valueOrDash(profileData.full_name)}
              </h2>
              <p className="text-xl text-(--text-secondary)">
                {valueOrDash(profileData.specialist)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex w-fit items-center gap-2 text-xl text-(--text-primary) transition hover:text-blue-500"
          >
            <Pencil size={16} />
            تعديل الملف الشخصي
          </button>
        </div>

        <div className="mt-5 grid gap-5 border-t border-(--card-border) pt-5 md:grid-cols-3">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              <Star size={25} fill="gold" className="text-yellow-400" />
              <span className="text-[24px] font-semibold">
                {valueOrDash(profileData.average_rating)}
              </span>
            </div>
            <span className="text-[20px] text-gray-500">
              {valueOrDash(profileData.total_ratings)} تقييم
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-4">
              <User size={25} className="text-green-600" />
              <span className="text-[24px] font-medium">الخبرة</span>
            </div>
            <span className="text-[20px] text-gray-500">
              {valueOrDash(profileData.years_of_experience)}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-4">
              <BadgeCheck size={25} className="text-blue-600" />
              <span className="text-[24px] font-medium">التوثيق</span>
            </div>
            <span className="text-[20px] text-gray-500">
              {profileData.is_verified ? "موثق" : "غير موثق"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid w-11/12 gap-6 lg:grid-cols-3 xl:gap-24">
        <div className="h-fit rounded-2xl border border-(--card-border) bg-(--card-bg) p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-right text-2xl font-bold text-(--text-primary)">
            ساعات العمل
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex flex-col justify-between gap-2 text-xl font-semibold text-(--text-primary) sm:flex-row">
              <span>{formatWorkDays(profileData.work_days)}</span>
              <span>
                {formatTimeToAmPm(profileData.work_from)} -{" "}
                {formatTimeToAmPm(profileData.work_to)}
              </span>
            </div>

            <div className="flex flex-col justify-between gap-2 text-xl font-semibold text-(--text-primary) sm:flex-row">
              <span>الموقع الجغرافي</span>
              <span className="text-sm text-gray-500">
                سعر الكشف: {valueOrDash(profileData.consultation_price)}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-(--card-border)">
              <GeoLocationMap
                latitude={resolvedLatitude}
                longitude={resolvedLongitude}
                onChange={() => {}}
              />
            </div>

            <div className="text-sm leading-6 text-gray-500">
              {valueOrDash(profileData.bio)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) p-8 shadow-sm">
          <h3 className="mb-8 text-right text-2xl font-bold text-(--text-primary)">
            المعلومات الشخصية
          </h3>

          <div className="flex flex-col items-end gap-7 text-sm">
            <div className="flex flex-col items-end gap-3 text-xl text-(--text-primary)">
              <div className="flex items-center gap-2 font-bold">
                <span>البريد الإلكتروني</span>
                <Mail size={20} />
              </div>
              <span className="break-all text-(--text-secondary)">
                {valueOrDash(user?.email)}
              </span>
            </div>

            <div className="flex flex-col items-end gap-3 text-xl text-(--text-primary)">
              <div className="flex items-center gap-2 font-bold">
                <span>رقم الهاتف</span>
                <Phone size={20} />
              </div>
              <span className="text-(--text-secondary)">
                {valueOrDash(profileData.phone)}
              </span>
            </div>

            <div className="flex flex-col items-end gap-3 text-xl text-(--text-primary)">
              <div className="flex items-end gap-2 font-bold">
                <span>العنوان</span>
                <MapPin size={20} />
              </div>
              <span className="text-(--text-secondary)">
                {valueOrDash(profileData.location)}
              </span>
            </div>

            <div className="flex flex-col items-end gap-3 text-xl text-(--text-primary)">
              <div className="flex items-center gap-2 font-bold">
                <span>Gender</span>
                <User size={20} />
              </div>
              <span className="text-(--text-secondary)">
                {valueOrDash(profileData.gender)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
