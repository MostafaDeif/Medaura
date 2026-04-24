"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MoreVertical , ChevronRight , ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

type Appointment = {
  id: string;
  name: string;
  type: string;
  doctor: string;
  status: string;
  date: string;
};

type ApiListResult = {
  items: Appointment[];
  total: number;
};

const data: Appointment[] = [
  {
    id: "PT0027",
    name: "محمد احمد",
    type: "زيارة",
    doctor: "د.احمد السيد",
    status: "قريباً",
    date: "25 Jun 2026, 09:00 AM to 10:00 AM",
  },
  {
    id: "PT0027",
    name: "محمد احمد",
    type: "زيارة",
    doctor: "د.احمد السيد",
    status: "قريباً",
    date: "25 Jun 2026, 09:00 AM to 10:00 AM",
  },
  {
    id: "PT0027",
    name: "محمد احمد",
    type: "زيارة",
    doctor: "د.احمد السيد",
    status: "قريباً",
    date: "25 Jun 2026, 09:00 AM to 10:00 AM",
  },
  {
    id: "PT0027",
    name: "محمد احمد",
    type: "زيارة",
    doctor: "د.احمد السيد",
    status: "قريباً",
    date: "25 Jun 2026, 09:00 AM to 10:00 AM",
  },
  {
    id: "PT0027",
    name: "محمد احمد",
    type: "زيارة",
    doctor: "د.احمد السيد",
    status: "قريباً",
    date: "25 Jun 2026, 09:00 AM to 10:00 AM",
  },
  {
    id: "PT0027",
    name: "محمد احمد",
    type: "زيارة",
    doctor: "د.احمد السيد",
    status: "قريباً",
    date: "25 Jun 2026, 09:00 AM to 10:00 AM",
  }
  
];

export async function fetchAppointmentsFromApi(
  url = "/api/appointments",
  page = 1,
  limit = 10
): Promise<ApiListResult> {
  const q = new URL(
    url,
    typeof window !== "undefined" ? window.location.origin : "http://localhost"
  );
  q.searchParams.set("page", String(page));
  q.searchParams.set("limit", String(limit));

  const res = await fetch(q.toString());
  if (!res.ok)
    throw new Error(`Failed to fetch appointments: ${res.status}`);

  const items = await res.json();
  const totalHeader = res.headers.get("X-Total-Count");

  const total = totalHeader
    ? parseInt(totalHeader, 10)
    : Array.isArray(items)
    ? items.length
    : 0;

  return { items, total };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "قريباً":
      return "bg-purple-100 text-purple-600";
    case "مكتمل":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(data.length);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<Appointment | null>(null);
  const [editModal, setEditModal] = useState<Appointment | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const router = useRouter();

  const loadAppointments = async (pg = 1) => {
    setLoading(true);
    try {
      const res = await fetchAppointmentsFromApi(
        "/api/appointments",
        pg,
        limit
      );
      if (res && Array.isArray(res.items)) {
        setAppointments(res.items);
        setTotal(res.total ?? res.items.length);
      }
    } catch (err) {
      console.error("Error loading appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(page);
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(total / limit));

  const openMenu = (id: string) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };
    const pageSize = 15;
    const totalPages = Math.ceil(appointments.length / pageSize);
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
  const datas = useMemo(()=>{
      return data
  }, [data ])
    const paginated = datas.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-(--card-bg) rounded-2xl p-5 shadow-sm border border-(--card-border) w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-(--text-primary)">
          أحدث المواعيد
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-(--card-border)">
        <div className=" sm:block overflow-x-auto">
          <table className="w-full min-w-max text-sm text-right">

            <thead className="bg-(--hover-bg) text-center text-(--text-secondary)">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">التاريخ والوقت</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">اسم الطبيب</th>
                <th className="px-4 py-3">نوع الجلسة</th>
                <th className="px-4 py-3">اسم المريض</th>
                <th className="px-4 py-3">رقم المريض</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-(--card-border) hover:bg-(--hover-bg) transition text-center"
                >
                  <td className="px-4 py-3 text-(--text-secondary) relative">
                    <button
                      onClick={() => openMenu(item.id)}
                      className="p-1 rounded hover:bg-(--hover-bg)"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>

                  <td className="px-4 py-3 text-(--text-secondary)">
                    {item.date}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-(--text-secondary) flex items-center gap-2">
                    {item.doctor}
                    <img src={`https://i.pravatar.cc?img=${paginated.length - 1 - index}`} className=" w-9 h-9 rounded-full object-cover" alt="" />
                  </td>

                  <td className="px-4 py-3 text-(--text-secondary)">
                    {item.type}
                  </td>

                  <td className="px-4 py-3 font-medium text-(--text-primary) flex items-center gap-2">
                    {item.name}
                    <img src={`https://i.pravatar.cc/100?img=${index}`} className=" w-9 h-9 rounded-full object-cover" alt="" />
                  </td>

                  <td className="px-4 py-3 text-(--text-secondary)">
                    {item.id}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
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

        <p className="text-sm text-(--text-secondary)">
          عرض {page} -{" "} {totalPages} من أصل {data.length} مريض
        </p>
      </div>
    </div>
  );
}