"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Mail,
  MoreVertical,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: number;
  image?: string;
  name?: string;
  full_name?: string;
  specialty?: string;
  specialist?: string;
  experience?: string | number;
  appointments_count?: number;
  email?: string;
  phone?: string;
};

type DoctorsResponse = {
  status?: string;
  doctors?: Doctor[];
};

function DoctorCard({ doc }: { doc: Doctor }) {
  const router = useRouter();

  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 space-y-3">
      <div className="flex justify-between items-center">
        <MoreVertical size={16} className="cursor-pointer" />

        <span className="text-xs p-1 rounded-lg bg-[#EBF2F9] text-(--text2-bg)">
          #{doc.id}
        </span>
      </div>

      <div className="text-center">
        <img
          src={doc.image || `https://i.pravatar.cc/100?u=${doc.id}`}
          className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
          alt={doc.full_name || doc.name || "Doctor"}
        />

        <h3 className="font-bold text-xl">{doc.full_name || doc.name}</h3>

        <p className="text-xs text-(--text-secondary)">
          {doc.specialty || doc.specialist}
        </p>
      </div>

      <div className="flex border border-[#E2E8F0] rounded-lg text-center text-sm">
        <div className="flex-1 py-2">
          <p className="text-(--text-primary) text-lg font-bold">الخبرة</p>
          <p className="font-medium text-(--text-secondary)">
            {doc.experience || "0"}
          </p>
        </div>

        <div className="flex-1 py-2 border-l border-[#E2E8F0]">
          <p className="text-(--text-primary) text-lg font-bold">المواعيد</p>
          <p className="font-medium text-(--text-secondary)">
            {doc.appointments_count || 0}
          </p>
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
      </div>

      <button
        onClick={() =>
          router.push(`/dashboard/pages/doctors/${doc.id}/Schedule`)
        }
        className="w-full bg-(--text2-bg) text-white py-2 cursor-pointer rounded-lg text-sm"
      >
        تعديل المواعيد
      </button>
    </div>
  );
}

export default function DoctorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch(
          "http://localhost:3001/api/admin/doctors",
          {
            credentials: "include",
          },
        );

        const result = (await response.json()) as DoctorsResponse;
        if (result.status === "success") {
          setDoctors(result.doctors || []);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

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
          <DoctorCard key={`${doc.id}-${index}`} doc={doc} />
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
