"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, MoreVertical ,ChevronRight ,ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const doctorsData = Array.from({ length: 50 }).map((_, i) => ({
  id: `DR${String(i + 1).padStart(4, "0")}`,
  name: "د. أحمد محمد",
  specialty: "طبيب التخدير",
  appointments: 200,
  experience: "4+",
  email: "andrew@example.com",
  phone: "+17596425493",
  image: "https://i.pravatar.cc/100?img=" + (i + 1),
}));
function DoctorCard({ doc }: any) {
  const router = useRouter();
  return (
    <div className="bg-(--card-bg) border border-(--card-border) rounded-2xl p-6 space-y-3">

      {/* top */}
      <div className="flex justify-between items-center">

        <MoreVertical size={16} className="cursor-pointer" />

        <span className="text-xs p-1 rounded-lg bg-[#EBF2F9] text-(--text2-bg)">
          #{doc.id}
        </span>

      </div>

      {/* profile */}
      <div className="text-center">

        <img
          src={doc.image}
          className="w-20 h-20 rounded-full mx-auto mb-2"
        />

        <h3 className="font-bold text-xl">{doc.name}</h3>

        <p className="text-xs text-(--text-secondary)">
          {doc.specialty}
        </p>

      </div>

      {/* stats */}
      <div className="flex border border-[#E2E8F0] rounded-lg text-center text-sm">

        <div className="flex-1 py-2">
          <p className="text-(--text-primary) text-lg font-bold">الخبرة</p>
          <p className="font-medium text-(--text-secondary)">{doc.experience}</p>
        </div>

        <div className="flex-1 py-2 border-l border-[#E2E8F0]">
          <p className="text-(--text-primary) text-lg font-bold">المواعيد</p>
          <p className="font-medium text-(--text-secondary)">{doc.appointments}</p>
        </div>

      </div>

      {/* contact */}
      <div className="text-md text-(--text-primary) space-y-1 ">

        <div className="flex items-center gap-2 ">
          <Mail size={14} />
          <span>{doc.email}</span>
        </div>

        <div className="flex items-center gap-2 ">
          <Phone size={14} />
          <span>{doc.phone}</span>
        </div>

      </div>

      {/* button */}
      <button onClick={()=> router.push(`/dashboard/pages/doctors/${doc.id}/Schedule`)} className="w-full bg-(--text2-bg) text-white py-2 cursor-pointer rounded-lg text-sm">
        تعديل المواعيد
      </button>

    </div>
  );
}
export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 8;

  //  filter
  const filtered = useMemo(() => {
    return doctorsData.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
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
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-6 space-y-6">

      {/*  Header */}
      <div className="flex justify-between items-center">

        <button className="bg-[#1F2B6C] text-white px-4 py-2 rounded-lg text-sm">
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
          className="border rounded-lg px-3 py-2 text-sm w-60 outline-none"
        />

      </div>

      {/*  Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {paginated.map((doc) => (
          <DoctorCard key={doc.id} doc={doc} />
        ))}

      </div>

      {/*  Pagination */}
      <div className="flex justify-between items-center text-sm">



        <div className="flex gap-2">

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
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            className=" cursor-pointer text-2xl flex items-center justify-center border border-(--input-border) rounded-md p-1 hover:bg-(--semi-card-bg) transition"
          >
            <ChevronRight size={19} />
          </button>

        </div>
        <span>
          عرض {page} -{" "}
          {totalPages} أصل من{" "}
          {filtered.length}
        </span>

      </div>

    </div>
  );
}