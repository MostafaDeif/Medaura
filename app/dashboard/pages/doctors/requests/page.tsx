"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  XCircle,
} from "lucide-react";

type RequestStatus = "pending" | "approved" | "rejected";
type FilterStatus = "all" | RequestStatus;

type DoctorRequest = {
  id: number;
  name: string;
  specialty: string;
  city: string;
  experience: number;
  email: string;
  phone: string;
  submittedAt: string;
  licenseNumber: string;
  clinic: string;
  status: RequestStatus;
  avatar: string;
  documents: {
    title: string;
    value: string;
    verified: boolean;
  }[];
};

const initialRequests: DoctorRequest[] = [
  {
    id: 1024,
    name: "د. أحمد سمير",
    specialty: "القلب والأوعية الدموية",
    city: "القاهرة",
    experience: 11,
    email: "ahmed.samir@medaura.com",
    phone: "01024567891",
    submittedAt: "2026-04-29",
    licenseNumber: "EG-MC-45821",
    clinic: "عيادات النور التخصصية",
    status: "pending",
    avatar: "https://i.pravatar.cc/120?img=12",
    documents: [
      { title: "كارنيه النقابة", value: "صالح حتى 2028", verified: true },
      { title: "رخصة مزاولة المهنة", value: "EG-MC-45821", verified: true },
      { title: "شهادة التخصص", value: "جامعة القاهرة", verified: true },
    ],
  },
  {
    id: 1025,
    name: "د. مريم عادل",
    specialty: "الأطفال وحديثي الولادة",
    city: "الجيزة",
    experience: 7,
    email: "mariam.adel@medaura.com",
    phone: "01187654320",
    submittedAt: "2026-04-28",
    licenseNumber: "EG-MC-63790",
    clinic: "مركز الحياة الطبي",
    status: "pending",
    avatar: "https://i.pravatar.cc/120?img=47",
    documents: [
      { title: "كارنيه النقابة", value: "صالح حتى 2027", verified: true },
      { title: "رخصة مزاولة المهنة", value: "EG-MC-63790", verified: true },
      { title: "صورة البطاقة", value: "تمت المراجعة", verified: true },
    ],
  },
  {
    id: 1026,
    name: "د. كريم حاتم",
    specialty: "العظام",
    city: "الإسكندرية",
    experience: 9,
    email: "karim.hatem@medaura.com",
    phone: "01233445566",
    submittedAt: "2026-04-26",
    licenseNumber: "EG-MC-54988",
    clinic: "عيادة سبورت كير",
    status: "approved",
    avatar: "https://i.pravatar.cc/120?img=33",
    documents: [
      { title: "كارنيه النقابة", value: "صالح حتى 2029", verified: true },
      { title: "رخصة مزاولة المهنة", value: "EG-MC-54988", verified: true },
      { title: "شهادة الزمالة", value: "معتمدة", verified: true },
    ],
  },
  {
    id: 1027,
    name: "د. سارة منصور",
    specialty: "الجلدية والتجميل",
    city: "المنصورة",
    experience: 5,
    email: "sara.mansour@medaura.com",
    phone: "01555667788",
    submittedAt: "2026-04-25",
    licenseNumber: "EG-MC-71204",
    clinic: "ديرما بلس",
    status: "rejected",
    avatar: "https://i.pravatar.cc/120?img=48",
    documents: [
      { title: "كارنيه النقابة", value: "يحتاج تحديث", verified: false },
      { title: "رخصة مزاولة المهنة", value: "غير واضحة", verified: false },
      { title: "صورة البطاقة", value: "تمت المراجعة", verified: true },
    ],
  },
  {
    id: 1028,
    name: "د. يوسف فؤاد",
    specialty: "المخ والأعصاب",
    city: "طنطا",
    experience: 13,
    email: "youssef.fouad@medaura.com",
    phone: "01099887766",
    submittedAt: "2026-04-24",
    licenseNumber: "EG-MC-38416",
    clinic: "مركز الصفوة",
    status: "pending",
    avatar: "https://i.pravatar.cc/120?img=59",
    documents: [
      { title: "كارنيه النقابة", value: "صالح حتى 2028", verified: true },
      { title: "رخصة مزاولة المهنة", value: "EG-MC-38416", verified: true },
      { title: "شهادة التخصص", value: "جامعة عين شمس", verified: true },
    ],
  },
];

const statusMeta = {
  pending: {
    label: "قيد المراجعة",
    badge: "bg-[#FEF9C2] text-[#A65F00] border-[#FFF085]",
  },
  approved: {
    label: "تم التوثيق",
    badge: "bg-[#DCFCE7] text-[#008236] border-[#B9F8CF]",
  },
  rejected: {
    label: "مرفوض",
    badge: "bg-[#FFE2E2] text-[#C10007] border-[#FFC9C9]",
  },
};

const filters: { key: FilterStatus; label: string }[] = [
  { key: "pending", label: "محتاج توثيق" },
  { key: "approved", label: "موثق" },
  { key: "rejected", label: "مرفوض" },
  { key: "all", label: "الكل" },
];

export default function DoctorRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0]?.id);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 4;

  const totals = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((request) => request.status === "pending").length,
      approved: requests.filter((request) => request.status === "approved").length,
      rejected: requests.filter((request) => request.status === "rejected").length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesFilter = filter === "all" || request.status === filter;
      const matchesSearch =
        !normalizedSearch ||
        request.name.toLowerCase().includes(normalizedSearch) ||
        request.specialty.toLowerCase().includes(normalizedSearch) ||
        request.licenseNumber.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, requests, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const selectedRequest =
    requests.find((request) => request.id === selectedId) || filteredRequests[0];

  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, page]);

  const updateStatus = (id: number, status: RequestStatus) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    );
    setSelectedId(id);
  };

  const changeFilter = (nextFilter: FilterStatus) => {
    setFilter(nextFilter);
    setPage(1);
  };

  return (
    <div className="min-h-screen space-y-6 p-6" dir="rtl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#EBF2F9] px-3 py-1 text-sm font-medium text-[#1F2B6C]">
            <ShieldAlert size={16} />
            مراجعة التوثيق
          </p>
          <h1 className="text-3xl font-bold text-(--text-primary)">
            طلبات توثيق الأطباء
          </h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            راجع بيانات الطبيب والمستندات ثم وثق الحساب أو ارفض الطلب محليا.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="الكل" value={totals.all} />
          <StatCard label="قيد المراجعة" value={totals.pending} />
          <StatCard label="موثق" value={totals.approved} />
          <StatCard label="مرفوض" value={totals.rejected} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-xl border border-(--card-border) bg-(--card-bg)">
          <div className="flex flex-col gap-4 border-b border-(--card-border) p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="ابحث بالاسم أو التخصص أو رقم الترخيص"
                className="w-full rounded-lg border border-(--input-border) bg-(--input2-bg) py-2 pl-3 pr-9 text-sm outline-none transition focus:border-[#1F2B6C]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item.key}
                  onClick={() => changeFilter(item.key)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    filter === item.key
                      ? "border-[#1F2B6C] bg-[#1F2B6C] text-white"
                      : "border-(--card-border) text-(--text-secondary) hover:bg-(--hover-bg)"
                  }`}
                >
                  {item.label} ({totals[item.key]})
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-5">
            {paginatedRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => setSelectedId(request.id)}
                className={`w-full rounded-xl border p-4 text-right transition ${
                  selectedRequest?.id === request.id
                    ? "border-[#1F2B6C] bg-[#EBF2F9]"
                    : "border-(--card-border) bg-(--semi-card-bg) hover:bg-(--hover-bg)"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-(--text-primary)">
                        {request.name}
                      </h2>
                      <p className="truncate text-sm text-(--text-secondary)">
                        {request.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={request.status} />
                    <span className="rounded-full border border-(--card-border) px-3 py-1 text-xs text-(--text-secondary)">
                      #{request.id}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-(--text-secondary) sm:grid-cols-3">
                  <Info icon={<MapPin size={16} />} text={request.city} />
                  <Info
                    icon={<GraduationCap size={16} />}
                    text={`${request.experience} سنوات خبرة`}
                  />
                  <Info
                    icon={<CalendarDays size={16} />}
                    text={request.submittedAt}
                  />
                </div>
              </button>
            ))}

            {filteredRequests.length === 0 && (
              <div className="rounded-xl border border-dashed border-(--card-border) py-12 text-center text-(--text-secondary)">
                لا توجد طلبات مطابقة للبحث الحالي
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-(--card-border) p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page === 1}
                className="rounded-md border border-(--input-border) p-2 transition hover:bg-(--semi-card-bg) disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
              <span className="text-sm text-(--text-secondary)">
                صفحة {page} من {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                disabled={page === totalPages}
                className="rounded-md border border-(--input-border) p-2 transition hover:bg-(--semi-card-bg) disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <p className="text-sm text-(--text-secondary)">
              عرض {paginatedRequests.length} من {filteredRequests.length} طلب
            </p>
          </div>
        </section>

        <aside className="h-max rounded-xl border border-(--card-border) bg-(--card-bg) p-5">
          {selectedRequest && (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRequest.avatar}
                    alt={selectedRequest.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-(--text-primary)">
                      {selectedRequest.name}
                    </h2>
                    <p className="text-sm text-(--text-secondary)">
                      {selectedRequest.specialty}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selectedRequest.status} />
              </div>

              <div className="grid gap-3 rounded-xl bg-(--semi-card-bg) p-4 text-sm text-(--text-secondary)">
                <Info icon={<Stethoscope size={16} />} text={selectedRequest.clinic} />
                <Info icon={<Mail size={16} />} text={selectedRequest.email} />
                <Info icon={<Phone size={16} />} text={selectedRequest.phone} />
                <Info
                  icon={<FileCheck2 size={16} />}
                  text={`ترخيص رقم ${selectedRequest.licenseNumber}`}
                />
              </div>

              <div>
                <h3 className="mb-3 text-base font-bold text-(--text-primary)">
                  المستندات
                </h3>
                <div className="space-y-2">
                  {selectedRequest.documents.map((document) => (
                    <div
                      key={document.title}
                      className="flex items-center justify-between rounded-lg border border-(--card-border) p-3"
                    >
                      <div>
                        <p className="font-medium text-(--text-primary)">
                          {document.title}
                        </p>
                        <p className="text-xs text-(--text-secondary)">
                          {document.value}
                        </p>
                      </div>
                      {document.verified ? (
                        <BadgeCheck size={20} className="text-[#008236]" />
                      ) : (
                        <ShieldAlert size={20} className="text-[#C10007]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <button
                  onClick={() => updateStatus(selectedRequest.id, "approved")}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#00A63E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#008236]"
                >
                  <ShieldCheck size={18} />
                  توثيق الطبيب
                </button>
                <button
                  onClick={() => updateStatus(selectedRequest.id, "rejected")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#FFC9C9] px-4 py-3 text-sm font-semibold text-[#C10007] transition hover:bg-[#FFE2E2]"
                >
                  <XCircle size={18} />
                  رفض الطلب
                </button>
              </div>

              {selectedRequest.status === "approved" && (
                <div className="flex items-center gap-2 rounded-lg bg-[#DCFCE7] p-3 text-sm text-[#008236]">
                  <CheckCircle2 size={18} />
                  تم توثيق الطبيب محليا ويمكن ربطه بالـ API لاحقا.
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-(--card-border) bg-(--card-bg) px-4 py-3 text-right">
      <p className="text-xs text-(--text-secondary)">{label}</p>
      <p className="mt-1 text-2xl font-bold text-(--text-primary)">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta[status].badge}`}
    >
      {statusMeta[status].label}
    </span>
  );
}

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-[#1F2B6C]">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}
