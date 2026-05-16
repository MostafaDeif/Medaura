"use client";

import { Hospital, Mail, Phone } from "lucide-react";

import { useState, useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

interface Clinic {
  clinic_id?: number;
  id?: number;

  name?: string;
  location?: string;

  email?: string;
  owner_email?: string;

  phone?: string;

  status?: string;

  total_staff?: number;
  total_ratings?: number;
  average_rating?: number;
}

export default function ClinicsList() {
  const router = useRouter();

  const [clinics, setClinics] = useState<Clinic[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const PER_PAGE = 8;

  useEffect(() => {
    loadClinics();
  }, []);

  async function loadClinics() {
    try {
      const res = await fetch("/api/admin/clinics", {
        credentials: "include",
      });

      const data = await res.json();

      setClinics(data.clinics || data.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(clinic: Clinic, approve: boolean) {
    const id = clinic.clinic_id;

    try {
      await fetch(
        approve
          ? `/api/admin/clinics/${id}/approve`
          : `/api/admin/clinics/${id}/reject`,
        {
          method: "PATCH",
        },
      );

      setClinics((prev) =>
        prev.map((item) =>
          item.clinic_id === id
            ? {
                ...item,

                status: approve ? "approved" : "rejected",
              }
            : item,
        ),
      );
    } catch {}
  }

  const filtered = useMemo(() => {
    return clinics.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [clinics, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * PER_PAGE,

    page * PER_PAGE,
  );

  return (
    <div className="p-8">
      {/* top */}

      <div
        className="
      flex
      justify-between
      mb-10
      "
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="
          ابحث عن طبيب...
          "
          className="
          border
          rounded-lg
          px-4 py-2
          w-60
          "
        />

        <button
          className="
          bg-[#122C88]
          text-white
          px-5 py-2
          rounded-lg
          "
        >
          طلبات الأطباء
        </button>
      </div>

      {loading && <div>loading...</div>}

      {/* cards */}

      <div
        className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
      "
      >
        {paginated.map((clinic) => {
          const verified = clinic.status === "approved";

          return (
            <div
              key={clinic.clinic_id}
              className="
border
rounded-3xl
p-6
bg-white
"
            >
              <div
                className="
flex
justify-between
mb-5
"
              >
                <div
                  className="
flex gap-2
"
                >
                  <span
                    className="
bg-gray-100
px-2 py-1
rounded-full
text-xs
"
                  >
                    #{clinic.clinic_id}
                  </span>

                  <span
                    className={`
px-3 py-1
rounded-full
text-xs

${verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
`}
                  >
                    {verified ? "مفعل" : "غير مفعل"}
                  </span>
                </div>
                ⋮
              </div>

              <div
                className="
flex
justify-center
mb-4
"
              >
                <div
                  className="
w-24 h-24
rounded-full
bg-gray-200
flex
justify-center
items-center
"
                >
                  <Hospital size={40} />
                </div>
              </div>

              <h2
                className="
text-center
text-3xl
font-bold
"
              >
                {clinic.name}
              </h2>

              <p
                className="
text-center
text-gray-500
mb-5
"
              >
                {clinic.location}
              </p>

              <div
                className="
grid
grid-cols-2
gap-2
mb-6
"
              >
                <Box title="الموظفين" value={clinic.total_staff} />

                <Box title="التقييم" value={clinic.average_rating} />

                <Box title="الحجوزات" value={clinic.total_ratings} />

                <Box title="الهاتف" value={clinic.phone} />
              </div>

              <div
                className="
space-y-2
text-center
mb-6
"
              >
                <div
                  className="
flex
justify-center
gap-2
"
                >
                  <Mail size={16} />

                  {clinic.owner_email || clinic.email}
                </div>

                <div
                  className="
flex
justify-center
gap-2
"
                >
                  <Phone size={16} />

                  {clinic.phone}
                </div>
              </div>

              <div
                className="
flex gap-2
"
              >
                <button
                  className="
flex-1
bg-[#0D2A8A]
text-white
rounded-xl
py-3
"
                >
                  تعديل المواعيد
                </button>

                <button
                  onClick={() => handleApprove(clinic, !verified)}
                  className={`
flex-1
rounded-xl
py-3

${verified ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}
`}
                >
                  {verified ? "إلغاء التفعيل" : "تفعيل"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* pagination */}

      <div
        className="
      flex
      justify-center
      gap-2
      mt-10
      "
      >
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="
          border
          px-4 py-2
          rounded-lg
          "
        >
          السابق
        </button>

        {Array.from({
          length: totalPages,
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`
w-10 h-10
rounded-lg

${page === i + 1 ? "bg-blue-900 text-white" : "border"}
`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="
border
px-4 py-2
rounded-lg
"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

function Box({ title, value }: any) {
  return (
    <div
      className="
border
rounded-xl
p-3
text-center
"
    >
      <p
        className="
font-bold
"
      >
        {title}
      </p>

      <p>{value ?? 0}</p>
    </div>
  );
}
