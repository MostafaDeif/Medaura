"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
const data = [
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "PT0025",
    name: "محمد احمد",
    email: "ahmed.m@example.com",
    gender: "ذكر",
    doctor: "د. إبراهيم",
    specialist: "قلب",
    department: "أنف واذن",
    img: "https://i.pravatar.cc/40?img=1",
  },
 

];

const statusColors: any = {
  نشط: "bg-green-100 text-green-600",
  "تحت العلاج": "bg-purple-100 text-purple-600",
  متعافي: "bg-blue-100 text-blue-600",
};

export default function Appointments() {
  const [page, setPage] = useState(1);

  const pageSize = 8;

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
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const router = useRouter();
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
              key={i}
              className="  text-(--text-primary) hover:bg-(--semi-card-bg)  transition text-center cursor-pointer"
              onClick={() => router.push(`/doctorDash/pages/patients/${p.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/doctorDash/pages/patients/${p.id}`)
              }
            >
              <td className="">{p.department}</td>
              <td className=""> {p.specialist} </td>
              <td className=""> {p.doctor} </td>

              <td className="">{p.gender}</td>
              <td className="">{p.id}</td>

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
          عرض {page} - {totalPages} من أصل {data.length} مريض
        </p>
      </div>
    </div>
  );
}
