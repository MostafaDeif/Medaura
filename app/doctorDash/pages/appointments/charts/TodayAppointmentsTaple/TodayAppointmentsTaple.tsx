"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
const data = [
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    age: 34,
    status: "قادمة",
    time: "9:30 الي 10 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0024",
    name: "بسمة احمد",
    email: "basma@example.com",
    age: 28,
    status: "مكتملة",
    time: "10 الي 10:30 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "...جارية الأن",
    time: "10:30 الي 11 ص",
    type: "متابعة",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: " متابعة",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: " متابعة",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: " متابعة",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: " متابعة",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "PT0023",
    name: "احمد السيد",
    email: "ahmed@example.com",
    age: 40,
    status: "مكتملة",
    time: "10:30 الي 11 ص",
    type: "كشف جديد",
    img: "https://i.pravatar.cc/40?img=3",
  },
];

const statusColors: any = {
  مكتملة: "bg-green-100 text-green-600",
  قادمة: "bg-purple-100 text-purple-600",
  "...جارية الأن": "bg-blue-100 text-blue-600",
};

export default function TodayAppointmentsTaple() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("الكل");
  const [page, setPage] = useState(1);

  const pageSize = 3;

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchFilter = filter === "الكل" || item.status === filter;

      return matchFilter;
    });
  }, [filter]);

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
  //  pagination
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const router = useRouter();
  return (
    <div className="bg-(--card-bg) rounded-2xl flex flex-col gap-6 border border-(--card-border) p-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Filters */}
        <div className="flex gap-2">
          {["قادمة", "مكتملة", "الكل"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition-all duration-300
        ${
          filter === f
            ? "bg-[#001A6E] text-white"
            : " bg-(--btn-bg) border border-(--input-border) text-(primary) hover:bg-(--semi-card-bg)"
        }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* header */}
        <div className="relative flex justify-center items-end flex-col gap-3">
          <h3 className="font-bold text-2xl text-(--text-primary)">
            قائمة المواعيد اليوم
          </h3>
          <span className=" text-md text-(--text-secondary)">
            عرض تفصيلي لجميع المراجعين المسجلين
          </span>
        </div>
      </div>

      {/*  Table */}
      <table className="w-full ">
        <thead className="text-(--text-primary) text-xl  ">
          <tr className="text-center ">
            <th> نوع الزيارة</th>
            <th>الحالة</th>
            <th>العمر</th>
            <th> الوقت</th>
            <th className="pb-3 text-right">المريض</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((p, i) => (
            <tr
              key={i}
              className="  text-(--text-primary) hover:bg-(--semi-card-bg)  transition text-center w-full cursor-pointer"
              onClick={() => router.push(`/patients/${p.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/patients/${p.id}`)
              }
            >
              <td>
                <span className="px-2 py-1 text-xs rounded-md bg-[#E7EDF3] text-[#001A6E]">
                  {p.type}
                </span>
              </td>
              {/* Status */}
              <td>
                <span
                  className={`px-2 py-1 text-xs rounded-md ${
                    statusColors[p.status]
                  }`}
                >
                  {p.status}
                </span>
              </td>

              <td className="">{p.age}</td>
              <td className="">{p.time}</td>

              {/* Patient */}
              <td className="py-4">
                <div className="flex items-center gap-3 justify-end">
                  <div className="text-right">
                    <p className="font-medium ">{p.name}</p>
                    <p className="text-xs text-(--text-secondary)">{p.email}</p>
                  </div>

                  <img
                    src={p.img}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*  Pagination */}

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
          عرض {page} - {totalPages} من أصل {filtered.length} مريض
        </p>
      </div>
    </div>
  );
}
