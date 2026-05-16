"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Check,
  X,
  Mail,
  MoreVertical,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Doctor = {
  id?: number;
  doctor_id?: number;
  user_id?: number;
  image?: string;
  photo?: string;
  name?: string;
  full_name?: string;
  specialty?: string;
  specialist?: string;
  gender?: string | null;
  years_of_experience?: number | string | null;
  bio?: string | null;
  consultation_price?: number | null;
  work_from?: string | null;
  work_to?: string | null;
  work_days?: string | null;
  location?: string | null;
  verified?: boolean;
  is_verified?: boolean | number | string;
  is_active?: boolean | number | string;
  total_bookings?: number | null;
  total_patients?: number | null;
  total_ratings?: number | null;
  average_rating?: number | null;
  email?: string;
  phone?: string;
};

type DoctorsResponse = {
  status?: string;
  success?: boolean;
  doctors?: Doctor[];
  data?: Doctor[];
};

const DOCTOR_FALLBACK_IMAGE = "/images/blank-profile-picture.png";

function getDoctorId(doctor: Doctor) {
  return doctor.doctor_id || doctor.id || 0;
}

function getDoctorVerified(doctor: Doctor) {
  const raw = doctor.verified ?? doctor.is_verified;

  if (typeof raw === "boolean") return raw;
  if (typeof raw === "number") return raw === 1;
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}

function normalizeDoctor(doctor: Doctor): Doctor {
  return {
    ...doctor,
    id: getDoctorId(doctor),
    verified: getDoctorVerified(doctor),
  };
}

function normalizeDoctors(list: Doctor[]) {
  return list.map(normalizeDoctor);
}

function DoctorCard({
  doc,
  onToggleVerify,
  loadingId,
}: {
  doc: Doctor;
  onToggleVerify: (doctor: Doctor, verify: boolean) => void;
  loadingId: number | null;
}) {
  const router = useRouter();
  const id = getDoctorId(doc);
  const verified = Boolean(doc.verified);
  const workHours = doc.work_from && doc.work_to
    ? `${doc.work_from} - ${doc.work_to}`
    : "";

  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 space-y-3">
      <div className="flex justify-between items-center">
        <MoreVertical size={16} className="cursor-pointer" />

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              verified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {verified ? "مفعل" : "غير مفعل"}
          </span>
          <span className="text-xs p-1 rounded-lg bg-[#EBF2F9] text-(--text2-bg)">
            #{id}
          </span>
        </div>
      </div>

      <div className="text-center">
        <img
          src={doc.photo?.trim() || doc.image?.trim() || DOCTOR_FALLBACK_IMAGE}
          className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
          alt={doc.full_name || doc.name || "Doctor"}
        />

        <h3 className="font-bold text-xl">{doc.full_name || doc.name}</h3>

        <p className="text-xs text-(--text-secondary)">
          {doc.specialty || doc.specialist}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-(--text-secondary)">
        <div className="rounded-lg border border-[#E2E8F0] px-3 py-2">
          <p className="text-(--text-primary) font-bold">الخبرة</p>
          <p>{doc.years_of_experience ?? 0}</p>
        </div>
        <div className="rounded-lg border border-[#E2E8F0] px-3 py-2">
          <p className="text-(--text-primary) font-bold">سعر الكشف</p>
          <p>{doc.consultation_price ?? 0} ج.م</p>
        </div>
        <div className="rounded-lg border border-[#E2E8F0] px-3 py-2">
          <p className="text-(--text-primary) font-bold">مواعيد العمل</p>
          <p>{workHours || "غير محدد"}</p>
        </div>
        <div className="rounded-lg border border-[#E2E8F0] px-3 py-2">
          <p className="text-(--text-primary) font-bold">أيام العمل</p>
          <p>{doc.work_days || "غير محدد"}</p>
        </div>
      </div>

      <div className="text-md text-(--text-primary) space-y-1">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          <span className="truncate">{doc.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={14} />
          <span>{doc.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
          <span>الحجوزات: {doc.total_bookings ?? 0}</span>
          <span>المرضى: {doc.total_patients ?? 0}</span>
          <span>التقييم: {doc.average_rating ?? 0}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggleVerify(doc, !verified)}
          disabled={loadingId === id || !id}
          className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
            verified
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          } disabled:opacity-50`}
        >
          {verified ? "إلغاء التفعيل" : "تفعيل"}
        </button>
        <button
          onClick={() => router.push(`/dashboard/pages/doctors/${id}/Schedule`)}
          disabled={!id}
          className="flex-1 bg-(--text2-bg) text-white py-2 cursor-pointer rounded-lg text-sm disabled:opacity-50"
        >
          تعديل المواعيد
        </button>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/doctors", {
        credentials: "include",
      });

      const result = (await response.json()) as DoctorsResponse;
      if (result.status === "success" || result.success) {
        const list = result.doctors || result.data || [];
        setDoctors(normalizeDoctors(list));
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDoctors();
  }, [fetchDoctors]);

  const handleVerify = useCallback(async (doctor: Doctor, verify: boolean) => {
    const id = getDoctorId(doctor);
    if (!id) return;
    if (verify && doctor.verified) return;

    setLoadingId(id);
    try {
      const endpoint = verify
        ? `/api/admin/${id}/verify`
        : `/api/admin/${id}/unverify`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setDoctors((prev) =>
          prev.map((item) =>
            getDoctorId(item) === id
              ? { ...item, verified: verify }
              : item
          )
        );
        window.dispatchEvent(new Event("admin:doctors-updated"));
      }
    } catch (error) {
      console.error("Failed to update doctor verification:", error);
    } finally {
      setLoadingId(null);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      void fetchDoctors();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchDoctors();
      }
    };

    window.addEventListener("admin:doctors-updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("admin:doctors-updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchDoctors]);

  const perPage = 8;

  const filtered = useMemo(() => {
    return doctors.filter((d) =>
      (d.full_name || d.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, doctors]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const getPages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 2) {
      return [1, 2, 3, ...(totalPages > 3 ? ["..."] : [])];
    }
    if (page >= totalPages - 1) {
      return [
        ...(totalPages > 3 ? ["..."] : []),
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return ["...", page - 1, page, page + 1, "..."];
  };

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  if (loading) {
    return <div className="p-6 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => router.push("/dashboard/pages/doctors/requests")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F2B6C] px-4 py-2 text-sm text-white transition-colors hover:bg-[#182257] sm:w-auto"
        >
          <ClipboardCheck size={16} />
          طلبات الأطباء
        </button>

        <input
          type="text"
          placeholder="ابحث عن طبيب..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-60 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginated.map((doc, index) => (
          <DoctorCard
            key={`${getDoctorId(doc) || "doctor"}-${index}`}
            doc={doc}
            onToggleVerify={handleVerify}
            loadingId={loadingId}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-(--text-secondary)">
            لا يوجد أطباء حاليا
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="cursor-pointer text-2xl flex items-center justify-center border border-(--input-border) rounded-md p-1 hover:bg-(--semi-card-bg) transition"
            >
              <ChevronRight size={19} />
            </button>

            {getPages().map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === "number" && setPage(p)}
                disabled={p === "..."}
                className={`px-2 py-1 rounded cursor-pointer ${
                  p === page
                    ? "bg-[#1F2B6C] text-white"
                    : p === "..."
                      ? "cursor-default text-gray-400"
                      : "border border-(--input-border) hover:bg-(--semi-card-bg)"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="cursor-pointer text-2xl flex items-center justify-center border border-(--input-border) rounded-md p-1 hover:bg-(--semi-card-bg) transition"
            >
              <ChevronLeft size={19} />
            </button>
          </div>
          <span>
            عرض {page} - {totalPages} من أصل {filtered.length}
          </span>
        </div>
      )}
    </div>
  );
}
