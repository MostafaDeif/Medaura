"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";

export default function Appointments() {
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(
          "http://localhost:3001/api/admin/patients",
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (result.status === "success") {
          setPatients(result.patients || []);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const pageSize = 8;
  const totalPages = Math.ceil(patients.length / pageSize);
  const paginated = patients.slice((page - 1) * pageSize, page * pageSize);

  const getPages = () => {
    const pages: (number | string)[] = [];
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

  const router = useRouter();

  if (loading) {
    return <div className="p-6 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="bg-(--card-bg) mt-5 rounded-2xl flex flex-col gap-6 border border-(--card-border) p-4">
      {/*  Table */}
      <table className="w-full ">
        <thead className="text-(--text-primary) text-xl  ">
          <tr className="text-center ">
            <th>القسم</th>
            <th>التخصص</th>
            <th>الطبيب</th>
            <th>النوع</th>
            <th>رقم الزيارة</th>
            <th className="pb-3 text-right">جميع المرضى</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((p, i) => (
            <tr
              key={p.id}
              className="  text-(--text-primary) hover:bg-(--semi-card-bg)  transition text-center cursor-pointer"
              onClick={() => router.push(`/doctorDash/pages/patients/${p.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                router.push(`/doctorDash/pages/patients/${p.id}`)
              }
            >
              <td className="">{p.department || "عام"}</td>
              <td className=""> {p.specialist || "غير محدد"} </td>
              <td className=""> {p.doctor || "غير محدد"} </td>

              <td className="">{p.gender || "غير محدد"}</td>
              <td className="">{p.id}</td>

              {/* Patient */}
              <td className="py-4">
                <div className="flex items-center gap-3 justify-end">
                  <div className="text-right">
                    <p className="font-medium ">{p.name || p.full_name}</p>
                    <p className="text-xs text-(--text-secondary)">{p.email}</p>
                  </div>

                  <img
                    src={p.img || `https://i.pravatar.cc/40?u=${p.id}`}
                    className="w-9 h-9 rounded-full object-cover"
                    alt=""
                  />
                </div>
              </td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-(--text-secondary)"
              >
                لا يوجد مرضى حالياً
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/*  Pagination */}
      {patients.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className=" cursor-pointer text-2xl flex items-center justify-center border border-(--input-border) rounded-md p-1 hover:bg-(--semi-card-bg) transition"
            >
              <ChevronLeft size={19} />
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
              className=" cursor-pointer text-2xl flex items-center justify-center border border-(--input-border) rounded-md p-1 hover:bg-(--semi-card-bg) transition"
            >
              <ChevronRight size={19} />
            </button>
          </div>
          <p className="text-(--text-secondary)">
            عرض {page} - {totalPages} من أصل {patients.length} مريض
          </p>
        </div>
      )}
    </div>
  );
}
